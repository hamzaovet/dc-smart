import { prisma } from "../lib/prisma";

async function main() {
  const addressAr = "مصر الجديدة — طريق العروبة ومساكن شيراتون (بالقرب من مطار القاهرة) — القاهرة";
  const addressEn = "Heliopolis — El-Orouba Rd & Sheraton (Near Cairo Airport) — Cairo";
  const googleMapsUrl = "https://maps.app.goo.gl/z2QCHZzSuJaaNHPV7";

  const settings = await prisma.storeSettings.upsert({
    where: { id: "rovy_settings" },
    create: {
      id: "rovy_settings",
      storeNameAr: "ميني بيك — بوتيك الألعاب التركيبية والهدايا الترند",
      storeNameEn: "Mini Pick — Haute Parfumerie",
      taglineAr: "أحدث المنتجات والقطع العالمية والأصلية وبدائل النيش الملكية بدقة وفخامة استثنائي",
      taglineEn: "Exclusive Designer, Authentic Testers & Inspired Niche Fragrances",
      whatsappPhone: "01503012856",
      hotline: "01503012856",
      secondaryPhone: "01556718249",
      googleMapsUrl,
      addressAr,
      addressEn,
      workingHoursAr: "يومياً من 10 صباحاً وحتى 12 منتصف الليل",
      workingHoursEn: "Daily from 10:00 AM to 12:00 Midnight",
      instagramHandle: "rovystore2",
      announcementAr: "✨ شحن مجاني لكافة محافظات مصر للطلبات فوق 1500 ج.م + عينات مجانية فاخرة ✨",
      announcementEn: "✨ Free express delivery across Egypt on orders over 1500 EGP + complimentary samples ✨",
      deliveryFee: 50.0,
      freeShippingThreshold: 1500.0,
    },
    update: {
      whatsappPhone: "01503012856",
      hotline: "01503012856",
      secondaryPhone: "01556718249",
      googleMapsUrl,
      addressAr,
      addressEn,
      workingHoursAr: "يومياً من 10 صباحاً وحتى 12 منتصف الليل",
      workingHoursEn: "Daily from 10:00 AM to 12:00 Midnight",
      instagramHandle: "rovystore2",
    },
  });

  console.log("Successfully updated Neon DB settings with Heliopolis address:", settings);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
