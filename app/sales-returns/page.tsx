"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import { useStaff } from "@/context/StaffContext";
import SecurityPinModal from "@/components/SecurityPinModal";
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
  Trash2,
  Receipt,
  Layers,
  ChevronDown,
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

interface OrderItem {
  id?: string;
  productId?: string;
  nameAr?: string;
  title?: string;
  price?: number;
  quantity?: number;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  items: any;
  createdAt: string;
}

interface ReturnItemLine {
  productId?: string;
  nameAr: string;
  quantity: number;
  refundPrice: number;
}

export default function SalesReturnsPage() {
  const { currentUser } = useStaff();
  const [returns, setReturns] = useState<SalesReturn[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Return Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderId, setOrderId] = useState("");
  const [refundMethod, setRefundMethod] = useState("CASH");
  const [reason, setReason] = useState("إلغاء الطلب");
  const [restockItems, setRestockItems] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Dynamic Return Items Lines (Multi-Items)
  const [returnLines, setReturnLines] = useState<ReturnItemLine[]>([
    { nameAr: "", quantity: 1, refundPrice: 0 },
  ]);

  // Security PIN Modal
  const [pinAction, setPinAction] = useState<(() => void) | null>(null);
  const [isPinOpen, setIsPinOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [resRet, resProd, resOrders, resCust] = await Promise.all([
        fetch("/api/sales-returns"),
        fetch("/api/products"),
        fetch("/api/orders"),
        fetch("/api/customers"),
      ]);
      const dataRet = await resRet.json();
      const dataProd = await resProd.json();
      const dataOrders = await resOrders.json();
      const dataCust = await resCust.json();

      setReturns(dataRet.returns || []);
      setProducts(dataProd.products || []);
      setOrders(dataOrders.orders || []);
      setCustomers(dataCust.customers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // When user selects an order / invoice
  const handleSelectOrder = (selectedOrderNum: string) => {
    setOrderNumber(selectedOrderNum);
    const foundOrder = orders.find(
      (o) => o.orderNumber === selectedOrderNum || o.id === selectedOrderNum
    );
    if (foundOrder) {
      setOrderId(foundOrder.id);
      setCustomerName(foundOrder.customerName || "");
      setCustomerPhone(foundOrder.customerPhone || "");

      // Parse order items to populate return lines
      try {
        const parsedItems =
          typeof foundOrder.items === "string"
            ? JSON.parse(foundOrder.items)
            : foundOrder.items;
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          const lines: ReturnItemLine[] = parsedItems.map((itm: any) => ({
            productId: itm.productId || itm.id || undefined,
            nameAr: itm.nameAr || itm.title || "صنف من الفاتورة",
            quantity: Number(itm.quantity || 1),
            refundPrice: Number(itm.price || 0),
          }));
          setReturnLines(lines);
          playSound("pop");
          return;
        }
      } catch (e) {
        console.error("Failed to parse order items:", e);
      }
    }
  };

  const handleSelectCustomer = (cName: string) => {
    setCustomerName(cName);
    const found = customers.find((c) => c.name === cName);
    if (found) {
      setCustomerPhone(found.phone);
    }
  };

  // Manage return lines
  const handleAddLine = () => {
    setReturnLines((prev) => [
      ...prev,
      { nameAr: "", quantity: 1, refundPrice: 0 },
    ]);
  };

  const handleRemoveLine = (idx: number) => {
    if (returnLines.length <= 1) return;
    setReturnLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleLineChange = (idx: number, field: keyof ReturnItemLine, val: any) => {
    setReturnLines((prev) =>
      prev.map((line, i) => {
        if (i !== idx) return line;
        const updated = { ...line, [field]: val };

        // If choosing product from catalog
        if (field === "nameAr") {
          const prod = products.find((p) => p.nameAr === val);
          if (prod) {
            updated.productId = prod.id;
            updated.refundPrice = prod.price;
          }
        }
        return updated;
      })
    );
  };

  // Calculate total refund
  const totalRefund = returnLines.reduce(
    (sum, line) => sum + (line.quantity || 0) * (line.refundPrice || 0),
    0
  );

  const handleCreateReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || totalRefund <= 0) {
      alert("يرجى ملء بيانات العميل والتأكد من وجود أصناف بمبالغ صحيحة");
      return;
    }
    setSaving(true);
    playSound("click");

    try {
      const res = await fetch("/api/sales-returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId || null,
          orderNumber: orderNumber.trim() || null,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          items: returnLines,
          totalRefund,
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
        // Reset form
        setCustomerName("");
        setCustomerPhone("");
        setOrderNumber("");
        setOrderId("");
        setReturnLines([{ nameAr: "", quantity: 1, refundPrice: 0 }]);
        setNotes("");
      } else {
        alert(data.error || "فشل تسجيل المرتجع");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ المرتجع");
    } finally {
      setSaving(false);
    }
  };

  const filteredReturns = returns.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.returnNumber.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerPhone.includes(q) ||
      (r.orderNumber || "").toLowerCase().includes(q)
    );
  });

  return (
    <ErpLayout activeItem="sales-returns">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-purple-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <RotateCcw size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold font-serif text-purple-400">
                مرتجعات المبيعات واسترداد الأجهزة
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                تسجيل مرتجعات الكاميرات والأجهزة بالفواتير، إرجاع الأصناف المتعددة، وإعادة الرصيد للمخزن
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center gap-2 transition shrink-0"
          >
            <Plus size={16} />
            <span>تسجيل مرتجع مبيعات جديد</span>
          </button>
        </div>

        {/* Search & Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث برقم المرتجع، الفاتورة، أو العميل..."
              className="w-full pl-3 pr-9 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="text-xs text-zinc-400 font-medium">
            إجمالي أذونات المرتجع: <span className="font-mono font-bold text-purple-400">{returns.length}</span>
          </div>
        </div>

        {/* Returns Table */}
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-purple-400" />
            <span>جاري استرجاع سجل المرتجعات...</span>
          </div>
        ) : filteredReturns.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs bg-zinc-900/40 border border-zinc-800 rounded-2xl">
            لا توجد أذونات مرتجعات مطابقة
          </div>
        ) : (
          <div className="bg-[#0c0914] border border-purple-500/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">رقم المرتجع</th>
                    <th className="py-3 px-4">رقم الفاتورة الأصلية</th>
                    <th className="py-3 px-4">العميل</th>
                    <th className="py-3 px-4">الأصناف المرتجعة</th>
                    <th className="py-3 px-4">المبلغ المسترد</th>
                    <th className="py-3 px-4">طريقة الرد</th>
                    <th className="py-3 px-4">سبب الإرجاع</th>
                    <th className="py-3 px-4">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredReturns.map((ret) => {
                    let itemsCount = 1;
                    let itemsSummary = "";
                    try {
                      const parsed = JSON.parse(ret.items);
                      if (Array.isArray(parsed)) {
                        itemsCount = parsed.length;
                        itemsSummary = parsed.map((p) => `${p.nameAr || p.title} (×${p.quantity})`).join("، ");
                      }
                    } catch {
                      itemsSummary = ret.items;
                    }

                    return (
                      <tr key={ret.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-purple-400">
                          {ret.returnNumber}
                        </td>

                        <td className="py-3 px-4 font-mono text-zinc-300">
                          {ret.orderNumber || "—"}
                        </td>

                        <td className="py-3 px-4 font-medium text-zinc-200">
                          <div>{ret.customerName}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{ret.customerPhone}</div>
                        </td>

                        <td className="py-3 px-4 text-zinc-300 max-w-xs truncate" title={itemsSummary}>
                          <span className="font-bold text-zinc-100">{itemsCount} صنف: </span>
                          <span className="text-zinc-400">{itemsSummary}</span>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-rose-400">
                          {ret.totalRefund.toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
                            {ret.refundMethod === "CASH" ? "كاش نقدي" : ret.refundMethod}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-zinc-400">
                          {ret.reason}
                        </td>

                        <td className="py-3 px-4 text-zinc-500 text-[11px] font-mono">
                          {new Date(ret.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Return Modal */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1422] border border-purple-500/30 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative animate-fadeIn text-right text-slate-100 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsAddOpen(false)}
                className="absolute left-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>

              <h3 className="font-bold text-base text-purple-400 mb-4 flex items-center gap-2">
                <RotateCcw size={18} />
                <span>تسجيل مرتجع مبيعات جديد</span>
              </h3>

              <form onSubmit={handleCreateReturn} className="space-y-4 text-xs">
                {/* Invoice Search / Selection */}
                <div className="bg-purple-950/20 border border-purple-500/30 p-3.5 rounded-xl space-y-2">
                  <label className="block text-purple-300 font-bold flex items-center gap-1.5">
                    <Receipt size={14} />
                    <span>المرتجع برقم الفاتورة الأصلية (اختر الفاتورة لجلب بياناتها أوتوماتيكياً):</span>
                  </label>
                  <input
                    type="text"
                    list="orders-list"
                    value={orderNumber}
                    onChange={(e) => handleSelectOrder(e.target.value)}
                    placeholder="ابحث أو اختر رقم الفاتورة (مثال: DC-ORD-1001)..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-purple-300 font-mono focus:outline-none focus:border-purple-500"
                  />
                  <datalist id="orders-list">
                    {orders.map((o) => (
                      <option key={o.id} value={o.orderNumber}>
                        {o.orderNumber} — العميل: {o.customerName} — الإجمالي: {o.totalAmount} ج.م
                      </option>
                    ))}
                  </datalist>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">اسم العميل *:</label>
                    <input
                      type="text"
                      list="customers-datalist"
                      required
                      value={customerName}
                      onChange={(e) => handleSelectCustomer(e.target.value)}
                      placeholder="اختر من العملاء أو اكتب..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-purple-500"
                    />
                    <datalist id="customers-datalist">
                      {customers.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.phone})
                        </option>
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">رقم الهاتف:</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="010xxxxxxxx"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                    />
                  </div>
                </div>

                {/* Return Items Multi-Lines Section */}
                <div className="border border-zinc-800 rounded-xl p-3.5 bg-zinc-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <Layers size={14} className="text-purple-400" />
                      <span>الأصناف المرتجعة (يمكنك إضافة أكثر من صنف في نفس الإذن):</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddLine}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Plus size={12} />
                      <span>+ إضافة صنف آخر</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {returnLines.map((line, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-2 items-center bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-xs"
                      >
                        <div className="col-span-6">
                          <label className="block text-[10px] text-zinc-400 mb-0.5">الصنف المرتجع:</label>
                          <input
                            type="text"
                            list="products-suggestions"
                            required
                            value={line.nameAr}
                            onChange={(e) => handleLineChange(idx, "nameAr", e.target.value)}
                            placeholder="اختر أو اكتب اسم الصنف..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-[10px] text-zinc-400 mb-0.5">الكمية:</label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={line.quantity}
                            onChange={(e) => handleLineChange(idx, "quantity", Number(e.target.value))}
                            className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-center text-xs"
                          />
                        </div>

                        <div className="col-span-3">
                          <label className="block text-[10px] text-zinc-400 mb-0.5">سعر الاسترداد (ج.م):</label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={line.refundPrice}
                            onChange={(e) => handleLineChange(idx, "refundPrice", Number(e.target.value))}
                            className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-xs"
                          />
                        </div>

                        <div className="col-span-1 text-center pt-3">
                          {returnLines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLine(idx)}
                              className="text-rose-400 hover:text-rose-300 p-1"
                            >
                              <X size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <datalist id="products-suggestions">
                    {products.map((p) => (
                      <option key={p.id} value={p.nameAr}>
                        {p.nameAr} ({p.price} ج.م)
                      </option>
                    ))}
                  </datalist>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs font-bold">
                    <span className="text-zinc-400">إجمالي المبلغ المسترد:</span>
                    <span className="text-rose-400 font-mono text-sm">
                      {totalRefund.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>

                {/* Refund Method & Reason */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">طريقة رد المبلغ:</label>
                    <select
                      value={refundMethod}
                      onChange={(e) => setRefundMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                    >
                      <option value="CASH">كاش نقدي 💵</option>
                      <option value="INSTAPAY">إنستاباي / تحويل بنكي</option>
                      <option value="STORE_CREDIT">رصيد حساب بالمتجر</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">سبب الإرجاع:</label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                    >
                      <option value="إلغاء الطلب">إلغاء الطلب</option>
                      <option value="إلغاء الطلب عند الاستلام">إلغاء الطلب عند الاستلام</option>
                      <option value="عطل فني في الكاميرا أو جهاز التسجيل">عطل فني في الكاميرا أو جهاز التسجيل</option>
                      <option value="طلب العميل استبدال بموديل أحدث">طلب العميل استبدال بموديل أحدث</option>
                      <option value="عدم مطابقة المواصفات الفنية للموقع">عدم مطابقة المواصفات الفنية للموقع</option>
                    </select>
                  </div>
                </div>

                {/* Auto Restock Checkbox */}
                <div className="flex items-center gap-2 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <input
                    type="checkbox"
                    id="restock-check"
                    checked={restockItems}
                    onChange={(e) => setRestockItems(e.target.checked)}
                    className="rounded accent-purple-500 w-4 h-4"
                  />
                  <label htmlFor="restock-check" className="text-zinc-300 font-medium cursor-pointer text-xs">
                    إعادة الكميات المرتجعة لرصيد المخزن والمعرض تلقائياً 📦
                  </label>
                </div>

                {/* Submit Actions */}
                <div className="flex gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-bold text-xs"
                  >
                    {saving ? "جاري تسجيل المرتجع..." : `تأكيد المرتجع وتسجيله (${totalRefund.toLocaleString()} ج.م)`}
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
      </div>
    </ErpLayout>
  );
}
