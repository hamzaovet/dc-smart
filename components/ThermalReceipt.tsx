"use client";

import React from "react";
import { Printer, X } from "lucide-react";
import { playSound } from "@/lib/sounds";

export interface PrintableOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  phone?: string;
  customerAddress?: string;
  address?: string;
  customerCity?: string;
  city?: string;
  orderType?: string;
  status: string;
  items: string | any[];
  subtotal: number;
  deliveryFee: number;
  totalAmount?: number;
  total?: number;
  paymentMethod: string;
  notes?: string;
  cashierName?: string;
  courierName?: string;
  createdAt: string;
}

interface ThermalReceiptModalProps {
  order: PrintableOrder | null;
  onClose: () => void;
}

export function printThermalReceipt(order: PrintableOrder, hotline?: string) {
  playSound("cash");

  const parsedItems: Array<{
    nameAr?: string;
    nameEn?: string;
    quantity?: number;
    qty?: number;
    price?: number;
    unitPrice?: number;
    brandAr?: string;
    type?: string;
  }> = (() => {
    try {
      return typeof order.items === "string" ? JSON.parse(order.items) : order.items;
    } catch {
      return [];
    }
  })();

  const dateObj = new Date(order.createdAt);
  const formattedDate = dateObj.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const total = order.totalAmount ?? order.total ?? 0;
  const phone = order.customerPhone || order.phone || "";
  const address = order.customerAddress || order.address || "";
  const city = order.customerCity || order.city || "";

  const paymentText =
    order.paymentMethod === "INSTAPAY"
      ? "إنستاباي (InstaPay)"
      : order.paymentMethod === "VODAFONE_CASH"
      ? "محفظة كاش"
      : order.paymentMethod === "VISA"
      ? "فيزا / بطاقة إلكترونية"
      : "نقداً عند الاستلام (Cash)";

  const orderTypeBadge =
    order.orderType === "pos"
      ? "فاتورة كاشير المبيعات الفورية"
      : order.orderType === "takeaway"
      ? "استلام مباشر من مقر الشركة"
      : "شحن وتوريد للموقع (Delivery)";

  const printWindow = window.open("", "_blank", "width=400,height=600");
  if (!printWindow) {
    alert("يرجى السماح بالنوافذ المنبثقة لطباعة الفاتورة");
    return;
  }

  const itemsHtml = parsedItems
    .map(
      (item) => `
      <tr style="border-bottom: 1px dashed #bbb;">
        <td style="padding: 6px 0; text-align: right; vertical-align: top;">
          <strong style="font-size: 13px;">${item.nameAr || item.nameEn || "معدة أمنية"}</strong>
          <div style="font-size: 11px; color: #555;">${item.brandAr || "أصلي معتمد"} ${
        item.type ? `• ${item.type}` : ""
      }</div>
        </td>
        <td style="padding: 6px 0; text-align: center; vertical-align: top; font-weight: bold;">
          ${item.quantity || item.qty || 1}
        </td>
        <td style="padding: 6px 0; text-align: left; vertical-align: top; font-weight: bold;">
          ${(item.price || item.unitPrice || 0) * (item.quantity || item.qty || 1)} ج.م
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8" />
      <title>فاتورة ${order.orderNumber} - دي سي سمارت</title>
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
          width: 76mm;
          margin: 0 auto;
          padding: 8mm 2mm;
          color: #000;
          font-size: 12px;
          line-height: 1.35;
          background: #fff;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        .brand {
          font-size: 17px;
          font-weight: 900;
          letter-spacing: 0.5px;
          margin: 0;
        }
        .subbrand {
          font-size: 10.5px;
          font-weight: bold;
          color: #333;
          margin: 2px 0 0 0;
        }
        .order-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 900;
          padding: 2px 8px;
          border: 1px solid #000;
          border-radius: 4px;
          margin: 6px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          margin-bottom: 3px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }
        th {
          font-size: 11px;
          border-bottom: 1.5px solid #000;
          padding: 4px 0;
        }
        .totals {
          border-top: 1.5px solid #000;
          padding-top: 6px;
          margin-top: 6px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          margin-bottom: 3px;
        }
        .grand-total {
          font-size: 15px;
          font-weight: 900;
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
          padding: 6px 0;
          margin-top: 6px;
        }
        .footer {
          text-align: center;
          margin-top: 14px;
          border-top: 1px dashed #666;
          padding-top: 8px;
          font-size: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="brand">🛡️ دي سي سمارت — DC SMART</h1>
        <p class="subbrand">أنظمة المراقبة والتحكم الذكي — طنطا</p>
        <div class="order-badge">${orderTypeBadge}</div>
        <div style="font-size: 13px; font-weight: 900; margin-top: 4px;">رقم الفاتورة: #${order.orderNumber}</div>
      </div>

      <div class="info-row">
        <span>التاريخ: ${formattedDate}</span>
        <span>الوقت: ${formattedTime}</span>
      </div>
      <div class="info-row">
        <span>العميل: <strong>${order.customerName}</strong></span>
        <span>الهاتف: ${phone}</span>
      </div>
      ${
        city || address
          ? `<div class="info-row"><span>العنوان: ${city} ${address ? `- ${address}` : ""}</span></div>`
          : ""
      }
      ${
        order.cashierName
          ? `<div class="info-row"><span>المسؤول: ${order.cashierName}</span></div>`
          : ""
      }

      <table>
        <thead>
          <tr>
            <th style="text-align: right;">الصنف / الموديل</th>
            <th style="text-align: center;">الكمية</th>
            <th style="text-align: left;">السعر</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>المجموع الفرعي:</span>
          <span>${order.subtotal} ج.م</span>
        </div>
        ${
          order.deliveryFee > 0
            ? `<div class="total-row"><span>مصاريف النقل والتركيب:</span><span>${order.deliveryFee} ج.م</span></div>`
            : ""
        }
        <div class="total-row grand-total">
          <span>الإجمالي النهائي المستحق:</span>
          <span>${total} ج.م</span>
        </div>
        <div class="total-row" style="margin-top: 6px; font-weight: bold;">
          <span>طريقة السداد:</span>
          <span>${paymentText}</span>
        </div>
      </div>

      ${
        order.notes
          ? `<div style="margin-top: 8px; padding: 4px; background: #eee; font-size: 11px;"><strong>ملاحظات:</strong> ${order.notes}</div>`
          : ""
      }

      <div class="footer">
        <p style="font-weight: bold; margin: 2px 0;">🛡️ ضمان عامين معتمد على الكاميرات وأجهزة التسجيل 🛡️</p>
        <p style="margin: 2px 0;">طنطا — تليفون: 01008657085 — 01281248731</p>
        <p style="margin: 4px 0 0 0; font-size: 9.5px; color: #444;">تم التطوير بواسطة شركة أوركا لتقنية المعلومات — 01018671000</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() {
            window.close();
          }, 800);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

export default function ThermalReceiptModal({ order, onClose }: ThermalReceiptModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#0b1120] border border-cyan-500/30 rounded-2xl p-5 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <h3 className="text-base font-bold text-cyan-400 mb-4 flex items-center gap-2">
          <Printer size={18} />
          <span>معاينة ريسيت حراري (80mm)</span>
        </h3>

        <div className="bg-white text-zinc-900 rounded-xl p-4 font-mono text-xs max-h-[60vh] overflow-y-auto border border-zinc-300">
          <div className="text-center border-b border-zinc-400 pb-2 mb-2">
            <div className="font-bold text-sm">🛡️ دي سي سمارت — DC SMART</div>
            <div className="text-[10px] text-zinc-600">أنظمة المراقبة والتحكم الذكي — طنطا</div>
            <div className="text-[11px] font-bold mt-1">فاتورة: #{order.orderNumber}</div>
          </div>

          <div className="space-y-1 text-[11px]">
            <div>العميل: {order.customerName}</div>
            <div>الهاتف: {order.customerPhone || order.phone}</div>
            <div>المجموع: {order.totalAmount ?? order.total} ج.م</div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              printThermalReceipt(order);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110"
          >
            <Printer size={16} />
            <span>طباعة الآن (80mm)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
