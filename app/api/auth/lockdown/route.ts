import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await prisma.storeSettings.findUnique({
      where: { id: "rovy_settings" },
    });
    return NextResponse.json({
      isEmergencyLockdown: settings?.isEmergencyLockdown || false,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل التحقق من حالة الطوارئ", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { isEmergencyLockdown, pin } = await req.json();

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { error: "كود الأمان السري PIN مطلوب لإتمام العملية" },
        { status: 400 }
      );
    }

    // Verify PIN against DB owner or fallback
    const ownerUser = await prisma.user.findFirst({
      where: { OR: [{ username: "maestro" }, { role: "owner" }] },
    });

    const expectedPin = ownerUser?.pin || "157230";
    if (pin.trim() !== expectedPin) {
      return NextResponse.json(
        { error: "كود الأمان السري الخاص بالمالك غير صحيح! تم رفض الطلب." },
        { status: 403 }
      );
    }

    const updated = await prisma.storeSettings.upsert({
      where: { id: "rovy_settings" },
      update: { isEmergencyLockdown: Boolean(isEmergencyLockdown) },
      create: {
        id: "rovy_settings",
        isEmergencyLockdown: Boolean(isEmergencyLockdown),
      },
    });

    return NextResponse.json({
      success: true,
      isEmergencyLockdown: updated.isEmergencyLockdown,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل تحديث وضع الطوارئ", details: error.message },
      { status: 500 }
    );
  }
}
