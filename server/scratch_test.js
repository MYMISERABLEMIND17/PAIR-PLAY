const { exec } = require('child_process');
const { client, subClient } = require('./managers/redisClient');

console.log('[Test] Starting local daemonized Redis server...');
exec('redis-server --daemonize yes', (error) => {
  if (error) {
    console.warn('[Warning] Could not start Redis daemon:', error.message);
  }
  
  console.log('[Test] Waiting 1.5 seconds for Redis socket binding...');
  setTimeout(async () => {
    try {
      console.log('[Test] Setting up Pub/Sub subscription on channel "room-updates"...');
      
      // Register subscription listener
      subClient.on('message', (channel, message) => {
        console.log(`[Test] RECEIVED message on channel "${channel}":`, message);
        const parsed = JSON.parse(message);
        
        if (parsed.event === 'flip-card' && parsed.roomId === 'R1X7Y') {
          console.log('[Test] SUCCESS: Pub/Sub subscription event delivered and parsed perfectly!');
          process.exit(0);
        }
      });
      
      await subClient.subscribe('room-updates');
      console.log('[Test] Subscription confirmed! Publishing event from standard client...');
      
      // Publish event from client
      const payload = { event: 'flip-card', roomId: 'R1X7Y' };
      await client.publish('room-updates', JSON.stringify(payload));
      
      // Safety timeout to exit if we don't receive
      setTimeout(() => {
        console.error('[Test] FAILURE: Pub/Sub event timeout.');
        process.exit(1);
      }, 3000);
      
    } catch (err) {
      console.error('[Test] Handshake failed:', err.message);
      process.exit(1);
    }
  }, 1500);
});
