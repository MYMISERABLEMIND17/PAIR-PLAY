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
const metricsManager = require('./managers/metricsManager');
const { client: redis, subClient } = require('./managers/redisClient'); // authoritative pub/sub redis connections
const dbClient = require('./managers/dbClient');

const PORT = process.env.PORT || 3001;

// Centralized Realtime State Repositories
const sockets = {};      // socketId -> net.Socket
const socketToUser = {};  // socketId -> userId
const socketToRoom = {};  // socketId -> roomId

// Helper delegation triggers
function sendTo(socketId, event, data) {
  try {
    connectionManager.sendTo(sockets, socketId, event, data);
    metricsManager.increment('broadcastSuccess');
  } catch (err) {
    metricsManager.increment('broadcastFailures');
  }
}

async function broadcastState(roomId) {
  const roomData = await redis.get(`room:${roomId}`);
  const presencesData = await redis.hgetall(`room:${roomId}:players`);

  if (roomData) {
    const room = JSON.parse(roomData);
    const presences = {};
    const players = [];

    Object.keys(presencesData).forEach(userId => {
      presences[userId] = JSON.parse(presencesData[userId]);
      players.push(userId);
    });

    room.players = players;
    room.presences = presences;

    // Retrieve recent events history from Redis
    const eventsData = await redis.sendCommand(['LRANGE', `room:${roomId}:events`, '0', '-1']) || [];
    room.events = eventsData.map(str => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return str;
      }
    });

    roomManager.broadcastState(room, roomId, sockets, socketToUser, socketToRoom, sendTo);
  }
}

// Global Pub/Sub Updates Receiver
subClient.on('message', (channel, message) => {
  if (channel === 'room-updates') {
    try {
      const { roomId } = JSON.parse(message);

      // Only read and broadcast if this server hosts active sockets for this room
      const hasLocalSockets = Object.keys(socketToRoom).some(socketId => socketToRoom[socketId] === roomId);
      if (hasLocalSockets) {
        broadcastState(roomId).catch(err => {
          console.error(`[PubSub] Error in distributed broadcastState for room ${roomId}:`, err);
        });
      }
    } catch (err) {
      console.warn('[PubSub] Failed to parse room-updates payload:', err);
    }
  }
});

// Subscribe to global updates channel
subClient.subscribe('room-updates').then(() => {
  console.log('📡 Instance successfully subscribed to global room-updates pub/sub channel.');
}).catch(err => {
  console.error('[PubSub] Subscription failed:', err);
});

async function notifyRoomChange(roomId) {
  await redis.publish('room-updates', JSON.stringify({ roomId }));
}

