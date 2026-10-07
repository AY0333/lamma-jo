export const dynamic = "force-dynamic";


import Link from "next/link";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import ImageCarousel from "@/components/ImageCarousel";
import { getFarm, formatJOD, whatsappLink } from "@/lib/data";

export default async function FarmPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const farm = getFarm(slug);
  if (!farm) notFound();

  const wa = whatsappLink(
    farm.whatsapp,
    `مرحبًا! بدي أستفسر عن ${farm.name} عبر لمّة JO 🌿`
  );

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/farms" className="text-sm font-bold text-emerald-700 hover:underline">
          → رجوع للمزارع
        </Link>

        <div className="mt-3 h-64 overflow-hidden rounded-2xl md:h-80">
          <ImageCarousel images={farm.images} alt={farm.name} fallbackEmoji={farm.emoji} />
        </div>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-emerald-700">{farm.governorate} • {farm.area}</p>
            <h1 className="mt-1 text-3xl font-black">{farm.name}</h1>
          </div>
          {farm.featured && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">⭐ مميزة</span>
          )}
        </div>

        <p className="mt-3 leading-relaxed text-stone-700">{farm.description}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {farm.hasPool && <span className="rounded-lg bg-sky-100 px-3 py-1">🏊 مسبح</span>}
          {farm.hasBBQ && <span className="rounded-lg bg-orange-100 px-3 py-1">🍖 منطقة شواء</span>}
          {farm.hasPlayground && <span className="rounded-lg bg-green-100 px-3 py-1">🛝 ملعب أطفال</span>}
          <span className="rounded-lg bg-stone-200 px-3 py-1">🛏️ {farm.bedrooms} غرف نوم</span>
          <span className="rounded-lg bg-stone-200 px-3 py-1">🚿 {farm.bathrooms} حمامات</span>
          <span className="rounded-lg bg-stone-200 px-3 py-1">👥 استراحة: حتى {farm.capacityDayUse}</span>
          <span className="rounded-lg bg-stone-200 px-3 py-1">🎉 مناسبة: حتى {farm.capacityEvent}</span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-sky-300 bg-sky-50 p-5">
            <p className="text-2xl">☀️</p>
            <h2 className="font-black">استراحة نهارية</h2>
            <p className="mt-1 text-2xl font-black text-emerald-700">{formatJOD(farm.priceDayUse)}</p>
            <p className="text-sm text-stone-600">حتى {farm.capacityDayUse} شخص • عربون {farm.depositPercent}%</p>
            <Link
              href={`/book?farm=${farm.slug}&mode=DAY_USE`}
              className="mt-3 block rounded-full bg-sky-600 px-4 py-2 text-center font-bold text-white hover:bg-sky-700"
            >
              احجز استراحة
            </Link>
          </div>
          <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5">
            <p className="text-2xl">🎉</p>
            <h2 className="font-black">مناسبة كاملة</h2>
            <p className="mt-1 text-2xl font-black text-emerald-700">{formatJOD(farm.priceFullEvent)}</p>
            <p className="text-sm text-stone-600">حتى {farm.capacityEvent} شخص • المكان كله لك + إضافات</p>
            <Link
              href={`/book?farm=${farm.slug}&mode=FULL_EVENT`}
              className="mt-3 block rounded-full bg-emerald-700 px-4 py-2 text-center font-bold text-white hover:bg-emerald-800"
            >
              احجز مناسبة
            </Link>
          </div>
        </div>

        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-full bg-[#25D366] px-4 py-3 text-center font-bold text-white hover:brightness-95"
        >
          💬 استفسر عبر واتساب
        </a>
      </main>
      <Footer />
    </>
  );
}
