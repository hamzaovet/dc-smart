import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    let syncedCount = 0;

    for (const prod of products) {
      const existing = await prisma.inventoryItem.findFirst({
        where: { name: prod.nameAr },
      });

      const catName =
        prod.category?.nameAr ||
        (prod.type === "HD Camera" || prod.type === "CCTV"
          ? "كاميرات مراقبة وأجهزة تسجيل"
          : "أجهزة وأنظمة أمنية");

      if (!existing) {
        await prisma.inventoryItem.create({
          data: {
            name: prod.nameAr,
            category: catName,
            quantity: prod.stockQuantity || 50,
            unit: "قطعة",
            minStock: 10,
            costPerUnit: prod.price ? Math.round(prod.price * 0.8) : 0,
            supplier: prod.brandAr || "الموزع المعتمد",
          },
        });
        syncedCount++;
      } else {
        // Update stock and cost if 0
        await prisma.inventoryItem.update({
          where: { id: existing.id },
          data: {
            quantity: existing.quantity > 0 ? existing.quantity : (prod.stockQuantity || 50),
            costPerUnit: existing.costPerUnit > 0 ? existing.costPerUnit : (prod.price ? Math.round(prod.price * 0.8) : 0),
          },
        });
      }
    }

    const totalInventoryCount = await prisma.inventoryItem.count();

    return NextResponse.json({
      success: true,
      syncedCount,
      totalInventoryCount,
      message: `تمت مزامنة ${syncedCount} صنف جديد من المعرض إلى المخزون بنجاح (الإجمالي الآن: ${totalInventoryCount} صنف).`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل مزامنة منتجات المعرض إلى المخزون", details: error.message },
      { status: 500 }
    );
  }
}
