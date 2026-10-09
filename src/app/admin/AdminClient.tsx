"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatJOD } from "@/lib/data";
import FarmForm, { type FarmInput } from "./FarmForm";

export interface FarmRow extends FarmInput {
  id: string;
  slug: string;
  status: string;
}

export interface BookingRow {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  farmName: string;
  date: string;
  guests: number;
  mode: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING_OWNER: "جديد",
  CONFIRMED: "مؤكد",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
  REJECTED: "مرفوض",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_OWNER: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  COMPLETED: "bg-sky-100 text-sky-800",
  CANCELLED: "bg-red-100 text-red-800",
  REJECTED: "bg-stone-200 text-stone-600",
};

type Tab = "dashboard" | "farms" | "bookings";

const NUM_FIELDS = [
  "capacityDayUse", "capacityEvent", "bedrooms", "bathrooms",
  "priceDayUse", "priceFullEvent", "depositPercent",
];
const BOOL_FIELDS = ["hasPool", "hasPlayground", "hasBBQ", "featured"];

export default function AdminClient({
  stats,
  farms,
  bookings,
}: {
  stats: { farms: number; bookings: number; addOns: number };
  farms: FarmRow[];
  bookings: BookingRow[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [editing, setEditing] = useState<FarmRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave(data: FarmInput, id?: string) {
    setMsg("");
    let ok = false;
    if (id) {
      const json: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(data)) {
        if (key === "imageFiles" || key === "images") continue;
        json[key] = BOOL_FIELDS.includes(key)
          ? Boolean(val)
          : NUM_FIELDS.includes(key)
            ? Number(val)
            : val;
      }
      const res = await fetch(`/api/admin/farms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      ok = res.ok;
      setMsg(res.ok ? "✅ تم حفظ التعديلات" : "❌ تعذّر الحفظ");
    } else {
      const fd = new FormData();
      for (const [key, val] of Object.entries(data)) {
        if (key === "imageFiles") {
          for (const f of val as File[]) fd.append("files", f);
        } else if (key === "images") {
          fd.append("imageUrls", (val as string[]).join("\n"));
        } else if (typeof val === "boolean") {
          if (val) fd.set(key, "on");
        } else {
          fd.set(key, String(val));
        }
      }
      const res = await fetch("/api/admin/farms", { method: "POST", body: fd });
      ok = res.ok;
      setMsg(res.ok ? "✅ أُضيفت المزرعة — ستظهر في الموقع الآن" : "❌ تعذّر الإضافة");
    }
    if (ok) {
      setEditing(null);
      setAdding(false);
      router.refresh();
    }
  }

  async function handleDelete(farm: FarmRow) {
    if (!confirm(`حذف "${farm.name}" نهائيًا؟`)) return;
    const res = await fetch(`/api/admin/farms/${farm.id}`, { method: "DELETE" });
    setMsg(res.ok ? "🗑️ تم الحذف" : "❌ لا يمكن حذف مزرعة بها حجوزات");
    router.refresh();
  }

  async function changeStatus(id: string, status: string) {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
  }


  return (
    <div dir="rtl" className="min-h-screen bg-stone-100 font-sans text-stone-900">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <Link href="/" className="text-xl font-black text-emerald-700">
            لمّة <span className="text-amber-500">JO</span> — لوحة التحكم
          </Link>
          <nav className="flex gap-1">
            {([
              ["dashboard", "📊 الرئيسية"],
              ["farms", "🏡 المزارع"],
              ["bookings", "📋 الحجوزات"],
            ] as [Tab, string][]).map(([t, label]) => (
              <button
                key={t}
                onClick={() => { setTab(t); setAdding(false); setEditing(null); }}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${tab === t ? "bg-emerald-700 text-white" : "text-stone-600 hover:bg-stone-100"}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        {msg && <p className="mb-4 rounded-xl bg-white p-3 text-sm font-bold shadow-sm">{msg}</p>}
        {tab === "dashboard" && (
          <section>
            <h1 className="text-2xl font-black">📊 نظرة عامة</h1>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-stone-500">عدد المزارع</p>
                <p className="mt-1 text-4xl font-black text-emerald-700">{stats.farms}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-stone-500">عدد الحجوزات</p>
                <p className="mt-1 text-4xl font-black text-amber-600">{stats.bookings}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-stone-500">عدد الإضافات</p>
                <p className="mt-1 text-4xl font-black text-sky-600">{stats.addOns}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button onClick={() => { setTab("farms"); setAdding(true); }}
                className="rounded-2xl bg-emerald-700 p-5 text-right font-black text-white transition hover:bg-emerald-800">
                ➕ إضافة مزرعة جديدة
              </button>
              <button onClick={() => setTab("bookings")}
                className="rounded-2xl bg-stone-800 p-5 text-right font-black text-white transition hover:bg-stone-900">
                📋 إدارة الحجوزات ({stats.bookings})
              </button>
            </div>
          </section>
        )}
        {tab === "farms" && !adding && !editing && (
          <section>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black">🏡 المزارع ({farms.length})</h1>
              <button onClick={() => setAdding(true)}
                className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-800">
                ➕ إضافة مزرعة
              </button>
            </div>
            <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full text-right text-sm">
                <thead className="border-b border-stone-200 bg-stone-50 text-stone-500">
                  <tr>
                    <th className="p-3">اسم المزرعة</th>
                    <th className="p-3">المحافظة</th>
                    <th className="p-3">استراحة</th>
                    <th className="p-3">مناسبة</th>
                    <th className="p-3">الصور</th>
                    <th className="p-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {farms.map((f) => (
                    <tr key={f.id} className="border-b border-stone-100">
                      <td className="p-3 font-bold">{f.name} {f.featured && "⭐"}</td>
                      <td className="p-3">{f.governorate}</td>
                      <td className="p-3">{formatJOD(f.priceDayUse)}</td>
                      <td className="p-3">{formatJOD(f.priceFullEvent)}</td>
                      <td className="p-3">{f.images.length}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setEditing(f); setAdding(false); }}
                            className="rounded-lg bg-sky-100 px-3 py-1 font-bold text-sky-700 hover:bg-sky-200">
                            تعديل
                          </button>
                          <button onClick={() => handleDelete(f)}
                            className="rounded-lg bg-red-100 px-3 py-1 font-bold text-red-700 hover:bg-red-200">
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {farms.length === 0 && (
                    <tr><td colSpan={6} className="p-6 text-center text-stone-400">لا توجد مزارع — أضف أول مزرعة</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {(adding || editing) && (
          <section>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black">{editing ? "✏️ تعديل مزرعة" : "➕ مزرعة جديدة"}</h1>
              <button onClick={() => { setAdding(false); setEditing(null); }}
                className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm font-bold text-stone-600 hover:bg-stone-100">
                إلغاء
              </button>
            </div>
            <div className="mt-4">
              <FarmForm initial={editing} onSave={handleSave} />
            </div>
          </section>
        )}
        {tab === "bookings" && (
          <section>
            <h1 className="text-2xl font-black">📋 الحجوزات ({bookings.length})</h1>
            <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full text-right text-sm">
                <thead className="border-b border-stone-200 bg-stone-50 text-stone-500">
                  <tr>
                    <th className="p-3">رقم الحجز</th>
                    <th className="p-3">العميل</th>
                    <th className="p-3">الهاتف</th>
                    <th className="p-3">المزرعة</th>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">السعر</th>
                    <th className="p-3">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-stone-100">
                      <td className="p-3 font-mono font-bold text-emerald-700" dir="ltr">{b.code}</td>
                      <td className="p-3">{b.customerName}</td>
                      <td className="p-3 font-mono text-xs" dir="ltr">{b.customerPhone}</td>
                      <td className="p-3">{b.farmName}</td>
                      <td className="p-3">{b.date}</td>
                      <td className="p-3 font-bold">{formatJOD(b.totalPrice)}</td>
                      <td className="p-3">
                        <select
                          value={b.status}
                          onChange={(e) => changeStatus(b.id, e.target.value)}
                          className={`rounded-lg px-2 py-1 text-xs font-bold ${STATUS_COLORS[b.status] ?? "bg-stone-100"}`}
                        >
                          {Object.entries(STATUS_LABELS).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={7} className="p-6 text-center text-stone-400">لا توجد حجوزات بعد</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
