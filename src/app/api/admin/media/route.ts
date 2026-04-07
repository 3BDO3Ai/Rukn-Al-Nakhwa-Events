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

    if (!bucket || !ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json({ error: 'Bucket must be one of: Services, Partners, Gallery' }, { status: 400 });
    }

    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
    }

    if (!dataUrl || typeof dataUrl !== 'string') {
      return NextResponse.json({ error: 'dataUrl is required' }, { status: 400 });
    }

    const parsed = toBase64Payload(dataUrl);
    if (!parsed) {
      return NextResponse.json({ error: 'Invalid dataUrl format' }, { status: 400 });
    }

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
      console.error('Failed to upload media to Supabase:', uploadRes.status, text);
      return NextResponse.json({ error: 'Failed to upload media' }, { status: 502 });
    }

    const publicUrl = `${env.SUPABASE_URL}/storage/v1/object/public/${objectPath}`;
    return NextResponse.json({ success: true, url: publicUrl, bucket, path: objectPath });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}
