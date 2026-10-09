// Lamma JO — استعلامات المزارع من قاعدة البيانات
// تُرجع البيانات بالشكل نفسه الذي تستخدمه الواجهات (بنموذج Farm من data.ts)
import { db } from "@/lib/db";
import type { Farm, AddOn } from "@/lib/data";

function emojiFor(gov: string): string {
  if (gov === "مادبا") return "🌊";
  if (gov === "عجلون" || gov === "جرش") return "🌲";
  return "🌴";
}

type FarmRow = {
  photos: { url: string }[];
  governorate: string;
  id: string;
  name: string;
  slug: string;
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
  status: string;
};

function toFarmView(f: FarmRow): Farm {
  return {
    id: f.id,
    name: f.name,
    slug: f.slug,
    governorate: f.governorate,
    area: f.area,
    description: f.description,
    capacityDayUse: f.capacityDayUse,
    capacityEvent: f.capacityEvent,
    bedrooms: f.bedrooms,
    bathrooms: f.bathrooms,
    hasPool: f.hasPool,
    hasPlayground: f.hasPlayground,
    hasBBQ: f.hasBBQ,
    priceDayUse: f.priceDayUse,
    priceFullEvent: f.priceFullEvent,
    depositPercent: f.depositPercent,
    whatsapp: f.whatsapp,
    featured: f.featured,
    emoji: emojiFor(f.governorate),
    images: f.photos.map((p) => p.url),
  };
}

export async function getFarms(opts: {
  governorate?: string;
  featured?: boolean;
} = {}): Promise<Farm[]> {
  const rows = await db.farm.findMany({
    where: {
      status: "PUBLISHED",
      ...(opts.governorate ? { governorate: opts.governorate } : {}),
      ...(opts.featured ? { featured: true } : {}),
    },
    include: { photos: { orderBy: { order: "asc" } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(toFarmView);
}

export async function getFarmBySlug(slug: string): Promise<Farm | null> {
  const row = await db.farm.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  return row && row.status === "PUBLISHED" ? toFarmView(row) : null;
}

export async function getAddOns(): Promise<AddOn[]> {
  const rows = await db.addOn.findMany({
    where: { active: true },
    orderBy: { price: "asc" },
  });
  return rows.map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description ?? "",
    price: a.price,
    priceUnit: a.priceUnit === "per_person" ? "per_person" : "per_booking",
    icon: a.icon,
    priceLabel:
      a.priceUnit === "per_person" ? `${a.price} د.أ للشخص` : `${a.price} د.أ`,
  }));
}
