import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

function parseDataUrl(dataUrl: string): { mimeType: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    return null;
  }

  const mimeType = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, "base64");

  return { mimeType, buffer };
}

function toSafeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function sanitizeBaseFileName(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^.]+$/, "");

  const next = withoutExt
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-_]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return next || "image";
}

function extensionFromMime(mimeType: string, fileName: string): string {
  const explicit = mimeType.split("/")[1]?.split(";")[0]?.trim().toLowerCase();
  if (explicit) {
    if (explicit === "jpeg") {
      return "jpg";
    }
    return explicit;
  }

  const ext = path.extname(fileName).replace(".", "").trim().toLowerCase();
  return ext || "jpg";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const blogName = typeof body?.blogName === "string" ? body.blogName : "";
    const fileName = typeof body?.fileName === "string" ? body.fileName : "image.jpg";
    const dataUrl = typeof body?.dataUrl === "string" ? body.dataUrl : "";
    const variant = body?.variant === "cover" ? "cover" : "gallery";

    if (!blogName.trim()) {
      return NextResponse.json({ error: "blogName is required" }, { status: 400 });
    }

    if (!dataUrl) {
      return NextResponse.json({ error: "dataUrl is required" }, { status: 400 });
    }

    const parsed = parseDataUrl(dataUrl);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid dataUrl format" }, { status: 400 });
    }

    if (!parsed.mimeType.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported for blog media" }, { status: 400 });
    }

    if (parsed.buffer.byteLength > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Image exceeds 15MB limit" }, { status: 400 });
    }

    const blogSlug = toSafeSlug(blogName) || `blog-${Date.now()}`;
    const extension = extensionFromMime(parsed.mimeType, fileName);
    const baseFileName = sanitizeBaseFileName(fileName);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const finalFileName = `${variant}-${baseFileName}-${uniqueSuffix}.${extension}`;

    const blogDirectory = path.join(process.cwd(), "public", "Blogs", blogSlug);
    await fs.mkdir(blogDirectory, { recursive: true });

    const fullFilePath = path.join(blogDirectory, finalFileName);
    await fs.writeFile(fullFilePath, parsed.buffer);

    const publicUrl = `/Blogs/${encodeURIComponent(blogSlug)}/${encodeURIComponent(finalFileName)}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      folder: `/Blogs/${encodeURIComponent(blogSlug)}`,
      fileName: finalFileName,
    });
  } catch (error) {
    console.error("Blog media upload failed:", error);
    return NextResponse.json({ error: "Failed to upload blog image" }, { status: 500 });
  }
}
