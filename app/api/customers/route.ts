import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { totalSpent: "desc" },
    });
    return NextResponse.json({ customers });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع العملاء", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, city, address, notes, isVip } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "الاسم ورقم الهاتف مطلوبان" }, { status: 400 });
    }

    const customer = await prisma.customer.upsert({
      where: { phone: phone.trim() },
      update: {
        name: name.trim(),
        email: email || undefined,
        city: city || undefined,
        address: address || undefined,
        notes: notes || undefined,
        isVip: isVip !== undefined ? Boolean(isVip) : undefined,
      },
      create: {
        name: name.trim(),
        phone: phone.trim(),
        email: email || null,
        city: city || "القاهرة",
        address: address || null,
        notes: notes || null,
        isVip: Boolean(isVip),
      },
    });

    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل حفظ بيانات العميل", details: error.message },
      { status: 500 }
    );
  }
}
