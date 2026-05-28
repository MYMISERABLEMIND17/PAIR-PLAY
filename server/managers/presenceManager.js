function transitionToConnected(presence, socketId) {
  presence.socketId = socketId;
  presence.state = 'connected';
  presence.lastSeen = Date.now();
}

function transitionToReconnecting(presence) {
  presence.state = 'reconnecting';
  presence.lastSeen = Date.now();
}

function transitionToStale(presence) {
  presence.state = 'stale';
  presence.lastSeen = Date.now();
}

function transitionToDisconnected(presence) {
  presence.state = 'disconnected';
  presence.lastSeen = Date.now();
}

module.exports = {
  transitionToConnected,
  transitionToReconnecting,
  transitionToStale,
  transitionToDisconnected
};
