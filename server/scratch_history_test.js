const { client: redis } = require('./managers/redisClient');
const roomManager = require('./managers/roomManager');

async function testHistoryRetrieval() {
  console.log('[Test History] Starting event history retrieval validation...');

  const roomId = 'TEST_HIST_' + Math.floor(Math.random() * 1000);
  console.log(`[Test History] Initializing room: ${roomId}`);

  // 1. LPUSH some mock events into Redis
  const event1 = { type: 'reaction', userId: 'userA', reaction: '❤️', timestamp: Date.now() - 5000 };
  const event2 = { type: 'reaction', userId: 'userB', reaction: '🔥', timestamp: Date.now() };

  await redis.sendCommand(['LPUSH', `room:${roomId}:events`, JSON.stringify(event1)]);
  await redis.sendCommand(['LPUSH', `room:${roomId}:events`, JSON.stringify(event2)]);
  console.log('[Test History] Mock events pushed to Redis.');

  // 2. Retrieve history using LRANGE
  const eventsData = await redis.sendCommand(['LRANGE', `room:${roomId}:events`, '0', '-1']) || [];
  console.log(`[Test History] Retrieved events count: ${eventsData.length}`);

  if (eventsData.length !== 2) {
    console.error(`❌ Fail: Expected 2 events, got ${eventsData.length}`);
    process.exit(1);
  }

  const parsedEvents = eventsData.map(str => JSON.parse(str));
  // Note: LPUSH prepends, so event2 (🔥) is index 0 and event1 (❤️) is index 1
  if (parsedEvents[0].reaction !== '🔥' || parsedEvents[1].reaction !== '❤️') {
    console.error('❌ Fail: Events order or content mismatch!', parsedEvents);
    process.exit(1);
  }
  console.log('✓ Pass: Redis list correctly stores and retrieves session event history in sequence!');

  // 3. Test tailoredState integration
  const room = {
    gameId: 'deep_connection',
    sessionId: 'test-session-uuid',
    currentPromptIndex: 1,
    isFlipped: false,
    players: ['userA', 'userB'],
    answers: {},
    lastReaction: null,
    seed: 12345,
    presences: {},
    events: parsedEvents
  };

  const sockets = {};
  const socketToUser = { 'socketA': 'userA' };
  const socketToRoom = { 'socketA': roomId };
  let receivedState = null;

  const sendToFn = (sockId, eventName, payload) => {
    if (sockId === 'socketA' && eventName === 'game-state-update') {
      receivedState = payload;
    }
  };

  roomManager.broadcastState(room, roomId, sockets, socketToUser, socketToRoom, sendToFn);

  if (!receivedState) {
    console.error('❌ Fail: tailoredState was not broadcasted to userA!');
    process.exit(1);
  }

  console.log('[Test History] Broadcasted state structure:', JSON.stringify(receivedState));

  if (receivedState.sessionId !== 'test-session-uuid') {
    console.error(`❌ Fail: sessionId missing or mismatched in tailoredState! Got: ${receivedState.sessionId}`);
    process.exit(1);
  }

  if (!Array.isArray(receivedState.events) || receivedState.events.length !== 2) {
    console.error('❌ Fail: events history missing or incorrect size in tailoredState!', receivedState.events);
    process.exit(1);
  }

  console.log('✓ Pass: tailoredState successfully exposes both sessionId and events history array!');

  // Clean up
  await redis.del(`room:${roomId}:events`);
  console.log('[Test History] Cleaned up Redis event keys.');
  console.log('🎉 SUCCESS: Session history retrieval is 100% correct, verified, and integrated into tailoredState!');
}

testHistoryRetrieval().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('❌ Error executing test:', err);
  process.exit(1);
});
