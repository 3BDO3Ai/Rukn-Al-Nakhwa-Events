import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getPublicDir, getSrcDir } from "@/lib/serverPaths";

type GalleryMediaType = "image" | "video";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".bmp"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm", ".m4v", ".ogg"]);

function inferMediaType(fileName: string): GalleryMediaType | null {
  const extension = path.extname(fileName).toLowerCase();

  if (IMAGE_EXTENSIONS.has(extension)) {
    return "image";
  }

  if (VIDEO_EXTENSIONS.has(extension)) {
    return "video";
  }

  return null;
}

function toDisplayTitle(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, "").trim();
}

function toPublicSrc(fileName: string): string {
  return `/Gallery/${encodeURIComponent(fileName)}`;
}

export async function GET() {
  try {
    const galleryDir = getPublicDir("Gallery");
    const entries = await fs.readdir(galleryDir, { withFileTypes: true });

    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const mediaType = inferMediaType(entry.name);
        if (!mediaType) {
          return null;
        }

        return {
          fileName: entry.name,
          src: toPublicSrc(entry.name),
          type: mediaType,
          title: toDisplayTitle(entry.name),
        };
      })
      .filter((entry): entry is { fileName: string; src: string; type: GalleryMediaType; title: string } => entry !== null)
      .sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { numeric: true, sensitivity: "base" }));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Failed to read public/Gallery directory:", error);
    return NextResponse.json({ error: "Failed to read Gallery directory", files: [] }, { status: 500 });
  }
}

import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { logAdminAction } from "@/lib/logger";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      console.error("[/api/admin/gallery-files DELETE] Missing fileName parameter");
      return NextResponse.json({ error: "fileName parameter is required" }, { status: 400 });
    }

    const galleryDir = getPublicDir("Gallery");
    const absoluteFilePath = path.join(galleryDir, fileName);

    console.log(`[/api/admin/gallery-files DELETE] Starting deletion process for: ${fileName}`);

    // 1. File System Deletion
    try {
      await fs.unlink(absoluteFilePath);
      console.log(`[/api/admin/gallery-files DELETE] SUCCESS: File physically deleted from FS at ${absoluteFilePath}`);
    } catch (fsError: any) {
      if (fsError.code === "ENOENT") {
        console.warn(`[/api/admin/gallery-files DELETE] WARNING: File not found on FS, skipping physical deletion for ${absoluteFilePath}`);
      } else {
        console.error(`[/api/admin/gallery-files DELETE] ERROR: Failed to delete file from FS:`, fsError);
        return NextResponse.json({ error: "Failed to physically delete the file." }, { status: 500 });
      }
    }

    // 2. Database Deletion (content.json)
    const localContentPath = getSrcDir("content", "content.json");
    let content: any = {};
    try {
      const raw = await fs.readFile(localContentPath, "utf8");
      content = JSON.parse(raw);
    } catch (e) {
      console.error("[/api/admin/gallery-files DELETE] ERROR: Failed to read local content.json:", e);
      return NextResponse.json({ error: "Failed to read database." }, { status: 500 });
    }

    let dbUpdated = false;
    const publicSrc = toPublicSrc(fileName);

    ["ar", "en"].forEach((locale) => {
      if (content[locale] && content[locale].gallery && Array.isArray(content[locale].gallery.items)) {
        const initialLength = content[locale].gallery.items.length;
        content[locale].gallery.items = content[locale].gallery.items.filter(
          (item: any) => item.src !== publicSrc && item.fileName !== fileName
        );
        if (content[locale].gallery.items.length !== initialLength) {
           dbUpdated = true;
           console.log(`[/api/admin/gallery-files DELETE] Removed record from DB (${locale} locale)`);
        }
      }
    });

    if (dbUpdated) {
      console.log(`[/api/admin/gallery-files DELETE] Saving updated database to disk...`);
      try {
        await fs.writeFile(localContentPath, JSON.stringify(content, null, 2) + "\n", "utf8");
        console.log(`[/api/admin/gallery-files DELETE] SUCCESS: DB record completely removed.`);
      } catch (e) {
        console.error(`[/api/admin/gallery-files DELETE] ERROR: Failed to save updated DB to disk:`, e);
        return NextResponse.json({ error: "Failed to write database." }, { status: 500 });
      }
    } else {
      console.log(`[/api/admin/gallery-files DELETE] INFO: No matching record found in DB to remove.`);
    }

    // 3. Next.js Cache Invalidation
    console.log(`[/api/admin/gallery-files DELETE] Invalidating cache for '/' layout...`);
    revalidatePath("/", "layout");
    console.log(`[/api/admin/gallery-files DELETE] SUCCESS: Cache invalidated.`);

    await logAdminAction('GALLERY_DELETE', `Deleted file: ${fileName}, Database updated: ${dbUpdated}`);

    return NextResponse.json({ success: true, message: "File physically deleted, DB updated, and cache invalidated" });
  } catch (error) {
    console.error("[/api/admin/gallery-files DELETE] Caught exception:", error);
    return NextResponse.json({ error: "Failed to delete file", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
