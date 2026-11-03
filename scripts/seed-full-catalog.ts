import "dotenv/config";
import { prisma } from "../lib/prisma";

async function populateCatalog() {
  console.log("⚡ Populating Full DC Smart CCTV & Security Catalog (150+ Items)...");

  // Ensure Categories
  const categoryList = [
    { id: "cat_dahua", nameAr: "داهوا (Dahua HD & IP)", nameEn: "Dahua Security", slug: "dahua", icon: "📹", sortOrder: 1 },
    { id: "cat_hilook", nameAr: "هيكفيجن وهاي لوك (Hikvision / HiLook)", nameEn: "Hikvision & HiLook", slug: "hilook", icon: "🎥", sortOrder: 2 },
    { id: "cat_unv", nameAr: "يوني فيو ويوني آرك (UNV / Uniarch)", nameEn: "UNV & Uniarch", slug: "unv-uniarch", icon: "🛡️", sortOrder: 3 },
    { id: "cat_electrotech", nameAr: "إلكتروتك (Electrotech)", nameEn: "Electrotech", slug: "electrotech", icon: "💡", sortOrder: 4 },
    { id: "cat_yes", nameAr: "يس أوريجينال (YES Original)", nameEn: "YES Original", slug: "yes-original", icon: "⭐", sortOrder: 5 },
    { id: "cat_wifi", nameAr: "كاميرات واي فاي وسمارت (Ezviz / Tenda)", nameEn: "Smart Wi-Fi Cameras", slug: "wifi-cameras", icon: "📶", sortOrder: 6 },
    { id: "cat_storage", nameAr: "هاردات التخزين والمراقبة (Storage)", nameEn: "Surveillance Storage", slug: "storage", icon: "💾", sortOrder: 7 },
    { id: "cat_power", nameAr: "باور سبلاي ومحولات (Power)", nameEn: "Power Supplies & Adapters", slug: "power", icon: "⚡", sortOrder: 8 },
    { id: "cat_cables", nameAr: "كابلات وأسلاك شبكات (Cables)", nameEn: "Cables & Wiring", slug: "cables", icon: "🔌", sortOrder: 9 },
    { id: "cat_accessories", nameAr: "بواطات وحوامل واكسسوارات (Mounts & Accessories)", nameEn: "Accessories & Racks", slug: "accessories", icon: "🧰", sortOrder: 10 },
  ];

  for (const cat of categoryList) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        nameAr: cat.nameAr,
        nameEn: cat.nameEn,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
      create: cat,
    });
  }

  const rawProducts = [
    // --- UNIARCH ---
    { name: "ARCH-UAC-T112-F28-Y", desc: "كاميرا يوني آرك داخلي 2 ميجا عالية الوضوح", brand: "UNIARCH", price: 300, cat: "cat_unv", type: "HD Camera" },
    { name: "ARCH-UAC-B112-F40-Y", desc: "كاميرا يوني آرك خارجي 2 ميجا مقاومة للطقس", brand: "UNIARCH", price: 300, cat: "cat_unv", type: "HD Camera" },
    { name: "ARCH-UAC-T112-AF28-Y", desc: "كاميرا يوني آرك داخلي 2 ميجا مايك صوت مدمج", brand: "UNIARCH", price: 375, cat: "cat_unv", type: "HD Camera" },
    { name: "ARCH-UAC-B112-AF40-Y", desc: "كاميرا يوني آرك خارجي 2 ميجا مايك صوت مدمج", brand: "UNIARCH", price: 370, cat: "cat_unv", type: "HD Camera" },
    { name: "ARCH-UAC-B112-F40--W-Y", desc: "كاميرا يوني آرك خارجي ألوان ليلية 2 ميجا كولور", brand: "UNIARCH", price: 625, cat: "cat_unv", type: "Full Color" },
    { name: "ARCH-UAC-B115-F28", desc: "كاميرا يوني آرك خارجي 5 ميجا فائقة الدقة", brand: "UNIARCH", price: 460, cat: "cat_unv", type: "HD Camera" },
    { name: "ARCH-UAC-XVR-104F", desc: "جهاز تسجيل يوني آرك 4 قنوات 2 ميجا XVR", brand: "UNIARCH", price: 1050, cat: "cat_unv", type: "XVR Recorder" },
    { name: "ARCH-UAC-XVR-108F", desc: "جهاز تسجيل يوني آرك 8 قنوات 2 ميجا XVR", brand: "UNIARCH", price: 1250, cat: "cat_unv", type: "XVR Recorder" },

    // --- YES ORIGINAL ---
    { name: "YES B240", desc: "كاميرا يس خارجي ألوان ليلية 2 ميجا", brand: "YES ORIGINAL", price: 480, cat: "cat_yes", type: "HD Camera" },
    { name: "YES D530A-P", desc: "كاميرا يس داخلي 5 ميجا ألوان ومايك مدمج", brand: "YES ORIGINAL", price: 892, cat: "cat_yes", type: "HD Camera" },
    { name: "YES-585 A", desc: "كاميرا يس داخلي 5 ميجا بمايك", brand: "YES ORIGINAL", price: 592, cat: "cat_yes", type: "HD Camera" },
    { name: "YES 16CH 5MP", desc: "جهاز تسجيل يس 16 قناة بدقة 5 ميجا", brand: "YES ORIGINAL", price: 2000, cat: "cat_yes", type: "XVR Recorder" },
    { name: "YES-IPC-B65", desc: "كاميرا شبكية IP خارجي 2 ميجا ألوان", brand: "YES ORIGINAL", price: 559, cat: "cat_yes", type: "IP Camera" },
    { name: "YES-IPC-D60", desc: "كاميرا شبكية IP داخلي 2 ميجا ألوان", brand: "YES ORIGINAL", price: 559, cat: "cat_yes", type: "IP Camera" },
    { name: "YES-IPC-B224", desc: "كاميرا شبكية IP خارجي 4 ميجا ألوان ومايك", brand: "YES ORIGINAL", price: 734, cat: "cat_yes", type: "IP Camera" },
    { name: "YES-IPC-D225", desc: "كاميرا شبكية IP داخلي 4 ميجا ألوان ومايك", brand: "YES ORIGINAL", price: 734, cat: "cat_yes", type: "IP Camera" },
    { name: "YES-IPC-B525", desc: "كاميرا شبكية IP خارجي 5 ميجا ألوان ومايك", brand: "YES ORIGINAL", price: 1129, cat: "cat_yes", type: "IP Camera" },
    { name: "YES-IPC-D524", desc: "كاميرا شبكية IP داخلي 5 ميجا ألوان ومايك", brand: "YES ORIGINAL", price: 1072, cat: "cat_yes", type: "IP Camera" },
    { name: "YES B5010", desc: "كاميرا يس خارجي 5 ميجا بانوراما 360 درجة", brand: "YES ORIGINAL", price: 816, cat: "cat_yes", type: "Panaromic" },
    { name: "YES P838", desc: "كاميرا متحركة PTZ صغيرة 2 ميجا", brand: "YES ORIGINAL", price: 944, cat: "cat_yes", type: "PTZ Camera" },
    { name: "YES-NVR508 8CH", desc: "مسجل شبكي NVR يس 8 قنوات 5 ميجا", brand: "YES ORIGINAL", price: 1173, cat: "cat_yes", type: "NVR Recorder" },
    { name: "YES-NVR516 16CH", desc: "مسجل شبكي NVR يس 16 قناة 5 ميجا", brand: "YES ORIGINAL", price: 1530, cat: "cat_yes", type: "NVR Recorder" },
    { name: "YES-NVR-5004P", desc: "مسجل شبكي NVR يس 4 قنوات POE مدمج 5MP", brand: "YES ORIGINAL", price: 1225, cat: "cat_yes", type: "PoE NVR" },
    { name: "YES-NVR-5008P", desc: "مسجل شبكي NVR يس 8 قنوات POE مدمج 5MP", brand: "YES ORIGINAL", price: 1540, cat: "cat_yes", type: "PoE NVR" },

    // --- TENDA & EZVIZ & DAHUA WIFI ---
    { name: "TENDA CP3", desc: "كاميرا تيندا واي فاي متحركة 3 ميجا", brand: "TENDA", price: 720, cat: "cat_wifi", type: "Smart Wi-Fi" },
    { name: "TENDA CP7", desc: "كاميرا تيندا واي فاي متحركة 4 ميجا بدقة 2K", brand: "TENDA", price: 1275, cat: "cat_wifi", type: "Smart Wi-Fi" },
    { name: "EZVIZ NVR-CS-X5S (4W)", desc: "مسجل لاسلكي إيزفيز NVR 4 قنوات واي فاي", brand: "EZVIZ", price: 2081, cat: "cat_wifi", type: "Wi-Fi NVR" },
    { name: "EZVIZ NVR-CS-X5S (8W)", desc: "مسجل لاسلكي إيزفيز NVR 8 قنوات واي فاي", brand: "EZVIZ", price: 2407, cat: "cat_wifi", type: "Wi-Fi NVR" },
    { name: "C3TN EZVIZ", desc: "كاميرا إيزفيز خارجي واي فاي مقاومة للماء 2 ميجا", brand: "EZVIZ", price: 2060, cat: "cat_wifi", type: "Outdoor Wi-Fi" },
    { name: "H3C COLOR EZVIZ 2M", desc: "كاميرا إيزفيز خارجي كلر ألوان ليلية 2 ميجا", brand: "EZVIZ", price: 1913, cat: "cat_wifi", type: "Color Wi-Fi" },
    { name: "DH-H3I", desc: "كاميرا داهوا داخلي واي فاي 3 ميجا", brand: "DAHUA", price: 700, cat: "cat_wifi", type: "Smart Wi-Fi" },
    { name: "DH-H5A", desc: "كاميرا داهوا داخلي واي فاي 5 ميجا مع منفذ LAN", brand: "DAHUA", price: 1050, cat: "cat_wifi", type: "Smart Wi-Fi" },

    // --- UNV UNIVIEW ---
    { name: "UAC-T112-F28-X", desc: "كاميرا يوني فيو داخلي 2 ميجا كبيرة", brand: "UNV", price: 365, cat: "cat_unv", type: "HD Camera" },
    { name: "UAC-B112-F40-X", desc: "كاميرا يوني فيو خارجي 2 ميجا", brand: "UNV", price: 355, cat: "cat_unv", type: "HD Camera" },
    { name: "UAC-T112-AF28", desc: "كاميرا يوني فيو داخلي 2 ميجا بمايك", brand: "UNV", price: 400, cat: "cat_unv", type: "HD Camera" },
    { name: "UAC-B112-AF40-W", desc: "كاميرا يوني فيو خارجي ألوان ومايك 2 ميجا", brand: "UNV", price: 730, cat: "cat_unv", type: "Full Color" },
    { name: "UAC-B112-AF-DL", desc: "كاميرا يوني فيو خارجي ألوان ومايك 2 كشاف ليد", brand: "UNV", price: 690, cat: "cat_unv", type: "Dual Light" },
    { name: "UAC-T115-AF28", desc: "كاميرا يوني فيو داخلي 5 ميجا بمايك", brand: "UNV", price: 675, cat: "cat_unv", type: "HD Camera" },
    { name: "UAC-B115-AF28", desc: "كاميرا يوني فيو خارجي 5 ميجا بمايك", brand: "UNV", price: 675, cat: "cat_unv", type: "HD Camera" },
    { name: "XVR301-04F", desc: "جهاز تسجيل يوني فيو 4 قنوات 2 ميجا", brand: "UNV", price: 1150, cat: "cat_unv", type: "XVR Recorder" },
    { name: "XVR301-08F", desc: "جهاز تسجيل يوني فيو 8 قنوات 2 ميجا", brand: "UNV", price: 1460, cat: "cat_unv", type: "XVR Recorder" },
    { name: "XVR301-08G3", desc: "جهاز تسجيل يوني فيو 8 قنوات 5 ميجا", brand: "UNV", price: 1850, cat: "cat_unv", type: "XVR Recorder" },
    { name: "XVR-302-08U3", desc: "جهاز تسجيل يوني فيو 8 قنوات 4K فوركيه عرض وتسجيل", brand: "UNV", price: 6300, cat: "cat_unv", type: "4K XVR" },

    // --- ELECTROTECH ---
    { name: "CAM IN 2MP ELECTRO COLOR", desc: "كاميرا إلكتروتك داخلي ألوان 2 ميجا", brand: "ELECTROTECH", price: 410, cat: "cat_electrotech", type: "HD Camera" },
    { name: "CAM IN 2MP FULL COLOR- MIC", desc: "كاميرا إلكتروتك داخلي ألوان ومايك 2 ميجا", brand: "ELECTROTECH", price: 500, cat: "cat_electrotech", type: "HD Camera" },
    { name: "CAM OUT 2MP FULL COLOR- MIC", desc: "كاميرا إلكتروتك خارجي ألوان ومايك 2 ميجا", brand: "ELECTROTECH", price: 500, cat: "cat_electrotech", type: "HD Camera" },
    { name: "ELE-B1209-A OUTDOOR", desc: "كاميرا إلكتروتك خارجي ألوان ومايك 2 ميجا الجديدة", brand: "ELECTROTECH", price: 525, cat: "cat_electrotech", type: "HD Camera" },
    { name: "ELE-D1209-A INDOOR", desc: "كاميرا إلكتروتك داخلي ألوان ومايك 2 ميجا الجديدة", brand: "ELECTROTECH", price: 525, cat: "cat_electrotech", type: "HD Camera" },
    { name: "ELH-B1209 T/A OUTDOOR", desc: "كاميرا إلكتروتك خارجي ألوان ومايك تو واي", brand: "ELECTROTECH", price: 610, cat: "cat_electrotech", type: "Two-Way Audio" },
    { name: "ELE-85384 OUTDOOR", desc: "كاميرا إلكتروتك خارجي 5 ميجا", brand: "ELECTROTECH", price: 300, cat: "cat_electrotech", type: "HD Camera" },
    { name: "ELE-85384 INDOOR", desc: "كاميرا إلكتروتك داخلي 5 ميجا", brand: "ELECTROTECH", price: 300, cat: "cat_electrotech", type: "HD Camera" },
    { name: "ELE-CAM B1509 OUTDOOR COLLOR", desc: "كاميرا إلكتروتك خارجي 5 ميجا ألوان", brand: "ELECTROTECH", price: 625, cat: "cat_electrotech", type: "HD Camera" },
    { name: "ELE-CAM D1509 INDOOR COLLOR", desc: "كاميرا إلكتروتك داخلي 5 ميجا ألوان", brand: "ELECTROTECH", price: 625, cat: "cat_electrotech", type: "HD Camera" },
    { name: "ELE-CAM B1509-A OUTDOOR COLLOR-MIC", desc: "كاميرا إلكتروتك خارجي ألوان ومايك 5 ميجا", brand: "ELECTROTECH", price: 650, cat: "cat_electrotech", type: "HD Camera" },
    { name: "ELE-CAM T1509-A INDOOR COLLOR-MIC", desc: "كاميرا إلكتروتك داخلي ألوان ومايك 5 ميجا", brand: "ELECTROTECH", price: 650, cat: "cat_electrotech", type: "HD Camera" },
    { name: "DVR 4 ELECTRO", desc: "جهاز تسجيل إلكتروتك 4 قنوات 2 ميجا", brand: "ELECTROTECH", price: 950, cat: "cat_electrotech", type: "DVR Recorder" },
    { name: "xvr smart 4ch 5mp", desc: "جهاز تسجيل سمارت 4 قنوات 5 ميجا", brand: "ELECTROTECH", price: 1000, cat: "cat_electrotech", type: "XVR Recorder" },
    { name: "DVR 16CH XM ELECTRO", desc: "جهاز تسجيل إلكتروتك 16 قناة 5 ميجا XM", brand: "ELECTROTECH", price: 2250, cat: "cat_electrotech", type: "DVR Recorder" },
    { name: "ELE-CAM SMART WIFI NZ2", desc: "كاميرا ميني PTZ ذكية واي فاي", brand: "ELECTROTECH", price: 1250, cat: "cat_wifi", type: "Smart Wi-Fi" },
    { name: "ELE-PROJECTOR YG 300 YELLO", desc: "بروجيكتور إلكتروتك محمول أصفر", brand: "ELECTROTECH", price: 850, cat: "cat_electrotech", type: "Projector" },
    { name: "ELE-PROJECTOR KJM-320", desc: "بروجيكتور إلكتروتك سينمائي عالي الوضوح", brand: "ELECTROTECH", price: 3750, cat: "cat_electrotech", type: "Projector" },
    { name: "ELE-PROJECTOR KJM", desc: "بروجيكتور إلكتروتك احترافي فائق الإضاءة", brand: "ELECTROTECH", price: 7400, cat: "cat_electrotech", type: "Projector" },

    // --- HILOOK ---
    { name: "THC-T120-PIC", desc: "كاميرا هاي لوك داخلي 2 ميجا الموديل الجديد", brand: "HILOOK", price: 300, cat: "cat_hilook", type: "HD Camera" },
    { name: "THC-B120-PIC", desc: "كاميرا هاي لوك خارجي 2 ميجا الموديل الجديد", brand: "HILOOK", price: 300, cat: "cat_hilook", type: "HD Camera" },
    { name: "THC-T220-P", desc: "كاميرا هاي لوك داخلي 2 ميجا مدى رؤية 40 متر", brand: "HILOOK", price: 425, cat: "cat_hilook", type: "HD Camera" },
    { name: "THC-T129-P", desc: "كاميرا هاي لوك داخلي ألوان 2 ميجا كولورفيو WDR", brand: "HILOOK", price: 815, cat: "cat_hilook", type: "ColorVu" },
    { name: "THC-B129-P", desc: "كاميرا هاي لوك خارجي ألوان 2 ميجا كولورفيو WDR", brand: "HILOOK", price: 815, cat: "cat_hilook", type: "ColorVu" },
    { name: "THC-T127-LPS", desc: "كاميرا هاي لوك داخلي ألوان ومايك 2 ميجا", brand: "HILOOK", price: 715, cat: "cat_hilook", type: "ColorVu" },
    { name: "THC-B127-LPS", desc: "كاميرا هاي لوك خارجي ألوان ومايك 2 ميجا", brand: "HILOOK", price: 715, cat: "cat_hilook", type: "ColorVu" },
    { name: "DVR-104G-M1", desc: "جهاز تسجيل هاي لوك 4 قنوات 2 ميجا", brand: "HILOOK", price: 1240, cat: "cat_hilook", type: "DVR Recorder" },
    { name: "DVR-108G-M1", desc: "جهاز تسجيل هاي لوك 8 قنوات 2 ميجا", brand: "HILOOK", price: 1590, cat: "cat_hilook", type: "DVR Recorder" },
    { name: "DVR-116G-M1", desc: "جهاز تسجيل هاي لوك 16 قناة 2 ميجا", brand: "HILOOK", price: 3100, cat: "cat_hilook", type: "DVR Recorder" },
    { name: "DVR-104Q-M1", desc: "جهاز تسجيل هاي لوك 4 قنوات 5 ميجا", brand: "HILOOK", price: 2050, cat: "cat_hilook", type: "DVR Recorder" },
    { name: "DVR-108Q-M1", desc: "جهاز تسجيل هاي لوك 8 قنوات 5 ميجا", brand: "HILOOK", price: 3050, cat: "cat_hilook", type: "DVR Recorder" },
    { name: "DVR-116Q-M1", desc: "جهاز تسجيل هاي لوك 16 قناة 5 ميجا", brand: "HILOOK", price: 5700, cat: "cat_hilook", type: "DVR Recorder" },
    { name: "IPC-B621H-V", desc: "كاميرا هاي لوك شبكية خارجي 2 ميجا فري فوكل متغيرة العدسة", brand: "HILOOK", price: 1125, cat: "cat_hilook", type: "IP Camera" },

    // --- DAHUA HD ---
    { name: "DH-HAC-B5E20P", desc: "كاميرا داهوا خارجي 2 ميجا", brand: "DAHUA", price: 370, cat: "cat_dahua", type: "HD Camera" },
    { name: "DH-HAC-T5E20P", desc: "كاميرا داهوا داخلي 2 ميجا", brand: "DAHUA", price: 370, cat: "cat_dahua", type: "HD Camera" },
    { name: "DH-HAC-T1A21P-U-IL", desc: "كاميرا داهوا داخلي ألوان 2 ميجا", brand: "DAHUA", price: 550, cat: "cat_dahua", type: "HD Camera" },
    { name: "DH-HFW1200CLP-IL-A", desc: "كاميرا داهوا خارجي ألوان ومايك 2 ميجا", brand: "DAHUA", price: 775, cat: "cat_dahua", type: "HD Camera" },
    { name: "DH-HDW1200CLQP-IL-A", desc: "كاميرا داهوا داخلي ألوان ومايك 2 ميجا", brand: "DAHUA", price: 700, cat: "cat_dahua", type: "HD Camera" },
    { name: "DH-HAC-HDW1200TQP-IL-T", desc: "كاميرا داهوا داخلي ألوان ومايك 2 ميجا تو واي", brand: "DAHUA", price: 850, cat: "cat_dahua", type: "HD Camera" },
    { name: "DH-HAC-HDW1249XP-A-PF", desc: "كاميرا داهوا داخلي ألوان ومايك 2 ميجا ويز كلر 50 متر", brand: "DAHUA", price: 1400, cat: "cat_dahua", type: "Full Color" },
    { name: "DH-HAC-B5E50P", desc: "كاميرا داهوا خارجي 5 ميجا", brand: "DAHUA", price: 660, cat: "cat_dahua", type: "HD Camera" },
    { name: "DH-HAC-HDW1500CLQP-IL-A", desc: "كاميرا داهوا داخلي ألوان ومايك 5 ميجا", brand: "DAHUA", price: 975, cat: "cat_dahua", type: "HD Camera" },
    { name: "DH-HAC-HDW1500TQP-IL-T", desc: "كاميرا داهوا داخلي ألوان ومايك 5 ميجا تو واي", brand: "DAHUA", price: 1150, cat: "cat_dahua", type: "HD Camera" },
    { name: "DH-HAC-PTS1500CP-IL-A", desc: "كاميرا داهوا بي تي زد صغيرة 5 ميجا ألوان ومايك", brand: "DAHUA", price: 2285, cat: "cat_dahua", type: "PTZ Camera" },
    { name: "DH-HAC-HFW1500RLP-IL-T", desc: "كاميرا داهوا خارجي ألوان ومايك 5 ميجا تو واي", brand: "DAHUA", price: 1050, cat: "cat_dahua", type: "HD Camera" },
    { name: "DH-HAC-HFW1801RLP-IL-A", desc: "كاميرا داهوا خارجي ألوان ومايك 8 ميجا فوركيه", brand: "DAHUA", price: 1717, cat: "cat_dahua", type: "4K Camera" },
    { name: "DH-HAC-HDW1801CLQP-IL-A", desc: "كاميرا داهوا داخلي ألوان ومايك 8 ميجا فوركيه", brand: "DAHUA", price: 1666, cat: "cat_dahua", type: "4K Camera" },
    { name: "DH-XVR1B04-I/T", desc: "جهاز تسجيل داهوا 4 قنوات 2 ميجا تو واي", brand: "DAHUA", price: 1375, cat: "cat_dahua", type: "XVR Recorder" },
    { name: "DH-XVR1B08-I/T", desc: "جهاز تسجيل داهوا 8 قنوات 2 ميجا تو واي", brand: "DAHUA", price: 1675, cat: "cat_dahua", type: "XVR Recorder" },
    { name: "DHI-XVR5108HS-I3-T", desc: "جهاز تسجيل داهوا 8 قنوات 5 ميجا تو واي ذكي", brand: "DAHUA", price: 3200, cat: "cat_dahua", type: "XVR Recorder" },
    { name: "DHI-XVR5116HS-I3-T", desc: "جهاز تسجيل داهوا 16 قناة 5 ميجا تو واي ذكي", brand: "DAHUA", price: 6100, cat: "cat_dahua", type: "XVR Recorder" },
    { name: "DH-XVR5108HS-4KL-I3/T", desc: "جهاز تسجيل داهوا 8 قنوات فوركيه 8 ميجا تو واي", brand: "DAHUA", price: 8100, cat: "cat_dahua", type: "4K XVR" },
    { name: "DH-XVR5116HS-4KL-I3/T", desc: "جهاز تسجيل داهوا 16 قناة فوركيه 8 ميجا تو واي", brand: "DAHUA", price: 13200, cat: "cat_dahua", type: "4K XVR" },
    { name: "DH-XVR5432L-4KL-I3", desc: "جهاز تسجيل داهوا 32 قناة فوركيه 8 ميجا 4 هارد", brand: "DAHUA", price: 25000, cat: "cat_dahua", type: "Enterprise XVR" },

    // --- DAHUA IP ---
    { name: "DH-IPC-HDW1230T2-A", desc: "كاميرا داهوا شبكية داخلي 2 ميجا بمايك", brand: "DAHUA", price: 931, cat: "cat_dahua", type: "IP Camera" },
    { name: "DH-IPC-HFW1230TL2-A", desc: "كاميرا داهوا شبكية خارجي 2 ميجا بمايك", brand: "DAHUA", price: 890, cat: "cat_dahua", type: "IP Camera" },
    { name: "DHI-HDW1239V-A-IL", desc: "كاميرا داهوا شبكية داخلي ألوان ومايك 2 ميجا", brand: "DAHUA", price: 1390, cat: "cat_dahua", type: "IP Camera" },
    { name: "DH-IPC-HFW1439TL1-A-IL", desc: "كاميرا داهوا شبكية خارجي ألوان ومايك 4 ميجا", brand: "DAHUA", price: 2266, cat: "cat_dahua", type: "IP Camera" },
    { name: "DH-IPC-HDBW1439E1-A-IL", desc: "كاميرا داهوا شبكية داخلي دووم ألوان ومايك 4 ميجا", brand: "DAHUA", price: 2060, cat: "cat_dahua", type: "IP Camera" },
    { name: "DH-IPC-HFW1639TC-A-IL", desc: "كاميرا داهوا شبكية خارجي ألوان ومايك 6 ميجا", brand: "DAHUA", price: 2550, cat: "cat_dahua", type: "IP Camera" },
    { name: "DH-IPC-HFW1839CP-A-IL", desc: "كاميرا داهوا شبكية خارجي ألوان ومايك 8 ميجا 4K", brand: "DAHUA", price: 4246, cat: "cat_dahua", type: "4K IP Camera" },
    { name: "DH-PFS3005-5ET-L", desc: "سويتش داهوا 4 مخارج للشبكات والكاميرات", brand: "DAHUA", price: 224, cat: "cat_accessories", type: "Network Switch" },
    { name: "DH-PFS3005-5GT-L", desc: "سويتش داهوا جيجابت 4 مخارج فائق السرعة", brand: "DAHUA", price: 510, cat: "cat_accessories", type: "Gigabit Switch" },
    { name: "DH-NVR2104HS-4KS3", desc: "مسجل شبكي داهوا NVR 4 قنوات فوركيه", brand: "DAHUA", price: 3070, cat: "cat_dahua", type: "NVR Recorder" },
    { name: "DHI-NVR1104HS-S3/H", desc: "مسجل شبكي داهوا NVR 4 قنوات 5 ميجا", brand: "DAHUA", price: 1836, cat: "cat_dahua", type: "NVR Recorder" },
    { name: "NVR1104-P-S3/H", desc: "مسجل شبكي داهوا NVR 4 قنوات PoE مدمج", brand: "DAHUA", price: 2652, cat: "cat_dahua", type: "PoE NVR" },
    { name: "DHI-NVR2108-4KS3", desc: "مسجل شبكي داهوا NVR 8 قنوات فوركيه", brand: "DAHUA", price: 3471, cat: "cat_dahua", type: "NVR Recorder" },
    { name: "DHI-NVR4108-8P-4KS3", desc: "مسجل شبكي داهوا NVR 8 قنوات 8 مخارج PoE فوركيه", brand: "DAHUA", price: 7478, cat: "cat_dahua", type: "PoE NVR" },
    { name: "DHI-NVR2116HS-4KS3", desc: "مسجل شبكي داهوا NVR 16 قناة فوركيه", brand: "DAHUA", price: 3983, cat: "cat_dahua", type: "NVR Recorder" },
    { name: "DHI-NVR4216-E1", desc: "مسجل شبكي داهوا NVR 16 قناة 2 هارد بتقنية الذكاء الاصطناعي AI", brand: "DAHUA", price: 8160, cat: "cat_dahua", type: "AI NVR" },
    { name: "DH-SD4A425DB-HNY", desc: "كاميرا داهوا متحركة زووم بصري 25X بدقة 4 ميجا Starlight PTZ", brand: "DAHUA", price: 10500, cat: "cat_dahua", type: "PTZ Camera" },
    { name: "VDP-DHI-KTP02", desc: "طقم إنتركم مرئي ذكي داهوا شاشة + جرس كاميرا خارجي", brand: "DAHUA", price: 5500, cat: "cat_dahua", type: "Video Intercom" },

    // --- STORAGE & POWER & CABLES & ACCESSORIES ---
    { name: "HDD 500GB SEAGATE", desc: "هارد ديسك سيجيت 500 جيجا مخصص للتسجيل", brand: "SEAGATE", price: 525, cat: "cat_storage", type: "Hard Disk" },
    { name: "POWER SUPPLY 10A (2 مكثف)", desc: "باور سبلاي 10 أمبير 2 مكثف لتغذية الكاميرات", brand: "GENERIC", price: 170, cat: "cat_power", type: "Power Supply" },
    { name: "POWER SUPPLY 20A", desc: "باور سبلاي 20 أمبير بمروحة تبريد لكاميرات المراقبة", brand: "GENERIC", price: 270, cat: "cat_power", type: "Power Supply" },
    { name: "POWER SUPPLY 30A", desc: "باور سبلاي 30 أمبير صناعي للمشاريع والسيستم الكبير", brand: "GENERIC", price: 325, cat: "cat_power", type: "Power Supply" },
    { name: "ADAPTER (5 A)", desc: "ادبتور 5 أمبير منظم مع كابل باور", brand: "GENERIC", price: 110, cat: "cat_power", type: "Adapter" },
    { name: "ADAPTOR 2A OUT DOOR", desc: "ادبتور 2 أمبير ووتر بروف عازل للأمطار", brand: "GENERIC", price: 45, cat: "cat_power", type: "Adapter" },
    { name: "BNC GOLD محمل", desc: "سوكت بي ان سي جولد محمل نحاس عالي التوصيل", brand: "GENERIC", price: 5, cat: "cat_accessories", type: "BNC Connector" },
    { name: "DC MALE", desc: "جاك باور دي سي ذكر مع أطراف ربط", brand: "GENERIC", price: 2.5, cat: "cat_accessories", type: "DC Jack" },
    { name: "DC FEMALE", desc: "جاك باور دي سي أنثى مع أطراف ربط", brand: "GENERIC", price: 2.5, cat: "cat_accessories", type: "DC Jack" },
    { name: "RG-45-CAT 6", desc: "علبة أرجيهات شبكة كات 6 نحاس مذهبة (100 قطعة)", brand: "GENERIC", price: 90, cat: "cat_accessories", type: "RJ45 Plug" },
    { name: "MIC CAMIRA -AU10", desc: "مايكروفون كاميرات خارجي جولف عالي الحساسية", brand: "GENERIC", price: 50, cat: "cat_accessories", type: "CCTV Mic" },
    { name: "CAMERA HOLDER (30-60) L", desc: "حامل كاميرا معدني حرف L تلسكوبي قابل للتعديل 30-60 سم", brand: "GENERIC", price: 220, cat: "cat_accessories", type: "Mount Bracket" },
    { name: "CAMERA HOLDER (60-120) L", desc: "حامل كاميرا معدني حرف L تلسكوبي قابل للتعديل 60-120 سم", brand: "GENERIC", price: 275, cat: "cat_accessories", type: "Mount Bracket" },
    { name: "RACK 6U WITH FAN", desc: "راك شبكات وكاميرات 6U مع مروحة تبريد وزجاج مقوى", brand: "GENERIC", price: 900, cat: "cat_accessories", type: "Server Rack" },
    { name: "RACK 9U ECONOMY", desc: "راك شبكات وكاميرات 9U اقتصادي متين", brand: "GENERIC", price: 1200, cat: "cat_accessories", type: "Server Rack" },
    { name: "بواط مربع 10*10", desc: "بواط بلاستيك مربع مع جوان ووتربروف ضد الماء", brand: "GENERIC", price: 7.5, cat: "cat_accessories", type: "Junction Box" },
    { name: "علبة راوتر خارجي 19*24 هاي كواليتي", desc: "علبة حماية خارجية للراوتر وأجهزة السويتش مع قفل", brand: "GENERIC", price: 47, cat: "cat_accessories", type: "Weatherproof Enclosure" },
    { name: "لفة سلك SPS RG174 ال 100 م", desc: "لفة سلك كاميرات شيلد RG174 طول 100 متر", brand: "SPS", price: 475, cat: "cat_cables", type: "Coaxial Cable" },
    { name: "لفة سلك SPS RG174 ال 200 م", desc: "لفة سلك كاميرات شيلد RG174 طول 200 متر", brand: "SPS", price: 950, cat: "cat_cables", type: "Coaxial Cable" },
    { name: "DS-1LN6UU/CCA", desc: "لفة كابل شبكة كات 6 هيكفيجن أصلي رمادي 305 متر", brand: "HIKVISION", price: 2450, cat: "cat_cables", type: "Cat6 Cable" },
    { name: "DS-LN6U-W/CCA", desc: "لفة كابل شبكة كات 6 هيكفيجن أصلي أبيض 305 متر", brand: "HIKVISION", price: 2550, cat: "cat_cables", type: "Cat6 Cable" },
    { name: "Cable cat6 leGrand 24 AWG BLUE", desc: "لفة كابل شبكة كات 6 ليجراند فرنسي أصلي 305 متر معتمد", brand: "LEGRAND", price: 6800, cat: "cat_cables", type: "Cat6 Cable" },
  ];

  console.log(`Inserting ${rawProducts.length} items into Neon database...`);

  for (const item of rawProducts) {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await prisma.product.upsert({
      where: { slug: slug || `item-${Math.random().toString(36).substring(7)}` },
      update: {
        price: item.price,
        descriptionAr: item.desc,
      },
      create: {
        nameAr: `${item.name} — ${item.desc}`,
        nameEn: `${item.name} (${item.brand})`,
        slug: slug || `item-${Math.random().toString(36).substring(7)}`,
        brandAr: item.brand,
        brandEn: item.brand,
        type: item.type,
        concentration: item.type,
        volume: "أصلي معتمد",
        price: item.price,
        originalPrice: Math.round(item.price * 1.15),
        discountPercent: 12,
        isFeatured: item.price > 1000,
        isBestSeller: true,
        inStock: true,
        stockQuantity: 50,
        rating: 5.0,
        reviewsCount: Math.floor(Math.random() * 40) + 10,
        descriptionAr: `${item.desc}. منتج معتمد لدى دي سي سمارت مع ضمان شامل وتوريد سريع لكافة محافظات مصر.`,
        descriptionEn: `${item.name} by ${item.brand}. Certified hardware with official warranty.`,
        topNotesAr: `ماركة ${item.brand} الأصلية`,
        topNotesEn: `Original ${item.brand}`,
        heartNotesAr: "أداء مستقر وتشغيل متواصل 24/7",
        heartNotesEn: "24/7 Continuous Operation",
        baseNotesAr: "ضمان معتمد من دي سي سمارت وشركة أوركا: 01018671000",
        baseNotesEn: "Warranty & Orca Support: 01018671000",
        seasonAr: "داخلي وخارجي",
        seasonEn: "All Seasons",
        genderAr: "للشركات والمنازل والمشاريع",
        genderEn: "Commercial & Residential",
        longevityAr: "ضمان عامين",
        longevityEn: "2-Year Warranty",
        sillageAr: "جودة وكفاءة عالية",
        sillageEn: "High Performance",
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
        categoryId: item.cat,
      },
    });
  }

  console.log(`✅ Finished seeding ${rawProducts.length} authentic CCTV items successfully!`);
}

populateCatalog()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
