const http = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || 3001;

// In-memory room storage
// roomId -> { gameId, currentPromptIndex, isFlipped, players: [], answers: {}, lastReaction: null }
const rooms = {};

// Sockets and mapping tracking
const sockets = {};       // socketId -> TCP socket
const socketToUser = {};  // socketId -> userId
const socketToRoom = {};  // socketId -> roomId

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end('PairPlay Native Realtime Server');
});

// WebSocket Protocol Helper Functions
function decodeFrame(buffer) {
  if (buffer.length < 2) return null;
  const firstByte = buffer[0];
  const opcode = firstByte & 0x0f;
  
  if (opcode === 8) return { type: 'close' }; // Client closed connection
  
  const secondByte = buffer[1];
  const isMasked = (secondByte & 0x80) !== 0;
  let payloadLen = secondByte & 0x7f;
  
  let offset = 2;
  if (payloadLen === 126) {
    if (buffer.length < 4) return null;
    payloadLen = buffer.readUInt16BE(2);
    offset = 4;
  } else if (payloadLen === 127) {
    return null; // Extremely large payload, not supported/needed
  }
  
  if (buffer.length < offset + (isMasked ? 4 : 0) + payloadLen) return null;
  
  let maskKey;
  if (isMasked) {
    maskKey = buffer.slice(offset, offset + 4);
    offset += 4;
  }
  
  const payload = Buffer.alloc(payloadLen);
  for (let i = 0; i < payloadLen; i++) {
    payload[i] = isMasked 
      ? buffer[offset + i] ^ maskKey[i % 4] 
      : buffer[offset + i];
  }
  
  return { type: 'text', data: payload.toString('utf8') };
}

function encodeFrame(text) {
  const payload = Buffer.from(text, 'utf8');
  const len = payload.length;
  let header;
  
  if (len <= 125) {
    header = Buffer.alloc(2);
    header[0] = 0x81;
    header[1] = len;
  } else if (len <= 65535) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  
  return Buffer.concat([header, payload]);
}

function sendTo(socketId, event, data) {
  const sock = sockets[socketId];
  if (sock && !sock.destroyed) {
    const frame = encodeFrame(JSON.stringify({ event, data }));
    if (frame) sock.write(frame);
  }
}

// Custom Synced State Broadcaster
function broadcastState(roomId) {
  const room = rooms[roomId];
  if (!room) return;
  
  room.players.forEach(p => {
    // Secure Blind-Answer Reveal Implementation
    // We mask the text content of the partner's answer completely 
    // until BOTH players have clicked submit.
    const tailoredAnswers = {};
    const hasSubmitted = {};
    
    room.players.forEach(uid => {
      hasSubmitted[uid] = !!room.answers[uid];
    });

    Object.keys(room.answers).forEach(uid => {
      if (Object.keys(room.answers).length >= 2) {
        // Both players have submitted answers, fully reveal texts
        tailoredAnswers[uid] = room.answers[uid];
      } else {
        // Only one submitted: show the raw text only to its author, and hide partner's
        tailoredAnswers[uid] = uid === p ? room.answers[uid] : "SUBMITTED_PLACEHOLDER";
      }
    });

    const tailoredState = {
      gameId: room.gameId,
      currentPromptIndex: room.currentPromptIndex,
      isFlipped: room.isFlipped,
      players: room.players,
      answers: tailoredAnswers,
      hasSubmitted: hasSubmitted,
      lastReaction: room.lastReaction
    };

    // Distribute tailored state to the specific player's open sockets
    Object.keys(socketToUser).forEach(socketId => {
      if (socketToUser[socketId] === p && socketToRoom[socketId] === roomId) {
        sendTo(socketId, 'game-state-update', tailoredState);
      }
    });
  });
}

