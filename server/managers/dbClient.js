const postgres = require('postgres');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

let sql = null;
const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl) {
  try {
    const cleanedUrl = databaseUrl.replace(/"/g, '');
    sql = postgres(cleanedUrl, { prepare: false });
    console.log('[DB] postgres database client initialized successfully.');
  } catch (err) {
    console.warn('[DB] Failed to initialize postgres client:', err.message);
  }
} else {
  console.warn('[DB] DATABASE_URL env variable not found.');
}

async function createGameSession(gameSlug) {
  const sessionId = crypto.randomUUID();
  let coupleId = crypto.randomUUID(); // Fallback UUID
  let gameId = crypto.randomUUID();   // Fallback UUID

  if (!sql) {
    console.log(`[DB] Offline fallback: Using generated sessionId: ${sessionId}`);
    return sessionId;
  }

  try {
    // 1. Resolve game UUID by slug
    const resolvedGames = await sql`
      SELECT id FROM games WHERE slug = ${gameSlug} LIMIT 1
    `;
    if (resolvedGames && resolvedGames.length > 0) {
      gameId = resolvedGames[0].id;
    } else {
      // If the game does not exist by slug, fallback to any game in DB
      const anyGames = await sql`SELECT id FROM games LIMIT 1`;
      if (anyGames && anyGames.length > 0) {
        gameId = anyGames[0].id;
      }
    }

    // 2. Resolve couple UUID
    const resolvedCouples = await sql`
      SELECT id FROM couples LIMIT 1
    `;
    if (resolvedCouples && resolvedCouples.length > 0) {
      coupleId = resolvedCouples[0].id;
    }

    // 3. Insert game session record
    const [session] = await sql`
      INSERT INTO game_sessions (id, couple_id, game_id, status, state, started_at)
      VALUES (${sessionId}, ${coupleId}, ${gameId}, 'active', ${sql.json({})}, NOW())
      RETURNING id
    `;

    console.log(`[DB] Successfully created game_session record: ${session.id}`);
    return session.id;
  } catch (err) {
    console.warn(`[DB] Error creating game session in DB: ${err.message}. Falling back to generated sessionId.`);
    return sessionId;
  }
}

async function endGameSession(sessionId, status = 'completed') {
  if (!sessionId) return;
  if (!sql) {
    console.log(`[DB] Offline fallback: Ending sessionId: ${sessionId} with status: ${status}`);
    return;
  }

  try {
    await sql`
      UPDATE game_sessions
      SET status = ${status}, completed_at = NOW()
      WHERE id = ${sessionId} AND status = 'active'
    `;
    console.log(`[DB] Successfully ended game_session ${sessionId} with status ${status}`);
  } catch (err) {
    console.warn(`[DB] Error ending game session in DB: ${err.message}`);
  }
}

async function saveMoment({ relationshipId, sessionId, roomId, gameId, promptText, answerA, answerB, savedBy }) {
  const momentId = crypto.randomUUID();
  let resolvedRelationshipId = relationshipId;
  let resolvedGameId = gameId;

  if (!sql) {
    console.log(`[DB] Offline fallback: Saving moment: ${momentId} by ${savedBy}`);
    return momentId;
  }

  try {
    // 1. Resolve relationship/couple ID from session if not provided
    if (sessionId && !resolvedRelationshipId) {
      const sessions = await sql`
        SELECT couple_id, game_id FROM game_sessions WHERE id = ${sessionId} LIMIT 1
      `;
      if (sessions && sessions.length > 0) {
        resolvedRelationshipId = sessions[0].couple_id;
        resolvedGameId = resolvedGameId || sessions[0].game_id;
      }
    }

    // 2. Fallback to any couple in DB if still empty
    if (!resolvedRelationshipId) {
      const couplesList = await sql`SELECT id FROM couples LIMIT 1`;
      if (couplesList && couplesList.length > 0) {
        resolvedRelationshipId = couplesList[0].id;
      } else {
        resolvedRelationshipId = crypto.randomUUID();
      }
    }

    // 3. Fallback gameId
    if (!resolvedGameId) {
      resolvedGameId = 'unknown_game';
    }

    // 4. Insert saved moment record
    const [moment] = await sql`
      INSERT INTO saved_moments (id, relationship_id, session_id, room_id, game_id, prompt_text, answer_a, answer_b, saved_by, created_at)
      VALUES (${momentId}, ${resolvedRelationshipId}, ${sessionId || null}, ${roomId}, ${resolvedGameId}, ${promptText}, ${answerA}, ${answerB}, ${savedBy}, NOW())
      RETURNING id
    `;
    console.log(`[DB] Successfully saved moment ${moment.id}`);
    return moment.id;
  } catch (err) {
    console.warn(`[DB] Error saving moment in DB: ${err.message}. Falling back to generated momentId.`);
    return momentId;
  }
}

module.exports = {
  sql,
  createGameSession,
  endGameSession,
  saveMoment
};
