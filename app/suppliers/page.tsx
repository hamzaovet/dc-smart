"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import { useStaff } from "@/context/StaffContext";
import SecurityPinModal from "@/components/SecurityPinModal";
import {
  Handshake,
  Plus,
  Search,
  RefreshCw,
  Building2,
  Phone,
  MapPin,
  FileText,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Receipt,
  RotateCcw,
  CreditCard,
  Calendar,
  X,
  Check,
  AlertCircle,
  Truck,
  Package,
  Layers,
  Sparkles,
  Printer,
  ChevronDown,
  Edit2,
  Trash2,
  Eye,
  ListOrdered,
  FileSpreadsheet,
} from "lucide-react";

interface Supplier {
  id: string;
  name: string;
  phone: string;
  company?: string | null;
  category: string;
  address?: string | null;
  openingBalance: number;
  totalPurchases: number;
  totalPaid: number;
  currentBalance: number;
  notes?: string | null;
  createdAt: string;
  purchases?: any[];
  payments?: any[];
  returns?: any[];
}

interface PurchaseItemLine {
  name: string;
  category: string;
  unit: string;
  quantity: number;
  costPerUnit: number;
}

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplier: Supplier;
  items: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: string;
  notes?: string | null;
  recordedBy?: string | null;
  invoiceDate: string;
  createdAt: string;
}

interface SupplierPayment {
  id: string;
  paymentNumber: string;
  supplierId: string;
  supplier: Supplier;
  amount: number;
  paymentMethod: string;
  notes?: string | null;
  recordedBy?: string | null;
  paymentDate: string;
}

interface PurchaseReturn {
  id: string;
  returnNumber: string;
  supplierId: string;
  supplier: Supplier;
  items: string;
  totalRefund: number;
  refundMethod: string;
  reason: string;
  notes?: string | null;
  recordedBy?: string | null;
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
];

const DEFAULT_SUPPLIER_CATEGORIES = [
  "كاميرات مراقبة وأجهزة تسجيل (Dahua / Hikvision / Uniarch / UNV)",
  "كابلات شبكات ومحاور ووصلات BNC وجاكات باور",
  "هارد ديسك وتخزين وراكات تجميع RACK",
  "باور سبلاي ومحولات مركزية ومهمات كهرباء",
  "شاشات مراقبة وسويتشات PoE وأجهزة شبكات",
  "بوابات أمنية وأجهزة إنذار وحضور وانصراف",
  "مهمات واكسسوارات تركيب (بواطات ومواسير وفيتنج)",
];

