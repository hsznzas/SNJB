import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session-helper';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limiter';
import { logBrowse } from '@/lib/audit-logger';
import { getDirectoryContents } from '@/lib/github-fetcher';

/**
 * GET /api/code-explorer/browse?path=<directory-path>
 * List files and folders in a directory
 */
export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);

  // Verify authentication
  const session = await verifySession(request);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized - Please authenticate first' },
      { status: 401 },
    );
  }

  // Rate limiting
  const rateLimit = checkRateLimit(
    `${clientIp}:${session.sessionId}`,
    RATE_LIMITS.BROWSE,
  );
  if (!rateLimit.allowed) {
    await logBrowse(session.sessionId, clientIp, 'rate-limited', false, 'Rate limit exceeded');
    return NextResponse.json(
      {
        error: 'Too many requests. Please slow down.',
        retryAfter: rateLimit.retryAfter,
      },
      { status: 429 },
    );
  }

  try {
    // Get path from query parameters
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path') || '';

    // Fetch directory contents from GitHub
    const items = await getDirectoryContents(path);

    await logBrowse(session.sessionId, clientIp, path, true);

    return NextResponse.json({
      success: true,
      path,
      items,
    });
  } catch (error: unknown) {
    const path = request.nextUrl.searchParams.get('path') || '';
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logBrowse(session.sessionId, clientIp, path, false, errorMessage);

    console.error('Browse error:', error);
    return NextResponse.json(
      { error: errorMessage || 'Failed to browse directory' },
      { status: 500 },
    );
  }
}
