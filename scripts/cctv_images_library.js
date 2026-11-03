// CCTV & Security Hardware Curated Image Library
const CCTV_IMAGES = {
  // --- Bullet Cameras (خارجي / اسطوانية) ---
  bullet_dahua_1: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80", // White security bullet camera
  bullet_dahua_2: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80", // Modern outdoor surveillance bullet
  bullet_hilook_1: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", // Industrial bullet camera
  bullet_hilook_2: "https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&w=800&q=80", // High-res security camera outdoor
  bullet_unv_1: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80", // Sleek modern security camera
  bullet_unv_2: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", // Metal outdoor bullet camera
  bullet_colorvu: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80", // Full color night vision with LED
  bullet_ip: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=800&q=80", // High tech digital IP camera
  bullet_metal: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80", // Heavy duty weatherproof bullet

  // --- Dome Cameras (داخلي / كروية) ---
  dome_dahua_1: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80", // Indoor ceiling dome security camera
  dome_dahua_2: "https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&w=800&q=80", // Glass dome surveillance camera
  dome_hilook_1: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=800&q=80", // White dome camera for retail/home
  dome_hilook_2: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80", // Ceiling mount turret dome
  dome_unv: "https://images.unsplash.com/photo-1534972195531-a756b112692c?auto=format&fit=crop&w=800&q=80", // Vandal-proof dome camera
  dome_color: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80", // Color dome camera with microphone
  dome_ip: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80", // Smart IP PoE dome camera

  // --- PTZ & Speed Dome Cameras ---
  ptz_speed_dome: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80", // Heavy duty 360 motorized PTZ camera
  ptz_outdoor: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80", // PTZ speed dome zoom lens
  ptz_mini_wifi: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80", // Smart mini PTZ wifi camera

  // --- Smart Wi-Fi 360 & IoT Cameras ---
  wifi_tenda_360: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=80", // Smart home 360 wifi camera
  wifi_ezviz_outdoor: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80", // Wireless smart outdoor camera
  wifi_indoor_robot: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", // AI robot home security camera

  // --- Recorders (XVR / DVR / NVR) ---
  dvr_4ch: "https://images.unsplash.com/photo-1544716278-e513176f20b5?auto=format&fit=crop&w=800&q=80", // 4-Channel compact DVR/XVR recorder
  dvr_8ch: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", // 8-Channel professional XVR recorder
  dvr_16ch: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80", // 16-Channel 5MP enterprise DVR
  nvr_poe_4k: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80", // 4K AI PoE Network Video Recorder NVR

  // --- Hard Drives / Storage ---
  hdd_wd_purple: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80", // Western Digital Purple Surveillance HDD 3.5
  hdd_seagate_skyhawk: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80", // Seagate SkyHawk Surveillance HDD

  // --- Power Supplies & Adapters ---
  psu_metal_10a: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80", // Industrial metal mesh power supply 12V
  psu_metal_20a: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80", // 20A power supply with cooling fan
  psu_metal_30a: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80", // Heavy duty 30A CCTV power supply
  adapter_5a: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", // 12V 5A power adapter
  adapter_outdoor_2a: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80", // Waterproof outdoor 12V 2A adapter

  // --- Network Cables & Spools ---
  cable_cat6_box_grey: "https://images.unsplash.com/photo-1544197150-199123fc639c?auto=format&fit=crop&w=800&q=80", // Cat6 UTP 305M cable box Hikvision
  cable_cat6_box_white: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", // Cat6 white spool cable box
  cable_cat6_blue: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", // Legrand Blue Cat6 305M certified
  cable_coaxial_spool: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80", // RG59 / RG174 Coaxial CCTV cable roll

  // --- Projectors ---
  projector_yg300: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80", // Yellow mini portable projector YG300
  projector_smart: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80", // Home cinema smart projector KJM

  // --- Accessories & Networking ---
  switch_poe: "https://images.unsplash.com/photo-1544197150-199123fc639c?auto=format&fit=crop&w=800&q=80", // Dahua 5-Port PoE network switch
  bnc_gold: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80", // BNC Gold CCTV connectors
  dc_jacks: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80", // DC Male & Female power jacks
  rj45_jar: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", // RJ-45 Cat6 gold connectors jar
  cctv_mic: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80", // High sensitivity golf CCTV microphone
  bracket_l: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80", // Telescopic camera L-bracket metal
  rack_cabinet: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" // 6U / 9U glass door server DVR rack
};

module.exports = CCTV_IMAGES;
