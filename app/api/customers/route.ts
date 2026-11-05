import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
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
    const { id, name, phone, email, city, address, notes, isVip } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "الاسم ورقم الهاتف مطلوبان" }, { status: 400 });
    }

    const cleanPhone = phone.trim();
    const cleanName = name.trim();

    // If an ID is provided, update that specific customer
    if (id) {
      const customer = await prisma.customer.update({
        where: { id },
        data: {
          name: cleanName,
          phone: cleanPhone,
          email: email || null,
          city: city || "طنطا",
          address: address || null,
          notes: notes || null,
          isVip: Boolean(isVip),
        },
      });
      return NextResponse.json({ success: true, customer });
    }

    // Creating new customer
    const customer = await prisma.customer.create({
      data: {
        name: cleanName,
        phone: cleanPhone,
        email: email || null,
        city: city || "طنطا",
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

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, phone, email, city, address, notes, isVip } = body;

    if (!id || !name || !phone) {
      return NextResponse.json({ error: "كود العميل، الاسم ورقم الهاتف مطلوبة للتعديل" }, { status: 400 });
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email || null,
        city: city || "طنطا",
        address: address || null,
        notes: notes || null,
        isVip: Boolean(isVip),
      },
    });

    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل تعديل بيانات العميل", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف العميل مطلوب للحذف" }, { status: 400 });
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "تم حذف العميل بنجاح" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل حذف العميل", details: error.message },
      { status: 500 }
    );
  }
}
