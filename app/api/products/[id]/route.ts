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
    if (body.nameAr !== undefined) updateData.nameAr = body.nameAr;
    if (body.nameEn !== undefined) updateData.nameEn = body.nameEn;
    if (body.brandAr !== undefined) updateData.brandAr = body.brandAr;
    if (body.brandEn !== undefined) updateData.brandEn = body.brandEn;
    if (body.price !== undefined) updateData.price = Number(body.price);
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice ? Number(body.originalPrice) : null;
    if (body.discountPercent !== undefined) updateData.discountPercent = Number(body.discountPercent);
    if (body.volume !== undefined) updateData.volume = body.volume;
    if (body.concentration !== undefined) updateData.concentration = body.concentration;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.stockQuantity !== undefined) updateData.stockQuantity = Number(body.stockQuantity);
    if (body.inStock !== undefined) updateData.inStock = Boolean(body.inStock);
    if (body.isWinter !== undefined) updateData.isWinter = Boolean(body.isWinter);
    if (body.isFeatured !== undefined) updateData.isFeatured = Boolean(body.isFeatured);
    if (body.topNotesAr !== undefined) updateData.topNotesAr = body.topNotesAr;
    if (body.topNotesEn !== undefined) updateData.topNotesEn = body.topNotesEn;
    if (body.heartNotesAr !== undefined) updateData.heartNotesAr = body.heartNotesAr;
    if (body.heartNotesEn !== undefined) updateData.heartNotesEn = body.heartNotesEn;
    if (body.baseNotesAr !== undefined) updateData.baseNotesAr = body.baseNotesAr;
    if (body.baseNotesEn !== undefined) updateData.baseNotesEn = body.baseNotesEn;
    if (body.descriptionAr !== undefined) updateData.descriptionAr = body.descriptionAr;
    if (body.descriptionEn !== undefined) updateData.descriptionEn = body.descriptionEn;
    if (body.ingredientsAr !== undefined) updateData.ingredientsAr = body.ingredientsAr;
    if (body.ingredientsEn !== undefined) updateData.ingredientsEn = body.ingredientsEn;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.image !== undefined) updateData.image = body.image;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل تعديل بيانات العطر", details: error.message },
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
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل حذف العطر", details: error.message },
      { status: 500 }
    );
  }
}
