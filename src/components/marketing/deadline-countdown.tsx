"use client";

import { useSyncExternalStore } from "react";

import { daysUntil } from "@/lib/dates";

const noop = () => () => {};

/**
 * "· 9 days left" chip. Rendered only in the browser (the server snapshot is
 * null) so prerendered HTML never carries a stale count.
 */
export function DeadlineCountdown({ date }: { date: string }) {
  const days = useSyncExternalStore(noop, () => daysUntil(date), () => null);
  if (days === null) return null;
  const label = days > 1 ? `${days} days left` : days === 1 ? "1 day left" : days === 0 ? "today" : "now in effect";
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-amber-300 px-2 py-px align-[1px] text-[11px] font-bold text-amber-950 tabular">
      {label}
    </span>
  );
}
