"use client";

import React, { useState, useEffect, useRef } from "react";
import ErpLayout from "@/components/ErpLayout";
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Share2,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Building,
  ShieldCheck,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Eye,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

interface QuoteItem {
  id: string;
  name: string;
  specs?: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientPhone: string;
  clientAddress?: string | null;
  clientCompany?: string | null;
  projectType: string;
  items: string; // JSON
  subtotal: number;
  installationFee: number;
  discount: number;
  tax: number;
  totalAmount: number;
  warrantyPeriod: string;
  terms?: string | null;
  status: string;
  validUntil?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  createdAt: string;
}

interface DbProduct {
  id: string;
  nameAr: string;
  nameEn: string;
  brandAr: string;
  price: number;
  category?: {
    id: string;
    nameAr: string;
  } | null;
}

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState<"builder" | "history">("builder");
  const [loading, setLoading] = useState(false);
  const [quotesList, setQuotesList] = useState<Quote[]>([]);
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Quote Builder State
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [projectType, setProjectType] = useState("منزل سكني / فيلا خاصة");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [installationFee, setInstallationFee] = useState<number>(500);
  const [discount, setDiscount] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [warrantyPeriod, setWarrantyPeriod] = useState(
    "ضمان شامل لمدة عامين كاملين على الكاميرات وأجهزة التسجيل مع استبدال فوري"
  );
  const [terms, setTerms] = useState(
    "الدفعة: 50% مقدم عند التعاقد وتوريد المهمات، 50% بعد إنهاء التركيب والتشغيل والبرمجة. يشمل العرض تثبيت الكاميرات وضبط زوايا الرؤية وربط تطبيق الهاتف الذكي للمتابعة عن بعد."
  );
  const [notes, setNotes] = useState("");
  const [validDays, setValidDays] = useState<number>(15);

  // Preview & Print Modal
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null);
  const [previewItems, setPreviewItems] = useState<QuoteItem[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // History Filter
  const [filterSearch, setFilterSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchQuotes();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products) {
        setDbProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/quotes");
      const data = await res.json();
      if (data.quotes) {
        setQuotesList(data.quotes);
      }
    } catch (err) {
      console.error("Failed to load quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add Item to Builder
  const addItemFromDb = (p: DbProduct) => {
    const existingIndex = items.findIndex((it) => it.id === p.id);
    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].total =
        updated[existingIndex].quantity * updated[existingIndex].unitPrice;
      setItems(updated);
    } else {
      const newItem: QuoteItem = {
        id: p.id,
        name: p.nameAr,
        specs: p.brandAr || "أصلي معتمد",
        category: p.category?.nameAr || "كاميرات ومعدات",
        quantity: 1,
        unitPrice: p.price,
        total: p.price,
      };
      setItems([...items, newItem]);
    }
    setShowProductDropdown(false);
    setProductSearch("");
  };

  const addCustomItem = () => {
    const newItem: QuoteItem = {
      id: "custom_" + Date.now(),
      name: "بند مخصص (مواسير وترنك / إكسسوارات تركيب)",
      specs: "حسب متطلبات الموقع",
      category: "خدمات ومهمات",
      quantity: 1,
      unitPrice: 200,
      total: 200,
    };
    setItems([...items, newItem]);
  };

  const updateItemQty = (index: number, qty: number) => {
    if (qty < 1) return;
    const updated = [...items];
    updated[index].quantity = qty;
    updated[index].total = qty * updated[index].unitPrice;
    setItems(updated);
  };

  const updateItemPrice = (index: number, price: number) => {
    if (price < 0) return;
    const updated = [...items];
    updated[index].unitPrice = price;
    updated[index].total = updated[index].quantity * price;
    setItems(updated);
  };

  const updateItemName = (index: number, name: string) => {
    const updated = [...items];
    updated[index].name = name;
    setItems(updated);
  };

  const updateItemSpecs = (index: number, specs: string) => {
    const updated = [...items];
    updated[index].specs = specs;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((sum, it) => sum + it.total, 0);
  const taxAmount = (subtotal + installationFee - discount) * (taxPercent / 100);
  const totalAmount = Math.max(0, subtotal + installationFee - discount + taxAmount);

  // Save Quote
  const handleSaveQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert("يرجى إدخال اسم العميل ورقم التليفون");
      return;
    }
    if (items.length === 0) {
      alert("يرجى إضافة بند واحد على الأقل في عرض السعر");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientPhone,
          clientAddress,
          clientCompany,
          projectType,
          items,
          subtotal,
          installationFee,
          discount,
          tax: taxAmount,
          totalAmount,
          warrantyPeriod,
          terms,
          validUntil: new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toISOString(),
          notes,
          createdBy: "مهندس المبيعات / إدارة دي سي سمارت",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل حفظ عرض السعر");
      }

      alert(`✅ تم حفظ عرض السعر بنجاح برقم: ${data.quote.quoteNumber}`);
      // Open preview
      openPreview(data.quote);
      // Refresh list
      fetchQuotes();
      // Reset form
      resetForm();
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setClientName("");
    setClientPhone("");
    setClientAddress("");
    setClientCompany("");
    setItems([]);
    setInstallationFee(500);
    setDiscount(0);
    setNotes("");
  };

  const openPreview = (quote: Quote) => {
    setPreviewQuote(quote);
    try {
      const parsed = JSON.parse(quote.items);
      setPreviewItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setPreviewItems([]);
    }
    setIsPreviewOpen(true);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchQuotes();
        if (previewQuote && previewQuote.id === id) {
          setPreviewQuote({ ...previewQuote, status: newStatus });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQuote = async (id: string, number: string) => {
    if (!confirm(`هل أنت متأكد من حذف عرض السعر رقم ${number}؟`)) return;
    try {
      const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("تم حذف عرض السعر");
        fetchQuotes();
        if (previewQuote && previewQuote.id === id) setIsPreviewOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // WhatsApp share message builder
  const buildWhatsAppMessage = (q: Quote, qItems: QuoteItem[]) => {
    let itemsText = "";
    qItems.forEach((it, i) => {
      itemsText += `\n${i + 1}. *${it.name}* (الكمية: ${it.quantity}) — ${it.total.toLocaleString()} ج.م`;
    });

    const msg = `السلام عليكم ورحمة الله وبركاته،
أهلاً بحضرتك أستاذ *${q.clientName}* 🌸
مرفق لحضرتك تفاصيل عرض السعر الرسمي من شركة *دي سي سمارت لأنظمة المراقبة والتحكم الذكي*:

📄 *رقم عرض السعر:* ${q.quoteNumber}
🏢 *نوع المشروع:* ${q.projectType}
📅 *تاريخ التحرير:* ${new Date(q.createdAt).toLocaleDateString("ar-EG")}

━━━━━━━━━━━━━━━━━━━
🛡️ *بيان المنظومة والمعدات:*
${itemsText}

🔧 *مصنعية التركيب والبرمجة:* ${q.installationFee.toLocaleString()} ج.م
${q.discount > 0 ? `🎁 *الخصم الخاص:* -${q.discount.toLocaleString()} ج.م\n` : ""}💰 *الإجمالي النهائي:* *${q.totalAmount.toLocaleString()} ج.م*
━━━━━━━━━━━━━━━━━━━

🛡️ *الضمان:*
${q.warrantyPeriod}

📝 *الشروط والأحكام:*
${q.terms || "الدفعة: 50% مقدم عند التعاقد و50% بعد التسليم والتشغيل التجريبي"}

📞 *للتواصل والاستفسار:*
01008657085 — 01281248731
📍 *فرع طنطا:* محافظة الغربية
✨ *دي سي سمارت — شريككم المعتمد لأمان وحماية ممتلكاتكم*`;

    return encodeURIComponent(msg);
  };

  const openWhatsApp = (q: Quote, qItems: QuoteItem[]) => {
    const cleanPhone = q.clientPhone.replace(/\D/g, "");
    const phoneWithCountry = cleanPhone.startsWith("20")
      ? cleanPhone
      : cleanPhone.startsWith("0")
      ? "2" + cleanPhone
      : "20" + cleanPhone;

    const encodedMsg = buildWhatsAppMessage(q, qItems);
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodedMsg}`, "_blank");
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredQuotes = quotesList.filter((q) => {
    const matchesStatus = filterStatus === "ALL" || q.status === filterStatus;
    const matchesSearch =
      q.clientName.toLowerCase().includes(filterSearch.toLowerCase()) ||
      q.clientPhone.includes(filterSearch) ||
      q.quoteNumber.toLowerCase().includes(filterSearch.toLowerCase()) ||
      (q.clientCompany && q.clientCompany.toLowerCase().includes(filterSearch.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <ErpLayout>
      <div className="space-y-6 pb-12 print:hidden">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl shadow-cyan-950/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                نظام المقاولات والتركيبات المتقدم
              </span>
              <span className="text-xs text-slate-400">| دي سي سمارت — طنطا</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
              <FileText className="text-cyan-400" size={26} />
              <span>مولد وإدارة عروض الأسعار (Quotations)</span>
            </h1>
            <p className="text-xs text-slate-300">
              إنشاء عروض أسعار هندسية متكاملة لعملاء المنازل والشركات والمصانع ومشاركتها عبر واتساب وتصديرها PDF معتمدة
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-cyan-500/20">
            <button
              onClick={() => setActiveTab("builder")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "builder"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Plus size={15} />
              <span>إنشاء عرض جديد</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("history");
                fetchQuotes();
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Layers size={15} />
              <span>أرشيف العروض ({quotesList.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: BUILDER */}
        {activeTab === "builder" && (
          <form onSubmit={handleSaveQuote} className="space-y-6">
            {/* Client & Project Details */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <Building size={16} />
                  <span>بيانات العميل والموقع</span>
                </h3>
                <span className="text-[11px] text-slate-400">الحقول بعلامة (*) مطلوبة للطباعة والواتساب</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    اسم العميل أو الجهة *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="مثال: أستاذ أحمد الشناوي / شركة الدلتا للتجارة"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    رقم التليفون / الواتساب *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="مثال: 01018671000 أو 01281248731"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    نوع المشروع / المنشأة
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="منزل سكني / فيلا خاصة">منزل سكني / فيلا خاصة</option>
                    <option value="محل تجاري / معرض">محل تجاري / معرض</option>
                    <option value="شركة / مقر إداري">شركة / مقر إداري</option>
                    <option value="مصنع / مستودع / هناجر">مصنع / مستودع / هناجر</option>
                    <option value="صيدلية / عيادة / مركز طبي">صيدلية / عيادة / مركز طبي</option>
                    <option value="كافيه / مطعم">كافيه / مطعم</option>
                    <option value="مزرعة / مساحة مفتوحة">مزرعة / مساحة مفتوحة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    عنوان موقع التركيب
                  </label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="مثال: طنطا — شارع سعيد تقاطع حسن حسني"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    اسم الشركة / النشاط (اختياري)
                  </label>
                  <input
                    type="text"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    placeholder="مثال: مصنع الأمل للغزل والنسيج"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    صلاحية عرض السعر
                  </label>
                  <select
                    value={validDays}
                    onChange={(e) => setValidDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  >
                    <option value={7}>7 أيام من تاريخه</option>
                    <option value={15}>15 يوماً من تاريخه (المعتاد)</option>
                    <option value={30}>30 يوماً من تاريخه</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Items Table & Product Search */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span>مكونات وبنود المنظومة الأمنية ({items.length} صنف)</span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={addCustomItem}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/20 transition flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    <span>إضافة بند يدوي مخصص</span>
                  </button>
                </div>
              </div>

              {/* Product Selector Dropdown */}
              <div className="relative">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-700">
                  <Search size={16} className="text-slate-400 mr-2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowProductDropdown(true);
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    placeholder="ابحث في كتالوج دي سي سمارت لإضافة صنف (داهوا، يوني آرك، هيكفيجن، كابلات، هاردات...)"
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  {productSearch && (
                    <button
                      type="button"
                      onClick={() => setProductSearch("")}
                      className="text-slate-400 hover:text-white text-xs px-2"
                    >
                      مسح
                    </button>
                  )}
                </div>

                {/* Dropdown Results */}
                {showProductDropdown && (
                  <div className="absolute z-30 top-full mt-1.5 right-0 left-0 max-h-72 overflow-y-auto rounded-xl bg-slate-950 border border-cyan-500/30 shadow-2xl p-2 space-y-1">
                    <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-400 border-b border-slate-800">
                      <span>انقر على الصنف لإضافته للعرض</span>
                      <button
                        type="button"
                        onClick={() => setShowProductDropdown(false)}
                        className="text-cyan-400 hover:underline"
                      >
                        إغلاق القائمة
                      </button>
                    </div>

                    {dbProducts
                      .filter((p) =>
                        p.nameAr.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.brandAr?.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.category?.nameAr?.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .slice(0, 30)
                      .map((p) => (
                        <div
                          key={p.id}
                          onClick={() => addItemFromDb(p)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition text-xs border border-transparent hover:border-slate-800"
                        >
                          <div className="space-y-0.5">
                            <p className="font-bold text-white">{p.nameAr}</p>
                            <p className="text-[10px] text-slate-400">
                              {p.brandAr} • {p.category?.nameAr}
                            </p>
                          </div>
                          <div className="text-left">
                            <span className="font-black text-cyan-400">
                              {p.price.toLocaleString()} ج.م
                            </span>
                            <span className="block text-[10px] text-emerald-400">+ إضافة</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Items List */}
              {items.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl space-y-2">
                  <ShieldCheck size={36} className="mx-auto text-slate-600" />
                  <p className="text-xs font-bold text-slate-400">
                    لم تقم بإضافة أي بند بعد في عرض السعر
                  </p>
                  <p className="text-[11px] text-slate-500">
                    استخدم شريط البحث أعلاه أو زر "إضافة بند يدوي مخصص" لإدراج الكاميرات وأجهزة التسجيل
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/60">
                        <th className="p-3 w-10">#</th>
                        <th className="p-3">اسم الصنف والموديل</th>
                        <th className="p-3">المواصفات / الملاحظات</th>
                        <th className="p-3 w-24 text-center">الكمية</th>
                        <th className="p-3 w-32 text-center">سعر الوحدة (ج.م)</th>
                        <th className="p-3 w-32 text-center">الإجمالي (ج.م)</th>
                        <th className="p-3 w-12 text-center">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {items.map((it, idx) => (
                        <tr key={it.id} className="hover:bg-slate-950/40">
                          <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={it.name}
                              onChange={(e) => updateItemName(idx, e.target.value)}
                              className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white font-medium focus:border-cyan-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={it.specs || ""}
                              onChange={(e) => updateItemSpecs(idx, e.target.value)}
                              placeholder="ملاحظات (مثال: رؤية ليلية ملونة)"
                              className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-300 text-[11px] focus:border-cyan-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => updateItemQty(idx, it.quantity - 1)}
                                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min={1}
                                value={it.quantity}
                                onChange={(e) => updateItemQty(idx, parseInt(e.target.value) || 1)}
                                className="w-12 text-center bg-slate-950 px-1 py-1 rounded border border-slate-800 text-white font-bold"
                              />
                              <button
                                type="button"
                                onClick={() => updateItemQty(idx, it.quantity + 1)}
                                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min={0}
                              value={it.unitPrice}
                              onChange={(e) => updateItemPrice(idx, parseFloat(e.target.value) || 0)}
                              className="w-24 text-center bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800 text-cyan-300 font-bold focus:border-cyan-500 focus:outline-none"
                            />
                          </td>
                          <td className="p-3 text-center font-black text-white">
                            {it.total.toLocaleString()} ج.م
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(idx)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 transition"
                              title="حذف البند"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Cost Breakdown & Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Warranty & Terms */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span>الضمان وشروط التعاقد الرسمية</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    فترة وشروط الضمان
                  </label>
                  <input
                    type="text"
                    value={warrantyPeriod}
                    onChange={(e) => setWarrantyPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    شروط التنفيذ والدفع
                  </label>
                  <textarea
                    rows={3}
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    ملاحظات فنية إضافية (تظهر بالعرض)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: الأسعار سارية حتى انتهاء الكميات المتاحة"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Financial Calculation Box */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>الحسابات المالية والتكلفة النهائية</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">إجمالي قيمة المهمات والمعدات:</span>
                    <span className="font-black text-white text-sm">
                      {subtotal.toLocaleString()} ج.م
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">مصنعية التركيب والبرمجة والتوصيل:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        value={installationFee}
                        onChange={(e) => setInstallationFee(parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 text-center rounded bg-slate-900 border border-slate-700 text-cyan-300 font-bold focus:outline-none"
                      />
                      <span className="text-slate-400">ج.م</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">خصم تجاري خاص:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 text-center rounded bg-slate-900 border border-slate-700 text-rose-400 font-bold focus:outline-none"
                      />
                      <span className="text-slate-400">ج.م</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">ضريبة القيمة المضافة (%):</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-center rounded bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none"
                      />
                      <span className="text-slate-400">
                        % ({taxAmount.toLocaleString()} ج.م)
                      </span>
                    </div>
                  </div>

                  {/* Grand Total Highlight */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950 to-slate-950 border-2 border-cyan-500/50 flex items-center justify-between shadow-lg">
                    <div>
                      <p className="text-[11px] font-bold text-cyan-400">الإجمالي النهائي لعرض السعر</p>
                      <p className="text-xs text-slate-300">شامل التوريد والتركيب والضمان</p>
                    </div>
                    <div className="text-left">
                      <span className="text-2xl font-black text-cyan-300 font-mono">
                        {totalAmount.toLocaleString()}
                      </span>
                      <span className="text-xs text-cyan-400 mr-1.5">ج.م</span>
                    </div>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading || items.length === 0}
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FileCheck size={18} />
                    <span>{loading ? "جاري الحفظ..." : "حفظ عرض السعر واستخراج الوثيقة"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    إعادة ضبط
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-950 px-3 py-2 rounded-xl border border-slate-700">
                <Search size={15} className="text-slate-400" />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="ابحث برقم العرض، اسم العميل، الهاتف، أو الشركة..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">الحالة:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-500"
                >
                  <option value="ALL">جميع العروض ({quotesList.length})</option>
                  <option value="PENDING">معلق / قيد المراجعة</option>
                  <option value="ACCEPTED">تم التعاقد والقبول</option>
                  <option value="REJECTED">مرفوض</option>
                  <option value="EXPIRED">منتهي الصلاحية</option>
                </select>

                <button
                  onClick={fetchQuotes}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 transition"
                  title="تحديث البيانات"
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            {/* Quotes Table */}
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 space-y-3">
                <FileText size={40} className="mx-auto text-slate-600" />
                <p className="text-sm font-bold text-slate-300">لا توجد عروض أسعار مسجلة تطابق البحث</p>
                <p className="text-xs text-slate-500">
                  انقر على "إنشاء عرض جديد" للبدء في تحرير أول عرض سعر لعملائك
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950/80">
                      <th className="p-3.5">رقم العرض</th>
                      <th className="p-3.5">العميل / المنشأة</th>
                      <th className="p-3.5">الهاتف</th>
                      <th className="p-3.5">نوع المشروع</th>
                      <th className="p-3.5 text-center">الإجمالي</th>
                      <th className="p-3.5 text-center">الحالة</th>
                      <th className="p-3.5 text-center">تاريخ التحرير</th>
                      <th className="p-3.5 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredQuotes.map((q) => {
                      let parsedItems: QuoteItem[] = [];
                      try {
                        parsedItems = JSON.parse(q.items);
                      } catch {}

                      return (
                        <tr key={q.id} className="hover:bg-slate-950/40 transition">
                          <td className="p-3.5 font-mono font-bold text-cyan-400">
                            {q.quoteNumber}
                          </td>
                          <td className="p-3.5">
                            <p className="font-bold text-white">{q.clientName}</p>
                            {q.clientCompany && (
                              <p className="text-[10px] text-slate-400">{q.clientCompany}</p>
                            )}
                          </td>
                          <td className="p-3.5 font-mono text-slate-300">{q.clientPhone}</td>
                          <td className="p-3.5 text-slate-300">{q.projectType}</td>
                          <td className="p-3.5 text-center font-black text-emerald-400 font-mono">
                            {q.totalAmount.toLocaleString()} ج.م
                          </td>
                          <td className="p-3.5 text-center">
                            <select
                              value={q.status}
                              onChange={(e) => handleStatusChange(q.id, e.target.value)}
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition ${
                                q.status === "ACCEPTED"
                                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                                  : q.status === "REJECTED"
                                  ? "bg-rose-950/60 text-rose-400 border-rose-500/30"
                                  : q.status === "EXPIRED"
                                  ? "bg-amber-950/60 text-amber-400 border-amber-500/30"
                                  : "bg-cyan-950/60 text-cyan-300 border-cyan-500/30"
                              }`}
                            >
                              <option value="PENDING">معلق</option>
                              <option value="ACCEPTED">تم التعاقد</option>
                              <option value="REJECTED">مرفوض</option>
                              <option value="EXPIRED">منتهي</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-center text-slate-400 text-[11px]">
                            {new Date(q.createdAt).toLocaleDateString("ar-EG")}
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openPreview(q)}
                                className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900 border border-cyan-500/30 transition"
                                title="معاينة وطباعة العرض"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => openWhatsApp(q, parsedItems)}
                                className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/30 transition"
                                title="إرسال عبر واتساب"
                              >
                                <Share2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteQuote(q.id, q.quoteNumber)}
                                className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-500/30 transition"
                                title="حذف"
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
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* OFFICIAL PRINTABLE QUOTATION MODAL & PRINT STYLES */}
      {/* ========================================================================= */}
      {isPreviewOpen && previewQuote && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
          <div className="w-full max-w-4xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:w-full print:max-w-none print:bg-white print:text-black">
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="text-cyan-400" size={18} />
                <span className="font-bold text-white text-xs">
                  معاينة عرض السعر الرسمي: {previewQuote.quoteNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openWhatsApp(previewQuote, previewItems)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
                >
                  <Share2 size={14} />
                  <span>إرسال واتساب للعميل</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center gap-1.5"
                >
                  <Printer size={14} />
                  <span>طباعة / حفظ PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable A4 Quotation Sheet */}
            <div
              ref={printRef}
              className="p-6 md:p-8 bg-slate-900 print:bg-white print:text-black print:p-6 space-y-6 text-right"
              dir="rtl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-cyan-500 pb-5 print:border-black">
                <div className="space-y-1">
                  <h2 className="text-xl md:text-2xl font-black text-white print:text-black flex items-center gap-2">
                    <span>دي سي سمارت — للأنظمة الأمنية والتحكم الذكي</span>
                  </h2>
                  <p className="text-xs font-bold text-cyan-400 print:text-gray-700">
                    DC SMART SECURITY & SURVEILLANCE SYSTEMS
                  </p>
                  <p className="text-[11px] text-slate-300 print:text-gray-600 flex items-center gap-3">
                    <span>📍 طنطا — محافظة الغربية</span>
                    <span>📞 01008657085 — 01281248731</span>
                  </p>
                </div>

                <div className="text-left space-y-1">
                  <div className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 print:border-black print:text-black print:bg-gray-100 font-mono font-black text-sm">
                    {previewQuote.quoteNumber}
                  </div>
                  <p className="text-[11px] text-slate-400 print:text-gray-600">
                    التاريخ: {new Date(previewQuote.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                  <p className="text-[11px] text-slate-400 print:text-gray-600">
                    صالح حتى:{" "}
                    {previewQuote.validUntil
                      ? new Date(previewQuote.validUntil).toLocaleDateString("ar-EG")
                      : "15 يوماً من تاريخه"}
                  </p>
                </div>
              </div>

              {/* Client Specification Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-gray-50 print:border-gray-300 text-xs">
                <div>
                  <span className="block text-slate-400 print:text-gray-500 text-[10px]">العميل الكريم:</span>
                  <span className="font-bold text-white print:text-black">{previewQuote.clientName}</span>
                </div>
                <div>
                  <span className="block text-slate-400 print:text-gray-500 text-[10px]">رقم الهاتف:</span>
                  <span className="font-bold text-white print:text-black font-mono">{previewQuote.clientPhone}</span>
                </div>
                <div>
                  <span className="block text-slate-400 print:text-gray-500 text-[10px]">نوع المشروع:</span>
                  <span className="font-bold text-white print:text-black">{previewQuote.projectType}</span>
                </div>
                <div>
                  <span className="block text-slate-400 print:text-gray-500 text-[10px]">الموقع / العنوان:</span>
                  <span className="font-bold text-white print:text-black">
                    {previewQuote.clientAddress || "طنطا"}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-hidden rounded-xl border border-slate-800 print:border-gray-400">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-cyan-400 print:bg-gray-200 print:text-black font-bold border-b border-slate-800 print:border-gray-400">
                      <th className="p-2.5 w-8 text-center">#</th>
                      <th className="p-2.5">الصنف والموديل</th>
                      <th className="p-2.5">المواصفات الفنية</th>
                      <th className="p-2.5 w-16 text-center">الكمية</th>
                      <th className="p-2.5 w-24 text-center">سعر الوحدة</th>
                      <th className="p-2.5 w-28 text-center">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 print:divide-gray-300 print:text-black">
                    {previewItems.map((it, idx) => (
                      <tr key={it.id || idx} className="print:text-black">
                        <td className="p-2.5 text-center font-mono text-slate-400 print:text-gray-600">
                          {idx + 1}
                        </td>
                        <td className="p-2.5 font-bold text-white print:text-black">{it.name}</td>
                        <td className="p-2.5 text-slate-300 print:text-gray-700 text-[11px]">
                          {it.specs || it.category || "—"}
                        </td>
                        <td className="p-2.5 text-center font-bold">{it.quantity}</td>
                        <td className="p-2.5 text-center font-mono">
                          {it.unitPrice.toLocaleString()} ج.م
                        </td>
                        <td className="p-2.5 text-center font-black text-cyan-300 print:text-black font-mono">
                          {it.total.toLocaleString()} ج.م
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals */}
              <div className="flex justify-end">
                <div className="w-full sm:w-80 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800 print:border-gray-300 text-slate-300 print:text-gray-700">
                    <span>مجموع المهمات:</span>
                    <span className="font-mono font-bold">{previewQuote.subtotal.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800 print:border-gray-300 text-slate-300 print:text-gray-700">
                    <span>التركيب والبرمجة:</span>
                    <span className="font-mono font-bold">
                      {previewQuote.installationFee.toLocaleString()} ج.م
                    </span>
                  </div>
                  {previewQuote.discount > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-800 print:border-gray-300 text-rose-400 print:text-red-600 font-bold">
                      <span>خصم خاص:</span>
                      <span className="font-mono">-{previewQuote.discount.toLocaleString()} ج.م</span>
                    </div>
                  )}
                  {previewQuote.tax > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-800 print:border-gray-300 text-slate-300 print:text-gray-700">
                      <span>ضريبة القيمة المضافة:</span>
                      <span className="font-mono">+{previewQuote.tax.toLocaleString()} ج.م</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 px-3 rounded-xl bg-cyan-950/70 border border-cyan-500/40 print:bg-gray-100 print:border-black font-black text-sm text-cyan-300 print:text-black">
                    <span>الإجمالي المستحق:</span>
                    <span className="font-mono">{previewQuote.totalAmount.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Warranty & Terms Section */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-gray-50 print:border-gray-300 space-y-2 text-[11px] leading-relaxed">
                <div className="font-bold text-cyan-400 print:text-black flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>الضمان المعتمد:</span>
                </div>
                <p className="text-slate-300 print:text-gray-700">{previewQuote.warrantyPeriod}</p>

                <div className="font-bold text-cyan-400 print:text-black pt-1">شروط التنفيذ والدفع:</div>
                <p className="text-slate-300 print:text-gray-700">{previewQuote.terms}</p>

                {previewQuote.notes && (
                  <div className="pt-1 text-slate-400 print:text-gray-600">
                    <span className="font-bold">ملاحظات:</span> {previewQuote.notes}
                  </div>
                )}
              </div>

              {/* Signature / Approval Line */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-800 print:border-gray-300 text-xs">
                <div className="space-y-6">
                  <p className="font-bold text-slate-300 print:text-black">توقيع واعتماد العميل:</p>
                  <p className="border-b border-dashed border-slate-700 print:border-black w-48"></p>
                </div>
                <div className="text-left space-y-6">
                  <p className="font-bold text-slate-300 print:text-black">إدارة شركة دي سي سمارت:</p>
                  <p className="border-b border-dashed border-slate-700 print:border-black w-48 mr-auto"></p>
                </div>
              </div>

              {/* Developer Watermark with user phone number */}
              <div className="pt-4 text-center border-t border-slate-800/80 print:border-gray-200 text-[11px] text-slate-400 print:text-gray-600 font-medium">
                تم التطوير بواسطة شركة أوركا لتقنية المعلومات — 01018671000
              </div>
            </div>
          </div>
        </div>
      )}
    </ErpLayout>
  );
}
