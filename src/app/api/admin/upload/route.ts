/* =============================================
   Pirmam Hospital - Image Upload API
   Compresses and converts uploaded images to base64
   Works everywhere - no external storage needed!
   ============================================= */

import { NextRequest, NextResponse } from "next/server";

/* Maximum dimensions for compressed images */
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 900;
const MAX_FILE_SIZE = 4 * 1024 * 1024; /* 4MB input limit */

/* Allowed image types */
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 4MB." },
        { status: 400 }
      );
    }

    /* Read file buffer */
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    /* Try to compress with sharp, fallback to raw base64 */
    let outputBuffer = buffer;
    let outputType = file.type;

    try {
      const sharp = (await import("sharp")).default;

      /* Get image metadata */
      const metadata = await sharp(buffer).metadata();

      /* Resize if too large */
      let pipeline = sharp(buffer);
      if (
        metadata.width &&
        metadata.width > MAX_WIDTH ||
        metadata.height &&
        metadata.height > MAX_HEIGHT
      ) {
        pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
          fit: "inside",
          withoutEnlargement: true,
        });
      }

      /* Convert to JPEG for smaller size (unless it's SVG/GIF) */
      if (file.type !== "image/svg+xml" && file.type !== "image/gif") {
        pipeline = pipeline.jpeg({ quality: 80 });
        outputType = "image/jpeg";
      }

      outputBuffer = await pipeline.toBuffer();
    } catch {
      /* Sharp not available or failed — use raw buffer */
      console.log("Sharp not available, using raw base64");
    }

    /* Convert to base64 data URL */
    const base64 = outputBuffer.toString("base64");
    const dataUrl = `data:${outputType};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      name: file.name,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to upload file: " + errorMessage },
      { status: 500 }
    );
  }
}
