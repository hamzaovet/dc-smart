import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { username, password, pin } = await req.json();

    if (!username || !password || !pin) {
      return NextResponse.json(
        { error: "يرجى إدخال اسم المستخدم، كلمة المرور، وكود الأمان PIN" },
        { status: 400 }
      );
    }

    const cleanUser = String(username).trim();
    const cleanPass = String(password).trim();
    const cleanPin = String(pin).trim();

    // 1. Check Store Emergency Lockdown status
    const settings = await prisma.storeSettings.findUnique({
      where: { id: "rovy_settings" },
    });

    const isLockdown = settings?.isEmergencyLockdown || false;

    // 2. Query User
    const user = await prisma.user.findUnique({
      where: { username: cleanUser },
    });

    if (!user || user.password !== cleanPass || user.pin !== cleanPin) {
      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة أو كود الأمان PIN غير متطابق" },
        { status: 401 }
      );
    }

    // 3. If Emergency Lockdown is Active and user is NOT the Owner (maestro)
    if (isLockdown && user.role !== "owner") {
      return NextResponse.json(
        {
          error:
            "تم تفعيل وضع طوارئ المالك! تم تعطيل وإيقاف تسجيل دخول جميع الحسابات حالياً.",
        },
        { status: 403 }
      );
    }

    // 4. Check if this specific user account is inactive
    if (!user.isActive) {
      return NextResponse.json(
        { error: "هذا الحساب معطل حالياً من قِبل إدارة المتجر." },
        { status: 403 }
      );
    }

    // Set cookie or session
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set("rovy_session", JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "حدث خطأ غير متوقع في الخادم", details: error.message },
      { status: 500 }
    );
  }
}
