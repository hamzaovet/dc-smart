"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import ErpLayout from "@/components/ErpLayout";
import ThermalReceiptModal, { printThermalReceipt, PrintableOrder } from "@/components/ThermalReceipt";
import { playSound } from "@/lib/sounds";
import {
  Truck,
  Package,
  RefreshCw,
  Phone,
  MapPin,
  Clock,
  Printer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  MessageCircle,
  Search,
  Bike,
  Plus,
  Send,
  User,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

interface OrderItem {
  nameAr?: string;
  nameEn?: string;
  quantity?: number;
  qty?: number;
  price?: number;
  unitPrice?: number;
  volume?: string;
  type?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  notes?: string;
  items: string;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: string; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
  paymentMethod: string;
  orderType?: string;
  cashierName?: string;
  courierName?: string;
  courierPhone?: string;
  createdAt: string;
}

const STATUS_TABS = [
  { id: "active", label: "النشطة" },
  { id: "PENDING", label: "جديد" },
  { id: "CONFIRMED", label: "قيد التجهيز الفني والبرمجة" },
  { id: "READY", label: "جاهز للتسليم" },
  { id: "SHIPPED", label: "مع المندوب" },
  { id: "DELIVERED", label: "تم التسليم والتحصيل" },
  { id: "CANCELLED", label: "ملغي" },
];

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Thermal Receipt Modal
  const [receiptOrder, setReceiptOrder] = useState<PrintableOrder | null>(null);

  // Assign Courier Modal
  const [courierModalOrder, setCourierModalOrder] = useState<Order | null>(null);
  const [courierName, setCourierName] = useState("");
  const [courierPhone, setCourierPhone] = useState("");
  const [savingCourier, setSavingCourier] = useState(false);

  // Delivery Zones Modal
  const [zonesModalOpen, setZonesModalOpen] = useState(false);

  const prevOrdersCountRef = useRef<number>(0);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      const list: Order[] = data.orders || [];

      // Check if new orders arrived to sound alert
      if (prevOrdersCountRef.current > 0 && list.length > prevOrdersCountRef.current) {
        playSound("order");
      }
      prevOrdersCountRef.current = list.length;
      setOrders(list);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // 10s live polling
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    playSound("click");
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        playSound("success");
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Update status error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveCourier = async () => {
    if (!courierModalOrder) return;
    setSavingCourier(true);
    playSound("click");
    try {
      const res = await fetch(`/api/orders/${courierModalOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courierName: courierName.trim(),
          courierPhone: courierPhone.trim(),
          status: "SHIPPED",
        }),
      });
      if (res.ok) {
        playSound("success");
        setOrders((prev) =>
          prev.map((o) =>
            o.id === courierModalOrder.id
              ? {
                  ...o,
                  courierName: courierName.trim(),
                  courierPhone: courierPhone.trim(),
                  status: "SHIPPED",
                }
              : o
          )
        );
        setCourierModalOrder(null);
        setCourierName("");
        setCourierPhone("");
      }
    } catch (err) {
      console.error("Courier save error:", err);
    } finally {
      setSavingCourier(false);
    }
  };

  // Filter Orders by Tab and Search
  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (selectedTab === "active") {
      if (order.status === "DELIVERED" || order.status === "CANCELLED") return false;
    } else if (order.status !== selectedTab) {
      return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.includes(q);
      return matchNum || matchName || matchPhone;
    }

    return true;
  });

  // Calculate counts for each tab
  const getTabCount = (tabId: string) => {
    if (tabId === "active") {
      return orders.filter(
        (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
      ).length;
    }
    return orders.filter((o) => o.status === tabId).length;
  };

  return (
    <ErpLayout activeItem="orders">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gradient-to-r dark:from-[#120e1c] dark:via-[#0e0b16] dark:to-[#120e1c] p-5 rounded-2xl border border-pink-500/20 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
                <Truck size={22} />
              </span>
              <div>
                <h1 className="text-xl font-black font-serif text-pink-gradient">
                  شاشة تجهيز الطلبات ولوجستيات التوصيل والشحن
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  إدارة دورة حياة الأوردر — طباعة ريسيت حراري 80mm — تعيين مندوب التوصيل — تحصيل الفلوس
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setZonesModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 flex items-center gap-1.5 transition"
            >
              <MapPin size={14} className="text-pink-400" />
              <span>مناطق وتسعيرة الشحن</span>
            </button>

            <button
              onClick={() => {
                playSound("click");
                fetchOrders();
              }}
              className="px-3.5 py-2 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 text-xs font-bold border border-pink-500/30 flex items-center gap-1.5 transition"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>تحديث مباشر</span>
            </button>
          </div>
        </div>

        {/* Status Pipeline Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const count = getTabCount(tab.id);
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSound("click");
                  setSelectedTab(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/25 scale-[1.02]"
                    : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10.5px] font-mono font-black ${
                    isActive
                      ? "bg-black/25 text-black"
                      : count > 0
                      ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
            className="w-full pr-10 pl-4 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500/50"
          />
        </div>

        {/* Orders Cards Grid */}
        {loading && orders.length === 0 ? (
          <div className="py-20 text-center text-pink-400">
            <RefreshCw size={32} className="animate-spin mx-auto mb-3" />
            <span className="text-xs">جاري تحميل أحدث الطلبات واللوجستيات...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-24 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-8">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-4">
              <Package size={28} />
            </div>
            <h3 className="text-base font-bold text-zinc-200 font-serif">
              لا توجد طلبات في هذا القسم حالياً
            </h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1">
              أي طلب جديد من الموقع الإلكتروني أو من شاشة الكاشير سيظهر هنا فوراً مع تنبيه صوتي مستمر 🔔
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredOrders.map((order) => {
              let parsedItems: OrderItem[] = [];
              try {
                parsedItems =
                  typeof order.items === "string" ? JSON.parse(order.items) : order.items;
              } catch {
                parsedItems = [];
              }

              const isPOS = order.orderType === "pos";
              const isDelivered = order.status === "DELIVERED";
              const isCancelled = order.status === "CANCELLED";

              // WhatsApp greeting URL
              const cleanPhone = order.customerPhone.replace(/\D/g, "");
              const waPhone = cleanPhone.startsWith("0") ? `2${cleanPhone}` : cleanPhone;
              const waMsg = encodeURIComponent(
                `مرحباً ${order.customerName}، معكم دي سي سمارت للأنظمة الأمنية والمراقبة 🛡️ بخصوص طلبكم رقم #${order.orderNumber}.`
              );
              const waUrl = `https://wa.me/${waPhone}?text=${waMsg}`;

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-[#0e0b16] rounded-2xl border border-slate-200 dark:border-pink-500/20 hover:border-cyan-500/50 transition-all p-5 shadow-sm dark:shadow-lg flex flex-col justify-between space-y-4"
                >
                  {/* Top Bar: Order Number, Badge, Time */}
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-sm text-pink-400">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isPOS
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                        }`}
                      >
                        {isPOS ? "🛒 كاشير فوري" : "🌐 متجر أونلاين"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10.5px] px-2.5 py-0.5 rounded-full font-bold ${
                          order.status === "DELIVERED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : order.status === "SHIPPED"
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : order.status === "CONFIRMED"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : order.status === "CANCELLED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                        }`}
                      >
                        {order.status === "PENDING"
                          ? "جديد"
                          : order.status === "CONFIRMED"
                          ? "قيد التجهيز الفاخر"
                          : order.status === "READY"
                          ? "جاهز للشحن"
                          : order.status === "SHIPPED"
                          ? "مع المندوب"
                          : order.status === "DELIVERED"
                          ? "تم التسليم والتحصيل"
                          : "ملغي"}
                      </span>

                      <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                        <Clock size={11} />
                        {new Date(order.createdAt).toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Customer Information with Direct WhatsApp Action */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <div>
                      <div className="text-zinc-400 text-[11px]">العميل:</div>
                      <div className="font-bold text-zinc-200 mt-0.5">{order.customerName}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="text-pink-400 font-mono hover:underline flex items-center gap-1"
                        >
                          <Phone size={11} />
                          <span>{order.customerPhone}</span>
                        </a>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => playSound("pop")}
                          className="px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1 transition"
                        >
                          <MessageCircle size={10} />
                          <span>واتساب</span>
                        </a>
                      </div>
                    </div>

                    <div>
                      <div className="text-zinc-400 text-[11px]">عنوان التوصيل:</div>
                      <div className="font-medium text-zinc-300 mt-0.5 flex items-start gap-1">
                        <MapPin size={12} className="text-pink-400 mt-0.5 shrink-0" />
                        <span>
                          {order.customerCity} - {order.customerAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-zinc-400 flex items-center justify-between">
                      <span>الأصناف المطلوبة ({parsedItems.length}):</span>
                      <span>طريقة الدفع: {order.paymentMethod}</span>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-zinc-800/80 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-zinc-800/60 p-2 text-xs">
                      {parsedItems.map((item, idx) => (
                        <div key={idx} className="py-1.5 flex items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-zinc-200">
                              {item.nameAr || item.nameEn}
                            </span>
                            <span className="text-[10px] text-zinc-400 mr-2">
                              {item.volume || "100 ml"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-pink-400 font-mono font-bold">
                              × {item.quantity || item.qty || 1}
                            </span>
                            <span className="text-zinc-300 font-mono">
                              {(item.price || item.unitPrice || 0) *
                                (item.quantity || item.qty || 1)}{" "}
                              ج.م
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Courier info if assigned */}
                  {order.courierName && (
                    <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 text-cyan-300">
                        <Bike size={14} />
                        <span>المندوب: <strong>{order.courierName}</strong></span>
                        {order.courierPhone && (
                          <span className="font-mono text-[11px]">({order.courierPhone})</span>
                        )}
                      </div>
                      <span className="text-[10px] text-cyan-400 font-bold">شحنة جارية</span>
                    </div>
                  )}

                  {/* Financial Summary & Actions */}
                  <div className="border-t border-zinc-800/80 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-zinc-400">الإجمالي النهائي:</span>
                      <span className="font-serif font-black text-lg text-pink-gradient">
                        {order.totalAmount} ج.م
                      </span>
                      {order.deliveryFee > 0 && (
                        <span className="text-[10px] text-zinc-500">
                          (شامل {order.deliveryFee} شحن)
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Print 80mm Receipt */}
                      <button
                        onClick={() => {
                          playSound("click");
                          printThermalReceipt(order);
                        }}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-pink-300 text-xs font-bold border border-zinc-700 flex items-center gap-1.5 transition"
                        title="طباعة ريسيت حراري 80mm"
                      >
                        <Printer size={15} />
                        <span className="text-[11px]">فاتورة 80mm</span>
                      </button>

                      {/* State transitions */}
                      {order.status === "PENDING" && (
                        <button
                          disabled={updatingId === order.id}
                          onClick={() => updateOrderStatus(order.id, "CONFIRMED")}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:brightness-110 text-white font-bold text-xs shadow-md transition"
                        >
                          تجهيز واختبار 🛠️
                        </button>
                      )}

                      {order.status === "CONFIRMED" && (
                        <button
                          disabled={updatingId === order.id}
                          onClick={() => updateOrderStatus(order.id, "READY")}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-md transition"
                        >
                          جاهز للشحن 📦
                        </button>
                      )}

                      {(order.status === "READY" || order.status === "CONFIRMED") && (
                        <button
                          onClick={() => {
                            playSound("click");
                            setCourierModalOrder(order);
                            setCourierName(order.courierName || "");
                            setCourierPhone(order.courierPhone || "");
                          }}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 hover:brightness-110 text-white font-bold text-xs shadow-md flex items-center gap-1 transition"
                        >
                          <Bike size={13} />
                          <span>تعيين المندوب 🛵</span>
                        </button>
                      )}

                      {order.status === "SHIPPED" && (
                        <button
                          disabled={updatingId === order.id}
                          onClick={() => updateOrderStatus(order.id, "DELIVERED")}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-black font-bold text-xs shadow-md flex items-center gap-1 transition"
                        >
                          <CheckCircle2 size={13} />
                          <span>تم التسليم والتحصيل ✅</span>
                        </button>
                      )}

                      {!isDelivered && !isCancelled && (
                        <button
                          disabled={updatingId === order.id}
                          onClick={() => {
                            if (confirm("هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟")) {
                              updateOrderStatus(order.id, "CANCELLED");
                            }
                          }}
                          className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/30 text-xs transition"
                          title="إلغاء الطلب"
                        >
                          <XCircle size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Courier Modal */}
      {courierModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#120e1c] border border-pink-500/30 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-pink-300 font-serif mb-3 flex items-center gap-2">
              <Bike size={20} className="text-pink-400" />
              <span>تعيين مندوب الشحن / شركة التوصيل</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              للطلب رقم #{courierModalOrder.orderNumber} — العميل {courierModalOrder.customerName} (
              {courierModalOrder.customerCity})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1 font-medium">اسم المندوب أو شركة الشحن:</label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="مثال: كابتن أحمد / شركة بوسطة إكسبريس"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1 font-medium">رقم هاتف المندوب (اختياري):</label>
                <input
                  type="tel"
                  value={courierPhone}
                  onChange={(e) => setCourierPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Quick courier chips */}
              <div className="pt-2">
                <span className="text-[11px] text-zinc-500 block mb-1.5">اقتراحات سريعة:</span>
                <div className="flex gap-2 flex-wrap">
                  {["بوسطة إكسبريس (Bosta)", "أرامكس (Aramex)", "كابتن أحمد (الأسطول الخاص)", "كابتن محمود"].map(
                    (chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setCourierName(chip)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10.5px] border border-zinc-700"
                      >
                        {chip}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                disabled={savingCourier || !courierName.trim()}
                onClick={handleSaveCourier}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs disabled:opacity-50"
              >
                {savingCourier ? "جاري الحفظ..." : "تأكيد وإسناد الشحنة 🚀"}
              </button>
              <button
                onClick={() => setCourierModalOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zones Information Modal */}
      {zonesModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#120e1c] border border-pink-500/30 rounded-2xl p-6 shadow-2xl relative text-xs">
            <h3 className="text-base font-bold text-pink-300 font-serif mb-3 flex items-center gap-2">
              <MapPin size={20} className="text-pink-400" />
              <span>مناطق وتكلفة التركيب والمعاينة (دي سي سمارت)</span>
            </h3>

            <div className="space-y-2 mt-4">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-zinc-200">القاهرة الكبرى والجيزة</div>
                  <div className="text-[10.5px] text-zinc-400">توصيل خلال 24 ساعة</div>
                </div>
                <div className="font-mono font-bold text-pink-400">50 ج.م</div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-zinc-200">الإسكندرية والبحيرة</div>
                  <div className="text-[10.5px] text-zinc-400">توصيل خلال 48 ساعة</div>
                </div>
                <div className="font-mono font-bold text-pink-400">65 ج.م</div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-zinc-200">مدن القناة والدلتا</div>
                  <div className="text-[10.5px] text-zinc-400">توصيل خلال 48-72 ساعة</div>
                </div>
                <div className="font-mono font-bold text-pink-400">70 ج.م</div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-zinc-200">الصعيد والمحافظات البعيدة</div>
                  <div className="text-[10.5px] text-zinc-400">توصيل خلال 3-4 أيام</div>
                </div>
                <div className="font-mono font-bold text-pink-400">85 ج.م</div>
              </div>

              <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-center font-bold">
                ✨ شحن مجاني لكافة المحافظات لأي طلب بقيمة 1500 ج.م فأكثر ✨
              </div>
            </div>

            <button
              onClick={() => setZonesModalOpen(false)}
              className="w-full mt-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </ErpLayout>
  );
}
