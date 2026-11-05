import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const invoices = await prisma.purchaseInvoice.findMany({
      include: { supplier: true },
      orderBy: { invoiceDate: "desc" },
    });
    return NextResponse.json({ invoices });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع فواتير المشتريات", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      supplierId,
      items,
      totalAmount,
      paidAmount,
      paymentMethod,
      notes,
      recordedBy,
      autoStock,
    } = body;

    if (!supplierId || !items || !totalAmount) {
      return NextResponse.json(
        { error: "المورد والأصناف وإجمالي الفاتورة مطلوبين" },
        { status: 400 }
      );
    }

    const total = Number(totalAmount);
    const paid = Number(paidAmount) || 0;
    const remaining = Math.max(0, total - paid);
    const invoiceNumber = `PUR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const invoice = await prisma.purchaseInvoice.create({
      data: {
        invoiceNumber,
        supplierId,
        items: typeof items === "string" ? items : JSON.stringify(items),
        totalAmount: total,
        paidAmount: paid,
        remainingAmount: remaining,
        paymentMethod: paymentMethod || "CASH",
        notes: notes || null,
        recordedBy: recordedBy || "المايسترو",
      },
    });

    // Update Supplier ledger
    const supplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        totalPurchases: { increment: total },
        totalPaid: { increment: paid },
        currentBalance: { increment: remaining },
      },
    });

    // Auto-update inventory items
    if (autoStock !== false) {
      try {
        const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
        for (const item of parsedItems) {
          const qty = Number(item.quantity) || 1;
          const cost = Number(item.costPerUnit || item.unitCost) || 0;

          const existingInv = await prisma.inventoryItem.findFirst({
            where: { name: item.name },
          });

          if (existingInv) {
            await prisma.inventoryItem.update({
              where: { id: existingInv.id },
              data: {
                quantity: { increment: qty },
                costPerUnit: cost > 0 ? cost : existingInv.costPerUnit,
                supplier: supplier.name,
              },
            });
          } else {
            await prisma.inventoryItem.create({
              data: {
                name: item.name,
                category: item.category || "كاميرات وأجهزة تسجيل",
                quantity: qty,
                unit: item.unit || "قطعة",
                minStock: 10,
                costPerUnit: cost,
                supplier: supplier.name,
              },
            });
          }
        }
      } catch (stockErr) {
        console.error("Auto inventory update error:", stockErr);
      }
    }

    // Log paid amount in Treasury/Expenses
    if (paid > 0) {
      try {
        await prisma.expense.create({
          data: {
            description: `سداد مشتريات للمورد ${supplier.name} (فاتورة #${invoiceNumber})`,
            amount: paid,
            category: "كاميرات وأجهزة تسجيل",
            recordedBy: recordedBy || "المايسترو",
          },
        });
      } catch (expErr) {
        console.error("Expense log error:", expErr);
      }
    }

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    console.error("Purchase creation error:", error);
    return NextResponse.json(
      { error: "فشل حفظ فاتورة المشتريات", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, items, totalAmount, paidAmount, paymentMethod, notes } = body;

    if (!id || !items || !totalAmount) {
      return NextResponse.json({ error: "بيانات الفاتورة غير مكتملة للتعديل" }, { status: 400 });
    }

    const oldInvoice = await prisma.purchaseInvoice.findUnique({
      where: { id },
    });

    if (!oldInvoice) {
      return NextResponse.json({ error: "الفاتورة غير موجودة" }, { status: 404 });
    }

    const total = Number(totalAmount);
    const paid = Number(paidAmount) || 0;
    const remaining = Math.max(0, total - paid);

    // Balance difference
    const diffPurchases = total - oldInvoice.totalAmount;
    const diffPaid = paid - oldInvoice.paidAmount;
    const diffRemaining = remaining - oldInvoice.remainingAmount;

    const invoice = await prisma.purchaseInvoice.update({
      where: { id },
      data: {
        items: typeof items === "string" ? items : JSON.stringify(items),
        totalAmount: total,
        paidAmount: paid,
        remainingAmount: remaining,
        paymentMethod: paymentMethod || oldInvoice.paymentMethod,
        notes: notes !== undefined ? notes : oldInvoice.notes,
      },
    });

    // Update supplier balance
    await prisma.supplier.update({
      where: { id: oldInvoice.supplierId },
      data: {
        totalPurchases: { increment: diffPurchases },
        totalPaid: { increment: diffPaid },
        currentBalance: { increment: diffRemaining },
      },
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    return NextResponse.json({ error: "فشل تعديل الفاتورة", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف الفاتورة مطلوب للحذف" }, { status: 400 });
    }

    const invoice = await prisma.purchaseInvoice.findUnique({ where: { id } });
    if (!invoice) {
      return NextResponse.json({ error: "الفاتورة غير موجودة" }, { status: 404 });
    }

    // Adjust supplier balance back
    await prisma.supplier.update({
      where: { id: invoice.supplierId },
      data: {
        totalPurchases: { decrement: invoice.totalAmount },
        totalPaid: { decrement: invoice.paidAmount },
        currentBalance: { decrement: invoice.remainingAmount },
      },
    });

    await prisma.purchaseInvoice.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "تم حذف الفاتورة وتعديل رصيد المورد" });
  } catch (error: any) {
    return NextResponse.json({ error: "فشل حذف الفاتورة", details: error.message }, { status: 500 });
  }
}
