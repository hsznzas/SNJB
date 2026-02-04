import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limiter';
import { logAuthAttempt } from '@/lib/audit-logger';

// Session configuration
export interface SessionData {
  sessionId: string;
  authenticated: boolean;
  createdAt: number;
  lastActivity: number;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET || 'default-secret-key-change-this',
  cookieName: 'code_explorer_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60, // 1 hour
  },
};

/**
 * POST /api/code-explorer/auth
 * Authenticate with password
 */
export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);

  // Rate limiting
  const rateLimit = checkRateLimit(clientIp, RATE_LIMITS.AUTH);
  if (!rateLimit.allowed) {
    await logAuthAttempt('rate-limited', clientIp, false);
    return NextResponse.json(
      {
        error: 'Too many authentication attempts. Please try again later.',
        retryAfter: rateLimit.retryAfter,
      },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 },
      );
    }

    // Verify password
    const correctPassword = process.env.CODE_EXPLORER_PASSWORD;
    if (password !== correctPassword) {
      await logAuthAttempt('invalid-password', clientIp, false);
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 },
      );
    }

    // Create session
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions,
    );

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    session.sessionId = sessionId;
    session.authenticated = true;
    session.createdAt = Date.now();
    session.lastActivity = Date.now();

    await session.save();

    await logAuthAttempt(sessionId, clientIp, true);

    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Authentication successful',
    });
  } catch (error: unknown) {
    console.error('Authentication error:', error);
    await logAuthAttempt('error', clientIp, false);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/code-explorer/auth
 * Check authentication status
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions,
    );

    if (!session.authenticated) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Check session expiry (1 hour of inactivity)
    const now = Date.now();
    const inactivityLimit = 60 * 60 * 1000; // 1 hour
    if (now - session.lastActivity > inactivityLimit) {
      session.authenticated = false;
      await session.save();
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Update last activity
    session.lastActivity = now;
    await session.save();

    return NextResponse.json({
      authenticated: true,
      sessionId: session.sessionId,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

/**
 * DELETE /api/code-explorer/auth
 * Logout / destroy session
 */
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions,
    );

    session.destroy();

    return NextResponse.json({ success: true, message: 'Logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 },
    );
  }
}
