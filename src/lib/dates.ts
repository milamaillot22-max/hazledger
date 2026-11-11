const DAY_MS = 86_400_000;

/** Whole calendar days from `now` (local date) to `iso` (YYYY-MM-DD). Negative once passed. */
export function daysUntil(iso: string, now: Date = new Date()) {
  const [y, m, d] = iso.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target - today) / DAY_MS);
}
