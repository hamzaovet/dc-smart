"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ar" | "en";

interface LanguageContextType {
  lang: Language;
  dir: "rtl" | "ltr";
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Brand & Header
    store_name: "ميني بيك",
    store_subname: "بوتيك الألعاب التركيبية والهدايا الترند",
    nav_home: "الرئيسية",
    nav_winter: "الأكثر طلباً 🔥",
    nav_all_perfumes: "جميع المنتجات",
    nav_oud: "مكعبات نانو وبازل",
    nav_testers: "بيدازلنج وكريستال",
    nav_card: "كارت المتجر",
    nav_download: "تحميل التطبيق",
    nav_dashboard: "لوحة التحكم",
    nav_login: "دخول المالك والإدارة",
    cart_title: "سلة المشتريات",
    cart_empty: "سلة المشتريات فارغة حتى الآن",
    cart_explore: "تصفح أحدث المنتجات",
    free_shipping_notice: "شحن مجاني لكافة محافظات مصر للطلبات فوق 1500 ج.م",
    
    // Hero & Badges
    hero_title: "عالم من الإبداع، الكيوت، والمرح",
    hero_subtitle: "اكتشف أروع ألعاب مكعبات النانو، أطقم البيدازلنج الكريستالية، منظمات الميك أب والمكتب، وعلب الهدايا والبليند بوكس الأكثر طلباً على تيك توك.",
    hero_cta_winter: "تصفح الأكثر رواجاً 🔥",
    hero_cta_all: "استكشف الكتالوج الكامل",
    badge_original: "أصلي 100% معتمد",
    badge_tester: "طقم متكامل وهدايا",
    badge_high_copy: "تريند تيك توك",
    badge_inspired: "إصدار حصري محدود",
    badge_winter: "الأكثر طلباً",
    badge_bestseller: "الأكثر مبيعاً",
    
    // Product Details
    details_pyramid: "مواصفات القطع وتفاصيل البوكس",
    details_top_notes: "محتويات البوكس (Unboxing)",
    details_heart_notes: "الخامات والدقة (Build Quality)",
    details_base_notes: "المظهر النهائي والديكور (Display & Fun)",
    details_ingredients: "المواد وإرشادات الاستخدام",
    details_specs: "المواصفات الفنية",
    details_brand: "البراند / الماركة",
    details_authenticity: "درجة الجودة والاعتماد",
    details_concentration: "الخامة ونوع المواد",
    details_volume: "عدد القطع / الحجم",
    details_season: "التصنيف",
    details_gender: "الفئة",
    details_longevity: "الفئة العمرية والصعوبة",
    details_sillage: "التغليف والملحقات",
    details_price: "السعر",
    details_save: "وفر",
    details_in_stock: "متوفر بالمخزون جاهز للشحن فوراً",
    details_out_of_stock: "نفد مؤقتاً",
    btn_add_to_cart: "أضف إلى السلة",
    btn_buy_now: "شراء فوري وسريع",
    btn_order_whatsapp: "طلب مباشر عبر واتساب",
    btn_continue_shopping: "متابعة التسوق",
    
    // Filters & Tabs
    filter_all: "الكل",
    filter_winter: "🔥 الأكثر رواجاً",
    filter_oud: "🧱 مكعبات نانو وبازل",
    filter_french: "💎 بيدازلنج وكريستال",
    filter_niche: "🎀 منظمات كيوت",
    filter_musk: "🎁 بليند بوكس وهدايا",
    sort_featured: "المقترحة",
    sort_price_low: "الأقل سعراً",
    sort_price_high: "الأعلى سعراً",
    search_placeholder: "ابحث عن اللعبة أو الطقم المفضل، براند، أو نوع القطع...",

