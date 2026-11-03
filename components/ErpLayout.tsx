"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStaff } from "@/context/StaffContext";
import { playSound, isSoundEnabled, setSoundEnabled } from "@/lib/sounds";
import {
  MonitorSmartphone,
  Truck,
  RotateCcw,
  Layers,
  Handshake,
  Package,
  Gift,
  CircleDollarSign,
  UserCheck,
  Shield,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Volume2,
  VolumeX,
  ShieldCheck,
  FileText,
  Cctv,
} from "lucide-react";

interface ErpLayoutProps {
  children: React.ReactNode;
  activeItem?:
    | "cashier"
    | "quotes"
    | "orders"
    | "sales-returns"
    | "menu"
    | "suppliers"
    | "inventory"
    | "offers"
    | "reports"
    | "customers"
    | "users"
    | "settings";
}

export default function ErpLayout({ children, activeItem }: ErpLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, loading } = useStaff();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setMounted(true);
    setSoundOn(isSoundEnabled());
  }, []);

  useEffect(() => {
    if (mounted && !loading && !currentUser) {
      router.push("/login");
    }
  }, [mounted, loading, currentUser, router]);

  const currentActive =
    activeItem ||
    (pathname === "/cashier"
      ? "cashier"
      : pathname === "/quotes"
      ? "quotes"
      : pathname === "/dashboard"
      ? "orders"
      : pathname === "/sales-returns"
      ? "sales-returns"
      : pathname === "/menu-admin"
      ? "menu"
      : pathname === "/suppliers"
      ? "suppliers"
      : pathname === "/inventory"
      ? "inventory"
      : pathname === "/offers-admin"
      ? "offers"
      : pathname === "/reports" || pathname === "/expenses"
      ? "reports"
      : pathname === "/customers"
      ? "customers"
      : pathname === "/users"
      ? "users"
      : pathname === "/settings"
      ? "settings"
      : "orders");

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playSound("click");
  };

  const handleLogout = () => {
    playSound("click");
    logout();
    router.push("/login");
  };

  const NAV_ITEMS = [
    {
      id: "cashier",
      href: "/cashier",
      label: "نقطة البيع (الكاشير السريع)",
      icon: MonitorSmartphone,
      badge: "فوري",
    },
    {
      id: "quotes",
      href: "/quotes",
      label: "عروض الأسعار والتركيبات",
      icon: FileText,
      badge: "CCTV",
    },
    {
      id: "orders",
      href: "/dashboard",
      label: "الطلبات الحية والتشغيل",
      icon: Truck,
      badge: "لوجستيات",
    },
    {
      id: "sales-returns",
      href: "/sales-returns",
      label: "مرتجعات المبيعات للعملاء",
      icon: RotateCcw,
      badge: "حسابات",
    },
    {
      id: "menu",
      href: "/menu-admin",
      label: "كتالوج المنتجات والأقسام",
      icon: Layers,
    },
    {
      id: "suppliers",
      href: "/suppliers",
      label: "الموردين وفواتير الشراء",
      icon: Handshake,
      badge: "ERP",
    },
    {
      id: "inventory",
      href: "/inventory",
      label: "المخزون وحركة الأصناف",
      icon: Package,
    },
    {
      id: "offers",
      href: "/offers-admin",
      label: "العروض والخصومات الذكية",
      icon: Gift,
      badge: "خصومات",
    },
    {
      id: "reports",
      href: "/reports",
      label: "الخزينة والأرباح والمصروفات",
      icon: CircleDollarSign,
    },
    {
      id: "customers",
      href: "/customers",
      label: "قاعدة بيانات العملاء CRM",
      icon: UserCheck,
    },
    {
      id: "users",
      href: "/users",
      label: "إدارة الحسابات وطوارئ المالك",
      icon: Shield,
      badge: currentUser?.role === "owner" ? "سلطة مطلقة" : undefined,
    },
    {
      id: "settings",
      href: "/settings",
      label: "إعدادات المنظومة وبيانات الاتصال",
      icon: Settings,
    },
  ];

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-cyan-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold font-mono">جاري تحميل منظومة دي سي سمارت الأمنية...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#080c14] text-slate-100 flex font-sans antialiased selection:bg-cyan-500 selection:text-black"
    >
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen z-50 w-[285px] bg-[#0b1120] border-l border-cyan-500/20 flex flex-col justify-between p-4 transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } shadow-2xl lg:shadow-none overflow-y-auto`}
      >
        {/* Top: Brand & Nav Links */}
        <div className="space-y-4">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-cyan-500/20">
            <Link
              href="/dashboard"
              onClick={() => {
                playSound("click");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#080c14] rounded-[14px] flex items-center justify-center">
                  <span className="text-cyan-400 font-sans font-black text-sm">DC</span>
                </div>
              </div>
              <div>
                <div className="font-sans font-black text-base text-white tracking-tight leading-tight flex items-center gap-1.5">
                  <span>دي سي سمارت</span>
                </div>
                <div className="text-[10px] font-semibold text-cyan-400/90 flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={11} className="text-cyan-400" />
                  <span>أنظمة المراقبة والتحكم الذكي</span>
                </div>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-850 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentActive === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    playSound("click");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-600/30 font-black"
                      : "text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={17}
                      className={isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400 transition-colors"}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-black tracking-wide ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Profile & Actions */}
        <div className="pt-4 border-t border-cyan-500/20 space-y-3">
          {/* User info card */}
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                  currentUser?.role === "owner"
                    ? "bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-black shadow-md shadow-cyan-500/40"
                    : "bg-slate-800 text-cyan-300 border border-cyan-500/30"
                }`}
              >
                {currentUser?.role === "owner" ? "👑" : "👔"}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-slate-100 truncate">
                  {currentUser?.name || "المستخدم"}
                </div>
                <div className="text-[10px] text-cyan-400/90 font-mono">
                  @{currentUser?.username} • {currentUser?.role === "owner" ? "المايسترو" : "مدير"}
                </div>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundOn ? "كتم المؤثرات الصوتية" : "تفعيل المؤثرات الصوتية"}
              className={`p-1.5 rounded-lg transition-colors ${
                soundOn
                  ? "text-cyan-400 hover:bg-cyan-500/20"
                  : "text-slate-500 hover:bg-slate-800"
              }`}
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              target="_blank"
              onClick={() => playSound("click")}
              className="py-2 px-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition"
            >
              <ExternalLink size={13} />
              <span>عرض المتجر</span>
            </Link>

            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-lg bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500/25 text-[11px] font-semibold text-rose-300 flex items-center justify-center gap-1.5 transition"
            >
              <LogOut size={13} />
              <span>تسجيل خروج</span>
            </button>
          </div>

          {/* Developer Watermark with Phone Number */}
          <div className="pt-2 text-center border-t border-slate-800/80 text-[10px] text-slate-400 font-medium">
            تم التطوير بواسطة شركة أوركا لتقنية المعلومات — 01018671000
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#0b1120]/95 backdrop-blur-md border-b border-cyan-500/20 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              playSound("click");
              setMobileMenuOpen(true);
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu size={20} />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#080c14] rounded-[10px] flex items-center justify-center">
                <span className="text-cyan-400 font-sans font-black text-xs">DC</span>
              </div>
            </div>
            <span className="font-sans font-black text-base text-white">
              دي سي سمارت
            </span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-slate-800 text-cyan-300 hover:text-white"
            title="زيارة المتجر"
          >
            <ExternalLink size={18} />
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
