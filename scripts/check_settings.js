const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_9rXC3GEyFUKx@ep-dry-recipe-baxh40lf.c-8.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  const res = await client.query('SELECT "storeNameAr", "hotline", "whatsappPhone", "secondaryPhone", "addressAr" FROM "StoreSettings"');
  console.log('StoreSettings in Neon:', JSON.stringify(res.rows, null, 2));
  await client.end();
}

main().catch(console.error);
