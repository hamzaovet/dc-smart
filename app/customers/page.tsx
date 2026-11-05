"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import SecurityPinModal from "@/components/SecurityPinModal";
import {
  UserCheck,
  Search,
  Phone,
  MapPin,
  MessageCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Crown,
  ShoppingBag,
  X,
  Edit2,
  Trash2,
  Check,
  AlertTriangle,
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

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("طنطا");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isVip, setIsVip] = useState(false);
  const [phoneWarning, setPhoneWarning] = useState("");

  // Security PIN Modal
  const [pinAction, setPinAction] = useState<(() => void) | null>(null);
  const [isPinOpen, setIsPinOpen] = useState(false);

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

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setName("");
    setPhone("");
    setCity("طنطا");
    setAddress("");
    setNotes("");
    setIsVip(false);
    setPhoneWarning("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cust: Customer) => {
    // Require PIN to edit
    setPinAction(() => () => {
      setEditingCustomer(cust);
      setName(cust.name);
      setPhone(cust.phone);
      setCity(cust.city || "طنطا");
      setAddress(cust.address || "");
      setNotes(cust.notes || "");
      setIsVip(Boolean(cust.isVip));
      setPhoneWarning("");
      setIsModalOpen(true);
    });
    setIsPinOpen(true);
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (!editingCustomer && val.trim().length >= 8) {
      const existing = customers.find((c) => c.phone.trim() === val.trim());
      if (existing) {
        setPhoneWarning(`تنبيه: هذا الرقم مسجل بالفعل باسم (${existing.name})`);
      } else {
        setPhoneWarning("");
      }
    } else {
      setPhoneWarning("");
    }
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    playSound("click");

    try {
      const method = editingCustomer ? "PUT" : "POST";
      const payload: any = {
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        notes: notes.trim(),
        isVip,
      };
      if (editingCustomer) {
        payload.id = editingCustomer.id;
      }

      const res = await fetch("/api/customers", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        if (editingCustomer) {
          setCustomers((prev) =>
            prev.map((c) => (c.id === editingCustomer.id ? data.customer : c))
          );
        } else {
          setCustomers((prev) => [data.customer, ...prev]);
        }
        setIsModalOpen(false);
      } else {
        alert(data.error || "فشل حفظ بيانات العميل");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomer = (id: string, custName: string) => {
    setPinAction(() => async () => {
      if (!confirm(`هل أنت متأكد من حذف العميل (${custName}) نهائياً من قاعدة البيانات؟`)) return;
      playSound("trash");
      try {
        const res = await fetch(`/api/customers?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok && data.success) {
          playSound("success");
          setCustomers((prev) => prev.filter((c) => c.id !== id));
        } else {
          alert(data.error || "فشل حذف العميل");
        }
      } catch (err) {
        console.error(err);
      }
    });
    setIsPinOpen(true);
  };

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

  const totalSpentAll = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
  const vipCount = customers.filter((c) => c.isVip || c.totalSpent >= 3000).length;

  return (
    <ErpLayout activeItem="customers">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-pink-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <UserCheck size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold font-serif text-pink-400">
                قاعدة بيانات العملاء وإدارة العلاقات (CRM)
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                سجل مشتريات العملاء، العناوين، تصنيف VIP الملكي، وتعديل وحذف العملاء بصلاحية الإدارة
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition shrink-0"
          >
            <Plus size={16} />
            <span>إضافة عميل جديد يدوياً</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">إجمالي العملاء المسجلين</span>
              <h3 className="text-2xl font-black font-mono text-zinc-100 mt-1">
                {customers.length} <span className="text-xs font-normal text-zinc-400 font-sans">عميل</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <UserCheck size={20} />
            </div>
          </div>

          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">عملاء VIP الملكيين</span>
              <h3 className="text-2xl font-black font-mono text-pink-300 mt-1">
                {vipCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <Crown size={20} />
            </div>
          </div>

          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">إجمالي مشتريات العملاء</span>
              <h3 className="text-2xl font-black font-mono text-zinc-100 mt-1">
                {totalSpentAll.toLocaleString()}{" "}
                <span className="text-xs font-normal text-zinc-400 font-sans">ج.م</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterVip(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                !filterVip
                  ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              جميع العملاء ({customers.length})
            </button>
            <button
              onClick={() => setFilterVip(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filterVip
                  ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <Crown size={14} />
              <span>عملاء VIP فقط ({vipCount})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث بالاسم، الهاتف، أو المحافظة..."
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Customers Table */}
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-pink-400" />
            <span>جاري استرجاع قاعدة بيانات العملاء...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs bg-zinc-900/40 border border-zinc-800 rounded-2xl">
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
                    <th className="py-3 px-4 text-center">إجراءات الإدارة 🔒</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredCustomers.map((cust) => {
                    const isVipCustomer = cust.isVip || cust.totalSpent >= 3000;
                    const cleanPhone = cust.phone.replace(/\D/g, "");
                    const waPhone = cleanPhone.startsWith("0") ? `2${cleanPhone}` : cleanPhone;
                    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                      `أهلاً بك يا فندم ${cust.name}، معك دي سي سمارت للأنظمة الأمنية والمراقبة 🛡️ نتشرف بخدمتك دائماً.`
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
                              {cust.city || "طنطا"} {cust.address ? `- ${cust.address}` : ""}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-zinc-200">
                          {cust.totalOrders} طلب
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-zinc-200">
                          {(cust.totalSpent || 0).toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4">
                          {isVipCustomer ? (
                            <span className="px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-bold inline-flex items-center gap-1">
                              👑 عميل VIP ملكي
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px]">
                              عميل دائم
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium transition"
                          >
                            <MessageCircle size={13} />
                            <span>واتساب فوري</span>
                          </a>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(cust)}
                              title="تعديل بيانات العميل (محمي بالباسورد)"
                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                              title="حذف العميل نهائياً (محمي بالباسورد)"
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add / Edit Customer Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1422] border border-pink-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn text-right text-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute left-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>

              <h3 className="font-bold text-base text-pink-400 mb-4 flex items-center gap-2">
                <UserCheck size={18} />
                <span>{editingCustomer ? "تعديل بيانات العميل" : "إضافة عميل جديد لقاعدة البيانات"}</span>
              </h3>

              <form onSubmit={handleSaveCustomer} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم العميل أو المؤسسة *:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: رامون كفر الشيخ / شركة الأمل"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">رقم الهاتف *:</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono focus:outline-none focus:border-pink-500"
                  />
                  {phoneWarning && (
                    <div className="flex items-center gap-1.5 text-amber-400 text-[11px] mt-1.5 bg-amber-500/10 p-2 rounded-lg border border-amber-500/30">
                      <AlertTriangle size={14} className="shrink-0" />
                      <span>{phoneWarning}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">المحافظة / المدينة:</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="طنطا / كفر الشيخ..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">العنوان التفصيلي:</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="الشارع، رقم المبنى..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">ملاحظات العميل أو طبيعة النشاط:</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: DAHUA، صيدلية دار الطب، مقاولات واستشاري..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="vip-check"
                    checked={isVip}
                    onChange={(e) => setIsVip(e.target.checked)}
                    className="rounded accent-pink-500 w-4 h-4"
                  />
                  <label htmlFor="vip-check" className="text-zinc-300 font-medium cursor-pointer">
                    تمييز العميل كـ عميل VIP ملكي 👑
                  </label>
                </div>

                <div className="flex gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:brightness-110 text-white font-bold text-xs"
                  >
                    {saving ? "جاري الحفظ..." : editingCustomer ? "حفظ التعديلات" : "إضافة العميل"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Master Security PIN Modal */}
        <SecurityPinModal
          isOpen={isPinOpen}
          onClose={() => setIsPinOpen(false)}
          onSuccess={() => {
            if (pinAction) pinAction();
          }}
          title="تأكيد بصلاحية الإدارة (Master PIN)"
          actionDescription="تعديل أو حذف بيانات العملاء يتطلب إدخال رمز أمان الإدارة."
        />
      </div>
    </ErpLayout>
  );
}
