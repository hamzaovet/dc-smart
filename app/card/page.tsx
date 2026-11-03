"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { useStoreSettings } from "../../context/StoreSettingsContext";
import {
  Download,
  ExternalLink,
  Printer,
  ShieldCheck,
  Phone,
  MessageCircle,
  MapPin,
  QrCode,
  ArrowRight,
  ArrowLeft,
  ImageDown,
  FileText,
} from "lucide-react";

export default function VipCardPage() {
  const { lang, dir } = useLanguage();
  const { settings } = useStoreSettings();
  const isAr = lang === "ar";
  const cardRef = useRef<HTMLDivElement>(null);

  const webUrl = "https://dc-smart.vercel.app";
  const apkUrl = "https://dc-smart.vercel.app/api/download/apk";
  const mapsUrl = settings.googleMapsUrl || "https://maps.google.com/?q=Tanta,Gharbia,Egypt";
  const facebookUrl = "https://www.facebook.com/profile.php?id=61590561604312";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <ShieldCheck size={14} className="text-cyan-400" />
          <span>{isAr ? "كارت الهوية والخدمات الذكي (VIP Security Card)" : "Official VIP Security Card"}</span>
        </div>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-white">
          {isAr ? "دي سي سمارت — كارت الشركة الرسمي" : "DC Smart — Official Company Card"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          {isAr
            ? "امسح كود QR بكاميرا هاتفك لزيارة الكتالوج الإلكتروني أو لتحميل تطبيق الأندرويد الرسمي مباشرة"
            : "Scan the dual QR codes to access our surveillance catalog or download the Android App"}
        </p>
      </div>

      {/* Official Rendered Card Preview */}
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="w-full max-w-3xl rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/60 bg-[#080c14] relative group">
          <Image
            src="/dcsmart-official-card.png"
            alt="دي سي سمارت — كارت الشركة الرسمي"
            width={1200}
            height={780}
            priority
            className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/dcsmart-official-card.png"
            download="dcsmart-official-card.png"
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition"
          >
            <ImageDown size={15} />
            <span>{isAr ? "تحميل صورة الكارت عالية الدقة (HD PNG)" : "Download Card Image"}</span>
          </a>

          <button
            onClick={handlePrint}
            className="py-2.5 px-5 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-bold flex items-center gap-2 transition"
          >
            <Printer size={15} />
            <span>{isAr ? "طباعة الكارت الفوري" : "Print Card"}</span>
          </button>

          <Link
            href="/quotes"
            className="py-2.5 px-5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-200 text-xs font-bold flex items-center gap-2 transition"
          >
            <FileText size={15} className="text-cyan-400" />
            <span>{isAr ? "طلب عرض سعر رسمي" : "Quotations"}</span>
          </Link>
        </div>
      </div>

      {/* Details Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* QR 1: Website */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-cyan-500/20 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <QrCode size={18} />
            <span>كود الموقع الإلكتروني والكتالوج</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            يوجّه العميل مباشرة إلى الكتالوج الحي لشركة دي سي سمارت مع تفاصيل الكاميرات، الأسعار، العروض، وإمكانية طلب عرض سعر فوري.
          </p>
          <div className="pt-2">
            <a
              href={webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-300 font-mono flex items-center gap-1 hover:underline"
            >
              <span>{webUrl}</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* QR 2: APK Download */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-cyan-500/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Download size={18} />
            <span>كود تطبيق الأندرويد المباشر</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            يتيح للعملاء والفنيين تحميل وتثبيت تطبيق الأندرويد الخاص بدي سي سمارت (dcsmart.apk) مباشرة على الهاتف للمتابعة وتتبع الأسعار.
          </p>
          <div className="pt-2">
            <Link
              href="/download"
              className="text-xs text-emerald-400 font-mono flex items-center gap-1 hover:underline"
            >
              <span>{apkUrl}</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Developer Watermark with user phone number */}
      <div className="pt-8 text-center border-t border-slate-800 text-xs text-slate-400 font-medium">
        تم التطوير بواسطة شركة أوركا لتقنية المعلومات — 01018671000
      </div>
    </div>
  );
}
