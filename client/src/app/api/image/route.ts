import { NextResponse } from 'next/server';

function isValidId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || '';
    const w = searchParams.get('w') || '1920';
    const h = searchParams.get('h') || '1080';
    const variant = searchParams.get('variant') || 'thumb'; // 'thumb' | 'view'

    if (!id || !isValidId(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    let targetUrl: string;
    if (variant === 'view') {
      targetUrl = `https://drive.google.com/uc?export=view&id=${id}`;
    } else {
      targetUrl = `https://drive.google.com/thumbnail?id=${id}&sz=w${w}-h${h}`;
    }

    const upstream = await fetch(targetUrl, {
      // Ensure we pass through headers suitable for public assets
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Upstream fetch failed' }, { status: upstream.status });
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const buffer = await upstream.arrayBuffer();
    const res = new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}