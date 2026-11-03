import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع عناصر المخزون", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, quantity, unit, minStock, costPerUnit, supplier } = body;

    if (!name) {
      return NextResponse.json({ error: "اسم الصنف مطلوب" }, { status: 400 });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category: category || "كاميرات مراقبة",
        quantity: Number(quantity) || 0,
        unit: unit || "قطعة",
        minStock: Number(minStock) || 10,
        costPerUnit: Number(costPerUnit) || 0,
        supplier: supplier || null,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل إضافة الصنف للمخزون", details: error.message },
      { status: 500 }
    );
  }
}
