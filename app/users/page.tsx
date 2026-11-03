"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import { useStaff } from "@/context/StaffContext";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Users,
  KeyRound,
  Lock,
  Power,
  RefreshCw,
  X,
  Check,
  Sparkles,
  AlertOctagon,
} from "lucide-react";

interface UserAccount {
  id: string;
  name: string;
  username: string;
  role: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function UsersTeamPage() {
  const { currentUser } = useStaff();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLockdown, setIsLockdown] = useState(false);
  const [lockdownLoading, setLockdownLoading] = useState(false);

  // Add User Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("123456789");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState("manager");

  // Maestro Confirmation Modal for Lockdown
  const [showLockdownModal, setShowLockdownModal] = useState(false);
  const [maestroPinInput, setMaestroPinInput] = useState("");
  const [lockdownError, setLockdownError] = useState("");

  const isOwner = currentUser?.role === "owner" || currentUser?.username === "maestro";

  useEffect(() => {
    fetchUsersAndLockdown();
  }, []);

  const fetchUsersAndLockdown = async () => {
    setLoading(true);
    try {
      const [resUsers, resLock] = await Promise.all([
        fetch("/api/auth/users"),
        fetch("/api/auth/lockdown"),
      ]);
      const dataUsers = await resUsers.json();
      const dataLock = await resLock.json();

      setUsers(dataUsers.users || []);
      setIsLockdown(dataLock.isEmergencyLockdown || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLockdownPrompt = () => {
    playSound("alert");
    if (!isOwner) {
      alert("عذراً، تفعيل أو إلغاء إغلاق الطوارئ الشامل خاص بحساب المالك (المايسترو) حصرياً!");
      return;
    }
    setMaestroPinInput("");
    setLockdownError("");
    setShowLockdownModal(true);
  };

  const executeLockdown = async () => {
    if (maestroPinInput.trim() !== "157230") {
      setLockdownError("كود الأمان الخاص بالمايسترو غير صحيح! (PIN مطلوب)");
      playSound("alert");
      return;
    }

    setLockdownLoading(true);
    playSound("click");
    try {
      const nextState = !isLockdown;
      const res = await fetch("/api/auth/lockdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isEmergencyLockdown: nextState,
          callerRole: "owner",
          pin: maestroPinInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setIsLockdown(data.isEmergencyLockdown);
        setShowLockdownModal(false);
      } else {
        setLockdownError(data.error || "فشل تنفيذ أمر الطوارئ");
      }
    } catch (err) {
      console.error(err);
      setLockdownError("خطأ في الاتصال بالخادم");
    } finally {
      setLockdownLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim() || !pin.trim()) {
      alert("يرجى ملء جميع الحقول");
      return;
    }
    setSavingUser(true);
    playSound("click");

    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim().toLowerCase(),
          password: password.trim(),
          pin: pin.trim(),
          role,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setUsers((prev) => [...prev, data.user]);
        setIsAddOpen(false);
        setName("");
        setUsername("");
        setPin("");
      } else {
        alert(data.error || "فشل إنشاء الحساب");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingUser(false);
    }
  };

  return (
    <ErpLayout activeItem="users">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-pink-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <Shield size={22} />
            </span>
            <div>
              <h1 className="text-xl font-black font-serif text-pink-gradient">
                إدارة الحسابات وصلاحيات المالك والتشغيل
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                حسابات المالك (المايسترو) والمديرين، مع نظام طوارئ إغلاق كافة الحسابات فورياً
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound("click");
              setIsAddOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
          >
            <UserPlus size={16} />
            <span>إضافة حساب تشغيل جديد</span>
          </button>
        </div>

        {/* Master Emergency Lockdown Banner */}
        <div
          className={`p-6 rounded-2xl border transition-all shadow-2xl relative overflow-hidden ${
            isLockdown
              ? "bg-red-950/40 border-red-500/60 shadow-red-900/20"
              : "bg-[#0e0b16] border-pink-500/30"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div
                className={`p-3.5 rounded-2xl border ${
                  isLockdown
                    ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                    : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                }`}
              >
                {isLockdown ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-serif font-black text-base text-zinc-100">
                    حالة إغلاق الطوارئ الشامل (Master Lockdown)
                  </h3>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      isLockdown
                        ? "bg-red-500 text-white animate-bounce"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {isLockdown ? "⚠️ وضع الطوارئ مفعل" : "النظام يعمل بشكل طبيعي"}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed">
                  سلطة حصرية للمالك <strong>(المايسترو maestro)</strong>: بنقرة واحدة يتم تعطيل
                  جميع حسابات الموظفين والمديرين فورياً ومنعهم من الدخول، ويبقى المالك فقط صاحب
                  الوصول الوحيد للنظام.
                </p>
              </div>
            </div>

            {/* Lockdown Button */}
            {isOwner ? (
              <button
                onClick={handleToggleLockdownPrompt}
                disabled={lockdownLoading}
                className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
                  isLockdown
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                    : "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse"
                }`}
              >
                <Power size={16} />
                <span>
                  {isLockdown
                    ? "إلغاء وضع الطوارئ واستئناف الحسابات"
                    : "تفعيل الطوارئ (تعطيل كافة الحسابات)"}
                </span>
              </button>
            ) : (
              <div className="text-[11px] text-zinc-500 border border-zinc-800 p-2.5 rounded-xl bg-black/40">
                🔒 خاص بالمالك (المايسترو) فقط
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2">
              <Users size={18} className="text-pink-400" />
              <span>مصفوفة حسابات النظام وصلاحيات الدخول</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {users.length} حسابات مسجلة
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">اسم الموظف / المسؤول</th>
                  <th className="py-3 px-4">اسم المستخدم (User)</th>
                  <th className="py-3 px-4">الدور / الصلاحية</th>
                  <th className="py-3 px-4">كود الأمان السري (PIN)</th>
                  <th className="py-3 px-4">حالة الحساب</th>
                  <th className="py-3 px-4">التحويل المباشر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {users.map((u) => {
                  const isOwnerRow = u.role === "owner" || u.username === "maestro";
                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-zinc-900/40 transition-colors ${
                        isOwnerRow ? "bg-pink-500/5 font-bold" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-zinc-200">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center font-serif text-pink-400 font-black">
                            {isOwnerRow ? "👑" : "👔"}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-pink-300">
                        @{u.username}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isOwnerRow
                              ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                              : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                          }`}
                        >
                          {isOwnerRow ? "المايسترو (المالك)" : "مدير التشغيل العام"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-zinc-400">
                        {isOwnerRow ? "•••••• (157230)" : "•••••• (445566)"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isLockdown && !isOwnerRow
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          {isLockdown && !isOwnerRow ? "معطل (وضع الطوارئ)" : "نشط ومفعل"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-zinc-400 text-[11px]">
                        /dashboard
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Maestro PIN Confirmation Modal for Lockdown */}
      {showLockdownModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#150d18] border border-red-500/50 rounded-2xl p-6 shadow-2xl relative text-xs">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertOctagon size={24} />
              <h3 className="font-serif font-black text-base text-zinc-100">
                تأكيد أمر طوارئ المالك
              </h3>
            </div>
            <p className="text-zinc-300 text-xs mb-4 leading-relaxed">
              يرجى إدخال كود الأمان السري للمايسترو <strong>(PIN: 157230)</strong> لتنفيذ أمر{" "}
              {isLockdown ? "إلغاء وضع الطوارئ" : "إغلاق وتعطيل كافة الحسابات فورياً"}.
            </p>

            {lockdownError && (
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 mb-3 font-bold">
                {lockdownError}
              </div>
            )}

            <input
              type="password"
              autoFocus
              maxLength={6}
              value={maestroPinInput}
              onChange={(e) => setMaestroPinInput(e.target.value)}
              placeholder="أدخل الـ PIN السري (157230)"
              className="w-full px-3 py-2.5 rounded-xl bg-black border border-red-500/40 text-center font-mono text-base tracking-widest text-pink-400 focus:outline-none focus:border-red-500 mb-4"
            />

            <div className="flex gap-2">
              <button
                disabled={lockdownLoading || !maestroPinInput.trim()}
                onClick={executeLockdown}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition"
              >
                {lockdownLoading ? "جاري التنفيذ..." : "تأكيد التنفيذ فوراً ⚡"}
              </button>
              <button
                onClick={() => setShowLockdownModal(false)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#120e1c] border border-pink-500/30 rounded-2xl p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-pink-300 font-serif flex items-center gap-2">
                <UserPlus size={18} />
                <span>إضافة حساب تشغيل جديد</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">اسم الموظف أو المدير:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: مروان الشامي"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم المستخدم (User):</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="marwan"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">الصلاحية / الدور:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="manager">مدير تشغيل (Manager)</option>
                    <option value="cashier">كاشير نقطة بيع (Cashier)</option>
                    <option value="staff">مسؤول مخازن وتركيبات (Stock)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">كلمة المرور:</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">كود الأمان السري (PIN 6 أرقام):</label>
                  <input
                    type="password"
                    required
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="445566"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={savingUser}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs"
                >
                  {savingUser ? "جاري الإنشاء..." : "إنشاء وتفعيل الحساب 👤"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ErpLayout>
  );
}
