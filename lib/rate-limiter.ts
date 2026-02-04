/**
 * Rate Limiter - Sliding Window Implementation
 * Tracks requests per IP/session to prevent abuse
 */

interface RateLimitEntry {
  requests: number[];
  blocked: boolean;
  blockUntil?: number;
}

// In-memory storage for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove expired blocks
    if (entry.blocked && entry.blockUntil && now > entry.blockUntil) {
      rateLimitStore.delete(key);
    }
    // Remove entries with no recent requests
    entry.requests = entry.requests.filter((timestamp) => now - timestamp < 60000);
    if (entry.requests.length === 0 && !entry.blocked) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  blockDurationMs?: number; // How long to block after exceeding limit
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, session ID, etc.)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const { windowMs, maxRequests, blockDurationMs = 60000 } = config;

  // Get or create entry
  let entry = rateLimitStore.get(identifier);
  if (!entry) {
    entry = { requests: [], blocked: false };
    rateLimitStore.set(identifier, entry);
  }

  // Check if currently blocked
  if (entry.blocked && entry.blockUntil) {
    if (now < entry.blockUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.blockUntil,
        retryAfter: Math.ceil((entry.blockUntil - now) / 1000),
      };
    } else {
      // Block expired, reset
      entry.blocked = false;
      entry.blockUntil = undefined;
      entry.requests = [];
    }
  }

  // Filter out requests outside the current window
  entry.requests = entry.requests.filter(
    (timestamp) => now - timestamp < windowMs,
  );

  // Check if limit exceeded
  if (entry.requests.length >= maxRequests) {
    // Block the identifier
    entry.blocked = true;
    entry.blockUntil = now + blockDurationMs;

    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockUntil,
      retryAfter: Math.ceil(blockDurationMs / 1000),
    };
  }

  // Add current request
  entry.requests.push(now);

  // Calculate when the oldest request will expire
  const oldestRequest = entry.requests[0];
  const resetAt = oldestRequest + windowMs;

  return {
    allowed: true,
    remaining: maxRequests - entry.requests.length,
    resetAt,
  };
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Authentication attempts: 5 per 15 minutes
  AUTH: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes
  },
  // Browse directory: 100 per minute
  BROWSE: {
    windowMs: 60 * 1000,
    maxRequests: 100,
    blockDurationMs: 5 * 60 * 1000, // Block for 5 minutes
  },
  // View file: 50 per minute
  VIEW: {
    windowMs: 60 * 1000,
    maxRequests: 50,
    blockDurationMs: 5 * 60 * 1000,
  },
  // Search: 10 per minute
  SEARCH: {
    windowMs: 60 * 1000,
    maxRequests: 10,
    blockDurationMs: 10 * 60 * 1000, // Block for 10 minutes
  },
};

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  // Check for forwarded IP (common in production behind proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  // Check for real IP
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a default
  return 'unknown';
}
