"use client";

import { EVENT_TYPES, formatJOD, type AddOn, type Farm } from "@/lib/data";

export interface FieldsProps {
  farms: Farm[];
  addOns: AddOn[];
  saving: boolean;
  mode: "DAY_USE" | "FULL_EVENT";
  setMode: (m: "DAY_USE" | "FULL_EVENT") => void;
  farmId: string;
  setFarmId: (v: string) => void;
  eventType: string;
  setEventType: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  guests: number;
  setGuests: (v: number) => void;
  date: string;
  setDate: (v: string) => void;
  selected: string[];
  toggle: (id: string) => void;
  capacity: number;
  basePrice: number;
  addOnsTotal: number;
  total: number;
  deposit: number;
  depositPercent: number;
  error: string;
  submit: (e: React.FormEvent) => void;
}

export default function BookFields(p: FieldsProps) {
  return (
    <form onSubmit={p.submit} className="mt-6 space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => p.setMode("DAY_USE")}
          className={`rounded-2xl border-2 p-4 text-right ${p.mode === "DAY_USE" ? "border-sky-500 bg-sky-50" : "border-stone-200 bg-white"}`}>
          <p className="text-2xl">☀️</p>
          <p className="font-black">استراحة نهارية</p>
          <p className="text-sm text-stone-500">طشة + مسبح + شواء</p>
        </button>
        <button type="button" onClick={() => p.setMode("FULL_EVENT")}
          className={`rounded-2xl border-2 p-4 text-right ${p.mode === "FULL_EVENT" ? "border-emerald-500 bg-emerald-50" : "border-stone-200 bg-white"}`}>
          <p className="text-2xl">🎉</p>
          <p className="font-black">مناسبة كاملة</p>
          <p className="text-sm text-stone-500">المكان كله + إضافات</p>
        </button>
      </div>
      <div>
        <label className="font-bold">🏡 المزرعة</label>
        <select value={p.farmId} onChange={(e) => p.setFarmId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-3">
          {p.farms.map((f) => (
            <option key={f.id} value={f.slug}>{f.name} — {f.governorate}</option>
          ))}
        </select>
      </div>
      {p.mode === "FULL_EVENT" && (
        <div>
          <label className="font-bold">🎊 نوع المناسبة</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <button key={t} type="button" onClick={() => p.setEventType(t)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold ${p.eventType === t ? "bg-emerald-700 text-white" : "bg-white border border-stone-300"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="font-bold">👤 الاسم الكامل</label>
          <input value={p.name} onChange={(e) => p.setName(e.target.value)} placeholder="مثال: أحمد"
            className="mt-1 w-full rounded-xl border border-stone-300 p-3" />
        </div>
        <div>
          <label className="font-bold">📱 رقم الهاتف</label>
          <input value={p.phone} onChange={(e) => p.setPhone(e.target.value)} placeholder="9627XXXXXXXX" dir="ltr"
            className="mt-1 w-full rounded-xl border border-stone-300 p-3 text-left" />
        </div>
        <div>
          <label className="font-bold">👥 عدد الضيوف (حتى {p.capacity})</label>
          <input type="number" min={1} max={p.capacity} value={p.guests}
            onChange={(e) => p.setGuests(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-stone-300 p-3" />
        </div>
        <div>
          <label className="font-bold">📅 التاريخ</label>
          <input type="date" value={p.date} min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => p.setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-stone-300 p-3" />
        </div>
      </div>


      {p.mode === "FULL_EVENT" && (
        <div>
          <label className="font-bold">✨ الإضافات — كل شي علينا</label>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {ADDONS.map((a) => {
              const on = p.selected.includes(a.id);
              return (
                <button key={a.id} type="button" onClick={() => p.toggle(a.id)}
                  className={`rounded-xl border-2 p-3 text-right ${on ? "border-emerald-500 bg-emerald-50" : "border-stone-200 bg-white"}`}>
                  <div className="flex items-center justify-between">
                    <span>{a.icon} <b>{a.name}</b></span>
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${on ? "bg-emerald-600 text-white" : "bg-stone-200"}`}>{on ? "✓" : ""}</span>
                  </div>
                  <p className="mt-1 text-sm text-stone-500">{a.description}</p>
                  <p className="text-sm font-bold text-emerald-700">
                    {a.priceUnit === "per_person" ? `${a.price} × ${p.guests} = ${formatJOD(a.price * p.guests)}` : formatJOD(a.price)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="rounded-2xl bg-stone-900 p-5 text-white">
        <div className="flex justify-between text-sm text-stone-300">
          <span>السعر الأساسي</span>
          <span>{formatJOD(p.basePrice)}</span>
        </div>
        {p.mode === "FULL_EVENT" && (
          <div className="flex justify-between text-sm text-stone-300">
            <span>الإضافات ({p.selected.length})</span>
            <span>{formatJOD(p.addOnsTotal)}</span>
          </div>
        )}
        <div className="mt-2 flex justify-between border-t border-stone-700 pt-2 text-lg font-black">
          <span>المجموع</span>
          <span className="text-amber-400">{formatJOD(p.total)}</span>
        </div>
        <div className="flex justify-between text-sm text-stone-300">
          <span>العربون ({p.depositPercent}%)</span>
          <span>{formatJOD(p.deposit)}</span>
        </div>
      </div>
      {p.error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">⚠️ {p.error}</p>}
      <button type="submit" className="w-full rounded-full bg-emerald-700 py-4 text-lg font-black text-white hover:bg-emerald-800">
        تأكيد طلب الحجز 📩
      </button>
      <p className="text-center text-sm text-stone-500">الدفع عند الوصول أو تحويل بنكي — بدون دفع إلكتروني حاليًا</p>
    </form>
  );
}
