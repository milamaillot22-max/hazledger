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
    <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100/80 px-1.5 py-px align-[1px] text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200/70 tabular">
      {label}
    </span>
  );
}
