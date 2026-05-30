function registerPong(socket) {
  if (socket) {
    socket.isAlive = true;
    socket.lastHeartbeat = Date.now();
  }
}

function sweepSockets(sockets, handleDisconnectFn, sendToFn) {
  Object.keys(sockets).forEach((socketId) => {
    const socket = sockets[socketId];
    if (!socket || socket.destroyed) {
      handleDisconnectFn(socketId);
      return;
    }

    const timeSinceLastHeartbeat = Date.now() - socket.lastHeartbeat;
    if (!socket.isAlive || timeSinceLastHeartbeat > 30000) {
      const logManager = require('./logManager');
      logManager.log('HEARTBEAT_TIMEOUT', { socketId, elapsedMs: timeSinceLastHeartbeat });
      
      socket.destroy();
      return;
    }

    socket.isAlive = false;
    sendToFn(socketId, 'ping', {});
  });
}

module.exports = {
  registerPong,
  sweepSockets
};
