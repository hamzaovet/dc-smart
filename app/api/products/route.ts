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

    if (!nameAr || !price) {
      return NextResponse.json({ error: "اسم العطر والسعر مطلوبان" }, { status: 400 });
    }

    // Default category if not provided
    let catId = categoryId;
    if (!catId) {
      const firstCat = await prisma.category.findFirst();
      catId = firstCat ? firstCat.id : "";
    }

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
        brandAr: brandAr || "روفي بارفيومز",
        brandEn: brandEn || "Rovy Parfums",
        categoryId: catId,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discountPercent: Number(discountPercent) || 0,
        volume: volume || "100 ml",
        concentration: concentration || "Eau de Parfum",
        type: type || "ORIGINAL",
        stockQuantity: Number(stockQuantity) || 50,
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        isWinter: Boolean(isWinter),
        isFeatured: Boolean(isFeatured),
        topNotesAr: topNotesAr || "البرغموت الإيطالي والزعفران الفاخر",
        topNotesEn: topNotesEn || "Italian Bergamot & Royal Saffron",
        heartNotesAr: heartNotesAr || "الورد الدمشقي وخشب الأرز والعنبر",
        heartNotesEn: heartNotesEn || "Damask Rose, Cedarwood & Amber",
        baseNotesAr: baseNotesAr || "العود الكمبودي والمسك الملكي وفانيليا مدغشقر",
        baseNotesEn: baseNotesEn || "Cambodian Oud, Royal Musk & Madagascar Vanilla",
        descriptionAr: descriptionAr || "عطر فاخر يجسد الأصالة والرقي من ميني بيك.",
        descriptionEn: descriptionEn || "A luxurious fragrance embodying elegance and sophistication.",
        ingredientsAr: ingredientsAr || "كحول عطري نقي 96%، زيوت عطرية فرنسية مركزة.",
        ingredientsEn: ingredientsEn || "Pure perfumer's alcohol 96%, concentrated French oils.",
        image: image || "https://i.ibb.co/vzG70GZ/nano-stitch.jpg",
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Product create error:", error);
    return NextResponse.json(
      { error: "فشل حفظ العطر الجديد", details: error.message },
      { status: 500 }
    );
  }
}
