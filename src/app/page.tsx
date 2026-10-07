import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { FARMS, ADDONS, formatJOD } from "@/lib/data";

export default function Home() {
  const featured = FARMS.filter((f) => f.featured);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4">
        <section className="py-12 text-center">
          <p className="mb-3 inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-bold text-emerald-800">
            🇯🇴 أول منصة أردنية للمناسبات في المزارع
          </p>
          <h1 className="mx-auto max-w-2xl text-4xl font-black leading-tight md:text-5xl">
            احجز مزرعتك ومناسبتك <span className="text-emerald-700">من مكان واحد</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600">
            استراحة نهارية للعيلة، أو حجز كامل لعرسك — مع بوفيه ودي جي وزينة، والدفع عند الوصول.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/farms"
              className="rounded-full bg-emerald-700 px-8 py-3 font-bold text-white hover:bg-emerald-800"
            >
              تصفح المزارع
            </Link>
            <Link
              href="/farms?mode=FULL_EVENT"
              className="rounded-full border-2 border-emerald-700 px-8 py-3 font-bold text-emerald-700 hover:bg-emerald-50"
            >
              احجز مناسبتك 🎉
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href="/farms?mode=DAY_USE"
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="text-4xl">☀️</div>
            <h2 className="mt-2 text-xl font-black">استراحة نهارية</h2>
            <p className="mt-1 text-stone-600">طشة عائلية: مسبح + شواء + جلسات — ابتداءً من 70 د.أ</p>
          </Link>
          <Link
            href="/farms?mode=FULL_EVENT"
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="text-4xl">🎉</div>
            <h2 className="mt-2 text-xl font-black">مناسبة كاملة</h2>
            <p className="mt-1 text-stone-600">عرس، مولود، تخرج — المكان كله لك مع بوفيه ودي جي وزينة</p>
          </Link>
        </section>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">🏡 مزارع مميزة</h2>
            <Link href="/farms" className="text-sm font-bold text-emerald-700 hover:underline">
              عرض الكل ←
            </Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {featured.map((f) => (
              <Link
                key={f.id}
                href={`/farms/${f.slug}`}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-emerald-100 to-amber-100 text-6xl">
                  {f.governorate === "مادبا" ? "🌊" : f.governorate === "عجلون" ? "🌲" : "🌴"}
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold text-emerald-700">{f.governorate} • {f.area}</p>
                  <h3 className="mt-1 font-black">{f.name}</h3>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span>☀️ استراحة: <b>{formatJOD(f.priceDayUse)}</b></span>
                    <span>🎉 مناسبة: <b>{formatJOD(f.priceFullEvent)}</b></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-black">✨ إضافات المناسبات — كل شي علينا</h2>
          <p className="mt-1 text-stone-600">اختار الإضافات اللي بدك إياها واحنا منجهزها — بسعر واضح من الأول.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {ADDONS.slice(0, 4).map((a) => (
              <div key={a.id} className="rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm">
                <div className="text-3xl">{a.icon}</div>
                <p className="mt-2 font-bold">{a.name}</p>
                <p className="text-sm font-semibold text-emerald-700">{a.priceLabel}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-emerald-700 p-8 text-center text-white">
          <h2 className="text-2xl font-black">كيف بتحجز؟ 3 خطوات بس</h2>
          <div className="mt-4 grid gap-4 text-emerald-50 md:grid-cols-3">
            <div><p className="text-3xl font-black">1</p><p>اختار المزرعة والتاريخ</p></div>
            <div><p className="text-3xl font-black">2</p><p>ضيف البوفيه والدي جي والزينة</p></div>
            <div><p className="text-3xl font-black">3</p><p>ادفع عربون 30% أو عند الوصول</p></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

