"use client";

import React, { useState, useEffect } from "react";
import ErpLayout from "@/components/ErpLayout";
import { playSound } from "@/lib/sounds";
import SecurityPinModal from "@/components/SecurityPinModal";
import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  Phone,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Shield,
  CreditCard,
  Plus,
  X,
  Check,
  Edit2,
  Trash2,
  Briefcase,
  Calendar,
  AlertCircle,
  FileText,
  BadgePercent,
  Banknote,
} from "lucide-react";

interface EmployeeAdvance {
  id: string;
  amount: number;
  reason?: string | null;
  date: string;
}

interface Employee {
  id: string;
  name: string;
  phone: string;
  nationalId?: string | null;
  role: string;
  basicSalary: number;
  commissionRate: number;
  totalEarned: number;
  totalAdvances: number;
  hireDate: string;
  status: string;
  notes?: string | null;
  advances?: EmployeeAdvance[];
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [role, setRole] = useState("فني تركيبات");
  const [basicSalary, setBasicSalary] = useState("4500");
  const [commissionRate, setCommissionRate] = useState("100");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Advance Modal
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);
  const [advanceEmpId, setAdvanceEmpId] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [advanceReason, setAdvanceReason] = useState("");
  const [savingAdvance, setSavingAdvance] = useState(false);

  // Security PIN Modal
  const [pinAction, setPinAction] = useState<(() => void) | null>(null);
  const [isPinOpen, setIsPinOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data.employees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setName("");
    setPhone("");
    setNationalId("");
    setRole("فني تركيبات");
    setBasicSalary("4500");
    setCommissionRate("100");
    setNotes("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setPinAction(() => () => {
      setEditingEmployee(emp);
      setName(emp.name);
      setPhone(emp.phone);
      setNationalId(emp.nationalId || "");
      setRole(emp.role);
      setBasicSalary(emp.basicSalary.toString());
      setCommissionRate(emp.commissionRate.toString());
      setNotes(emp.notes || "");
      setIsModalOpen(true);
    });
    setIsPinOpen(true);
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setSaving(true);
    playSound("click");

    try {
      const method = editingEmployee ? "PUT" : "POST";
      const payload: any = {
        name: name.trim(),
        phone: phone.trim(),
        nationalId: nationalId.trim() || null,
        role,
        basicSalary: Number(basicSalary) || 0,
        commissionRate: Number(commissionRate) || 0,
        notes: notes.trim() || null,
      };
      if (editingEmployee) payload.id = editingEmployee.id;

      const res = await fetch("/api/employees", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setIsModalOpen(false);
        fetchEmployees();
      } else {
        alert(data.error || "فشل حفظ بيانات الموظف");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmployee = (id: string, empName: string) => {
    setPinAction(() => async () => {
      if (!confirm(`هل أنت متأكد من حذف الموظف (${empName}) نهائياً؟`)) return;
      playSound("trash");
      try {
        const res = await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          playSound("success");
          setEmployees((prev) => prev.filter((e) => e.id !== id));
        }
      } catch (err) {
        console.error(err);
      }
    });
    setIsPinOpen(true);
  };

  const handleRecordAdvance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceEmpId || !advanceAmount) return;
    setSavingAdvance(true);
    playSound("click");

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "advance",
          employeeId: advanceEmpId,
          amount: Number(advanceAmount),
          reason: advanceReason.trim() || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound("success");
        setIsAdvanceOpen(false);
        setAdvanceAmount("");
        setAdvanceReason("");
        fetchEmployees();
      } else {
        alert(data.error || "فشل تسجيل السلفة");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingAdvance(false);
    }
  };

  // Calculations
  const totalSalaries = employees.reduce((sum, e) => sum + (e.basicSalary || 0), 0);
  const totalAdvancesAll = employees.reduce((sum, e) => sum + (e.totalAdvances || 0), 0);
  const netSalariesPayable = Math.max(0, totalSalaries - totalAdvancesAll);

  const filtered = employees.filter((emp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.phone.includes(q) ||
      emp.role.toLowerCase().includes(q)
    );
  });

  return (
    <ErpLayout activeItem="users">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 border border-teal-500/20 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Users size={22} />
            </span>
            <div>
              <h1 className="text-xl font-bold font-serif text-teal-400">
                إدارة الموظفين وفنيين التركيب والرواتب
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                سجل فنيين الكاميرات والشبكات، مهندسي الصيانة، المرتبات الأساسية، عمولات التركيب، والسلف
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdvanceOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
            >
              <Banknote size={15} />
              <span>صرف سلفة لموظف</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition"
            >
              <UserPlus size={15} />
              <span>إضافة موظف / فني جديد</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0c0914] border border-teal-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">إجمالي الموظفين والفنيين</span>
              <h3 className="text-2xl font-black font-mono text-zinc-100 mt-1">
                {employees.length} <span className="text-xs font-normal text-zinc-400 font-sans">فرد</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Users size={20} />
            </div>
          </div>

          <div className="bg-[#0c0914] border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">إجمالي السلف المصروفة</span>
              <h3 className="text-2xl font-black font-mono text-rose-400 mt-1">
                {totalAdvancesAll.toLocaleString()} <span className="text-xs font-normal text-zinc-400 font-sans">ج.م</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <TrendingDown size={20} />
            </div>
          </div>

          <div className="bg-[#0c0914] border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 font-medium">صافي مسيرات الرواتب الشهرية</span>
              <h3 className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {netSalariesPayable.toLocaleString()} <span className="text-xs font-normal text-zinc-400 font-sans">ج.م</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث باسم الفني، الوظيفة، أو الهاتف..."
            className="w-full pl-3 pr-9 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Employees Table */}
        {loading ? (
          <div className="p-12 text-center text-zinc-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-teal-400" />
            <span>جاري استرجاع سجل الموظفين...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs bg-zinc-900/40 border border-zinc-800 rounded-2xl">
            لا يوجد موظفين مسجلين حالياً. اضغط على "إضافة موظف جديد" لتسجيل فنيين التركيب والمرتبات.
          </div>
        ) : (
          <div className="bg-[#0c0914] border border-teal-500/20 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 border-b border-zinc-800 text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">اسم الموظف / الفني</th>
                    <th className="py-3 px-4">الوظيفة</th>
                    <th className="py-3 px-4">رقم الهاتف</th>
                    <th className="py-3 px-4">المرتب الأساسي</th>
                    <th className="py-3 px-4">عمولة التركيب</th>
                    <th className="py-3 px-4">السلف</th>
                    <th className="py-3 px-4">صافي الراتب</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 text-center">إجراءات 🔒</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filtered.map((emp) => {
                    const netSalary = Math.max(0, emp.basicSalary - emp.totalAdvances);

                    return (
                      <tr key={emp.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-zinc-100">
                          <div>{emp.name}</div>
                          {emp.nationalId && (
                            <div className="text-[10px] text-zinc-500 font-mono">الرقم القومي: {emp.nationalId}</div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10.5px] font-medium">
                            {emp.role}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-teal-300">
                          {emp.phone}
                        </td>

                        <td className="py-3 px-4 font-mono text-zinc-200">
                          {emp.basicSalary.toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4 font-mono text-amber-400">
                          {emp.commissionRate > 0 ? `${emp.commissionRate} ج.م / أوردر` : "—"}
                        </td>

                        <td className="py-3 px-4 font-mono text-rose-400 font-bold">
                          {(emp.totalAdvances || 0).toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          {netSalary.toLocaleString()} ج.م
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                            نشط بالعمل
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(emp)}
                              title="تعديل الموظف والمرتب (محمي بالباسورد)"
                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                              title="حذف الموظف (محمي بالباسورد)"
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

        {/* MODAL 1: Add / Edit Employee */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1422] border border-teal-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn text-right text-slate-100">
              <button onClick={() => setIsModalOpen(false)} className="absolute left-4 top-4 text-zinc-400 hover:text-white p-1">
                <X size={18} />
              </button>

              <h3 className="font-bold text-base text-teal-400 mb-4 flex items-center gap-2">
                <Users size={18} />
                <span>{editingEmployee ? "تعديل بيانات الموظف والراتب" : "إضافة موظف / فني تركيب جديد"}</span>
              </h3>

              <form onSubmit={handleSaveEmployee} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">اسم الموظف أو الفني *:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: أحمد مصطفى"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">رقم الهاتف *:</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010xxxxxxxx"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">الرقم القومي:</label>
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="14 رقم"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">المسمى الوظيفي / الدور:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="فني تركيبات كاميرات وشبكات">فني تركيبات كاميرات وشبكات</option>
                    <option value="مهندس صيانة وبرمجة أنظمة">مهندس صيانة وبرمجة أنظمة</option>
                    <option value="مسؤول مبيعات ومعرض">مسؤول مبيعات ومعرض</option>
                    <option value="كاشير ومحاسب">كاشير ومحاسب</option>
                    <option value="مشرف مواقع ومشاريع">مشرف مواقع ومشاريع</option>
                    <option value="دليفري ومسؤول توصيل">دليفري ومسؤول توصيل</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">المرتب الأساسي (ج.م):</label>
                    <input
                      type="number"
                      value={basicSalary}
                      onChange={(e) => setBasicSalary(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-emerald-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">عمولة التركيب (ج.م / أوردر):</label>
                    <input
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-amber-400 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">ملاحظات إضافية:</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="فترة اختبار / شفت صباحي..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>

                <div className="flex gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:brightness-110 text-white font-bold text-xs"
                  >
                    {saving ? "جاري الحفظ..." : editingEmployee ? "تعديل الموظف" : "حفظ الموظف"}
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

        {/* MODAL 2: Record Advance */}
        {isAdvanceOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f1422] border border-amber-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn text-right text-slate-100">
              <button onClick={() => setIsAdvanceOpen(false)} className="absolute left-4 top-4 text-zinc-400 hover:text-white p-1">
                <X size={18} />
              </button>

              <h3 className="font-bold text-base text-amber-400 mb-4 flex items-center gap-2">
                <Banknote size={18} />
                <span>صرف سلفة مالية تحت الحساب لموظف</span>
              </h3>

              <form onSubmit={handleRecordAdvance} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">الموظف المستلم *:</label>
                  <select
                    required
                    value={advanceEmpId}
                    onChange={(e) => setAdvanceEmpId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  >
                    <option value="">— اختر الموظف —</option>
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.role} — راتب: {e.basicSalary} ج.م)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">مبلغ السلفة (ج.م) *:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    placeholder="مثال: 500"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-rose-400 font-mono font-bold text-base"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">سبب السلفة:</label>
                  <input
                    type="text"
                    value={advanceReason}
                    onChange={(e) => setAdvanceReason(e.target.value)}
                    placeholder="سلفة أسبوعية / مصاريف موقع تركيب..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200"
                  />
                </div>

                <div className="flex gap-2 pt-3 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={savingAdvance}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-bold text-xs"
                  >
                    {savingAdvance ? "جاري الخصم والتسجيل..." : "تأكيد صرف السلفة"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdvanceOpen(false)}
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
          actionDescription="تعديل أو حذف بيانات الموظفين والرواتب يتطلب إدخال رمز أمان الإدارة."
        />
      </div>
    </ErpLayout>
  );
}
