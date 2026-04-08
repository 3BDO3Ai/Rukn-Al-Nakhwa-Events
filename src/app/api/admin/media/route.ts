import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getPublicDir } from '@/lib/serverPaths';

const ALLOWED_BUCKETS = new Set(['Services', 'Partners', 'Gallery']);

function getFileExtension(contentType: string, fileName: string): string {
  const known = contentType.split('/')[1]?.split(';')[0]?.trim();
  if (known) {
    return known;
  }

  const nameParts = fileName.split('.');
  const ext = nameParts[nameParts.length - 1];
  return ext || 'bin';
}

function toBase64Payload(dataUrl: string): { contentType: string; base64: string } | null {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    return null;
  }

  return {
    contentType: match[1],
    base64: match[2],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bucket = body?.bucket;
    const fileName = body?.fileName;
    const dataUrl = body?.dataUrl;

    console.log('[/api/admin/media] Received:', { bucket, fileName: fileName ? `${fileName.slice(0, 20)}...` : null, dataUrlLength: dataUrl?.length });

    if (!bucket || !ALLOWED_BUCKETS.has(bucket)) {
      console.error('[/api/admin/media] Invalid bucket:', bucket, 'Allowed:', Array.from(ALLOWED_BUCKETS));
      return NextResponse.json({ error: `Bucket must be one of: ${Array.from(ALLOWED_BUCKETS).join(', ')}. Received: ${bucket}` }, { status: 400 });
    }

    if (!fileName || typeof fileName !== 'string') {
      console.error('[/api/admin/media] Invalid fileName:', fileName);
      return NextResponse.json({ error: 'fileName is required and must be a string' }, { status: 400 });
    }

    if (!dataUrl || typeof dataUrl !== 'string') {
      console.error('[/api/admin/media] Invalid dataUrl');
      return NextResponse.json({ error: 'dataUrl is required and must be a string' }, { status: 400 });
    }

    const parsed = toBase64Payload(dataUrl);
    if (!parsed) {
      console.error('[/api/admin/media] Failed to parse dataUrl (expected "data:mime;base64,...")');
      return NextResponse.json({ error: 'Invalid dataUrl format (expected "data:mime;base64,...")' }, { status: 400 });
    }

    console.log('[/api/admin/media] Upload starting for:', bucket, fileName);
    const extension = getFileExtension(parsed.contentType, fileName);
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
    const bucketDir = getPublicDir(bucket);
    await fs.mkdir(bucketDir, { recursive: true });
    const absoluteFilePath = path.join(bucketDir, safeName);
    const buffer = Buffer.from(parsed.base64, 'base64');
    await fs.writeFile(absoluteFilePath, buffer);

    const objectPath = `${bucket}/${safeName}`;
    const publicUrl = `/${objectPath}`;
    console.log('[/api/admin/media] Upload succeeded:', publicUrl);
    return NextResponse.json({ success: true, url: publicUrl, bucket, path: objectPath });
  } catch (error) {
    console.error('[/api/admin/media] Exception:', error);
    return NextResponse.json({ error: 'Failed to upload media', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
