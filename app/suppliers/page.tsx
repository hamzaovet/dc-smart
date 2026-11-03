"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import { useStaff } from "@/context/StaffContext";
import {
  Handshake,
  Plus,
  Search,
  RefreshCw,
  FileText,
  DollarSign,
  Package,
  Calendar,
  X,
  Printer,
  RotateCcw,
  Building2,
  Phone,
  CheckCircle2,
  Wallet,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
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
}

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplier: { name: string };
  items: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: string;
  invoiceDate: string;
}

interface SupplierPayment {
  id: string;
  paymentNumber: string;
  supplierId: string;
  supplier: { name: string };
  amount: number;
  paymentMethod: string;
  notes?: string | null;
  paymentDate: string;
}

interface PurchaseReturn {
  id: string;
  returnNumber: string;
  supplierId: string;
  supplier: { name: string };
  items: string;
  totalRefund: number;
  refundMethod: string;
  reason: string;
  createdAt: string;
}

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

  // Supplier Form
  const [supName, setSupName] = useState("");
  const [supPhone, setSupPhone] = useState("");
  const [supCompany, setSupCompany] = useState("");
  const [supCategory, setSupCategory] = useState("كاميرات مراقبة وأجهزة تسجيل");
  const [supAddress, setSupAddress] = useState("");
  const [supOpeningBal, setSupOpeningBal] = useState("0");
  const [supNotes, setSupNotes] = useState("");

  // Invoice Form
  const [invSupplierId, setInvSupplierId] = useState("");
  const [invItemName, setInvItemName] = useState("");
  const [invItemDesc, setInvItemDesc] = useState("");
  const [invItemCategory, setInvItemCategory] = useState("كاميرات مراقبة وأجهزة تسجيل");
  const [invQty, setInvQty] = useState("10");
  const [invUnit, setInvUnit] = useState("قطعة");
  const [invCost, setInvCost] = useState("50");
  const [invTotal, setInvTotal] = useState("500");
  const [invPaid, setInvPaid] = useState("500");
  const [invMethod, setInvMethod] = useState("CASH");
  const [invAutoStock, setInvAutoStock] = useState(true);

  // Payment Form
  const [paySupplierId, setPaySupplierId] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("INSTAPAY");
  const [payNotes, setPayNotes] = useState("");

  // Return Form
  const [retSupplierId, setRetSupplierId] = useState("");
  const [retItemName, setRetItemName] = useState("");
  const [retQty, setRetQty] = useState("5");
  const [retRefund, setRetRefund] = useState("250");
  const [retMethod, setRetMethod] = useState("DEDUCT_BALANCE");
  const [retReason, setRetReason] = useState("صنف معيب أو عطل فني في الكاميرا/الجهاز");

  const [saving, setSaving] = useState(false);

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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // 1. Add Supplier
  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName.trim() || !supPhone.trim()) return;
    setSaving(true);
    playSound("click");

    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: supName.trim(),
          phone: supPhone.trim(),
          company: supCompany.trim(),
          category: supCategory,
          address: supAddress.trim(),
          openingBalance: Number(supOpeningBal) || 0,
          notes: supNotes.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setSuppliers((prev) => [data.supplier, ...prev]);
        setInvSupplierId(data.supplier.id);
        setPaySupplierId(data.supplier.id);
        setIsAddSupplierOpen(false);
        setSupName("");
        setSupPhone("");
        setSupOpeningBal("0");
      } else {
        alert(data.error || "فشل إضافة المورد");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // 2. Add Purchase Invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invSupplierId || !invItemName.trim() || !invTotal) return;
    setSaving(true);
    playSound("click");

    const items = [
      {
        name: invItemName.trim(),
        category: invItemCategory,
        quantity: Number(invQty) || 1,
        unit: invUnit,
        costPerUnit: Number(invCost) || 0,
        total: Number(invTotal),
      },
    ];

    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: invSupplierId,
          items,
          totalAmount: Number(invTotal),
          paidAmount: Number(invPaid) || 0,
          paymentMethod: invMethod,
          recordedBy: currentUser?.name || "المايسترو",
          autoStock: invAutoStock,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setIsAddInvoiceOpen(false);
        fetchAllData();
      } else {
        alert(data.error || "فشل حفظ فاتورة المشتريات");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // 3. Add Payment
  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paySupplierId || !payAmount) return;
    setSaving(true);
    playSound("click");

    try {
      const res = await fetch("/api/supplier-payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: paySupplierId,
          amount: Number(payAmount),
          paymentMethod: payMethod,
          notes: payNotes.trim(),
          recordedBy: currentUser?.name || "المايسترو",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setIsAddPaymentOpen(false);
        setPayAmount("");
        fetchAllData();
      } else {
        alert(data.error || "فشل تسجيل سند الصرف");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // 4. Add Return
  const handleCreateReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!retSupplierId || !retItemName.trim() || !retRefund) return;
    setSaving(true);
    playSound("click");

    const items = [
      {
        name: retItemName.trim(),
        quantity: Number(retQty) || 1,
        totalRefund: Number(retRefund),
      },
    ];

    try {
      const res = await fetch("/api/purchase-returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: retSupplierId,
          items,
          totalRefund: Number(retRefund),
          refundMethod: retMethod,
          reason: retReason,
          recordedBy: currentUser?.name || "المايسترو",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setIsAddReturnOpen(false);
        fetchAllData();
      } else {
        alert(data.error || "فشل تسجيل مرتجع المشتريات");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Open Statement Modal
  const handleOpenStatement = async (supplierId: string) => {
    playSound("click");
    try {
      const res = await fetch(`/api/suppliers/${supplierId}`);
      const data = await res.json();
      if (res.ok && data.supplier) {
        setStatementSupplier(data.supplier);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Calculations
  const totalBalanceDue = suppliers.reduce((sum, s) => sum + (s.currentBalance || 0), 0);
  const totalPurchasesSum = suppliers.reduce((sum, s) => sum + (s.totalPurchases || 0), 0);
  const totalPaidSum = suppliers.reduce((sum, s) => sum + (s.totalPaid || 0), 0);

  return (
    <ErpLayout activeItem="suppliers">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-pink-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Handshake size={22} />
            </span>
            <div>
              <h1 className="text-xl font-black font-serif text-cyan-400 font-bold">
                نظام الموردين والمشتريات وكشوف الحسابات
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                متابعة حسابات الموردين، رصيد البداية، فواتير الشراء، سندات الصرف، ومرتجعات المشتريات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                playSound("click");
                setIsAddSupplierOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-md flex items-center gap-1.5 transition"
            >
              <Plus size={15} />
              <span>إضافة مورد جديد</span>
            </button>

            <button
              onClick={() => {
                playSound("click");
                if (suppliers.length > 0) setInvSupplierId(suppliers[0].id);
                setIsAddInvoiceOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-xs font-bold border border-zinc-700 flex items-center gap-1.5 transition"
            >
              <Package size={15} />
              <span>فاتورة شراء بضاعة 📦</span>
            </button>

            <button
              onClick={() => {
                playSound("click");
                if (suppliers.length > 0) setPaySupplierId(suppliers[0].id);
                setIsAddPaymentOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold border border-zinc-700 flex items-center gap-1.5 transition"
            >
              <DollarSign size={15} />
              <span>سند سداد دفعة 💵</span>
            </button>
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0e0b16] border border-pink-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">إجمالي المشتريات التراكمية</span>
              <div className="font-serif font-black text-2xl text-zinc-100 mt-1">
                {totalPurchasesSum.toLocaleString()} ج.م
              </div>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Package size={24} />
            </div>
          </div>

          <div className="bg-[#0e0b16] border border-pink-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">إجمالي ما تم سداده للموردين</span>
              <div className="font-serif font-black text-2xl text-emerald-400 mt-1">
                {totalPaidSum.toLocaleString()} ج.م
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign size={24} />
            </div>
          </div>

          <div className="bg-[#0e0b16] border border-pink-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400">الرصيد الحالي المستحق للموردين (آجل)</span>
              <div
                className={`font-serif font-black text-2xl mt-1 ${
                  totalBalanceDue > 0 ? "text-cyan-400" : "text-emerald-400"
                }`}
              >
                {totalBalanceDue.toLocaleString()} ج.م
              </div>
            </div>
            <div className="p-3 rounded-xl bg-pink-500/20 text-cyan-300">
              <Wallet size={24} />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          {[
            { id: "suppliers", label: `دليل الموردين (${suppliers.length})`, icon: Handshake },
            { id: "invoices", label: `فواتير الشراء والتوريد (${invoices.length})`, icon: Package },
            { id: "payments", label: `سندات السداد والصرف (${payments.length})`, icon: DollarSign },
            { id: "returns", label: `مرتجعات المشتريات (${returns.length})`, icon: RotateCcw },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playSound("click");
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-cyan-500 text-black shadow-md"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Suppliers List */}
        {activeTab === "suppliers" && (
          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl overflow-hidden shadow-xl">
            {suppliers.length === 0 ? (
              <div className="py-20 text-center text-zinc-500 text-xs">
                لا يوجد موردين مسجلين، اضغط على زر "إضافة مورد جديد" بالأعلى للبدء
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">اسم المورد / الشركة</th>
                      <th className="py-3 px-4">رقم الهاتف</th>
                      <th className="py-3 px-4">التصنيف</th>
                      <th className="py-3 px-4">رصيد أول المدة</th>
                      <th className="py-3 px-4">إجمالي المشتريات</th>
                      <th className="py-3 px-4">إجمالي المسدد</th>
                      <th className="py-3 px-4">الرصيد المستحق الحالي</th>
                      <th className="py-3 px-4 text-center">كشف الحساب</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {suppliers.map((s) => (
                      <tr key={s.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-zinc-200">
                          <div>{s.name}</div>
                          {s.company && (
                            <span className="text-[10px] text-zinc-500">{s.company}</span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                          {s.phone}
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {s.category}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-zinc-400">
                          {s.openingBalance.toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-zinc-200">
                          {s.totalPurchases.toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          {s.totalPaid.toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`font-mono font-black text-sm ${
                              s.currentBalance > 0 ? "text-cyan-400" : "text-emerald-400"
                            }`}
                          >
                            {s.currentBalance.toLocaleString()} ج.م
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleOpenStatement(s.id)}
                            className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-cyan-300 border border-pink-500/40 text-[11px] font-bold flex items-center justify-center gap-1 mx-auto transition"
                          >
                            <FileText size={13} />
                            <span>كشف الحساب</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Purchase Invoices */}
        {activeTab === "invoices" && (
          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl overflow-hidden shadow-xl">
            {invoices.length === 0 ? (
              <div className="py-20 text-center text-zinc-500 text-xs">
                لا توجد فواتير شراء مسجلة حتى الآن
              </div>
            ) : (
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {invoices.map((inv) => {
                      let parsed: any[] = [];
                      try {
                        parsed = typeof inv.items === "string" ? JSON.parse(inv.items) : inv.items;
                      } catch {
                        parsed = [];
                      }
                      return (
                        <tr key={inv.id} className="hover:bg-zinc-900/40">
                          <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                            #{inv.invoiceNumber}
                          </td>
                          <td className="py-3 px-4 font-bold text-zinc-200">
                            {inv.supplier?.name}
                          </td>
                          <td className="py-3 px-4">
                            {parsed.map((item, idx) => (
                              <div key={idx} className="text-zinc-300 mb-1">
                                <div>
                                  <span className="font-bold">{item.name}</span> × <span className="font-bold text-cyan-300 font-mono">{item.quantity} {item.unit || "قطعة"}</span>
                                </div>
                                {item.description && (
                                  <div className="text-[10.5px] text-zinc-400">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-zinc-100">
                            {inv.totalAmount.toLocaleString()} ج.م
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                            {inv.paidAmount.toLocaleString()} ج.م
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                            {inv.remainingAmount.toLocaleString()} ج.م
                          </td>
                          <td className="py-3 px-4 text-zinc-300">
                            {inv.paymentMethod}
                          </td>
                          <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                            {new Date(inv.invoiceDate).toLocaleDateString("ar-EG")}
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

        {/* TAB 3: Supplier Payments */}
        {activeTab === "payments" && (
          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl overflow-hidden shadow-xl">
            {payments.length === 0 ? (
              <div className="py-20 text-center text-zinc-500 text-xs">
                لا توجد سندات صرف مسجلة حتى الآن
              </div>
            ) : (
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
                      <tr key={p.id} className="hover:bg-zinc-900/40">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                          #{p.paymentNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-zinc-200">
                          {p.supplier?.name}
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-sm text-emerald-400">
                          {p.amount.toLocaleString()} ج.م
                        </td>
                        <td className="py-3 px-4 text-zinc-300 font-bold">
                          {p.paymentMethod === "INSTAPAY" ? "إنستاباي 📱" : "كاش 💵"}
                        </td>
                        <td className="py-3 px-4 text-zinc-400 text-[11px]">
                          {p.notes || "—"}
                        </td>
                        <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                          {new Date(p.paymentDate).toLocaleDateString("ar-EG")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Purchase Returns */}
        {activeTab === "returns" && (
          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl overflow-hidden shadow-xl">
            {returns.length === 0 ? (
              <div className="py-20 text-center text-zinc-500 text-xs">
                لا توجد مرتجعات مشتريات مسجلة حتى الآن
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">رقم المرتجع</th>
                      <th className="py-3 px-4">المورد</th>
                      <th className="py-3 px-4">الأصناف المرتجعة</th>
                      <th className="py-3 px-4">قيمة المرتجع</th>
                      <th className="py-3 px-4">تسوية الاسترداد</th>
                      <th className="py-3 px-4">سبب الإرجاع</th>
                      <th className="py-3 px-4">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {returns.map((ret) => (
                      <tr key={ret.id} className="hover:bg-zinc-900/40">
                        <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                          #{ret.returnNumber}
                        </td>
                        <td className="py-3 px-4 font-bold text-zinc-200">
                          {ret.supplier?.name}
                        </td>
                        <td className="py-3 px-4 text-zinc-300">
                          {ret.items}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-red-400">
                          {ret.totalRefund.toLocaleString()} ج.م
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {ret.refundMethod === "DEDUCT_BALANCE"
                              ? "خصم من رصيد المورد"
                              : "استرداد نقدي"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-400 text-[11px]">
                          {ret.reason}
                        </td>
                        <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                          {new Date(ret.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: Add Supplier */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#120e1c] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-cyan-300 font-serif flex items-center gap-2">
                <Handshake size={18} />
                <span>إضافة مورد / شريك توريد جديد</span>
              </h3>
              <button
                onClick={() => setIsAddSupplierOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSupplier} className="space-y-3">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">اسم المورد أو المسؤول:</label>
                <input
                  type="text"
                  required
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  placeholder="مثال: الشركة الهندسية للأنظمة الأمنية (وكيل داهوا / هيكفيجن)"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">رقم الهاتف:</label>
                  <input
                    type="tel"
                    required
                    value={supPhone}
                    onChange={(e) => setSupPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">التصنيف:</label>
                  <select
                    value={supCategory}
                    onChange={(e) => setSupCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="كاميرات مراقبة وأجهزة تسجيل">كاميرات مراقبة وأجهزة تسجيل (Dahua / Hikvision / Uniarch)</option>
                    <option value="كابلات ومواسير ووصلات">كابلات شبكات ومحاور ووصلات BNC وجاكات باور</option>
                    <option value="هارد ديسك وتخزين وراكات">هارد ديسك وتخزين وراكات تجميع RACK</option>
                    <option value="باور سبلاي ومحولات">باور سبلاي ومحولات مركزية ومهمات كهرباء</option>
                    <option value="شاشات عرض وأجهزة شبكات">شاشات مراقبة وسويتشات PoE وأجهزة شبكات</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم الشركة / المصنع:</label>
                  <input
                    type="text"
                    value={supCompany}
                    onChange={(e) => setSupCompany(e.target.value)}
                    placeholder="الموزع المعتمد لأنظمة المراقبة (Dahua / Hikvision)"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">رصيد أول المدة (ج.م):</label>
                  <input
                    type="number"
                    value={supOpeningBal}
                    onChange={(e) => setSupOpeningBal(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">العنوان أو المقر:</label>
                <input
                  type="text"
                  value={supAddress}
                  onChange={(e) => setSupAddress(e.target.value)}
                  placeholder="طنطا / القاهرة — سوق التكنولوجيا وموزعو الأنظمة الأمنية"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs"
                >
                  {saving ? "جاري الإضافة..." : "حفظ المورد في الدليل 🤝"}
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

      {/* MODAL 2: Add Purchase Invoice */}
      {isAddInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#120e1c] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-cyan-300 font-serif flex items-center gap-2">
                <Package size={18} />
                <span>تسجيل فاتورة شراء وتوريد بضاعة جديدة</span>
              </h3>
              <button
                onClick={() => setIsAddInvoiceOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-zinc-300 font-medium">المورد أو شريك التوريد *</label>
                  <button
                    type="button"
                    onClick={() => setIsAddSupplierOpen(true)}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus size={12} />
                    <span>+ إضافة مورد جديد</span>
                  </button>
                </div>
                <select
                  required
                  value={invSupplierId}
                  onChange={(e) => {
                    if (e.target.value === "NEW") {
                      setIsAddSupplierOpen(true);
                    } else {
                      setInvSupplierId(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- اختر المورد المسجل --</option>
                  <option value="NEW">➕ إضافة وتسجيل مورد جديد الآن...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.company ? `${s.company} • ` : ""}{s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم الصنف أو الخامة:</label>
                  <input
                    type="text"
                    required
                    value={invItemName}
                    onChange={(e) => setInvItemName(e.target.value)}
                    placeholder="مثال: كاميرا داهوا خارجي 2 ميجا Full Color / هارد 1 تيرا سيجيت"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">تصنيف الخامة:</label>
                  <select
                    value={invItemCategory}
                    onChange={(e) => setInvItemCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="كاميرات مراقبة وأجهزة تسجيل">كاميرات مراقبة وأجهزة تسجيل</option>
                    <option value="كابلات ومواسير ووصلات">كابلات شبكات ومواسير ووصلات</option>
                    <option value="هارد ديسك وتخزين">هارد ديسك وتخزين وراكات</option>
                    <option value="باور سبلاي ومحولات">باور سبلاي ومحولات ومستلزمات كهرباء</option>
                    <option value="شاشات وأجهزة شبكات">شاشات عرض وأجهزة شبكات وسويتشات</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">وصف الصنف والمواصفات الفنية التفصيلية:</label>
                <input
                  type="text"
                  value={invItemDesc}
                  onChange={(e) => setInvItemDesc(e.target.value)}
                  placeholder="مثال: دقة 2 ميجا Full Color ألوان ليلية، مايك داخلي، ضمان سنتين الوكيل"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">الكمية المشتراة:</label>
                  <input
                    type="number"
                    required
                    value={invQty}
                    onChange={(e) => {
                      setInvQty(e.target.value);
                      const q = Number(e.target.value) || 0;
                      const c = Number(invCost) || 0;
                      const tot = q * c;
                      setInvTotal(tot.toString());
                      setInvPaid(tot.toString());
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">وحدة القياس:</label>
                  <select
                    value={invUnit}
                    onChange={(e) => setInvUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="قطعة">قطعة</option>
                    <option value="لفة (305 متر)">لفة (305 متر)</option>
                    <option value="متر">متر</option>
                    <option value="طقم / كيت">طقم / كيت</option>
                    <option value="كرتونة">كرتونة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">سعر تكلفة الوحدة (ج.م):</label>
                  <input
                    type="number"
                    required
                    value={invCost}
                    onChange={(e) => {
                      setInvCost(e.target.value);
                      const q = Number(invQty) || 0;
                      const c = Number(e.target.value) || 0;
                      const tot = q * c;
                      setInvTotal(tot.toString());
                      setInvPaid(tot.toString());
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">إجمالي الفاتورة (ج.م):</label>
                  <input
                    type="number"
                    required
                    value={invTotal}
                    onChange={(e) => setInvTotal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono font-bold text-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">المبلغ المسدد الآن (ج.م):</label>
                  <input
                    type="number"
                    value={invPaid}
                    onChange={(e) => setInvPaid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">طريقة الدفع:</label>
                  <select
                    value={invMethod}
                    onChange={(e) => setInvMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="CASH">كاش نقدي 💵</option>
                    <option value="INSTAPAY">إنستاباي (InstaPay) 📱</option>
                    <option value="BANK_TRANSFER">تحويل بنكي 🏦</option>
                    <option value="DEFERRED">آجل بالكامل ⏳</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-pink-500/20 text-zinc-300 flex justify-between items-center">
                <span>المبلغ المتبقي كدين على الشركة للمورد:</span>
                <span className="font-mono font-black text-cyan-400">
                  {Math.max(0, (Number(invTotal) || 0) - (Number(invPaid) || 0))} ج.م
                </span>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={invAutoStock}
                    onChange={(e) => setInvAutoStock(e.target.checked)}
                    className="rounded bg-zinc-900 border-zinc-700 text-pink-500 focus:ring-0"
                  />
                  <span className="text-zinc-200 font-medium">
                    إضافة الكميات المشتراة إلى رصيد المخزن تلقائياً 📦
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs"
                >
                  {saving ? "جاري الحفظ..." : "حفظ فاتورة الشراء وتحديث المخزون 📦"}
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

      {/* MODAL 3: Record Payment */}
      {isAddPaymentOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#120e1c] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-emerald-400 font-serif flex items-center gap-2">
                <DollarSign size={18} />
                <span>سند صرف وسداد دفعة للمورد</span>
              </h3>
              <button
                onClick={() => setIsAddPaymentOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-zinc-300 font-medium">المورد المستفيد:</label>
                  <button
                    type="button"
                    onClick={() => setIsAddSupplierOpen(true)}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Plus size={12} />
                    <span>+ إضافة مورد جديد</span>
                  </button>
                </div>
                <select
                  required
                  value={paySupplierId}
                  onChange={(e) => {
                    if (e.target.value === "NEW") {
                      setIsAddSupplierOpen(true);
                    } else {
                      setPaySupplierId(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- اختر المورد المستحق --</option>
                  <option value="NEW">➕ إضافة وتسجيل مورد جديد الآن...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (المستحق: {s.currentBalance} ج.م)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">المبلغ المسدد (ج.م):</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">طريقة السداد:</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="INSTAPAY">إنستاباي (InstaPay) 📱</option>
                    <option value="CASH">كاش نقدي 💵</option>
                    <option value="BANK_TRANSFER">تحويل بنكي 🏦</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">ملاحظات أو رقم التحويل:</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="رقم مرجع إنستاباي أو إيصال البنك"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-black font-bold text-xs"
                >
                  {saving ? "جاري الحفظ..." : "تسجيل سند السداد وخصم المديونية 💵"}
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

      {/* MODAL 4: Supplier Statement of Account (كشف حساب المورد) */}
      {statementSupplier && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#120e1c] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative text-xs max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <div>
                <h3 className="text-base font-black text-cyan-400 font-bold font-serif flex items-center gap-2">
                  <span>كشف حساب المورد: {statementSupplier.name}</span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  هاتف: {statementSupplier.phone} • {statementSupplier.company || statementSupplier.category}
                </p>
              </div>
              <button
                onClick={() => setStatementSupplier(null)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Financial Status Summary */}
            <div className="grid grid-cols-4 gap-3 mb-4 text-center">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">رصيد أول المدة:</span>
                <span className="font-mono font-bold text-zinc-300">
                  {statementSupplier.openingBalance} ج.م
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">إجمالي المشتريات:</span>
                <span className="font-mono font-bold text-zinc-200">
                  {statementSupplier.totalPurchases} ج.م
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">إجمالي المسدد:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {statementSupplier.totalPaid} ج.م
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                <span className="text-[10px] text-cyan-300 block font-bold">الرصيد المستحق:</span>
                <span className="font-mono font-black text-cyan-400 text-sm">
                  {statementSupplier.currentBalance} ج.م
                </span>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-xs text-zinc-200 border-b border-zinc-800 pb-1 flex items-center justify-between">
                <span>سجل فواتير التوريد</span>
                <span className="text-zinc-500">{(statementSupplier.purchases || []).length} فاتورة</span>
              </h4>
              <div className="divide-y divide-zinc-800/60 rounded-xl bg-black/40 border border-zinc-800 p-2">
                {(statementSupplier.purchases || []).length === 0 ? (
                  <div className="py-4 text-center text-zinc-600">لا توجد فواتير</div>
                ) : (
                  (statementSupplier.purchases || []).map((inv: any) => (
                    <div key={inv.id} className="py-2 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-zinc-200">فاتورة #{inv.invoiceNumber}</div>
                        <div className="text-[10px] text-zinc-500">
                          {new Date(inv.invoiceDate).toLocaleDateString("ar-EG")}
                        </div>
                      </div>
                      <div className="text-left font-mono">
                        <div className="font-bold text-zinc-200">{inv.totalAmount} ج.م</div>
                        <div className="text-[10px] text-emerald-400">سدد: {inv.paidAmount} ج.م</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Payments List */}
              <h4 className="font-serif font-bold text-xs text-zinc-200 border-b border-zinc-800 pb-1 flex items-center justify-between pt-2">
                <span>سجل سندات الدفع والتحويل</span>
                <span className="text-zinc-500">{(statementSupplier.payments || []).length} سند</span>
              </h4>
              <div className="divide-y divide-zinc-800/60 rounded-xl bg-black/40 border border-zinc-800 p-2">
                {(statementSupplier.payments || []).length === 0 ? (
                  <div className="py-4 text-center text-zinc-600">لا توجد سندات سداد</div>
                ) : (
                  (statementSupplier.payments || []).map((pay: any) => (
                    <div key={pay.id} className="py-2 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-emerald-400">سند صرف #{pay.paymentNumber}</div>
                        <div className="text-[10px] text-zinc-500">
                          {pay.paymentMethod} • {new Date(pay.paymentDate).toLocaleDateString("ar-EG")}
                        </div>
                      </div>
                      <div className="text-left font-mono font-bold text-emerald-400">
                        -{pay.amount} ج.م
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5 pt-3 border-t border-zinc-800">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>طباعة كشف الحساب</span>
              </button>
              <button
                onClick={() => setStatementSupplier(null)}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </ErpLayout>
  );
}
