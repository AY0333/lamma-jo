import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const addOns = await db.addOn.findMany({ where: { active: true }, orderBy: { price: "asc" } });
  return NextResponse.json({ addOns });
}
