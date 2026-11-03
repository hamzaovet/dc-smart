const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connStr =
  'postgresql://neondb_owner:npg_9rXC3GEyFUKx@ep-dry-recipe-baxh40lf.c-8.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
  connectionString: connStr,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log('Connecting to Neon Direct PostgreSQL...');
  await client.connect();

  const fullSql = fs.readFileSync(path.join(__dirname, 'init_schema.sql'), 'utf-8');

  // Split by semicolon
  const statements = fullSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`Found ${statements.length} SQL statements to execute.`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await client.query(stmt);
      process.stdout.write('.');
    } catch (err) {
      console.warn(`\nWarning on stmt ${i + 1}: ${err.message}`);
    }
  }

  console.log('\n✅ SQL execution completed!');

  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);
  console.log('Created Tables in Neon DB:');
  console.log(res.rows.map(r => r.table_name));

  await client.end();
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
