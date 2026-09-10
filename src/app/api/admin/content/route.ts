import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  prepareSettingsWrite,
  requireAdmin,
  stripSensitiveSettings,
} from "@/lib/admin-auth";

/* GET /api/admin/content - Get site settings (sensitive keys excluded) */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const settings = await db.siteSetting.findMany();
    return NextResponse.json(stripSensitiveSettings(settings));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

/* PUT /api/admin/content - Update site settings (key-value pairs).
   A new adminPassword is accepted and stored as a salted hash;
   adminSecret can never be written through this route. */
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const settings = await prepareSettingsWrite(body.settings ?? {});

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
