import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        _count: {
          select: {
            purchases: true,
            payments: true,
            returns: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ suppliers });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع قائمة الموردين", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, company, category, address, openingBalance, notes } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "اسم المورد ورقم الهاتف مطلوبان" },
        { status: 400 }
      );
    }

    const openBal = Number(openingBalance) || 0;

    const supplier = await prisma.supplier.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        company: company ? company.trim() : null,
        category: category || "كاميرات وأجهزة تسجيل",
        address: address ? address.trim() : null,
        openingBalance: openBal,
        totalPurchases: 0,
        totalPaid: 0,
        currentBalance: openBal, // Starts with opening balance
        notes: notes ? notes.trim() : null,
      },
    });

    return NextResponse.json({ success: true, supplier });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل إضافة المورد الجديد", details: error.message },
      { status: 500 }
    );
  }
}
