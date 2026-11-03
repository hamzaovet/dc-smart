"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import { useStaff } from "@/context/StaffContext";
import {
  RotateCcw,
  Plus,
  Search,
  RefreshCw,
  CheckCircle2,
  Package,
  Calendar,
  X,
  User,
  Phone,
  DollarSign,
  AlertCircle,
  FileText,
} from "lucide-react";

interface SalesReturn {
  id: string;
  returnNumber: string;
  orderId?: string | null;
  orderNumber?: string | null;
  customerName: string;
  customerPhone: string;
  items: string;
  totalRefund: number;
  refundMethod: string;
  reason: string;
  restockItems: boolean;
  status: string;
  notes?: string | null;
  recordedBy?: string | null;
  createdAt: string;
}

interface Product {
  id: string;
  nameAr: string;
  price: number;
}

export default function SalesReturnsPage() {
  const { currentUser } = useStaff();
  const [returns, setReturns] = useState<SalesReturn[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Return Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [returnQty, setReturnQty] = useState("1");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundMethod, setRefundMethod] = useState("CASH");
  const [reason, setReason] = useState("عيب في البخاخ أو العبوة");
  const [restockItems, setRestockItems] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReturnsAndProducts();
  }, []);

  const fetchReturnsAndProducts = async () => {
    setLoading(true);
    try {
      const [resRet, resProd] = await Promise.all([
        fetch("/api/sales-returns"),
        fetch("/api/products"),
      ]);
      const dataRet = await resRet.json();
      const dataProd = await resProd.json();

      setReturns(dataRet.returns || []);
      setProducts(dataProd.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setRefundAmount((prod.price * (Number(returnQty) || 1)).toString());
    }
  };

  const handleQtyChange = (qtyStr: string) => {
    setReturnQty(qtyStr);
    const prod = products.find((p) => p.id === selectedProductId);
    if (prod) {
      setRefundAmount((prod.price * (Number(qtyStr) || 1)).toString());
    }
  };

  const handleCreateReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !refundAmount) return;
    setSaving(true);
    playSound("click");

    const prod = products.find((p) => p.id === selectedProductId);
    const returnItems = [
      {
        productId: prod?.id || null,
        nameAr: prod?.nameAr || "عطر مرتجع",
        quantity: Number(returnQty) || 1,
        refundPrice: Number(refundAmount),
      },
    ];

    try {
      const res = await fetch("/api/sales-returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          orderNumber: orderNumber.trim() || null,
          items: returnItems,
          totalRefund: Number(refundAmount),
          refundMethod,
          reason,
          restockItems,
          notes: notes.trim() || null,
          recordedBy: currentUser?.name || "المايسترو",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setReturns((prev) => [data.return, ...prev]);
        setIsAddOpen(false);
        setCustomerName("");
        setCustomerPhone("");
        setOrderNumber("");
        setRefundAmount("");
        setNotes("");
      } else {
        alert(data.error || "فشل تسجيل المرتجع");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Calculations
  const totalRefunded = returns.reduce((sum, r) => sum + (r.totalRefund || 0), 0);
  const restockedCount = returns.filter((r) => r.restockItems).length;

  const filteredReturns = returns.filter((r) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = r.returnNumber.toLowerCase().includes(q);
      const matchCust = r.customerName.toLowerCase().includes(q);
      const matchPhone = r.customerPhone.includes(q);
      const matchOrd = (r.orderNumber || "").toLowerCase().includes(q);
      return matchNum || matchCust || matchPhone || matchOrd;
    }
    return true;
  });

  return (
    <ErpLayout activeItem="sales-returns">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-pink-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <RotateCcw size={22} />
            </span>
            <div>
              <h1 className="text-xl font-black font-serif text-pink-gradient">
                مرتجعات المبيعات واسترجاع البضائع
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                إدارة مرتجعات العملاء، تسوية المبالغ المستردة، وإعادة المنتجات للمخزون تلقائياً
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
            <span>تسجيل مرتجع مبيعات جديد</span>
          </button>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0e0b16] border border-pink-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">إجمالي المرتجعات</span>
              <div className="font-serif font-black text-2xl text-zinc-100 mt-1">
                {returns.length} عملية إرجاع
              </div>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
              <RotateCcw size={24} />
            </div>
          </div>

          <div className="bg-[#0e0b16] border border-pink-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">إجمالي المبالغ المستردة</span>
              <div className="font-serif font-black text-2xl text-red-400 mt-1">
                {totalRefunded.toLocaleString()} ج.م
              </div>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
              <DollarSign size={24} />
            </div>
          </div>

          <div className="bg-[#0e0b16] border border-pink-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">عمليات أُعيدت للمخزون</span>
              <div className="font-serif font-black text-2xl text-emerald-400 mt-1">
                {restockedCount} عملية
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Package size={24} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث برقم المرتجع، اسم العميل، أو رقم الهاتف..."
            className="w-full pr-10 pl-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* Returns Table */}
        {loading ? (
          <div className="py-20 text-center text-pink-400">
            <RefreshCw size={28} className="animate-spin mx-auto mb-2" />
            <span className="text-xs">جاري تحميل سجلات المرتجعات...</span>
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-xs bg-zinc-900/30 rounded-2xl border border-zinc-800">
            لا توجد مرتجعات مسجلة حتى الآن
          </div>
        ) : (
          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">رقم المرتجع</th>
                    <th className="py-3 px-4">العميل</th>
                    <th className="py-3 px-4">الأصناف المرتجعة</th>
                    <th className="py-3 px-4">المبلغ المسترد</th>
                    <th className="py-3 px-4">طريقة الاسترداد</th>
                    <th className="py-3 px-4">سبب الإرجاع</th>
                    <th className="py-3 px-4">إعادة للمخزن؟</th>
                    <th className="py-3 px-4">المسؤول والتاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredReturns.map((ret) => {
                    let parsedItems: any[] = [];
                    try {
                      parsedItems =
                        typeof ret.items === "string" ? JSON.parse(ret.items) : ret.items;
                    } catch {
                      parsedItems = [];
                    }

                    return (
                      <tr key={ret.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-pink-400">
                          #{ret.returnNumber}
                          {ret.orderNumber && (
                            <span className="block text-[10px] text-zinc-500">
                              (طلب #{ret.orderNumber})
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-zinc-200">{ret.customerName}</div>
                          <div className="font-mono text-[10.5px] text-zinc-500">
                            {ret.customerPhone}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            {parsedItems.map((itm, i) => (
                              <div key={i} className="text-zinc-300">
                                {itm.nameAr} × <span className="font-bold text-pink-300">{itm.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono font-black text-sm text-red-400">
                          {ret.totalRefund} ج.م
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10.5px]">
                            {ret.refundMethod === "CASH"
                              ? "كاش نقدي 💵"
                              : ret.refundMethod === "INSTAPAY"
                              ? "إنستاباي 📱"
                              : "رصيد متجر 💳"}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-zinc-400 text-[11px]">
                          {ret.reason}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ret.restockItems
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {ret.restockItems ? "نعم (تمت الإضافة)" : "لا"}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-zinc-400 text-[11px]">
                          <div>{ret.recordedBy || "المايسترو"}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            {new Date(ret.createdAt).toLocaleDateString("ar-EG")}
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
      </div>

      {/* Add Return Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#120e1c] border border-pink-500/30 rounded-2xl p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-pink-300 font-serif flex items-center gap-2">
                <RotateCcw size={18} />
                <span>تسجيل مرتجع مبيعات جديد</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateReturn} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم العميل:</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="اسم العميل"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">رقم الهاتف:</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">رقم الطلب الأصلي (إن وُجد):</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="مثال: ROVY-1234"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                />
              </div>

              {/* Product selector */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-zinc-300 font-medium mb-1">الصنف المرتجع:</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="">-- اختر العطر من القائمة --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nameAr} ({p.price} ج.م)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">الكمية:</label>
                  <input
                    type="number"
                    min="1"
                    value={returnQty}
                    onChange={(e) => handleQtyChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">المبلغ المسترد (ج.م):</label>
                  <input
                    type="number"
                    required
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">طريقة رد المبلغ:</label>
                  <select
                    value={refundMethod}
                    onChange={(e) => setRefundMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="CASH">كاش نقدي 💵</option>
                    <option value="INSTAPAY">إنستاباي (InstaPay) 📱</option>
                    <option value="STORE_CREDIT">رصيد متجر / استبدال 💳</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">سبب الإرجاع:</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                >
                  <option value="عيب في البخاخ أو العبوة">عيب في البخاخ أو العبوة</option>
                  <option value="عدم صعوبة التركيب الرائحة أو ملاحظات جودة">عدم صعوبة التركيب الرائحة أو ملاحظات جودة</option>
                  <option value="خطأ في إرسال صنف مختلف">خطأ في إرسال صنف مختلف</option>
                  <option value="طلب استبدال بعطر آخر">طلب استبدال بعطر آخر</option>
                  <option value="إلغاء الطلب عند الاستلام">إلغاء الطلب عند الاستلام</option>
                </select>
              </div>

              {/* Restock items checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={restockItems}
                    onChange={(e) => setRestockItems(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-pink-500 focus:ring-0"
                  />
                  <span className="text-zinc-200 font-medium">
                    إعادة الكمية المرتجعة لرصيد المخزن تلقائياً 📦
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs"
                >
                  {saving ? "جاري التسجيل..." : "تأكيد المرتجع وتسجيله 🔄"}
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
