import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        purchases: { orderBy: { invoiceDate: "desc" } },
        payments: { orderBy: { paymentDate: "desc" } },
        returns: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!supplier) {
      return NextResponse.json({ error: "المورد غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ supplier });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع كشف حساب المورد", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.phone !== undefined) updateData.phone = body.phone.trim();
    if (body.company !== undefined) updateData.company = body.company.trim();
    if (body.category !== undefined) updateData.category = body.category;
    if (body.address !== undefined) updateData.address = body.address.trim();
    if (body.notes !== undefined) updateData.notes = body.notes.trim();

    const supplier = await prisma.supplier.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, supplier });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل تعديل بيانات المورد", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.supplier.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل حذف المورد", details: error.message },
      { status: 500 }
    );
  }
}
