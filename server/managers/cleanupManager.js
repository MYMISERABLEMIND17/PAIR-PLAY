/**
 * Distributed Room & Player Session Cleanup Manager
 * Employs Redis atomic locks to guarantee single-authority execution across scaled instances.
 */

function scheduleGracePeriod(redis, roomId, userId, handleGraceExpiryFn, duration = 90000) {
  setTimeout(async () => {
    try {
      const lockKey = `lock:cleanup:grace:${roomId}:${userId}`;
      // Acquire 30 seconds atomic distributed lock
      const acquired = await redis.set(lockKey, 'locked', 'NX', 'EX', 30);
      
      if (!acquired) {
        console.log(`[Cleanup Authority] Grace period lock already held for room ${roomId} player ${userId}. Skipping.`);
        return;
      }
      
      console.log(`[Cleanup Authority] Node successfully locked grace sweep for room ${roomId} player ${userId}.`);
      
      const presenceData = await redis.hget(`room:${roomId}:players`, userId);
      if (presenceData) {
        const presence = JSON.parse(presenceData);
        if (presence.state === 'reconnecting') {
          await handleGraceExpiryFn(roomId, userId);
        }
      }
    } catch (err) {
      console.error('[Cleanup Authority] Error executing scheduled grace period check:', err);
    }
  }, duration);
}

function scheduleRoomCleanup(redis, roomId, handleRoomCleanupFn, duration = 300000) {
  setTimeout(async () => {
    try {
      const lockKey = `lock:cleanup:room:${roomId}`;
      // Acquire 30 seconds atomic distributed lock
      const acquired = await redis.set(lockKey, 'locked', 'NX', 'EX', 30);
      
      if (!acquired) {
        console.log(`[Cleanup Authority] Room deletion lock already held for room ${roomId}. Skipping.`);
        return;
      }
      
      console.log(`[Cleanup Authority] Node successfully locked room deletion sweep for room ${roomId}.`);
      
      const finalPresences = await redis.hgetall(`room:${roomId}:players`);
      if (Object.keys(finalPresences).length === 0) {
        await handleRoomCleanupFn(roomId);
      }
    } catch (err) {
      console.error('[Cleanup Authority] Error executing scheduled room deletion check:', err);
    }
  }, duration);
}

module.exports = {
  scheduleGracePeriod,
  scheduleRoomCleanup
};
