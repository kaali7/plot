/**
 * Simple client-side rate limiter for auth operations.
 * Implements exponential backoff after failed attempts.
 */
const attempts: Record<string, { count: number; lastAttempt: number }> = {};

export const checkRateLimit = (key: string, maxAttempts = 5, windowMs = 60000): { allowed: boolean; retryAfterMs: number } => {
  const now = Date.now();
  const record = attempts[key];

  if (!record || now - record.lastAttempt > windowMs) {
    attempts[key] = { count: 1, lastAttempt: now };
    return { allowed: true, retryAfterMs: 0 };
  }

  if (record.count >= maxAttempts) {
    const backoffMs = Math.min(windowMs * Math.pow(2, record.count - maxAttempts), 300000); // max 5 min
    const elapsed = now - record.lastAttempt;
    if (elapsed < backoffMs) {
      return { allowed: false, retryAfterMs: backoffMs - elapsed };
    }
    // Backoff expired, allow but increment
    record.count++;
    record.lastAttempt = now;
    return { allowed: true, retryAfterMs: 0 };
  }

  record.count++;
  record.lastAttempt = now;
  return { allowed: true, retryAfterMs: 0 };
};

export const resetRateLimit = (key: string) => {
  delete attempts[key];
};
