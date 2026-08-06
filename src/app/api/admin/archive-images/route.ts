import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/* GET /api/admin/archive-images?archiveItemId=xxx - Get all images for an archive item */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const archiveItemId = searchParams.get("archiveItemId");
    if (!archiveItemId) {
      return NextResponse.json({ error: "archiveItemId required" }, { status: 400 });
    }
    const images = await db.archiveImage.findMany({
      where: { archiveItemId },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching archive images:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

/* POST /api/admin/archive-images - Add an image to an archive item */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { archiveItemId, url, order } = body;
    if (!archiveItemId || !url) {
      return NextResponse.json({ error: "archiveItemId and url required" }, { status: 400 });
    }
    const image = await db.archiveImage.create({
      data: { archiveItemId, url, order: order ?? 0 },
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error("Error creating archive image:", error);
    return NextResponse.json({ error: "Failed to add image" }, { status: 500 });
  }
}

/* DELETE /api/admin/archive-images?id=xxx - Delete a single archive image */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    await db.archiveImage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting archive image:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
