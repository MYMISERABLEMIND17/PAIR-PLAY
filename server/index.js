const http = require('http');
const crypto = require('crypto');

// Import modular managers
const connectionManager = require('./managers/connectionManager');
const heartbeatManager = require('./managers/heartbeatManager');
const roomManager = require('./managers/roomManager');
const presenceManager = require('./managers/presenceManager');
const recoveryManager = require('./managers/recoveryManager');
const cleanupManager = require('./managers/cleanupManager');
const logManager = require('./managers/logManager');

const PORT = process.env.PORT || 3001;

// Centralized Realtime State Repositories
const sockets = {};      // socketId -> net.Socket
const socketToUser = {};  // socketId -> userId
const socketToRoom = {};  // socketId -> roomId
const rooms = {};         // roomId -> RoomState

// Helper delegation triggers
function sendTo(socketId, event, data) {
  connectionManager.sendTo(sockets, socketId, event, data);
}

function broadcastState(roomId) {
  roomManager.broadcastState(rooms, sockets, socketToUser, socketToRoom, roomId, sendTo);
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
      
      roomManager.createRoom(rooms, roomId, data.gameId);
      sendTo(socketId, 'room-created', { roomId });
      break;
    }
    
    case 'join-room': {
      const { roomId, userId, reconnectToken } = data;
      const room = rooms[roomId];
      
      if (!room) {
        sendTo(socketId, 'room-error', { code: 'not_found' });
        return;
      }
      
      const isAlreadyIn = room.players.includes(userId);
      const isReconnecting = !!reconnectToken;
      
      if (isReconnecting) {
        if (!recoveryManager.validateToken(room, userId, reconnectToken)) {
          logManager.log('RECONNECT_FAILURE', { socketId, userId, roomId, reason: 'invalid_token' });
          sendTo(socketId, 'room-error', { code: 'invalid_token' });
          return;
        }
        
        logManager.log('RECONNECT_SUCCESS', { socketId, userId, roomId });
        
        const presence = room.presences[userId];
        
        // Handle Socket Replacement
        recoveryManager.replaceSocket(sockets, socketToUser, socketToRoom, presence.socketId, socketId, userId, sendTo);
        
        // Restore player presence and active mappings
        presenceManager.transitionToConnected(presence, socketId);
        
        socketToUser[socketId] = userId;
        socketToRoom[socketId] = roomId;
        
        broadcastState(roomId);
        break;
      }
      
      // Standard join path (fresh tab/new window)
      if (!isAlreadyIn && room.players.length >= 2) {
        sendTo(socketId, 'room-error', { code: 'full' });
        return;
      }
      
      // Handle socket replacement on duplicate sessions
      if (isAlreadyIn) {
        const presence = room.presences ? room.presences[userId] : null;
        if (presence) {
          recoveryManager.replaceSocket(sockets, socketToUser, socketToRoom, presence.socketId, socketId, userId, sendTo);
        }
      }
      
      if (!isAlreadyIn) {
        room.players.push(userId);
      }
      
      if (!room.presences) {
        room.presences = {};
      }
      
      const existingToken = room.presences[userId]?.reconnectToken;
      const reconnectTokenNew = existingToken || recoveryManager.generateToken();
      
      room.presences[userId] = {
        userId,
        socketId,
        state: 'connected',
        lastSeen: Date.now(),
        reconnectToken: reconnectTokenNew
      };
      
      socketToUser[socketId] = userId;
      socketToRoom[socketId] = roomId;
      
      console.log(`Player ${userId} joined room ${roomId} (Presence: connected)`);
      broadcastState(roomId);
      break;
    }
    
    case 'flip-card': {
      const { roomId } = data;
      const room = rooms[roomId];
      if (room) {
        roomManager.flipCard(room);
        broadcastState(roomId);
      }
      break;
    }
    
    case 'next-prompt': {
      const { roomId, totalPrompts } = data;
      const room = rooms[roomId];
      if (room) {
        roomManager.nextPrompt(room, totalPrompts);
        broadcastState(roomId);
      }
      break;
    }
    
    case 'submit-answer': {
      const { roomId, userId, text } = data;
      const room = rooms[roomId];
      if (room) {
        roomManager.submitAnswer(room, userId, text);
        broadcastState(roomId);
      }
      break;
    }
    
    case 'reaction': {
      const { roomId, userId, type } = data;
      const room = rooms[roomId];
      if (room) {
        roomManager.addReaction(room, userId, type);
        broadcastState(roomId);
      }
      break;
    }
    
    case 'pong': {
      const socket = sockets[socketId];
      if (socket) {
        heartbeatManager.registerPong(socket);
      }
      break;
    }
  }
}

