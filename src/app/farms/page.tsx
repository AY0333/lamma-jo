export const dynamic = "force-dynamic";


import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import ImageCarousel from "@/components/ImageCarousel";
import { FARMS, GOVERNORATES, formatJOD } from "@/lib/data";

export default async function FarmsPage({
  searchParams,
}: {
  searchParams: Promise<{ governorate?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const gov = params.governorate ?? "";
  const farms = gov ? FARMS.filter((f) => f.governorate === gov) : FARMS;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-black">🏡 مزارع وشاليهات الأردن</h1>
        <p className="mt-1 text-stone-600">
          {params.mode === "FULL_EVENT"
            ? "🎉 وضع المناسبة الكاملة — المكان كله لك"
            : params.mode === "DAY_USE"
              ? "☀️ وضع الاستراحة النهارية — طشة عائلية"
              : "اختار المزرعة المناسبة لطشتك أو مناسبتك"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/farms"
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${!gov ? "bg-emerald-700 text-white" : "bg-white border border-stone-300"}`}
          >
            الكل
          </Link>
          {GOVERNORATES.filter((g) => FARMS.some((f) => f.governorate === g)).map((g) => (
            <Link
              key={g}
              href={`/farms?governorate=${encodeURIComponent(g)}${params.mode ? `&mode=${params.mode}` : ""}`}
              className={`rounded-full px-4 py-1.5 text-sm font-bold ${gov === g ? "bg-emerald-700 text-white" : "bg-white border border-stone-300"}`}
            >
              {g}
            </Link>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {farms.map((f) => (
            <Link
              key={f.id}
              href={`/farms/${f.slug}${params.mode ? `?mode=${params.mode}` : ""}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <ImageCarousel images={f.images} alt={f.name} fallbackEmoji={f.emoji} />
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-lg font-black">{f.name}</h3>
                <p className="mt-0.5 text-xs font-bold text-emerald-700">{f.governorate} • {f.area}</p>
                <p className="mt-1 line-clamp-2 text-sm text-stone-600">{f.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {f.hasPool && <span className="rounded bg-sky-100 px-2 py-0.5">🏊 مسبح</span>}
                  {f.hasBBQ && <span className="rounded bg-orange-100 px-2 py-0.5">🍖 شواء</span>}
                  {f.hasPlayground && <span className="rounded bg-green-100 px-2 py-0.5">🛝 ملعب</span>}
                  <span className="rounded bg-stone-100 px-2 py-0.5">🛏️ {f.bedrooms} غرف</span>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-3 text-sm">
                  <span>☀️ <b className="text-emerald-700">{formatJOD(f.priceDayUse)}</b></span>
                  <span>🎉 <b className="text-emerald-700">{formatJOD(f.priceFullEvent)}</b></span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {farms.length === 0 && (
          <p className="mt-8 text-center text-stone-500">لا توجد مزارع في هذه المحافظة بعد — قريبًا!</p>
        )}
      </main>
      <Footer />
    </>
  );
}
