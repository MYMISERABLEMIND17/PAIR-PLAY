const { exec } = require('child_process');
const { client } = require('./managers/redisClient');
const cleanupManager = require('./managers/cleanupManager');

console.log('[Test Cleanup] Starting local daemonized Redis server...');
exec('redis-server --daemonize yes', (error) => {
  if (error) {
    console.warn('[Warning] Could not start Redis daemon:', error.message);
  }
  
  console.log('[Test Cleanup] Waiting 1.5 seconds for Redis socket binding...');
  setTimeout(async () => {
    try {
      const roomId = 'R_CLEAN';
      const userId = 'user_stale';
      
      // Clear any pre-existing lock keys
      await client.del(`lock:cleanup:grace:${roomId}:${userId}`);
      
      // Mock player state to be reconnecting
      const presence = {
        userId,
        socketId: 'stale_socket',
        state: 'reconnecting',
        lastSeen: Date.now() - 100000,
        reconnectToken: 'tok123'
      };
      await client.hset(`room:${roomId}:players`, userId, JSON.stringify(presence));
      console.log('[Test Cleanup] Mock player initialized with "reconnecting" state.');
      
      let executionCount = 0;
      
      // Cleanup callback that increments execution count
      const handleGraceExpiryFn = async (rId, uId) => {
        executionCount++;
        console.log(`[Test Cleanup Node Callback] Executing cleanup authority logic on Room ${rId} User ${uId}!`);
        // Simulate database state cleaning
        await client.hdel(`room:${rId}:players`, uId);
      };
      
      console.log('[Test Cleanup] Simulating 3 server instances scheduling cleanup simultaneously...');
      
      // Trigger concurrently across three simulated nodes using the distributed cleanupManager
      cleanupManager.scheduleGracePeriod(client, roomId, userId, handleGraceExpiryFn, 100);
      cleanupManager.scheduleGracePeriod(client, roomId, userId, handleGraceExpiryFn, 100);
      cleanupManager.scheduleGracePeriod(client, roomId, userId, handleGraceExpiryFn, 100);
      
      // Wait for execution completion
      setTimeout(async () => {
        const finalPresence = await client.hget(`room:${roomId}:players`, userId);
        console.log('[Test Cleanup] Number of nodes that executed callback:', executionCount);
        console.log('[Test Cleanup] Final database presence representation:', finalPresence);
        
        if (executionCount === 1 && !finalPresence) {
          console.log('[Test Cleanup] SUCCESS: Distributed Cleanup Authority elected exactly ONE executor without conflict!');
          process.exit(0);
        } else {
          console.error('[Test Cleanup] FAILURE: Distributed locks failed to guarantee single-authority execution.');
          process.exit(1);
        }
      }, 500);
      
    } catch (err) {
      console.error('[Test Cleanup] Critical Error:', err.message);
      process.exit(1);
    }
  }, 1500);
});
