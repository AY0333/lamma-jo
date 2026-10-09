import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// إنشاء مزرعة جديدة من لوحة الأدمن (يتوقع multipart/form-data)
export async function POST(req: Request) {
  const form = await req.formData();

  const str = (k: string, def = "") => String(form.get(k) ?? def).trim();
  const num = (k: string, def = 0) => Number(form.get(k) ?? def) || def;
  const bool = (k: string) => form.get(k) === "on" || form.get(k) === "true";

  const name = str("name");
  if (!name) return NextResponse.json({ error: "اسم المزرعة مطلوب" }, { status: 400 });

  let slug = str("slug") || `farm-${Date.now().toString(36)}`;
  if (await db.farm.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;

  const urls: string[] = [];
  for (const file of form.getAll("files")) {
    if (!(file instanceof File) || file.size === 0) continue;
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const fname = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const dir = path.join(process.cwd(), "public", "farm");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, fname), Buffer.from(await file.arrayBuffer()));
    urls.push(`/farm/${fname}`);
  }
  const urlText = str("imageUrls");
  for (const u of urlText.split("\n")) {
    const t = u.trim();
    if (t) urls.push(t);
  }

  const farm = await db.farm.create({
    data: {
      name,
      slug,
      governorate: str("governorate", "عمّان"),
      area: str("area"),
      description: str("description"),
      capacityDayUse: num("capacityDayUse", 30),
      capacityEvent: num("capacityEvent", 100),
      bedrooms: num("bedrooms"),
      bathrooms: num("bathrooms"),
      hasPool: bool("hasPool"),
      hasPlayground: bool("hasPlayground"),
      hasBBQ: bool("hasBBQ"),
      priceDayUse: num("priceDayUse", 100),
      priceFullEvent: num("priceFullEvent", 400),
      depositPercent: num("depositPercent", 30),
      whatsapp: str("whatsapp", "962790000000"),
      featured: bool("featured"),
      status: "PUBLISHED",
      photos: {
        create: urls.map((url, i) => ({ url, order: i, alt: `${name} - صورة ${i + 1}` })),
      },
    },
    include: { photos: true },
  });

  return NextResponse.json({ farm }, { status: 201 });
}
