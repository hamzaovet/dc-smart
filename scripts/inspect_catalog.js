const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_9rXC3GEyFUKx@ep-dry-recipe-baxh40lf-pooler.c-8.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  const cats = await client.query('SELECT id, "nameAr", "nameEn" FROM "Category" ORDER BY "sortOrder" ASC');
  const prods = await client.query('SELECT id, "nameAr", "brandAr", price, image, "categoryId" FROM "Product"');
  console.log("Categories:", cats.rows);
  console.log("Products count:", prods.rows.length);
  for (const p of prods.rows) {
    console.log(`- [${p.id}] ${p.nameAr} | Price: ${p.price} | Image: ${p.image}`);
  }
  await client.end();
}

main().catch(console.error);
