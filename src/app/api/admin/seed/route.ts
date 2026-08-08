import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/* ============================================================
   POST /api/admin/seed - Seed database with default content

   SAFE MODE (default):
   - Only adds missing items, NEVER deletes existing data
   - Settings: upserts by key (preserves user-edited values)
   - Departments/Gallery/Archive: only creates if table is empty
   - Your uploads, text edits, and pictures are ALWAYS preserved

   RESET MODE (?reset=true):
   - Full wipe and recreate all data
   - Use ONLY when you want to reset everything to defaults
   ============================================================ */

const DEFAULT_SETTINGS: Record<string, string> = {
  heroTitle: "نەخۆشخانەی پیرمام",
  heroSubtitle: "خزمەتگوزاری تەندروستی بەرز و متمانەپێکراو",
  heroDescription: "ئێمە لە نەخۆشخانەی پیرمام بە پێشەنگی تەکنەلۆژیا و تیمی پزیشکی شارەزا، باشترین خزمەتگوزاری تەندروستی پێشکەش بۆ خەڵکی کوردستان دەکەین. تەندروستی خەڵک ئەولویەتی ئێمەیە.",
  heroBadge: "خزمەتگوزاری تەندروستی لە کوردستان",
  stat1Value: "٢٠٠+",
  stat1Label: "پزیشکی شارەزا",
  stat2Value: "٥٠٠٠٠+",
  stat2Label: "نەخۆشی سەردەم",
  stat3Value: "٢٤/٧",
  stat3Label: "خزمەتگوزاری",
  stat4Value: "١٥+",
  stat4Label: "ساڵ ئەزموون",
  hospitalNameKu: "نەخۆشخانەی پیرمام",
  hospitalNameEn: "Pirmam Hospital",
  phone1: "+٩٦٤ ٧٥٠ ١٢٣ ٤٥٦٧",
  phone2: "+٩٦٤ ٧٧٠ ٩٨٧ ٦٥٤٣",
  email: "info@pirmam-hospital.com",
  addressKu: "شارەزانی پیرمام، هەولێر، هەرێمی کوردستان، عێراق",
  workingHours: "٢٤ کاتژمێر - ٧ ڕۆژ لە هەفتە",
  facebookUrl: "#",
  footerDescription: "نەخۆشخانەی پیرمام بە پێشەنگی تەکنەلۆژیا و تیمی پزیشکی شارەزا، باشترین خزمەتگوزاری تەندروستی پێشکەش دەکات.",
  deptSectionTitle: "بەشەکانی نەخۆشخانە",
  deptSectionDesc: "نەخۆشخانەی پیرمام بەشەکی تایبەت و شارەزای هەیە بۆ چارەسەری هەموو جۆرە نەخۆشیەک",
  gallerySectionTitle: "گەلەری وێنە",
  gallerySectionDesc: "وێنەیەکانی نەخۆشخانەی پیرمام - بینینی نزیک لە فەزا و کەرەستەکانی نەخۆشخانە",
  archiveSectionTitle: "ئەرشیف و هەواڵی نەخۆشخانە",
  archiveSectionDesc: "بەرنامە، تۆمارەکان، هەواڵ و بۆنیانەکانی نەخۆشخانەی پیرمام",
  navLabelHome: "سەرەتا",
  navLabelDepartments: "بەشەکان",
  navLabelGallery: "گەلەری",
  navLabelArchive: "ئەرشیف و هەواڵی نەخۆشخانە",
  adminPassword: "pirmam2025",
};

