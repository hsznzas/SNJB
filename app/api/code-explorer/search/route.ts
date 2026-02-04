import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session-helper';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limiter';
import { logSearch } from '@/lib/audit-logger';
import { searchRepository } from '@/lib/github-fetcher';

/**
 * GET /api/code-explorer/search?q=<search-query>
 * Search files in the repository
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
    RATE_LIMITS.SEARCH,
  );
  if (!rateLimit.allowed) {
    await logSearch(session.sessionId, clientIp, 'rate-limited', false, 'Rate limit exceeded');
    return NextResponse.json(
      {
        error: 'Too many search requests. Please wait before searching again.',
        retryAfter: rateLimit.retryAfter,
      },
      { status: 429 },
    );
  }

  try {
    // Get query from search parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 },
      );
    }

    // Search repository
    const results = await searchRepository(query);

    await logSearch(session.sessionId, clientIp, query, true);

    return NextResponse.json({
      success: true,
      query,
      results,
      count: results.length,
    });
  } catch (error: unknown) {
    const query = request.nextUrl.searchParams.get('q') || '';
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await logSearch(session.sessionId, clientIp, query, false, errorMessage);

    console.error('Search error:', error);
    return NextResponse.json(
      { error: errorMessage || 'Search failed' },
      { status: 500 },
    );
  }
}
