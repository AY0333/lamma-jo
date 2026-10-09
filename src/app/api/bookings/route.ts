import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// كل الحجوزات (للاستخدام الداخلي)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const farmId = searchParams.get("farmId");
  const bookings = await db.booking.findMany({
    where: farmId ? { farmId } : undefined,
    include: { farm: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookings });
}
