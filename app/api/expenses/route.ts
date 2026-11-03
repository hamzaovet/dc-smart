import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ expenses });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع المصروفات", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { description, amount, category, recordedBy } = body;

    if (!description || !amount) {
      return NextResponse.json({ error: "البيان والمبلغ مطلوبان" }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        amount: Number(amount),
        category: category || "تشغيل ومصروفات عامة",
        recordedBy: recordedBy || "المايسترو",
      },
    });

    return NextResponse.json({ success: true, expense });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل تسجيل المصروف", details: error.message },
      { status: 500 }
    );
  }
}
