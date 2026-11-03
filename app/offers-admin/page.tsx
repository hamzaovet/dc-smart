"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import { useStaff } from "@/context/StaffContext";
import {
  Gift,
  Plus,
  Percent,
  Tag,
  Sparkles,
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  Search,
  X,
  Package,
  Layers,
  Clock,
  ArrowRight,
  TrendingDown,
} from "lucide-react";

interface Promotion {
  id: string;
  titleAr: string;
  titleEn: string;
  type: string;
  discountValue: number;
  badgeText?: string | null;
  applicableProductIds?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isActive: boolean;
  bannerImage?: string | null;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  createdAt: string;
}

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  category: string;
}

export default function OffersAdminPage() {
  const { currentUser } = useStaff();
  const [offers, setOffers] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [type, setType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("15");
  const [badgeText, setBadgeText] = useState("عرض خاص 🔥");
  const [targetScope, setTargetScope] = useState<"ALL" | "CUSTOM">("ALL");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resOffers, resProds] = await Promise.all([
        fetch("/api/offers"),
        fetch("/api/products"),
      ]);
      const dataOffers = await resOffers.json();
      const dataProds = await resProds.json();

      setOffers(dataOffers.offers || []);
      setProducts(dataProds.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim()) return;

    setSaving(true);
    playSound("click");

    try {
      const applicableIds =
        targetScope === "ALL" ? "ALL" : JSON.stringify(selectedProductIds);

      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleAr,
          titleEn: titleEn || titleAr,
          type,
          discountValue: Number(discountValue) || 0,
          badgeText,
          applicableProductIds: applicableIds,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
          isActive,
          descriptionAr,
          descriptionEn,
        }),
      });

      const data = await res.json();
      if (data.success && data.offer) {
        setOffers([data.offer, ...offers]);
        playSound("success");
        setIsAddOpen(false);
        resetForm();
      } else {
        alert(data.error || "فشل حفظ العرض");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ العرض");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setTitleAr("");
    setTitleEn("");
    setType("PERCENTAGE");
    setDiscountValue("15");
    setBadgeText("عرض خاص 🔥");
    setTargetScope("ALL");
    setSelectedProductIds([]);
    setStartDate("");
    setEndDate("");
    setIsActive(true);
    setDescriptionAr("");
    setDescriptionEn("");
  };

  const toggleOfferStatus = async (id: string, currentStatus: boolean) => {
    playSound("click");
    // Optimistic update
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !currentStatus } : o))
    );

    try {
      await fetch(`/api/offers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
    } catch (err) {
      console.error(err);
      fetchData(); // Rollback
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العرض نهائياً؟")) return;
    playSound("click");

    setOffers((prev) => prev.filter((o) => o.id !== id));

    try {
      await fetch(`/api/offers/${id}`, { method: "DELETE" });
      playSound("trash");
    } catch (err) {
      console.error(err);
      fetchData();
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // KPIs
  const totalOffers = offers.length;
  const activeOffers = offers.filter((o) => o.isActive).length;
  const percentageOffers = offers.filter((o) => o.type === "PERCENTAGE").length;
  const bogoBundlesOffers = offers.filter(
    (o) => o.type === "BOGO" || o.type === "BUNDLE"
  ).length;

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (offer.badgeText &&
        offer.badgeText.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType =
      filterType === "ALL"
        ? true
        : filterType === "ACTIVE"
        ? offer.isActive
        : filterType === "INACTIVE"
        ? !offer.isActive
        : offer.type === filterType;
    return matchesSearch && matchesType;
  });

  const getProductNames = (rawIds?: string | null) => {
    if (!rawIds || rawIds === "ALL") return "كافة الأصناف في الكتالوج";
    try {
      const parsed: string[] = JSON.parse(rawIds);
      if (!Array.isArray(parsed) || parsed.length === 0)
        return "كافة الأصناف في الكتالوج";
      const names = parsed
        .map((id) => products.find((p) => p.id === id)?.nameAr)
        .filter(Boolean);
      return names.length > 0 ? names.join("، ") : "أصناف محددة";
    } catch {
      return "أصناف محددة";
    }
  };

  return (
    <ErpLayout activeItem="offers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-l from-amber-500/10 via-zinc-900/80 to-zinc-950 p-6 rounded-2xl border border-pink-500/20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                نظام العروض والخصومات الذكية
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 font-medium">
                  Rovy Promotions
                </span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                إدارة حملات التخفيضات، خصومات النسبة، عروض 1+1 مجاناً، وباقات
                الشتاء المجمعة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playSound("click");
                fetchData();
              }}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-pink-400 transition"
              title="تحديث البيانات"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={() => {
                playSound("click");
                setIsAddOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              إنشاء عرض أو خصم جديد
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                إجمالي العروض
              </span>
              <Gift className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {totalOffers}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              حملات مسجلة بالنظام
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                عروض مفعلة حالياً
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-2">
              {activeOffers}
            </div>
            <div className="text-[11px] text-emerald-500/70 mt-1">
              تظهر للعملاء في المتجر
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                خصومات نسبة مئوية
              </span>
              <Percent className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-400 mt-2">
              {percentageOffers}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">تخفيض مباشر %</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">
                عروض هدايا وباقات
              </span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-400 mt-2">
              {bogoBundlesOffers}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              1+1 أو باقات مجمعة
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث في عنوان العرض أو البادج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {[
              { id: "ALL", label: "الكل" },
              { id: "ACTIVE", label: "المفعلة فقط" },
              { id: "INACTIVE", label: "المعطلة" },
              { id: "PERCENTAGE", label: "نسبة %" },
              { id: "FIXED", label: "خصم نقدي" },
              { id: "BOGO", label: "1+1 مجاناً" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playSound("click");
                  setFilterType(tab.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  filterType === tab.id
                    ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                    : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Offers Grid */}
        {filteredOffers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
            <Gift className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-300">
              لا توجد عروض تطابق البحث
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              قم بإنشاء عرض ترويجي جديد مثل عروض بكجات 4 كاميرات كاملة بالتركيب، أو خصومات أجهزة التسجيل
              على عينة مجانية
            </p>
            <button
              onClick={() => {
                playSound("click");
                setIsAddOpen(true);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold hover:bg-pink-500/30 transition"
            >
              + إنشاء أول عرض الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                  offer.isActive
                    ? "bg-zinc-900/80 border-pink-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                    : "bg-zinc-950/60 border-zinc-800/80 opacity-70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-pink-400" />
                      {offer.badgeText || "عرض ترويجي"}
                    </span>
                    <button
                      onClick={() =>
                        toggleOfferStatus(offer.id, offer.isActive)
                      }
                      className={`text-xs px-2.5 py-1 rounded-full font-bold transition flex items-center gap-1.5 ${
                        offer.isActive
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white"
                      }`}
                    >
                      {offer.isActive ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          مفعل
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          معطل
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">
                    {offer.titleAr}
                  </h3>
                  {offer.titleEn && (
                    <p className="text-xs text-zinc-500 mb-3">{offer.titleEn}</p>
                  )}

                  <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">نوع الخصم:</span>
                      <span className="font-bold text-pink-400">
                        {offer.type === "PERCENTAGE"
                          ? `خصم ${offer.discountValue}%`
                          : offer.type === "FIXED"
                          ? `خصم نقدي ${offer.discountValue} ج.م`
                          : offer.type === "BOGO"
                          ? "قطعة عليها قطعة مجاناً (1+1)"
                          : offer.type === "BUNDLE"
                          ? "باقة شتوية مجمعة"
                          : "عرض خاص"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between text-xs pt-1 border-t border-zinc-800/60">
                      <span className="text-zinc-400 shrink-0">يطبق على:</span>
                      <span className="text-zinc-300 text-left line-clamp-2 pr-2 font-medium">
                        {getProductNames(offer.applicableProductIds)}
                      </span>
                    </div>

                    {offer.descriptionAr && (
                      <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60 italic">
                        &quot;{offer.descriptionAr}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(offer.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteOffer(offer.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="حذف العرض"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add Offer */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-zinc-900 border border-pink-500/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8">
              <button
                onClick={() => {
                  playSound("click");
                  setIsAddOpen(false);
                }}
                className="absolute top-4 left-4 p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-800/50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    إنشاء عرض أو خصم ترويجي جديد
                  </h3>
                  <p className="text-xs text-zinc-400">
                    حدد تفاصيل التخفيض، البادج، والأصناف المشمولة في العرض
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateOffer} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      عنوان العرض (عربي) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: خصم الشتاء الفاخر"
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      عنوان العرض (إنجليزي)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Winter Luxury Offer"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      نوع العرض الترويجي
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="PERCENTAGE">نسبة مئوية (%)</option>
                      <option value="FIXED">خصم نقدي ثابت (ج.م)</option>
                      <option value="BOGO">قطعة عليها قطعة مجاناً (1+1)</option>
                      <option value="BUNDLE">باقة منظومة مراقبة متكاملة (CCTV Bundle System)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      {type === "PERCENTAGE"
                        ? "نسبة الخصم (%)"
                        : type === "FIXED"
                        ? "قيمة الخصم (ج.م)"
                        : "قيمة الوفر التقديري (ج.م)"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                {/* Badge text & Suggestions */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    نص البادج الترويجي (Badge Text)
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="مثال: خصم 20% 🔥"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      "عرض خاص 🔥",
                      "خصم الشتاء ❄️",
                      "1+1 مجاناً 🎁",
                      "عرض محدود ⏳",
                      "الأكثر طلباً ⭐",
                    ].map((badge) => (
                      <button
                        type="button"
                        key={badge}
                        onClick={() => setBadgeText(badge)}
                        className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                      >
                        {badge}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Scope */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <label className="block text-xs font-medium text-zinc-400">
                    تطبيق العرض على:
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="radio"
                        name="targetScope"
                        checked={targetScope === "ALL"}
                        onChange={() => setTargetScope("ALL")}
                        className="accent-amber-500"
                      />
                      كافة الأصناف في الكتالوج
                    </label>
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="radio"
                        name="targetScope"
                        checked={targetScope === "CUSTOM"}
                        onChange={() => setTargetScope("CUSTOM")}
                        className="accent-amber-500"
                      />
                      أصناف محددة فقط
                    </label>
                  </div>

                  {targetScope === "CUSTOM" && (
                    <div className="max-h-36 overflow-y-auto space-y-1 pr-1 border-t border-zinc-800 pt-2">
                      {products.map((prod) => (
                        <label
                          key={prod.id}
                          className="flex items-center justify-between p-1.5 rounded hover:bg-zinc-900 cursor-pointer text-xs"
                        >
                          <span className="text-zinc-300">{prod.nameAr}</span>
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(prod.id)}
                            onChange={() => toggleProductSelection(prod.id)}
                            className="accent-amber-500"
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    وصف أو شروط العرض (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    placeholder="مثال: يطبق الخصم تلقائياً عند إتمام الطلب، ويشمل عبوات 100 مل..."
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="accent-amber-500"
                    />
                    تفعيل العرض فوراً في المتجر
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-zinc-950 bg-pink-400 hover:bg-amber-300 transition shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50"
                    >
                      {saving ? "جاري الحفظ..." : "حفظ العرض"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErpLayout>
  );
}
