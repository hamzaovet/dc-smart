const { Pool } = require('pg');

const poolRovy = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_KynD7uAa6vZr@ep-muddy-math-b9j80lh8-pooler.c-7.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res = await poolRovy.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    console.log('Tables in rovy-store Neon:');
    console.log(res.rows.map(r => r.table_name));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await poolRovy.end();
  }
}

main();
