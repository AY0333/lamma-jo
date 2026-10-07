"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GOVERNORATES, EVENT_TYPES } from "@/lib/data";

const PHRASES = [
  "ابحث عن إقامة صباحية...",
  "ابحث عن مسبح مدفأ...",
  "ابحث عن إقامة مسائية...",
  "ابحث عن مزرعة للعائلات...",
];

function useTypewriter() {
  const [text, setText] = useState("");
  const state = useRef({ phrase: 0, char: 0, deleting: false });

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      const s = state.current;
      const full = PHRASES[s.phrase];
      if (!s.deleting) {
        s.char += 1;
        setText(full.slice(0, s.char));
        if (s.char >= full.length) {
          s.deleting = true;
          timeout = setTimeout(tick, 2000);
          return;
        }
        timeout = setTimeout(tick, 70);
      } else {
        s.char -= 1;
        setText(full.slice(0, Math.max(0, s.char)));
        if (s.char <= 0) {
          s.deleting = false;
          s.phrase = (s.phrase + 1) % PHRASES.length;
          timeout = setTimeout(tick, 400);
          return;
        }
        timeout = setTimeout(tick, 35);
      }
    };
    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, []);

  return text;
}

export default function HeroSearch() {
  const router = useRouter();
  const typed = useTypewriter();
  const [query, setQuery] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [eventType, setEventType] = useState("");
  const [guests, setGuests] = useState("");
  const [date, setDate] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  function search() {
    const q = new URLSearchParams();
    if (governorate) q.set("governorate", governorate);
    if (eventType) q.set("eventType", eventType);
    if (guests) q.set("guests", guests);
    if (date) q.set("date", date);
    if (query.trim()) q.set("q", query.trim());
    router.push(`/farms${q.toString() ? `?${q.toString()}` : ""}`);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex items-center gap-2 rounded-full bg-white p-2 shadow-2xl shadow-black/30 transition focus-within:shadow-emerald-900/30 md:gap-3 md:p-2.5">
        <button
          type="button"
          onClick={search}
          aria-label="بحث"
          className="flex h-11 w-11 shrink-0 animate-[searchPulse_2.5s_ease-in-out_infinite] items-center justify-center rounded-full bg-emerald-600 text-xl text-white transition hover:bg-emerald-700 md:h-12 md:w-12"
        >
          🔍
        </button>
        <div className="relative min-w-0 flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            aria-label="ابحث عن مزرعتك"
            className="w-full bg-transparent py-2 text-base text-stone-900 outline-none"
          />
          {query.length === 0 && (
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center truncate text-base text-stone-400">
              {typed}
              <span className="mr-0.5 inline-block h-5 w-0.5 animate-pulse bg-emerald-600" />
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-label="فلترة"
          aria-expanded={filtersOpen}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl transition md:h-12 md:w-12 ${filtersOpen ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
        >
          ⚙️
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-out ${filtersOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="rounded-3xl bg-white/95 p-4 shadow-xl backdrop-blur">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              <select value={governorate} onChange={(e) => setGovernorate(e.target.value)}
                className="rounded-xl border border-stone-300 bg-white p-2.5 text-sm text-stone-800">
                <option value="">المحافظة</option>
                {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)}
                className="rounded-xl border border-stone-300 bg-white p-2.5 text-sm text-stone-800">
                <option value="">نوع المناسبة</option>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" min={1} max={500} value={guests}
                onChange={(e) => setGuests(e.target.value)} placeholder="عدد الأشخاص"
                className="rounded-xl border border-stone-300 p-2.5 text-sm text-stone-800" />
              <input type="date" value={date} min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border border-stone-300 p-2.5 text-sm text-stone-800" />
            </div>
            <button type="button" onClick={search}
              className="mt-3 w-full rounded-full bg-emerald-700 py-2.5 font-bold text-white transition hover:bg-emerald-800">
              بحث 🔍
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
