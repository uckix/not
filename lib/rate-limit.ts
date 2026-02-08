const limits = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const existing = limits.get(key);

  if (!existing || existing.expiresAt < now) {
    limits.set(key, { count: 0, expiresAt: now + windowMs });
  }

  return {
    allow() {
      const current = limits.get(key);
      if (!current) {
        limits.set(key, { count: 1, expiresAt: now + windowMs });
        return true;
      }
      if (current.count >= limit) {
        return false;
      }
      current.count += 1;
      return true;
    }
  };
}
