import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const quote = await prisma.quote.findFirst({
      where: {
        OR: [{ id }, { quoteNumber: id }],
      },
    });

    if (!quote) {
      return NextResponse.json(
        { error: "عرض السعر غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ quote });
  } catch (error: any) {
    console.error("Quote GET error:", error);
    return NextResponse.json(
      { error: "فشل استرجاع عرض السعر", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.quote.findFirst({
      where: { OR: [{ id }, { quoteNumber: id }] },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "عرض السعر غير موجود" },
        { status: 404 }
      );
    }

    const dataToUpdate: any = {};

    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.clientName !== undefined) dataToUpdate.clientName = body.clientName;
    if (body.clientPhone !== undefined) dataToUpdate.clientPhone = body.clientPhone;
    if (body.clientAddress !== undefined) dataToUpdate.clientAddress = body.clientAddress;
    if (body.clientCompany !== undefined) dataToUpdate.clientCompany = body.clientCompany;
    if (body.projectType !== undefined) dataToUpdate.projectType = body.projectType;
    if (body.items !== undefined) {
      dataToUpdate.items = typeof body.items === "string" ? body.items : JSON.stringify(body.items);
    }
    if (body.subtotal !== undefined) dataToUpdate.subtotal = parseFloat(body.subtotal);
    if (body.installationFee !== undefined) dataToUpdate.installationFee = parseFloat(body.installationFee);
    if (body.discount !== undefined) dataToUpdate.discount = parseFloat(body.discount);
    if (body.tax !== undefined) dataToUpdate.tax = parseFloat(body.tax);
    if (body.totalAmount !== undefined) dataToUpdate.totalAmount = parseFloat(body.totalAmount);
    if (body.warrantyPeriod !== undefined) dataToUpdate.warrantyPeriod = body.warrantyPeriod;
    if (body.terms !== undefined) dataToUpdate.terms = body.terms;
    if (body.notes !== undefined) dataToUpdate.notes = body.notes;
    if (body.validUntil !== undefined) dataToUpdate.validUntil = new Date(body.validUntil);

    const updated = await prisma.quote.update({
      where: { id: existing.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, quote: updated });
  } catch (error: any) {
    console.error("Quote PUT error:", error);
    return NextResponse.json(
      { error: "فشل تحديث عرض السعر", details: error.message },
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
    const existing = await prisma.quote.findFirst({
      where: { OR: [{ id }, { quoteNumber: id }] },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "عرض السعر غير موجود" },
        { status: 404 }
      );
    }

    await prisma.quote.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, message: "تم حذف عرض السعر بنجاح" });
  } catch (error: any) {
    console.error("Quote DELETE error:", error);
    return NextResponse.json(
      { error: "فشل حذف عرض السعر", details: error.message },
      { status: 500 }
    );
  }
}
