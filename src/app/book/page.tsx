export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { Header, Footer } from "@/components/layout";
import { getFarms, getAddOns } from "@/lib/farms-db";
import { BookForm } from "./BookForm";

export default async function BookPage() {
  const [farms, addOns] = await Promise.all([getFarms(), getAddOns()]);
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-black">📝 احجز مناسبتك</h1>
        <Suspense fallback={<p className="mt-6">جاري التحميل...</p>}>
          <BookForm farms={farms} addOns={addOns} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
