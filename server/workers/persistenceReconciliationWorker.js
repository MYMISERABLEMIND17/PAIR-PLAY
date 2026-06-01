const { client: redis } = require('../managers/redisClient');
const { sql } = require('../managers/dbClient');
const metricsManager = require('../managers/metricsManager');

async function processQueue() {
  // If DB is still not connected, do not pop from the queue
  if (!sql) return;
  
  if (!redis) return;

  try {
    // RPOP gets the oldest element from the list
    const itemStr = await redis.sendCommand(['RPOP', 'persistence:failed_writes']);
    if (!itemStr) return; // Queue empty

    const item = JSON.parse(itemStr);
    console.log(`[Reconciliation] Retrying operation: ${item.operation}`);

    switch (item.operation) {
      case 'createGameSession':
        await sql`
          INSERT INTO game_sessions (id, couple_id, game_id, status, state, started_at)
          VALUES (${item.payload.sessionId}, ${item.payload.coupleId}, ${item.payload.gameId}, 'active', ${sql.json({})}, NOW())
          ON CONFLICT (id) DO NOTHING
        `;
        break;
      case 'endGameSession':
        await sql`
          UPDATE game_sessions
          SET status = ${item.payload.status}, completed_at = NOW()
          WHERE id = ${item.payload.sessionId} AND status = 'active'
        `;
        break;
      case 'saveMoment':
        await sql`
          INSERT INTO saved_moments (id, relationship_id, session_id, room_id, game_id, prompt_text, answer_a, answer_b, saved_by, created_at)
          VALUES (${item.payload.momentId}, ${item.payload.relationshipId}, ${item.payload.sessionId || null}, ${item.payload.roomId}, ${item.payload.gameId}, ${item.payload.promptText}, ${item.payload.answerA}, ${item.payload.answerB}, ${item.payload.savedBy}, NOW())
          ON CONFLICT (id) DO NOTHING
        `;
        break;
      default:
        console.warn(`[Reconciliation] Unknown operation: ${item.operation}`);
    }

    metricsManager.increment('reconciliationSuccess');
    console.log(`[Reconciliation] Successfully reconciled ${item.operation}`);
    
    // Process next immediately if there are more
    setImmediate(processQueue);
  } catch (err) {
    console.error(`[Reconciliation] Failed to reconcile item:`, err);
    // Note: in a production system, we would increment retryCount and LPUSH it back
    // if retryCount < MAX_RETRIES. For now, it will be dropped if the query fundamentally fails,
    // or if the DB goes down mid-query, it's lost. We could use RPOPLPUSH for safer atomic queues.
  }
}

function startReconciliationWorker() {
  console.log('👷 [Reconciliation] Worker started.');
  setInterval(processQueue, 5000); // Check every 5 seconds
}

module.exports = {
  startReconciliationWorker
};
