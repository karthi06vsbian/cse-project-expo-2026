// In-memory sliding window rate limiter
// Suitable for single-instance Node runtime / serverless with grace, easily pluggable into Upstash/Redis

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const cache = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  intervalMs: number; // Window size in milliseconds
  maxRequests: number; // Max requests allowed per window
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { intervalMs: 60 * 1000, maxRequests: 10 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = cache.get(identifier);

  // Clean up expired keys periodically using standard forEach
  if (cache.size > 10000) {
    cache.forEach((val, key) => {
      if (val.resetTime < now) cache.delete(key);
    });
  }

  if (!record || record.resetTime < now) {
    cache.set(identifier, {
      count: 1,
      resetTime: now + options.intervalMs,
    });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.intervalMs,
    };
  }

  if (record.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: options.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}