function handleEvent(socketId, event, data) {
  console.log(`Received event: ${event}`, data);
  
  switch(event) {
    case 'create-room': {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let roomId = '';
      for (let i = 0; i < 5; i++) {
        roomId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      rooms[roomId] = {
        gameId: data.gameId,
        currentPromptIndex: 0,
        isFlipped: false,
        players: [],
        answers: {},
        lastReaction: null
      };
      
      console.log(`Room ${roomId} created for game ${data.gameId}`);
      sendTo(socketId, 'room-created', { roomId });
      break;
    }
    
    case 'join-room': {
      const { roomId, userId } = data;
      const room = rooms[roomId];
      
      if (!room) {
        sendTo(socketId, 'room-error', { code: 'not_found' });
        return;
      }
      
      const isAlreadyIn = room.players.includes(userId);
      if (!isAlreadyIn && room.players.length >= 2) {
        sendTo(socketId, 'room-error', { code: 'full' });
        return;
      }
      
      if (!isAlreadyIn) {
        room.players.push(userId);
      }
      
      socketToUser[socketId] = userId;
      socketToRoom[socketId] = roomId;
      
      console.log(`Player ${userId} joined room ${roomId}`);
      broadcastState(roomId);
      break;
    }
    
    case 'flip-card': {
      const { roomId } = data;
      const room = rooms[roomId];
      if (room) {
        room.isFlipped = true;
        broadcastState(roomId);
      }
      break;
    }
    
    case 'next-prompt': {
      const { roomId, totalPrompts } = data;
      const room = rooms[roomId];
      if (room) {
        room.isFlipped = false;
        room.answers = {};
        room.currentPromptIndex = (room.currentPromptIndex + 1) % totalPrompts;
        broadcastState(roomId);
      }
      break;
    }
    
    case 'submit-answer': {
      const { roomId, userId, text } = data;
      const room = rooms[roomId];
      if (room) {
        room.answers[userId] = text;
        broadcastState(roomId);
      }
      break;
    }
    
    case 'reaction': {
      const { roomId, userId, type } = data;
      const room = rooms[roomId];
      if (room) {
        room.lastReaction = { type, timestamp: Date.now(), by: userId };
        broadcastState(roomId);
      }
      break;
    }
  }
}

function handleDisconnect(socketId) {
  const roomId = socketToRoom[socketId];
  const userId = socketToUser[socketId];
  
  delete sockets[socketId];
  delete socketToUser[socketId];
  delete socketToRoom[socketId];
  
  if (roomId && rooms[roomId]) {
    const room = rooms[roomId];
    room.players = room.players.filter(p => p !== userId);
    
    console.log(`Player ${userId} disconnected from room ${roomId}`);
    
    if (room.players.length === 0) {
      // Keep room in-memory for 1 minute before deletion
      setTimeout(() => {
        if (rooms[roomId] && rooms[roomId].players.length === 0) {
          delete rooms[roomId];
          console.log(`Deleted inactive room: ${roomId}`);
        }
      }, 60000);
    } else {
      broadcastState(roomId);
    }
  }
}

server.on('upgrade', (req, socket) => {
  if (req.headers['upgrade'] !== 'websocket') {
    socket.destroy();
    return;
  }
  
  const key = req.headers['sec-websocket-key'];
  const hash = crypto.createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
    .digest('base64');
    
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    'Sec-WebSocket-Accept: ' + hash + '\r\n\r\n'
  );
  
  const socketId = Math.random().toString(36).substring(2, 15);
  sockets[socketId] = socket;
  
  socket.on('data', (buffer) => {
    const frame = decodeFrame(buffer);
    if (!frame) return;
    
    if (frame.type === 'close') {
      handleDisconnect(socketId);
    } else if (frame.type === 'text') {
      try {
        const { event, data } = JSON.parse(frame.data);
        handleEvent(socketId, event, data);
      } catch (err) {
        console.error("Frame text parsing failed", err);
      }
    }
  });
  
  socket.on('close', () => {
    handleDisconnect(socketId);
  });
  
  socket.on('error', (err) => {
    console.error(`Socket error on ID ${socketId}:`, err);
    handleDisconnect(socketId);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 PairPlay native WebSocket server started on ws://localhost:${PORT}`);
});
