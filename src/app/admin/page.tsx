export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const [farmCount, bookingCount, addOnCount, farms, bookings] = await Promise.all([
    db.farm.count(),
    db.booking.count(),
    db.addOn.count(),
    db.farm.findMany({
      include: { photos: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    db.booking.findMany({
      include: { farm: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const farmsData = farms.map((f) => ({
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
    status: f.status,
    images: f.photos.map((p) => p.url),
    imageFiles: [] as File[],
  }));

  const bookingsData = bookings.map((b) => ({
    id: b.id,
    code: b.code,
    customerName: b.customerName,
    customerPhone: b.customerPhone,
    farmName: b.farm.name,
    date: b.date,
    guests: b.guests,
    mode: b.mode,
    totalPrice: b.totalPrice,
    status: b.status,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <AdminClient
      stats={{ farms: farmCount, bookings: bookingCount, addOns: addOnCount }}
      farms={farmsData}
      bookings={bookingsData}
    />
  );
}
