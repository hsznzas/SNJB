import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface SessionData {
  sessionId: string;
  authenticated: boolean;
  createdAt: number;
  lastActivity: number;
}

export const sessionOptions = {
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
 * Verify session authentication
 * Returns session data if authenticated, null otherwise
 */
export async function verifySession(
  request: NextRequest,
): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(
      cookieStore,
      sessionOptions,
    );

    if (!session.authenticated) {
      return null;
    }

    // Check session expiry (1 hour of inactivity)
    const now = Date.now();
    const inactivityLimit = 60 * 60 * 1000; // 1 hour
    if (now - session.lastActivity > inactivityLimit) {
      session.authenticated = false;
      await session.save();
      return null;
    }

    // Update last activity
    session.lastActivity = now;
    await session.save();

    return session as SessionData;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}
