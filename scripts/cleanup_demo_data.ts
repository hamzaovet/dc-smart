import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("Cleaning up all demo data for live production...");

  // 1. Delete all demo orders
  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`Cleared ${deletedOrders.count} demo orders.`);

  // 2. Delete all demo customers
  const deletedCustomers = await prisma.customer.deleteMany({});
  console.log(`Cleared ${deletedCustomers.count} demo customers.`);

  // 3. Delete all demo expenses
  const deletedExpenses = await prisma.expense.deleteMany({});
  console.log(`Cleared ${deletedExpenses.count} demo expenses.`);

  // 4. Reset StoreSettings with clean boutique details
  await prisma.storeSettings.upsert({
    where: { id: "rovy_settings" },
    update: {
      whatsappPhone: "01000000000",
      hotline: "01000000000",
      addressAr: "القاهرة والشيخ زايد — شحن سريع لجميع المحافظات",
      addressEn: "Cairo & Sheikh Zayed — Express Delivery All Egypt",
      workingHoursAr: "يومياً من 10 صباحاً وحتى 12 منتصف الليل",
      workingHoursEn: "Daily from 10:00 AM to 12:00 Midnight",
      instagramHandle: "rovystore2",
      announcementAr: "✨ شحن مجاني للطلبات فوق 1500 ج.م + عينات مجانية فاخرة مع كل طلب ✨",
      announcementEn: "✨ Free shipping on orders over 1500 EGP + complimentary luxury samples with every order ✨",
      deliveryFee: 50.0,
      freeShippingThreshold: 1500.0,
    },
    create: {
      id: "rovy_settings",
      whatsappPhone: "01000000000",
      hotline: "01000000000",
      addressAr: "القاهرة والشيخ زايد — شحن سريع لجميع المحافظات",
      addressEn: "Cairo & Sheikh Zayed — Express Delivery All Egypt",
      workingHoursAr: "يومياً من 10 صباحاً وحتى 12 منتصف الليل",
      workingHoursEn: "Daily from 10:00 AM to 12:00 Midnight",
      instagramHandle: "rovystore2",
      announcementAr: "✨ شحن مجاني للطلبات فوق 1500 ج.م + عينات مجانية فاخرة مع كل طلب ✨",
      announcementEn: "✨ Free shipping on orders over 1500 EGP + complimentary luxury samples with every order ✨",
      deliveryFee: 50.0,
      freeShippingThreshold: 1500.0,
    },
  });
  console.log("StoreSettings reset with clean boutique data.");

  console.log("Cleanup completed successfully! All demo records removed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
