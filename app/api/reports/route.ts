import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [orders, expenses] = await Promise.all([
      prisma.order.findMany(),
      prisma.expense.findMany(),
    ]);

    let totalRevenue = 0;
    let totalDelivery = 0;
    const byStatus: Record<string, number> = {};
    const byPayment: Record<string, number> = {};

    orders.forEach((order) => {
      byStatus[order.status] = (byStatus[order.status] || 0) + 1;
      const pm = order.paymentMethod || "COD";
      byPayment[pm] = (byPayment[pm] || 0) + 1;

      // Include non-cancelled orders in revenue
      if (order.status !== "CANCELLED") {
        totalRevenue += order.totalAmount || 0;
        totalDelivery += order.deliveryFee || 0;
      }
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
    const netProfit = totalRevenue - totalDelivery - totalExpenses;

    return NextResponse.json({
      totalRevenue,
      totalDelivery,
      totalExpenses,
      netProfit,
      ordersCount: orders.length,
      byStatus,
      byPayment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "فشل إنشاء التقرير المالي", details: error.message },
      { status: 500 }
    );
  }
}