    // Checkout
    checkout_title: "إتمام الطلب الأنيق",
    checkout_customer_info: "بيانات العميل والشحن",
    checkout_name: "الاسم بالكامل",
    checkout_phone: "رقم الهاتف / واتساب",
    checkout_city: "المحافظة / المدينة",
    checkout_address: "العنوان التفصيلي (المنطقة - الشارع - رقم العقار)",
    checkout_notes: "ملاحظات إضافية على الطلب أو وقت الاستلام",
    checkout_payment_method: "طريقة الدفع",
    checkout_cod: "الدفع نقداً عند الاستلام (COD)",
    checkout_instapay: "إنستاباي / محفظة إلكترونية (InstaPay)",
    checkout_order_summary: "ملخص الطلب",
    checkout_subtotal: "إجمالي المنتجات",
    checkout_delivery: "مصاريف الشحن",
    checkout_free_delivery: "شحن مجاني",
    checkout_total: "المبلغ الإجمالي للدفع",
    checkout_submit: "تأكيد الطلب وشحنه الآن",
    checkout_submitting: "جاري تأكيد طلبك...",
    checkout_success_title: "تم استلام طلبك بنجاح! 🎉",
    checkout_success_desc: "رقم طلبك هو: ",
    checkout_whatsapp_track: "متابعة الطلب عبر واتساب المتجر",

    // Guarantees
    guarantee_title: "ضمان ميني بيك الذهبي",
    guarantee_inspection: "معاينة البوكس والتأكد من سلامة كافة القطع قبل الدفع والاستلام",
    guarantee_lasting: "خامات أصلية آمنة 100% مع كتالوجات وخطوات تركيب واضحة",
    guarantee_shipping: "تغليف هدايا بينك أنيق وشحن سريع لكافة محافظات مصر",

    // Auth & Dashboard
    login_title: "بوابة المالك والتشغيل",
    login_subtitle: "أدخل اسم المستخدم، كلمة المرور، وكود الأمان PIN",
    login_user: "اسم المستخدم",
    login_password: "كلمة المرور",
    login_pin: "كود الأمان السري (PIN)",
    login_submit: "دخول المنظومة",
    login_error: "بيانات الدخول غير صحيحة أو تم إدخال PIN خاطئ",
    login_lockdown_error: "تم تفعيل وضع طوارئ المالك! جميع الحسابات معطلة حالياً",
    
