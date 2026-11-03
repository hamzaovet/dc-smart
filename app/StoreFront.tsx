"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import ProductCard from "../components/ProductCard";
import {
  ShieldCheck,
  Search,
  Filter,
  Star,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Flame,
  Award,
  Phone,
  MessageCircle,
  FileText,
  Layers,
  Cctv,
  Video,
  HardDrive,
  Cpu,
  Wifi,
  ExternalLink,
} from "lucide-react";

interface StoreFrontProps {
  initialProducts: any[];
  categories: any[];
  reviews: any[];
}

export default function StoreFront({
  initialProducts,
  categories,
  reviews,
}: StoreFrontProps) {
  const { lang, dir } = useLanguage();
  const isAr = lang === "ar";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Featured Products
  const featuredProducts = useMemo(() => {
    return initialProducts.filter((p) => p.isFeatured);
  }, [initialProducts]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "all") {
          if (p.category?.slug !== selectedCategory && p.categoryId !== selectedCategory) {
            return false;
          }
        }

        // Type filter
        if (selectedType !== "all") {
          if (p.type !== selectedType) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName =
            p.nameAr.toLowerCase().includes(q) || (p.nameEn && p.nameEn.toLowerCase().includes(q));
          const matchBrand =
            p.brandAr.toLowerCase().includes(q) || (p.brandEn && p.brandEn.toLowerCase().includes(q));
          const matchDesc =
            (p.descriptionAr && p.descriptionAr.toLowerCase().includes(q)) ||
            (p.descriptionEn && p.descriptionEn.toLowerCase().includes(q));
          if (!matchName && !matchBrand && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [initialProducts, selectedCategory, selectedType, searchQuery, sortBy]);

  // Fallback Verified Security Reviews
  const displayReviews = reviews.length > 0 ? reviews : [
    {
      customerName: "م. محمد إبراهيم",
      customerCity: "فيلا بالمنطقة السياحية — طنطا",
      rating: 5,
      comment: "منظومة كاميرات داهوا 5 ميجا ألوان ليلية Full Color مع مايك مدمج وربط كامل على الهاتف. شغل هندسي نظيف جداً وتمديدات معزولة باحترافية.",
    },
    {
      customerName: "الحاج خالد العطار",
      customerCity: "مصنع غزل ونسيج — الغربية",
      rating: 5,
      comment: "تم توريد وتركيب 16 كاميرا خارجية وجهاز NVR يوني آرك مع هاردات سيجيت المعتمدة. دقة عالية في المواعيد ودعم فني ممتاز بعد التشغيل.",
    },
    {
      customerName: "د. أحمد عبد الغفار",
      customerCity: "مجمع عيادات وصيدلية — طنطا",
      rating: 5,
      comment: "كاميرات المراقبة الداخلية الذكية بمايك وصوت نقي جداً، والمهندس برمج التطبيق على موبايلات الإدارة وشرح كل التفاصيل. شركة محترمة وأسعار ممتازة.",
    },
    {
      customerName: "أ. طارق السعدني",
      customerCity: "معرض تجاري وشركات — طنطا",
      rating: 5,
      comment: "سرعة في المعاينة وعرض السعر كان مفصل وواضح بالبند والكميات. الضمان عامين رسمي والفريق الفني متمكن جداً.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 border-b border-cyan-500/20">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute -top-10 right-10 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 text-xs font-bold tracking-wide">
              <ShieldCheck size={14} className="text-cyan-400" />
              <span>
                {isAr
                  ? "دي سي سمارت — لأنظمة المراقبة المتطورة والتحكم الذكي 2026"
                  : "DC Smart — CCTV & Smart Surveillance Systems"}
              </span>
            </div>

            <h1 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.2]">
              {isAr ? (
                <>
                  أمان ممتلكاتك بأحدث تقنيات <span className="text-cyan-400">كاميرات المراقبة</span> والذكاء الاصطناعي
                </>
              ) : (
                <>
                  Secure Your Assets with <span className="text-cyan-400">Next-Gen CCTV</span> & Smart Tech
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-light">
              {isAr
                ? "توريد وتركيب وبرمجة أنظمة المراقبة الأمنية المتكاملة (Dahua, HiLook, UNV, Uniarch, Ezviz, Electrotech) بدقة Full Color ملونة 24 ساعة، وأجهزة XVR/NVR وشبكات وكابلات نحاسية معتمدة مع ضمان عامين كاملين."
                : "Professional supply, structured cabling, and calibration for high-definition 2MP, 5MP, and 4K surveillance systems with full mobile streaming and 2-year warranty."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#products"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:scale-105 transition"
              >
                <span>{isAr ? "تصفح الكتالوج والأسعار" : "Browse Equipment"}</span>
                {dir === "rtl" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </a>

              <Link
                href="/quotes"
                className="px-6 py-3 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs sm:text-sm font-bold transition flex items-center gap-2 hover:bg-slate-800"
              >
                <FileText size={16} className="text-cyan-400" />
                <span>{isAr ? "طلب وتوليد عرض سعر رسمي" : "Generate Quotation"}</span>
              </Link>

              <a
                href="https://wa.me/201008657085"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 text-xs sm:text-sm font-bold transition flex items-center gap-1.5"
              >
                <MessageCircle size={16} />
                <span>{isAr ? "استشارة واتساب" : "WhatsApp"}</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-xs text-slate-400">
              <div className="flex flex-col items-center lg:items-start gap-1">
                <span className="font-black text-cyan-400 text-lg sm:text-xl font-mono">150+</span>
                <span>{isAr ? "صنف ومعدة أصلية" : "Genuine Items"}</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1 border-x border-slate-800 px-2">
                <span className="font-black text-cyan-400 text-lg sm:text-xl font-mono">2 سنة</span>
                <span>{isAr ? "ضمان شامل معتمد" : "2-Year Warranty"}</span>
              </div>
              <div className="flex flex-col items-center lg:items-start gap-1">
                <span className="font-black text-cyan-400 text-lg sm:text-xl">طنطا</span>
                <span>{isAr ? "معاينة لكافة المحافظات" : "Egypt Wide"}</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden bg-slate-900/80 p-2 shadow-2xl border-2 border-cyan-500/30">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between p-6">
                {/* Tech Visual Graphic */}
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-emerald-400">LIVE FEED • 4K HD</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-300 font-mono text-[11px] border border-cyan-500/30">
                    DC-CAM-PRO
                  </span>
                </div>

                <div className="text-center py-8 space-y-3">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-500/10">
                    <Video size={48} className="text-cyan-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-white">منظومات المراقبة فائقة الدقة</h3>
                    <p className="text-xs text-slate-400">Dahua • HiLook • UNV • Uniarch • Electrotech</p>
                  </div>
                </div>

                {/* Floating Glass Label */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold">باقة 4 كاميرات 5MP + جهاز XVR</span>
                    <span className="text-cyan-400 font-mono font-bold">عرض خاص</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>تشمل التوريد، الهارد، والباور سبلاي</span>
                    <Link
                      href="/quotes"
                      className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black transition"
                    >
                      طلب عرض
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section id="categories" className="py-14 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
            {isAr ? "الماركات والأنظمة المعتمدة" : "Surveillance Systems & Brands"}
          </span>
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-white mt-1">
            {isAr ? "أنظمة المراقبة وتجهيزات البنية التحتية" : "Security Equipment Categories"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isAr
              ? "كاميرات HD وأجهزة IP، كاميرات واي فاي ذكية، وحدات تسجيل XVR/NVR، هاردات مخصصة وكابلات معتمدة"
              : "HD & IP Cameras, Smart Wi-Fi Cameras, Recorders, Surveillance Hard Disks & Structured Cables"}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.slug;
            return (
              <button
                key={c.id || c.slug}
                onClick={() => {
                  setSelectedCategory(c.slug);
                  const el = document.getElementById("products");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`p-4 rounded-xl text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 group border ${
                  isSelected
                    ? "bg-gradient-to-b from-cyan-600/30 to-blue-600/10 border-cyan-500 shadow-lg shadow-cyan-500/20"
                    : "bg-slate-900/70 border-slate-800 hover:border-cyan-500/50 hover:-translate-y-0.5"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl group-hover:scale-110 transition">
                  {c.icon || "📹"}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition line-clamp-1">
                    {isAr ? c.nameAr : c.nameEn}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {c.slug}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED BESTSELLERS */}
      {featuredProducts.length > 0 && (
        <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">
                <span>🛡️</span>
                <span>{isAr ? "الأجهزة الأكثر طلباً واعتماداً" : "Top Security Equipment"}</span>
              </div>
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-white">
                {isAr ? "مختارات مميزة لأنظمة المراقبة" : "Featured Surveillance Gear"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {isAr
                  ? "أعلى الكاميرات وأجهزة التسجيل مبيعاً وتقييماً من المهندسين والعملاء"
                  : "Highest rated CCTV equipment trusted by engineers and businesses"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-cyan-300 font-bold px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 font-mono">
                {featuredProducts.length} {isAr ? "منتج مميز" : "Featured Items"}
              </span>
            </div>
          </div>

          {/* Featured Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ALL PRODUCTS WITH FILTERING */}
      <section id="products" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20 border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
            {isAr ? "الكتالوج الرسمي المعتمد" : "Full Equipment Catalog"}
          </span>
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-white mt-1">
            {isAr ? "جميع أجهزة ومعدات دي سي سمارت" : "All DC Smart Products"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {isAr
              ? "ابحث باسم الكاميرا، الموديل، الماركة (داهوا، يوني آرك، هاي لوك، إلكتروتك) أو اختر القسم"
              : "Search by model, brand, or resolution to find the exact equipment you need"}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="rounded-2xl p-4 sm:p-5 mb-8 bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={18}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  dir === "rtl" ? "right-3.5" : "left-3.5"
                } text-slate-400`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن كاميرا، جهاز تسجيل XVR/NVR، كابل، هارد ديسك، أو باور سبلاي..." : "Search cameras, recorders, cables, hard drives..."}
                className={`w-full py-2.5 ${
                  dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                } rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none transition`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute top-1/2 -translate-y-1/2 ${
                    dir === "rtl" ? "left-3.5" : "right-3.5"
                  } text-xs text-slate-400 hover:text-white`}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 outline-none focus:border-cyan-400"
            >
              <option value="featured">{isAr ? "المقترحة" : "Featured"}</option>
              <option value="price-low">{isAr ? "السعر: من الأقل للأعلى" : "Price: Low to High"}</option>
              <option value="price-high">{isAr ? "السعر: من الأعلى للأقل" : "Price: High to Low"}</option>
              <option value="rating">{isAr ? "الأعلى تقييماً" : "Top Rated"}</option>
            </select>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedCategory === "all"
                  ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                  : "bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-500/40"
              }`}
            >
              {isAr ? "جميع الأقسام (الكل)" : "All Products"}
            </button>
            {categories.map((c) => (
              <button
                key={c.id || c.slug}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${
                  selectedCategory === c.slug
                    ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20"
                    : "bg-slate-950 border border-slate-800 text-slate-300 hover:border-cyan-500/40"
                }`}
              >
                <span>{c.icon || "📹"}</span>
                <span>{isAr ? c.nameAr : c.nameEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
            <p className="text-slate-400 text-sm">
              {isAr ? "لا توجد أجهزة تطابق خيارات البحث الحالية" : "No equipment found matching your search."}
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedType("all");
                setSearchQuery("");
              }}
              className="text-xs text-cyan-400 underline font-semibold"
            >
              {isAr ? "إعادة ضبط الفلاتر" : "Reset Filters"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* VERIFIED REVIEWS SECTION */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">
            {isAr ? "آراء وتقييمات العملاء والمؤسسات" : "Client Reviews & Feedback"}
          </span>
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-white mt-1">
            {isAr ? "ثقة وتجارب نعتز بها دائماً في طنطا ومصر" : "Trusted Installations Across Egypt"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayReviews.map((r, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/70 border border-cyan-500/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-cyan-400 mb-2">
                  {[...Array(r.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-cyan-400 text-cyan-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">
                    {r.customerName}
                  </h4>
                  <span className="text-[10px] text-cyan-400/90">
                    {r.customerCity}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={12} />
                  <span>{isAr ? "مشروع معتمد" : "Verified Project"}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
