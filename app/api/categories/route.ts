import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع الأقسام", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nameAr, nameEn, slug, descriptionAr, descriptionEn, icon, image, sortOrder } = body;

    if (!nameAr?.trim()) {
      return NextResponse.json({ error: "اسم القسم بالعربي مطلوب" }, { status: 400 });
    }

    const categorySlug =
      slug?.trim() ||
      nameEn
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `cat-${Date.now()}`;

    const category = await prisma.category.create({
      data: {
        nameAr: nameAr.trim(),
        nameEn: nameEn?.trim() || nameAr.trim(),
        slug: categorySlug,
        descriptionAr: descriptionAr?.trim() || null,
        descriptionEn: descriptionEn?.trim() || null,
        icon: icon?.trim() || "✨",
        image: image?.trim() || null,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل إنشاء القسم", details: error.message },
      { status: 500 }
    );
  }
}