    dashboard_title: "لوحة التحكم الشاملة",
    dashboard_emergency_lockdown: "حالة إغلاق الطوارئ الشامل",
    dashboard_emergency_desc: "تعطيل فوري لجميع حسابات الموظفين والمديرين بنقرة واحدة (صلاحية المالك المايسترو فقط)",
    dashboard_lockdown_active: "وضع الطوارئ مُفعّل (الحسابات معطلة)",
    dashboard_lockdown_inactive: "النظام يعمل بشكل طبيعي",
    dashboard_toggle_lockdown: "تبديل حالة الطوارئ",
    dashboard_total_sales: "إجمالي المبيعات",
    dashboard_total_orders: "إجمالي الطلبات",
    dashboard_products_count: "المنتجات المعروضة",
    dashboard_users_count: "حسابات التشغيل",
  },
  en: {
    // Brand & Header
    store_name: "MINI PICK",
    store_subname: "Nano Blocks & Cute Aesthetic Boutique",
    nav_home: "Home",
    nav_winter: "Trending Now 🔥",
    nav_all_perfumes: "All Products",
    nav_oud: "Nano Blocks & Puzzle",
    nav_testers: "Bedazzling Kits",
    nav_card: "VIP Card",
    nav_download: "Get App",
    nav_dashboard: "Dashboard",
    nav_login: "Executive Login",
    cart_title: "Shopping Bag",
    cart_empty: "Your cute shopping bag is currently empty",
    cart_explore: "Discover Cute Products",
    free_shipping_notice: "Complimentary express shipping across Egypt on orders over 1500 EGP",
    
    // Hero & Badges
    hero_title: "Cute, Creative & Aesthetic Play",
    hero_subtitle: "Explore high-precision nano building blocks, dazzling crystal bedazzle kits, kawaii organizers, and viral TikTok blind boxes.",
    hero_cta_winter: "Explore Trending Now 🔥",
    hero_cta_all: "View Full Catalog",
    badge_original: "100% Original Genuine",
    badge_tester: "Complete Kit & Tools",
    badge_high_copy: "TikTok Viral Trend",
    badge_inspired: "Exclusive Limited Edition",
    badge_winter: "Trending Now",
    badge_bestseller: "Best Seller",
    
    // Product Details
    details_pyramid: "Specifications & Box Details",
    details_top_notes: "Box Contents (Unboxing)",
    details_heart_notes: "Materials & Build Precision",
    details_base_notes: "Display & Assembly Fun",
    details_ingredients: "Materials & Guidelines",
    details_specs: "Specifications",
    details_brand: "Brand / Collection",
    details_authenticity: "Quality & Authenticity",
    details_concentration: "Material & Build",
    details_volume: "Piece Count / Size",
    details_season: "Category",
    details_gender: "Audience",
    details_longevity: "Age Group & Difficulty",
    details_sillage: "Packaging & Accessories",
    details_price: "Price",
    details_save: "Save",
    details_in_stock: "In Stock & Ready to Ship",
    details_out_of_stock: "Temporarily Sold Out",
    btn_add_to_cart: "Add to Bag",
    btn_buy_now: "Instant Buy Now",
    btn_order_whatsapp: "Order via WhatsApp",
    btn_continue_shopping: "Continue Shopping",
    
    // Filters & Tabs
    filter_all: "All",
    filter_winter: "🔥 Viral Trending",
    filter_oud: "🧱 Nano Blocks & Puzzle",
    filter_french: "💎 Bedazzling & Crystals",
    filter_niche: "🎀 Kawaii Organizers",
    filter_musk: "🎁 Blind Boxes & Gifts",
    sort_featured: "Featured",
    sort_price_low: "Price: Low to High",
    sort_price_high: "Price: High to Low",
    search_placeholder: "Search products, kits, nano blocks, organizers...",

    // Checkout
    checkout_title: "Complete Your Cute Order",
    checkout_customer_info: "Shipping & Contact Details",
    checkout_name: "Full Name",
    checkout_phone: "Phone / WhatsApp Number",
    checkout_city: "City / Governorate",
    checkout_address: "Delivery Address (Area, Street, Building)",
    checkout_notes: "Special delivery instructions or timing",
    checkout_payment_method: "Payment Method",
    checkout_cod: "Cash on Delivery (COD)",
    checkout_instapay: "InstaPay / Mobile Wallet",
    checkout_order_summary: "Order Summary",
    checkout_subtotal: "Items Subtotal",
    checkout_delivery: "Express Shipping",
    checkout_free_delivery: "FREE",
    checkout_total: "Total Amount Due",
    checkout_submit: "Confirm & Dispatch Order",
    checkout_submitting: "Processing order...",
    checkout_success_title: "Your Order Has Been Placed! 🎉",
    checkout_success_desc: "Order Reference: ",
    checkout_whatsapp_track: "Track via WhatsApp Concierge",

    // Guarantees
    guarantee_title: "The Mini Pick Golden Promise",
    guarantee_inspection: "Inspect & verify all pieces before paying courier",
    guarantee_lasting: "Safe, premium high-precision parts with step-by-step guides",
    guarantee_shipping: "Signature cute pink gift packaging & fast tracked delivery",

    // Auth & Dashboard
    login_title: "Executive Portal",
    login_subtitle: "Enter Username, Password, and Security PIN",
    login_user: "Username",
    login_password: "Password",
    login_pin: "Security PIN",
    login_submit: "Access System",
    login_error: "Invalid credentials or incorrect security PIN",
    login_lockdown_error: "Emergency lockdown active! Only Owner Maestro can sign in.",
    
    dashboard_title: "Operations & Management",
    dashboard_emergency_lockdown: "Master Emergency Lockdown",
    dashboard_emergency_desc: "Instantly deactivate all staff and manager accounts with a single toggle (Owner Only)",
    dashboard_lockdown_active: "Lockdown Active (All Accounts Disabled)",
    dashboard_lockdown_inactive: "System Running Normally",
    dashboard_toggle_lockdown: "Toggle Lockdown",
    dashboard_total_sales: "Total Revenue",
    dashboard_total_orders: "Total Orders",
    dashboard_products_count: "Products in Catalog",
    dashboard_users_count: "Active Staff",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("minipick_lang") as Language;
    if (saved === "ar" || saved === "en") {
      setLangState(saved);
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    } else {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("minipick_lang", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  const toggleLanguage = () => {
    setLanguage(lang === "ar" ? "en" : "ar");
  };

  const t = (key: string): string => {
    return translations[lang][key] || translations["ar"][key] || key;
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
