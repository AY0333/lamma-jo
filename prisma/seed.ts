import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const ADDONS = [
  { name: "بوفيه مفتوح", description: "مشاوي + مقبلات + حلويات لعدد الضيوف", price: 18, priceUnit: "per_person", icon: "utensils" },
  { name: "دي جي + إضاءة أفراح", description: "سماعات احترافية + إضاءة ليزر", price: 150, priceUnit: "per_booking", icon: "music" },
  { name: "زينة + بالونات", description: "تجهيز كامل حسب نوع المناسبة", price: 80, priceUnit: "per_booking", icon: "party" },
  { name: "تصوير فوتوغرافي", description: "مصوّر محترف طوال المناسبة", price: 120, priceUnit: "per_booking", icon: "camera" },
  { name: "كيك + ضيافة", description: "كيك مناسبات + عصائر وضيافة", price: 60, priceUnit: "per_booking", icon: "cake" },
  { name: "كراسي وطاولات إضافية", description: "تأجير لكل 10 ضيوف إضافيين", price: 25, priceUnit: "per_booking", icon: "chairs" },
];

const FARMS = [
  {
    name: "مزرعة الواحة الخضراء",
    slug: "al-waha-alkhadra",
    governorate: "البلقاء",
    area: "الفحيص",
    description: "مزرعة عائلية واسعة مع مسبح كبير وملعب أطفال ومنطقة شواء مجهزة. مثالية للطشات العائلية ومناسبات المولود والتخرج.",
    capacityDayUse: 40, capacityEvent: 120, bedrooms: 3, bathrooms: 2,
    hasPool: true, hasPlayground: true, hasBBQ: true,
    priceDayUse: 90, priceFullEvent: 350, whatsapp: "962790000001", featured: true,
    images: ["/farm/waha1.jpg", "/farm/waha2.jpg", "/farm/waha3.jpg"],
  },
  {
    name: "شاليه البحر الميت فيو",
    slug: "deadsea-view-chalet",
    governorate: "مادبا",
    area: "البحر الميت",
    description: "شاليه فاخر بإطلالة على البحر الميت، مسبح خاص وجلسات خارجية. مناسب للأعراس الصغيرة وجلسات التصوير.",
    capacityDayUse: 25, capacityEvent: 80, bedrooms: 4, bathrooms: 3,
    hasPool: true, hasPlayground: false, hasBBQ: true,
    priceDayUse: 150, priceFullEvent: 600, whatsapp: "962790000002", featured: true,
    images: ["/farm/bahr1.jpg", "/farm/bahr2.jpg", "/farm/bahr3.jpg"],
  },
  {
    name: "مزرعة جبال عجلون",
    slug: "ajloun-mountains-farm",
    governorate: "عجلون",
    area: "عجلون",
    description: "مزرعة جبلية بين أشجار البلوط، أجواء طبيعية هادئة مع بيت ريفي. مثالية للاستراحات وحفلات الحنّاء.",
    capacityDayUse: 30, capacityEvent: 100, bedrooms: 2, bathrooms: 2,
    hasPool: true, hasPlayground: true, hasBBQ: true,
    priceDayUse: 70, priceFullEvent: 280, whatsapp: "962790000003", featured: false,
    images: ["/farm/agl1.jpg"],
  },
];

async function main() {
  const owner = await db.user.upsert({
    where: { phone: "962790000000" },
    update: {},
    create: { name: "مالك تجريبي", phone: "962790000000", role: "FARM_OWNER" },
  });

  for (const a of ADDONS) {
    const existing = await db.addOn.findFirst({ where: { name: a.name } });
    if (!existing) await db.addOn.create({ data: a });
  }

  for (const f of FARMS) {
    const { images, ...farmData } = f;
    const farm = await db.farm.upsert({
      where: { slug: f.slug },
      update: {},
      create: { ...farmData, ownerId: owner.id, status: "PUBLISHED" },
    });
    await db.farmPhoto.deleteMany({ where: { farmId: farm.id } });
    await db.farmPhoto.createMany({
      data: images.map((url, i) => ({
        farmId: farm.id,
        url,
        alt: `${f.name} - صورة ${i + 1}`,
        order: i,
      })),
    });
    await db.package.deleteMany({ where: { farmId: farm.id } });
    await db.package.createMany({
      data: [
        { farmId: farm.id, name: "باقة الطشة العائلية", description: "استراحة + شواء + مشروبات", price: f.priceDayUse + 60 },
        { farmId: farm.id, name: "باقة المناسبة الكاملة", description: "حجز كامل + بوفيه + دي جي + زينة", price: f.priceFullEvent + 350 },
      ],
    });
  }

  console.log("Seed done: owner + 6 addons + 3 farms + photos + packages.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
