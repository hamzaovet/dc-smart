import { prisma } from "../lib/prisma";

// UNV Models extracted from MSRP_Q4-HD.pdf
const UNV_ITEMS = [
  // Cameras
  { model: "UAC-T112-F28-X", msrpUsd: 10.9, type: "HD Camera", sub: "داخلي (Turret)", desc: "كاميرا يوني فيو 2 ميجا داخلي عدسة 2.8 مم مع رؤية ليلية" },
  { model: "UAC-B112-F40-X", msrpUsd: 10.9, type: "HD Camera", sub: "خارجي (Bullet)", desc: "كاميرا يوني فيو 2 ميجا خارجي عدسة 4.0 مم مقاومة للطقس IP67" },
  { model: "UAC-D112-F28-X", msrpUsd: 11.0, type: "HD Camera", sub: "داخلي (Dome)", desc: "كاميرا يوني فيو دوم 2 ميجا بلاستيك داخلي" },
  { model: "UAC-T112-AF28", msrpUsd: 12.3, type: "HD Camera", sub: "داخلي مع مايك", desc: "كاميرا يوني فيو 2 ميجا داخلي مع مايكروفون مدمج صوت وصورة" },
  { model: "UAC-B112-AF40", msrpUsd: 12.3, type: "HD Camera", sub: "خارجي مع مايك", desc: "كاميرا يوني فيو 2 ميجا خارجي مع مايك مدمج صوت وصورة IP67" },
  { model: "UAC-B115-F40", msrpUsd: 18.8, type: "HD Camera", sub: "خارجي 5 ميجا", desc: "كاميرا يوني فيو خارجي فائقة الوضوح 5 ميجا 4K عدسة 4.0 مم" },
  { model: "UAC-T115-F28", msrpUsd: 18.8, type: "HD Camera", sub: "داخلي 5 ميجا", desc: "كاميرا يوني فيو داخلي فائقة الوضوح 5 ميجا عدسة 2.8 مم" },
  { model: "UAC-D115-F28-X", msrpUsd: 19.0, type: "HD Camera", sub: "داخلي دوم 5 ميجا", desc: "كاميرا دوم يوني فيو 5 ميجا الترا HD" },
  { model: "UAC-D115-F28", msrpUsd: 19.0, type: "HD Camera", sub: "داخلي دوم 5 ميجا", desc: "كاميرا يوني فيو دوم داخلي 5 ميجا معدن" },
  { model: "UAC-T112-F28-W", msrpUsd: 20.9, type: "HD Camera", sub: "ملون 24 ساعة ColorHunter", desc: "كاميرا يوني فيو 2 ميجا ملون ليل نهار مع كشاف LED أبيض" },
  { model: "UAC-D122-AF28M", msrpUsd: 21.0, type: "HD Camera", sub: "داخلي معدن مع مايك", desc: "كاميرا يوني فيو 2 ميجا معدن داخلي مدمج بها مايكروفون" },
  { model: "UAC-T122-AF28LM", msrpUsd: 21.0, type: "HD Camera", sub: "داخلي مايك وإضاءة", desc: "كاميرا يوني فيو 2 ميجا داخلي مع مايك وإضاءة ذكية" },
  { model: "UAC-B112-F40-W-X", msrpUsd: 21.3, type: "HD Camera", sub: "خارجي ملون ColorHunter", desc: "كاميرا يوني فيو خارجي ملون ليل نهار Full Color 2MP" },
  { model: "UAC-B115-AF40", msrpUsd: 21.3, type: "HD Camera", sub: "خارجي 5 ميجا مايك", desc: "كاميرا يوني فيو 5 ميجا خارجي مع مايكروفون صوت وصورة" },
  { model: "UAC-T115-AF28", msrpUsd: 21.3, type: "HD Camera", sub: "داخلي 5 ميجا مايك", desc: "كاميرا يوني فيو 5 ميجا داخلي مع مايك صوت وصورة" },
  { model: "UAC-B112-AF40-W", msrpUsd: 22.4, type: "HD Camera", sub: "خارجي ملون مع مايك", desc: "كاميرا يوني فيو خارجي ملون 24 ساعة مع مايكروفون" },
  { model: "UAC-T112-AF28-W", msrpUsd: 22.4, type: "HD Camera", sub: "داخلي ملون مع مايك", desc: "كاميرا يوني فيو داخلي ملون 24 ساعة مع مايكروفون" },
  { model: "UAC-B122-AF40LM", msrpUsd: 25.2, type: "HD Camera", sub: "خارجي معدن ملون مايك", desc: "كاميرا يوني فيو خارجي 2 ميجا معدن مايكروفون وكشاف ليد" },
  { model: "UAC-T115-F28-W", msrpUsd: 26.1, type: "HD Camera", sub: "داخلي 5 ميجا ملون", desc: "كاميرا يوني فيو 5 ميجا ملون ليل نهار ColorHunter" },
  { model: "UAC-B122-AF40M-W", msrpUsd: 27.2, type: "HD Camera", sub: "خارجي 2 ميجا ملون معدن", desc: "كاميرا يوني فيو خارجي معدن مقاومة للصدمات ملون مايك" },
  { model: "UAC-T122-AF28M-W", msrpUsd: 27.2, type: "HD Camera", sub: "داخلي 2 ميجا ملون معدن", desc: "كاميرا يوني فيو داخلي معدن ملون مع مايكروفون" },
  { model: "UAC-B115-F40-W", msrpUsd: 27.2, type: "HD Camera", sub: "خارجي 5 ميجا ملون", desc: "كاميرا يوني فيو 5 ميجا ملون خارجي Full Color 5MP" },
  { model: "UAC-B142-AF40LM-DL 2MP", msrpUsd: 27.7, type: "HD Camera", sub: "ذكاء اصطناعي Dual-Light", desc: "كاميرا يوني فيو 2 ميجا إضاءة مزدوجة ذكية IR + White LED ومايك" },
  { model: "UAC-T125-AF28LM", msrpUsd: 30.8, type: "HD Camera", sub: "داخلي 5 ميجا معدن مايك", desc: "كاميرا يوني فيو 5 ميجا معدن مع مايكروفون وإضاءة" },
  { model: "UAC-B115-AF40-W", msrpUsd: 30.8, type: "HD Camera", sub: "خارجي 5 ميجا ملون مايك", desc: "كاميرا يوني فيو 5 ميجا خارجي ملون ومايكروفون" },
  { model: "UAC-B142-ACF40LM-DL", msrpUsd: 27.5, type: "HD Camera", sub: "Dual-Light 2MP", desc: "كاميرا يوني فيو خارجي إضاءة ذكية مزدوجة ومايك" },
  { model: "UAC-T142-ACF28LM-DL", msrpUsd: 27.5, type: "HD Camera", sub: "Dual-Light داخلي", desc: "كاميرا يوني فيو داخلي إضاءة ذكية مزدوجة ومايك" },
  { model: "UAC-T115-AF28-W", msrpUsd: 32.5, type: "HD Camera", sub: "داخلي 5 ميجا ملون مايك", desc: "كاميرا يوني فيو 5 ميجا داخلي ملون 24 ساعة مع مايك" },
  { model: "UAC-B145-AF40LM-DL", msrpUsd: 34.2, type: "HD Camera", sub: "Dual-Light 5MP خارجي", desc: "كاميرا يوني فيو 5 ميجا إضاءة مزدوجة ذكية ومايك خارجي" },
  { model: "UAC-T125-AF28M-W", msrpUsd: 34.7, type: "HD Camera", sub: "داخلي 5 ميجا ملون معدن", desc: "كاميرا يوني فيو 5 ميجا ملون معدن ومايك داخلي" },
  { model: "UAC-B125-AF40M-W", msrpUsd: 35.0, type: "HD Camera", sub: "خارجي 5 ميجا ملون معدن", desc: "كاميرا يوني فيو 5 ميجا ملون معدن ومايك خارجي" },
  { model: "UAC-P112-AF40-W", msrpUsd: 58.8, type: "HD Camera", sub: "كاميرا متحركة PTZ", desc: "كاميرا يوني فيو PTZ متحركة ملونة مع زووم ومايك" },
  { model: "UAC-B134-ADF40MS-W", msrpUsd: 58.8, type: "HD Camera", sub: "سلسلة احترافية 4K", desc: "كاميرا يوني فيو احترافية 4K مع إنذار صوتي وضوئي" },

  // XVR Recorders
  { model: "XVR301-04F", msrpUsd: 38.7, type: "CCTV", sub: "أجهزة تسجيل 4 قنوات", desc: "جهاز تسجيل يوني فيو 4 قنوات 1080p Lite XVR" },
  { model: "XVR301-04G3", msrpUsd: 49.3, type: "CCTV", sub: "أجهزة تسجيل 4 قنوات G3", desc: "جهاز تسجيل يوني فيو 4 قنوات يدعم 2 ميجا 1080p كامل H.265" },
  { model: "XVR301-04Q3", msrpUsd: 80.1, type: "CCTV", sub: "أجهزة تسجيل 4 قنوات 5MP", desc: "جهاز تسجيل يوني فيو 4 قنوات يدعم حتى 5 ميجا الترا HD" },
  { model: "XVR301-04Q4", msrpUsd: 88.0, type: "CCTV", sub: "أجهزة تسجيل 4 قنوات 4K", desc: "جهاز تسجيل يوني فيو 4 قنوات يدعم كاميرات بدقة 4K 8MP" },

  { model: "XVR301-08F", msrpUsd: 49.6, type: "CCTV", sub: "أجهزة تسجيل 8 قنوات", desc: "جهاز تسجيل يوني فيو 8 قنوات 1080p Lite" },
  { model: "XVR301-08G3", msrpUsd: 63.9, type: "CCTV", sub: "أجهزة تسجيل 8 قنوات G3", desc: "جهاز تسجيل يوني فيو 8 قنوات يدعم 2 ميجا كامل وذكاء اصطناعي" },
  { model: "XVR301-08Q3", msrpUsd: 117.1, type: "CCTV", sub: "أجهزة تسجيل 8 قنوات 5MP", desc: "جهاز تسجيل يوني فيو 8 قنوات يدعم كاميرات 5 ميجا" },
  { model: "XVR301-08Q4", msrpUsd: 138.0, type: "CCTV", sub: "أجهزة تسجيل 8 قنوات 4K", desc: "جهاز تسجيل يوني فيو 8 قنوات 4K يدعم 1 هارد حتى 10 تيرا" },
  { model: "XVR302-08U3", msrpUsd: 257.7, type: "CCTV", sub: "أجهزة تسجيل 8 قنوات (2 هارد)", desc: "جهاز تسجيل يوني فيو احترافي 8 قنوات 4K يدعم 2 هارد" },

  { model: "XVR301-16F", msrpUsd: 100.0, type: "CCTV", sub: "أجهزة تسجيل 16 قناة", desc: "جهاز تسجيل يوني فيو 16 قناة 1080p Lite" },
  { model: "XVR301-16G3", msrpUsd: 121.8, type: "CCTV", sub: "أجهزة تسجيل 16 قناة G3", desc: "جهاز تسجيل يوني فيو 16 قناة H.265 عالي الدقة" },
  { model: "XVR301-16Q3", msrpUsd: 209.8, type: "CCTV", sub: "أجهزة تسجيل 16 قناة 5MP", desc: "جهاز تسجيل يوني فيو 16 قناة يدعم حتى 5 ميجا" },
  { model: "XVR302-16Q3", msrpUsd: 245.9, type: "CCTV", sub: "أجهزة تسجيل 16 قناة (2 هارد)", desc: "جهاز تسجيل يوني فيو 16 قناة 5 ميجا يدعم 2 هارد ديسك" },
  { model: "XVR302-16Q4", msrpUsd: 278.0, type: "CCTV", sub: "أجهزة تسجيل 16 قناة 4K", desc: "جهاز تسجيل يوني فيو 16 قناة 4K احترافي يدعم 2 هارد" },
  { model: "XVR302-16U3", msrpUsd: 451.0, type: "CCTV", sub: "أجهزة تسجيل 16 قناة ألترا", desc: "جهاز تسجيل يوني فيو فائق القدرة 16 قناة Ultra HD" },

  { model: "XVR302-32Q3", msrpUsd: 472.0, type: "CCTV", sub: "أجهزة تسجيل 32 قناة (2 هارد)", desc: "جهاز تسجيل يوني فيو عملاق 32 قناة يدعم 5 ميجا و2 هارد" },
  { model: "XVR304-32Q3", msrpUsd: 750.7, type: "CCTV", sub: "أجهزة تسجيل 32 قناة (4 هارد)", desc: "جهاز تسجيل يوني فيو للمنشآت الكبرى 32 قناة يدعم 4 هارد ديسك" },
];

