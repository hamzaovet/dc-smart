"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import SecurityPinModal from "@/components/SecurityPinModal";
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  Trash2,
  Edit2,
  Check,
  X,
  Truck,
  Building2,
  DollarSign,
  Scale,
  Sparkles,
  Layers,
  ArrowRightLeft,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  costPerUnit: number;
  supplier?: string | null;
  createdAt: string;
}

const COMMON_UNITS = [
  "قطعة",
  "لفة 100 متر",
  "لفة (305 متر)",
  "متر",
  "كرتونة",
  "طقم / كيت",
  "بكرة",
  "باكت",
  "حبة",
];

const DEFAULT_CATEGORIES = [
  "كاميرات مراقبة وأجهزة تسجيل",
  "كابلات شبكات ومحاور ومواسير",
  "هارد ديسك وتخزين وراكات",
  "باور سبلاي ومحولات ومهمات كهرباء",
  "شاشات مراقبة وسويتشات PoE وأجهزة شبكات",
  "بوابات أمنية وأجهزة إنذار وسنترالات",
  "مستلزمات واكسسوارات تركيب (بواطات / BNC)",
];

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [suppliersList, setSuppliersList] = useState<any[]>([]);

  // Sync products state
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Add / Edit Item Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [savingItem, setSavingItem] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("كاميرات مراقبة وأجهزة تسجيل");
  const [quantity, setQuantity] = useState("50");
  const [unit, setUnit] = useState("قطعة");
  const [minStock, setMinStock] = useState("10");
  const [costPerUnit, setCostPerUnit] = useState("0");
  const [supplier, setSupplier] = useState("");

  // Quick Adjust Modal
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("10");

  // Security PIN Modal
  const [pinAction, setPinAction] = useState<(() => void) | null>(null);
  const [isPinOpen, setIsPinOpen] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("/api/suppliers");
      const data = await res.json();
      if (data.suppliers) setSuppliersList(data.suppliers);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncFromShowroom = async () => {
    setSyncing(true);
    setSyncResult(null);
    playSound("click");
    try {
      const res = await fetch("/api/inventory/sync-products", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setSyncResult(data.message);
        fetchItems();
      } else {
        alert(data.error || "فشل مزامنة المنتجات");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName("");
    setCategory("كاميرات مراقبة وأجهزة تسجيل");
    setQuantity("50");
    setUnit("قطعة");
    setMinStock("10");
    setCostPerUnit("0");
    setSupplier("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setPinAction(() => () => {
      setEditingItem(item);
      setName(item.name);
      setCategory(item.category);
      setQuantity(item.quantity.toString());
      setUnit(item.unit || "قطعة");
      setMinStock(item.minStock.toString());
      setCostPerUnit(item.costPerUnit.toString());
      setSupplier(item.supplier || "");
      setIsModalOpen(true);
    });
    setIsPinOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingItem(true);
    playSound("click");

    try {
      if (editingItem) {
        const res = await fetch(`/api/inventory/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            category: category.trim(),
            quantity: Number(quantity) || 0,
            unit: unit.trim() || "قطعة",
            minStock: Number(minStock) || 10,
            costPerUnit: Number(costPerUnit) || 0,
            supplier: supplier.trim() || null,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          playSound("success");
          setItems((prev) =>
            prev.map((i) => (i.id === editingItem.id ? data.item : i))
          );
          setIsModalOpen(false);
        } else {
          alert(data.error || "فشل تعديل الصنف");
        }
      } else {
        const res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            category: category.trim(),
            quantity: Number(quantity) || 0,
            unit: unit.trim() || "قطعة",
            minStock: Number(minStock) || 10,
            costPerUnit: Number(costPerUnit) || 0,
            supplier: supplier.trim() || null,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          playSound("success");
          setItems((prev) => [data.item, ...prev]);
          setIsModalOpen(false);
        } else {
          alert(data.error || "فشل إضافة الصنف");
        }
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحفظ");
    } finally {
      setSavingItem(false);
    }
  };

  const handleQuickAdjust = async (id: string, delta: number) => {
    playSound("pop");
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adjustQuantity: delta }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = (id: string, itemName: string) => {
    setPinAction(() => async () => {
      if (!confirm(`هل أنت متأكد من حذف الصنف (${itemName}) نهائياً من المخزون؟`)) return;
      playSound("trash");
      try {
        const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
        if (res.ok) {
          playSound("success");
          setItems((prev) => prev.filter((i) => i.id !== id));
        }
      } catch (err) {
        console.error(err);
      }
    });
    setIsPinOpen(true);
  };

  // Calculations
  const lowStockCount = items.filter((i) => i.quantity <= i.minStock).length;
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.costPerUnit, 0);

  // Available unique categories
  const categoriesInStock = Array.from(new Set(items.map((i) => i.category))).filter(Boolean);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== "الكل" && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchSup = (item.supplier || "").toLowerCase().includes(q);
      return matchName || matchSup;
    }
    return true;
  });

  return (
    <ErpLayout activeItem="inventory">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-cyan-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Package size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold font-serif text-cyan-400">
                المخزون وحركة الأصناف وتجهيزات الأنظمة الأمنية
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                متابعة أرصدة الكاميرات، أجهزة التسجيل، كابلات الشبكات والمحاور، وحدات التخزين، ومهمات التركيب والباور سبلاي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncFromShowroom}
              disabled={syncing}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition disabled:opacity-50"
            >
              <ArrowRightLeft size={15} className={syncing ? "animate-spin" : ""} />
              <span>{syncing ? "جاري المزامنة..." : "مزامنة منتجات المعرض إلى المخزون (158 صنف)"}</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
            >
              <Plus size={16} />
              <span>إضافة صنف مخزني جديد</span>
            </button>
          </div>
        </div>

        {/* Sync Success Banner */}
        {syncResult && (
          <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-cyan-400" />
              <span>{syncResult}</span>
            </div>
            <button onClick={() => setSyncResult(null)} className="text-zinc-400 hover:text-white">
              <X size={15} />
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">إجمالي الأصناف بالمخزن</span>
              <h3 className="text-2xl font-black font-mono text-zinc-100 mt-1">
                {items.length} <span className="text-xs font-normal text-zinc-400 font-sans">صنف</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Package size={20} />
            </div>
          </div>

          <div className="bg-[#0c0914] border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">أصناف قاربت على النفاد</span>
              <h3 className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {lowStockCount} <span className="text-xs font-normal text-zinc-400 font-sans">أصناف</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <AlertTriangle size={20} />
            </div>
          </div>

          <div className="bg-[#0c0914] border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">القيمة التقديرية للمخزون</span>
              <h3 className="text-2xl font-black font-mono text-cyan-300 mt-1">
                {totalValue.toLocaleString()} <span className="text-xs font-normal text-zinc-400 font-sans">ج.م</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* Categories Pills & Search */}
        <div className="space-y-3">
          <div className="relative w-full">
            <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث باسم الصنف، الموديل، أو المورد..."
              className="w-full pl-3 pr-9 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory("الكل")}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                selectedCategory === "الكل"
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              الكل ({items.length})
            </button>
            {categoriesInStock.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Items List */}
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-cyan-400" />
            <span>جاري استرجاع أصناف المخزون...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs bg-zinc-900/40 border border-zinc-800 rounded-2xl">
            لا توجد أصناف مخزنية مطابقة. يمكنك الضغط على زر "مزامنة منتجات المعرض" لجلب كافة الأصناف فوراً!
          </div>
        ) : (
          <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">اسم الصنف / الموديل</th>
                    <th className="py-3 px-4">التصنيف</th>
                    <th className="py-3 px-4">الرصيد المتاح</th>
                    <th className="py-3 px-4">وحدة القياس</th>
                    <th className="py-3 px-4">سعر التكلفة (ج.م)</th>
                    <th className="py-3 px-4">إجمالي القيمة</th>
                    <th className="py-3 px-4">المورد / الموزع</th>
                    <th className="py-3 px-4 text-center">تعديل سريع</th>
                    <th className="py-3 px-4 text-center">إجراءات 🔒</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredItems.map((item) => {
                    const isLow = item.quantity <= item.minStock;
                    const itemVal = item.quantity * item.costPerUnit;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-zinc-900/40 transition-colors ${
                          isLow ? "bg-amber-500/5" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-zinc-200">
                          <div className="flex items-center gap-2">
                            {isLow && (
                              <span title="قارب على النفاد" className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                            )}
                            <span>{item.name}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-zinc-400">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
                            {item.category}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold">
                          <span className={isLow ? "text-amber-400" : "text-emerald-400"}>
                            {item.quantity}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-zinc-400 font-medium">
                          {item.unit}
                        </td>

                        <td className="py-3 px-4 font-mono text-zinc-300">
                          {item.costPerUnit.toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                          {itemVal.toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4 text-zinc-400">
                          {item.supplier || "—"}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleQuickAdjust(item.id, -1)}
                              title="خصم 1"
                              className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono font-bold flex items-center justify-center"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleQuickAdjust(item.id, 1)}
                              title="إضافة 1"
                              className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 font-mono font-bold flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              title="تعديل الصنف كاملاً (محمي بالباسورد)"
                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              title="حذف الصنف (محمي بالباسورد)"
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

        {/* Add / Edit Item Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1422] border border-cyan-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-fadeIn text-right text-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute left-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>

              <h3 className="font-bold text-base text-cyan-400 mb-4 flex items-center gap-2">
                <Package size={18} />
                <span>{editingItem ? "تعديل الصنف المخزني" : "إضافة صنف أو خامة جديدة للمخزن"}</span>
              </h3>

              <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم الصنف أو كود الموديل *:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: لفة سلك rg 174 100y blue star / كاميرا داهوا 2 ميجا"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">التصنيف (اختر أو اكتب جديد):</label>
                    <input
                      type="text"
                      list="category-suggestions"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="اكتب تصنيف جديد أو اختر..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyan-500"
                    />
                    <datalist id="category-suggestions">
                      {DEFAULT_CATEGORIES.map((c) => (
                        <option key={c} value={c} />
                      ))}
                      {categoriesInStock.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">وحدة القياس (اكتب أو اختر):</label>
                    <input
                      type="text"
                      list="unit-suggestions"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="مثال: لفة 100 متر / قطعة..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyan-500"
                    />
                    <datalist id="unit-suggestions">
                      {COMMON_UNITS.map((u) => (
                        <option key={u} value={u} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">الرصيد الفعلي:</label>
                    <input
                      type="number"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">حد التنبيه (النواقص):</label>
                    <input
                      type="number"
                      value={minStock}
                      onChange={(e) => setMinStock(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">تكلفة الشراء (ج.م):</label>
                    <input
                      type="number"
                      value={costPerUnit}
                      onChange={(e) => setCostPerUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">المورد أو جهة التوريد:</label>
                  <input
                    type="text"
                    list="suppliers-suggestions"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    placeholder="اختر أو اكتب اسم المورد..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyan-500"
                  />
                  <datalist id="suppliers-suggestions">
                    {suppliersList.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.company || s.category})
                      </option>
                    ))}
                  </datalist>
                </div>

                <div className="flex gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={savingItem}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-bold text-xs"
                  >
                    {savingItem ? "جاري الحفظ..." : editingItem ? "حفظ التعديلات" : "إضافة الصنف للمخزن"}
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
          actionDescription="تعديل أو حذف أصناف المخزون يتطلب إدخال رمز أمان الإدارة."
        />
      </div>
    </ErpLayout>
  );
}
