const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_9rXC3GEyFUKx@ep-dry-recipe-baxh40lf-pooler.c-8.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

const updates = [
  { id: 'cmvzpz34q00022cn7vvkw6ic7', img: '/images/products/nano-flower-bouquet.jpg' },
  { id: 'cmvzpz39900032cn7ffh6u8rc', img: '/images/products/piano-nano-blocks.jpg' },
  { id: 'cmvzpz3c900042cn7iscyyq2n', img: '/images/products/sakura-treehouse.jpg' },
  { id: 'cmvzpz3fb00052cn7r9thyxfw', img: '/images/products/bedazzle-crystal-pen.png' },
  { id: 'cmvzpz3id00062cn7qgpgnnxf', img: '/images/products/rhinestone-sticker-sheets.png' },
  { id: 'cmvzpz3le00072cn75391dz5s', img: '/images/products/desk-makeup-organizer.png' },
  { id: 'cmvzpz3od00082cn7d50bcq54', img: '/images/products/brush-holder-rotating.jpg' },
  { id: 'cmvzpz3ra00092cn7za86a1tl', img: '/images/products/pocket-coloring-book-markers.png' },
  { id: 'cmvzpz3u8000a2cn7efr9fqa9', img: '/images/products/3d-stickers-collection.png' },
  { id: 'cmvzpz3x4000b2cn7lys4e1c8', img: '/images/products/blind-box-mystery.png' },
  { id: 'cmvzpz3zz000c2cn77gplvfl5', img: '/images/products/pink-thermal-printer.jpg' },
  { id: 'cmvzpz42w000d2cn7p6dsopca', img: '/images/products/luxury-gift-box.png' },
];

async function run() {
  for (const item of updates) {
    const res = await pool.query('UPDATE "Product" SET "image" = $1 WHERE "id" = $2 RETURNING "id", "nameAr", "image"', [item.img, item.id]);
    if (res.rows.length > 0) {
      console.log(`Updated: ${res.rows[0].nameAr} -> ${res.rows[0].image}`);
    } else {
      console.log(`Product ID not found: ${item.id}`);
    }
  }
  await pool.end();
}

run().catch(console.error);
