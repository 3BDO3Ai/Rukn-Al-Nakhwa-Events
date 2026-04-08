import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getPublicDir } from "@/lib/serverPaths";

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
