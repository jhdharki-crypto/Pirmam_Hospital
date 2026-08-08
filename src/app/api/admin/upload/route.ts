/* =============================================
   Pirmam Hospital - Image Upload API
   Handles file uploads for gallery, departments, archive
   Production: uses Vercel Blob (cloud storage)
   Development: uses local filesystem (public/uploads/)
   ============================================= */

import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json({ error: "Invalid file type: " + file.type + ". Only images are allowed." }, { status: 400 });
    }

    /* Validate file size (max 10MB) */
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    /* Read file buffer */
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    /* Generate unique filename */
    const ext = file.name.split('.').pop() || "png";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    /* Check if Vercel Blob is available (production) */
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (blobToken) {
      /* === PRODUCTION: Use Vercel Blob (cloud storage) === */
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${folder}/${uniqueName}`, buffer, {
        access: "public",
        contentType: file.type,
      });

      return NextResponse.json({
        url: blob.url,
        name: uniqueName,
      });
    } else {
      /* === DEVELOPMENT: Use local filesystem === */
      const { writeFile, mkdir } = await import("fs/promises");
      const pathModule = await import("path");
      const uploadDir = pathModule.join(process.cwd(), "public", "uploads", folder);
      await mkdir(uploadDir, { recursive: true });
      const filePath = pathModule.join(uploadDir, uniqueName);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        url: `/uploads/${folder}/${uniqueName}`,
        name: uniqueName,
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Upload failed: " + errorMessage }, { status: 500 });
  }
}
