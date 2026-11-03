"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useStoreSettings } from "../context/StoreSettingsContext";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MessageCircle,
} from "lucide-react";

export default function CartDrawer() {
  const { lang, dir, t } = useLanguage();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
  } = useCart();
  const { settings } = useStoreSettings();

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold || 1500;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // WhatsApp order summary
  const rawPhone = settings.whatsappPhone || "01069819381";
  const cleanPhone = rawPhone.replace(/\D/g, "");
  const whatsappNumber = cleanPhone.startsWith("0") ? `2${cleanPhone}` : cleanPhone;

  const whatsappCartText = encodeURIComponent(
    `مساء الخير، أود طلب المنتجات التالية من ميني بيك (Mini Pick):\n` +
      items
        .map(
          (i, idx) =>
            `${idx + 1}. ${i.nameAr} (${i.volume || "طقم كامل"}) × ${i.quantity} = ${i.price * i.quantity} ج.م`
        )
        .join("\n") +
      `\n\nإجمالي المنتجات: ${subtotal} ج.م` +
      `\nالشحن: ${deliveryFee === 0 ? "مجاني" : `${deliveryFee} ج.م`}` +
      `\nالمبلغ الإجمالي: ${total} ج.م` +
      `\nبرجاء تأكيد الطلب وتحديد موعد الشحن لطنطا / محافظتي.`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className={`fixed inset-y-0 ${dir === "rtl" ? "left-0" : "right-0"} max-w-full flex`}>
        <div className="w-screen max-w-md bg-[#0f0b12] border-x border-pink-500/20 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-pink-400" />
              <h2 className="font-serif font-bold text-lg text-pink-gradient">
                {t("cart_title")} ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-4 py-3 bg-pink-950/20 border-b border-pink-500/10 text-xs">
            {neededForFreeShipping > 0 ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-pink-300">
                  <span>
                    {lang === "ar"
                      ? `أضف منتجات بقيمة ${neededForFreeShipping} ج.م إضافية للشحن المجاني!`
                      : `Add ${neededForFreeShipping} EGP more for FREE shipping!`}
                  </span>
                  <span className="font-bold">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Sparkles size={14} />
                <span>
                  {lang === "ar"
                    ? "مبروك! حصلت على شحن مجاني لكافة محافظات مصر"
                    : "Congratulations! You unlocked FREE shipping!"}
                </span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-zinc-500">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                  <ShoppingBag size={28} className="text-zinc-600" />
                </div>
                <p className="text-sm font-medium mb-4">{t("cart_empty")}</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded-xl btn-pink text-xs font-bold"
                >
                  {t("cart_explore")}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-pink-500/30 transition"
                >
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                    <Image
                      src={item.image}
                      alt={item.nameAr}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[11px] text-pink-400 font-medium tracking-wider">
                          {lang === "ar" ? item.brandAr : item.brandEn}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-0.5"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-zinc-200 line-clamp-1">
                        {lang === "ar" ? item.nameAr : item.nameEn}
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        {item.volume} • {item.concentration}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60">
                      <div className="flex items-center gap-2 bg-zinc-800/80 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-white"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold px-1 text-pink-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-white"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-bold text-sm text-pink-gradient">
                        {item.price * item.quantity} ج.م
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex flex-col gap-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>{t("checkout_subtotal")}</span>
                  <span className="font-semibold text-zinc-200">{subtotal} ج.م</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>{t("checkout_delivery")}</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold">{t("checkout_free_delivery")}</span>
                    ) : (
                      `${deliveryFee} ج.م`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-100 pt-2 border-t border-zinc-800">
                  <span>{t("checkout_total")}</span>
                  <span className="text-pink-gradient font-black text-base">{total} ج.م</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-xl btn-pink text-center text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>{lang === "ar" ? "متابعة لإتمام الطلب" : "Proceed to Checkout"}</span>
                  {dir === "rtl" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </Link>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappCartText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-400 text-center text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <MessageCircle size={15} />
                  <span>{lang === "ar" ? "طلب السلة مباشرة عبر واتساب" : "Direct WhatsApp Order"}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