const DEFAULT_DEPARTMENTS = [
  { name: "دڵ و مەڕگە", description: "چارەسەری نەخۆشیەکانی دڵ و خولانەوەی خوێن بە کەرەستەی پێشکەوتوو", iconName: "HeartPulse", order: 0 },
  { name: "دەمارۆکی", description: "پشکنین و چارەسەری نەخۆشیەکانی مێشک و سیستەمی دەمار", iconName: "Brain", order: 1 },
  { name: "ئێسک و چەوری", description: "چارەسەری برین و نەخۆشیەکانی ئێسک و چەوری", iconName: "Bone", order: 2 },
  { name: "منداڵان", description: "خزمەتگوزاری تەندروستی تایبەت بۆ منداڵان و ساوایان", iconName: "Baby", order: 3 },
  { name: "چاو", description: "پشکنین و چارەسەری هەموو جۆرە نەخۆشیەکانی چاو", iconName: "Eye", order: 4 },
  { name: "ناوخۆیی", description: "پشکنین و چارەسەری نەخۆشیەکانی ئەندامە ناوخۆییەکان", iconName: "Stethoscope", order: 5 },
  { name: "دەرمانسازی", description: "دابینکردنی دەرمانی ستاندارد و ڕاوێژکاری دەرمانی", iconName: "Pill", order: 6 },
  { name: "تاقیگە", description: "تاقیگەی پێشکەوتوو بۆ هەموو جۆرە پشکنینەکان", iconName: "Microscope", order: 7 },
  { name: "بەرگری", description: "وەرگرتنی بەرگری و چارەسەری خوێن", iconName: "Syringe", order: 8 },
  { name: "ڕادیۆلۆژی", description: "پشکنینی ئێکس ڕەی، سی تی سکان، و ئێم ئاڕ ئای", iconName: "ScanLine", order: 9 },
  { name: "فریاکەوتن", description: "خزمەتگوزاری فریاکەوتنی خێرا بۆ هەموو کات", iconName: "Activity", order: 10 },
  { name: "لوو و دەموچاو و قوڕگ", description: "چارەسەری نەخۆشیەکانی لوو، قوڕگ و دەموچاو", iconName: "Ear", order: 11 },
];

const DEFAULT_GALLERY = [
  { title: "دەرەوەی نەخۆشخانە", description: "دەرەوەی نەخۆشخانەی پیرمام", color: "from-teal-600/80 to-emerald-700/80", order: 0 },
  { title: "سەردانی نەخۆشان", description: "سەردانی نەخۆشان لە نەخۆشخانە", color: "from-emerald-600/80 to-teal-700/80", order: 1 },
  { title: "تاقیگەی پێشکەوتوو", description: "تاقیگەی پێشکەوتووی نەخۆشخانە", color: "from-cyan-600/80 to-teal-700/80", order: 2 },
  { title: "ئۆپەراسیۆنخانە", description: "ئۆپەراسیۆنخانەی نەخۆشخانەی پیرمام", color: "from-teal-700/80 to-cyan-600/80", order: 3 },
  { title: "پشکنینی مەڕگە", description: "مەکینەی پشکنینی مەڕگە", color: "from-emerald-700/80 to-teal-600/80", order: 4 },
  { title: "هۆڵی وەرگرتن", description: "هۆڵی وەرگرتنی نەخۆشخانە", color: "from-cyan-700/80 to-emerald-600/80", order: 5 },
];

