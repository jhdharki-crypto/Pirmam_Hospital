import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

/* GET /api/content - Returns all site content for the public-facing website */
export async function GET() {
  try {
    const settings = await db.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    const departments = await db.department.findMany({ orderBy: { order: "asc" } });
    const galleryItems = await db.galleryItem.findMany({ orderBy: { order: "asc" } });
    const archiveItems = await db.archiveItem.findMany({ orderBy: { order: "asc" } });

    return NextResponse.json({
      settings: settingsMap,
      departments,
      galleryItems,
      archiveItems,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
