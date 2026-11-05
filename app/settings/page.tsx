"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import { useStoreSettings } from "@/context/StoreSettingsContext";
import SecurityPinModal from "@/components/SecurityPinModal";
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
  Building,
  Image as ImageIcon,
  FileText,
  Lock,
  ShieldAlert,
} from "lucide-react";
import InstagramIcon from "@/components/InstagramIcon";

export default function SettingsPage() {
  const { settings, updateSettings, loading } = useStoreSettings();

  // Company Identity
  const [storeNameAr, setStoreNameAr] = useState("");
  const [storeNameEn, setStoreNameEn] = useState("");
  const [taglineAr, setTaglineAr] = useState("");
  const [taglineEn, setTaglineEn] = useState("");
  const [logoUrl, setLogoUrl] = useState("/dc_logo.jpg");

  // Invoices & Quotations Terms
  const [invoiceTermsAr, setInvoiceTermsAr] = useState("");
  const [adminPin, setAdminPin] = useState("2026");

  // Contact Info
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
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("5000");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Security PIN
  const [isPinOpen, setIsPinOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);

  useEffect(() => {
    if (settings) {
      setStoreNameAr(settings.storeNameAr || "دي سي سمارت — للأنظمة الأمنية والتحكم الذكي");
      setStoreNameEn(settings.storeNameEn || "DC Smart — Smart Security & Technology Solutions");
      setTaglineAr(settings.taglineAr || "كاميرات مراقبة متطورة بدقة 4K و Full Color، أجهزة XVR/NVR، شبكات وحلول أمنية ذكية");
      setTaglineEn(settings.taglineEn || "Advanced 4K & Full Color CCTV Surveillance, XVR/NVR Recording & Smart Security Solutions");
      setLogoUrl(settings.logoUrl || "/dc_logo.jpg");
      setInvoiceTermsAr(
        settings.invoiceTermsAr ||
          "ضمان سنتين شامل على الكاميرات وأجهزة التسجيل ضد عيوب الصناعة — الدعم الفني والصيانة مستمران"
      );
      setAdminPin(settings.adminPin || "2026");

      setWhatsappPhone(settings.whatsappPhone || "01281248731");
      setHotline(settings.hotline || "01008657085");
      setSecondaryPhone(settings.secondaryPhone || "01007302685");
      setGoogleMapsUrl(settings.googleMapsUrl || "https://maps.google.com/?q=Tanta,Gharbia,Egypt");
      setAddressAr(settings.addressAr || "طنطا — محافظة الغربية — جمهورية مصر العربية");
      setAddressEn(settings.addressEn || "Tanta, Gharbia Governorate, Egypt");
      setWorkingHoursAr(settings.workingHoursAr || "يومياً من 9:00 صباحاً حتى 11:00 مساءً");
      setWorkingHoursEn(settings.workingHoursEn || "Daily from 9:00 AM to 11:00 PM");
      setInstagramHandle(settings.instagramHandle || "dcsmart.cctv");
      setAnnouncementAr(settings.announcementAr || "🛡️ ضمان عامين شامل استبدال فوري لكافة كاميرات المراقبة وأجهزة التسجيل + معاينة وتركيب احترافي");
      setAnnouncementEn(settings.announcementEn || "🛡️ 2-Year Full Replacement Warranty on all CCTV Cameras & DVRs + Professional Installation");
      setDeliveryFee(settings.deliveryFee?.toString() || "50");
      setFreeShippingThreshold(settings.freeShippingThreshold?.toString() || "5000");
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    playSound("click");

    // Also store admin PIN in localStorage for quick client-side auth
    if (adminPin.trim()) {
      localStorage.setItem("dc_admin_pin", adminPin.trim());
    }

    const ok = await updateSettings({
      storeNameAr,
      storeNameEn,
      taglineAr,
      taglineEn,
      logoUrl,
      invoiceTermsAr,
      adminPin,
      whatsappPhone,
      hotline,
      secondaryPhone,
      googleMapsUrl,
      addressAr,
      addressEn,
      workingHoursAr,
      workingHoursEn,
      instagramHandle,
      announcementAr,
      announcementEn,
      deliveryFee: Number(deliveryFee) || 0,
      freeShippingThreshold: Number(freeShippingThreshold) || 0,
    });

    setSaving(false);
    if (ok) {
      playSound("success");
      setSuccessMsg("تم حفظ كافة إعدادات الشركة وبيانات الفواتير والهوية بنجاح! ✨");
      setTimeout(() => setSuccessMsg(""), 5000);
    } else {
      alert("حدث خطأ أثناء حفظ الإعدادات، يرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <ErpLayout activeItem="settings">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-cyan-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Settings size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold font-serif text-cyan-400">
                إعدادات هوية الشركة وبيانات الفواتير وعروض الأسعار
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                تعديل اسم الشركة، الشعار واللوجو، شروط الضمان، أرقام الهواتف، وكلمة مرور العمليات المحمية
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-50 shrink-0"
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

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Section 1: Company Identity & Logo (Point 11) */}
          <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Building size={17} className="text-cyan-400" />
              <span>هوية الشركة واسم المنظومة الرسمي (يظهر في الترويسة والفواتير)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  اسم الشركة بالعربي *:
                </label>
                <input
                  type="text"
                  required
                  value={storeNameAr}
                  onChange={(e) => setStoreNameAr(e.target.value)}
                  placeholder="دي سي سمارت — للأنظمة الأمنية والتحكم الذكي"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  اسم الشركة بالإنجليزي (Company Name En):
                </label>
                <input
                  type="text"
                  value={storeNameEn}
                  onChange={(e) => setStoreNameEn(e.target.value)}
                  placeholder="DC Smart — Smart Security Solutions"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  الشعار اللفظي أو وصف النشاط (السلوجان بالعربي):
                </label>
                <input
                  type="text"
                  value={taglineAr}
                  onChange={(e) => setTaglineAr(e.target.value)}
                  placeholder="كاميرات مراقبة متطورة بدقة 4K و Full Color..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Logo URL & Preview */}
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  رابط لوجو الشركة (Logo URL or path):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="/dc_logo.jpg أو رابط مباشر"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                  {logoUrl && (
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="w-10 h-10 rounded-xl object-contain bg-zinc-900 border border-zinc-700 p-1"
                      onError={(e) => {
                        (e.target as any).src = "/dc_logo.jpg";
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Invoice & Quotation Defaults (Point 11) */}
          <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-cyan-300 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <FileText size={17} className="text-cyan-400" />
              <span>إعدادات الفواتير وعروض الأسعار والضمان المعتمد</span>
            </h3>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                نص شروط الفاتورة وعروض الأسعار الافتراضي (يطبع أسفل الفاتورة وعرض السعر):
              </label>
              <textarea
                rows={3}
                value={invoiceTermsAr}
                onChange={(e) => setInvoiceTermsAr(e.target.value)}
                placeholder="ضمان سنتين شامل على الكاميرات وأجهزة التسجيل ضد عيوب الصناعة..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                شريط التنبيه والإعلان أعلى المتجر:
              </label>
              <input
                type="text"
                value={announcementAr}
                onChange={(e) => setAnnouncementAr(e.target.value)}
                placeholder="🛡️ ضمان عامين شامل استبدال فوري..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
              />
            </div>
          </div>

          {/* Section 3: Master Security PIN (Point 6) */}
          <div className="bg-[#0c0914] border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Lock size={17} className="text-amber-400" />
              <span>رمز أمان العمليات المحمية (Master Security PIN) — خاص بالإدارة</span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              هذا الرمز يُطلب عند محاولة تعديل أو حذف العملاء، الموردين، فواتير الشراء، أو بنود المخزن، لمنع التلاعب.
            </p>

            <div className="max-w-xs">
              <label className="block text-zinc-300 font-medium mb-1">
                رمز أمان الإدارة (PIN):
              </label>
              <input
                type="password"
                required
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-amber-400 font-mono tracking-widest text-center text-lg focus:outline-none focus:border-amber-500 font-bold"
              />
            </div>
          </div>

          {/* Section 4: Phones & Contact */}
          <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Phone size={17} className="text-cyan-400" />
              <span>أرقام الهواتف وخدمة العملاء والواتساب الرسمية</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  رقم الهاتف الأساسي (فون المحل والأوردرات):
                </label>
                <input
                  type="text"
                  required
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  placeholder="01008657085"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  رقم الواتساب المربوط بزر الشراء والمحادثات:
                </label>
                <input
                  type="text"
                  required
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="01281248731"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  الرقم الثاني / الواتساب الإضافي:
                </label>
                <input
                  type="text"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  placeholder="01007302685"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  معرف حساب إنستاجرام (Instagram Handle):
                </label>
                <input
                  type="text"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="dcsmart.cctv"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Location & Address */}
          <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <MapPin size={17} className="text-cyan-400" />
              <span>عنوان المقر الرئيسي وخرائط جوجل ومواعيد العمل</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  العنوان بالتفصيل (عربي):
                </label>
                <input
                  type="text"
                  value={addressAr}
                  onChange={(e) => setAddressAr(e.target.value)}
                  placeholder="طنطا — محافظة الغربية — جمهورية مصر العربية"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  مواعيد وساعات العمل:
                </label>
                <input
                  type="text"
                  value={workingHoursAr}
                  onChange={(e) => setWorkingHoursAr(e.target.value)}
                  placeholder="يومياً من 9:00 صباحاً حتى 11:00 مساءً"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                رابط خرائط جوجل (Google Maps URL):
              </label>
              <input
                type="text"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
              />
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Save size={18} />
              <span>{saving ? "جاري حفظ الإعدادات..." : "حفظ وتثبيت كافة التعديلات"}</span>
            </button>
          </div>
        </form>
      </div>
    </ErpLayout>
  );
}
