import { AlertTriangle, CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const STYLES = {
  current: { label: "Current", icon: CheckCircle2, className: "bg-success-soft text-emerald-700 ring-emerald-100" },
  needs_review: { label: "Needs review", icon: Clock3, className: "bg-amber-50 text-amber-700 ring-amber-100" },
  processing: { label: "Scanning…", icon: Loader2, className: "bg-brand-soft text-sky-700 ring-sky-100" },
  failed: { label: "Scan failed", icon: XCircle, className: "bg-red-50 text-red-700 ring-red-100" },
} as const;

export function SdsStatusBadge({ status, className }: { status: string; className?: string }) {
  const s = STYLES[status as keyof typeof STYLES] ?? {
    label: status,
    icon: AlertTriangle,
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ring-1",
        s.className,
        className
      )}
    >
      <Icon className={cn("size-3.5", status === "processing" && "animate-spin")} />
      {s.label}
    </span>
  );
}
