const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_os6Qxh0qRywa@ep-long-grass-baxgsl9f-pooler.c-8.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  const store = await client.query('SELECT "storeNameAr", "whatsappPhone", "hotline", "addressAr" FROM "StoreSettings" LIMIT 1');
  const prods = await client.query('SELECT count(*) FROM "Product"');
  const users = await client.query('SELECT username, role, pin FROM "User"');
  const cats = await client.query('SELECT id, "nameAr" FROM "Category"');
  console.log('Store:', JSON.stringify(store.rows[0]));
  console.log('Product count:', prods.rows[0].count);
  console.log('Categories count:', cats.rows.length);
  console.log('Categories sample:', cats.rows.slice(0, 3));
  console.log('Users:', users.rows);
  await client.end();
}

main().catch(console.error);
