import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import fallbackContent from '@/content/content.json';
import { getSrcDir } from '@/lib/serverPaths';
import { logAdminAction } from '@/lib/logger';

export const runtime = 'nodejs';

const DEFAULT_BUCKET_CANDIDATES = ['Content', 'content'];
const LOCAL_CONTENT_PATH = getSrcDir('content', 'content.json');

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readLocalContent() {
  try {
    const raw = await fs.readFile(LOCAL_CONTENT_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (isObject(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.error('Failed to read local content.json, using bundled fallback:', error);
  }

  return fallbackContent;
}

async function writeLocalContent(content: Record<string, unknown>) {
  const serialized = `${JSON.stringify(content, null, 2)}\n`;
  await fs.writeFile(LOCAL_CONTENT_PATH, serialized, 'utf8');
}

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
      const localContent = await readLocalContent();
      return NextResponse.json(localContent);
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

    console.error('Failed fetching remote content from all bucket candidates, reading local content.json instead.');
    const localContent = await readLocalContent();
    return NextResponse.json(localContent);
  } catch (error) {
    console.error('Error fetching content from Supabase, reading local content.json instead:', error);
    const localContent = await readLocalContent();
    return NextResponse.json(localContent);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const newContent = await request.json();
    if (!isObject(newContent)) {
      return NextResponse.json({ error: 'Invalid content format' }, { status: 400 });
    }

    const env = getWriteEnvVars();
    if (!env) {
      await writeLocalContent(newContent);
      await logAdminAction('CONTENT_UPDATE', `Local content.json successfully updated. AR keys: ${Object.keys((newContent as any).ar || {}).length}, EN keys: ${Object.keys((newContent as any).en || {}).length}`);
      return NextResponse.json({ success: true, storage: 'local' });
    }

    const { SUPABASE_URL, SERVICE_ROLE_KEY } = env;

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
        try {
          await writeLocalContent(newContent);
        } catch (syncError) {
          console.error('Saved to Supabase but failed to sync local content.json:', syncError);
        }
        await logAdminAction('CONTENT_UPDATE', `Remote and local content.json successfully updated. Bucket: ${bucket}`);
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