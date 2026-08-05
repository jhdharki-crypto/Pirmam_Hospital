import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/* GET /api/admin/archive - List all archive items */
export async function GET() {
  try {
    const items = await db.archiveItem.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching archive items:", error);
    return NextResponse.json({ error: "Failed to fetch archive items" }, { status: 500 });
  }
}

/* POST /api/admin/archive - Create a new archive item */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await db.archiveItem.create({
      data: {
        title: body.title,
        description: body.description,
        date: body.date,
        category: body.category,
        image: body.image || null,
        color: body.color || "from-amber-600/70 to-orange-700/70",
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating archive item:", error);
    return NextResponse.json({ error: "Failed to create archive item" }, { status: 500 });
  }
}

/* PUT /api/admin/archive - Update an archive item */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const item = await db.archiveItem.update({ where: { id }, data });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating archive item:", error);
    return NextResponse.json({ error: "Failed to update archive item" }, { status: 500 });
  }
}

/* DELETE /api/admin/archive - Delete an archive item */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.archiveItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting archive item:", error);
    return NextResponse.json({ error: "Failed to delete archive item" }, { status: 500 });
  }
}
