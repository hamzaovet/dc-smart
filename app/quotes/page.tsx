"use client";

import React, { useState, useEffect, useRef } from "react";
import ErpLayout from "@/components/ErpLayout";
import {
  FileText,
  UserCheck,
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
  Download,
  Image as ImageIcon,
  Copy,
  Edit3,
  Save,
  Check,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { toPng, toBlob } from "html-to-image";
import { jsPDF } from "jspdf";

interface QuoteItem {
  id: string;
  name: string;
  specs?: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isCustom?: boolean;
  savedToCatalog?: boolean;
  code?: string;
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

interface Category {
  id: string;
  nameAr: string;
  nameEn?: string;
}

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState<"builder" | "history">("builder");
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const [quotesList, setQuotesList] = useState<Quote[]>([]);
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Edit Mode State
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [editingQuoteNumber, setEditingQuoteNumber] = useState<string | null>(null);

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
  const [autoSaveNewItems, setAutoSaveNewItems] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [autoSaveCustomer, setAutoSaveCustomer] = useState(true);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustCity, setNewCustCity] = useState("طنطا");
  const [newCustAddress, setNewCustAddress] = useState("");
  const [newCustCompany, setNewCustCompany] = useState("");
  const [savingCustomer, setSavingCustomer] = useState(false);

  // Save to Catalog Modal State
  const [catalogModalItem, setCatalogModalItem] = useState<{
    index: number;
    name: string;
    brand: string;
    categoryId: string;
    price: number;
    specs: string;
  } | null>(null);
  const [catalogModalLoading, setCatalogModalLoading] = useState(false);

  // Preview & Export Modal
  const [previewQuote, setPreviewQuote] = useState<Quote | null>(null);
  const [previewItems, setPreviewItems] = useState<QuoteItem[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");

  // History Filter
  const [filterSearch, setFilterSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchQuotes();
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      if (data.customers) setCustomers(data.customers);
    } catch (err) {
      console.error("Failed to load customers:", err);
    }
  };

  const handleQuickSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;
    setSavingCustomer(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCustName.trim(),
          phone: newCustPhone.trim(),
          city: newCustCity.trim() || "طنطا",
          address: newCustAddress.trim(),
          notes: newCustCompany.trim(),
        }),
      });
      const data = await res.json();
      if (data.customer) {
        setCustomers((prev) => [data.customer, ...prev.filter((x) => x.id !== data.customer.id)]);
        setSelectedCustomerId(data.customer.id);
        setClientName(data.customer.name);
        setClientPhone(data.customer.phone);
        if (data.customer.address) setClientAddress(data.customer.address);
        if (data.customer.notes) setClientCompany(data.customer.notes);
        setIsAddCustomerOpen(false);
        setNewCustName("");
        setNewCustPhone("");
        setNewCustAddress("");
        setNewCustCompany("");
      }
    } catch (err) {
      console.error("Save customer error:", err);
      alert("حدث خطأ أثناء حفظ بيانات العميل");
    } finally {
      setSavingCustomer(false);
    }
  };

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

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
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
        isCustom: false,
        savedToCatalog: true,
      };
      setItems([...items, newItem]);
    }
    setShowProductDropdown(false);
    setProductSearch("");
  };

  const addCustomItem = () => {
    const newItem: QuoteItem = {
      id: "custom_" + Date.now(),
      name: "بند مخصص جديد (مواسير / كابلات / هارد / راك...)",
      specs: "حسب المقايسة والموقع",
      category: "مستلزمات ومهمات",
      quantity: 1,
      unitPrice: 200,
      total: 200,
      isCustom: true,
      savedToCatalog: false,
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

  // Open Save to Catalog Modal
  const handleOpenCatalogModal = (index: number) => {
    const it = items[index];
    setCatalogModalItem({
      index,
      name: it.name,
      brand: it.specs?.includes("داهوا")
        ? "داهوا Dahua"
        : it.specs?.includes("هاي لوك") || it.specs?.includes("هيكفيجن")
        ? "هاي لوك HiLook"
        : it.specs?.includes("يوني آرك")
        ? "يوني آرك Uniarch"
        : "دي سي سمارت",
      categoryId: categories[0]?.id || "cat_accessories",
      price: it.unitPrice,
      specs: it.specs || "مهمات تركيب ومعدات أمنية معتمدة",
    });
  };

  // Save Item to Catalog in Database
  const handleSaveItemToCatalog = async () => {
    if (!catalogModalItem) return;
    if (!catalogModalItem.name.trim() || catalogModalItem.price <= 0) {
      alert("يرجى إدخال اسم الصنف وسعر الوحدة بشكل صحيح");
      return;
    }

    try {
      setCatalogModalLoading(true);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameAr: catalogModalItem.name.trim(),
          nameEn: catalogModalItem.name.trim(),
          brandAr: catalogModalItem.brand,
          brandEn: catalogModalItem.brand,
          categoryId: catalogModalItem.categoryId,
          price: catalogModalItem.price,
          descriptionAr: catalogModalItem.specs,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل تسجيل الصنف في الكتالوج");
      }

      // Update the item in the quote builder
      const updated = [...items];
      updated[catalogModalItem.index].id = data.product.id;
      updated[catalogModalItem.index].name = data.product.nameAr;
      updated[catalogModalItem.index].isCustom = false;
      updated[catalogModalItem.index].savedToCatalog = true;
      updated[catalogModalItem.index].code = data.code || `DCS-${data.product.id.slice(-4)}`;
      setItems(updated);

      // Add to dbProducts list
      setDbProducts((prev) => [data.product, ...prev]);

      alert(
        `✅ تم تسجيل الصنف في الكتالوج بنجاح!\n\nالكود المولد: ${
          data.code || "DCS-" + data.product.id.slice(-4)
        }\nالاسم: ${data.product.nameAr}`
      );
      setCatalogModalItem(null);
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء حفظ الصنف");
    } finally {
      setCatalogModalLoading(false);
    }
  };

  // Calculations
  const subtotal = items.reduce((sum, it) => sum + it.total, 0);
  const taxAmount = (subtotal + installationFee - discount) * (taxPercent / 100);
  const totalAmount = Math.max(0, subtotal + installationFee - discount + taxAmount);

  // Start Editing an Existing Quote
  const handleStartEdit = (quote: Quote) => {
    setEditingQuoteId(quote.id);
    setEditingQuoteNumber(quote.quoteNumber);
    setClientName(quote.clientName);
    setClientPhone(quote.clientPhone);
    setClientAddress(quote.clientAddress || "");
    setClientCompany(quote.clientCompany || "");
    setProjectType(quote.projectType);
    setInstallationFee(quote.installationFee);
    setDiscount(quote.discount);

    // Calc tax percent
    const taxableBase = quote.subtotal + quote.installationFee - quote.discount;
    if (quote.tax > 0 && taxableBase > 0) {
      setTaxPercent(Math.round((quote.tax / taxableBase) * 100));
    } else {
      setTaxPercent(0);
    }

    setWarrantyPeriod(quote.warrantyPeriod);
    setTerms(quote.terms || "");
    setNotes(quote.notes || "");

    try {
      const parsed = JSON.parse(quote.items);
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }

    setIsPreviewOpen(false);
    setActiveTab("builder");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingQuoteId(null);
    setEditingQuoteNumber(null);
    resetForm();
  };

  // Save / Update Quote
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

      // Auto save any custom items to catalog if toggle is active
      const finalItems = [...items];
      if (autoSaveNewItems) {
        for (let i = 0; i < finalItems.length; i++) {
          const it = finalItems[i];
          if (it.isCustom && !it.savedToCatalog) {
            try {
              const resProd = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  nameAr: it.name.trim(),
                  nameEn: it.name.trim(),
                  brandAr: it.specs?.includes("داهوا") ? "داهوا" : "دي سي سمارت",
                  price: it.unitPrice,
                  descriptionAr: it.specs || "مهمات تركيب ومعدات",
                }),
              });
              const prodData = await resProd.json();
              if (resProd.ok && prodData.product) {
                finalItems[i].id = prodData.product.id;
                finalItems[i].savedToCatalog = true;
                finalItems[i].code = prodData.code;
              }
            } catch (pErr) {
              console.warn("Auto save item error:", pErr);
            }
          }
        }
      }

      const payload = {
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientAddress: clientAddress.trim() || null,
        clientCompany: clientCompany.trim() || null,
        projectType,
        items: finalItems,
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
      };

      let quoteResult: Quote;

      if (editingQuoteId) {
        // UPDATE EXISTING QUOTE
        const res = await fetch(`/api/quotes/${editingQuoteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "فشل تعديل عرض السعر");
        quoteResult = data.quote;
        alert(`✅ تم تحديث وتعديل عرض السعر بنجاح برقم: ${quoteResult.quoteNumber}`);
      } else {
        // CREATE NEW QUOTE
        const res = await fetch("/api/quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "فشل حفظ عرض السعر");

      // Auto-save client to CRM
      if (autoSaveCustomer && clientName.trim() && clientPhone.trim()) {
        fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: clientName.trim(),
            phone: clientPhone.trim(),
            address: clientAddress.trim(),
            notes: clientCompany.trim(),
          }),
        }).catch(() => {});
      }
        quoteResult = data.quote;
        alert(`✅ تم حفظ عرض السعر بنجاح برقم: ${quoteResult.quoteNumber}`);
      }

      // Open preview
      openPreview(quoteResult);
      // Refresh quotes list
      fetchQuotes();
      // If was editing, reset edit state
      setEditingQuoteId(null);
      setEditingQuoteNumber(null);
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
    setTaxPercent(0);
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
مرفق لحضرتك تفاصيل عرض السعر الرسمي المعتمد من شركة *دي سي سمارت لأنظمة المراقبة والتحكم الذكي*:

📄 *رقم عرض السعر:* ${q.quoteNumber}
🏢 *نوع المشروع:* ${q.projectType}
📅 *تاريخ التحرير:* ${new Date(q.createdAt).toLocaleDateString("ar-EG")}

━━━━━━━━━━━━━━━━━━━
🛡️ *بيان المنظومة والمعدات:*
${itemsText}

🔧 *مصنعية التركيب والبرمجة:* ${q.installationFee.toLocaleString()} ج.م
${q.discount > 0 ? `🎁 *الخصم الخاص:* -${q.discount.toLocaleString()} ج.م\n` : ""}💰 *الإجمالي النهائي المستحق:* *${q.totalAmount.toLocaleString()} ج.م*
━━━━━━━━━━━━━━━━━━━

🛡️ *الضمان المعتمد:*
${q.warrantyPeriod}

📝 *الشروط والأحكام:*
${q.terms || "الدفعة: 50% مقدم عند التعاقد و50% بعد التسليم والتشغيل التجريبي"}

📞 *للتواصل والاستفسار:*
مبيعات: 01008657085 — دعم وواتساب: 01281248731
📍 *فرع طنطا:* محافظة الغربية — جمهورية مصر العربية
✨ *دي سي سمارت — شريككم المعتمد لأمان وحماية ممتلكاتكم*`;

    return encodeURIComponent(msg);
  };

  const openWhatsAppDirect = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const phoneWithCountry = cleanPhone.startsWith("20")
      ? cleanPhone
      : cleanPhone.startsWith("0")
      ? "2" + cleanPhone
      : "20" + cleanPhone;

    window.open(`https://wa.me/${phoneWithCountry}`, "_blank");
  };

  const openWhatsApp = (q: Quote, qItems: QuoteItem[]) => {
    openWhatsAppDirect(q.clientPhone);
  };

  // Download Quote as PNG Image
  const handleDownloadImage = async () => {
    if (!printRef.current || !previewQuote) return;
    try {
      setIsExporting(true);
      setExportMessage("جاري تحويل عرض السعر إلى صورة عالية الدقة...");

      const dataUrl = await toPng(printRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: previewTheme === "dark" ? "#0f172a" : "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `عرض-سعر-دي-سي-سمارت-${previewQuote.quoteNumber}.png`;
      link.href = dataUrl;
      link.click();

      setExportMessage("✅ تم تحميل الصورة بنجاح!");
      setTimeout(() => setExportMessage(null), 3000);
    } catch (err: any) {
      console.error("Image export error:", err);
      alert("حدث خطأ أثناء تصدير الصورة. يرجى المحاولة مرة أخرى.");
      setExportMessage(null);
    } finally {
      setIsExporting(false);
    }
  };

  // Download Quote as PDF Document
  const handleDownloadPdf = async () => {
    if (!printRef.current || !previewQuote) return;
    try {
      setIsExporting(true);
      setExportMessage("جاري إنشاء وتصدير ملف PDF المعتمد...");

      const dataUrl = await toPng(printRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: previewTheme === "dark" ? "#0f172a" : "#ffffff",
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width mm
      const pageHeight = 297; // A4 height mm
      const imgHeight = (img.height * imgWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`عرض-سعر-دي-سي-سمارت-${previewQuote.quoteNumber}.pdf`);
      setExportMessage("✅ تم تصدير ملف PDF بنجاح!");
      setTimeout(() => setExportMessage(null), 3000);
    } catch (err: any) {
      console.error("PDF export error:", err);
      alert("حدث خطأ أثناء تصدير ملف PDF");
      setExportMessage(null);
    } finally {
      setIsExporting(false);
    }
  };

  // Share as Image via WhatsApp / Native Share (Strictly NO plain text dumps!)
  const handleShareAsImage = async (q: Quote) => {
    if (!printRef.current) return;
    try {
      setIsExporting(true);
      setExportMessage("جاري إعداد صورة عرض السعر للإرسال عبر واتساب...");

      const blob = await toBlob(printRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: previewTheme === "dark" ? "#0f172a" : "#ffffff",
      });

      if (!blob) throw new Error("تعذر إنشاء صورة العرض");

      const file = new File([blob], `عرض-سعر-دي-سي-سمارت-${q.quoteNumber}.png`, {
        type: "image/png",
      });

      // 1. If native share with file is supported (Android/iOS)
      if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `عرض سعر دي سي سمارت — ${q.quoteNumber}`,
          text: `عرض سعر رسمي معتمد من دي سي سمارت للأنظمة الأمنية للعميل: ${q.clientName}`,
        });
        setExportMessage(null);
        return;
      }

      // 2. Desktop Fallback: Copy to Clipboard AND download file automatically
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `عرض-سعر-دي-سي-سمارت-${q.quoteNumber}.png`;
      a.click();

      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        alert(
          "📋 تم نسخ صورة عرض السعر للحافظة وتنزيلها تلقائياً على جهازك! 📥\n\nتم فتح محادثة العميل على واتساب — اضغط الآن (Ctrl + V / لصق) لإرسال صورة عرض السعر مباشرةً دون أي نصوص مكررة."
        );
      } catch (clipErr) {
        alert(
          "📥 تم تنزيل صورة عرض السعر على جهازك بنجاح!\n\nتم فتح محادثة العميل على واتساب — اسحب الصورة وأفلتها في المحادثة لإرسالها مباشرةً."
        );
      }

      // Open WhatsApp chat directly with NO text dump
      openWhatsAppDirect(q.clientPhone);
      setExportMessage(null);
    } catch (err: any) {
      console.error("Share image error:", err);
      alert("حدث خطأ أثناء تصدير الصورة للمشاركة");
      setExportMessage(null);
    } finally {
      setIsExporting(false);
    }
  };

  // Share as PDF via WhatsApp
  const handleShareAsPdf = async (q: Quote) => {
    if (!printRef.current) return;
    try {
      setIsExporting(true);
      setExportMessage("جاري إعداد ملف PDF المعتمد للإرسال عبر واتساب...");

      const dataUrl = await toPng(printRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: previewTheme === "dark" ? "#0f172a" : "#ffffff",
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (img.height * imgWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`عرض-سعر-دي-سي-سمارت-${q.quoteNumber}.pdf`);

      alert(
        "📑 تم إنشاء وتنزيل ملف PDF المعتمد لعرض السعر بنجاح! 📥\n\nتم فتح محادثة العميل على واتساب — اسحب ملف الـ PDF وأفلته في الشات لإرساله مباشرةً للعميل."
      );

      openWhatsAppDirect(q.clientPhone);
      setExportMessage(null);
    } catch (err: any) {
      console.error("Share PDF error:", err);
      alert("حدث خطأ أثناء تجهيز ملف PDF للمشاركة");
      setExportMessage(null);
    } finally {
      setIsExporting(false);
    }
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
                منظومة عروض الأسعار الذكية المعتمدة
              </span>
              <span className="text-xs text-slate-400">| دي سي سمارت — طنطا</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
              <FileText className="text-cyan-400" size={26} />
              <span>مولد وإدارة عروض الأسعار (Quotations)</span>
            </h1>
            <p className="text-xs text-slate-300">
              إنشاء وتعديل عروض أسعار هندسية متكاملة، حفظها كصور عالية الدقة أو PDF معتمد، وإرسالها للعملاء بضغطة زر
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-cyan-500/20">
            <button
              onClick={() => {
                if (editingQuoteId) handleCancelEdit();
                setActiveTab("builder");
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "builder"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Plus size={15} />
              <span>{editingQuoteId ? "متابعة التعديل" : "إنشاء عرض جديد"}</span>
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
            {/* Edit Mode Active Banner */}
            {editingQuoteId && (
              <div className="p-4 rounded-2xl bg-amber-950/60 border-2 border-amber-500/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-amber-950/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Edit3 size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>أنت الآن في وضع تعديل عرض السعر رقم:</span>
                      <span className="font-mono text-amber-300 font-black underline">
                        {editingQuoteNumber}
                      </span>
                    </h3>
                    <p className="text-xs text-amber-200/80">
                      يمكنك تعديل أي بيانات أو إضافة/حذف بنود وتحديث المبالغ، ثم الضغط على زر الحفظ أدناه
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5"
                >
                  <X size={14} />
                  <span>إلغاء التعديل والبدء من جديد</span>
                </button>
              </div>
            )}

            {/* Client & Project Details */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <Building size={16} />
                  <span>بيانات العميل والموقع</span>
                </h3>
                <span className="text-[11px] text-slate-400">الحقول بعلامة (*) مطلوبة للطباعة والواتساب</span>
              </div>

              {/* Quick Customer Picker Bar from CRM */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-inner">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <UserCheck size={14} className="text-cyan-400" />
                      <span>اختيار العميل من دليل العملاء المسجلين (CRM):</span>
                    </label>
                    <span className="text-[10px] text-slate-400">تحميل البيانات تلقائياً</span>
                  </div>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedCustomerId(val);
                      if (val === "NEW") {
                        setIsAddCustomerOpen(true);
                      } else if (val) {
                        const c = customers.find((x) => x.id === val);
                        if (c) {
                          setClientName(c.name);
                          setClientPhone(c.phone);
                          if (c.address) setClientAddress(c.address);
                          if (c.notes) setClientCompany(c.notes);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="">-- اختر عميلاً مسجلاً مسبقاً في النظام --</option>
                    <option value="NEW">➕ تسجيل وإضافة عميل جديد في CRM الآن...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        👤 {c.name} ({c.phone}) {c.city ? `• ${c.city}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 shrink-0 self-end sm:self-auto transition"
                >
                  <Plus size={15} />
                  <span>إضافة عميل جديد 👤</span>
                </button>
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
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">
                    مكونات وبنود المنظومة الأمنية ({items.length} صنف)
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] text-cyan-300 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoSaveNewItems}
                      onChange={(e) => setAutoSaveNewItems(e.target.checked)}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span>تسجيل أي بند يدوي تلقائياً بالكتالوج</span>
                  </label>

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
                      .filter(
                        (p) =>
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
                              {p.brandAr} • {p.category?.nameAr || "معدات ومهمات"}
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
                        <th className="p-3 w-28 text-center">حفظ بالكتالوج</th>
                        <th className="p-3 w-12 text-center">إجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {items.map((it, idx) => (
                        <tr key={it.id || idx} className="hover:bg-slate-950/40">
                          <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={it.name}
                              onChange={(e) => updateItemName(idx, e.target.value)}
                              className="w-full bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-white font-medium focus:border-cyan-500 focus:outline-none"
                            />
                            {it.code && (
                              <span className="block mt-1 font-mono text-[10px] text-cyan-400 font-bold">
                                كود: {it.code}
                              </span>
                            )}
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
                            {it.savedToCatalog || !it.isCustom ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                                <Check size={11} />
                                <span>مسجل بالكتالوج</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenCatalogModal(idx)}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 transition flex items-center justify-center gap-1 mx-auto"
                                title="حفظ هذا البند المخصص كصنف دائم في كتالوج المنتجات وتوليد كود"
                              >
                                <Save size={12} />
                                <span>حفظ بالكتالوج</span>
                              </button>
                            )}
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
                    <span>
                      {loading
                        ? "جاري الحفظ..."
                        : editingQuoteId
                        ? `حفظ التعديلات على عرض السعر (${editingQuoteNumber})`
                        : "حفظ عرض السعر واستخراج الوثيقة الرسمية"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (editingQuoteId) handleCancelEdit();
                      else resetForm();
                    }}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    {editingQuoteId ? "إلغاء التعديل" : "إعادة ضبط"}
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
                                title="معاينة وحفظ العرض"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleStartEdit(q)}
                                className="p-1.5 rounded-lg bg-amber-950/60 text-amber-300 hover:bg-amber-900 border border-amber-500/30 transition"
                                title="تعديل هذا العرض"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setPreviewQuote(q);
                                  setPreviewItems(parsedItems);
                                  setIsPreviewOpen(true);
                                  setTimeout(() => handleShareAsImage(q), 300);
                                }}
                                className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/30 transition"
                                title="إرسال عرض السعر كصورة عبر واتساب"
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
      {/* MODAL 1: SAVE ITEM TO CATALOG */}
      {/* ========================================================================= */}
      {catalogModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Save className="text-cyan-400" size={18} />
                <h3 className="text-sm font-bold text-white">تسجيل صنف جديد في الكتالوج</h3>
              </div>
              <button
                onClick={() => setCatalogModalItem(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              سيتم تسجيل هذا البند رسمياً في قاعدة بيانات المنتجات وسيتم توليد كود خاص به (DCS-XXXX) ليتوفر دائماً في قائمة الأصناف وعروض الأسعار القادمة.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم الصنف والموديل *</label>
                <input
                  type="text"
                  value={catalogModalItem.name}
                  onChange={(e) =>
                    setCatalogModalItem({ ...catalogModalItem, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الماركة / العلامة التجارية</label>
                <input
                  type="text"
                  value={catalogModalItem.brand}
                  onChange={(e) =>
                    setCatalogModalItem({ ...catalogModalItem, brand: e.target.value })
                  }
                  placeholder="مثال: داهوا Dahua أو يوني آرك أو دي سي سمارت"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">القسم / التصنيف</label>
                <select
                  value={catalogModalItem.categoryId}
                  onChange={(e) =>
                    setCatalogModalItem({ ...catalogModalItem, categoryId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:border-cyan-500 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameAr}
                    </option>
                  ))}
                  {categories.length === 0 && (
                    <option value="cat_accessories">إكسسوارات ومستلزمات تركيب</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">سعر الوحدة (ج.م) *</label>
                <input
                  type="number"
                  min={0}
                  value={catalogModalItem.price}
                  onChange={(e) =>
                    setCatalogModalItem({
                      ...catalogModalItem,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-bold font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الوصف الفني والمواصفات</label>
                <input
                  type="text"
                  value={catalogModalItem.specs}
                  onChange={(e) =>
                    setCatalogModalItem({ ...catalogModalItem, specs: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCatalogModalItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={catalogModalLoading}
                onClick={handleSaveItemToCatalog}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save size={14} />
                <span>{catalogModalLoading ? "جاري الحفظ..." : "تأكيد الحفظ بالكتالوج"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: OFFICIAL PRINTABLE QUOTATION (FIXED HEADER & EXPORT AS IMAGE/PDF) */}
      {/* ========================================================================= */}
      {isPreviewOpen && previewQuote && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-2 sm:p-6 print:p-0 print:bg-white print:static">
          <div className="w-full max-w-4xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl my-4 sm:my-8 overflow-hidden print:border-none print:shadow-none print:w-full print:max-w-none print:bg-white print:text-black print:my-0">
            {/* Sticky Modal Controls Bar (Always Visible at Top) */}
            <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 bg-slate-950/95 backdrop-blur border-b border-cyan-500/30 print:hidden shadow-lg">
              <div className="flex items-center gap-2">
                <FileText className="text-cyan-400" size={20} />
                <div>
                  <span className="font-bold text-white text-xs block">
                    عرض سعر رسمي معتمد: {previewQuote.quoteNumber}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    العميل: {previewQuote.clientName}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => handleStartEdit(previewQuote)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition flex items-center gap-1.5"
                  title="تعديل هذا العرض في شاشة التحرير"
                >
                  <Edit3 size={14} />
                  <span className="hidden sm:inline">تعديل العرض</span>
                </button>

                {/* Theme Toggle (Dark VIP / Clean White) */}
                <button
                  type="button"
                  onClick={() => setPreviewTheme(previewTheme === "dark" ? "light" : "dark")}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="تبديل مظهر العرض بين الداكن والأبيض"
                >
                  {previewTheme === "dark" ? "🌙 داكن فاخر" : "☀️ أبيض رسمي"}
                </button>

                {/* Save as High-Res PNG Image */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownloadImage}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 disabled:opacity-50"
                  title="تنزيل عرض السعر كصورة عالية الدقة PNG"
                >
                  <ImageIcon size={14} />
                  <span>حفظ كصورة</span>
                </button>

                {/* Download as PDF */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownloadPdf}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition flex items-center gap-1.5 disabled:opacity-50"
                  title="تحميل عرض السعر كملف PDF معتمد"
                >
                  <Download size={14} />
                  <span>تحميل PDF</span>
                </button>

                {/* Share as Image to WhatsApp */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleShareAsImage(previewQuote)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 disabled:opacity-50 shadow-md"
                  title="إرسال صورة العرض عبر واتساب للعميل (صورة فقط بدون نصوص)"
                >
                  <Share2 size={14} />
                  <span>واتساب (صورة) 🖼️</span>
                </button>

                {/* Share as PDF to WhatsApp */}
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => handleShareAsPdf(previewQuote)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition flex items-center gap-1.5 disabled:opacity-50 shadow-md"
                  title="إرسال ملف PDF معتمد عبر واتساب للعميل"
                >
                  <FileText size={14} />
                  <span>واتساب (PDF) 📑</span>
                </button>

                {/* Native Browser Print */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center gap-1.5"
                  title="طباعة عبر المتصفح"
                >
                  <Printer size={14} />
                  <span className="hidden sm:inline">طباعة</span>
                </button>

                {/* Close Modal */}
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Exporting Progress Toast */}
            {exportMessage && (
              <div className="bg-cyan-500 text-slate-950 text-xs font-bold px-4 py-2 text-center animate-pulse print:hidden">
                {exportMessage}
              </div>
            )}

            {/* Printable & Exportable A4 Quotation Sheet */}
            <div
              ref={printRef}
              dir="rtl"
              className={`p-6 sm:p-10 transition-colors text-right space-y-6 ${
                previewTheme === "dark"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-900"
              } print:bg-white print:text-black print:p-6 print:space-y-4`}
              style={{ minHeight: "800px" }}
            >
              {/* Official Header (Fully Visible & Symmetrical) */}
              <div
                className={`flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b-2 ${
                  previewTheme === "dark"
                    ? "border-cyan-500/60 bg-slate-950/40"
                    : "border-slate-900 bg-slate-50"
                } p-5 rounded-2xl print:border-black print:bg-transparent print:p-0 print:pb-4`}
              >
                {/* Brand & Slogan */}
                <div className="flex items-center gap-4 text-center sm:text-right">
                  <div
                    className={`w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg border border-cyan-500/40 shrink-0 ${
                      previewTheme === "dark"
                        ? "bg-slate-950"
                        : "bg-slate-100"
                    } print:border-2 print:border-black`}
                  >
                    <img
                      src="/logo.jpg"
                      alt="DC Smart Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h2
                      className={`text-xl sm:text-2xl font-black tracking-tight ${
                        previewTheme === "dark" ? "text-white" : "text-slate-900"
                      } print:text-black`}
                    >
                      دي سي سمارت — للأنظمة الأمنية والتحكم الذكي
                    </h2>
                    <p
                      className={`text-xs font-bold font-mono ${
                        previewTheme === "dark" ? "text-cyan-400" : "text-cyan-700"
                      } print:text-gray-800`}
                    >
                      Smart Security & Technology Solutions
                    </p>
                    <div
                      className={`text-[11px] font-medium flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 ${
                        previewTheme === "dark" ? "text-slate-300" : "text-slate-600"
                      } print:text-gray-700`}
                    >
                      <span>📍 طنطا — محافظة الغربية</span>
                      <span>📞 مبيعات: 01008657085</span>
                      <span>💬 دعم: 01281248731</span>
                    </div>
                  </div>
                </div>

                {/* Quotation Metadata Card */}
                <div className="text-center sm:text-left space-y-1.5 shrink-0">
                  <div
                    className={`px-4 py-2 rounded-xl font-mono font-black text-sm tracking-wider shadow-inner ${
                      previewTheme === "dark"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "bg-slate-100 text-slate-900 border border-slate-300"
                    } print:border-2 print:border-black print:text-black print:bg-transparent`}
                  >
                    {previewQuote.quoteNumber}
                  </div>
                  <p
                    className={`text-[11px] font-medium ${
                      previewTheme === "dark" ? "text-slate-400" : "text-slate-600"
                    } print:text-gray-700`}
                  >
                    تاريخ التحرير:{" "}
                    <span className="font-bold">
                      {new Date(previewQuote.createdAt).toLocaleDateString("ar-EG")}
                    </span>
                  </p>
                  <p
                    className={`text-[11px] font-medium ${
                      previewTheme === "dark" ? "text-slate-400" : "text-slate-600"
                    } print:text-gray-700`}
                  >
                    صالح حتى:{" "}
                    <span className="font-bold text-amber-500 print:text-black">
                      {previewQuote.validUntil
                        ? new Date(previewQuote.validUntil).toLocaleDateString("ar-EG")
                        : "15 يوماً من تاريخه"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Client Specification Card */}
              <div
                className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border text-xs ${
                  previewTheme === "dark"
                    ? "bg-slate-950/70 border-slate-800"
                    : "bg-slate-50 border-slate-200"
                } print:bg-gray-50 print:border-gray-400 print:text-black`}
              >
                <div>
                  <span
                    className={`block text-[10px] font-medium ${
                      previewTheme === "dark" ? "text-slate-400" : "text-slate-500"
                    } print:text-gray-600`}
                  >
                    العميل الكريم:
                  </span>
                  <span className="font-bold">{previewQuote.clientName}</span>
                </div>

                <div>
                  <span
                    className={`block text-[10px] font-medium ${
                      previewTheme === "dark" ? "text-slate-400" : "text-slate-500"
                    } print:text-gray-600`}
                  >
                    رقم الهاتف / الواتساب:
                  </span>
                  <span className="font-bold font-mono">{previewQuote.clientPhone}</span>
                </div>

                <div>
                  <span
                    className={`block text-[10px] font-medium ${
                      previewTheme === "dark" ? "text-slate-400" : "text-slate-500"
                    } print:text-gray-600`}
                  >
                    نوع المشروع / المنشأة:
                  </span>
                  <span className="font-bold">{previewQuote.projectType}</span>
                </div>

                <div>
                  <span
                    className={`block text-[10px] font-medium ${
                      previewTheme === "dark" ? "text-slate-400" : "text-slate-500"
                    } print:text-gray-600`}
                  >
                    موقع التركيب:
                  </span>
                  <span className="font-bold">
                    {previewQuote.clientAddress || "طنطا — محافظة الغربية"}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div
                className={`overflow-hidden rounded-xl border ${
                  previewTheme === "dark" ? "border-slate-800" : "border-slate-300"
                } print:border-black`}
              >
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr
                      className={`font-bold border-b ${
                        previewTheme === "dark"
                          ? "bg-slate-950 text-cyan-400 border-slate-800"
                          : "bg-slate-100 text-slate-900 border-slate-300"
                      } print:bg-gray-200 print:text-black print:border-black`}
                    >
                      <th className="p-3 w-10 text-center">#</th>
                      <th className="p-3">الصنف والموديل</th>
                      <th className="p-3">المواصفات الفنية والملاحظات</th>
                      <th className="p-3 w-16 text-center">الكمية</th>
                      <th className="p-3 w-28 text-center">سعر الوحدة</th>
                      <th className="p-3 w-32 text-center">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      previewTheme === "dark" ? "divide-slate-800" : "divide-slate-200"
                    } print:divide-gray-300 print:text-black`}
                  >
                    {previewItems.map((it, idx) => (
                      <tr
                        key={it.id || idx}
                        className={`${
                          idx % 2 === 0
                            ? previewTheme === "dark"
                              ? "bg-slate-900/50"
                              : "bg-white"
                            : previewTheme === "dark"
                            ? "bg-slate-950/30"
                            : "bg-slate-50"
                        } print:bg-transparent`}
                      >
                        <td
                          className={`p-3 text-center font-mono ${
                            previewTheme === "dark" ? "text-slate-400" : "text-slate-600"
                          } print:text-gray-800`}
                        >
                          {idx + 1}
                        </td>
                        <td className="p-3">
                          <p className="font-bold">{it.name}</p>
                          {it.code && (
                            <span className="font-mono text-[10px] text-cyan-400 print:text-gray-600 font-bold">
                              كود: {it.code}
                            </span>
                          )}
                        </td>
                        <td
                          className={`p-3 text-[11px] ${
                            previewTheme === "dark" ? "text-slate-300" : "text-slate-600"
                          } print:text-gray-800`}
                        >
                          {it.specs || it.category || "أصلي معتمد"}
                        </td>
                        <td className="p-3 text-center font-bold font-mono">{it.quantity}</td>
                        <td className="p-3 text-center font-mono font-medium">
                          {it.unitPrice.toLocaleString()} ج.م
                        </td>
                        <td
                          className={`p-3 text-center font-black font-mono ${
                            previewTheme === "dark" ? "text-cyan-300" : "text-slate-900"
                          } print:text-black`}
                        >
                          {it.total.toLocaleString()} ج.م
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals */}
              <div className="flex justify-end">
                <div
                  className={`w-full sm:w-88 space-y-2 p-4 rounded-xl border text-xs ${
                    previewTheme === "dark"
                      ? "bg-slate-950/60 border-slate-800"
                      : "bg-slate-50 border-slate-200"
                  } print:bg-transparent print:border-gray-400 print:text-black`}
                >
                  <div
                    className={`flex justify-between py-1 border-b ${
                      previewTheme === "dark"
                        ? "border-slate-800 text-slate-300"
                        : "border-slate-200 text-slate-700"
                    } print:border-gray-300 print:text-black`}
                  >
                    <span>مجموع المهمات والمعدات:</span>
                    <span className="font-mono font-bold">
                      {previewQuote.subtotal.toLocaleString()} ج.م
                    </span>
                  </div>

                  <div
                    className={`flex justify-between py-1 border-b ${
                      previewTheme === "dark"
                        ? "border-slate-800 text-slate-300"
                        : "border-slate-200 text-slate-700"
                    } print:border-gray-300 print:text-black`}
                  >
                    <span>مصنعية التركيب والبرمجة والتوصيل:</span>
                    <span className="font-mono font-bold">
                      {previewQuote.installationFee.toLocaleString()} ج.م
                    </span>
                  </div>

                  {previewQuote.discount > 0 && (
                    <div
                      className={`flex justify-between py-1 border-b ${
                        previewTheme === "dark"
                          ? "border-slate-800 text-rose-400"
                          : "border-slate-200 text-red-600"
                      } font-bold print:border-gray-300 print:text-black`}
                    >
                      <span>خصم خاص:</span>
                      <span className="font-mono">
                        -{previewQuote.discount.toLocaleString()} ج.م
                      </span>
                    </div>
                  )}

                  {previewQuote.tax > 0 && (
                    <div
                      className={`flex justify-between py-1 border-b ${
                        previewTheme === "dark"
                          ? "border-slate-800 text-slate-300"
                          : "border-slate-200 text-slate-700"
                      } print:border-gray-300 print:text-black`}
                    >
                      <span>ضريبة القيمة المضافة:</span>
                      <span className="font-mono">
                        +{previewQuote.tax.toLocaleString()} ج.م
                      </span>
                    </div>
                  )}

                  <div
                    className={`flex justify-between items-center py-2.5 px-3.5 rounded-xl font-black text-sm ${
                      previewTheme === "dark"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "bg-slate-900 text-white"
                    } print:bg-gray-100 print:border-2 print:border-black print:text-black`}
                  >
                    <span>الإجمالي النهائي المستحق:</span>
                    <span className="font-mono text-base">
                      {previewQuote.totalAmount.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              </div>

              {/* Warranty & Terms Section */}
              <div
                className={`p-4 rounded-xl border space-y-2 text-[11px] leading-relaxed ${
                  previewTheme === "dark"
                    ? "bg-slate-950/60 border-slate-800 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                } print:bg-gray-50 print:border-gray-400 print:text-black`}
              >
                <div
                  className={`font-bold flex items-center gap-1.5 ${
                    previewTheme === "dark" ? "text-cyan-400" : "text-cyan-800"
                  } print:text-black`}
                >
                  <ShieldCheck size={14} />
                  <span>الضمان المعتمد:</span>
                </div>
                <p>{previewQuote.warrantyPeriod}</p>

                <div
                  className={`font-bold pt-1 ${
                    previewTheme === "dark" ? "text-cyan-400" : "text-cyan-800"
                  } print:text-black`}
                >
                  شروط التنفيذ والدفع:
                </div>
                <p>{previewQuote.terms}</p>

                {previewQuote.notes && (
                  <div
                    className={`pt-1 ${
                      previewTheme === "dark" ? "text-slate-400" : "text-slate-600"
                    } print:text-gray-700`}
                  >
                    <span className="font-bold">ملاحظات:</span> {previewQuote.notes}
                  </div>
                )}
              </div>

              {/* Signatures Line */}
              <div
                className={`grid grid-cols-2 gap-8 pt-6 border-t ${
                  previewTheme === "dark" ? "border-slate-800" : "border-slate-200"
                } print:border-gray-400 text-xs`}
              >
                <div className="space-y-6">
                  <p className="font-bold">توقيع واعتماد العميل:</p>
                  <p
                    className={`border-b border-dashed w-48 ${
                      previewTheme === "dark" ? "border-slate-700" : "border-slate-400"
                    } print:border-black`}
                  ></p>
                </div>
                <div className="text-left space-y-6">
                  <p className="font-bold">إدارة شركة دي سي سمارت:</p>
                  <p
                    className={`border-b border-dashed w-48 mr-auto ${
                      previewTheme === "dark" ? "border-slate-700" : "border-slate-400"
                    } print:border-black`}
                  ></p>
                </div>
              </div>

              {/* Developer Watermark with user phone number */}
              <div
                className={`pt-4 text-center border-t text-[11px] font-bold ${
                  previewTheme === "dark"
                    ? "border-slate-800/80 text-cyan-400"
                    : "border-slate-200 text-cyan-800"
                } print:border-gray-200 print:text-gray-800`}
              >
                تم التطوير بواسطة شركة أوركا لتقنية المعلومات — 01018671000
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Quick Add Client Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                <UserCheck size={18} />
                <span>إضافة وتسجيل عميل جديد في CRM</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleQuickSaveCustomer} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم العميل أو المنشأة *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="مثال: أستاذ أحمد الشناوي"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">رقم الهاتف / الواتساب *</label>
                  <input
                    type="tel"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">المدينة / المحافظة</label>
                  <input
                    type="text"
                    value={newCustCity}
                    onChange={(e) => setNewCustCity(e.target.value)}
                    placeholder="طنطا"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">عنوان المنشأة أو موقع التركيب</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="شارع الجيش / المحطة"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم الشركة أو ملاحظات</label>
                <input
                  type="text"
                  value={newCustCompany}
                  onChange={(e) => setNewCustCompany(e.target.value)}
                  placeholder="مثال: شركة الدلتا للتجارة"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-cyan-500"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={savingCustomer}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition"
                >
                  {savingCustomer ? "جاري الحفظ..." : "حفظ واختيار العميل في عرض السعر فوراً 👤"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
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
