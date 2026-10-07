import { z } from "zod";

export const GOVERNORATES = [
  "عمّان",
  "إربد",
  "الزرقاء",
  "البلقاء",
  "مادبا",
  "الكرك",
  "معان",
  "العقبة",
  "المفرق",
  "جرش",
  "عجلون",
  "الطفيلة",
] as const;

export const EVENT_TYPES = [
  "طشة عائلية",
  "عرس",
  "حنّاء",
  "مولود جديد",
  "تخرج",
  "عيد ميلاد",
  "تجمع أصدقاء",
  "اجتماع عمل",
] as const;

export const bookingSchema = z.object({
  farmId: z.string().min(1, "اختر المزرعة"),
  mode: z.enum(["DAY_USE", "FULL_EVENT"], { message: "اختر نوع الحجز" }),
  eventType: z.string().optional(),
  customerName: z.string().min(2, "الاسم مطلوب"),
  customerPhone: z
    .string()
    .regex(/^9627\d{8}$/, "رقم الهاتف يجب أن يكون أردنيًا (9627XXXXXXXX)"),
  guests: z.coerce.number().int().min(1, "عدد الضيوف مطلوب").max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "التاريخ غير صالح"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  paymentMethod: z.enum(["ON_ARRIVAL", "BANK_TRANSFER"]).default("ON_ARRIVAL"),
  addOns: z
    .array(z.object({ addOnId: z.string(), quantity: z.coerce.number().int().min(1).default(1) }))
    .default([]),
  notes: z.string().max(500).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export function bookingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `LM-${s}`;
}

export function formatJOD(n: number): string {
  return `${n.toLocaleString("ar-JO", { maximumFractionDigits: 0 })} د.أ`;
}

export function whatsappLink(phone: string, text: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