const DEFAULT_ARCHIVE = [
  { title: "نەخۆشخانەی پیرمام خەڵاتی باشترین نەخۆشخانەی کوردستانی وەرگرت", description: "لە ئاهەنگی ساڵانەی تەندروستی کوردستان، نەخۆشخانەی پیرمام خەڵاتی باشترین نەخۆشخانەی ساڵی وەرگرت. ئەم خەڵاتە بەهۆی خزمەتگوزاری بێنظیری تەندروستی و تیمی شارەزای پزیشکی دابەنرا. ئێمە بە شانازییەوە ئەم سەرکەوتنە پێشکەشی خەڵکی کوردستان دەکەین.", date: "٢٠٢٥/٠١/١٥", category: "تۆمار", color: "from-amber-600/70 to-orange-700/70", order: 0 },
  { title: "کەمپەینی تەندروستی بەخۆڕایی بۆ هاوڵاتیان", description: "نەخۆشخانەی پیرمام کەمپەینێکی تەندروستی بەخۆڕایی بۆ هاوڵاتیان ئەنجام دا. لەم کەمپەینەدا پشکنینی تەواوی تەندروستی بە بێبەها بۆ زیاتر لە ١٠٠٠ هاوڵاتی ئەنجامدرا. ئەم چالاکییە بەشێک بوو لە ئەرکی کۆمەڵایەتی نەخۆشخانەکە بۆ کۆمەڵگا.", date: "٢٠٢٤/١٢/٠١", category: "بۆنیانە", color: "from-emerald-600/70 to-teal-700/70", order: 1 },
  { title: "سمیناری نێودەوڵەتی پزیشکی لە نەخۆشخانەی پیرمام", description: "سمینارێکی نێودەوڵەتی لە بوارەکانی پزیشکی سەرەتایی و نەشتەرگەری لە نەخۆشخانەی پیرمام بەڕێوەچوو. زیاتر لە ٥٠ پزیشکی شارەزا لە وڵاتانی جیاواز بەشداریان کرد. سمینارەکە لەلایەن مامۆستایان و پسپۆڕانی نێودەوڵەتیەوە ئەنجامدرا.", date: "٢٠٢٤/١٠/٢٠", category: "فێربوون", color: "from-cyan-600/70 to-blue-700/70", order: 2 },
  { title: "کراندنەوەی باڵەخانەی نوێی نەخۆشخانە", description: "باڵەخانەی نوێی نەخۆشخانەی پیرمام کە لەگەڵ کەرەستەی پێشکەوتووی تەندروستی ئامادەکراوە، بە فەرمی کرایەوە. ئەم باڵەخانەیە لەگەڵ ١٢٠ جێی نەخۆش و ٤ ژووری نەشتەرگەری و تاقیگەی پێشکەوتوو خزمەتگوزاری تەندروستی باشتر پێشکەش دەکات.", date: "٢٠٢٤/٠٨/٠٥", category: "تۆمار", color: "from-teal-600/70 to-emerald-700/70", order: 3 },
];

/* ========== RESET MODE: Full wipe and recreate ========== */
async function resetDatabase() {
  await db.$executeRaw`DELETE FROM ArchiveImage`;
  await db.siteSetting.deleteMany();
  await db.department.deleteMany();
  await db.galleryItem.deleteMany();
  await db.archiveItem.deleteMany();

  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.siteSetting.create({ data: { key, value } });
  }
  for (const d of DEFAULT_DEPARTMENTS) {
    await db.department.create({ data: d });
  }
  for (const g of DEFAULT_GALLERY) {
    await db.galleryItem.create({ data: g });
  }
  for (const a of DEFAULT_ARCHIVE) {
    await db.archiveItem.create({ data: a });
  }
}

/* ========== SAFE MODE: Only fill missing, never delete ========== */
async function safeSeed() {
  let createdCount = 0;

  /* Settings: upsert by key - creates missing ones, keeps existing ones untouched */
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.siteSetting.upsert({
      where: { key },
      update: {}, // empty update = never overwrite user edits
      create: { key, value },
    });
    createdCount++;
  }

  /* Departments: only create if table is completely empty */
  const deptCount = await db.department.count();
  if (deptCount === 0) {
    for (const d of DEFAULT_DEPARTMENTS) {
      await db.department.create({ data: d });
    }
    createdCount += DEFAULT_DEPARTMENTS.length;
  }

  /* Gallery: only create if table is completely empty */
  const galCount = await db.galleryItem.count();
  if (galCount === 0) {
    for (const g of DEFAULT_GALLERY) {
      await db.galleryItem.create({ data: g });
    }
    createdCount += DEFAULT_GALLERY.length;
  }

  /* Archive: only create if table is completely empty */
  const arcCount = await db.archiveItem.count();
  if (arcCount === 0) {
    for (const a of DEFAULT_ARCHIVE) {
      await db.archiveItem.create({ data: a });
    }
    createdCount += DEFAULT_ARCHIVE.length;
  }

  return createdCount;
}

/* ========== MAIN HANDLER ========== */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isReset = searchParams.get("reset") === "true";

    if (isReset) {
      await resetDatabase();
      return NextResponse.json({
        success: true,
        message: "Database fully reset to defaults (ALL existing data was deleted)",
        mode: "reset",
      });
    }

    const createdCount = await safeSeed();
    return NextResponse.json({
      success: true,
      message: `Safe seed complete. ${createdCount} default items ensured. Your existing data was preserved.`,
      mode: "safe",
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
