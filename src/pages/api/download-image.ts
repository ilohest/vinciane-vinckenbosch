import type { APIRoute } from 'astro';

export const prerender = false;

const SAFE_FILENAME_RE = /[^a-z0-9._-]+/gi;

function sanitizeFilename(filename: string): string {
  const clean = filename.replace(SAFE_FILENAME_RE, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return clean || 'vinciane-vinckenbosch-image.jpg';
}

function filenameFromUrl(url: URL, requestedName?: string | null): string {
  if (requestedName) return sanitizeFilename(requestedName);
  const originalName = url.pathname.split('/').filter(Boolean).pop() ?? 'vinciane-vinckenbosch-image.jpg';
  return sanitizeFilename(originalName);
}

function isAllowedDownloadUrl(url: URL, origin: string): boolean {
  if (url.origin === origin && url.pathname.startsWith('/images/')) return true;
  if (url.hostname === 'cdn.sanity.io' && url.pathname.startsWith('/images/')) return true;
  return false;
}

export const GET: APIRoute = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const rawUrl = requestUrl.searchParams.get('url');

  if (!rawUrl) {
    return new Response('Missing image URL', { status: 400 });
  }

  let imageUrl: URL;
  try {
    imageUrl = new URL(rawUrl, requestUrl.origin);
  } catch {
    return new Response('Invalid image URL', { status: 400 });
  }

  if (!isAllowedDownloadUrl(imageUrl, requestUrl.origin)) {
    return new Response('Image URL not allowed', { status: 400 });
  }

  const originalUrl = new URL(imageUrl);
  originalUrl.search = '';

  try {
    const imageResponse = await fetch(originalUrl);
    if (!imageResponse.ok || !imageResponse.body) {
      return new Response('Image not found', { status: 404 });
    }

    const contentType = imageResponse.headers.get('content-type') ?? 'application/octet-stream';
    const contentLength = imageResponse.headers.get('content-length');
    const filename = filenameFromUrl(originalUrl, requestUrl.searchParams.get('filename'));

    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, max-age=0, must-revalidate',
    });

    if (contentLength) headers.set('Content-Length', contentLength);

    return new Response(imageResponse.body, { headers });
  } catch {
    return new Response('Download failed', { status: 502 });
  }
};
