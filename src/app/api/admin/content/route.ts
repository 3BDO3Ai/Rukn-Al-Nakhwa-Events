import { NextRequest, NextResponse } from 'next/server';
import fallbackContent from '@/content/content.json';

function getReadEnvVars() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !ANON_KEY) {
    return null;
  }

  return {
    ANON_KEY,
    PUBLIC_URL: `${SUPABASE_URL}/storage/v1/object/public/Content/content.json`,
  };
}

function getWriteEnvVars() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return null;
  }

  return {
    SERVICE_ROLE_KEY,
    STORAGE_API_URL: `${SUPABASE_URL}/storage/v1/object/Content/content.json`
  };
}

export async function GET() {
  try {
    const env = getReadEnvVars();
    if (!env) {
      return NextResponse.json(fallbackContent);
    }

    const { PUBLIC_URL, ANON_KEY } = env;
    const res = await fetch(PUBLIC_URL, { headers: { apikey: ANON_KEY } });
    if (!res.ok) {
      console.error('Failed fetching remote content:', res.statusText);
      return NextResponse.json(fallbackContent);
    }
    const content = await res.json();
    return NextResponse.json(content);
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

    const { STORAGE_API_URL, SERVICE_ROLE_KEY } = env;
    const newContent = await request.json();
    if (!newContent || typeof newContent !== 'object') {
      return NextResponse.json({ error: 'Invalid content format' }, { status: 400 });
    }

    // Write to Supabase storage using service role key
    const upsertRes = await fetch(STORAGE_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify(newContent),
    });

    if (!upsertRes.ok) {
      const text = await upsertRes.text();
      console.error('Failed to write content to Supabase:', upsertRes.status, text);
      return NextResponse.json({ error: 'Failed to update remote content' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating remote content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}