import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const returns = await prisma.purchaseReturn.findMany({
      include: { supplier: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ returns });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع مرتجعات المشتريات", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { supplierId, items, totalRefund, refundMethod, reason, notes, recordedBy } = body;

    if (!supplierId || !items || !totalRefund) {
      return NextResponse.json(
        { error: "بيانات مرتجع المشتريات غير مكتملة" },
        { status: 400 }
      );
    }

    const refund = Number(totalRefund);
    const returnNumber = `RET-PUR-${Math.floor(1000 + Math.random() * 9000)}`;

    const purchaseReturn = await prisma.purchaseReturn.create({
      data: {
        returnNumber,
        supplierId,
        items: typeof items === "string" ? items : JSON.stringify(items),
        totalRefund: refund,
        refundMethod: refundMethod || "DEDUCT_BALANCE",
        reason: reason || "بضاعة معيبة أو تالفة من المورد",
        notes: notes || null,
        recordedBy: recordedBy || "المايسترو",
      },
    });

    // If DEDUCT_BALANCE, reduce supplier's credit balance
    if (refundMethod === "DEDUCT_BALANCE") {
      await prisma.supplier.update({
        where: { id: supplierId },
        data: {
          currentBalance: { decrement: refund },
        },
      });
    }

    // Deduct stock from inventory
    try {
      const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
      for (const item of parsedItems) {
        const qty = Number(item.quantity) || 1;
        const inv = await prisma.inventoryItem.findFirst({
          where: { name: item.name },
        });
        if (inv) {
          await prisma.inventoryItem.update({
            where: { id: inv.id },
            data: { quantity: { decrement: qty } },
          });
        }
      }
    } catch (invErr) {
      console.error("Inventory return deduction error:", invErr);
    }

    return NextResponse.json({ success: true, return: purchaseReturn });
  } catch (error: any) {
    console.error("Purchase return error:", error);
    return NextResponse.json(
      { error: "فشل تسجيل مرتجع المشتريات", details: error.message },
      { status: 500 }
    );
  }
}
