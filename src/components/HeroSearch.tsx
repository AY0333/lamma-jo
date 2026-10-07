"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GOVERNORATES, EVENT_TYPES } from "@/lib/data";

export default function HeroSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [governorate, setGovernorate] = useState("");
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");

  function search() {
    const q = new URLSearchParams();
    if (governorate) q.set("governorate", governorate);
    if (eventType) q.set("eventType", eventType);
    if (guests) q.set("guests", guests);
    if (date) q.set("date", date);
    router.push(`/farms${q.toString() ? `?${q.toString()}` : ""}`);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-emerald-700 px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-emerald-800"
      >
        تصفح المزارع
      </button>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl animate-[heroIn_.35s_ease-out] rounded-3xl bg-white/95 p-4 text-right shadow-2xl backdrop-blur transition-all duration-300 md:p-5">
      <div className="flex items-center gap-2 rounded-2xl border-2 border-emerald-600 bg-white px-4 py-3">
        <span className="text-xl">🔍</span>
        <input
          autoFocus
          value={governorate}
          onChange={(e) => setGovernorate(e.target.value)}
          placeholder="أين تريد حجز مزرعتك؟"
          list="gov-list"
          className="w-full bg-transparent text-stone-900 outline-none placeholder:text-stone-400"
        />
        <datalist id="gov-list">
          {GOVERNORATES.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        <select
          value={governorate}
          onChange={(e) => setGovernorate(e.target.value)}
          className="rounded-xl border border-stone-300 bg-white p-2.5 text-sm"
        >
          <option value="">المحافظة</option>
          {GOVERNORATES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="rounded-xl border border-stone-300 bg-white p-2.5 text-sm"
        >
          <option value="">نوع المناسبة</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          max={500}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          placeholder="عدد الأشخاص"
          className="rounded-xl border border-stone-300 p-2.5 text-sm"
        />
        <input
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-stone-300 p-2.5 text-sm"
        />
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={search}
          className="flex-1 rounded-full bg-emerald-700 py-2.5 font-bold text-white transition hover:bg-emerald-800"
        >
          بحث 🔍
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-bold text-stone-600 hover:bg-stone-100"
        >
          إغلاق
        </button>
      </div>
    </div>
  );
}
