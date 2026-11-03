import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع المنتجات", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nameAr,
      nameEn,
      brandAr,
      brandEn,
      categoryId,
      price,
      originalPrice,
      discountPercent,
      volume,
      concentration,
      type,
      stockQuantity,
      inStock,
      isWinter,
      isFeatured,
      topNotesAr,
      topNotesEn,
      heartNotesAr,
      heartNotesEn,
      baseNotesAr,
      baseNotesEn,
      descriptionAr,
      descriptionEn,
      ingredientsAr,
      ingredientsEn,
      image,
    } = body;

    if (!nameAr || price === undefined || price === null) {
      return NextResponse.json({ error: "اسم الصنف والسعر مطلوبان" }, { status: 400 });
    }

    // Default category if not provided
    let catId = categoryId;
    if (!catId) {
      const firstCat = await prisma.category.findFirst({
        where: {
          OR: [
            { id: "cat_accessories" },
            { nameAr: { contains: "إكسسوارات" } },
            { nameAr: { contains: "مستلزمات" } },
            { nameAr: { contains: "كاميرات" } },
          ],
        },
      });
      if (firstCat) {
        catId = firstCat.id;
      } else {
        const anyCat = await prisma.category.findFirst();
        catId = anyCat ? anyCat.id : "cat_accessories";
      }
    }

    const uniqueCode = `DCS-${Date.now().toString().slice(-4)}`;
    const slug = (nameEn || nameAr)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-") + `-${Date.now().toString().slice(-4)}`;

    const product = await prisma.product.create({
      data: {
        nameAr,
        nameEn: nameEn || nameAr,
        slug,
        brandAr: brandAr || "دي سي سمارت",
        brandEn: brandEn || "DC Smart",
        categoryId: catId,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discountPercent: Number(discountPercent) || 0,
        volume: volume || "قطعة واحدة",
        concentration: concentration || "أصلي معتمد",
        type: type || "CCTV",
        stockQuantity: Number(stockQuantity) || 50,
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        isWinter: Boolean(isWinter),
        isFeatured: Boolean(isFeatured),
        topNotesAr: topNotesAr || "رؤية ليلية فائقة الوضوح ومايك مدمج",
        topNotesEn: topNotesEn || "Full Color Night Vision & Built-in Mic",
        heartNotesAr: heartNotesAr || "معالج أمني متقدم وضمان معتمد عامين",
        heartNotesEn: heartNotesEn || "Advanced Security Chipset & 2-Year Warranty",
        baseNotesAr: baseNotesAr || "مقاومة للعوامل الجوية IP67 وتوصيل سريع",
        baseNotesEn: baseNotesEn || "Weatherproof IP67 & Fast Deployment",
        descriptionAr: descriptionAr || "معدات ومهمات مراقبة وحلول أمنية ذكية معتمدة من شركة دي سي سمارت.",
        descriptionEn: descriptionEn || "Certified surveillance and smart security solutions by DC Smart.",
        ingredientsAr: ingredientsAr || "مكونات أصلية متوافقة مع أنظمة HD و IP.",
        ingredientsEn: ingredientsEn || "Original electronic components compatible with HD & IP.",
        image: image || "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80",
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, product, code: uniqueCode });
  } catch (error: any) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { error: "فشل حفظ الصنف الجديد", details: error.message },
      { status: 500 }
    );
  }
}
