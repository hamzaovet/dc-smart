"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import {
  Download,
  Smartphone,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Bell,
  ArrowRight,
  ArrowLeft,
  QrCode,
  FileText,
  CreditCard,
} from "lucide-react";

export default function DownloadAppPage() {
  const { lang, dir } = useLanguage();
  const isAr = lang === "ar";
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    window.location.href = "/api/download/apk";
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Information */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Smartphone size={14} className="text-cyan-400" />
            <span>
              {isAr ? "التطبيق الرسمي لأنظمة دي سي سمارت للأندرويد v1.0.0" : "Official DC Smart Android App v1.0.0"}
            </span>
          </div>

          <h1 className="font-sans font-black text-3xl sm:text-5xl text-white leading-tight">
            {isAr
              ? "تطبيق دي سي سمارت — كتالوج الأجهزة ومتابعة عروض الأسعار في جيبك"
              : "DC Smart App — Security Catalog & Quotation Generator"}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {isAr
              ? "استمتع بتصفح فوري لأحدث كاميرات المراقبة داهوا، يوني آرك، هيكفيجن وإلكتروتك، الاطلاع على عروض الأسعار والمواصفات الفنية، والطلب الفوري مع المعاينة والتركيب المباشر في طنطا وكافة المحافظات."
              : "Access the full CCTV surveillance catalog, generate project quotes, and order camera packages directly from your smartphone."}
          </p>

          {/* Features List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <CheckCircle2 size={14} />
              </div>
              <span>{isAr ? "كتالوج كامل لأجهزة المراقبة والتسجيل والأسعار المحدثة" : "Complete equipment catalog with live pricing"}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <CheckCircle2 size={14} />
              </div>
              <span>{isAr ? "إنشاء وتنزيل عروض الأسعار الرسمية للشركات والفيلات والمنازل" : "Instant formal quotation builder for homes & businesses"}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-200">
              <div className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <CheckCircle2 size={14} />
              </div>
              <span>{isAr ? "تواصل مباشر مع الدعم الفني ومهندسي التركيبات والصيانة" : "Direct access to certified CCTV technicians & support"}</span>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-sm font-black flex items-center gap-3 shadow-xl shadow-cyan-500/25 hover:scale-105 transition disabled:opacity-50"
            >
              <Download size={20} className={downloading ? "animate-bounce" : ""} />
              <span>
                {downloading
                  ? (isAr ? "جاري بدء التحميل..." : "Starting Download...")
                  : (isAr ? "تحميل تطبيق الأندرويد الآن (dcsmart.apk)" : "Download APK File Now")}
              </span>
            </button>

            <Link
              href="/card"
              className="px-6 py-4 rounded-2xl bg-slate-900 border border-cyan-500/30 text-cyan-300 text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2"
            >
              <CreditCard size={18} className="text-cyan-400" />
              <span>{isAr ? "عرض كارت الشركة والـ QR" : "Company VIP Card"}</span>
            </Link>
          </div>

          {/* File details info */}
          <div className="flex items-center gap-6 text-xs text-slate-400 pt-2 font-mono">
            <span>Package: com.dcsmart.app</span>
            <span>•</span>
            <span>Version: 1.0.0</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck size={14} />
              <span>آمن ومفحوص 100%</span>
            </span>
          </div>
        </div>

        {/* Right QR Showcase Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm rounded-3xl p-8 border-2 border-cyan-500/30 bg-gradient-to-br from-[#0b1120] to-[#04070e] shadow-[0_0_50px_rgba(6,182,212,0.15)] text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 flex items-center justify-center text-slate-950 font-sans font-black text-2xl mx-auto shadow-lg shadow-cyan-500/30">
              DC
            </div>

            <div>
              <h3 className="font-sans font-black text-xl text-white">
                {isAr ? "امسح الرمز للتحميل المباشر" : "Scan to Download Instantly"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isAr
                  ? "وجّه كاميرا هاتفك نحو رمز الاستجابة السريعة لتحميل التطبيق مباشرة"
                  : "Point your phone camera to download APK directly"}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-3.5 rounded-2xl bg-white shadow-2xl inline-block mx-auto border-4 border-cyan-200">
              <img
                src="/dcsmart-apk-qr.png"
                alt="DC Smart APK QR"
                className="w-48 h-48 block mx-auto"
              />
            </div>

            <div className="pt-2 text-xs text-cyan-300 font-mono">
              dcsmart.apk (v1.0.0)
            </div>
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
