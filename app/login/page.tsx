"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import {
  Lock,
  User,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const { lang, dir } = useLanguage();
  const router = useRouter();
  const isAr = lang === "ar";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !password.trim() || !pin.trim()) {
      setErrorMessage(
        isAr
          ? "يرجى كتابة اسم المستخدم وكلمة المرور وكود الأمان السري PIN"
          : "Please enter your username, password, and security PIN."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          pin: pin.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("rovy_user", JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent("rovy_auth_change"));
        router.push("/dashboard");
      } else {
        setErrorMessage(data.error || (isAr ? "فشل تسجيل الدخول، تأكد من صحة البيانات" : "Login failed"));
      }
    } catch (err: any) {
      setErrorMessage(
        isAr
          ? "تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى."
          : "Network connection error, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (u: string, p: string, pinCode: string) => {
    setUsername(u);
    setPassword(p);
    setPin(pinCode);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0b1120] p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 p-0.5 shadow-xl shadow-cyan-500/20 mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-[#080c14] rounded-[14px] flex items-center justify-center">
              <span className="text-cyan-400 font-sans font-black text-2xl">DC</span>
            </div>
          </div>

          <h2 className="font-sans font-black text-2xl text-white">
            {isAr ? "بوابة الإدارة والمهندسين" : "Security Management Portal"}
          </h2>
          <p className="text-xs text-slate-400 font-light">
            {isAr ? "دي سي سمارت — لأنظمة المراقبة والتحكم الذكي" : "DC Smart CCTV & Control Systems"}
          </p>
        </div>

        {/* Quick Credentials Card */}
        <div className="mb-6 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>حسابات النظام المصرحة (للتعبئة التلقائية):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials("maestro", "123456789", "157230")}
              className="p-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-right transition"
            >
              <div className="font-bold text-cyan-300">👑 المالك (المايسترو)</div>
              <div className="text-[10px] text-slate-400 font-mono">PIN: 157230</div>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials("manager", "123456789", "445566")}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-right transition"
            >
              <div className="font-bold text-slate-200">👔 حساب المدير</div>
              <div className="text-[10px] text-slate-400 font-mono">PIN: 445566</div>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
            <ShieldAlert size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} autoComplete="off" className="space-y-4 text-xs">
          {/* Username */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              {isAr ? "اسم المستخدم" : "Username"}
            </label>
            <div className="relative">
              <User
                size={16}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  dir === "rtl" ? "right-3.5" : "left-3.5"
                } text-slate-400`}
              />
              <input
                type="text"
                required
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="maestro أو manager"
                className={`w-full py-2.5 ${
                  dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                } rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs text-slate-100 placeholder:text-slate-600 outline-none transition font-sans`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              {isAr ? "كلمة المرور" : "Password"}
            </label>
            <div className="relative">
              <Lock
                size={16}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  dir === "rtl" ? "right-3.5" : "left-3.5"
                } text-slate-400`}
              />
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••"
                className={`w-full py-2.5 ${
                  dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                } rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs text-slate-100 placeholder:text-slate-600 outline-none transition font-mono`}
              />
            </div>
          </div>

          {/* Security PIN Code */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              {isAr ? "كود الأمان السري PIN" : "Security PIN"}
            </label>
            <div className="relative">
              <KeyRound
                size={16}
                className={`absolute top-1/2 -translate-y-1/2 ${
                  dir === "rtl" ? "right-3.5" : "left-3.5"
                } text-slate-400`}
              />
              <input
                type="password"
                required
                maxLength={8}
                autoComplete="off"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className={`w-full py-2.5 ${
                  dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"
                } rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-xs text-slate-100 placeholder:text-slate-600 outline-none transition font-mono tracking-widest`}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-center text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition"
            >
              {loading ? (
                <span>جاري التحقق من الصلاحيات...</span>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>{isAr ? "تسجيل الدخول للمنظومة" : "Access Portal"}</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center space-y-3">
          <Link href="/" className="text-xs text-slate-400 hover:text-cyan-400 transition block">
            {isAr ? "← العودة إلى الصفحة الرئيسية للمتجر" : "← Back to Storefront"}
          </Link>
          <div className="text-[10px] text-slate-500 font-medium">
            تم التطوير بواسطة شركة أوركا لتقنية المعلومات — 01018671000
          </div>
        </div>
      </div>
    </div>
  );
}
