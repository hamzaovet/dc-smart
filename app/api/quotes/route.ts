import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { clientName: { contains: q, mode: "insensitive" } },
        { clientPhone: { contains: q } },
        { clientCompany: { contains: q, mode: "insensitive" } },
        { quoteNumber: { contains: q, mode: "insensitive" } },
      ];
    }

    const quotes = await prisma.quote.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quotes });
  } catch (error: any) {
    console.error("Quotes fetch error:", error);
    return NextResponse.json(
      { error: "فشل استرجاع عروض الأسعار", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      clientName,
      clientPhone,
      clientAddress,
      clientCompany,
      projectType,
      items,
      subtotal,
      installationFee,
      discount,
      tax,
      totalAmount,
      warrantyPeriod,
      terms,
      status,
      validUntil,
      notes,
      createdBy,
    } = body;

    if (!clientName || !clientPhone) {
      return NextResponse.json(
        { error: "اسم العميل ورقم الهاتف مطلوبان" },
        { status: 400 }
      );
    }

    // Generate unique sequential quote number (e.g. QT-2026-0001)
    const currentYear = new Date().getFullYear();
    const count = await prisma.quote.count();
    const quoteNumber = `QT-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    const serializedItems = typeof items === "string" ? items : JSON.stringify(items || []);

    const newQuote = await prisma.quote.create({
      data: {
        quoteNumber,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientAddress: clientAddress?.trim() || null,
        clientCompany: clientCompany?.trim() || null,
        projectType: projectType || "منزل / فيلا / محل",
        items: serializedItems,
        subtotal: parseFloat(subtotal || 0),
        installationFee: parseFloat(installationFee || 0),
        discount: parseFloat(discount || 0),
        tax: parseFloat(tax || 0),
        totalAmount: parseFloat(totalAmount || 0),
        warrantyPeriod: warrantyPeriod || "ضمان شامل لمدة عامين على الكاميرات وأجهزة التسجيل",
        terms: terms || "الدفعة: 50% عند التعاقد و50% بعد التسليم والتشغيل التجريبي",
        status: status || "PENDING",
        validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Default 15 days
        notes: notes?.trim() || null,
        createdBy: createdBy || "المسؤول",
      },
    });

    return NextResponse.json({ success: true, quote: newQuote }, { status: 201 });
  } catch (error: any) {
    console.error("Quote creation error:", error);
    return NextResponse.json(
      { error: "فشل حفظ عرض السعر", details: error.message },
      { status: 500 }
    );
  }
}
