import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/* GET /api/admin/content - Get all site settings */
export async function GET() {
  try {
    const settings = await db.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

/* PUT /api/admin/content - Update site settings (key-value pairs) */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const settings: Record<string, string> = body.settings;

    for (const [key, value] of Object.entries(settings)) {
      await db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
