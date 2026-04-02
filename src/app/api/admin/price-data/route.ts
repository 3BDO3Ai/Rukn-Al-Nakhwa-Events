import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_BUCKET_CANDIDATES = ['Content', 'content'];

function getBucketCandidates(): string[] {
  const explicit = process.env.SUPABASE_CONTENT_BUCKET?.trim();
  if (explicit) {
    return [explicit, ...DEFAULT_BUCKET_CANDIDATES.filter((bucket) => bucket !== explicit)];
  }
  return DEFAULT_BUCKET_CANDIDATES;
}

// Helper to get environment variables with validation
function getEnvVars() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error('Missing required Supabase environment variables. Please check your .env.local file.');
  }

  return {
    SUPABASE_URL,
    SERVICE_ROLE_KEY,
  };
}

export async function PUT(request: NextRequest) {
  try {
    const { SUPABASE_URL, SERVICE_ROLE_KEY } = getEnvVars();
    const { priceData } = await request.json();

    if (!Array.isArray(priceData)) {
      return NextResponse.json({ error: 'Price data must be an array' }, { status: 400 });
    }

    for (const item of priceData) {
      if (!item.productValue || !item.transferAmount || !item.firstPayment) {
        return NextResponse.json({ error: 'Each price item must have productValue, transferAmount, and firstPayment' }, { status: 400 });
      }
    }

    // Fetch current remote content
    const bucketCandidates = getBucketCandidates();

    let content: any = null;
    let resolvedBucket: string | null = null;

    for (const bucket of bucketCandidates) {
      const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/content.json`;
      const res = await fetch(`${publicUrl}?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        content = await res.json();
        resolvedBucket = bucket;
        break;
      }
    }

    if (!content || !resolvedBucket) {
      console.error('Failed to fetch remote content for price update from all bucket candidates.');
      return NextResponse.json({ error: 'Failed to fetch remote content' }, { status: 502 });
    }

    // Update priceData
    content.priceData = priceData;

    // Write updated content back to Supabase storage
    const storageApiUrl = `${SUPABASE_URL}/storage/v1/object/${resolvedBucket}/content.json`;
    const upsertRes = await fetch(storageApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'x-upsert': 'true',
      },
      body: JSON.stringify(content),
    });

    if (!upsertRes.ok) {
      const text = await upsertRes.text();
      console.error('Failed to write updated content to Supabase:', upsertRes.status, text);
      return NextResponse.json({ error: 'Failed to update remote content' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating price data:', error);
    return NextResponse.json({ error: 'Failed to update price data' }, { status: 500 });
  }
}