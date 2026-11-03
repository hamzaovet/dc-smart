const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_os6Qxh0qRywa@ep-long-grass-baxgsl9f-pooler.c-8.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  const res = await client.query('SELECT DISTINCT image FROM "Product"');
  console.log('Distinct images count:', res.rows.length);
  console.log('Distinct images:', res.rows);

  const s = await client.query('SELECT * FROM "StoreSettings" LIMIT 1');
  console.log('StoreSettings:', s.rows[0]);

  const pSample = await client.query('SELECT id, name, "categoryId", image FROM "Product" LIMIT 10');
  console.log('Product samples:', pSample.rows);

  await client.end();
}

main().catch(console.error);
