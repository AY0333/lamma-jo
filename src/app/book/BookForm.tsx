"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BookFields from "./BookFields";
import {
  FARMS, ADDONS, BookingRecord,
  bookingCode, formatJOD, saveBooking, whatsappLink,
} from "@/lib/data";

export function BookForm() {
  const sp = useSearchParams();
  const [farmId, setFarmId] = useState(sp.get("farm") ?? FARMS[0].slug);
  const [mode, setMode] = useState<"DAY_USE" | "FULL_EVENT">(
    sp.get("mode") === "DAY_USE" ? "DAY_USE" : "FULL_EVENT"
  );
  const [eventType, setEventType] = useState("طشة عائلية");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(20);
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<string[]>(["a2"]);
  const [done, setDone] = useState<BookingRecord | null>(null);
  const [error, setError] = useState("");

  const farm = FARMS.find((f) => f.slug === farmId || f.id === farmId) ?? FARMS[0];
  const capacity = mode === "FULL_EVENT" ? farm.capacityEvent : farm.capacityDayUse;
  const basePrice = mode === "FULL_EVENT" ? farm.priceFullEvent : farm.priceDayUse;

  const addOnsTotal = useMemo(() => {
    return selected.reduce((sum, id) => {
      const a = ADDONS.find((x) => x.id === id);
      if (!a) return sum;
      return sum + (a.priceUnit === "per_person" ? a.price * guests : a.price);
    }, 0);
  }, [selected, guests]);

  const total = basePrice + addOnsTotal;
  const deposit = Math.round((total * farm.depositPercent) / 100);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("اكتب اسمك الكامل");
    if (!/^9627\d{8}$/.test(phone.replace(/[\s-]/g, "")))
      return setError("رقم الهاتف يجب أن يكون أردنيًا: 9627XXXXXXXX");
    if (guests < 1 || guests > capacity)
      return setError(`عدد الضيوف يجب أن يكون بين 1 و ${capacity}`);
    if (!date) return setError("اختر تاريخ الحجز");
    const record: BookingRecord = {
      code: bookingCode(),
      farmId: farm.id,
      farmName: farm.name,
      customerName: name.trim(),
      customerPhone: phone,
      mode,
      eventType: mode === "FULL_EVENT" ? eventType : undefined,
      guests,
      date,
      basePrice,
      addOnsTotal,
      totalPrice: total,
      depositAmount: deposit,
      status: "بانتظار موافقة المالك",
      createdAt: new Date().toISOString(),
    };
    saveBooking(record);
    setDone(record);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    const wa = whatsappLink(
      farm.whatsapp,
      `حجز جديد عبر لمّة JO | ${done.code} | ${done.farmName} | ${done.date} | ${done.guests} ضيف | ${formatJOD(done.totalPrice)}`
    );
    return (
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <p className="text-6xl">✅</p>
        <h1 className="mt-3 text-3xl font-black">تم استلام طلبك!</h1>
        <p className="mt-2 text-stone-600">رقم الحجز: <b dir="ltr" className="text-emerald-700">{done.code}</b></p>
        <div className="mx-auto mt-4 max-w-md rounded-xl bg-stone-50 p-4 text-right text-sm">
          <p>🏡 المزرعة: <b>{done.farmName}</b></p>
          <p>📅 التاريخ: <b>{done.date}</b></p>
          <p>👥 الضيوف: <b>{done.guests}</b></p>
          <p>💰 المجموع: <b className="text-emerald-700">{formatJOD(done.totalPrice)}</b></p>
          <p>🤝 العربون: <b>{formatJOD(done.depositAmount)}</b></p>
        </div>
        <a href={wa} target="_blank" rel="noopener noreferrer"
          className="mt-3 block rounded-full bg-[#25D366] px-4 py-3 font-bold text-white">💬 تأكيد عبر واتساب</a>
        <div className="mt-3 flex gap-2">
          <Link href="/my-bookings" className="flex-1 rounded-full border border-stone-300 px-4 py-2 font-bold">حجوزاتي</Link>
          <Link href="/farms" className="flex-1 rounded-full bg-emerald-700 px-4 py-2 font-bold text-white">حجز جديد</Link>
        </div>
      </div>
    );
  }

  return <BookFields
    mode={mode} setMode={setMode}
    farmId={farmId} setFarmId={setFarmId}
    eventType={eventType} setEventType={setEventType}
    name={name} setName={setName}
    phone={phone} setPhone={setPhone}
    guests={guests} setGuests={setGuests}
    date={date} setDate={setDate}
    selected={selected} toggle={toggle}
    capacity={capacity} basePrice={basePrice}
    addOnsTotal={addOnsTotal} total={total} deposit={deposit}
    depositPercent={farm.depositPercent}
    error={error} submit={submit}
  />;
}
