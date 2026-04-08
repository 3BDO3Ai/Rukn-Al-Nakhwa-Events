import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getPublicDir } from "@/lib/serverPaths";

export const runtime = "nodejs";

const MIME_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".m4v": "video/x-m4v",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
};

type RouteContext = {
  params: Promise<{ slug: string; fileName: string }>;
};

function isUnsafeSegment(segment: string): boolean {
  return !segment || segment.includes("/") || segment.includes("\\") || segment.includes("..");
}

async function resolveCaseInsensitivePath(slug: string, fileName: string): Promise<string | null> {
  const blogsDir = getPublicDir("Blogs");

  let resolvedSlug = slug;
  const slugDir = getPublicDir("Blogs", slug);

  try {
    await fs.access(slugDir);
  } catch {
    const slugEntries = await fs.readdir(blogsDir, { withFileTypes: true }).catch(() => []);
    const matchedSlug = slugEntries.find(
      (entry) => entry.isDirectory() && entry.name.toLowerCase() === slug.toLowerCase(),
    );

    if (!matchedSlug) {
      return null;
    }

    resolvedSlug = matchedSlug.name;
  }

  const resolvedSlugDir = getPublicDir("Blogs", resolvedSlug);
  let resolvedFileName = fileName;

  try {
    await fs.access(path.join(resolvedSlugDir, fileName));
  } catch {
    const fileEntries = await fs.readdir(resolvedSlugDir, { withFileTypes: true }).catch(() => []);
    const matchedFile = fileEntries.find(
      (entry) => entry.isFile() && entry.name.toLowerCase() === fileName.toLowerCase(),
    );

    if (!matchedFile) {
      return null;
    }

    resolvedFileName = matchedFile.name;
  }

  return path.join(resolvedSlugDir, resolvedFileName);
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;
  const slug = decodeURIComponent(params.slug || "").trim();
  const fileName = decodeURIComponent(params.fileName || "").trim();

  if (isUnsafeSegment(slug) || isUnsafeSegment(fileName)) {
    return NextResponse.json({ error: "Invalid media path" }, { status: 400 });
  }

  const filePath = await resolveCaseInsensitivePath(slug, fileName);
  if (!filePath) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const content = await fs.readFile(filePath);
    const extension = path.extname(fileName).toLowerCase();
    const contentType = MIME_TYPES[extension] ?? "application/octet-stream";

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
