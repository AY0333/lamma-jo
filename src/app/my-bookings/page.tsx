"use client";

import { useState } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { getBookings, formatJOD } from "@/lib/data";

export default function MyBookingsPage() {
  const [items] = useState(getBookings);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-black">📋 حجوزاتي</h1>
        <p className="mt-1 text-stone-600">كل طلبات الحجز من هذا الجهاز</p>
        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <p className="text-5xl">🌿</p>
            <p className="mt-2 font-bold">لا توجد حجوزات بعد</p>
            <Link href="/farms" className="mt-3 inline-block rounded-full bg-emerald-700 px-6 py-2 font-bold text-white">
              تصفح المزارع
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {items.map((b) => (
              <div key={b.code} className="rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <b dir="ltr" className="text-emerald-700">{b.code}</b>
                  <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-800">{b.status}</span>
                </div>
                <p className="mt-2 font-black">{b.farmName}</p>
                <p className="text-sm text-stone-600">📅 {b.date} • 👥 {b.guests} • {b.mode === "FULL_EVENT" ? "🎉 مناسبة" : "☀️ استراحة"}</p>
                <p className="mt-1 text-sm">💰 المجموع: <b className="text-emerald-700">{formatJOD(b.totalPrice)}</b></p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
