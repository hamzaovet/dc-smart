import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        phone: true,
        pin: true,
        isActive: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع بيانات المستخدمين", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { username, password, pin, name, role, phone } = await req.json();

    if (!username || !password || !pin || !name) {
      return NextResponse.json(
        { error: "جميع الحقول (اسم المستخدم، كلمة المرور، كود PIN، والاسم) مطلوبة" },
        { status: 400 }
      );
    }

    const cleanUser = String(username).trim();

    const existing = await prisma.user.findUnique({
      where: { username: cleanUser },
    });

    if (existing) {
      return NextResponse.json(
        { error: "اسم المستخدم مسجل بالفعل، يرجى اختيار اسم مستخدم آخر" },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        username: cleanUser,
        password: String(password).trim(),
        pin: String(pin).trim(),
        name: String(name).trim(),
        role: role || "staff",
        phone: phone ? String(phone).trim() : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل إنشاء الحساب الجديد", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, isActive, pin, role, name, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    // Protect maestro from being deactivated or changed from owner
    if (user.username === "maestro" && isActive === false) {
      return NextResponse.json(
        { error: "لا يمكن تعطيل الحساب الرئيسي للمالك (المايسترو)" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (pin) updateData.pin = String(pin).trim();
    if (role && user.username !== "maestro") updateData.role = role;
    if (name) updateData.name = String(name).trim();
    if (password) updateData.password = String(password).trim();

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل تحديث بيانات الحساب", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف المستخدم مطلوب" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    if (user.username === "maestro") {
      return NextResponse.json(
        { error: "لا يمكن حذف حساب المالك (المايسترو)" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل حذف الحساب", details: error.message },
      { status: 500 }
    );
  }
}
