import Link from "next/link";
import { Check, Minus, X } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Cell = { kind: "yes" | "no" | "partial"; text?: string } | string;

const COLUMNS = [siteConfig.name, "Paper binders", "Legacy EHS suites"] as const;

const ROWS: { label: string; cells: [Cell, Cell, Cell] }[] = [
  {
    label: "Time to go live",
    cells: ["Same day", "Weeks of manual filing", "6–12 week implementation"],
  },
  {
    label: "SDS access on every shift",
    cells: [
      { kind: "yes", text: "QR scan, any phone" },
      { kind: "partial", text: "If the binder is there" },
      { kind: "partial", text: "Desktop login" },
    ],
  },
  {
    label: "AI extraction of all 16 sections",
    cells: [{ kind: "yes" }, { kind: "no" }, { kind: "partial", text: "Manual entry" }],
  },
  {
    label: "Outdated-revision alerts",
    cells: [{ kind: "yes" }, { kind: "no" }, { kind: "partial", text: "Paid add-on" }],
  },
  {
    label: "GHS secondary labels",
    cells: [{ kind: "yes", text: "One click" }, { kind: "no", text: "Handwritten" }, { kind: "yes" }],
  },
  {
    label: "Inspector-ready export",
    cells: [{ kind: "yes", text: "One PDF" }, { kind: "no" }, { kind: "yes" }],
  },
  {
    label: "Pricing",
    cells: ["Flat, per location", "Free — until the fine", "Per-seat, annual contract"],
  },
];

function CellContent({ cell, highlight }: { cell: Cell; highlight?: boolean }) {
  if (typeof cell === "string") {
    return (
      <span className={cn("text-sm", highlight ? "font-medium text-foreground" : "text-muted-foreground")}>
        {cell}
      </span>
    );
  }
  const Icon = cell.kind === "yes" ? Check : cell.kind === "no" ? X : Minus;
  const label = cell.kind === "yes" ? "Yes" : cell.kind === "no" ? "No" : "Partial";
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full",
          cell.kind === "yes" && "bg-primary text-primary-foreground",
          cell.kind === "no" && "bg-slate-100 text-slate-400",
          cell.kind === "partial" && "bg-amber-50 text-warning"
        )}
      >
        <Icon className="size-3" strokeWidth={3} />
      </span>
      <span className={cn(highlight ? "font-medium text-foreground" : "text-muted-foreground")}>
        {cell.text ?? <span className="sr-only">{label}</span>}
      </span>
    </span>
  );
}

export function Comparison() {
  return (
    <section id="compare" className="scroll-mt-20 border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          align="center"
          eyebrow="Compare"
          title="Built to replace the binder — and the bloated suite."
          description="Most teams come to us from one of two places. Here's what changes."
        />

        <div className="relative mt-14 overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
            <caption className="sr-only">
              {siteConfig.name} compared with paper binders and legacy EHS suites
            </caption>
            <thead>
              <tr>
                <th scope="col" className="w-[28%] pb-4" />
                {COLUMNS.map((col, i) => (
                  <th
                    key={col}
                    scope="col"
                    className={cn(
                      "px-5 pt-5 pb-4 align-bottom text-sm font-semibold",
                      i === 0
                        ? "rounded-t-xl border-x border-t border-primary/30 bg-brand-soft/60 text-primary"
                        : "text-foreground"
                    )}
                  >
                    {i === 0 ? (
                      <span className="mb-2 block font-mono text-[10px] font-medium tracking-[0.08em] text-primary/80 uppercase">
                        Recommended
                      </span>
                    ) : null}
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, r) => {
                const last = r === ROWS.length - 1;
                return (
                  <tr key={row.label}>
                    <th
                      scope="row"
                      className="border-t border-border py-4 pr-4 text-sm font-medium text-foreground"
                    >
                      {row.label}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td
                        key={i}
                        className={cn(
                          "border-t border-border px-5 py-4",
                          i === 0 && "border-x border-x-primary/30 bg-brand-soft/60",
                          i === 0 && last && "rounded-b-xl border-b border-b-primary/30"
                        )}
                      >
                        <CellContent cell={cell} highlight={i === 0} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="xl">
            <Link href={siteConfig.links.startTrial}>Switch in one afternoon</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            We migrate your existing SDS files at no cost.
          </p>
        </div>
      </div>
    </section>
  );
}
