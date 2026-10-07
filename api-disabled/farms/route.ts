import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const governorate = searchParams.get("governorate");
  const mode = searchParams.get("mode"); // DAY_USE | FULL_EVENT
  const guests = Number(searchParams.get("guests") ?? 0);

  const farms = await db.farm.findMany({
    where: {
      status: "PUBLISHED",
      ...(governorate ? { governorate } : {}),
      ...(guests > 0
        ? mode === "FULL_EVENT"
          ? { capacityEvent: { gte: guests } }
          : { capacityDayUse: { gte: guests } }
        : {}),
    },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: [{ featured: "desc" }, { ratingAvg: "desc" }],
  });

  return NextResponse.json({ farms });
}
