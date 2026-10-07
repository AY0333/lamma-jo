import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-black text-emerald-700">
          لمّة <span className="text-amber-500">JO</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/farms" className="hover:text-emerald-700">
            المزارع
          </Link>
          <Link href="/book" className="rounded-full bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800">
            احجز الآن
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-stone-500">
        <p className="font-bold text-stone-700">لمّة JO — احجز مزرعتك ومناسبتك من مكان واحد</p>
        <p>استراحة نهارية أو حجز مناسبة كاملة مع بوفيه ودي جي وزينة — والدفع عند الوصول.</p>
        <p>عمّان، الأردن 🇯🇴</p>
      </div>
    </footer>
  );
}
