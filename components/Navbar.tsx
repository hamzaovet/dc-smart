"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { useStoreSettings } from "../context/StoreSettingsContext";
import {
  ShoppingBag,
  Menu,
  X,
  Globe,
  Phone,
  ShieldCheck,
  CreditCard,
  Download,
  Lock,
  FileText,
  Cctv,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, toggleLanguage } = useLanguage();
  const { totalCount, setIsCartOpen } = useCart();
  const { settings } = useStoreSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide Navbar completely on ERP Management, Quotes & POS routes
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
  const announcementText =
    lang === "ar"
      ? settings.announcementAr || "🛡️ توريد وتركيب كاميرات المراقبة وأجهزة التسجيل وضمان عامين شامل — طنطا وكافة المحافظات 🛡️"
      : settings.announcementEn || "🛡️ Professional CCTV Security Supply, Installation & 2-Year Warranty — Egypt 🛡️";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-cyan-950/70 to-slate-950 border-b border-cyan-500/25 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300 mx-auto sm:mx-0 font-medium">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>{announcementText}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-400">
            <a
              href={`tel:${phoneDisplay}`}
              className="flex items-center gap-1.5 hover:text-cyan-400 transition"
            >
              <Phone size={12} />
              <span>{phoneDisplay}</span>
            </a>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck size={13} />
              <span>{lang === "ar" ? "معاينة هندسية وضمان معتمد عامين" : "2-Year Warranty & Site Survey"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-[#080c14]/90 backdrop-blur-md border-b border-cyan-500/20 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#080c14] rounded-[14px] flex items-center justify-center">
                <span className="text-cyan-400 font-sans font-black text-sm tracking-tighter">DC</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-black text-lg sm:text-xl tracking-tight text-white">
                {lang === "ar" ? "دي سي سمارت" : "DC Smart"}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-cyan-400/90 font-medium -mt-0.5">
                {lang === "ar" ? "أنظمة المراقبة والتحكم الذكي" : "Security & Surveillance Systems"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
            <Link
              href="/"
              className={`hover:text-cyan-400 transition ${pathname === "/" ? "text-cyan-400 font-black" : ""}`}
            >
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>

            <Link
              href="/#categories"
              className="hover:text-cyan-400 transition"
            >
              {lang === "ar" ? "الأنظمة والماركات" : "Systems & Brands"}
            </Link>

            <Link
              href="/#products"
              className="hover:text-cyan-400 transition"
            >
              {lang === "ar" ? "كتالوج الأجهزة والكاميرات" : "CCTV Catalog"}
            </Link>

            <Link
              href="/quotes"
              className={`flex items-center gap-1.5 hover:text-cyan-400 transition ${
                pathname === "/quotes" ? "text-cyan-400 font-black" : ""
              }`}
            >
              <FileText size={14} className="text-cyan-400" />
              <span>{lang === "ar" ? "عروض الأسعار" : "Quotations"}</span>
            </Link>

            <Link
              href="/card"
              className={`flex items-center gap-1.5 hover:text-cyan-400 transition ${
                pathname === "/card" ? "text-cyan-400 font-black" : ""
              }`}
            >
              <CreditCard size={14} className="text-cyan-400" />
              <span>{lang === "ar" ? "كارت الشركة" : "Company Card"}</span>
            </Link>

            <Link
              href="/download"
              className={`flex items-center gap-1.5 hover:text-cyan-400 transition ${
                pathname === "/download" ? "text-cyan-400 font-black" : ""
              }`}
            >
              <Download size={14} className="text-cyan-400" />
              <span>{lang === "ar" ? "تطبيق الأندرويد" : "Get App"}</span>
            </Link>
          </div>

          {/* Actions: Lang, Login, Cart, Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition"
              title="تغيير اللغة"
            >
              <Globe size={13} />
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Admin / Owner Login Link */}
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-medium transition"
            >
              <Lock size={12} className="text-cyan-400" />
              <span>{lang === "ar" ? "بوابة الإدارة" : "Dashboard"}</span>
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-300 hover:text-white transition group"
              aria-label="سلة المشتريات"
            >
              <ShoppingBag size={19} className="group-hover:scale-110 transition" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-mono text-[10px] font-black flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-bounce">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-cyan-500/20 space-y-2 px-2 pb-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-sm font-semibold hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            >
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>

            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-sm font-semibold hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            >
              {lang === "ar" ? "الأنظمة والماركات" : "Systems & Brands"}
            </Link>

            <Link
              href="/#products"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-sm font-semibold hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            >
              {lang === "ar" ? "كتالوج الأجهزة والكاميرات" : "CCTV Catalog"}
            </Link>

            <Link
              href="/quotes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            >
              <FileText size={16} className="text-cyan-400" />
              <span>{lang === "ar" ? "طلب وتوليد عرض سعر" : "Quotations"}</span>
            </Link>

            <Link
              href="/card"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            >
              <CreditCard size={16} className="text-cyan-400" />
              <span>{lang === "ar" ? "كارت الشركة الرسمي" : "VIP Company Card"}</span>
            </Link>

            <Link
              href="/download"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            >
              <Download size={16} className="text-cyan-400" />
              <span>{lang === "ar" ? "تحميل تطبيق الأندرويد" : "Download Android App"}</span>
            </Link>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 transition"
            >
              <Lock size={15} />
              <span>{lang === "ar" ? "دخول الإدارة والمهندسين" : "Staff & Owner Portal"}</span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
