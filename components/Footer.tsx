"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useStoreSettings } from "../context/StoreSettingsContext";
import {
  Phone,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Download,
  CreditCard,
  Lock,
  MapPin,
  CheckCircle2,
  FileText,
  Cctv,
} from "lucide-react";
import FacebookIcon from "./FacebookIcon";

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const { settings } = useStoreSettings();
  const isAr = lang === "ar";

  // Hide Footer on ERP routes
  const isErpRoute =
    pathname === "/dashboard" ||
    pathname === "/cashier" ||
    pathname === "/quotes" ||
    pathname === "/menu-admin" ||
    pathname === "/inventory" ||
    pathname === "/reports" ||
    pathname === "/customers" ||
    pathname === "/users" ||
    pathname === "/suppliers" ||
    pathname === "/offers-admin" ||
    pathname === "/sales-returns" ||
    pathname === "/settings" ||
    pathname === "/login";

  if (isErpRoute) {
    return null;
  }

  const phoneDisplay = settings.hotline || settings.whatsappPhone || "01008657085";
  const secondaryPhoneDisplay = settings.secondaryPhone || "01281248731";
  const thirdPhone = "01007302685";
  const cleanPhone = phoneDisplay.replace(/\D/g, "");
  const waNumber = cleanPhone.startsWith("0") ? `2${cleanPhone}` : cleanPhone;
  const facebookUrl = "https://www.facebook.com/profile.php?id=61590561604312";
  const mapsUrl = settings.googleMapsUrl || "https://maps.google.com/?q=Tanta,Gharbia,Egypt";
  const addressText = isAr
    ? settings.addressAr || "طنطا — محافظة الغربية — جمهورية مصر العربية"
    : settings.addressEn || "Tanta, Gharbia Governorate, Egypt";
  const hoursText = isAr
    ? settings.workingHoursAr || "يومياً من 10:00 صباحاً وحتى 11:00 مساءً"
    : settings.workingHoursEn || "Daily 10:00 AM - 11:00 PM";

  return (
    <footer className="bg-[#080c14] border-t border-cyan-500/20 text-slate-400 mt-20">
      {/* Guarantees Bar */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center p-5 rounded-2xl bg-[#0b1120] border border-cyan-500/15">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <ShieldCheck size={24} />
            </div>
            <h4 className="font-sans font-bold text-base text-slate-100 mb-1">
              {isAr ? "ضمان شامل معتمد لمدة عامين" : "2-Year Comprehensive Warranty"}
            </h4>
            <p className="text-xs text-slate-400 max-w-xs">
              {isAr
                ? "ضمان استبدال فوري ودعم فني على كافة الكاميرات وأجهزة التسجيل ومصادر الطاقة من التوكيلات الرسمية."
                : "Full replacement warranty and technical support on cameras, recorders, and power systems."}
            </p>
          </div>

          <div className="flex flex-col items-center p-5 rounded-2xl bg-[#0b1120] border border-cyan-500/15">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="font-sans font-bold text-base text-slate-100 mb-1">
              {isAr ? "معاينة هندسية وتركيب احترافي" : "Professional Site Survey & Setup"}
            </h4>
            <p className="text-xs text-slate-400 max-w-xs">
              {isAr
                ? "معاينة دقيقة للموقع، تمديدات شبكات نحاسية معزولة، وضبط زوايا الرؤية والنطاق الليلي بدقة متناهية."
                : "Site inspection, structured copper cabling, and optimum camera angle calibration."}
            </p>
          </div>

          <div className="flex flex-col items-center p-5 rounded-2xl bg-[#0b1120] border border-cyan-500/15">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
              <Truck size={24} />
            </div>
            <h4 className="font-sans font-bold text-base text-slate-100 mb-1">
              {isAr ? "توريد فوري وربط الهاتف الذكي" : "Fast Supply & Mobile Linking"}
            </h4>
            <p className="text-xs text-slate-400 max-w-xs">
              {isAr
                ? "ربط المنظومة بتطبيق هاتفك المحمول للمشاهدة الحية والإشعارات الذكية فور كشف الحركة على مدار 24 ساعة."
                : "Live mobile viewing and instant motion alerts streaming 24/7 on your smartphone."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-cyan-500/30">
              <div className="w-full h-full bg-[#080c14] rounded-[14px] flex items-center justify-center">
                <span className="text-cyan-400 font-sans font-black text-sm">DC</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-xl text-white">
                {isAr ? "دي سي سمارت" : "DC Smart"}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-cyan-400/90 font-medium">
                {isAr ? "أنظمة المراقبة والتحكم الذكي" : "Security & Smart CCTV Systems"}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? "الوجهة الأولى والمتخصصة في توريد وتركيب وصيانة كاميرات المراقبة، أجهزة التسجيل XVR و NVR، الكاميرات الذكية Wi-Fi، ومستلزمات الشبكات في طنطا وكافة محافظات مصر."
              : "Premier provider for CCTV surveillance systems, XVR/NVR recorders, smart Wi-Fi cameras, and security infrastructure in Tanta and Egypt."}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href={`tel:${phoneDisplay}`}
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition"
              title="اتصال هاتفي"
            >
              <Phone size={16} />
            </a>
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition"
              title="واتساب"
            >
              <MessageCircle size={16} />
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-500/50 transition"
              title="صفحتنا على فيسبوك"
            >
              <FacebookIcon size={16} />
            </a>
          </div>
        </div>

        {/* Quick Brands & Systems */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm text-slate-200">
            {isAr ? "الماركات والأنظمة المعتمدة" : "Authorized Brands"}
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/#products" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <span>📹</span>
                <span>{isAr ? "كاميرات وأجهزة داهوا (Dahua HD & IP)" : "Dahua Security"}</span>
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <span>🎯</span>
                <span>{isAr ? "هيكفيجن وهاي لوك (Hikvision / HiLook)" : "Hikvision & HiLook"}</span>
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <span>🛡️</span>
                <span>{isAr ? "يوني فيو ويوني آرك (UNV / Uniarch)" : "UNV & Uniarch"}</span>
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <span>⚡</span>
                <span>{isAr ? "إلكتروتك (Electrotech Systems)" : "Electrotech Systems"}</span>
              </Link>
            </li>
            <li>
              <Link href="/#products" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <span>📶</span>
                <span>{isAr ? "كاميرات واي فاي ذكية (Ezviz & Tenda)" : "Smart Wi-Fi Cameras"}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Services */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm text-slate-200">
            {isAr ? "خدمات سريعة ومعلومات" : "Quick Services"}
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/quotes" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <FileText size={14} className="text-cyan-400" />
                <span>{isAr ? "طلب عرض سعر رسمي (Quotations)" : "Request Quotation"}</span>
              </Link>
            </li>
            <li>
              <Link href="/card" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <CreditCard size={14} className="text-cyan-400" />
                <span>{isAr ? "كارت الشركة الرسمي (VIP QR Card)" : "Official VIP Company Card"}</span>
              </Link>
            </li>
            <li>
              <Link href="/download" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <Download size={14} className="text-cyan-400" />
                <span>{isAr ? "تحميل تطبيق الأندرويد (APK)" : "Download Android App"}</span>
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <Lock size={14} className="text-cyan-400" />
                <span>{isAr ? "بوابة الإدارة والمهندسين" : "Management Portal"}</span>
              </Link>
            </li>
            <li>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition flex items-center gap-1.5"
              >
                <MapPin size={14} className="text-cyan-400" />
                <span>{isAr ? "مقر الشركة على خرائط جوجل 📍" : "Location on Google Maps"}</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Location */}
        <div className="space-y-3">
          <h5 className="font-bold text-sm text-slate-200">
            {isAr ? "المبيعات والاتصال المباشر" : "Sales & Inquiries"}
          </h5>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <Phone size={15} className="text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold text-slate-200 block text-sm">{phoneDisplay}</span>
                <span className="text-[11px] text-slate-400">{hoursText}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <MessageCircle size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold text-slate-200 block text-xs">
                  واتس وأوردرات: {secondaryPhoneDisplay}
                </span>
                <span className="text-[11px] text-slate-400">موبايل آخر: {thirdPhone}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 group hover:text-cyan-400 transition"
              >
                <MapPin size={15} className="text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition" />
                <span className="text-slate-300 leading-relaxed text-xs underline decoration-cyan-500/40">
                  {addressText}
                </span>
              </a>
            </div>

            <div className="pt-1">
              <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-[11px] font-medium">
                طنطا — معاينات وتركيبات لكافة المحافظات
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright & Orca Watermark */}
      <div className="border-t border-slate-800/80 py-5 px-4 text-center text-xs text-slate-400 space-y-1.5">
        <p className="font-medium">
          © 2026 دي سي سمارت (DC Smart) — لأنظمة المراقبة والتحكم الذكي. جميع الحقوق محفوظة.
        </p>
        <p className="text-xs text-cyan-400 font-bold tracking-wide">
          تم التطوير بواسطة شركة أوركا لتقنية المعلومات — 01018671000
        </p>
      </div>
    </footer>
  );
}
