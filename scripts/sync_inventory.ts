import { prisma } from "../lib/prisma";

async function main() {
  console.log("Starting fast batch inventory sync...");
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products in catalog.`);

  const existingItems = await prisma.inventoryItem.findMany({ select: { name: true } });
  const existingNames = new Set(existingItems.map((i) => i.name));

  const toInsert = products
    .filter((p) => !existingNames.has(p.nameAr))
    .map((p) => ({
      name: p.nameAr,
      category:
        p.type === "HD Camera" || p.type === "CCTV"
          ? "كاميرات مراقبة وأجهزة تسجيل"
          : "أجهزة وأنظمة أمنية",
      quantity: p.stockQuantity || 50,
      unit: "قطعة",
      minStock: 10,
      costPerUnit: p.price ? Math.round(p.price * 0.8) : 0,
      supplier: p.brandAr || "الموزع المعتمد",
    }));

  if (toInsert.length > 0) {
    const res = await prisma.inventoryItem.createMany({ data: toInsert });
    console.log(`Inserted ${res.count} new items into Inventory.`);
  } else {
    console.log("All products are already present in inventory.");
  }

  const total = await prisma.inventoryItem.count();
  console.log(`Total items in inventory now: ${total}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Sync error:", err);
  process.exit(1);
});
