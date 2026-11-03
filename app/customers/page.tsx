"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import {
  UserCheck,
  Search,
  Phone,
  MapPin,
  MessageCircle,
  Plus,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Crown,
  ShoppingBag,
  X,
  History,
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  address?: string | null;
  totalOrders: number;
  totalSpent: number;
  isVip: boolean;
  notes?: string | null;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVip, setFilterVip] = useState(false);

  // Add Customer Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("القاهرة");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isVip, setIsVip] = useState(false);

  // Customer History Modal
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    playSound("click");

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          address: address.trim(),
          notes: notes.trim(),
          isVip,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setCustomers((prev) => [data.customer, ...prev.filter((c) => c.phone !== data.customer.phone)]);
        setIsAddOpen(false);
        setName("");
        setPhone("");
        setAddress("");
      } else {
        alert(data.error || "فشل حفظ بيانات العميل");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Calculations
  const vipCount = customers.filter((c) => c.isVip || c.totalSpent >= 3000).length;
  const totalCustomerSales = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  // Filtered
  const filteredCustomers = customers.filter((cust) => {
    if (filterVip && !cust.isVip && cust.totalSpent < 3000) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cust.name.toLowerCase().includes(q);
      const matchPhone = cust.phone.includes(q);
      const matchCity = (cust.city || "").toLowerCase().includes(q);
      return matchName || matchPhone || matchCity;
    }
    return true;
  });

  return (
    <ErpLayout activeItem="customers">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-pink-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <UserCheck size={22} />
            </span>
            <div>
              <h1 className="text-xl font-black font-serif text-pink-gradient">
                قاعدة بيانات العملاء وإدارة العلاقات (CRM)
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                سجل مشتريات العملاء، تصنيف VIP الملكي، العناوين، والتواصل المباشر عبر الواتساب بنقرة واحدة
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
            <Plus size={16} />
            <span>إضافة عميل جديد يدوياً</span>
          </button>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0e0b16] border border-pink-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">إجمالي العملاء المسجلين</span>
              <div className="font-serif font-black text-2xl text-zinc-100 mt-1">
                {customers.length} عميل
              </div>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
              <UserCheck size={24} />
            </div>
          </div>

          <div className="bg-[#0e0b16] border border-pink-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">عملاء VIP الملكيين</span>
              <div className="font-serif font-black text-2xl text-pink-400 mt-1 flex items-center gap-2">
                <span>{vipCount}</span>
                <Crown size={20} className="text-pink-400" />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/20 text-pink-300">
              <Crown size={24} />
            </div>
          </div>

          <div className="bg-[#0e0b16] border border-pink-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">إجمالي مشتريات العملاء</span>
              <div className="font-serif font-black text-2xl text-pink-gradient mt-1">
                {totalCustomerSales.toLocaleString()} ج.م
              </div>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
              <ShoppingBag size={24} />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالاسم، الهاتف، أو المحافظة..."
              className="w-full pr-10 pl-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound("click");
                setFilterVip(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                !filterVip
                  ? "bg-pink-500 text-black shadow-md"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              جميع العملاء ({customers.length})
            </button>

            <button
              onClick={() => {
                playSound("click");
                setFilterVip(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                filterVip
                  ? "bg-pink-500 text-black shadow-md"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <Crown size={13} />
              <span>عملاء VIP فقط ({vipCount})</span>
            </button>
          </div>
        </div>

        {/* Customers Table */}
        {loading ? (
          <div className="py-20 text-center text-pink-400">
            <RefreshCw size={28} className="animate-spin mx-auto mb-2" />
            <span className="text-xs">جاري تحميل قاعدة بيانات العملاء...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-xs bg-zinc-900/30 rounded-2xl border border-zinc-800">
            لا يوجد عملاء مطابقين للبحث
          </div>
        ) : (
          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">اسم العميل</th>
                    <th className="py-3 px-4">رقم الهاتف</th>
                    <th className="py-3 px-4">المحافظة والعنوان</th>
                    <th className="py-3 px-4">عدد الطلبات</th>
                    <th className="py-3 px-4">إجمالي المشتريات</th>
                    <th className="py-3 px-4">التصنيف</th>
                    <th className="py-3 px-4 text-center">محادثة واتساب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredCustomers.map((cust) => {
                    const isVipCustomer = cust.isVip || cust.totalSpent >= 3000;
                    const cleanPhone = cust.phone.replace(/\D/g, "");
                    const waPhone = cleanPhone.startsWith("0") ? `2${cleanPhone}` : cleanPhone;
                    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                      `أهلاً بك يا فندم ${cust.name}، معك ميني بيك للعطور الفاخرة 👑 نتشرف بخدمتك دائماً.`
                    )}`;

                    return (
                      <tr
                        key={cust.id}
                        className={`hover:bg-zinc-900/40 transition-colors ${
                          isVipCustomer ? "bg-pink-500/5" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-zinc-200">
                          <div className="flex items-center gap-1.5">
                            {isVipCustomer && (
                              <Crown size={14} className="text-pink-400 shrink-0" />
                            )}
                            <span>{cust.name}</span>
                          </div>
                          {cust.notes && (
                            <div className="text-[10px] text-zinc-500 mt-0.5">{cust.notes}</div>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-pink-300">
                          {cust.phone}
                        </td>

                        <td className="py-3 px-4 text-zinc-300">
                          <div className="flex items-center gap-1">
                            <MapPin size={11} className="text-zinc-500" />
                            <span>
                              {cust.city || "القاهرة"} {cust.address ? `- ${cust.address}` : ""}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-zinc-200">
                          {cust.totalOrders} طلب
                        </td>

                        <td className="py-3 px-4 font-serif font-black text-sm text-pink-gradient">
                          {(cust.totalSpent || 0).toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isVipCustomer
                                ? "bg-gradient-to-r from-amber-500/20 to-amber-700/20 text-pink-300 border border-pink-500/40"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {isVipCustomer ? "👑 عميل VIP ملكي" : "عميل دائم"}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => playSound("pop")}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 font-bold text-[11px] transition"
                          >
                            <MessageCircle size={13} />
                            <span>واتساب فوري</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#120e1c] border border-pink-500/30 rounded-2xl p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-pink-300 font-serif flex items-center gap-2">
                <UserCheck size={18} />
                <span>إضافة عميل جديد لقاعدة البيانات</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">اسم العميل:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="الاسم ثلاثي أو ثنائي"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">رقم الهاتف:</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">المحافظة / المدينة:</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">العنوان بالتفصيل:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="المنطقة، الشارع، رقم العمارة أو الشقة"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">ملاحظات العميل والتفضيلات العطرية:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: يفضل عطور العود والبخور والشتوي"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVip}
                    onChange={(e) => setIsVip(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-pink-500 focus:ring-0"
                  />
                  <span className="text-zinc-200 font-medium">تمييز كعميل VIP ملكي 👑</span>
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs"
                >
                  {saving ? "جاري الحفظ..." : "حفظ بيانات العميل 👤"}
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
