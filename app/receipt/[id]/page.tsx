"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { printThermalReceipt, PrintableOrder } from "@/components/ThermalReceipt";
import { Printer, ArrowRight, RefreshCw, CheckCircle2, ShieldCheck } from "lucide-react";

export default function StandaloneReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [order, setOrder] = useState<PrintableOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const res = await fetch(`/api/orders`);
        const data = await res.json();
        const found = (data.orders || []).find((o: any) => o.id === id || o.orderNumber === id);
        if (found) {
          setOrder(found);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080c14] text-cyan-400 flex items-center justify-center font-mono text-sm">
        <RefreshCw size={24} className="animate-spin ml-2" />
        <span>جاري تحميل إيصال الفاتورة...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-300 flex flex-col items-center justify-center p-4">
        <h2 className="text-base font-bold text-rose-400 mb-2">عذراً، لم يتم العثور على الفاتورة المطلوبة</h2>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-400 hover:bg-slate-800"
        >
          العودة للوحة الإدارة
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#080c14] text-slate-200 p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-lg bg-[#0b1120] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="text-center space-y-1 pb-4 border-b border-cyan-500/20">
          <div className="inline-flex p-3 rounded-full bg-cyan-500/10 text-cyan-400 mb-2">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-lg font-black text-white">دي سي سمارت — لأنظمة المراقبة والتحكم الذكي</h1>
          <p className="text-xs text-slate-400">فاتورة رقم: #{order.orderNumber}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">العميل:</span>
            <span className="font-bold text-white">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">الهاتف:</span>
            <span className="font-mono text-cyan-300">{order.customerPhone || order.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">المبلغ الإجمالي:</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">
              {(order.totalAmount ?? order.total)?.toLocaleString()} ج.م
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">تاريخ الطلب:</span>
            <span className="text-slate-300">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => printThermalReceipt(order)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition"
          >
            <Printer size={16} />
            <span>طباعة الإيصال الحراري (80mm)</span>
          </button>
          <button
            onClick={() => router.push("/cashier")}
            className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-slate-300 transition"
          >
            نقطة البيع (الكاشير)
          </button>
        </div>

        {/* Developer Watermark with user phone number */}
        <div className="pt-4 text-center border-t border-slate-800/80 text-[11px] text-slate-400 font-medium">
          تم التطوير بواسطة شركة أوركا لتقنية المعلومات — 01018671000
        </div>
      </div>
    </div>
  );
}
