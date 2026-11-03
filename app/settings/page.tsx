"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import {
  Settings,
  Save,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Sparkles,
  Truck,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";

export default function SettingsPage() {
  const { settings, updateSettings, loading } = useStoreSettings();

  const [storeNameAr, setStoreNameAr] = useState("");
  const [storeNameEn, setStoreNameEn] = useState("");
  const [taglineAr, setTaglineAr] = useState("");
  const [taglineEn, setTaglineEn] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [hotline, setHotline] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [addressAr, setAddressAr] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [workingHoursAr, setWorkingHoursAr] = useState("");
  const [workingHoursEn, setWorkingHoursEn] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [announcementAr, setAnnouncementAr] = useState("");
  const [announcementEn, setAnnouncementEn] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("50");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("1500");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (settings) {
      setStoreNameAr(settings.storeNameAr || "ميني بيك — بوتيك الألعاب التركيبية والهدايا الترند");
      setStoreNameEn(settings.storeNameEn || "Mini Pick — Cute Aesthetic & Nano Blocks");
      setTaglineAr(settings.taglineAr || "");
      setTaglineEn(settings.taglineEn || "");
      setWhatsappPhone(settings.whatsappPhone || "01050757837");
      setHotline(settings.hotline || "01050757837");
      setSecondaryPhone(settings.secondaryPhone || "01069819381");
      setGoogleMapsUrl(settings.googleMapsUrl || "https://maps.app.goo.gl/z2QCHZzSuJaaNHPV7");
      setAddressAr(settings.addressAr || "طنطا — محافظة الغربية");
      setAddressEn(settings.addressEn || "Tanta — Gharbia Governorate, Egypt");
      setWorkingHoursAr(settings.workingHoursAr || "يومياً من 10 صباحاً وحتى 12 منتصف الليل");
      setWorkingHoursEn(settings.workingHoursEn || "Daily from 10:00 AM to 12:00 Midnight");
      setInstagramHandle(settings.instagramHandle || "minipick.eg");
      setAnnouncementAr(settings.announcementAr || "");
      setAnnouncementEn(settings.announcementEn || "");
      setDeliveryFee(settings.deliveryFee?.toString() || "50");
      setFreeShippingThreshold(settings.freeShippingThreshold?.toString() || "1500");
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    playSound("click");

    const ok = await updateSettings({
      storeNameAr,
      storeNameEn,
      taglineAr,
      taglineEn,
      whatsappPhone: whatsappPhone.trim(),
      hotline: hotline.trim(),
      secondaryPhone: secondaryPhone.trim(),
      googleMapsUrl: googleMapsUrl.trim(),
      addressAr,
      addressEn,
      workingHoursAr,
      workingHoursEn,
      instagramHandle: instagramHandle.trim(),
      announcementAr,
      announcementEn,
      deliveryFee: Number(deliveryFee) || 50,
      freeShippingThreshold: Number(freeShippingThreshold) || 1500,
    });

    setSaving(false);
    if (ok) {
      playSound("success");
      setSuccessMsg("تم حفظ كافة إعدادات المتجر وبيانات الاتصال واللوكيشن بنجاح وظهرت في واجهة المتجر والكارت فوراً! ✨");
      setTimeout(() => setSuccessMsg(""), 5000);
    } else {
      alert("حدث خطأ أثناء حفظ الإعدادات، يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <ErpLayout activeItem="settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-pink-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <Settings size={22} />
            </span>
            <div>
              <h1 className="text-xl font-black font-serif text-pink-gradient">
                إعدادات المتجر وبيانات الاتصال واللوكيشن
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                تعديل أرقام الهواتف، الواتساب، رابط Google Maps، العناوين، وساعات العمل للمتجر بالكامل
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? "جاري الحفظ..." : "حفظ التعديلات"}</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Contact Numbers & WhatsApp */}
          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Phone size={17} className="text-pink-400" />
              <span>أرقام الهواتف وخدمة العملاء والواتساب الرسمية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  رقم الهاتف الأساسي والواتساب (فون المحل والأوردرات):
                </label>
                <input
                  type="text"
                  required
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  placeholder="01050757837"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
                />
                <span className="text-[10.5px] text-zinc-500 mt-1 block">
                  يظهر في الترويسة العلوية وبند خدمة العملاء وفي الفواتير والكارت الرسمي.
                </span>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  الرقم الثاني / الواتساب الإضافي:
                </label>
                <input
                  type="text"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  placeholder="01069819381"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
                />
                <span className="text-[10.5px] text-zinc-500 mt-1 block">
                  رقم احتياطي للعملاء واستقبال أي استفسارات أو أوردرات إضافية.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  رقم الواتساب المربوط بزر الشراء المباشر:
                </label>
                <input
                  type="text"
                  required
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="01050757837"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
                />
                <span className="text-[10.5px] text-zinc-500 mt-1 block">
                  ترسل له رسائل زر &quot;الطلب عبر واتساب&quot; وتفاصيل العطور تلقائياً.
                </span>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1 flex items-center gap-1.5">
                  <InstagramIcon size={14} className="text-pink-400" />
                  <span>معرف حساب إنستاجرام (Instagram Handle):</span>
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 rounded-r-xl bg-zinc-800 border border-r-0 border-zinc-700 text-zinc-400 font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="minipick.eg"
                    className="w-full px-3.5 py-2.5 rounded-l-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Address & Google Maps Details */}
          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <MapPin size={17} className="text-pink-400" />
              <span>عنوان البوتيك ورابط الموقع على خرائط جوجل (Google Maps)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  العنوان بالتفصيل (عربي):
                </label>
                <input
                  type="text"
                  value={addressAr}
                  onChange={(e) => setAddressAr(e.target.value)}
                  placeholder="طنطا — محافظة الغربية"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  العنوان بالإنجليزية (English):
                </label>
                <input
                  type="text"
                  value={addressEn}
                  onChange={(e) => setAddressEn(e.target.value)}
                  placeholder="Tanta — Gharbia Governorate, Egypt"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="text-xs pt-2">
              <label className="block text-zinc-300 font-medium mb-1 flex items-center justify-between">
                <span>رابط لوكيشن المتجر على خرائط جوجل (Google Maps URL):</span>
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:underline flex items-center gap-1 font-sans"
                  >
                    <span>فتح اللوكيشن</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.app.goo.gl/z2QCHZzSuJaaNHPV7"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
              />
              <span className="text-[10.5px] text-zinc-500 mt-1 block">
                يتيح للعملاء فتح الخريطة مباشرة بنقرة واحدة والوصول لمحل ميني بيك.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block text-zinc-300 font-medium mb-1 flex items-center gap-1.5">
                  <Clock size={14} className="text-pink-400" />
                  <span>مواعيد وساعات العمل واستقبال الزوار:</span>
                </label>
                <input
                  type="text"
                  value={workingHoursAr}
                  onChange={(e) => setWorkingHoursAr(e.target.value)}
                  placeholder="يومياً من 10 صباحاً وحتى 12 منتصف الليل"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  الحد الأدنى للشحن المجاني (ج.م):
                </label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Announcement Bar & Branding */}
          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Sparkles size={17} className="text-pink-400" />
              <span>الشريط الإعلاني العلوي للموقع والهوية</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  نص الشريط الإعلاني (عربي):
                </label>
                <input
                  type="text"
                  value={announcementAr}
                  onChange={(e) => setAnnouncementAr(e.target.value)}
                  placeholder="✨ شحن مجاني للطلبات فوق 1500 ج.م + عينات مجانية فاخرة مع كل طلب ✨"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  نص الشريط الإعلاني بالإنجليزية:
                </label>
                <input
                  type="text"
                  value={announcementEn}
                  onChange={(e) => setAnnouncementEn(e.target.value)}
                  placeholder="✨ Free shipping on orders over 1500 EGP + complimentary luxury samples ✨"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? "جاري الحفظ..." : "حفظ وتطبيق الإعدادات على المتجر فوراً"}</span>
            </button>
          </div>
        </form>
      </div>
    </ErpLayout>
  );
}