async function handleEvent(socketId, event, data) {
  metricsManager.increment('eventCount');
  console.log(`Received event: ${event}`, data);

  switch (event) {
    case 'create-room': {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let roomId = '';
      for (let i = 0; i < 5; i++) {
        roomId += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const sessionId = await dbClient.createGameSession(data.gameId);

      const initialRoom = {
        gameId: data.gameId,
        sessionId: sessionId,
        currentPromptIndex: 0,
        isFlipped: false,
        answers: {},
        lastReaction: null,
        seed: Math.floor(Math.random() * 1000000) + 1
      };

      await redis.set(`room:${roomId}`, JSON.stringify(initialRoom));
      await redis.del(`room:${roomId}:players`);
      await redis.del(`room:${roomId}:events`);

      logManager.log('ROOM_RECOVERY', { roomId, action: 'create', playersCount: 0 });

      sendTo(socketId, 'room-created', { roomId });
      break;
    }

    case 'join-room': {
      const { roomId, userId, reconnectToken } = data;
      const roomData = await redis.get(`room:${roomId}`);

      if (!roomData) {
        sendTo(socketId, 'room-error', { code: 'not_found' });
        return;
      }

      if (reconnectToken) {
        metricsManager.increment('reconnectAttempts');
        // Secure O(1) Reconnect Token Validation
        const mappingData = await redis.get(`reconnect:${reconnectToken}`);
        if (!mappingData) {
          logManager.log('RECONNECT_FAILURE', { socketId, userId, roomId, reason: 'invalid_token' });
          metricsManager.increment('reconnectFailures');
          sendTo(socketId, 'room-error', { code: 'invalid_token' });
          return;
        }

        const mapping = JSON.parse(mappingData);
        if (mapping.userId !== userId || mapping.roomId !== roomId) {
          logManager.log('RECONNECT_FAILURE', { socketId, userId, roomId, reason: 'token_mismatch' });
          metricsManager.increment('reconnectFailures');
          sendTo(socketId, 'room-error', { code: 'invalid_token' });
          return;
        }

        logManager.log('RECONNECT_SUCCESS', { socketId, userId, roomId });
        metricsManager.increment('reconnectSuccess');

        const presenceData = await redis.hget(`room:${roomId}:players`, userId);
        if (presenceData) {
          const presence = JSON.parse(presenceData);

          // Handle Socket Replacement
          recoveryManager.replaceSocket(sockets, socketToUser, socketToRoom, presence.socketId, socketId, userId, sendTo);

          // Restore player presence state
          presenceManager.transitionToConnected(presence, socketId);
          await redis.hset(`room:${roomId}:players`, userId, JSON.stringify(presence));
        }

        socketToUser[socketId] = userId;
        socketToRoom[socketId] = roomId;

        await notifyRoomChange(roomId);
        break;
      }

      // Standard join path
      const presencesData = await redis.hgetall(`room:${roomId}:players`);
      const players = Object.keys(presencesData);
      const isAlreadyIn = players.includes(userId);

      if (!isAlreadyIn && players.length >= 2) {
        sendTo(socketId, 'room-error', { code: 'full' });
        return;
      }

      // Handle duplicate active connections
      if (isAlreadyIn) {
        const presence = JSON.parse(presencesData[userId]);
        recoveryManager.replaceSocket(sockets, socketToUser, socketToRoom, presence.socketId, socketId, userId, sendTo);
      }

      const existingToken = presencesData[userId] ? JSON.parse(presencesData[userId]).reconnectToken : null;
      const reconnectTokenNew = existingToken || recoveryManager.generateToken();

      const newPresence = {
        userId,
        socketId,
        state: 'connected',
        lastSeen: Date.now(),
        reconnectToken: reconnectTokenNew
      };

      await redis.hset(`room:${roomId}:players`, userId, JSON.stringify(newPresence));

      // Write reverse token lookup key with 90-second expiration TTL
      await redis.set(`reconnect:${reconnectTokenNew}`, JSON.stringify({ userId, roomId }), 'EX', 90);

      socketToUser[socketId] = userId;
      socketToRoom[socketId] = roomId;

      console.log(`Player ${userId} joined room ${roomId} (Presence: connected)`);

      await notifyRoomChange(roomId);
      break;
    }

    case 'flip-card': {
      const { roomId } = data;
      const roomData = await redis.get(`room:${roomId}`);
      if (roomData) {
        const room = JSON.parse(roomData);
        roomManager.flipCard(room);
        await redis.set(`room:${roomId}`, JSON.stringify(room));
        await notifyRoomChange(roomId);
      }
      break;
    }

    case 'next-prompt': {
      const { roomId, totalPrompts } = data;
      const roomData = await redis.get(`room:${roomId}`);
      if (roomData) {
        const room = JSON.parse(roomData);
        roomManager.nextPrompt(room, totalPrompts);
        await redis.set(`room:${roomId}`, JSON.stringify(room));
        await notifyRoomChange(roomId);
      }
      break;
    }

    case 'submit-answer': {
      const { roomId, userId, text } = data;
      const roomData = await redis.get(`room:${roomId}`);
      if (roomData) {
        const room = JSON.parse(roomData);
        roomManager.submitAnswer(room, userId, text);
        await redis.set(`room:${roomId}`, JSON.stringify(room));
        await notifyRoomChange(roomId);
      }
      break;
    }

    case 'reaction': {
      const { roomId, userId, type } = data;
      const roomData = await redis.get(`room:${roomId}`);
      if (roomData) {
        const room = JSON.parse(roomData);
        roomManager.addReaction(room, userId, type);
        await redis.set(`room:${roomId}`, JSON.stringify(room));

        // Log to recent events
        await redis.sendCommand(['LPUSH', `room:${roomId}:events`, JSON.stringify({ type: 'reaction', userId, reaction: type, timestamp: Date.now() })]);
        await redis.sendCommand(['LTRIM', `room:${roomId}:events`, '0', '19']); // trim to last 20 events

        await notifyRoomChange(roomId);
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

    case 'complete-game': {
      const { roomId } = data;
      const roomData = await redis.get(`room:${roomId}`);
      if (roomData) {
        const room = JSON.parse(roomData);
        if (room.sessionId) {
          await dbClient.endGameSession(room.sessionId, 'completed');
          room.sessionId = null;
          await redis.set(`room:${roomId}`, JSON.stringify(room));
          await notifyRoomChange(roomId);
        }
      }
      break;
    }
  }
}

async function handleDisconnect(socketId) {
  if (!sockets[socketId]) return;
  const roomId = socketToRoom[socketId];
  const userId = socketToUser[socketId];

  delete sockets[socketId];
  delete socketToUser[socketId];
  delete socketToRoom[socketId];

  logManager.log('SOCKET_DISCONNECT', { socketId, userId, roomId });

  if (roomId && userId) {
    const presenceData = await redis.hget(`room:${roomId}:players`, userId);
    if (presenceData) {
      const presence = JSON.parse(presenceData);

      if (presence.state === 'connected') {
        presenceManager.transitionToReconnecting(presence);
        await redis.hset(`room:${roomId}:players`, userId, JSON.stringify(presence));

        // Make sure reconnect mapping is valid during grace period
        await redis.set(`reconnect:${presence.reconnectToken}`, JSON.stringify({ userId, roomId }), 'EX', 90);
      }

      await notifyRoomChange(roomId); // Notify partner

      // Start a 90 seconds grace period for reconnect recovery
      cleanupManager.scheduleGracePeriod(redis, roomId, userId, async (expiredRoomId, expiredUserId) => {
        const innerPresenceData = await redis.hget(`room:${expiredRoomId}:players`, expiredUserId);
        if (innerPresenceData) {
          const expiredPresence = JSON.parse(innerPresenceData);
          if (expiredPresence.state === 'reconnecting') {
            logManager.log('STALE_SOCKET_CLEANUP', { userId: expiredUserId, roomId: expiredRoomId });
            presenceManager.transitionToDisconnected(expiredPresence);

            // Delete player presence hash field & reverse reconnect token
            await redis.hdel(`room:${expiredRoomId}:players`, expiredUserId);
            await redis.del(`reconnect:${expiredPresence.reconnectToken}`);

            // Clean answers from main room state and capture sessionId
            const roomData = await redis.get(`room:${expiredRoomId}`);
            let roomSessionId = null;
            if (roomData) {
              const room = JSON.parse(roomData);
              roomSessionId = room.sessionId;
              if (room.answers) {
                delete room.answers[expiredUserId];
              }
              await redis.set(`room:${expiredRoomId}`, JSON.stringify(room));
            }

            // Timeout event: Player has timed out reconnecting
            if (roomSessionId) {
              await dbClient.endGameSession(roomSessionId, 'abandoned');
            }

            // Check remaining players
            const checkPresences = await redis.hgetall(`room:${expiredRoomId}:players`);
            const remainingPlayersCount = Object.keys(checkPresences).length;

            if (remainingPlayersCount === 0) {
              // Both leave room event: Both players have disconnected and timed out
              if (roomSessionId) {
                await dbClient.endGameSession(roomSessionId, 'abandoned');
              }

              // Keep room cached for 5 minutes (300000ms) before deletion
              cleanupManager.scheduleRoomCleanup(redis, expiredRoomId, async (cleanupRoomId) => {
                const finalPresences = await redis.hgetall(`room:${cleanupRoomId}:players`);
                if (Object.keys(finalPresences).length === 0) {
                  // Capture sessionId before final deletion for Room Cleanup event
                  const finalRoomData = await redis.get(`room:${cleanupRoomId}`);
                  if (finalRoomData) {
                    const finalRoom = JSON.parse(finalRoomData);
                    if (finalRoom.sessionId) {
                      await dbClient.endGameSession(finalRoom.sessionId, 'abandoned');
                    }
                  }
                  await redis.del(`room:${cleanupRoomId}`);
                  await redis.del(`room:${cleanupRoomId}:players`);
                  await redis.del(`room:${cleanupRoomId}:events`);
                  logManager.log('ROOM_DELETION', { roomId: cleanupRoomId });
                }
              }, 300000);
            } else {
              await notifyRoomChange(expiredRoomId);
            }
          }
        }
      }, 90000);
    }
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/metrics') {
    try {
      const report = await metricsManager.generateReport(redis);
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify(report, null, 2));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error generating metrics report.\n');
    }
    return;
  }
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
      handleDisconnect(socketId).catch(err => console.error('Error on close handler:', err));
    } else if (frame.type === 'message') {
      try {
        const { event, data } = JSON.parse(frame.data);
        handleEvent(socketId, event, data).catch(err => {
          console.error(`Error processing event ${event}:`, err);
        });
      } catch (err) {
        console.warn('Failed to parse frame message as JSON', err);
      }
    }
  });

  socket.on('close', () => {
    handleDisconnect(socketId).catch(err => console.error('Error on close listener:', err));
  });

  socket.on('error', (err) => {
    console.error(`Socket error on ID ${socketId}:`, err);
    handleDisconnect(socketId).catch(dErr => console.error('Error on disconnect handler after socket error:', dErr));
  });
});

// Keep-Alive Heartbeat Sweep (Every 15 seconds)
setInterval(() => {
  heartbeatManager.sweepSockets(
    sockets,
    handleDisconnect,
    sendTo
  );
}, 15000);

server.listen(PORT, () => {
  console.log(`🚀 Winkd native WebSocket server started on ws://localhost:${PORT}`);
});

// Start background workers
const { startReconciliationWorker } = require('./workers/persistenceReconciliationWorker');
startReconciliationWorker();
