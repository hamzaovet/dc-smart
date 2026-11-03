import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const offers = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ offers });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع العروض", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      titleAr,
      titleEn,
      type,
      discountValue,
      badgeText,
      applicableProductIds,
      startDate,
      endDate,
      isActive,
      descriptionAr,
      descriptionEn,
    } = body;

    if (!titleAr) {
      return NextResponse.json({ error: "عنوان العرض مطلوب" }, { status: 400 });
    }

    const offer = await prisma.promotion.create({
      data: {
        titleAr: titleAr.trim(),
        titleEn: titleEn ? titleEn.trim() : titleAr.trim(),
        type: type || "PERCENTAGE",
        discountValue: Number(discountValue) || 0,
        badgeText: badgeText ? badgeText.trim() : null,
        applicableProductIds: applicableProductIds || "ALL",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        descriptionAr: descriptionAr || null,
        descriptionEn: descriptionEn || null,
      },
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل إنشاء العرض", details: error.message },
      { status: 500 }
    );
  }
}
