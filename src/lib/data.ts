// Lamma JO — بيانات MVP تعمل فورًا بدون قاعدة بيانات
// عند اكتمال تثبيت Prisma تُستبدل هذه البيانات بـ API قاعدة البيانات.

export const GOVERNORATES = [
  "عمّان", "إربد", "الزرقاء", "البلقاء", "مادبا", "الكرك",
  "معان", "العقبة", "المفرق", "جرش", "عجلون", "الطفيلة",
];

export const EVENT_TYPES = [
  "طشة عائلية", "عرس", "حنّاء", "مولود جديد",
  "تخرج", "عيد ميلاد", "تجمع أصدقاء", "اجتماع عمل",
];

export interface Farm {
  id: string;
  name: string;
  slug: string;
  governorate: string;
  area: string;
  description: string;
  capacityDayUse: number;
  capacityEvent: number;
  bedrooms: number;
  bathrooms: number;
  hasPool: boolean;
  hasPlayground: boolean;
  hasBBQ: boolean;
  priceDayUse: number;
  priceFullEvent: number;
  depositPercent: number;
  whatsapp: string;
  featured: boolean;
  emoji: string;
  images: string[];
  
  
}

export const FARMS: Farm[] = [
  {
    id: "farm-1",
    name: "مزرعة الواحة الخضراء",
    slug: "al-waha-alkhadra",
    governorate: "البلقاء",
    area: "الفحيص",
    description:
      "مزرعة عائلية واسعة مع مسبح كبير وملعب أطفال ومنطقة شواء مجهزة. مثالية للطشات العائلية ومناسبات المولود والتخرج.",
    capacityDayUse: 40, capacityEvent: 120, bedrooms: 3, bathrooms: 2,
    hasPool: true, hasPlayground: true, hasBBQ: true,
    priceDayUse: 90, priceFullEvent: 350, depositPercent: 30,
    whatsapp: "962790000001", featured: true, emoji: "🌴",
    images: ["/farms/farm-1-1.jpg", "/farms/farm-1-2.jpg", "/farms/farm-1-3.jpg"],
  },
  {
    id: "farm-2",
    name: "شاليه البحر الميت فيو",
    slug: "deadsea-view-chalet",
    governorate: "مادبا",
    area: "البحر الميت",
    description:
      "شاليه فاخر بإطلالة على البحر الميت، مسبح خاص وجلسات خارجية. مناسب للأعراس الصغيرة وجلسات التصوير.",
    capacityDayUse: 25, capacityEvent: 80, bedrooms: 4, bathrooms: 3,
    hasPool: true, hasPlayground: false, hasBBQ: true,
    priceDayUse: 150, priceFullEvent: 600, depositPercent: 30,
    whatsapp: "962790000002", featured: true, emoji: "🌊",
    images: ["/farms/farm-2-1.jpg", "/farms/farm-2-2.jpg", "/farms/farm-2-3.jpg"],
  },
  {
    id: "farm-3",
    name: "مزرعة جبال عجلون",
    slug: "ajloun-mountains-farm",
    governorate: "عجلون",
    area: "عجلون",
    description:
      "مزرعة جبلية بين أشجار البلوط، أجواء طبيعية هادئة مع بيت ريفي. مثالية للاستراحات وحفلات الحنّاء.",
    capacityDayUse: 30, capacityEvent: 100, bedrooms: 2, bathrooms: 2,
    hasPool: true, hasPlayground: true, hasBBQ: true,
    priceDayUse: 70, priceFullEvent: 280, depositPercent: 30,
    whatsapp: "962790000003", featured: false, emoji: "🌲",
    images: ["/farms/farm-3-1.jpg", "/farms/farm-3-2.jpg", "/farms/farm-3-3.jpg"],
  },
];

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: "per_booking" | "per_person";
  icon: string;
  priceLabel: string;
}

export const ADDONS: AddOn[] = [
  { id: "a1", name: "بوفيه مفتوح", description: "مشاوي + مقبلات + حلويات", price: 18, priceUnit: "per_person", icon: "🍖", priceLabel: "18 د.أ للشخص" },
  { id: "a2", name: "دي جي + إضاءة أفراح", description: "سماعات احترافية + إضاءة ليزر", price: 150, priceUnit: "per_booking", icon: "🔊", priceLabel: "150 د.أ" },
  { id: "a3", name: "زينة + بالونات", description: "تجهيز كامل حسب المناسبة", price: 80, priceUnit: "per_booking", icon: "🎈", priceLabel: "80 د.أ" },
  { id: "a4", name: "تصوير فوتوغرافي", description: "مصوّر محترف طوال المناسبة", price: 120, priceUnit: "per_booking", icon: "📸", priceLabel: "120 د.أ" },
  { id: "a5", name: "كيك + ضيافة", description: "كيك مناسبات + عصائر", price: 60, priceUnit: "per_booking", icon: "🎂", priceLabel: "60 د.أ" },
  { id: "a6", name: "كراسي وطاولات", description: "تأجير إضافي للضيوف", price: 25, priceUnit: "per_booking", icon: "🪑", priceLabel: "25 د.أ" },
];

export interface BookingRecord {
  code: string;
  farmId: string;
  farmName: string;
  customerName: string;
  customerPhone: string;
  mode: "DAY_USE" | "FULL_EVENT";
  eventType?: string;
  guests: number;
  date: string;
  basePrice: number;
  addOnsTotal: number;
  totalPrice: number;
  depositAmount: number;
  status: string;
  createdAt: string;
}

const KEY = "lamma-bookings";

export function getBookings(): BookingRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveBooking(b: BookingRecord) {
  const all = getBookings();
  all.unshift(b);
  localStorage.setItem(KEY, JSON.stringify(all));
}

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

export function getFarm(slug: string): Farm | undefined {
  return FARMS.find((f) => f.slug === slug || f.id === slug);
}
