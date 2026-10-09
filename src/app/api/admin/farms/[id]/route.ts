import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// حذف مزرعة
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await db.farm.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذّر الحذف" }, { status: 400 });
  }
}

// تعديل مزرعة
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  try {
    const farm = await db.farm.update({ where: { id }, data: body });
    return NextResponse.json({ farm });
  } catch {
    return NextResponse.json({ error: "تعذّر التعديل" }, { status: 400 });
  }
}
