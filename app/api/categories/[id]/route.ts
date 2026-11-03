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
    if (body.nameAr !== undefined) updateData.nameAr = body.nameAr.trim();
    if (body.nameEn !== undefined) updateData.nameEn = body.nameEn.trim();
    if (body.slug !== undefined) updateData.slug = body.slug.trim();
    if (body.descriptionAr !== undefined) updateData.descriptionAr = body.descriptionAr?.trim() || null;
    if (body.descriptionEn !== undefined) updateData.descriptionEn = body.descriptionEn?.trim() || null;
    if (body.icon !== undefined) updateData.icon = body.icon?.trim() || null;
    if (body.image !== undefined) updateData.image = body.image?.trim() || null;
    if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder);

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل تعديل بيانات القسم", details: error.message },
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

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        {
          error: `لا يمكن حذف هذا القسم لأنه يحتوي على ${productsCount} منتج مرتبط به. يرجى نقل المنتجات أولاً.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل حذف القسم", details: error.message },
      { status: 500 }
    );
  }
}
