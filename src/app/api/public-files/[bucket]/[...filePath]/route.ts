import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getPublicDir } from "@/lib/serverPaths";

export const runtime = "nodejs";

const ALLOWED_BUCKETS = new Set(["Blogs", "Gallery", "Partners", "Services"]);

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
  params: Promise<{ bucket: string; filePath: string[] }>;
};

function isUnsafeSegment(segment: string): boolean {
  return !segment || segment.includes("/") || segment.includes("\\") || segment.includes("..");
}

async function resolveCaseInsensitivePath(bucket: string, relativeSegments: string[]): Promise<string | null> {
  if (relativeSegments.length === 0) {
    return null;
  }

  const allSegments = [bucket, ...relativeSegments];

  let currentPath = getPublicDir();
  for (let index = 0; index < allSegments.length; index += 1) {
    const targetSegment = allSegments[index];
    const candidatePath = path.join(currentPath, targetSegment);

    try {
      await fs.access(candidatePath);
      currentPath = candidatePath;
      continue;
    } catch {
      const entries = await fs.readdir(currentPath, { withFileTypes: true }).catch(() => []);
      const matched = entries.find((entry) => entry.name.toLowerCase() === targetSegment.toLowerCase());
      if (!matched) {
        return null;
      }

      currentPath = path.join(currentPath, matched.name);
    }
  }

  return currentPath;
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;
  const bucket = decodeURIComponent(params.bucket || "").trim();
  const normalizedBucket = `${bucket[0]?.toUpperCase() || ""}${bucket.slice(1).toLowerCase()}`;

  if (!ALLOWED_BUCKETS.has(normalizedBucket)) {
    return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
  }

  const segments = (params.filePath || []).map((segment) => decodeURIComponent(segment).trim());
  if (segments.some(isUnsafeSegment)) {
    return NextResponse.json({ error: "Invalid media path" }, { status: 400 });
  }

  const absolutePath = await resolveCaseInsensitivePath(normalizedBucket, segments);
  if (!absolutePath) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const content = await fs.readFile(absolutePath);
    const extension = path.extname(segments[segments.length - 1]).toLowerCase();
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
