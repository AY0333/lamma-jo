import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookingSchema, bookingCode } from "@/lib/booking";

const ACTIVE = ["PENDING_OWNER", "CONFIRMED"] as const;

/**
 * قاعدة التعارض الذهبية:
 * - حجز FULL_EVENT بيوم كامل يقفل اليوم كله (لا استراحة ولا مناسبة أخرى)
 * - حجز DAY_USE يقفل الاستراحات الأخرى فقط، لكن مناسبة كاملة تقفله
 */
async function hasConflict(farmId: string, date: string, mode: "DAY_USE" | "FULL_EVENT") {
  const existing = await db.booking.findMany({
    where: { farmId, date, status: { in: [...ACTIVE] } },
    select: { mode: true },
  });
  if (existing.length === 0) return false;
  if (mode === "FULL_EVENT") return true; // أي حجز قائم يمنع المناسبة الكاملة
  return existing.some((b) => b.mode === "FULL_EVENT"); // الاستراحة تُمنع فقط بوجود مناسبة كاملة
}

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = bookingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "بيانات غير صالحة", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const farm = await db.farm.findUnique({ where: { id: input.farmId } });
  if (!farm || farm.status !== "PUBLISHED") {
    return NextResponse.json({ error: "المزرعة غير متاحة" }, { status: 404 });
  }

  // تحقق من السعة
  const capacity = input.mode === "FULL_EVENT" ? farm.capacityEvent : farm.capacityDayUse;
  if (input.guests > capacity) {
    return NextResponse.json(
      { error: `عدد الضيوف يتجاوز سعة المزرعة (${capacity})` },
      { status: 400 }
    );
  }

  // تحقق من التعارض
  if (await hasConflict(input.farmId, input.date, input.mode)) {
    return NextResponse.json(
      { error: "هذا التاريخ محجوز — اختر يومًا آخر" },
      { status: 409 }
    );
  }

  // حساب السعر
  const basePrice = input.mode === "FULL_EVENT" ? farm.priceFullEvent : farm.priceDayUse;

  let addOnsTotal = 0;
  const addOnLines: { addOnId: string; quantity: number; unitPrice: number; lineTotal: number }[] = [];
  if (input.addOns.length > 0) {
    const ids = input.addOns.map((a) => a.addOnId);
    const addOns = await db.addOn.findMany({ where: { id: { in: ids }, active: true } });
    for (const sel of input.addOns) {
      const addon = addOns.find((a) => a.id === sel.addOnId);
      if (!addon) continue;
      const unitPrice = addon.price;
      const lineTotal =
        addon.priceUnit === "per_person" ? unitPrice * input.guests : unitPrice * sel.quantity;
      addOnsTotal += lineTotal;
      addOnLines.push({ addOnId: addon.id, quantity: sel.quantity, unitPrice, lineTotal });
    }
  }

  const totalPrice = basePrice + addOnsTotal;
  const depositAmount = Math.round((totalPrice * farm.depositPercent) / 100);

  const booking = await db.booking.create({
    data: {
      code: bookingCode(),
      farmId: farm.id,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      mode: input.mode,
      eventType: input.eventType,
      guests: input.guests,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      paymentMethod: input.paymentMethod,
      basePrice,
      addOnsTotal,
      totalPrice,
      depositAmount,
      notes: input.notes,
      addOns: { create: addOnLines },
    },
    include: { farm: true, addOns: { include: { addOn: true } } },
  });

  return NextResponse.json({ booking }, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const phone = searchParams.get("phone");
  if (!code) return NextResponse.json({ error: "رقم الحجز مطلوب" }, { status: 400 });

  const booking = await db.booking.findUnique({
    where: { code },
    include: { farm: { include: { photos: true } }, addOns: { include: { addOn: true } } },
  });
  if (!booking) return NextResponse.json({ error: "الحجز غير موجود" }, { status: 404 });
  if (phone && booking.customerPhone !== phone) {
    return NextResponse.json({ error: "رقم الهاتف لا يطابق الحجز" }, { status: 403 });
  }
  return NextResponse.json({ booking });
}
