import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: { advances: { orderBy: { date: "desc" } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ employees });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل استرجاع بيانات الموظفين", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // If recording an advance / loan for an employee
    if (body.action === "advance") {
      const { employeeId, amount, reason } = body;
      const advance = await prisma.employeeAdvance.create({
        data: {
          employeeId,
          amount: Number(amount),
          reason: reason || "سلفة تحت الحساب",
        },
      });

      await prisma.employee.update({
        where: { id: employeeId },
        data: { totalAdvances: { increment: Number(amount) } },
      });

      return NextResponse.json({ success: true, advance });
    }

    // Creating a new Employee
    const { name, phone, nationalId, role, basicSalary, commissionRate, notes } = body;
    if (!name || !phone) {
      return NextResponse.json({ error: "الاسم ورقم الهاتف مطلوبان" }, { status: 400 });
    }

    const employee = await prisma.employee.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        nationalId: nationalId ? nationalId.trim() : null,
        role: role || "فني تركيبات",
        basicSalary: Number(basicSalary) || 0,
        commissionRate: Number(commissionRate) || 0,
        notes: notes ? notes.trim() : null,
      },
    });

    return NextResponse.json({ success: true, employee });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل حفظ بيانات الموظف", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, phone, nationalId, role, basicSalary, commissionRate, notes, status } = body;

    if (!id) {
      return NextResponse.json({ error: "معرف الموظف مطلوب للتعديل" }, { status: 400 });
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name: name?.trim(),
        phone: phone?.trim(),
        nationalId: nationalId ? nationalId.trim() : null,
        role: role || undefined,
        basicSalary: basicSalary !== undefined ? Number(basicSalary) : undefined,
        commissionRate: commissionRate !== undefined ? Number(commissionRate) : undefined,
        notes: notes !== undefined ? notes : undefined,
        status: status || undefined,
      },
    });

    return NextResponse.json({ success: true, employee });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل تعديل بيانات الموظف", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف الموظف مطلوب للحذف" }, { status: 400 });
    }

    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل حذف الموظف", details: error.message },
      { status: 500 }
    );
  }
}