function handleDisconnect(socketId) {
  if (!sockets[socketId]) return;
  const roomId = socketToRoom[socketId];
  const userId = socketToUser[socketId];
  
  delete sockets[socketId];
  delete socketToUser[socketId];
  delete socketToRoom[socketId];
  
  logManager.log('SOCKET_DISCONNECT', { socketId, userId, roomId });
  
  if (roomId && rooms[roomId]) {
    const room = rooms[roomId];
    
    if (!room.presences) {
      room.presences = {};
    }
    
    if (room.presences[userId]) {
      const presence = room.presences[userId];
      
      if (presence.state === 'connected') {
        presenceManager.transitionToReconnecting(presence);
      }
    }
    
    broadcastState(roomId); // Notify partner
    
    // Start a 90 seconds grace period for reconnect recovery
    cleanupManager.scheduleGracePeriod(rooms, roomId, userId, (expiredRoomId, expiredUserId) => {
      const expiredRoom = rooms[expiredRoomId];
      if (expiredRoom) {
        logManager.log('STALE_SOCKET_CLEANUP', { userId: expiredUserId, roomId: expiredRoomId });
        if (expiredRoom.presences && expiredRoom.presences[expiredUserId]) {
          presenceManager.transitionToDisconnected(expiredRoom.presences[expiredUserId]);
        }
        
        expiredRoom.players = expiredRoom.players.filter(p => p !== expiredUserId);
        if (expiredRoom.presences) {
          delete expiredRoom.presences[expiredUserId];
        }
        
        if (expiredRoom.answers) {
          delete expiredRoom.answers[expiredUserId];
        }
        
        if (expiredRoom.players.length === 0) {
          // Keep room in-memory for 5 minutes (300000ms) before deletion
          cleanupManager.scheduleRoomCleanup(rooms, expiredRoomId, (cleanupRoomId) => {
            delete rooms[cleanupRoomId];
            logManager.log('ROOM_DELETION', { roomId: cleanupRoomId });
          }, 300000);
        } else {
          broadcastState(expiredRoomId);
        }
      }
    }, 90000);
  }
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Winkd native WebSocket server active.\n');
});

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
  socket.isAlive = true;
  socket.lastHeartbeat = Date.now();
  sockets[socketId] = socket;
  
  logManager.log('SOCKET_CONNECT', { socketId });
  
  socket.on('data', (buffer) => {
    const frame = connectionManager.decodeFrame(buffer);
    if (!frame) return;
    
    if (frame.type === 'close') {
      handleDisconnect(socketId);
    } else if (frame.type === 'message') {
      try {
        const { event, data } = JSON.parse(frame.data);
        handleEvent(socketId, event, data);
      } catch (err) {
        console.warn('Failed to parse frame message as JSON', err);
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

// Keep-Alive Heartbeat Sweep (Every 15 seconds)
setInterval(() => {
  heartbeatManager.sweepSockets(
    sockets, 
    socketToRoom, 
    socketToUser, 
    rooms, 
    handleDisconnect, 
    sendTo, 
    presenceManager.transitionToStale
  );
}, 15000);

server.listen(PORT, () => {
  console.log(`🚀 Winkd native WebSocket server started on ws://localhost:${PORT}`);
});
