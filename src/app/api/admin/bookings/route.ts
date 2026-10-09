import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// قائمة الحجوزات للوحة الأدمن
export async function GET() {
  const bookings = await db.booking.findMany({
    include: { farm: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookings });
}

// تغيير حالة حجز
export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  const allowed = ["PENDING_OWNER", "CONFIRMED", "COMPLETED", "CANCELLED", "REJECTED"];
  if (!id || !allowed.includes(status)) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }
  try {
    const booking = await db.booking.update({ where: { id }, data: { status } });
    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "تعذّر التحديث" }, { status: 400 });
  }
}
