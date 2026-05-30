function createRoom(rooms, roomId, gameId) {
  rooms[roomId] = {
    gameId: gameId,
    currentPromptIndex: 0,
    isFlipped: false,
    players: [],
    answers: {},
    lastReaction: null,
    seed: Math.floor(Math.random() * 1000000) + 1,
    presences: {}
  };
  console.log(`[RoomManager] Room ${roomId} created for game ${gameId}`);
}

function broadcastState(room, roomId, sockets, socketToUser, socketToRoom, sendToFn) {
  if (!room) return;
  
  if (!room.presences) {
    room.presences = {};
  }
  
  room.players.forEach(p => {
    // Secure Blind-Answer Reveal Implementation
    const tailoredAnswers = {};
    const hasSubmitted = {};
    
    room.players.forEach(uid => {
      hasSubmitted[uid] = !!room.answers[uid];
    });

    Object.keys(room.answers).forEach(uid => {
      if (Object.keys(room.answers).length >= 2) {
        tailoredAnswers[uid] = room.answers[uid];
      } else {
        tailoredAnswers[uid] = uid === p ? room.answers[uid] : "SUBMITTED_PLACEHOLDER";
      }
    });

    const tailoredPresences = {};
    Object.keys(room.presences).forEach(uid => {
      const pres = room.presences[uid];
      tailoredPresences[uid] = {
        userId: pres.userId,
        socketId: pres.socketId,
        state: pres.state,
        lastSeen: pres.lastSeen,
        reconnectToken: uid === p ? pres.reconnectToken : undefined
      };
    });

    const tailoredState = {
      gameId: room.gameId,
      sessionId: room.sessionId || null,
      currentPromptIndex: room.currentPromptIndex,
      isFlipped: room.isFlipped,
      players: room.players,
      answers: tailoredAnswers,
      hasSubmitted: hasSubmitted,
      lastReaction: room.lastReaction,
      seed: room.seed,
      presences: tailoredPresences,
      events: room.events || []
    };

    Object.keys(socketToUser).forEach(socketId => {
      if (socketToUser[socketId] === p && socketToRoom[socketId] === roomId) {
        sendToFn(socketId, 'game-state-update', tailoredState);
      }
    });
  });
}

function flipCard(room) {
  if (room) {
    room.isFlipped = true;
  }
}

function nextPrompt(room, totalPrompts) {
  if (room) {
    room.isFlipped = false;
    room.answers = {};
    room.currentPromptIndex = (room.currentPromptIndex + 1) % totalPrompts;
  }
}

function submitAnswer(room, userId, text) {
  if (room) {
    room.answers[userId] = text;
  }
}

function addReaction(room, userId, type) {
  if (room) {
    room.lastReaction = { type, timestamp: Date.now(), by: userId };
  }
}

module.exports = {
  createRoom,
  broadcastState,
  flipCard,
  nextPrompt,
  submitAnswer,
  addReaction
};
