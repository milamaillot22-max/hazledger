import { cn } from "@/lib/utils";

/** Soft pill label used above headings (replaces the old mono eyebrow). */
export function Eyebrow({
  children,
  tone = "primary",
  className,
}: {
  children: React.ReactNode;
  tone?: "primary" | "success";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tone === "primary"
          ? "bg-brand-soft text-sky-700 ring-1 ring-sky-100"
          : "bg-success-soft text-emerald-700 ring-1 ring-emerald-100",
        className
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-3xl leading-tight font-semibold text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