const USD_RATE = 50.0; // Exchange rate to EGP

async function importUNV() {
  console.log("Importing UNV Price List Tree from PDF data...");

  // Ensure Category exists
  const unvCat = await prisma.category.upsert({
    where: { slug: "unv-uniarch" },
    update: {
      nameAr: "يوني فيو ويوني آرك (UNV / Uniarch)",
      nameEn: "UNV & Uniarch Solutions",
      descriptionAr: "كاميرات مراقبة وأجهزة تسجيل XVR/NVR من يوني فيو العالمية بنظام شجرة متكاملة",
    },
    create: {
      id: "cat_unv",
      nameAr: "يوني فيو ويوني آرك (UNV / Uniarch)",
      nameEn: "UNV & Uniarch Solutions",
      slug: "unv-uniarch",
      descriptionAr: "كاميرات مراقبة وأجهزة تسجيل XVR/NVR من يوني فيو العالمية بنظام شجرة متكاملة",
    },
  });

  let addedCount = 0;

  for (const item of UNV_ITEMS) {
    const egpPrice = Math.round(item.msrpUsd * USD_RATE);
    const fullNameAr = `UNV ${item.model} — ${item.desc}`;
    const slug = `unv-${item.model.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const defaultImg =
      item.type === "CCTV"
        ? "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80";

    // Upsert into Product
    await prisma.product.upsert({
      where: { slug },
      update: {
        nameAr: fullNameAr,
        price: egpPrice,
        brandAr: "UNV",
        brandEn: "UNV",
        type: item.type,
        concentration: item.sub,
        descriptionAr: `${item.desc} | السعر بالدولار طبقاً لقائمة الأسعار الرسمية: $${item.msrpUsd} (MSRP).`,
        inStock: true,
      },
      create: {
        nameAr: fullNameAr,
        nameEn: `UNV ${item.model}`,
        slug,
        brandAr: "UNV",
        brandEn: "UNV",
        type: item.type,
        concentration: item.sub,
        volume: "المواصفة الرسمية",
        price: egpPrice,
        originalPrice: Math.round(egpPrice * 1.15),
        inStock: true,
        stockQuantity: 25,
        categoryId: unvCat.id,
        image: defaultImg,
        descriptionAr: `${item.desc} | السعر بالدولار طبقاً لقائمة الأسعار الرسمية: $${item.msrpUsd} (MSRP).`,
        descriptionEn: `Official UNV ${item.model} with MSRP $${item.msrpUsd}`,
        topNotesAr: item.sub,
        topNotesEn: item.sub,
        heartNotesAr: "عدسات عالية النقاء ومستشعرات سوني",
        heartNotesEn: "HD Sensors",
        baseNotesAr: "ضمان سنتين الوكيل المعتمد",
        baseNotesEn: "2 Years Warranty",
      },
    });

    // Also sync to InventoryItem
    const existingInv = await prisma.inventoryItem.findFirst({
      where: { name: fullNameAr },
    });

    if (!existingInv) {
      await prisma.inventoryItem.create({
        data: {
          name: fullNameAr,
          category: item.type === "CCTV" ? "أجهزة تسجيل XVR و NVR" : "كاميرات مراقبة",
          quantity: 25,
          unit: "قطعة",
          costPerUnit: Math.round(egpPrice * 0.8),
          supplier: "UNV Egypt",
        },
      });
    }

    addedCount++;
  }

  console.log(`Successfully imported/synced ${addedCount} UNV products with category tree!`);
  process.exit(0);
}

importUNV().catch((err) => {
  console.error(err);
  process.exit(1);
});
