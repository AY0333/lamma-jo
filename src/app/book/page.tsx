import { Suspense } from "react";
import { Header, Footer } from "@/components/layout";
import { BookForm } from "./BookForm";

export default function BookPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-black">📝 احجز مناسبتك</h1>
        <Suspense fallback={<p className="mt-6">جاري التحميل...</p>}>
          <BookForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
