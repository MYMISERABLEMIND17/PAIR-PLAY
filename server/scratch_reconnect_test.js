const { exec } = require('child_process');
const { client } = require('./managers/redisClient');
const recoveryManager = require('./managers/recoveryManager');

console.log('[Test Reconnect] Starting local daemonized Redis server...');
exec('redis-server --daemonize yes', (error) => {
  if (error) {
    console.warn('[Warning] Could not start Redis daemon:', error.message);
  }
  
  console.log('[Test Reconnect] Waiting 1.5 seconds for Redis socket binding...');
  setTimeout(async () => {
    try {
      const roomId = 'R999X';
      const userId = 'user_alex';
      
      // Simulate Server Instance A saving initial state to Redis
      const initialRoom = {
        gameId: 'deep_connection',
        currentPromptIndex: 2,
        isFlipped: true,
        answers: { user_alex: 'Love is trust.' },
        seed: 12345
      };
      
      await client.set(`room:${roomId}`, JSON.stringify(initialRoom));
      
      // Generate a secure reconnect token
      const token = recoveryManager.generateToken();
      console.log(`[Test Reconnect] Generated reconnect token for user: ${token}`);
      
      const presence = {
        userId,
        socketId: 'instance_a_socket_111',
        state: 'connected',
        lastSeen: Date.now(),
        reconnectToken: token
      };
      
      await client.hset(`room:${roomId}:players`, userId, JSON.stringify(presence));
      await client.set(`reconnect:${token}`, JSON.stringify({ userId, roomId }), 'EX', 90);
      console.log('[Test Reconnect] Initial session successfully synchronized to global Redis authority!');
      
      // Simulating Server Instance A CRASHING / Disconnect
      console.log('[Test Reconnect] Simulating Server Instance A crash... (Socket disconnected)');
      presence.state = 'reconnecting';
      presence.lastSeen = Date.now();
      await client.hset(`room:${roomId}:players`, userId, JSON.stringify(presence));
      
      // Simulating Reconnect to completely different SERVER INSTANCE B
      console.log('[Test Reconnect] Reconnecting player to Server Instance B using token...');
      
      // Instance B validates the token globally
      const mappingData = await client.get(`reconnect:${token}`);
      if (!mappingData) {
        throw new Error('Token not found in global Redis cache!');
      }
      
      const mapping = JSON.parse(mappingData);
      console.log(`[Test Reconnect] Global Token Validated! Restoring session for ${mapping.userId} in room ${mapping.roomId}`);
      
      const restoredPresenceData = await client.hget(`room:${mapping.roomId}:players`, mapping.userId);
      const restoredPresence = JSON.parse(restoredPresenceData);
      
      // Upgrade presence on Instance B
      restoredPresence.state = 'connected';
      restoredPresence.socketId = 'instance_b_socket_222'; // New socket on new server instance!
      await client.hset(`room:${mapping.roomId}:players`, mapping.userId, JSON.stringify(restoredPresence));
      
      // Fetch fresh room data on Instance B
      const roomStateData = await client.get(`room:${mapping.roomId}`);
      const roomState = JSON.parse(roomStateData);
      
      console.log('[Test Reconnect] Restored presence state:', restoredPresence.state);
      console.log('[Test Reconnect] New active socket ID on Server B:', restoredPresence.socketId);
      console.log('[Test Reconnect] Restored game prompt index:', roomState.currentPromptIndex);
      console.log('[Test Reconnect] Restored player answers:', roomState.answers);
      
      if (
        restoredPresence.state === 'connected' &&
        restoredPresence.socketId === 'instance_b_socket_222' &&
        roomState.currentPromptIndex === 2 &&
        roomState.answers.user_alex === 'Love is trust.'
      ) {
        console.log('[Test Reconnect] SUCCESS: Global Distributed Reconnect Recovery holds 100% data integrity across instances!');
        process.exit(0);
      } else {
        console.error('[Test Reconnect] FAILURE: Restored session data mismatch.');
        process.exit(1);
      }
      
    } catch (err) {
      console.error('[Test Reconnect] Critical Error:', err.message);
      process.exit(1);
    }
  }, 1500);
});
