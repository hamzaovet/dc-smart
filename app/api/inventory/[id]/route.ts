import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: any = {};
    if (body.quantity !== undefined) updateData.quantity = Number(body.quantity);
    if (body.name !== undefined) updateData.name = body.name;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.minStock !== undefined) updateData.minStock = Number(body.minStock);
    if (body.costPerUnit !== undefined) updateData.costPerUnit = Number(body.costPerUnit);
    if (body.supplier !== undefined) updateData.supplier = body.supplier;

    // Handle quick adjustment (e.g. adjustQuantity: +5 or -2)
    if (body.adjustQuantity !== undefined) {
      updateData.quantity = { increment: Number(body.adjustQuantity) };
    }

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل تعديل صنف المخزون", details: error.message },
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
    await prisma.inventoryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل حذف الصنف", details: error.message },
      { status: 500 }
    );
  }
}
