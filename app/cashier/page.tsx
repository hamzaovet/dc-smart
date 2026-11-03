"use client";

import React, { useState, useEffect, useMemo } from "react";
import ErpLayout from "@/components/ErpLayout";
import { printThermalReceipt } from "@/components/ThermalReceipt";
import { playSound } from "@/lib/sounds";
import { useStaff } from "@/context/StaffContext";
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Printer,
  Sparkles,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Tag,
  User,
  Phone,
  Layers,
  MapPin,
  Flame,
} from "lucide-react";

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  brandAr: string;
  brandEn: string;
  price: number;
  originalPrice?: number | null;
  volume: string;
  type: string;
  inStock: boolean;
  stockQuantity: number;
  image: string;
  isWinter?: boolean;
  category?: { nameAr: string };
}

interface TicketItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export default function CashierPage() {
  const { currentUser } = useStaff();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  // Ticket State
  const [ticketItems, setTicketItems] = useState<TicketItem[]>([]);
  const [orderType, setOrderType] = useState<"pos" | "delivery" | "takeaway">("pos");
  const [customerName, setCustomerName] = useState("عميل صالة العرض والمبيعات");
  const [customerPhone, setCustomerPhone] = useState("01000000000");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("القاهرة");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add Item to Ticket
  const handleAddItem = (product: Product) => {
    playSound("add");
    setTicketItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1, unitPrice: product.price }];
    });
  };

  // Adjust Quantity
  const handleUpdateQty = (productId: string, delta: number) => {
    playSound("pop");
    setTicketItems((prev) =>
      prev
        .map((i) => {
          if (i.product.id === productId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as TicketItem[]
    );
  };

  // Remove Item
  const handleRemoveItem = (productId: string) => {
    playSound("trash");
    setTicketItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  // Clear Ticket
  const handleClearTicket = () => {
    playSound("trash");
    setTicketItems([]);
    setDiscountAmount(0);
    setNotes("");
  };

  // Filter Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategory === "كاميرات مراقبة") {
        const isCam = prod.nameAr.includes("كاميرا") || (prod.type || "").toLowerCase().includes("camera") || prod.type === "ORIGINAL";
        if (!isCam) return false;
      }
      if (selectedCategory === "أجهزة تسجيل") {
        const isRec = prod.nameAr.includes("تسجيل") || prod.nameAr.includes("XVR") || prod.nameAr.includes("NVR") || (prod.type || "").toLowerCase().includes("recorder") || prod.type === "TESTER";
        if (!isRec) return false;
      }
      if (selectedCategory === "كابلات وتخزين") {
        const isCab = prod.nameAr.includes("كابل") || prod.nameAr.includes("سلك") || prod.nameAr.includes("هارد") || prod.nameAr.includes("تيرابايت") || prod.nameAr.includes("card") || prod.type === "HIGH_COPY";
        if (!isCab) return false;
      }
      if (selectedCategory === "باور وملحقات") {
        const isPwr = prod.nameAr.includes("باور") || prod.nameAr.includes("محول") || prod.nameAr.includes("راك") || prod.nameAr.includes("جاك") || prod.nameAr.includes("bnc") || prod.type === "INSPIRED";
        if (!isPwr) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName =
          prod.nameAr.toLowerCase().includes(q) || prod.nameEn.toLowerCase().includes(q);
        const matchBrand =
          prod.brandAr.toLowerCase().includes(q) || prod.brandEn.toLowerCase().includes(q);
        return matchName || matchBrand;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Calculations
  const subtotal = useMemo(() => {
    return ticketItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [ticketItems]);

  const activeDeliveryFee = orderType === "delivery" ? (subtotal >= 1500 ? 0 : 50) : 0;
  const totalAmount = Math.max(0, subtotal + activeDeliveryFee - discountAmount);

  // Submit and Print POS Order
  const handleCompleteOrder = async () => {
    if (ticketItems.length === 0) return;
    setSubmitting(true);
    playSound("cash");

    const orderPayload = {
      customerName: customerName.trim() || "عميل صالة العرض والمبيعات",
      customerPhone: customerPhone.trim() || "01000000000",
      customerCity: orderType === "delivery" ? customerCity : "طنطا — المقر الرئيسي",
      customerAddress: orderType === "delivery" ? customerAddress : "استلام مباشر من معرض الشركة",
      orderType,
      cashierName: currentUser?.name || "كاشير دي سي سمارت",
      notes: notes.trim(),
      items: ticketItems.map((item) => ({
        nameAr: item.product.nameAr,
        nameEn: item.product.nameEn,
        quantity: item.quantity,
        price: item.unitPrice,
        volume: item.product.volume,
        type: item.product.type,
      })),
      subtotal,
      deliveryFee: activeDeliveryFee,
      totalAmount,
      paymentMethod,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        // Print 80mm receipt
        printThermalReceipt(data.order);
        // Clear ticket
        setTicketItems([]);
        setDiscountAmount(0);
        setNotes("");
      } else {
        alert(data.error || "فشل إتمام عملية البيع");
      }
    } catch (err) {
      console.error("POS submit error:", err);
      alert("تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ErpLayout activeItem="cashier">
      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-100px)]">
        {/* LEFT / CENTER: Products Grid & Search */}
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/80 border border-cyan-500/20 p-4 rounded-2xl">
            <div>
              <h1 className="text-lg font-black font-serif text-cyan-400 font-bold flex items-center gap-2">
                <span>كاشير نقطة بيع الأنظمة والمهمات الأمنية</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-sans font-bold">
                  POS Retail
                </span>
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                الكاشير: <strong>{currentUser?.name || "المايسترو"}</strong> • اختر الأصناف للبيع الفوري أو الشحن
              </p>
            </div>

            {/* Order Type Tabs */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => {
                  playSound("click");
                  setOrderType("pos");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  orderType === "pos"
                    ? "bg-cyan-500 text-black shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                صالة المعرض
              </button>
              <button
                onClick={() => {
                  playSound("click");
                  setOrderType("delivery");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  orderType === "delivery"
                    ? "bg-cyan-500 text-black shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                توريد وشحن
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث السريع برقم الموديل أو الصنف (مثال: داهوا، هيكفيجن، كابل شبكات، باور سبلاي)..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {["الكل", "كاميرات مراقبة", "أجهزة تسجيل", "كابلات وتخزين", "باور وملحقات"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playSound("click");
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Perfumes Grid */}
          <div className="flex-1 overflow-y-auto pr-1">
            {loading ? (
              <div className="py-20 text-center text-cyan-400">
                <RefreshCw size={28} className="animate-spin mx-auto mb-2" />
                <span className="text-xs">جاري تحميل كتالوج المنتجات...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-zinc-500 text-xs">
                لا توجد أجهزة أو كاميرات مطابقة للبحث
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 pb-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleAddItem(product)}
                    className="group bg-[#0e0b16] rounded-2xl border border-cyan-500/20 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-amber-500/10 p-3 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden"
                  >
                    {/* Thumbnail & Badges */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-2">
                      <img
                        src={product.image}
                        alt={product.nameAr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-black/70 text-cyan-400 backdrop-blur-sm border border-pink-500/30">
                        {product.volume}
                      </span>
                      {product.isWinter && (
                        <span className="absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded-md font-bold bg-cyan-900/70 text-cyan-300 backdrop-blur-sm">
                          🛡️ ضمان عامين
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-[10px] text-cyan-400/90 font-serif font-bold truncate">
                        {product.brandAr}
                      </div>
                      <div className="font-bold text-xs text-zinc-200 line-clamp-2 leading-snug mt-0.5">
                        {product.nameAr}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800">
                      <span className="font-serif font-black text-sm text-cyan-400 font-bold">
                        {product.price} ج.م
                      </span>
                      <button
                        type="button"
                        className="w-7 h-7 rounded-lg bg-pink-500/20 text-cyan-400 group-hover:bg-pink-500 group-hover:text-black flex items-center justify-center transition-colors"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Current Ticket / Bill Pane */}
        <div className="w-full lg:w-[380px] bg-[#0c0914] border border-pink-500/25 rounded-2xl flex flex-col justify-between p-4 shadow-2xl">
          {/* Ticket Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-cyan-400" />
              <span className="font-bold font-serif text-sm text-zinc-100">
                فاتورة البيع الحالية
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-cyan-400 font-mono font-bold">
                {ticketItems.length}
              </span>
            </div>

            {ticketItems.length > 0 && (
              <button
                onClick={handleClearTicket}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition"
              >
                <Trash2 size={13} />
                <span>مسح</span>
              </button>
            )}
          </div>

          {/* Customer Inputs (if delivery) */}
          <div className="py-2.5 space-y-2 border-b border-zinc-800/80 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">العميل:</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200"
                />
              </div>
              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">الهاتف:</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-mono"
                />
              </div>
            </div>

            {orderType === "delivery" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">المحافظة:</label>
                  <input
                    type="text"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">العنوان بالتفصيل:</label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="الشارع ورقم العمارة"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ticket Items List */}
          <div className="flex-1 overflow-y-auto py-2 divide-y divide-zinc-800/60 max-h-[300px] lg:max-h-none">
            {ticketItems.length === 0 ? (
              <div className="py-14 text-center text-zinc-600 text-xs flex flex-col items-center gap-2">
                <ShoppingCart size={32} className="stroke-1 text-zinc-700" />
                <span>الفاتورة فارغة، اضغط على أي صنف أو كاميرا لإضافتها فوراً</span>
              </div>
            ) : (
              ticketItems.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-zinc-200 truncate">
                      {item.product.nameAr}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {item.unitPrice} ج.م × {item.quantity} = {item.unitPrice * item.quantity} ج.م
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
                      <button
                        onClick={() => handleUpdateQty(item.product.id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center font-mono font-bold text-xs text-cyan-400">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.product.id, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-zinc-600 hover:text-red-400 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals & Payment & Action */}
          <div className="pt-3 border-t border-zinc-800 space-y-3">
            {/* Payment Methods */}
            <div>
              <span className="text-[10px] text-zinc-400 block mb-1">طريقة الدفع:</span>
              <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
                {[
                  { id: "CASH", label: "كاش 💵" },
                  { id: "INSTAPAY", label: "إنستاباي 📱" },
                  { id: "VODAFONE_CASH", label: "محفظة 💳" },
                  { id: "VISA", label: "فيزا 💳" },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => {
                      playSound("click");
                      setPaymentMethod(pm.id);
                    }}
                    className={`py-1.5 rounded-lg transition text-center ${
                      paymentMethod === pm.id
                        ? "bg-cyan-500 text-black font-black shadow-md"
                        : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>المجموع الفرعي:</span>
                <span className="font-mono text-zinc-200">{subtotal} ج.م</span>
              </div>
              {orderType === "delivery" && (
                <div className="flex justify-between text-zinc-400">
                  <span>الشحن:</span>
                  <span className="font-mono text-zinc-200">{activeDeliveryFee} ج.م</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-black pt-2 border-t border-zinc-800">
                <span className="text-zinc-200">الإجمالي النهائي:</span>
                <span className="font-serif text-lg text-cyan-400 font-bold">{totalAmount} ج.م</span>
              </div>
            </div>

            {/* Complete & Print Button */}
            <button
              disabled={ticketItems.length === 0 || submitting}
              onClick={handleCompleteOrder}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Printer size={18} />
              <span>{submitting ? "جاري الحفظ..." : "إتمام البيع وطباعة الفاتورة 80mm"}</span>
            </button>
          </div>
        </div>
      </div>
    </ErpLayout>
  );
}
