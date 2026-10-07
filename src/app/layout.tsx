import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "لمّة JO | احجز مزرعتك ومناسبتك من مكان واحد",
  description:
    "لمّة JO — منصة أردنية لحجز المزارع والشاليهات: استراحة نهارية أو مناسبة كاملة مع بوفيه ودي جي وزينة، والدفع عند الوصول.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
