/* =============================================
   Pirmam Hospital - Image Upload API
   Handles file uploads for gallery, departments, archive
   ============================================= */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "gallery";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    /* Validate file type */
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    /* Validate file size (max 10MB) */
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    /* Read file buffer */
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    /* Generate unique filename to avoid collisions */
    const ext = path.extname(file.name) || ".png";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    /* Ensure upload directory exists */
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    /* Write file to disk */
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    /* Return the public URL path */
    return NextResponse.json({
      url: `/uploads/${folder}/${uniqueName}`,
      name: uniqueName,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
