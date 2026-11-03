"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import { useStaff } from "@/context/StaffContext";
import {
  CircleDollarSign,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  Tag,
  CreditCard,
  RefreshCw,
  Wallet,
  X,
  PieChart,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface ReportData {
  totalRevenue: number;
  totalDelivery: number;
  totalExpenses: number;
  netProfit: number;
  ordersCount: number;
  byStatus: Record<string, number>;
  byPayment: Record<string, number>;
}

interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  category: string;
  recordedBy?: string | null;
  createdAt: string;
}

export default function ReportsFinancePage() {
  const { currentUser } = useStaff();
  const [report, setReport] = useState<ReportData | null>(null);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Expense Modal
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("تشغيل ومصروفات");
  const [savingExpense, setSavingExpense] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRep, resExp] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/expenses"),
      ]);
      const dataRep = await resRep.json();
      const dataExp = await resExp.json();

      setReport(dataRep);
      setExpenses(dataExp.expenses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount) return;
    setSavingExpense(true);
    playSound("click");

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: desc.trim(),
          amount: Number(amount),
          category,
          recordedBy: currentUser?.name || "المايسترو",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setExpenses((prev) => [data.expense, ...prev]);
        setIsExpenseOpen(false);
        setDesc("");
        setAmount("");
        fetchData(); // refresh calculations
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المصروف؟")) return;
    playSound("trash");
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        playSound("success");
        setExpenses((prev) => prev.filter((e) => e.id !== id));
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ErpLayout activeItem="reports">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-pink-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
              <CircleDollarSign size={22} />
            </span>
            <div>
              <h1 className="text-xl font-black font-serif text-pink-gradient">
                الخزينة والأرباح والمصروفات التشغيلية
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                حساب الأرباح الصافية، التدفقات النقدية، المصروفات التشغيلية، ومبيعات الكاش والإنستاباي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound("click");
                setIsExpenseOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
            >
              <Plus size={16} />
              <span>تسجيل مصروف تشغيلي جديد</span>
            </button>
            <button
              onClick={() => {
                playSound("click");
                fetchData();
              }}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
              title="تحديث الأرقام"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* 4 Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="bg-[#0e0b16] border border-pink-500/20 p-5 rounded-2xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>إجمالي المبيعات (Gross)</span>
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ArrowUpRight size={16} />
              </span>
            </div>
            <div className="font-serif font-black text-2xl text-emerald-400">
              {(report?.totalRevenue || 0).toLocaleString()} ج.م
            </div>
            <div className="text-[10px] text-zinc-500">
              من {report?.ordersCount || 0} طلب مسجل
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-[#0e0b16] border border-pink-500/20 p-5 rounded-2xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>المصروفات التشغيلية</span>
              <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                <ArrowDownRight size={16} />
              </span>
            </div>
            <div className="font-serif font-black text-2xl text-red-400">
              {(report?.totalExpenses || 0).toLocaleString()} ج.م
            </div>
            <div className="text-[10px] text-zinc-500">
              تغليف، زيوت، إعلانات، وشحن
            </div>
          </div>

          {/* Shipping fees */}
          <div className="bg-[#0e0b16] border border-pink-500/20 p-5 rounded-2xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span>تكاليف الشحن والتوصيل</span>
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Wallet size={16} />
              </span>
            </div>
            <div className="font-serif font-black text-2xl text-cyan-400">
              {(report?.totalDelivery || 0).toLocaleString()} ج.م
            </div>
            <div className="text-[10px] text-zinc-500">
              رسوم الشحن المحصلة
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-[#0e0b16] border border-pink-500/30 p-5 rounded-2xl flex flex-col justify-between space-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-400 to-amber-600" />
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-bold text-pink-300">صافي الربح التقديري (Net)</span>
              <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300">
                <TrendingUp size={16} />
              </span>
            </div>
            <div className="font-serif font-black text-2xl text-pink-gradient">
              {(report?.netProfit || 0).toLocaleString()} ج.م
            </div>
            <div className="text-[10px] text-zinc-400">
              بعد خصم التوصيل والمصروفات
            </div>
          </div>
        </div>

        {/* Expenses List & Payment Method Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Expenses Table (2 Cols) */}
          <div className="lg:col-span-2 bg-[#0c0914] border border-pink-500/20 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-serif font-bold text-sm text-zinc-100 flex items-center gap-2">
                <span>سجل المصروفات وفواتير التشغيل</span>
                <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                  {expenses.length}
                </span>
              </h3>

              <button
                onClick={() => setIsExpenseOpen(true)}
                className="text-xs text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1"
              >
                <Plus size={14} />
                <span>إضافة مصروف</span>
              </button>
            </div>

            {expenses.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs">
                لا توجد مصروفات مسجلة حتى الآن
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-zinc-900/60 text-zinc-400 border-b border-zinc-800 text-[10.5px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">البيان</th>
                      <th className="py-2.5 px-3">التصنيف</th>
                      <th className="py-2.5 px-3">المبلغ</th>
                      <th className="py-2.5 px-3">المسؤول</th>
                      <th className="py-2.5 px-3">التاريخ</th>
                      <th className="py-2.5 px-3 text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-zinc-900/40">
                        <td className="py-2.5 px-3 font-bold text-zinc-200">
                          {exp.description}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-red-400">
                          {exp.amount.toLocaleString()} ج.م
                        </td>
                        <td className="py-2.5 px-3 text-zinc-400 text-[11px]">
                          {exp.recordedBy || "المايسترو"}
                        </td>
                        <td className="py-2.5 px-3 text-zinc-500 text-[10.5px] font-mono">
                          {new Date(exp.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1 rounded text-zinc-600 hover:text-red-400 transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment Methods & Channels (1 Col) */}
          <div className="bg-[#0c0914] border border-pink-500/20 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-serif font-bold text-sm text-zinc-100 border-b border-zinc-800 pb-3">
              توزيع طرق التحصيل والدفع
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { key: "COD", label: "الدفع نقداً عند الاستلام 💵", color: "bg-pink-500" },
                { key: "INSTAPAY", label: "إنستاباي (InstaPay) 📱", color: "bg-purple-500" },
                { key: "VODAFONE_CASH", label: "محافظ إلكترونية 💳", color: "bg-red-500" },
                { key: "VISA", label: "فيزا / بطاقات بنكية 💳", color: "bg-blue-500" },
              ].map((item) => {
                const count = report?.byPayment[item.key] || 0;
                const total = report?.ordersCount || 1;
                const percent = Math.round((count / (total || 1)) * 100);
                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex justify-between items-center text-zinc-300">
                      <span>{item.label}</span>
                      <span className="font-mono font-bold text-pink-400">
                        {count} طلب ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-2">
              <div className="flex justify-between">
                <span>حسابات النيون الفعالة:</span>
                <span className="font-mono text-emerald-400">Neon PostgreSQL (متصل)</span>
              </div>
              <div className="flex justify-between">
                <span>صلاحية مراجعة الخزينة:</span>
                <span className="text-pink-400 font-bold">المايسترو والمدير</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#120e1c] border border-pink-500/30 rounded-2xl p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-pink-300 font-serif flex items-center gap-2">
                <CircleDollarSign size={18} />
                <span>تسجيل مصروف تشغيلي جديد</span>
              </h3>
              <button
                onClick={() => setIsExpenseOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">وصف أو بيان المصروف:</label>
                <input
                  type="text"
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="مثال: كرتونة زجاجات كريستال / شحن بوسطة / إعلانات تيك توك"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">المبلغ (ج.م):</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="500"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">بند المصروف:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="تغليف وبوكسات">تغليف وبوكسات</option>
                    <option value="شحن وتوصيل">شحن وتوصيل</option>
                    <option value="خامات وزيوت">خامات وزيوت عطرية</option>
                    <option value="إعلانات وتسويق">إعلانات وتسويق</option>
                    <option value="تشغيل ومصروفات">تشغيل ومصروفات عامة</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={savingExpense}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs"
                >
                  {savingExpense ? "جاري التسجيل..." : "تسجيل المصروف 💵"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpenseOpen(false)}
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
