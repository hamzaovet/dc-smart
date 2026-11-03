import { prisma } from "../lib/prisma";

async function main() {
  const settings = await prisma.storeSettings.upsert({
    where: { id: "rovy_settings" },
    create: {
      id: "rovy_settings",
      storeNameAr: "دي سي سمارت — للأنظمة الأمنية والتحكم الذكي",
      storeNameEn: "DC Smart — Smart Security & Technology Solutions",
      taglineAr: "كاميرات مراقبة متطورة بدقة 4K و Full Color، أجهزة XVR/NVR، شبكات وحلول أمنية ذكية",
      taglineEn: "Advanced 4K & Full Color CCTV Surveillance, XVR/NVR Recording & Smart Security Solutions",
      whatsappPhone: "01281248731",
      hotline: "01008657085",
      secondaryPhone: "01007302685",
      googleMapsUrl: "https://maps.google.com/?q=Tanta,Gharbia,Egypt",
      addressAr: "طنطا — محافظة الغربية — جمهورية مصر العربية",
      addressEn: "Tanta, Gharbia Governorate, Egypt",
      workingHoursAr: "يومياً من 9:00 صباحاً حتى 11:00 مساءً",
      workingHoursEn: "Daily from 9:00 AM to 11:00 PM",
      instagramHandle: "dcsmart.cctv",
      announcementAr: "🛡️ ضمان عامين شامل استبدال فوري لكافة كاميرات المراقبة وأجهزة التسجيل + معاينة وتركيب احترافي",
      announcementEn: "🛡️ 2-Year Full Replacement Warranty on all CCTV Cameras & DVRs + Professional Installation",
      deliveryFee: 50.0,
      freeShippingThreshold: 5000.0,
    },
    update: {
      storeNameAr: "دي سي سمارت — للأنظمة الأمنية والتحكم الذكي",
      storeNameEn: "DC Smart — Smart Security & Technology Solutions",
      taglineAr: "كاميرات مراقبة متطورة بدقة 4K و Full Color، أجهزة XVR/NVR، شبكات وحلول أمنية ذكية",
      taglineEn: "Advanced 4K & Full Color CCTV Surveillance, XVR/NVR Recording & Smart Security Solutions",
      whatsappPhone: "01281248731",
      hotline: "01008657085",
      secondaryPhone: "01007302685",
      googleMapsUrl: "https://maps.google.com/?q=Tanta,Gharbia,Egypt",
      addressAr: "طنطا — محافظة الغربية — جمهورية مصر العربية",
      addressEn: "Tanta, Gharbia Governorate, Egypt",
      workingHoursAr: "يومياً من 9:00 صباحاً حتى 11:00 مساءً",
      workingHoursEn: "Daily from 9:00 AM to 11:00 PM",
      instagramHandle: "dcsmart.cctv",
      announcementAr: "🛡️ ضمان عامين شامل استبدال فوري لكافة كاميرات المراقبة وأجهزة التسجيل + معاينة وتركيب احترافي",
      announcementEn: "🛡️ 2-Year Full Replacement Warranty on all CCTV Cameras & DVRs + Professional Installation",
    },
  });

  console.log("Successfully updated Neon DB settings with DC Smart security values:", settings.storeNameAr);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
