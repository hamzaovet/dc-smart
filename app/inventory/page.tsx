"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import {
  Package,
  Plus,
  Search,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  Trash2,
  Check,
  X,
  Truck,
  Building2,
  DollarSign,
  Scale,
  Sparkles,
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

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [suppliersList, setSuppliersList] = useState<any[]>([]);

  // Add Item Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("كاميرات مراقبة");
  const [quantity, setQuantity] = useState("50");
  const [unit, setUnit] = useState("قطعة");
  const [minStock, setMinStock] = useState("20");
  const [costPerUnit, setCostPerUnit] = useState("45");
  const [supplier, setSupplier] = useState("");

  // Quick Adjust Modal
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("10");

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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingItem(true);
    playSound("click");

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          category,
          quantity: Number(quantity) || 0,
          unit,
          minStock: Number(minStock) || 10,
          costPerUnit: Number(costPerUnit) || 0,
          supplier: supplier.trim() || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setItems((prev) => [data.item, ...prev]);
        setIsAddOpen(false);
        setName("");
      } else {
        alert(data.error || "فشل إضافة الصنف");
      }
    } catch (err) {
      console.error(err);
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

  const handleDeleteItem = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف من المخزن؟")) return;
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
  };

  // Calculations
  const lowStockCount = items.filter((i) => i.quantity <= i.minStock).length;
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.costPerUnit, 0);

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

  const categoriesList = [
    "الكل",
    "كاميرات مراقبة",
    "أجهزة تسجيل XVR و NVR",
    "كابلات شبكات ومحاور",
    "هارد ديسك وتخزين",
    "باور سبلاي ومحولات",
    "راكات ومستلزمات تجميع",
  ];

  return (
    <ErpLayout activeItem="inventory">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-cyan-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Package size={22} />
            </span>
            <div>
              <h1 className="text-xl font-black font-serif text-cyan-400 font-bold">
                المخزون وحركة الأصناف وتجهيزات الأنظمة الأمنية
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                متابعة أرصدة الكاميرات، أجهزة التسجيل، كابلات الشبكات والمحاور، وحدات التخزين، ومهمات التركيب والباور سبلاي
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
            <span>إضافة صنف مخزني جديد</span>
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0e0b16] border border-cyan-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">إجمالي الأصناف بالمخزن</span>
              <div className="font-serif font-black text-2xl text-zinc-100 mt-1">
                {items.length} صنف
              </div>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Package size={24} />
            </div>
          </div>

          <div className="bg-[#0e0b16] border border-cyan-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">أصناف قاربت على النفاد</span>
              <div
                className={`font-serif font-black text-2xl mt-1 ${
                  lowStockCount > 0 ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {lowStockCount} أصناف
              </div>
            </div>
            <div
              className={`p-3 rounded-xl ${
                lowStockCount > 0
                  ? "bg-red-500/10 text-red-400 animate-pulse"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <AlertTriangle size={24} />
            </div>
          </div>

          <div className="bg-[#0e0b16] border border-cyan-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">القيمة التقديرية للمخزون</span>
              <div className="font-serif font-black text-2xl text-cyan-400 font-bold mt-1">
                {totalValue.toLocaleString()} ج.م
              </div>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        {/* Search & Responsive Category Filter Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث باسم الصنف، الموديل، أو المورد..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 shadow-inner"
              />
            </div>
            <div className="text-xs text-zinc-400 font-medium self-end sm:self-center">
              عرض <strong className="text-cyan-400 font-mono">{filteredItems.length}</strong> من أصل <strong className="text-zinc-200 font-mono">{items.length}</strong> صنف
            </div>
          </div>

          {/* Full-width scrollable category pills - Never Cut Off */}
          <div className="w-full overflow-x-auto pb-2 pt-1 scrollbar-thin">
            <div className="flex items-center gap-2 min-w-max">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    playSound("click");
                    setSelectedCategory(cat);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                    selectedCategory === cat
                      ? "bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/25"
                      : "bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Items Table */}
        {loading ? (
          <div className="py-20 text-center text-cyan-400">
            <RefreshCw size={28} className="animate-spin mx-auto mb-2" />
            <span className="text-xs">جاري تحميل سجلات المخزون...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 text-xs bg-zinc-900/30 rounded-2xl border border-zinc-800">
            لا توجد أصناف مخزنية مطابقة
          </div>
        ) : (
          <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">الصنف المخزني</th>
                    <th className="py-3 px-4">التصنيف</th>
                    <th className="py-3 px-4">الرصيد المتاح</th>
                    <th className="py-3 px-4">حد التنبيه</th>
                    <th className="py-3 px-4">تكلفة الوحدة</th>
                    <th className="py-3 px-4">إجمالي القيمة</th>
                    <th className="py-3 px-4">المورد المعتمد</th>
                    <th className="py-3 px-4 text-center">تعديل سريع</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredItems.map((item) => {
                    const isLow = item.quantity <= item.minStock;
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-zinc-900/40 transition-colors ${
                          isLow ? "bg-red-950/15" : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-zinc-200">
                          <div>{item.name}</div>
                          {isLow && (
                            <span className="inline-flex items-center gap-1 text-[9.5px] text-red-400 font-bold mt-0.5">
                              <AlertTriangle size={10} />
                              <span>المخزون قارب على النفاد!</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {item.category}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`font-mono font-black text-sm ${
                              isLow ? "text-red-400" : "text-cyan-400"
                            }`}
                          >
                            {item.quantity} {item.unit}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-zinc-500">
                          {item.minStock} {item.unit}
                        </td>

                        <td className="py-3 px-4 font-mono text-zinc-300">
                          {item.costPerUnit} ج.م
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-pink-300">
                          {(item.quantity * item.costPerUnit).toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4 text-zinc-400 text-[11px]">
                          {item.supplier || "—"}
                        </td>

                        {/* Quick stock adjustments (+10, -5) */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleQuickAdjust(item.id, -5)}
                              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] font-bold"
                              title="خصم 5 وحدات"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => handleQuickAdjust(item.id, 10)}
                              className="px-2 py-1 rounded bg-pink-500/20 hover:bg-pink-500/30 text-cyan-400 text-[10px] font-bold border border-cyan-500/30"
                              title="إضافة 10 وحدات"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => handleQuickAdjust(item.id, 50)}
                              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold"
                              title="إضافة 50 وحدة (توريد)"
                            >
                              +50
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-900/50 text-red-400 transition"
                            title="حذف الصنف"
                          >
                            <Trash2 size={13} />
                          </button>
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

      {/* Add Item Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#120e1c] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-pink-300 font-serif flex items-center gap-2">
                <Package size={18} />
                <span>إضافة صنف جديد للمخزون</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">اسم الصنف أو المادة الخام:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: كاميرا داهوا خارجي 2 ميجا / هارد 1 تيرا سيجيت / لفة سلك 305 متر"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">التصنيف:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="كاميرات مراقبة">كاميرات مراقبة (داهوا / هيكفيجن / يوني آرك)</option>
                    <option value="أجهزة تسجيل XVR و NVR">أجهزة تسجيل XVR و NVR</option>
                    <option value="كابلات شبكات ومحاور">كابلات شبكات ومحاور ووصلات BNC</option>
                    <option value="هارد ديسك وتخزين">هارد ديسك وتخزين وراكات تجميع RACK</option>
                    <option value="باور سبلاي ومحولات">باور سبلاي ومحولات ومستلزمات كهرباء</option>
                    <option value="راكات ومستلزمات تجميع">راكات ومستلزمات تجميع وشاشات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">وحدة القياس:</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="قطعة">قطعة</option>
                    <option value="جرام">جرام</option>
                    <option value="تولة">تولة</option>
                    <option value="لتر">لتر</option>
                    <option value="بوكس">بوكس</option>
                    <option value="كرتونة">كرتونة</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">الكمية الحالية:</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">حد التنبيه:</label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">سعر التكلفة (ج.م):</label>
                  <input
                    type="number"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-zinc-300 font-medium">المورد أو جهة التوريد:</label>
                  <span className="text-[10px] text-cyan-400 font-bold">اختر من المسجلين أو اكتب اسماً جديداً</span>
                </div>
                <input
                  type="text"
                  list="registered-suppliers-list"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="مثال: الشركة الهندسية لتوزيع أنظمة داهوا / هيكفيجن"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
                <datalist id="registered-suppliers-list">
                  {suppliersList.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.company ? `${s.company} • ` : ""}{s.category})
                    </option>
                  ))}
                </datalist>
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={savingItem}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs"
                >
                  {savingItem ? "جاري الإضافة..." : "حفظ في المخزن 📦"}
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
