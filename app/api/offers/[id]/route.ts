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
    if (body.titleAr !== undefined) updateData.titleAr = body.titleAr;
    if (body.titleEn !== undefined) updateData.titleEn = body.titleEn;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.discountValue !== undefined) updateData.discountValue = Number(body.discountValue);
    if (body.badgeText !== undefined) updateData.badgeText = body.badgeText;
    if (body.applicableProductIds !== undefined) updateData.applicableProductIds = body.applicableProductIds;
    if (body.isActive !== undefined) updateData.isActive = Boolean(body.isActive);
    if (body.descriptionAr !== undefined) updateData.descriptionAr = body.descriptionAr;

    const offer = await prisma.promotion.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل تعديل العرض", details: error.message },
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
    await prisma.promotion.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل حذف العرض", details: error.message },
      { status: 500 }
    );
  }
}
