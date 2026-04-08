import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_BUCKETS = new Set(['Services', 'Partners', 'Gallery']);

function getEnvVars() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return null;
  }

  return {
    SUPABASE_URL,
    SERVICE_ROLE_KEY,
  };
}

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
    const env = getEnvVars();
    if (!env) {
      console.error('[/api/admin/media] Missing Supabase environment variables.');
      return NextResponse.json(
        {
          error: 'Missing Supabase write environment variables.',
          details: 'Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local',
        },
        { status: 400 }
      );
    }

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
    const objectPath = `${bucket}/${safeName}`;
    const uploadUrl = `${env.SUPABASE_URL}/storage/v1/object/${objectPath}`;

    const buffer = Buffer.from(parsed.base64, 'base64');

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': parsed.contentType,
        apikey: env.SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SERVICE_ROLE_KEY}`,
        'x-upsert': 'true',
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      console.error('[/api/admin/media] Supabase upload failed:', uploadRes.status, text);
      return NextResponse.json({ error: 'Failed to upload media to Supabase', details: text }, { status: 502 });
    }

    const publicUrl = `${env.SUPABASE_URL}/storage/v1/object/public/${objectPath}`;
    console.log('[/api/admin/media] Upload succeeded:', publicUrl);
    return NextResponse.json({ success: true, url: publicUrl, bucket, path: objectPath });
  } catch (error) {
    console.error('[/api/admin/media] Exception:', error);
    return NextResponse.json({ error: 'Failed to upload media', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
