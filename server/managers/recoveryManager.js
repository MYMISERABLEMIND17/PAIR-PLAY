const crypto = require('crypto');

function validateToken(room, userId, reconnectToken) {
  const presence = room.presences ? room.presences[userId] : null;
  return presence && presence.reconnectToken === reconnectToken;
}

const logManager = require('./logManager');

function replaceSocket(sockets, socketToUser, socketToRoom, oldSocketId, newSocketId, userId, sendToFn) {
  if (oldSocketId && oldSocketId !== newSocketId && sockets[oldSocketId]) {
    logManager.log('SOCKET_REPLACEMENT', { 
      oldSocketId, 
      newSocketId, 
      userId, 
      roomId: socketToRoom[oldSocketId] 
    });
    
    sendToFn(oldSocketId, 'superseded', {});
    sockets[oldSocketId].destroy();
    
    delete sockets[oldSocketId];
    delete socketToUser[oldSocketId];
    delete socketToRoom[oldSocketId];
  }
}

function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = {
  validateToken,
  replaceSocket,
  generateToken
};
