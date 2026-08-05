import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/* GET /api/admin/gallery - List all gallery items */
export async function GET() {
  try {
    const items = await db.galleryItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 });
  }
}

/* POST /api/admin/gallery - Create a new gallery item */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await db.galleryItem.create({
      data: {
        title: body.title,
        description: body.description || "",
        image: body.image || null,
        color: body.color || "from-teal-600/80 to-emerald-700/80",
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 });
  }
}

/* PUT /api/admin/gallery - Update a gallery item */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const item = await db.galleryItem.update({ where: { id }, data });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}

/* DELETE /api/admin/gallery - Delete a gallery item */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
