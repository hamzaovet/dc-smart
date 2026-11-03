import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payments = await prisma.supplierPayment.findMany({
      include: { supplier: true },
      orderBy: { paymentDate: "desc" },
    });
    return NextResponse.json({ payments });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع سندات صرف الموردين", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { supplierId, amount, paymentMethod, notes, recordedBy } = body;

    if (!supplierId || !amount) {
      return NextResponse.json(
        { error: "المورد والمبلغ المسدد مطلوبان" },
        { status: 400 }
      );
    }

    const payVal = Number(amount);
    const paymentNumber = `PAY-SUP-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await prisma.supplierPayment.create({
      data: {
        paymentNumber,
        supplierId,
        amount: payVal,
        paymentMethod: paymentMethod || "CASH",
        notes: notes || null,
        recordedBy: recordedBy || "المايسترو",
      },
    });

    // Update supplier balance
    const supplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        totalPaid: { increment: payVal },
        currentBalance: { decrement: payVal },
      },
    });

    // Log in Treasury/Expense
    try {
      await prisma.expense.create({
        data: {
          description: `سند صرف وسداد دفعة للمورد ${supplier.name} (${paymentNumber})`,
          amount: payVal,
          category: "خامات وزيوت",
          recordedBy: recordedBy || "المايسترو",
        },
      });
    } catch (expErr) {
      console.error("Expense log error:", expErr);
    }

    return NextResponse.json({ success: true, payment });
  } catch (error: any) {
    console.error("Supplier payment error:", error);
    return NextResponse.json(
      { error: "فشل تسجيل سند الصرف", details: error.message },
      { status: 500 }
    );
  }
}
