"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../context/LanguageContext";
import { useCart } from "../../../context/CartContext";
import { useStoreSettings } from "../../../context/StoreSettingsContext";
import ProductCard from "../../../components/ProductCard";
import {
  Sparkles,
  ShoppingBag,
  Zap,
  MessageCircle,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  Layers,
  Heart,
  Share2,
  Box,
  Truck,
  Plus,
  Minus,
  Sparkle,
} from "lucide-react";

interface ProductDetailsClientProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailsClient({
  product,
  relatedProducts,
}: ProductDetailsClientProps) {
  const { lang, dir, t } = useLanguage();
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();
  const router = useRouter();
  const isAr = lang === "ar";

  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  // Authenticity & Quality badge
  const typeBadgeMap: Record<string, { textAr: string; textEn: string; descAr: string; descEn: string; color: string }> = {
    ORIGINAL: {
      textAr: "أصلي 100% معتمد",
      textEn: "100% Authentic Original",
      descAr: "منتج أصلي معتمد بكامل العبوة والكتالوج الإرشادي وخامات آمنة عالية الدقة.",
      descEn: "Certified genuine product with full retail packaging, guide, and safe precision pieces.",
      color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
    },
    TESTER: {
      textAr: "طقم متكامل مع الأدوات",
      textEn: "Complete Kit with Tools",
      descAr: "يحتوي على كافة القطع والأدوات والملصقات اللازمة للتركيب فور فتح البوكس.",
      descEn: "Includes all essential pieces, application tools, and full step-by-step instructions.",
      color: "bg-pink-500/20 border-pink-500/40 text-pink-300",
    },
    HIGH_COPY: {
      textAr: "تريند تيك توك الأكثر طلباً 🔥",
      textEn: "Viral TikTok Sensation 🔥",
      descAr: "النسخة الأكثر رواجاً على منصات السوشيال ميديا وتيك توك بجودة فائقة وتغليف كيوت.",
      descEn: "The viral aesthetic sensation trending across TikTok with premium finish and cute packaging.",
      color: "bg-rose-500/20 border-rose-500/40 text-rose-300",
    },
    INSPIRED: {
      textAr: "إصدار حصري محدود",
      textEn: "Exclusive Limited Edition",
      descAr: "تصميم أنيق وحصري متوفر بكميات محدودة لجامعي الأطقم والهدايا الراقية.",
      descEn: "Exclusive cute aesthetic release available in limited batches for collectors and gifts.",
      color: "bg-purple-500/20 border-purple-500/40 text-purple-300",
    },
  };

  const badgeInfo = typeBadgeMap[product.type] || typeBadgeMap["ORIGINAL"];

  const handleInstantBuy = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isAr ? product.nameAr : product.nameEn,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappText = encodeURIComponent(
    `مساء الخير دي سي سمارت، أود الاستفسار والطلب للمنظومة / الصنف:\n` +
      `*${product.nameAr} (${product.nameEn})*\n` +
      `التصنيف / البراند: ${product.brandAr}\n` +
      `نوع الإصدار: ${badgeInfo.textAr}\n` +
      `المواصفات: ${product.volume || "طقم كامل"} - ${product.concentration || "أكريليك فاخر"}\n` +
      `السعر: ${product.price} ج.م\n` +
      `الكمية المطلوبة: ${quantity}\n` +
      `رابط المنتج: ${typeof window !== "undefined" ? window.location.href : ""}`
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
        <Link href="/" className="hover:text-pink-400">
          {t("nav_home")}
        </Link>
        <span>/</span>
        <Link href="/#all-perfumes" className="hover:text-pink-400">
          {isAr ? product.category?.nameAr : product.category?.nameEn}
        </Link>
        <span>/</span>
        <span className="text-pink-300 font-medium">
          {isAr ? product.nameAr : product.nameEn}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Product Imagery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden glass-luxury border border-pink-500/30 shadow-2xl bg-zinc-950">
            <Image
              src={product.image}
              alt={isAr ? product.nameAr : product.nameEn}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Badges on Image */}
            <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-none">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${badgeInfo.color}`}
              >
                {isAr ? badgeInfo.textAr : badgeInfo.textEn}
              </span>

              {product.isWinter && (
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-pink-500/20 border border-pink-400/40 text-pink-300 backdrop-blur-md flex items-center gap-1.5">
                  <span>🔥</span>
                  <span>{isAr ? "الأكثر طلباً ورواجاً" : "Trending Now"}</span>
                </span>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-black/60 border border-pink-500/30 text-pink-300 backdrop-blur-md hover:bg-pink-500 hover:text-white transition"
              title="Share Product"
            >
              <Share2 size={18} />
            </button>
            {copied && (
              <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-lg bg-emerald-500 text-black text-xs font-bold">
                {isAr ? "تم نسخ الرابط!" : "Link Copied!"}
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Brand & Title */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-pink-400 font-serif uppercase tracking-widest text-xs font-bold">
                {isAr ? product.brandAr : product.brandEn}
              </span>
              <div className="flex items-center gap-1 text-pink-400 font-bold">
                <Star size={14} className="fill-pink-400 text-pink-400" />
                <span>{product.rating}</span>
                <span className="text-zinc-500 text-xs">
                  ({product.reviewsCount} {isAr ? "تقييم حقيقي" : "reviews"})
                </span>
              </div>
            </div>

            <h1 className="font-serif font-black text-3xl sm:text-4xl text-zinc-100">
              {isAr ? product.nameAr : product.nameEn}
            </h1>
            <p className="font-sans text-sm text-zinc-400 mt-1">
              {isAr ? product.nameEn : product.nameAr}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="glass-luxury p-4 rounded-2xl border border-pink-500/20 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-zinc-400 block mb-1">{t("details_price")}</span>
              <div className="flex items-baseline gap-3">
                <span className="font-serif font-black text-3xl text-pink-gradient">
                  {product.price} ج.م
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-zinc-500 line-through">
                    {product.originalPrice} ج.م
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
                    {t("details_save")} {product.discountPercent}%
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                <CheckCircle2 size={14} />
                <span>{t("details_in_stock")}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-zinc-300 leading-relaxed font-light">
            {isAr ? product.descriptionAr : product.descriptionEn}
          </div>

          {/* Quality & Authenticity Details */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-1">
            <div className="font-bold text-pink-300 flex items-center gap-1.5">
              <ShieldCheck size={16} />
              <span>{isAr ? "ضمان درجة الجودة والأصالة:" : "Quality Guarantee:"} {isAr ? badgeInfo.textAr : badgeInfo.textEn}</span>
            </div>
            <p className="text-zinc-400">
              {isAr ? badgeInfo.descAr : badgeInfo.descEn}
            </p>
          </div>

          {/* Specs Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">{t("details_volume")}</span>
              <span className="font-bold text-zinc-200 mt-0.5 block">{product.volume || "مجموعة كاملة"}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">{t("details_concentration")}</span>
              <span className="font-bold text-zinc-200 mt-0.5 block">{product.concentration || "ABS فاخر"}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">{t("details_longevity")}</span>
              <span className="font-bold text-pink-300 mt-0.5 block">{product.longevityAr || "كافة الأعمار"}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <span className="text-zinc-500 block text-[10px]">{t("details_sillage")}</span>
              <span className="font-bold text-pink-300 mt-0.5 block">{product.sillageAr || "بوكس بينك فاخر"}</span>
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Counter */}
              <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-sm text-pink-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-3.5 px-4 rounded-xl btn-pink text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
              >
                <ShoppingBag size={18} />
                <span>{t("btn_add_to_cart")}</span>
              </button>
            </div>

            {/* Direct Buy & WhatsApp Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleInstantBuy}
                className="py-3 px-4 rounded-xl bg-pink-500/15 border border-pink-400/40 hover:bg-pink-500/25 text-pink-300 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Zap size={16} />
                <span>{t("btn_buy_now")}</span>
              </button>

              <a
                href={`https://wa.me/${(settings.whatsappPhone || "01069819381").replace(/\D/g, "").replace(/^0/, "20")}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 transition text-center"
              >
                <MessageCircle size={16} />
                <span>{t("btn_order_whatsapp")}</span>
              </a>
            </div>
          </div>

          {/* The DC Smart Golden Guarantee Banner */}
          <div className="p-4 rounded-2xl glass-luxury border border-pink-500/25 space-y-2">
            <h4 className="font-serif font-bold text-xs text-pink-400 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>{t("guarantee_title")}</span>
            </h4>
            <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside font-light">
              <li>{t("guarantee_inspection")}</li>
              <li>{t("guarantee_lasting")}</li>
              <li>{t("guarantee_shipping")}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* UNBOXING & ARCHITECTURE SPECS SECTION */}
      <section className="mt-16 pt-12 border-t border-zinc-800">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-pink-400 font-bold">
            {isAr ? "محتويات البوكس وتجربة التركيب" : "Unboxing & Build Experience"}
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-pink-gradient mt-1">
            {t("details_pyramid")}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isAr
              ? "مواصفات دقيقة لكل كاميرا وجهاز وتفاصيل ما ستجده فور استلام المنظومة المعتمدة من دي سي سمارت"
              : "Precise specifications of each piece and complete unboxing details"}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Box Contents */}
          <div className="glass-luxury p-6 rounded-2xl border border-pink-500/20 text-center relative overflow-hidden group hover:border-pink-400/50 transition">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mx-auto mb-4">
              <Box size={22} />
            </div>
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block mb-1">
              {isAr ? "المرحلة 1: فتح الصندوق" : "Unboxing Experience"}
            </span>
            <h3 className="font-serif font-bold text-base text-zinc-100 mb-2">
              {t("details_top_notes")}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-light">
              {isAr ? product.topNotesAr : product.topNotesEn}
            </p>
          </div>

          {/* Build Precision */}
          <div className="glass-luxury p-6 rounded-2xl border border-pink-500/35 text-center relative overflow-hidden group hover:border-pink-400/60 transition shadow-xl">
            <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300 mx-auto mb-4">
              <Sparkle size={22} />
            </div>
            <span className="text-[10px] font-bold text-pink-300 uppercase tracking-widest block mb-1">
              {isAr ? "المرحلة 2: الجودة والدقة" : "Build Precision & Quality"}
            </span>
            <h3 className="font-serif font-bold text-base text-zinc-100 mb-2">
              {t("details_heart_notes")}
            </h3>
            <p className="text-xs text-zinc-200 leading-relaxed font-light">
              {isAr ? product.heartNotesAr : product.heartNotesEn}
            </p>
          </div>

          {/* Aesthetic Display */}
          <div className="glass-luxury p-6 rounded-2xl border border-pink-500/20 text-center relative overflow-hidden group hover:border-pink-400/50 transition">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mx-auto mb-4">
              <Heart size={22} />
            </div>
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest block mb-1">
              {isAr ? "المرحلة 3: النتيجة والبهجة" : "Display & Satisfaction"}
            </span>
            <h3 className="font-serif font-bold text-base text-zinc-100 mb-2">
              {t("details_base_notes")}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-light">
              {isAr ? product.baseNotesAr : product.baseNotesEn}
            </p>
          </div>
        </div>

        {/* Materials & Guidelines Box */}
        {product.ingredientsAr && (
          <div className="mt-8 max-w-5xl mx-auto glass-luxury p-6 rounded-2xl border border-zinc-800 text-xs">
            <h4 className="font-serif font-bold text-sm text-pink-300 mb-2 flex items-center gap-2">
              <Layers size={16} />
              <span>{t("details_ingredients")}</span>
            </h4>
            <p className="text-zinc-400 leading-relaxed">
              {isAr ? product.ingredientsAr : product.ingredientsEn}
            </p>
          </div>
        )}
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-zinc-800">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-widest text-pink-400 font-bold">
              {isAr ? "منتجات مقترحة تناسب ذوقك الكيوت" : "You May Also Love"}
            </span>
            <h2 className="font-serif font-black text-2xl text-pink-gradient mt-1">
              {isAr ? "ملحقات ومهمات إضافية مقترحة من دي سي سمارت" : "Complementary Security Gear"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
