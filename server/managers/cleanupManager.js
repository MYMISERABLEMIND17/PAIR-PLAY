function scheduleGracePeriod(rooms, roomId, userId, handleGraceExpiryFn, duration = 90000) {
  setTimeout(() => {
    const currentRoom = rooms[roomId];
    if (currentRoom && currentRoom.presences && currentRoom.presences[userId]) {
      const presence = currentRoom.presences[userId];
      if (presence.state === 'reconnecting') {
        handleGraceExpiryFn(roomId, userId);
      }
    }
  }, duration);
}

function scheduleRoomCleanup(rooms, roomId, handleRoomCleanupFn, duration = 300000) {
  setTimeout(() => {
    const currentRoom = rooms[roomId];
    if (currentRoom && currentRoom.players.length === 0) {
      handleRoomCleanupFn(roomId);
    }
  }, duration);
}

module.exports = {
  scheduleGracePeriod,
  scheduleRoomCleanup
};
