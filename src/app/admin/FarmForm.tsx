"use client";

import { useState } from "react";
import { GOVERNORATES } from "@/lib/data";

export interface FarmInput {
  name: string;
  description: string;
  governorate: string;
  area: string;
  capacityDayUse: number;
  capacityEvent: number;
  bedrooms: number;
  bathrooms: number;
  hasPool: boolean;
  hasPlayground: boolean;
  hasBBQ: boolean;
  priceDayUse: number;
  priceFullEvent: number;
  depositPercent: number;
  whatsapp: string;
  featured: boolean;
  images: string[];
  imageFiles: File[];
}


const EMPTY: FarmInput = {
  name: "", description: "", governorate: "عمّان", area: "",
  capacityDayUse: 30, capacityEvent: 100, bedrooms: 2, bathrooms: 1,
  hasPool: true, hasPlayground: false, hasBBQ: true,
  priceDayUse: 100, priceFullEvent: 400, depositPercent: 30,
  whatsapp: "962790000000", featured: false, images: [], imageFiles: [],
};

export default function FarmForm({
  initial,
  onSave,
}: {
  initial?: (FarmInput & { id: string }) | null;
  onSave: (data: FarmInput, id?: string) => Promise<void>;
}) {
  const [d, setD] = useState<FarmInput>(initial ? { ...initial } : { ...EMPTY });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FarmInput>(k: K, v: FarmInput[K]) {
    setD((p) => ({ ...p, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (d.name.trim().length < 3) return setError("اسم المزرعة قصير جدًا");
    if (d.description.trim().length < 10) return setError("الوصف قصير — 10 أحرف على الأقل");
    if (d.priceDayUse <= 0 || d.priceFullEvent <= 0) return setError("أدخل سعرًا صحيحًا");
    setBusy(true);
    await onSave(d, initial?.id);
    setBusy(false);
  }

  const inputCls = "w-full rounded-xl border border-stone-300 bg-white p-2.5 text-sm";
  const labelCls = "block text-sm font-bold text-stone-700";
  const span2 = "md:col-span-2";

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2">
      <div className={span2}>
        <label className={labelCls}>اسم المزرعة *</label>
        <input className={inputCls} value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="مزرعة الواحة" />
      </div>
      <div className={span2}>
        <label className={labelCls}>الوصف *</label>
        <textarea className={`${inputCls} h-24`} value={d.description} onChange={(e) => set("description", e.target.value)} placeholder="وصف المزرعة ومميزاتها..." />
      </div>
      <div>
        <label className={labelCls}>المحافظة</label>
        <select className={inputCls} value={d.governorate} onChange={(e) => set("governorate", e.target.value)}>
          {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>المنطقة</label>
        <input className={inputCls} value={d.area} onChange={(e) => set("area", e.target.value)} placeholder="الفحيص" />
      </div>
      <div>
        <label className={labelCls}>عدد الأشخاص — استراحة</label>
        <input type="number" min={1} className={inputCls} value={d.capacityDayUse} onChange={(e) => set("capacityDayUse", Number(e.target.value))} />
      </div>
      <div>
        <label className={labelCls}>عدد الغرف</label>
        <input type="number" min={0} className={inputCls} value={d.bedrooms} onChange={(e) => set("bedrooms", Number(e.target.value))} />
      </div>
      <div>
        <label className={labelCls}>عدد الحمامات</label>
        <input type="number" min={0} className={inputCls} value={d.bathrooms} onChange={(e) => set("bathrooms", Number(e.target.value))} />
      </div>
      <div>
        <label className={labelCls}>السعر اليومي (استراحة) د.أ *</label>
        <input type="number" min={1} className={inputCls} value={d.priceDayUse} onChange={(e) => set("priceDayUse", Number(e.target.value))} />
      </div>
      <div>
        <label className={labelCls}>سعر المناسبة الكاملة د.أ *</label>
        <input type="number" min={1} className={inputCls} value={d.priceFullEvent} onChange={(e) => set("priceFullEvent", Number(e.target.value))} />
      </div>
      <div>
        <label className={labelCls}>نسبة العربون %</label>
        <input type="number" min={0} max={100} className={inputCls} value={d.depositPercent} onChange={(e) => set("depositPercent", Number(e.target.value))} />
      </div>
      <div>
        <label className={labelCls}>رقم واتساب (دولي)</label>
        <input dir="ltr" className={`${inputCls} text-left`} value={d.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="96279XXXXXXX" />
      </div>
      <div className="flex flex-wrap gap-4 md:col-span-2">
        {([["hasPool", "🏊 مسبح"], ["hasBBQ", "🍖 شواء"], ["hasPlayground", "🛝 ملعب"], ["featured", "⭐ مميزة"]] as const).map(([k, l]) => (
          <label key={k} className="flex cursor-pointer items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={d[k]} onChange={(e) => set(k, e.target.checked)} className="h-4 w-4 accent-emerald-600" />
            {l}
          </label>
        ))}
      </div>
      <div className={span2}>
        <label className={labelCls}>صور المزرعة — اختر عدة صور</label>
        <input type="file" accept="image/*" multiple
          onChange={(e) => set("imageFiles", Array.from(e.target.files ?? []))}
          className="mt-1 w-full rounded-xl border border-dashed border-stone-300 p-2.5 text-sm" />
        {d.imageFiles.length > 0 && (
          <p className="mt-1 text-xs font-bold text-emerald-700">📷 {d.imageFiles.length} صورة مختارة</p>
        )}
        {initial && initial.images.length > 0 && (
          <p className="mt-1 text-xs text-stone-500">الصور الحالية: {initial.images.length} (تبقى كما هي)</p>
        )}
      </div>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700 md:col-span-2">⚠️ {error}</p>}
      <button type="submit" disabled={busy}
        className="rounded-full bg-emerald-700 py-3 font-black text-white transition hover:bg-emerald-800 disabled:opacity-50 md:col-span-2">
        {busy ? "جارٍ الحفظ..." : initial ? "💾 حفظ التعديلات" : "➕ إضافة المزرعة"}
      </button>
    </form>
  );
}
