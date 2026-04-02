import { NextRequest, NextResponse } from 'next/server';
import fallbackContent from '@/content/content.json';

const DEFAULT_BUCKET_CANDIDATES = ['Content', 'content'];

function getBucketCandidates(): string[] {
  const explicit = process.env.SUPABASE_CONTENT_BUCKET?.trim();
  if (explicit) {
    return [explicit, ...DEFAULT_BUCKET_CANDIDATES.filter((bucket) => bucket !== explicit)];
  }
  return DEFAULT_BUCKET_CANDIDATES;
}

function getReadEnvVars() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !ANON_KEY) {
    return null;
  }

  return {
    ANON_KEY,
    SUPABASE_URL,
  };
}

function getWriteEnvVars() {
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

export async function GET() {
  try {
    const env = getReadEnvVars();
    if (!env) {
      return NextResponse.json(fallbackContent);
    }

    const { SUPABASE_URL, ANON_KEY } = env;
    const bucketCandidates = getBucketCandidates();

    for (const bucket of bucketCandidates) {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/content.json`;
      const res = await fetch(`${publicUrl}?t=${Date.now()}`, {
        headers: { apikey: ANON_KEY },
        cache: 'no-store',
      });

      if (res.ok) {
        const content = await res.json();
        return NextResponse.json(content);
      }
    }

    console.error('Failed fetching remote content from all bucket candidates.');
    return NextResponse.json(fallbackContent);
  } catch (error) {
    console.error('Error fetching content from Supabase, using fallback:', error);
    return NextResponse.json(fallbackContent);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const env = getWriteEnvVars();
    if (!env) {
      return NextResponse.json({ error: 'Missing Supabase write environment variables.' }, { status: 400 });
    }

    const { SUPABASE_URL, SERVICE_ROLE_KEY } = env;
    const newContent = await request.json();
    if (!newContent || typeof newContent !== 'object') {
      return NextResponse.json({ error: 'Invalid content format' }, { status: 400 });
    }

    const bucketCandidates = getBucketCandidates();

    let upsertRes: Response | null = null;
    let lastErrorText = '';

    for (const bucket of bucketCandidates) {
      const storageApiUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/content.json`;
      upsertRes = await fetch(storageApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          'x-upsert': 'true',
        },
        body: JSON.stringify(newContent),
      });

      if (upsertRes.ok) {
        return NextResponse.json({ success: true, bucket });
      }

      lastErrorText = await upsertRes.text();
      const isBucketNotFound = upsertRes.status === 400 && lastErrorText.includes('Bucket not found');
      if (!isBucketNotFound) {
        break;
      }
    }

    if (!upsertRes || !upsertRes.ok) {
      console.error('Failed to write content to Supabase:', upsertRes?.status, lastErrorText);
      return NextResponse.json(
        {
          error: 'Failed to update remote content',
          details: lastErrorText || 'No successful write response from Supabase',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating remote content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}