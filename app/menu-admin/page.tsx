"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import ImageUploader from "@/components/ImageUploader";
import { playSound } from "@/lib/sounds";
import {
  Layers,
  Plus,
  Search,
  Edit3,
  Trash2,
  Check,
  X,
  RefreshCw,
  Sparkles,
  Tag,
  Eye,
  Sliders,
  DollarSign,
  Package,
  FolderTree,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
} from "lucide-react";

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  icon?: string | null;
  image?: string | null;
  sortOrder: number;
  _count?: {
    products: number;
  };
}

interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  brandAr: string;
  brandEn: string;
  categoryId: string;
  category?: Category | null;
  price: number;
  originalPrice?: number | null;
  discountPercent: number;
  volume: string;
  concentration: string;
  type: string;
  inStock: boolean;
  stockQuantity: number;
  isWinter: boolean;
  isFeatured: boolean;
  topNotesAr: string;
  topNotesEn: string;
  heartNotesAr: string;
  heartNotesEn: string;
  baseNotesAr: string;
  baseNotesEn: string;
  descriptionAr: string;
  descriptionEn: string;
  ingredientsAr?: string | null;
  image: string;
}

export default function MenuAdminPage() {
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("الكل");
  const [filterCategory, setFilterCategory] = useState("الكل");

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Product Form State
  const [formNameAr, setFormNameAr] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formBrandAr, setFormBrandAr] = useState("داهوا | Dahua Security");
  const [formBrandEn, setFormBrandEn] = useState("Dahua Security");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formPrice, setFormPrice] = useState("1200");
  const [formOriginalPrice, setFormOriginalPrice] = useState("1500");
  const [formVolume, setFormVolume] = useState("100 ml");
  const [formConcentration, setFormConcentration] = useState("خارجي Outdoor IP67");
  const [formType, setFormType] = useState("ORIGINAL");
  const [formStockQty, setFormStockQty] = useState("50");
  const [formIsWinter, setFormIsWinter] = useState(false);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formTopNotesAr, setFormTopNotesAr] = useState("القطع كاملة مع أداة التركيب والكتالوج");
  const [formTopNotesEn, setFormTopNotesEn] = useState("Complete pieces, tools & building guide");
  const [formHeartNotesAr, setFormHeartNotesAr] = useState("خامات آمنة عالية الدقة سهلة التركيب");
  const [formHeartNotesEn, setFormHeartNotesEn] = useState("Safe high-precision easy assembly materials");
  const [formBaseNotesAr, setFormBaseNotesAr] = useState("تحفة ديكورية أنيقة تزين غرفتك ومكتبك");
  const [formBaseNotesEn, setFormBaseNotesEn] = useState("Cute aesthetic decor piece for your space");
  const [formDescAr, setFormDescAr] = useState("منتج أصلي معتمد بمواصفات عالية الجودة وضمان عامين من دي سي سمارت.");
  const [formDescEn, setFormDescEn] = useState("Authentic certified security equipment from DC Smart.");
  const [formImage, setFormImage] = useState("https://i.ibb.co/vzG70GZ/nano-stitch.jpg");

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catNameAr, setCatNameAr] = useState("");
  const [catNameEn, setCatNameEn] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDescAr, setCatDescAr] = useState("");
  const [catDescEn, setCatDescEn] = useState("");
  const [catIcon, setCatIcon] = useState("✨");
  const [catSortOrder, setCatSortOrder] = useState("0");
  const [catImage, setCatImage] = useState("");
  const [savingCat, setSavingCat] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProd, resCat] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const dataProd = await resProd.json();
      const dataCat = await resCat.json();

      setProducts(dataProd.products || []);
      setCategories(dataCat.categories || []);

      if (dataCat.categories && dataCat.categories.length > 0 && !formCategoryId) {
        setFormCategoryId(dataCat.categories[0].id);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Product Handlers
  const handleOpenAdd = () => {
    playSound("click");
    setEditingProduct(null);
    setFormNameAr("");
    setFormNameEn("");
    setFormBrandAr("داهوا | Dahua Security");
    setFormBrandEn("Dahua Security");
    setFormCategoryId(categories[0]?.id || "");
    setFormPrice("1250");
    setFormOriginalPrice("1600");
    setFormVolume("100 ml");
    setFormConcentration("خارجي Outdoor IP67");
    setFormType("ORIGINAL");
    setFormStockQty("50");
    setFormIsWinter(false);
    setFormIsFeatured(false);
    setFormTopNotesAr("القطع كاملة مع أداة التركيب والكتالوج");
    setFormTopNotesEn("Complete pieces, tools & building guide");
    setFormHeartNotesAr("خامات آمنة عالية الدقة سهلة التركيب");
    setFormHeartNotesEn("Safe high-precision easy assembly materials");
    setFormBaseNotesAr("تحفة ديكورية أنيقة تزين غرفتك ومكتبك");
    setFormBaseNotesEn("Cute aesthetic decor piece for your space");
    setFormDescAr("منتج أصلي معتمد بمواصفات عالية الجودة وضمان عامين من دي سي سمارت.");
    setFormDescEn("Authentic certified security equipment from DC Smart.");
    setFormImage("https://i.ibb.co/vzG70GZ/nano-stitch.jpg");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    playSound("click");
    setEditingProduct(p);
    setFormNameAr(p.nameAr);
    setFormNameEn(p.nameEn);
    setFormBrandAr(p.brandAr);
    setFormBrandEn(p.brandEn);
    setFormCategoryId(p.categoryId || categories[0]?.id || "");
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice ? p.originalPrice.toString() : "");
    setFormVolume(p.volume);
    setFormConcentration(p.concentration);
    setFormType(p.type);
    setFormStockQty(p.stockQuantity.toString());
    setFormIsWinter(p.isWinter);
    setFormIsFeatured(p.isFeatured);
    setFormTopNotesAr(p.topNotesAr);
    setFormTopNotesEn(p.topNotesEn);
    setFormHeartNotesAr(p.heartNotesAr);
    setFormHeartNotesEn(p.heartNotesEn);
    setFormBaseNotesAr(p.baseNotesAr);
    setFormBaseNotesEn(p.baseNotesEn);
    setFormDescAr(p.descriptionAr);
    setFormDescEn(p.descriptionEn);
    setFormImage(p.image);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameAr.trim() || !formPrice) return;

    setSaving(true);
    playSound("click");

    const payload = {
      nameAr: formNameAr,
      nameEn: formNameEn || formNameAr,
      brandAr: formBrandAr,
      brandEn: formBrandEn,
      categoryId: formCategoryId,
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : null,
      volume: formVolume,
      concentration: formConcentration,
      type: formType,
      stockQuantity: Number(formStockQty) || 50,
      isWinter: formIsWinter,
      isFeatured: formIsFeatured,
      topNotesAr: formTopNotesAr,
      topNotesEn: formTopNotesEn,
      heartNotesAr: formHeartNotesAr,
      heartNotesEn: formHeartNotesEn,
      baseNotesAr: formBaseNotesAr,
      baseNotesEn: formBaseNotesEn,
      descriptionAr: formDescAr,
      descriptionEn: formDescEn,
      image: formImage,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          playSound("success");
          setIsModalOpen(false);
          fetchData();
        } else {
          alert(data.error || "فشل تعديل بيانات الصنف");
        }
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          playSound("success");
          setIsModalOpen(false);
          fetchData();
        } else {
          alert(data.error || "فشل إضافة الصنف للكتالوج");
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("حدث خطأ أثناء حفظ بيانات الصنف");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStock = async (product: Product) => {
    playSound("click");
    const nextStock = !product.inStock;

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, inStock: nextStock } : p))
    );

    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: nextStock }),
      });
    } catch (err) {
      console.error("Toggle stock error:", err);
      fetchData();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الصنف من الكتالوج؟")) return;
    playSound("click");

    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      playSound("trash");
    } catch (err) {
      console.error("Delete error:", err);
      fetchData();
    }
  };

  // Category Handlers
  const handleOpenAddCategory = () => {
    playSound("click");
    setEditingCategory(null);
    setCatNameAr("");
    setCatNameEn("");
    setCatSlug("");
    setCatDescAr("");
    setCatDescEn("");
    setCatIcon("✨");
    setCatSortOrder((categories.length + 1).toString());
    setCatImage("");
    setIsCatModalOpen(true);
  };

  const handleOpenEditCategory = (c: Category) => {
    playSound("click");
    setEditingCategory(c);
    setCatNameAr(c.nameAr);
    setCatNameEn(c.nameEn);
    setCatSlug(c.slug);
    setCatDescAr(c.descriptionAr || "");
    setCatDescEn(c.descriptionEn || "");
    setCatIcon(c.icon || "✨");
    setCatSortOrder(c.sortOrder.toString());
    setCatImage(c.image || "");
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameAr.trim()) return;

    setSavingCat(true);
    playSound("click");

    const payload = {
      nameAr: catNameAr,
      nameEn: catNameEn || catNameAr,
      slug: catSlug || undefined,
      descriptionAr: catDescAr,
      descriptionEn: catDescEn,
      icon: catIcon,
      image: catImage,
      sortOrder: Number(catSortOrder) || 0,
    };

    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          playSound("success");
          setIsCatModalOpen(false);
          fetchData();
        } else {
          alert(data.error || "فشل تعديل بيانات القسم");
        }
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          playSound("success");
          setIsCatModalOpen(false);
          fetchData();
        } else {
          alert(data.error || "فشل إضافة القسم الجديد");
        }
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ القسم");
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    playSound("click");

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        playSound("trash");
        fetchData();
      } else {
        alert(data.error || "فشل حذف القسم");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حذف القسم");
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brandAr.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      filterType === "الكل" ? true : p.type === filterType;

    const matchesCategory =
      filterCategory === "الكل" ? true : p.categoryId === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <ErpLayout activeItem="menu">
      <div className="space-y-6">
        {/* Top Header & Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-cyan-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-pink-500/10 border border-cyan-500/30 text-pink-400">
              <Layers size={22} />
            </span>
            <div>
              <h1 className="text-xl font-black font-serif text-pink-gradient">
                كتالوج المنتجات وإدارة الأقسام
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                التحكم الكامل في الأصناف، رفع الصور مباشرة عبر ImgBB، وإدارة أقسام وتصنيفات المتجر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => {
                  playSound("click");
                  setActiveTab("products");
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === "products"
                    ? "bg-pink-500 text-black shadow-md shadow-amber-500/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Package size={14} />
                <span>قائمة المنتجات ({products.length})</span>
              </button>
              <button
                onClick={() => {
                  playSound("click");
                  setActiveTab("categories");
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === "categories"
                    ? "bg-pink-500 text-black shadow-md shadow-amber-500/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <FolderTree size={14} />
                <span>أقسام المتجر ({categories.length})</span>
              </button>
            </div>

            <button
              onClick={() => {
                playSound("click");
                fetchData();
              }}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
              title="تحديث البيانات"
            >
              <RefreshCw size={16} className={loading ? "animate-spin text-pink-400" : ""} />
            </button>

            {activeTab === "products" ? (
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
              >
                <Plus size={16} />
                <span>إضافة منتج جديد</span>
              </button>
            ) : (
              <button
                onClick={handleOpenAddCategory}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
              >
                <Plus size={16} />
                <span>إضافة قسم جديد</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: PRODUCTS LIST VIEW */}
        {activeTab === "products" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="ابحث باسم المنتج، البراند، أو المكونات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="الكل">كل الأقسام</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.nameAr}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {["الكل", "ORIGINAL", "TESTER", "HIGH_COPY", "INSPIRED"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      playSound("click");
                      setFilterType(t);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      filterType === t
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {t === "الكل"
                      ? "كافة المنظومات"
                      : t === "ORIGINAL"
                      ? "كاميرات مراقبة"
                      : t === "TESTER"
                      ? "أجهزة تسجيل"
                      : t === "HIGH_COPY"
                      ? "كابلات وتخزين"
                      : "باور وملحقات"}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-zinc-950/80 text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4 font-serif">الصنف / الجهاز</th>
                      <th className="py-3 px-4 font-serif">القسم</th>
                      <th className="py-3 px-4 font-serif">البراند والنوع</th>
                      <th className="py-3 px-4 font-serif">المواصفة والبيئة</th>
                      <th className="py-3 px-4 font-serif">السعر</th>
                      <th className="py-3 px-4 font-serif">المخزون</th>
                      <th className="py-3 px-4 font-serif">الحالة</th>
                      <th className="py-3 px-4 font-serif text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredProducts.map((product) => {
                      const catName = categories.find((c) => c.id === product.categoryId)?.nameAr || "قسم عام";
                      return (
                        <tr key={product.id} className="hover:bg-zinc-900/40 transition">
                          {/* Fragrance Name & Img */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-cyan-500/20 overflow-hidden flex-shrink-0 relative">
                                <img
                                  src={product.image}
                                  alt={product.nameAr}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-zinc-100 flex items-center gap-1.5">
                                  <span>{product.nameAr}</span>
                                  {product.isWinter && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                      ❄️ شتوي
                                    </span>
                                  )}
                                  {product.isFeatured && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                      ⭐ مميز
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-zinc-500 font-sans">{product.nameEn}</span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                              {catName}
                            </span>
                          </td>

                          {/* Brand & Type */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-pink-400/90">{product.brandAr}</div>
                            <span
                              className={`inline-block mt-1 text-[9.5px] px-2 py-0.5 rounded-md font-bold ${
                                product.type === "ORIGINAL"
                                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                  : product.type === "TESTER"
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              }`}
                            >
                              {product.type === "ORIGINAL"
                                ? "كاميرات مراقبة"
                                : product.type === "TESTER"
                                ? "أجهزة تسجيل"
                                : product.type === "HIGH_COPY"
                                ? "كابلات وتخزين"
                                : "باور وملحقات"}
                            </span>
                          </td>

                          {/* Volume & Concentration */}
                          <td className="py-3 px-4 text-zinc-300">
                            <div>{product.volume}</div>
                            <div className="text-[10px] text-zinc-500">{product.concentration}</div>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4">
                            <div className="font-serif font-black text-sm text-pink-gradient">
                              {product.price} ج.م
                            </div>
                            {product.originalPrice && (
                              <div className="text-[10px] text-zinc-500 line-through">
                                {product.originalPrice} ج.م
                              </div>
                            )}
                          </td>

                          {/* Stock Quantity */}
                          <td className="py-3 px-4 font-mono font-bold text-zinc-300">
                            {product.stockQuantity} زجاجة
                          </td>

                          {/* In-Stock Toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleStock(product)}
                              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold border transition ${
                                product.inStock
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                              }`}
                            >
                              {product.inStock ? "متوفر للطلب" : "نفذ من المخزن"}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEdit(product)}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-pink-400 transition"
                                title="تعديل الصنف"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-900/50 text-red-400 transition"
                                title="حذف الصنف"
                              >
                                <Trash2 size={14} />
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
          </div>
        )}

        {/* TAB 2: CATEGORIES MANAGEMENT VIEW */}
        {activeTab === "categories" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl p-5 shadow-xl relative flex flex-col justify-between hover:border-cyan-500/40 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-cyan-500/30 flex items-center justify-center text-2xl">
                        {cat.icon || "✨"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono font-bold text-pink-300">
                          {cat._count?.products || 0} صنف
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif font-black text-base text-zinc-100">
                      {cat.nameAr}
                    </h3>
                    <p className="text-xs text-pink-500/80 font-sans mt-0.5">{cat.nameEn}</p>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                      {cat.descriptionAr || "قسم معتمد ضمن منظومات وتجهيزات دي سي سمارت الأمنية."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800 mt-4 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      slug: {cat.slug} (ترتيب: {cat.sortOrder})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-pink-400 transition"
                        title="تعديل القسم"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-red-400 transition"
                        title="حذف القسم"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Perfume Modal with ImgBB Uploader */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#120e1c] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-cyan-300 font-serif flex items-center gap-2">
                <Layers size={18} />
                <span>{editingProduct ? "تعديل بيانات الصنف" : "إضافة كاميرا / جهاز جديد للكتالوج"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم المنتج بالعربي *</label>
                  <input
                    type="text"
                    required
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    placeholder="مثال: كاميرا داهوا خارجي 2 ميجا Full Color ومايك"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم المنتج بالإنجليزي</label>
                  <input
                    type="text"
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="e.g. Dahua 2MP Full-Color Bullet Camera"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">قسم الصنف / المنظومة (Category) *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-medium focus:border-cyan-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.nameAr} ({c.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">الماركة / الشركة المصنعة (Brand)</label>
                  <input
                    type="text"
                    value={formBrandAr}
                    onChange={(e) => setFormBrandAr(e.target.value)}
                    placeholder="داهوا Dahua / هيكفيجن Hikvision / يوني آرك Uniarch / سيجيت Seagate / دي سي سمارت"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">سعر البيع (ج.م) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">السعر الأصلي قبل الخصم (ج.م)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">الكمية بالمخزن</label>
                  <input
                    type="number"
                    value={formStockQty}
                    onChange={(e) => setFormStockQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
              </div>

              {/* Type, Volume & Concentration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">نوع التجهيز والمنظومة:</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="ORIGINAL">كاميرات مراقبة (CCTV Cameras)</option>
                    <option value="TESTER">أجهزة تسجيل (XVR / NVR Recorders)</option>
                    <option value="HIGH_COPY">كابلات وتخزين (Cables & Storage)</option>
                    <option value="INSPIRED">باور وملحقات تجميع (Power & Racks)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">المواصفة / الدقة (Specs):</label>
                  <select
                    value={formVolume}
                    onChange={(e) => setFormVolume(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="2MP Full Color">2MP Full Color (ألوان ليلية)</option>
                    <option value="5MP Ultra HD">5MP Ultra HD</option>
                    <option value="8MP 4K">8MP 4K فائقة الدقة</option>
                    <option value="4 Channels">4 قنوات (4CH)</option>
                    <option value="8 Channels">8 قنوات (8CH)</option>
                    <option value="16 Channels">16 قناة (16CH)</option>
                    <option value="1TB Surveillance">1 تيرا هارد تسجيل</option>
                    <option value="2TB Surveillance">2 تيرا هارد تسجيل</option>
                    <option value="305m Roll">لفة سلك 305 متر</option>
                    <option value="10A 12V">باور سبلاي 10 أمبير</option>
                    <option value="Standard">قياسي / عام</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">بيئة التشغيل / نوع التوصيل:</label>
                  <select
                    value={formConcentration}
                    onChange={(e) => setFormConcentration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="خارجي Outdoor IP67">خارجي معدني مقاوم للعوامل الجوية (IP67)</option>
                    <option value="داخلي Indoor">داخلي مدمج بمايك (Indoor Dome)</option>
                    <option value="متحركة PTZ Wi-Fi">متحركة PTZ لاسلكية واي فاي</option>
                    <option value="شبكي IP PoE">شبكي ذكي IP PoE</option>
                    <option value="تناظري HD">تناظري محوري HD Coaxial</option>
                    <option value="توصيل وتغذية">توصيل وتغذية</option>
                  </select>
                </div>
              </div>

              {/* Flags */}
              <div className="flex items-center gap-6 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formIsWinter}
                    onChange={(e) => setFormIsWinter(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>الأكثر طلباً في عروض التركيب والأنظمة 🛡️</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span>صنف مميز يظهر في واجهة المنظومة والكتالوج ⭐</span>
                </label>
              </div>

              {/* Image Upload Zone (ImgBB) */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-cyan-500/20">
                <ImageUploader
                  value={formImage}
                  onChange={setFormImage}
                  label="صورة المنتج / الكاميرا الرسمية (رفع مباشر عبر ImgBB)"
                  helperText="اختر صورة الكاميرا أو المنتج من جهازك وسيتم رفعها واستخراج الرابط الدائم"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold transition disabled:opacity-50"
                >
                  {saving ? "جاري الحفظ..." : editingProduct ? "تعديل بيانات الصنف" : "إضافة الصنف للكتالوج"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#120e1c] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-cyan-300 font-serif flex items-center gap-2">
                <FolderTree size={18} />
                <span>{editingCategory ? "تعديل بيانات القسم" : "إضافة قسم جديد لمتجر روفي"}</span>
              </h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم القسم بالعربي *</label>
                  <input
                    type="text"
                    required
                    value={catNameAr}
                    onChange={(e) => setCatNameAr(e.target.value)}
                    placeholder="مثال: كاميرات مراقبة داهوا Full Color"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم القسم بالإنجليزي</label>
                  <input
                    type="text"
                    value={catNameEn}
                    onChange={(e) => setCatNameEn(e.target.value)}
                    placeholder="e.g. Royal Winter Fragrances"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">أيقونة أو إيموجي القسم</label>
                  <input
                    type="text"
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    placeholder="❄️ أو 👑 أو ✨"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 text-center text-lg"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">ترتيب الظهور</label>
                  <input
                    type="number"
                    value={catSortOrder}
                    onChange={(e) => setCatSortOrder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">الرابط الفرعي (Slug)</label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="اختياري (تلقائي)"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">وصف القسم (عربي)</label>
                <textarea
                  rows={2}
                  value={catDescAr}
                  onChange={(e) => setCatDescAr(e.target.value)}
                  placeholder="وصف فني للأجهزة والمنظومات المندرجة تحت هذا القسم..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>

              {/* Category Image upload via ImgBB */}
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <ImageUploader
                  value={catImage}
                  onChange={setCatImage}
                  label="صورة أو بانر ترويجي للقسم (اختياري - ImgBB)"
                  helperText="صورة غلاف خاصة بالقسم تظهر عند تصفح التصنيف"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={savingCat}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold transition disabled:opacity-50"
                >
                  {savingCat ? "جاري الحفظ..." : editingCategory ? "تعديل القسم" : "إنشاء القسم"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ErpLayout>
  );
}
