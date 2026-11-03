import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerCity,
      customerAddress,
      notes,
      items,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      orderType,
      cashierName,
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "بيانات العميل أو المنتجات غير مكتملة" },
        { status: 400 }
      );
    }

    const orderNumber = `ROVY-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerCity: customerCity || "القاهرة والجيزة",
        customerAddress: customerAddress || "استلام مباشر من مقر الشركة",
        notes: notes || "",
        items: typeof items === "string" ? items : JSON.stringify(items),
        subtotal: Number(subtotal) || 0,
        deliveryFee: Number(deliveryFee) || 0,
        totalAmount: Number(totalAmount) || 0,
        paymentMethod: paymentMethod || "COD",
        status: orderType === "pos" ? "DELIVERED" : "PENDING",
        orderType: orderType || "web",
        cashierName: cashierName || null,
      },
    });

    // Automatically update or create customer in CRM
    try {
      await prisma.customer.upsert({
        where: { phone: customerPhone.trim() },
        update: {
          name: customerName.trim(),
          totalOrders: { increment: 1 },
          totalSpent: { increment: Number(totalAmount) || 0 },
          lastOrderDate: new Date(),
          city: customerCity || undefined,
          address: customerAddress || undefined,
        },
        create: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          city: customerCity || "القاهرة",
          address: customerAddress || null,
          totalOrders: 1,
          totalSpent: Number(totalAmount) || 0,
          lastOrderDate: new Date(),
        },
      });
    } catch (crmErr) {
      console.error("Auto customer sync error:", crmErr);
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ الطلب", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع الطلبات", details: error.message },
      { status: 500 }
    );
  }
}
