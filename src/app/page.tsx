import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import HeroSearch from "@/components/HeroSearch";
import ImageCarousel from "@/components/ImageCarousel";
import { FARMS, ADDONS, formatJOD } from "@/lib/data";

const HERO_IMAGE = "/farm/agl1.jpg";

const OCCASION_SERVICES = [
  { icon: "🍖", title: "بوفيه مفتوح", desc: "مشاوي ومقبلات وحلويات لضيوفك" },
  { icon: "🔊", title: "DJ وصوتيات", desc: "سماعات احترافية وإضاءة أفراح" },
  { icon: "🎈", title: "زينة وتجهيز حسب الطلب", desc: "بالونات وتنسيق كامل للمناسبة" },
  { icon: "📸", title: "تصوير", desc: "مصوّر محترف يوثّق أجمل اللحظات" },
];

const TRUST = [
  { icon: "✓", title: "أماكن موثوقة", desc: "مزارع محققة بصور حقيقية" },
  { icon: "⚡", title: "حجز سريع", desc: "احجز بدقائق وأكّد عبر واتساب" },
  { icon: "🎉", title: "كل الخدمات بمكان واحد", desc: "المزرعة + البوفيه + الزينة" },
  { icon: "💰", title: "أسعار واضحة", desc: "سعر نهائي بدون مفاجآت" },
];

export default function Home() {
  const featured = FARMS.filter((f) => f.featured);

  return (
    <>
      <Header />
      <section
        className="relative overflow-hidden bg-stone-900 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url(${HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
          <div className="mb-6">
            <HeroSearch />
          </div>
          <p className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-bold backdrop-blur">
            🇯🇴 أول منصة أردنية للمناسبات في المزارع
          </p>
          <h1 className="mx-auto max-w-2xl text-4xl font-black leading-tight md:text-5xl">
            احجز مزرعتك ومناسبتك من مكان واحد
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-200">
            حجز مزارع وشاليهات مع خدمات المناسبات: البوفيه، DJ، الزينة والتصوير — والدفع عند الوصول.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3">
            <Link
              href="/farms?mode=FULL_EVENT"
              className="rounded-full border-2 border-white px-8 py-3 font-bold text-white transition hover:bg-white hover:text-stone-900"
            >
              احجز مناسبتك 🎉
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4">
        <section className="mt-8 grid gap-4 md:grid-cols-2">
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
          <h2 className="text-2xl font-black">🎊 جهز مناسبتك بالكامل</h2>
          <p className="mt-1 text-stone-600">كل خدمات المناسبة من مكان واحد — بسعر واضح من الأول.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {OCCASION_SERVICES.map((s) => (
              <div key={s.title} className="rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">{s.icon}</div>
                <p className="mt-2 font-black">{s.title}</p>
                <p className="mt-1 text-sm text-stone-500">{s.desc}</p>
              </div>
            ))}
          </div>
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
                className="flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <ImageCarousel images={f.images} alt={f.name} fallbackEmoji={f.emoji} heightClass="h-44" />
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-black">{f.name}</h3>
                  <p className="mt-0.5 text-xs font-bold text-emerald-700">{f.governorate} • {f.area}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-600">{f.description}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-3 text-sm">
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

        <section className="mt-12 rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="text-center text-2xl font-black">🤝 لماذا لمّة JO؟</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.title} className="rounded-2xl bg-stone-50 p-5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-xl font-black text-white">{t.icon}</div>
                <p className="mt-2 font-black">{t.title}</p>
                <p className="mt-1 text-sm text-stone-500">{t.desc}</p>
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

