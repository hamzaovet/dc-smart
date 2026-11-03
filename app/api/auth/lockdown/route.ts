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
    const { isEmergencyLockdown } = await req.json();

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
