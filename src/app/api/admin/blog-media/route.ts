import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB

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
    if (explicit === "jpeg") return "jpg";
    return explicit;
  }
  const ext = path.extname(fileName).replace(".", "").trim().toLowerCase();
  return ext || "jpg";
}

export async function POST(request: NextRequest) {
  try {
    // 1. استقبال البيانات كـ FormData بدلاً من JSON
    const formData = await request.formData();
    
    const blogName = formData.get("blogName")?.toString() || "";
    const variant = formData.get("variant")?.toString() === "cover" ? "cover" : "gallery";
    const file = formData.get("file") as File | null;

    if (!blogName.trim()) {
      return NextResponse.json({ error: "blogName is required" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported for blog media" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Image exceeds 15MB limit" }, { status: 400 });
    }

    // 2. تحويل الملف الحقيقي إلى Buffer مباشرة (بدون Base64)
    const buffer = Buffer.from(await file.arrayBuffer());

    const blogSlug = toSafeSlug(blogName) || `blog-${Date.now()}`;
    const extension = extensionFromMime(file.type, file.name);
    const baseFileName = sanitizeBaseFileName(file.name);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const finalFileName = `${variant}-${baseFileName}-${uniqueSuffix}.${extension}`;

    // تأكد من أن حرف B كابيتال يتطابق مع الفولدر في السيرفر
    const blogDirectory = path.join(process.cwd(), "public", "Blogs", blogSlug);
    await fs.mkdir(blogDirectory, { recursive: true });

    const fullFilePath = path.join(blogDirectory, finalFileName);
    await fs.writeFile(fullFilePath, buffer);

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