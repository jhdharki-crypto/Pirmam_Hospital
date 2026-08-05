import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/* POST /api/admin/seed - Seed database with default content */
export async function POST() {
  try {
    /* Clear existing data - use raw SQL for archive images since model may not be in client yet */
    await db.$executeRaw`DELETE FROM ArchiveImage`;
    await db.siteSetting.deleteMany();
    await db.department.deleteMany();
    await db.galleryItem.deleteMany();
    await db.archiveItem.deleteMany();

    /* Site settings */
    const settings = [
      { key: "heroTitle", value: "نەخۆشخانەی پیرمام" },
      { key: "heroSubtitle", value: "خزمەتگوزاری تەندروستی بەرز و متمانەپێکراو" },
      { key: "heroDescription", value: "ئێمە لە نەخۆشخانەی پیرمام بە پێشەنگی تەکنەلۆژیا و تیمی پزیشکی شارەزا، باشترین خزمەتگوزاری تەندروستی پێشکەش بۆ خەڵکی کوردستان دەکەین. تەندروستی خەڵک ئەولویەتی ئێمەیە." },
      { key: "heroBadge", value: "خزمەتگوزاری تەندروستی لە کوردستان" },
      { key: "stat1Value", value: "٢٠٠+" },
      { key: "stat1Label", value: "پزیشکی شارەزا" },
      { key: "stat2Value", value: "٥٠٠٠٠+" },
      { key: "stat2Label", value: "نەخۆشی سەردەم" },
      { key: "stat3Value", value: "٢٤/٧" },
      { key: "stat3Label", value: "خزمەتگوزاری" },
      { key: "stat4Value", value: "١٥+" },
      { key: "stat4Label", value: "ساڵ ئەزموون" },
      { key: "hospitalNameKu", value: "نەخۆشخانەی پیرمام" },
      { key: "hospitalNameEn", value: "Pirmam Hospital" },
      { key: "phone1", value: "+٩٦٤ ٧٥٠ ١٢٣ ٤٥٦٧" },
      { key: "phone2", value: "+٩٦٤ ٧٧٠ ٩٨٧ ٦٥٤٣" },
      { key: "email", value: "info@pirmam-hospital.com" },
      { key: "addressKu", value: "شارەزانی پیرمام، هەولێر، هەرێمی کوردستان، عێراق" },
      { key: "workingHours", value: "٢٤ کاتژمێر - ٧ ڕۆژ لە هەفتە" },
      { key: "facebookUrl", value: "#" },
      { key: "instagramUrl", value: "#" },
      { key: "twitterUrl", value: "#" },
      { key: "youtubeUrl", value: "#" },
      { key: "footerDescription", value: "نەخۆشخانەی پیرمام بە پێشەنگی تەکنەلۆژیا و تیمی پزیشکی شارەزا، باشترین خزمەتگوزاری تەندروستی پێشکەش دەکات." },
      { key: "deptSectionTitle", value: "بەشەکانی نەخۆشخانە" },
      { key: "deptSectionDesc", value: "نەخۆشخانەی پیرمام بەشەکی تایبەت و شارەزای هەیە بۆ چارەسەری هەموو جۆرە نەخۆشیەک" },
      { key: "gallerySectionTitle", value: "گەلەری وێنە" },
      { key: "gallerySectionDesc", value: "وێنەیەکانی نەخۆشخانەی پیرمام - بینینی نزیک لە فەزا و کەرەستەکانی نەخۆشخانە" },
      { key: "archiveSectionTitle", value: "ئەرشیف" },
      { key: "archiveSectionDesc", value: "بەرنامە، تۆمارەکان و بۆنیانەکانی نەخۆشخانەی پیرمام" },
      { key: "adminPassword", value: "pirmam2025" },
    ];

    for (const s of settings) {
      await db.siteSetting.create({ data: s });
    }

    /* Departments */
    const departments = [
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

    for (const d of departments) {
      await db.department.create({ data: d });
    }

    /* Gallery items */
    const galleryItems = [
      { title: "دەرەوەی نەخۆشخانە", description: "دەرەوەی نەخۆشخانەی پیرمام", color: "from-teal-600/80 to-emerald-700/80", order: 0 },
      { title: "سەردانی نەخۆشان", description: "سەردانی نەخۆشان لە نەخۆشخانە", color: "from-emerald-600/80 to-teal-700/80", order: 1 },
      { title: "تاقیگەی پێشکەوتوو", description: "تاقیگەی پێشکەوتووی نەخۆشخانە", color: "from-cyan-600/80 to-teal-700/80", order: 2 },
      { title: "ئۆپەراسیۆنخانە", description: "ئۆپەراسیۆنخانەی نەخۆشخانەی پیرمام", color: "from-teal-700/80 to-cyan-600/80", order: 3 },
      { title: "پشکنینی مەڕگە", description: "مەکینەی پشکنینی مەڕگە", color: "from-emerald-700/80 to-teal-600/80", order: 4 },
      { title: "هۆڵی وەرگرتن", description: "هۆڵی وەرگرتنی نەخۆشخانە", color: "from-cyan-700/80 to-emerald-600/80", order: 5 },
    ];

    for (const g of galleryItems) {
      await db.galleryItem.create({ data: g });
    }

    /* Archive items */
    const archiveItems = [
      { title: "نەخۆشخانەی پیرمام خەڵاتی باشترین نەخۆشخانەی کوردستانی وەرگرت", description: "لە ئاهەنگی ساڵانەی تەندروستی کوردستان، نەخۆشخانەی پیرمام خەڵاتی باشترین نەخۆشخانەی ساڵی وەرگرت. ئەم خەڵاتە بەهۆی خزمەتگوزاری بێنظیری تەندروستی و تیمی شارەزای پزیشکی دابەنرا. ئێمە بە شانازییەوە ئەم سەرکەوتنە پێشکەشی خەڵکی کوردستان دەکەین.", date: "٢٠٢٥/٠١/١٥", category: "تۆمار", color: "from-amber-600/70 to-orange-700/70", order: 0 },
      { title: "کەمپەینی تەندروستی بەخۆڕایی بۆ هاوڵاتیان", description: "نەخۆشخانەی پیرمام کەمپەینێکی تەندروستی بەخۆڕایی بۆ هاوڵاتیان ئەنجام دا. لەم کەمپەینەدا پشکنینی تەواوی تەندروستی بە بێبەها بۆ زیاتر لە ١٠٠٠ هاوڵاتی ئەنجامدرا. ئەم چالاکییە بەشێک بوو لە ئەرکی کۆمەڵایەتی نەخۆشخانەکە بۆ کۆمەڵگا.", date: "٢٠٢٤/١٢/٠١", category: "بۆنیانە", color: "from-emerald-600/70 to-teal-700/70", order: 1 },
      { title: "سمیناری نێودەوڵەتی پزیشکی لە نەخۆشخانەی پیرمام", description: "سمینارێکی نێودەوڵەتی لە بوارەکانی پزیشکی سەرەتایی و نەشتەرگەری لە نەخۆشخانەی پیرمام بەڕێوەچوو. زیاتر لە ٥٠ پزیشکی شارەزا لە وڵاتانی جیاواز بەشداریان کرد. سمینارەکە لەلایەن مامۆستایان و پسپۆڕانی نێودەوڵەتیەوە ئەنجامدرا.", date: "٢٠٢٤/١٠/٢٠", category: "فێربوون", color: "from-cyan-600/70 to-blue-700/70", order: 2 },
      { title: "کراندنەوەی باڵەخانەی نوێی نەخۆشخانە", description: "باڵەخانەی نوێی نەخۆشخانەی پیرمام کە لەگەڵ کەرەستەی پێشکەوتووی تەندروستی ئامادەکراوە، بە فەرمی کرایەوە. ئەم باڵەخانەیە لەگەڵ ١٢٠ جێی نەخۆش و ٤ ژووری نەشتەرگەری و تاقیگەی پێشکەوتوو خزمەتگوزاری تەندروستی باشتر پێشکەش دەکات.", date: "٢٠٢٤/٠٨/٠٥", category: "تۆمار", color: "from-teal-600/70 to-emerald-700/70", order: 3 },
    ];

    for (const a of archiveItems) {
      await db.archiveItem.create({ data: a });
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
