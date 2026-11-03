const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://neondb_owner:npg_os6Qxh0qRywa@ep-long-grass-baxgsl9f-pooler.c-8.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
});

const IMAGES = {
  // Dahua Bullets
  dahua_bullet_1: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
  dahua_bullet_2: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
  dahua_bullet_3: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
  dahua_bullet_color: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",

  // Dahua Domes
  dahua_dome_1: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
  dahua_dome_2: "https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&w=800&q=80",
  dahua_dome_color: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",

  // Dahua PTZ Speed Dome
  dahua_ptz: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",

  // Dahua XVR & Recorders
  xvr_4ch: "https://images.unsplash.com/photo-1544716278-e513176f20b5?auto=format&fit=crop&w=800&q=80",
  xvr_8ch: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  xvr_16ch: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
  xvr_32ch: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
  nvr_4k: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",

  // HiLook Bullets
  hilook_bullet_1: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
  hilook_bullet_2: "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&w=800&q=80",
  hilook_bullet_colorvu: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",

  // HiLook Domes
  hilook_dome_1: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80",
  hilook_dome_2: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",

  // Uniarch & UNV
  unv_bullet_1: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
  unv_bullet_2: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
  unv_dome_1: "https://images.unsplash.com/photo-1534972195531-a756b112692c?auto=format&fit=crop&w=800&q=80",
  unv_dome_2: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",

  // YES Series & IP Cameras
  yes_bullet_1: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80",
  yes_bullet_2: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
  yes_dome_1: "https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&w=800&q=80",
  yes_dome_2: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",

  // Electrotech Cameras & Projectors
  electro_bullet: "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&w=800&q=80",
  electro_dome: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80",
  projector_yg300: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
  projector_smart: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80",

  // Smart Wi-Fi Cameras
  wifi_tenda_cp3: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=80",
  wifi_tenda_cp7: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  wifi_ezviz_outdoor: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
  wifi_dahua_indoor: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80",

  // Surveillance Hard Drives
  hdd_wd_purple: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
  hdd_seagate: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",

  // Power Supplies & Adapters
  psu_metal_10a: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  psu_metal_20a: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
  psu_metal_30a: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
  adapter_5a: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
  adapter_outdoor_2a: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",

  // Cables
  cable_cat6_grey: "https://images.unsplash.com/photo-1544197150-199123fc639c?auto=format&fit=crop&w=800&q=80",
  cable_cat6_white: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
  cable_cat6_blue: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
  cable_coaxial: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80",

  // Accessories
  switch_network: "https://images.unsplash.com/photo-1544197150-199123fc639c?auto=format&fit=crop&w=800&q=80",
  bnc_connector: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  dc_power_jack: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
  rj45_pack: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
  cctv_microphone: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
  camera_bracket: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80",
  rack_cabinet_glass: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
};

