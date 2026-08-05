import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/* GET /api/admin/departments - List all departments */
export async function GET() {
  try {
    const departments = await db.department.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

/* POST /api/admin/departments - Create a new department */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const department = await db.department.create({
      data: {
        name: body.name,
        description: body.description,
        iconName: body.iconName || "HeartPulse",
        image: body.image || null,
        order: body.order ?? 0,
      },
    });
    return NextResponse.json(department);
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 });
  }
}

/* PUT /api/admin/departments - Update a department */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const department = await db.department.update({
      where: { id },
      data,
    });
    return NextResponse.json(department);
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json({ error: "Failed to update department" }, { status: 500 });
  }
}

/* DELETE /api/admin/departments - Delete a department */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.department.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json({ error: "Failed to delete department" }, { status: 500 });
  }
}
