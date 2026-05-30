const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

async function run() {
  const sql = postgres(process.env.DATABASE_URL.replace(/"/g, ''), { prepare: false });
  try {
    console.log('Connecting to database...');
    const games = await sql`SELECT id, slug, title FROM games`;
    console.log('Games in DB:', games);

    const couples = await sql`SELECT id, status FROM couples`;
    console.log('Couples in DB:', couples);
  } catch (err) {
    console.error('Error querying DB:', err);
  } finally {
    await sql.end();
  }
}

run();