function pickImageForProduct(prod) {
  const name = (prod.nameAr + ' ' + (prod.nameEn || '')).toLowerCase();
  const cat = prod.categoryId || '';

  // 1. Storage Category
  if (cat === 'cat_storage' || name.includes('هارد') || name.includes('hdd') || name.includes('wd purple')) {
    if (name.includes('seagate') || name.includes('سيجيت')) return IMAGES.hdd_seagate;
    return IMAGES.hdd_wd_purple;
  }

  // 2. Power Category
  if (cat === 'cat_power' || name.includes('باور') || name.includes('power supply') || name.includes('ادبتور') || name.includes('adapter')) {
    if (name.includes('30') || name.includes('30a')) return IMAGES.psu_metal_30a;
    if (name.includes('20') || name.includes('20a')) return IMAGES.psu_metal_20a;
    if (name.includes('10') || name.includes('10a')) return IMAGES.psu_metal_10a;
    if (name.includes('2a') || name.includes('out door') || name.includes('ووتر')) return IMAGES.adapter_outdoor_2a;
    return IMAGES.adapter_5a;
  }

  // 3. Cables Category
  if (cat === 'cat_cables' || name.includes('كابل') || name.includes('سلك') || name.includes('cable') || name.includes('cat6') || name.includes('rg174')) {
    if (name.includes('blue') || name.includes('legrand')) return IMAGES.cable_cat6_blue;
    if (name.includes('أبيض') || name.includes('-w/')) return IMAGES.cable_cat6_white;
    if (name.includes('rg174') || name.includes('شيلد')) return IMAGES.cable_coaxial;
    return IMAGES.cable_cat6_grey;
  }

  // 4. Projectors (inside Electrotech)
  if (name.includes('projector') || name.includes('بروجيكتور') || name.includes('بروجكتور')) {
    if (name.includes('yg 300') || name.includes('yello')) return IMAGES.projector_yg300;
    return IMAGES.projector_smart;
  }

  // 5. Recorders (XVR / DVR / NVR)
  if (name.includes('تسجيل') || name.includes('xvr') || name.includes('dvr') || name.includes('nvr') || name.includes('جهاز 4') || name.includes('جهاز 8') || name.includes('جهاز 16')) {
    if (name.includes('32') || name.includes('32ch')) return IMAGES.xvr_32ch;
    if (name.includes('16') || name.includes('16ch')) return IMAGES.xvr_16ch;
    if (name.includes('8') || name.includes('8ch')) return IMAGES.xvr_8ch;
    if (name.includes('nvr') || name.includes('4k')) return IMAGES.nvr_4k;
    return IMAGES.xvr_4ch;
  }

  // 6. PTZ & Speed Dome Cameras
  if (name.includes('ptz') || name.includes('متحركة') || name.includes('زووم 25') || name.includes('sd4a425db')) {
    return IMAGES.dahua_ptz;
  }

  // 7. Smart Wi-Fi Cameras
  if (cat === 'cat_wifi' || name.includes('wifi') || name.includes('واي فاي') || name.includes('tenda') || name.includes('ezviz')) {
    if (name.includes('cp7') || name.includes('4 ميجا')) return IMAGES.wifi_tenda_cp7;
    if (name.includes('cp3') || name.includes('3 ميجا')) return IMAGES.wifi_tenda_cp3;
    if (name.includes('ezviz') || name.includes('c3tn') || name.includes('h3c')) return IMAGES.wifi_ezviz_outdoor;
    if (name.includes('h3i') || name.includes('h5a')) return IMAGES.wifi_dahua_indoor;
    return IMAGES.wifi_tenda_cp3;
  }

  // 8. Dedicated Accessories & Networking (ONLY for cat_accessories or explicit accessories)
  if (cat === 'cat_accessories') {
    if (name.includes('switch') || name.includes('سويتش')) return IMAGES.switch_network;
    if (name.includes('bnc')) return IMAGES.bnc_connector;
    if (name.includes('جاك') || name.includes('dc')) return IMAGES.dc_power_jack;
    if (name.includes('rg-45') || name.includes('أرجيهات')) return IMAGES.rj45_pack;
    if (name.includes('مايك') || name.includes('mic')) return IMAGES.cctv_microphone;
    if (name.includes('حامل') || name.includes('holder')) return IMAGES.camera_bracket;
    if (name.includes('راك') || name.includes('rack')) return IMAGES.rack_cabinet_glass;
    return IMAGES.switch_network;
  }

  // 9. Brand & Shape Specific Camera Logic
  const isIndoor = name.includes('داخلي') || name.includes('indoor') || name.includes('dome') || name.includes('دووم') || name.includes('-t') || name.includes('-d');
  const isColor = name.includes('ألوان') || name.includes('color') || name.includes('كلر') || name.includes('-il') || name.includes('ليد');

  if (cat === 'cat_hilook' || name.includes('hilook') || name.includes('هاي لوك')) {
    if (isIndoor) {
      return isColor ? IMAGES.hilook_dome_2 : IMAGES.hilook_dome_1;
    } else {
      return isColor ? IMAGES.hilook_bullet_colorvu : (name.charCodeAt(0) % 2 === 0 ? IMAGES.hilook_bullet_1 : IMAGES.hilook_bullet_2);
    }
  }

  if (cat === 'cat_unv' || name.includes('uniarch') || name.includes('unv') || name.includes('يوني')) {
    if (isIndoor) {
      return isColor ? IMAGES.unv_dome_2 : IMAGES.unv_dome_1;
    } else {
      return isColor ? IMAGES.unv_bullet_1 : IMAGES.unv_bullet_2;
    }
  }

  if (cat === 'cat_yes' || name.includes('yes') || name.includes('يس')) {
    if (isIndoor) {
      return name.charCodeAt(0) % 2 === 0 ? IMAGES.yes_dome_1 : IMAGES.yes_dome_2;
    } else {
      return name.charCodeAt(0) % 2 === 0 ? IMAGES.yes_bullet_1 : IMAGES.yes_bullet_2;
    }
  }

  if (cat === 'cat_electrotech' || name.includes('electro')) {
    if (isIndoor) {
      return IMAGES.electro_dome;
    } else {
      return IMAGES.electro_bullet;
    }
  }

  // Dahua & Default Cameras
  if (isIndoor) {
    return isColor ? IMAGES.dahua_dome_color : (name.charCodeAt(0) % 2 === 0 ? IMAGES.dahua_dome_1 : IMAGES.dahua_dome_2);
  } else {
    return isColor ? IMAGES.dahua_bullet_color : (name.charCodeAt(0) % 2 === 0 ? IMAGES.dahua_bullet_1 : IMAGES.dahua_bullet_2);
  }
}

async function main() {
  await client.connect();
  console.log('Connected to Neon PostgreSQL DB...');

  const res = await client.query('SELECT id, "nameAr", "nameEn", "categoryId" FROM "Product"');
  console.log(`Analyzing and updating ${res.rows.length} products...`);

  let updated = 0;
  const imageCounts = {};

  for (const prod of res.rows) {
    const newImage = pickImageForProduct(prod);
    imageCounts[newImage] = (imageCounts[newImage] || 0) + 1;

    await client.query('UPDATE "Product" SET image = $1 WHERE id = $2', [newImage, prod.id]);
    updated++;
  }

  console.log(`\nSuccessfully updated all ${updated} products in Neon DB!`);
  console.log(`Distinct image URLs assigned: ${Object.keys(imageCounts).length}`);
  console.log('\nDistribution across image pool:');
  for (const [url, count] of Object.entries(imageCounts)) {
    console.log(` - ${count} products -> ${url.substring(0, 60)}...`);
  }

  await client.end();
}

main().catch(console.error);
