import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const returns = await prisma.salesReturn.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ returns });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع مرتجعات المبيعات", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderId,
      orderNumber,
      customerName,
      customerPhone,
      items,
      totalRefund,
      refundMethod,
      reason,
      restockItems,
      notes,
      recordedBy,
    } = body;

    if (!customerName || !items || !totalRefund) {
      return NextResponse.json(
        { error: "بيانات المرتجع غير مكتملة" },
        { status: 400 }
      );
    }

    const returnNumber = `RET-SALES-${Math.floor(1000 + Math.random() * 9000)}`;

    const salesReturn = await prisma.salesReturn.create({
      data: {
        returnNumber,
        orderId: orderId || null,
        orderNumber: orderNumber || null,
        customerName: customerName.trim(),
        customerPhone: (customerPhone || "01000000000").trim(),
        items: typeof items === "string" ? items : JSON.stringify(items),
        totalRefund: Number(totalRefund),
        refundMethod: refundMethod || "CASH",
        reason: reason || "طلب استرجاع من العميل",
        restockItems: restockItems !== undefined ? Boolean(restockItems) : true,
        notes: notes || null,
        recordedBy: recordedBy || "المايسترو",
      },
    });

    // Auto-restock items to inventory/products if selected
    if (restockItems) {
      try {
        const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
        for (const itm of parsedItems) {
          const qty = Number(itm.quantity || itm.qty || 1);
          if (itm.productId) {
            await prisma.product.update({
              where: { id: itm.productId },
              data: { stockQuantity: { increment: qty } },
            });
          } else if (itm.nameAr) {
            const found = await prisma.product.findFirst({
              where: { nameAr: itm.nameAr },
            });
            if (found) {
              await prisma.product.update({
                where: { id: found.id },
                data: { stockQuantity: { increment: qty } },
              });
            }
          }
        }
      } catch (restockErr) {
        console.error("Restock error:", restockErr);
      }
    }

    // Record cash refund in expenses/treasury
    try {
      await prisma.expense.create({
        data: {
          description: `مرتجع مبيعات للعميل ${customerName} (إيصال #${returnNumber})`,
          amount: Number(totalRefund),
          category: "مرتجعات مبيعات",
          recordedBy: recordedBy || "المايسترو",
        },
      });
    } catch (expErr) {
      console.error("Expense log error:", expErr);
    }

    return NextResponse.json({ success: true, return: salesReturn });
  } catch (error: any) {
    console.error("Sales return creation error:", error);
    return NextResponse.json(
      { error: "فشل تسجيل مرتجع المبيعات", details: error.message },
      { status: 500 }
    );
  }
}
