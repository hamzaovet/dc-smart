"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { useStoreSettings } from "../../context/StoreSettingsContext";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Phone,
  CreditCard,
  Banknote,
} from "lucide-react";

export default function CheckoutPage() {
  const { lang, dir, t } = useLanguage();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { settings } = useStoreSettings();
  const isAr = lang === "ar";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("الغربية (طنطا والمحلة)");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert(isAr ? "برجاء كتابة الاسم ورقم الهاتف والعنوان بالتفصيل" : "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerCity: city,
          customerAddress: address,
          notes,
          paymentMethod,
          items,
          subtotal,
          deliveryFee,
          totalAmount: total,
        }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setOrderSuccess(data.order);
        clearCart();
      } else {
        alert(data.error || (isAr ? "حدث خطأ أثناء تسجيل الطلب" : "Error placing order"));
      }
    } catch (err) {
      console.error(err);
      alert(isAr ? "فشل الاتصال بالخادم، يرجى المحاولة ثانية" : "Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  // Success view
  if (orderSuccess) {
    const whatsappText = encodeURIComponent(
      `مساء الخير ميني بيك (Mini Pick)، قمت بطلب أوردر جديد عبر الموقع:\n` +
        `رقم الطلب: *${orderSuccess.orderNumber}*\n` +
        `الاسم: ${orderSuccess.customerName}\n` +
        `الهاتف: ${orderSuccess.customerPhone}\n` +
        `العنوان: ${orderSuccess.customerCity} - ${orderSuccess.customerAddress}\n` +
        `المبلغ الإجمالي: ${orderSuccess.totalAmount} ج.م\n` +
        `برجاء تأكيد الطلب وتحديد موعد الشحن والتسليم.`
    );

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-lg w-full glass-luxury p-8 rounded-3xl border border-pink-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 size={40} />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-pink-gradient">
              {t("checkout_success_title")}
            </h2>
            <p className="text-zinc-300 text-sm">
              {t("checkout_success_desc")}
              <span className="font-mono font-bold text-pink-400 text-lg mx-1">
                {orderSuccess.orderNumber}
              </span>
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
              {isAr
                ? "سيقوم فريق خدمة عملاء ميني بيك بالتواصل معك هاتفياً أو عبر واتساب لتأكيد شحن البوكس فوراً."
                : "Our Mini Pick team will reach out via WhatsApp or phone to confirm prompt dispatch."}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 space-y-2">
            <div className="flex justify-between">
              <span>{isAr ? "العميل:" : "Client:"}</span>
              <span className="font-bold text-zinc-100">{orderSuccess.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>{isAr ? "العنوان:" : "Address:"}</span>
              <span className="text-zinc-400">{orderSuccess.customerCity}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-800 pt-2 font-bold text-pink-400">
              <span>{isAr ? "المبلغ المطلوب عند الاستلام:" : "Total Amount Due:"}</span>
              <span className="text-base">{orderSuccess.totalAmount} ج.م</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={`https://wa.me/${(settings.whatsappPhone || "01069819381").replace(/\D/g, "").replace(/^0/, "20")}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg transition"
            >
              <MessageCircle size={18} />
              <span>{t("checkout_whatsapp_track")}</span>
            </a>

            <Link
              href="/"
              className="inline-block text-xs text-pink-400 hover:underline font-semibold"
            >
              {t("btn_continue_shopping")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-4">
          <ShoppingBag size={32} />
        </div>
        <h2 className="font-serif font-bold text-xl text-zinc-200 mb-2">{t("cart_empty")}</h2>
        <p className="text-xs text-zinc-400 mb-6 max-w-sm">
          {isAr
            ? "تصفح أحدث ألعاب النانو والبيدازلنج والمنظمات والهدايا الكيوت وأضف منتجاتك المفضلة للمتابعة."
            : "Browse our collections and select your favorite cute items and kits."}
        </p>
        <Link href="/#all-perfumes" className="px-6 py-3 rounded-xl btn-pink text-sm font-bold">
          {t("cart_explore")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-pink-400 font-bold">
          {isAr ? "خدمة العملاء والتوصيل السريع" : "Mini Pick Concierge & Fast Delivery"}
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-4xl text-pink-gradient mt-1">
          {t("checkout_title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Customer Details */}
        <div className="lg:col-span-7 glass-luxury p-6 sm:p-8 rounded-3xl border border-pink-500/20 space-y-6">
          <h2 className="font-serif font-bold text-lg text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Truck size={20} className="text-pink-400" />
            <span>{t("checkout_customer_info")}</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">
                {t("checkout_name")} <span className="text-pink-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isAr ? "مثال: مريم أحمد" : "e.g. Maryam Ahmed"}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-pink-400 text-sm text-zinc-100 outline-none transition"
              />
            </div>

            {/* Phone & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 mb-1.5 font-medium">
                  {t("checkout_phone")} <span className="text-pink-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-pink-400 text-sm text-zinc-100 outline-none transition font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1.5 font-medium">
                  {t("checkout_city")} <span className="text-pink-400">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-pink-400 text-sm text-zinc-100 outline-none transition font-sans"
                >
                  <option value="الغربية (طنطا والمحلة)">الغربية (طنطا والمحلة الكبرى - توصيل سريع)</option>
                  <option value="القاهرة والجيزة">القاهرة والجيزة</option>
                  <option value="الإسكندرية والبحيرة">الإسكندرية والبحيرة</option>
                  <option value="الدلتا والقليوبية والمنوفية">محافظات الدلتا (المنوفية، القليوبية، الشرقية، الدقهلية)</option>
                  <option value="القناة والسويس وبورسعيد">مدن القناة (السويس، الإسماعيلية، بورسعيد)</option>
                  <option value="الصعيد والوجه القبلي">محافظات الصعيد والوجه القبلي</option>
                  <option value="البحر الأحمر وشرم الشيخ">البحر الأحمر وشرم الشيخ</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">
                {t("checkout_address")} <span className="text-pink-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={
                  isAr
                    ? "المنطقة، اسم الشارع، رقم العمارة، رقم الشقة أو علامة مميزة..."
                    : "District, street, building number, apartment..."
                }
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-pink-400 text-sm text-zinc-100 outline-none transition resize-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-zinc-400 mb-1.5 font-medium">
                {t("checkout_notes")}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isAr ? "مثال: الاستلام بعد الساعة 4 عصراً، أو تغليف كهدية خاصة في بوكس بينك..." : "Special instructions..."}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-700/80 focus:border-pink-400 text-xs text-zinc-100 outline-none transition"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="pt-3 border-t border-zinc-800">
              <label className="block text-zinc-300 font-bold mb-2">
                {t("checkout_payment_method")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`p-3 rounded-xl border text-start flex items-center gap-3 transition ${
                    paymentMethod === "COD"
                      ? "bg-pink-500/15 border-pink-400 text-pink-300"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <Banknote size={20} className="shrink-0" />
                  <div>
                    <span className="font-bold block text-xs">
                      {isAr ? "الدفع عند الاستلام (COD)" : "Cash on Delivery"}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {isAr ? "افحص وعاين البوكس قبل الدفع للمندوب" : "Inspect before paying courier"}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("INSTAPAY")}
                  className={`p-3 rounded-xl border text-start flex items-center gap-3 transition ${
                    paymentMethod === "INSTAPAY"
                      ? "bg-pink-500/15 border-pink-400 text-pink-300"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <CreditCard size={20} className="shrink-0" />
                  <div>
                    <span className="font-bold block text-xs">
                      {isAr ? "إنستاباي / محفظة ذكية" : "InstaPay / Mobile Wallet"}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {isAr ? "تحويل فوري عند التأكيد" : "Instant direct transfer"}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl btn-pink text-center text-sm font-black flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50"
              >
                {loading ? (
                  <span>{t("checkout_submitting")}</span>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>{t("checkout_submit")} ({total} ج.م)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Summary: Items & Total */}
        <div className="lg:col-span-5 glass-luxury p-6 rounded-3xl border border-pink-500/30 space-y-5">
          <h3 className="font-serif font-bold text-base text-zinc-100 flex items-center justify-between border-b border-zinc-800 pb-3">
            <span>{t("checkout_order_summary")}</span>
            <span className="text-xs font-normal text-pink-400">
              {items.length} {isAr ? "منتجات مختارة" : "items"}
            </span>
          </h3>

          {/* Items Thumbnails */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                  <Image src={item.image} alt={item.nameAr} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-bold text-zinc-200 truncate">
                    {isAr ? item.nameAr : item.nameEn}
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    {item.volume} • {item.quantity} × {item.price} ج.م
                  </p>
                </div>
                <span className="font-bold text-pink-300 shrink-0">
                  {item.price * item.quantity} ج.م
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Calculation */}
          <div className="space-y-2 pt-3 border-t border-zinc-800 text-xs">
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
            <div className="flex justify-between text-base font-black text-zinc-100 pt-3 border-t border-zinc-800">
              <span>{t("checkout_total")}</span>
              <span className="text-pink-gradient text-xl">{total} ج.م</span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1.5">
            <div className="text-pink-300 font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>{isAr ? "سياسة المعاينة قبل الدفع" : "Try & Inspect Guarantee"}</span>
            </div>
            <p>
              {isAr
                ? "يحق لك فحص الشحنة والتأكد من سلامة البوكس وكافة القطع بحضور المندوب قبل دفع أي مبلغ."
                : "You have full inspection rights upon courier delivery prior to settling payment."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