export default function SuppliersPage() {
  const { currentUser } = useStaff();
  const [activeTab, setActiveTab] = useState<"suppliers" | "invoices" | "payments" | "returns">("suppliers");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [payments, setPayments] = useState<SupplierPayment[]>([]);
  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isAddReturnOpen, setIsAddReturnOpen] = useState(false);
  const [statementSupplier, setStatementSupplier] = useState<any | null>(null);
  const [statementMode, setStatementMode] = useState<"summary" | "detailed">("summary");

  // View / Print Invoice Modal
  const [viewingInvoice, setViewingInvoice] = useState<PurchaseInvoice | null>(null);

  // Edit Invoice Modal
  const [editingInvoice, setEditingInvoice] = useState<PurchaseInvoice | null>(null);
  const [editLines, setEditLines] = useState<PurchaseItemLine[]>([]);
  const [editPaid, setEditPaid] = useState("0");
  const [editMethod, setEditMethod] = useState("CASH");
  const [savingEdit, setSavingEdit] = useState(false);

  // Security PIN Modal
  const [pinAction, setPinAction] = useState<(() => void) | null>(null);
  const [isPinOpen, setIsPinOpen] = useState(false);

  // Add Supplier Form
  const [supName, setSupName] = useState("");
  const [supPhone, setSupPhone] = useState("");
  const [supCompany, setSupCompany] = useState("");
  const [supCategory, setSupCategory] = useState("كاميرات مراقبة وأجهزة تسجيل (Dahua / Hikvision / Uniarch / UNV)");
  const [supAddress, setSupAddress] = useState("");
  const [supOpeningBal, setSupOpeningBal] = useState("0");
  const [supNotes, setSupNotes] = useState("");
  const [savingSupplier, setSavingSupplier] = useState(false);

  // Add Purchase Invoice Form (Multi-Items Lines)
  const [invSupplierId, setInvSupplierId] = useState("");
  const [purchaseLines, setPurchaseLines] = useState<PurchaseItemLine[]>([
    {
      name: "",
      category: "كاميرات مراقبة وأجهزة تسجيل",
      unit: "قطعة",
      quantity: 1,
      costPerUnit: 0,
    },
  ]);
  const [invPaid, setInvPaid] = useState("0");
  const [invMethod, setInvMethod] = useState("CASH");
  const [invAutoStock, setInvAutoStock] = useState(true);
  const [invNotes, setInvNotes] = useState("");
  const [savingInvoice, setSavingInvoice] = useState(false);

  // Add Supplier Payment Form
  const [paySupplierId, setPaySupplierId] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("CASH");
  const [payNotes, setPayNotes] = useState("");
  const [savingPayment, setSavingPayment] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resSup, resInv, resPay, resRet] = await Promise.all([
        fetch("/api/suppliers"),
        fetch("/api/purchases"),
        fetch("/api/supplier-payments"),
        fetch("/api/purchase-returns"),
      ]);

      const dataSup = await resSup.json();
      const dataInv = await resInv.json();
      const dataPay = await resPay.json();
      const dataRet = await resRet.json();

      setSuppliers(dataSup.suppliers || []);
      setInvoices(dataInv.invoices || []);
      setPayments(dataPay.payments || []);
      setReturns(dataRet.returns || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Manage Purchase Lines
  const handleAddPurchaseLine = () => {
    setPurchaseLines((prev) => [
      ...prev,
      {
        name: "",
        category: "كاميرات مراقبة وأجهزة تسجيل",
        unit: "قطعة",
        quantity: 1,
        costPerUnit: 0,
      },
    ]);
  };

  const handleRemovePurchaseLine = (idx: number) => {
    if (purchaseLines.length <= 1) return;
    setPurchaseLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePurchaseLineChange = (idx: number, field: keyof PurchaseItemLine, val: any) => {
    setPurchaseLines((prev) =>
      prev.map((line, i) => (i === idx ? { ...line, [field]: val } : line))
    );
  };

  const invoiceTotalAmount = purchaseLines.reduce(
    (sum, line) => sum + (line.quantity || 0) * (line.costPerUnit || 0),
    0
  );

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim() || !supPhone.trim()) return;
    setSavingSupplier(true);
    playSound("click");

    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: supName.trim(),
          phone: supPhone.trim(),
          company: supCompany.trim() || null,
          category: supCategory.trim(),
          address: supAddress.trim() || null,
          openingBalance: Number(supOpeningBal) || 0,
          notes: supNotes.trim() || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setSuppliers((prev) => [data.supplier, ...prev]);
        setIsAddSupplierOpen(false);
        setSupName("");
        setSupPhone("");
        setSupCompany("");
        setSupAddress("");
        setSupOpeningBal("0");
        setSupNotes("");
      } else {
        alert(data.error || "فشل إضافة المورد");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSavingSupplier(false);
    }
  };

  const handleCreatePurchaseInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invSupplierId || invoiceTotalAmount <= 0) {
      alert("يرجى اختيار المورد وإضافة بنود بمبالغ صحيحة");
      return;
    }
    setSavingInvoice(true);
    playSound("click");

    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: invSupplierId,
          items: purchaseLines,
          totalAmount: invoiceTotalAmount,
          paidAmount: Number(invPaid) || 0,
          paymentMethod: invMethod,
          autoStock: invAutoStock,
          notes: invNotes.trim() || null,
          recordedBy: currentUser?.name || "المايسترو",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setInvoices((prev) => [data.invoice, ...prev]);
        setIsAddInvoiceOpen(false);
        // Refresh supplier balances
        fetchAllData();
        // Reset lines
        setPurchaseLines([
          { name: "", category: "كاميرات مراقبة وأجهزة تسجيل", unit: "قطعة", quantity: 1, costPerUnit: 0 },
        ]);
        setInvPaid("0");
        setInvNotes("");
      } else {
        alert(data.error || "فشل حفظ فاتورة الشراء");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSavingInvoice(false);
    }
  };

  const handleOpenEditInvoice = (inv: PurchaseInvoice) => {
    setPinAction(() => () => {
      setEditingInvoice(inv);
      try {
        const parsed = typeof inv.items === "string" ? JSON.parse(inv.items) : inv.items;
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEditLines(
            parsed.map((p: any) => ({
              name: p.name || "",
              category: p.category || "كاميرات وأجهزة تسجيل",
              unit: p.unit || "قطعة",
              quantity: Number(p.quantity || 1),
              costPerUnit: Number(p.costPerUnit || p.unitCost || 0),
            }))
          );
        } else {
          setEditLines([
            { name: "بند فاتورة", category: "عام", unit: "قطعة", quantity: 1, costPerUnit: inv.totalAmount },
          ]);
        }
      } catch {
        setEditLines([
          { name: "بند فاتورة", category: "عام", unit: "قطعة", quantity: 1, costPerUnit: inv.totalAmount },
        ]);
      }
      setEditPaid(inv.paidAmount.toString());
      setEditMethod(inv.paymentMethod || "CASH");
    });
    setIsPinOpen(true);
  };

  const handleSaveEditInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;
    setSavingEdit(true);
    playSound("click");

    const total = editLines.reduce(
      (sum, l) => sum + (l.quantity || 0) * (l.costPerUnit || 0),
      0
    );

    try {
      const res = await fetch("/api/purchases", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingInvoice.id,
          items: editLines,
          totalAmount: total,
          paidAmount: Number(editPaid) || 0,
          paymentMethod: editMethod,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setEditingInvoice(null);
        fetchAllData();
      } else {
        alert(data.error || "فشل تعديل الفاتورة");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تعديل الفاتورة");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteInvoice = (id: string, invNum: string) => {
    setPinAction(() => async () => {
      if (!confirm(`هل أنت متأكد من حذف الفاتورة (#${invNum}) وتعديل رصيد المورد تلقائياً؟`)) return;
      playSound("trash");
      try {
        const res = await fetch(`/api/purchases?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok && data.success) {
          playSound("success");
          setInvoices((prev) => prev.filter((i) => i.id !== id));
          fetchAllData();
        } else {
          alert(data.error || "فشل حذف الفاتورة");
        }
      } catch (err) {
        console.error(err);
      }
    });
    setIsPinOpen(true);
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paySupplierId || !payAmount) return;
    setSavingPayment(true);
    playSound("click");

    try {
      const res = await fetch("/api/supplier-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: paySupplierId,
          amount: Number(payAmount),
          paymentMethod: payMethod,
          notes: payNotes.trim() || null,
          recordedBy: currentUser?.name || "المايسترو",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setPayments((prev) => [data.payment, ...prev]);
        setIsAddPaymentOpen(false);
        setPayAmount("");
        setPayNotes("");
        fetchAllData();
      } else {
        alert(data.error || "فشل تسجيل سند السداد");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSavingPayment(false);
    }
  };

  // Calculations
  const totalDebtOnCompany = suppliers.reduce((sum, s) => sum + (s.currentBalance || 0), 0);
  const totalPurchasesAll = suppliers.reduce((sum, s) => sum + (s.totalPurchases || 0), 0);
  const totalPaidAll = suppliers.reduce((sum, s) => sum + (s.totalPaid || 0), 0);

  return (
    <ErpLayout activeItem="suppliers">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-cyan-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Handshake size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold font-serif text-cyan-400">
                إدارة الموردين وفواتير الشراء والتوريدات
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                فواتير الشراء المجمعة متعددة البنود، كشوفات الحسابات المجمعة والتفصيلية، وسندات السداد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddInvoiceOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
            >
              <Package size={15} />
              <span>+ تسجيل فاتورة شراء جديدة</span>
            </button>

            <button
              onClick={() => setIsAddSupplierOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
            >
              <Plus size={15} />
              <span>إضافة مورد جديد</span>
            </button>

            <button
              onClick={() => setIsAddPaymentOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
            >
              <DollarSign size={15} />
              <span>سند سداد لمورد</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">إجمالي المشتريات والتوريدات</span>
              <h3 className="text-2xl font-black font-mono text-zinc-100 mt-1">
                {totalPurchasesAll.toLocaleString()} <span className="text-xs font-normal text-zinc-400 font-sans">ج.م</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Package size={20} />
            </div>
          </div>

          <div className="bg-[#0c0914] border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">إجمالي المسدد للموردين</span>
              <h3 className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {totalPaidAll.toLocaleString()} <span className="text-xs font-normal text-zinc-400 font-sans">ج.م</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp size={20} />
            </div>
          </div>

          <div className="bg-[#0c0914] border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">إجمالي الديون المستحقة للموردين</span>
              <h3 className="text-2xl font-black font-mono text-rose-400 mt-1">
                {totalDebtOnCompany.toLocaleString()} <span className="text-xs font-normal text-zinc-400 font-sans">ج.م</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <TrendingDown size={20} />
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 text-xs">
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "suppliers"
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <Handshake size={14} />
            <span>دليل الموردين ({suppliers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "invoices"
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <Receipt size={14} />
            <span>فواتير الشراء والتوريد ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === "payments"
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <DollarSign size={14} />
            <span>سندات السداد والصرف ({payments.length})</span>
          </button>
        </div>

        {/* TAB 1: Suppliers Directory */}
        {activeTab === "suppliers" && (
          <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">اسم المورد / المسؤول</th>
                    <th className="py-3 px-4">الشركة / التوكيل</th>
                    <th className="py-3 px-4">رقم الهاتف</th>
                    <th className="py-3 px-4">التصنيف</th>
                    <th className="py-3 px-4">إجمالي التوريدات</th>
                    <th className="py-3 px-4">المسدد</th>
                    <th className="py-3 px-4">الرصيد المستحق</th>
                    <th className="py-3 px-4 text-center">كشف الحساب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {suppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-zinc-100">
                        {s.name}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {s.company || "—"}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                        {s.phone}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
                          {s.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-200">
                        {(s.totalPurchases || 0).toLocaleString()} ج.م
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400">
                        {(s.totalPaid || 0).toLocaleString()} ج.م
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-400">
                        {(s.currentBalance || 0).toLocaleString()} ج.م
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setStatementSupplier(s);
                            setStatementMode("summary");
                          }}
                          className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition flex items-center gap-1 mx-auto"
                        >
                          <FileText size={13} />
                          <span>كشف حساب</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Purchase Invoices (Multi-Item Supported, View/Print, Edit) */}
        {activeTab === "invoices" && (
          <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">رقم الفاتورة</th>
                    <th className="py-3 px-4">المورد</th>
                    <th className="py-3 px-4">الأصناف الموردة</th>
                    <th className="py-3 px-4">إجمالي الفاتورة</th>
                    <th className="py-3 px-4">المدفوع</th>
                    <th className="py-3 px-4">المتبقي (آجل)</th>
                    <th className="py-3 px-4">طريقة الدفع</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4 text-center">إجراءات الفاتورة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {invoices.map((inv) => {
                    let itemsCount = 1;
                    let summaryText = "";
                    try {
                      const parsed = JSON.parse(inv.items);
                      if (Array.isArray(parsed)) {
                        itemsCount = parsed.length;
                        summaryText = parsed.map((p) => `${p.name || p.nameAr} × ${p.quantity} ${p.unit || "قطعة"}`).join("، ");
                      }
                    } catch {
                      summaryText = inv.items;
                    }

                    return (
                      <tr key={inv.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-zinc-200">
                          {inv.supplier?.name || "مورد"}
                        </td>
                        <td className="py-3 px-4 text-zinc-300 max-w-xs truncate" title={summaryText}>
                          <span className="font-bold text-cyan-400">{itemsCount} بنود: </span>
                          <span className="text-zinc-400">{summaryText}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-zinc-100">
                          {inv.totalAmount.toLocaleString()} ج.م
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                          {inv.paidAmount.toLocaleString()} ج.م
                        </td>
                        <td className="py-3 px-4 font-mono text-rose-400 font-bold">
                          {inv.remainingAmount.toLocaleString()} ج.م
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
                            {inv.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                          {new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setViewingInvoice(inv)}
                              title="معاينة وطباعة الفاتورة A4"
                              className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition"
                            >
                              <Printer size={13} />
                            </button>
                            <button
                              onClick={() => handleOpenEditInvoice(inv)}
                              title="تعديل الفاتورة (محمي بالباسورد)"
                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNumber)}
                              title="حذف الفاتورة (محمي بالباسورد)"
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

        {/* TAB 3: Payments */}
        {activeTab === "payments" && (
          <div className="bg-[#0c0914] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">رقم السند</th>
                    <th className="py-3 px-4">المورد</th>
                    <th className="py-3 px-4">المبلغ المسدد</th>
                    <th className="py-3 px-4">طريقة السداد</th>
                    <th className="py-3 px-4">ملاحظات</th>
                    <th className="py-3 px-4">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">{p.paymentNumber}</td>
                      <td className="py-3 px-4 font-bold text-zinc-200">{p.supplier?.name}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-300">{p.amount.toLocaleString()} ج.م</td>
                      <td className="py-3 px-4">{p.paymentMethod}</td>
                      <td className="py-3 px-4 text-zinc-400">{p.notes || "—"}</td>
                      <td className="py-3 px-4 font-mono text-zinc-500">{new Date(p.paymentDate).toLocaleDateString("ar-EG")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL 1: Add Supplier Modal with Custom Category */}
        {isAddSupplierOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1422] border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn text-right text-slate-100">
              <button onClick={() => setIsAddSupplierOpen(false)} className="absolute left-4 top-4 text-zinc-400 hover:text-white p-1">
                <X size={18} />
              </button>

              <h3 className="font-bold text-base text-cyan-400 mb-4 flex items-center gap-2">
                <Handshake size={18} />
                <span>إضافة مورد / شريك توريد جديد</span>
              </h3>

              <form onSubmit={handleCreateSupplier} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم المورد أو المسؤول *:</label>
                  <input
                    type="text"
                    required
                    value={supName}
                    onChange={(e) => setSupName(e.target.value)}
                    placeholder="مثال: م إسماعيل / شركة بلو ستار"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">رقم الهاتف *:</label>
                    <input
                      type="text"
                      required
                      value={supPhone}
                      onChange={(e) => setSupPhone(e.target.value)}
                      placeholder="010xxxxxxxx"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">اسم الشركة / التوكيل:</label>
                    <input
                      type="text"
                      value={supCompany}
                      onChange={(e) => setSupCompany(e.target.value)}
                      placeholder="blue star"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">التصنيف (اختر أو اكتب جديد بالكامل):</label>
                  <input
                    type="text"
                    list="supplier-cat-suggestions"
                    required
                    value={supCategory}
                    onChange={(e) => setSupCategory(e.target.value)}
                    placeholder="اكتب تصنيف جديد أو اختر..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                  <datalist id="supplier-cat-suggestions">
                    {DEFAULT_SUPPLIER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">العنوان أو المقر:</label>
                    <input
                      type="text"
                      value={supAddress}
                      onChange={(e) => setSupAddress(e.target.value)}
                      placeholder="طنطا / القاهرة"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">رصيد أول المدة (مديونية سابقة):</label>
                    <input
                      type="number"
                      value={supOpeningBal}
                      onChange={(e) => setSupOpeningBal(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={savingSupplier}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs"
                  >
                    {savingSupplier ? "جاري الحفظ..." : "حفظ المورد في الدليل"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddSupplierOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Add Multi-Items Purchase Invoice Modal */}
        {isAddInvoiceOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1422] border border-cyan-500/30 rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative animate-fadeIn text-right text-slate-100 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsAddInvoiceOpen(false)} className="absolute left-4 top-4 text-zinc-400 hover:text-white p-1">
                <X size={18} />
              </button>

              <h3 className="font-bold text-base text-cyan-400 mb-4 flex items-center gap-2">
                <Package size={18} />
                <span>تسجيل فاتورة شراء وتوريد بضاعة جديدة (متعددة البنود)</span>
              </h3>

              <form onSubmit={handleCreatePurchaseInvoice} className="space-y-4 text-xs">
                {/* Supplier Selection */}
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">المورد أو شريك التوريد *:</label>
                  <select
                    required
                    value={invSupplierId}
                    onChange={(e) => setInvSupplierId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="">— اختر المورد من القائمة —</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.company || s.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Multi-Item Lines */}
                <div className="border border-zinc-800 rounded-xl p-3.5 bg-zinc-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                      <Layers size={14} className="text-cyan-400" />
                      <span>بنود الفاتورة المشتراة (أضف كل الأصناف في نفس الفاتورة):</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleAddPurchaseLine}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Plus size={12} />
                      <span>+ إضافة بند آخر</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {purchaseLines.map((line, idx) => (
                      <div key={idx} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold border-b border-zinc-800/60 pb-1.5">
                          <span>بند رقم {idx + 1}</span>
                          {purchaseLines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePurchaseLine(idx)}
                              className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                            >
                              <X size={12} />
                              <span>حذف البند</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-12 sm:col-span-5">
                            <label className="block text-[10px] text-zinc-400 mb-0.5">اسم الصنف أو الموديل *:</label>
                            <input
                              type="text"
                              required
                              value={line.name}
                              onChange={(e) => handlePurchaseLineChange(idx, "name", e.target.value)}
                              placeholder="مثال: لفة سلك rg 174 100y / كاميرا 2 ميجا"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label className="block text-[10px] text-zinc-400 mb-0.5">التصنيف:</label>
                            <input
                              type="text"
                              list="supplier-cat-suggestions"
                              value={line.category}
                              onChange={(e) => handlePurchaseLineChange(idx, "category", e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-2">
                            <label className="block text-[10px] text-zinc-400 mb-0.5">وحدة القياس:</label>
                            <input
                              type="text"
                              list="units-list"
                              value={line.unit}
                              onChange={(e) => handlePurchaseLineChange(idx, "unit", e.target.value)}
                              placeholder="لفة 100 متر..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-1">
                            <label className="block text-[10px] text-zinc-400 mb-0.5">الكمية:</label>
                            <input
                              type="number"
                              min="1"
                              required
                              value={line.quantity}
                              onChange={(e) => handlePurchaseLineChange(idx, "quantity", Number(e.target.value))}
                              className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-center text-xs"
                            />
                          </div>

                          <div className="col-span-6 sm:col-span-1">
                            <label className="block text-[10px] text-zinc-400 mb-0.5">التكلفة:</label>
                            <input
                              type="number"
                              min="0"
                              required
                              value={line.costPerUnit}
                              onChange={(e) => handlePurchaseLineChange(idx, "costPerUnit", Number(e.target.value))}
                              className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <datalist id="units-list">
                    {COMMON_UNITS.map((u) => (
                      <option key={u} value={u} />
                    ))}
                  </datalist>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs font-bold">
                    <span className="text-zinc-400">إجمالي قيمة الفاتورة ({purchaseLines.length} بنود):</span>
                    <span className="text-cyan-400 font-mono text-base">
                      {invoiceTotalAmount.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">المبلغ المسدد الآن (ج.م):</label>
                    <input
                      type="number"
                      min="0"
                      value={invPaid}
                      onChange={(e) => setInvPaid(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-emerald-400 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">المتبقي كدين على الشركة:</label>
                    <div className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-rose-400 font-mono font-bold">
                      {Math.max(0, invoiceTotalAmount - (Number(invPaid) || 0)).toLocaleString()} ج.م
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">طريقة الدفع:</label>
                    <select
                      value={invMethod}
                      onChange={(e) => setInvMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                    >
                      <option value="CASH">كاش نقدي 💵</option>
                      <option value="INSTAPAY">إنستاباي / بنكي</option>
                      <option value="DEFERRED">آجل بالكامل</option>
                    </select>
                  </div>
                </div>

                {/* Auto stock */}
                <div className="flex items-center gap-2 p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <input
                    type="checkbox"
                    id="auto-stock"
                    checked={invAutoStock}
                    onChange={(e) => setInvAutoStock(e.target.checked)}
                    className="rounded accent-cyan-500 w-4 h-4"
                  />
                  <label htmlFor="auto-stock" className="text-zinc-300 font-medium cursor-pointer text-xs">
                    إضافة كميات البنود وتكلفتها إلى رصيد المخزن تلقائياً 📦
                  </label>
                </div>

                <div className="flex gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={savingInvoice}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-black font-bold text-xs"
                  >
                    {savingInvoice ? "جاري الحفظ وتحديث المخزن..." : `حفظ فاتورة الشراء (${invoiceTotalAmount.toLocaleString()} ج.م)`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddInvoiceOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: View & Print Purchase Invoice Modal (A4 Printable) */}
        {viewingInvoice && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1422] border border-cyan-500/30 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative animate-fadeIn text-right text-slate-100 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setViewingInvoice(null)} className="absolute left-4 top-4 text-zinc-400 hover:text-white p-1">
                <X size={18} />
              </button>

              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                  <Printer size={18} />
                  <span>معاينة وطباعة فاتورة الشراء #{viewingInvoice.invoiceNumber}</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 hover:brightness-110 transition"
                >
                  <Printer size={14} />
                  <span>طباعة فورية A4</span>
                </button>
              </div>

              {/* Printable Invoice Sheet */}
              <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4 text-xs">
                <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
                  <div>
                    <h2 className="font-bold text-lg text-cyan-400">دي سي سمارت — للأنظمة الأمنية</h2>
                    <p className="text-zinc-400 text-[11px]">طنطا — الغربية | هاتف: 01008657085</p>
                    <p className="text-zinc-500 text-[10px]">إذن استلام وتوريد بضاعة مشتراة</p>
                  </div>
                  <div className="text-left font-mono text-zinc-300">
                    <p className="font-bold text-cyan-300 text-sm">{viewingInvoice.invoiceNumber}</p>
                    <p className="text-[11px] text-zinc-400">{new Date(viewingInvoice.invoiceDate || viewingInvoice.createdAt).toLocaleDateString("ar-EG")}</p>
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 flex justify-between">
                  <div>
                    <span className="text-zinc-400">المورد: </span>
                    <span className="font-bold text-zinc-100">{viewingInvoice.supplier?.name}</span>
                    {viewingInvoice.supplier?.company && (
                      <span className="text-zinc-400"> ({viewingInvoice.supplier.company})</span>
                    )}
                  </div>
                  <div className="font-mono text-zinc-300">
                    <span>الهاتف: </span>
                    <span>{viewingInvoice.supplier?.phone}</span>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-right text-xs">
                  <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="py-2 px-3">م</th>
                      <th className="py-2 px-3">الصنف / الخامة</th>
                      <th className="py-2 px-3">التصنيف</th>
                      <th className="py-2 px-3">الوحدة</th>
                      <th className="py-2 px-3">الكمية</th>
                      <th className="py-2 px-3">سعر الوحدة</th>
                      <th className="py-2 px-3">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {(() => {
                      try {
                        const parsed = JSON.parse(viewingInvoice.items);
                        if (Array.isArray(parsed)) {
                          return parsed.map((itm: any, idx: number) => (
                            <tr key={idx}>
                              <td className="py-2 px-3 font-mono">{idx + 1}</td>
                              <td className="py-2 px-3 font-bold text-zinc-200">{itm.name || itm.nameAr}</td>
                              <td className="py-2 px-3 text-zinc-400">{itm.category || "—"}</td>
                              <td className="py-2 px-3 text-zinc-400">{itm.unit || "قطعة"}</td>
                              <td className="py-2 px-3 font-mono font-bold text-cyan-300">{itm.quantity}</td>
                              <td className="py-2 px-3 font-mono">{(itm.costPerUnit || itm.unitCost || 0).toLocaleString()} ج.م</td>
                              <td className="py-2 px-3 font-mono font-bold text-zinc-100">
                                {(itm.quantity * (itm.costPerUnit || itm.unitCost || 0)).toLocaleString()} ج.م
                              </td>
                            </tr>
                          ));
                        }
                      } catch {}
                      return (
                        <tr>
                          <td colSpan={7} className="py-2 px-3 text-zinc-300">
                            {viewingInvoice.items}
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>

                {/* Invoice Footer Totals */}
                <div className="border-t border-zinc-800 pt-3 flex justify-end">
                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">إجمالي الفاتورة:</span>
                      <span className="font-mono font-bold text-zinc-100">{viewingInvoice.totalAmount.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>المدفوع نقداً:</span>
                      <span className="font-mono font-bold">{viewingInvoice.paidAmount.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between text-rose-400 border-t border-zinc-800 pt-1 font-bold">
                      <span>المتبقي (آجل):</span>
                      <span className="font-mono">{viewingInvoice.remainingAmount.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: Edit Purchase Invoice Modal */}
        {editingInvoice && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1422] border border-blue-500/30 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative animate-fadeIn text-right text-slate-100 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setEditingInvoice(null)} className="absolute left-4 top-4 text-zinc-400 hover:text-white p-1">
                <X size={18} />
              </button>

              <h3 className="font-bold text-base text-blue-400 mb-4 flex items-center gap-2">
                <Edit2 size={18} />
                <span>تعديل فاتورة الشراء #{editingInvoice.invoiceNumber}</span>
              </h3>

              <form onSubmit={handleSaveEditInvoice} className="space-y-4 text-xs">
                <div className="space-y-2">
                  {editLines.map((line, idx) => (
                    <div key={idx} className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <label className="block text-[10px] text-zinc-400 mb-0.5">الصنف:</label>
                        <input
                          type="text"
                          required
                          value={line.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditLines((prev) => prev.map((l, i) => (i === idx ? { ...l, name: val } : l)));
                          }}
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[10px] text-zinc-400 mb-0.5">الوحدة:</label>
                        <input
                          type="text"
                          value={line.unit}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditLines((prev) => prev.map((l, i) => (i === idx ? { ...l, unit: val } : l)));
                          }}
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] text-zinc-400 mb-0.5">الكمية:</label>
                        <input
                          type="number"
                          value={line.quantity}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setEditLines((prev) => prev.map((l, i) => (i === idx ? { ...l, quantity: val } : l)));
                          }}
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-center font-mono text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] text-zinc-400 mb-0.5">التكلفة:</label>
                        <input
                          type="number"
                          value={line.costPerUnit}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setEditLines((prev) => prev.map((l, i) => (i === idx ? { ...l, costPerUnit: val } : l)));
                          }}
                          className="w-full px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">المسدد نقداً (ج.م):</label>
                    <input
                      type="number"
                      value={editPaid}
                      onChange={(e) => setEditPaid(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-emerald-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">طريقة الدفع:</label>
                    <select
                      value={editMethod}
                      onChange={(e) => setEditMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                    >
                      <option value="CASH">كاش نقدي</option>
                      <option value="INSTAPAY">إنستاباي</option>
                      <option value="DEFERRED">آجل</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs"
                  >
                    {savingEdit ? "جاري حفظ التعديل..." : "تأكيد التعديل وتحديث الحسابات"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingInvoice(null)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 5: Supplier Statement (Combined vs Detailed) */}
        {statementSupplier && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1422] border border-cyan-500/30 rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative animate-fadeIn text-right text-slate-100 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setStatementSupplier(null)} className="absolute left-4 top-4 text-zinc-400 hover:text-white p-1">
                <X size={18} />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-4">
                <div>
                  <h3 className="font-bold text-base text-cyan-400 flex items-center gap-2">
                    <FileSpreadsheet size={18} />
                    <span>كشف حساب المورد: {statementSupplier.name}</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    هاتف: {statementSupplier.phone} • {statementSupplier.company || statementSupplier.category}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setStatementMode("summary")}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        statementMode === "summary" ? "bg-cyan-500 text-black shadow-sm" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      كشف حساب مجمع
                    </button>
                    <button
                      onClick={() => setStatementMode("detailed")}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        statementMode === "detailed" ? "bg-cyan-500 text-black shadow-sm" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      كشف حساب تفصيلي بالفواتير
                    </button>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
                    title="طباعة كشف الحساب"
                  >
                    <Printer size={15} />
                  </button>
                </div>
              </div>

              {/* 4 Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs">
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400 block text-[10.5px]">رصيد أول المدة:</span>
                  <span className="font-mono font-bold text-zinc-200 text-sm mt-0.5 block">
                    {(statementSupplier.openingBalance || 0).toLocaleString()} ج.م
                  </span>
                </div>
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400 block text-[10.5px]">إجمالي المشتريات:</span>
                  <span className="font-mono font-bold text-zinc-200 text-sm mt-0.5 block">
                    {(statementSupplier.totalPurchases || 0).toLocaleString()} ج.م
                  </span>
                </div>
                <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400 block text-[10.5px]">إجمالي المسدد:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm mt-0.5 block">
                    {(statementSupplier.totalPaid || 0).toLocaleString()} ج.م
                  </span>
                </div>
                <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/40">
                  <span className="text-cyan-300 block text-[10.5px] font-bold">الرصيد المستحق:</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm mt-0.5 block">
                    {(statementSupplier.currentBalance || 0).toLocaleString()} ج.م
                  </span>
                </div>
              </div>

              {/* Mode 1: Summary List */}
              {statementMode === "summary" && (
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold text-zinc-300 mb-2 flex items-center justify-between">
                      <span>سجل فواتير التوريد:</span>
                      <span className="text-zinc-500 font-mono">{(statementSupplier.purchases || []).length} فاتورة</span>
                    </h4>
                    <div className="space-y-1.5">
                      {(statementSupplier.purchases || []).map((inv: any) => (
                        <div key={inv.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                          <div>
                            <span className="font-mono font-bold text-cyan-400">فاتورة #{inv.invoiceNumber}</span>
                            <span className="text-zinc-500 text-[10px] mr-2">{new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString("ar-EG")}</span>
                          </div>
                          <div className="font-mono">
                            <span className="text-zinc-100 font-bold">{inv.totalAmount.toLocaleString()} ج.م </span>
                            <span className="text-emerald-400 text-[11px]">(سدد: {inv.paidAmount.toLocaleString()})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-zinc-300 mb-2 flex items-center justify-between">
                      <span>سجل سندات الدفع والتحويل:</span>
                      <span className="text-zinc-500 font-mono">{(statementSupplier.payments || []).length} سند</span>
                    </h4>
                    <div className="space-y-1.5">
                      {(statementSupplier.payments || []).map((pay: any) => (
                        <div key={pay.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800">
                          <div>
                            <span className="font-mono font-bold text-emerald-400">سند #{pay.paymentNumber}</span>
                            <span className="text-zinc-500 text-[10px] mr-2">{new Date(pay.paymentDate).toLocaleDateString("ar-EG")}</span>
                          </div>
                          <div className="font-mono font-bold text-emerald-400">
                            {pay.amount.toLocaleString()} ج.م
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 2: Detailed Itemized Ledger */}
              {statementMode === "detailed" && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <ListOrdered size={14} />
                    <span>كشف الحركات التفصيلي ببنود الفواتير:</span>
                  </h4>

                  <div className="border border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">التاريخ</th>
                          <th className="py-2.5 px-3">البيان / الفاتورة</th>
                          <th className="py-2.5 px-3">البنود المشحونة بالتفصيل</th>
                          <th className="py-2.5 px-3 text-left">مدين (توريد)</th>
                          <th className="py-2.5 px-3 text-left">دائن (مسدد)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {(statementSupplier.purchases || []).map((inv: any) => {
                          let lines: any[] = [];
                          try {
                            lines = typeof inv.items === "string" ? JSON.parse(inv.items) : inv.items;
                          } catch {}

                          return (
                            <tr key={inv.id} className="hover:bg-zinc-900/30">
                              <td className="py-2.5 px-3 font-mono text-zinc-400 text-[11px]">
                                {new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString("ar-EG")}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                                فاتورة #{inv.invoiceNumber}
                              </td>
                              <td className="py-2.5 px-3 text-zinc-300">
                                {Array.isArray(lines) && lines.length > 0 ? (
                                  <div className="space-y-1">
                                    {lines.map((l: any, i: number) => (
                                      <div key={i} className="text-[11px]">
                                        <span className="font-bold text-zinc-100">• {l.name || l.nameAr}</span>
                                        <span className="text-zinc-400 font-mono mr-1">
                                          (×{l.quantity} {l.unit || "قطعة"} بسعر {l.costPerUnit || l.unitCost} ج.م)
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span>{inv.items}</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-zinc-100 text-left">
                                {inv.totalAmount.toLocaleString()} ج.م
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 text-left">
                                {inv.paidAmount.toLocaleString()} ج.م
                              </td>
                            </tr>
                          );
                        })}

                        {(statementSupplier.payments || []).map((pay: any) => (
                          <tr key={pay.id} className="bg-emerald-950/10">
                            <td className="py-2.5 px-3 font-mono text-zinc-400 text-[11px]">
                              {new Date(pay.paymentDate).toLocaleDateString("ar-EG")}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                              سند سداد #{pay.paymentNumber}
                            </td>
                            <td className="py-2.5 px-3 text-zinc-300">
                              دفع نقدي / تحويل بنكي للمورد ({pay.notes || "سداد دفعة حساب"})
                            </td>
                            <td className="py-2.5 px-3 text-left">—</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-400 text-left">
                              {pay.amount.toLocaleString()} ج.م
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 6: Add Payment Modal */}
        {isAddPaymentOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1422] border border-emerald-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn text-right text-slate-100">
              <button onClick={() => setIsAddPaymentOpen(false)} className="absolute left-4 top-4 text-zinc-400 hover:text-white p-1">
                <X size={18} />
              </button>

              <h3 className="font-bold text-base text-emerald-400 mb-4 flex items-center gap-2">
                <DollarSign size={18} />
                <span>تسجيل سند سداد وصرف لمورد</span>
              </h3>

              <form onSubmit={handleCreatePayment} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">المورد المستلم *:</label>
                  <select
                    required
                    value={paySupplierId}
                    onChange={(e) => setPaySupplierId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="">— اختر المورد —</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (مستحق له: {s.currentBalance.toLocaleString()} ج.م)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">المبلغ المسدد (ج.م) *:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="مثال: 5000"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-emerald-400 font-mono font-bold text-base"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">طريقة السداد:</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="CASH">كاش نقدي من الخزينة 💵</option>
                    <option value="INSTAPAY">إنستاباي / فودافون كاش 📱</option>
                    <option value="BANK_TRANSFER">تحويل بنكي 🏦</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">ملاحظات السند:</label>
                  <input
                    type="text"
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    placeholder="دفعة تحت الحساب / سداد فاتورة رقم..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>

                <div className="flex gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={savingPayment}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-bold text-xs"
                  >
                    {savingPayment ? "جاري السداد وتعديل الرصيد..." : "تأكيد سند السداد"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddPaymentOpen(false)}
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
          actionDescription="تعديل فواتير التوريد أو حذفها يتطلب إدخال رمز أمان الإدارة."
        />
      </div>
    </ErpLayout>
  );
}
