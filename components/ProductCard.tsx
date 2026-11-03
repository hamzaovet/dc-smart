"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Star, Zap, Eye, ShieldCheck, Video } from "lucide-react";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang } = useLanguage();
  const { addToCart } = useCart();
  const isAr = lang === "ar";

  // Default security CCTV image placeholder
  const defaultImage =
    "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/50 bg-[#0b1120] border border-cyan-500/20 hover:border-cyan-500/50">
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full bg-[#080c14] overflow-hidden">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.image || defaultImage}
            alt={isAr ? product.nameAr : product.nameEn}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 border border-cyan-500/30 text-cyan-300 backdrop-blur-md">
            {product.type || "CCTV"}
          </span>

          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 backdrop-blur-md flex items-center gap-1 shadow-sm font-mono">
              ★ مميز
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <Link
          href={`/product/${product.slug}`}
          className="absolute bottom-2.5 right-2.5 p-2 rounded-lg bg-slate-950/80 border border-cyan-500/40 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md hover:bg-cyan-500 hover:text-slate-950"
          title="معاينة الصنف"
        >
          <Eye size={15} />
        </Link>
      </div>

      {/* Content Area */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-bold text-cyan-400 tracking-wider text-[11px] font-mono">
              {product.brandAr || product.brandEn || "DC SMART"}
            </span>
            <span className="text-[10px] text-slate-400">
              {product.category?.nameAr || "أنظمة مراقبة"}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition line-clamp-1 leading-snug">
              {isAr ? product.nameAr : product.nameEn}
            </h3>
          </Link>

          {/* Description Preview */}
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {isAr ? product.descriptionAr : product.descriptionEn}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2.5 border-t border-slate-800">
          <div className="flex items-baseline justify-between mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-base text-cyan-300 font-mono">
                {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-cyan-400 font-bold">ج.م</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-slate-500 line-through font-mono">
                  {product.originalPrice} ج.م
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-cyan-400 text-xs font-bold font-mono">
              <Star size={12} className="fill-cyan-400 text-cyan-400" />
              <span>{product.rating || 5}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addToCart(product, 1)}
              className="py-2 px-2.5 rounded-lg bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:bg-cyan-500/10 text-xs font-bold flex items-center justify-center gap-1 transition"
            >
              <ShoppingBag size={13} />
              <span>{isAr ? "أضف للسلة" : "Add to Bag"}</span>
            </button>

            <Link
              href={`/product/${product.slug}`}
              className="py-2 px-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 text-center shadow-md transition"
            >
              <Zap size={13} />
              <span>{isAr ? "المواصفات" : "Specs"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
