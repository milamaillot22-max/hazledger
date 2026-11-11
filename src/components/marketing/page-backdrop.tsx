import { cn } from "@/lib/utils";

/**
 * The home hero's atmosphere, reusable on every page header: slow fluid colour
 * fields (sky, emerald, sand), an echo arch, a dot lattice, a fine ring and a
 * gold hairline. Purely decorative; place inside a `relative overflow-hidden`.
 */
export function PageBackdrop({ className, arch = true }: { className?: string; arch?: boolean }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/70 via-white to-white" />
      <div className="bg-aurora absolute inset-0" />
      <div className="hero-fluid absolute -inset-[10%]" />
      {arch ? (
        <div className="absolute top-[12%] right-[-6%] hidden h-[110%] w-[34%] rounded-[50%_50%_0_0/30%_30%_0_0] border border-sky-200/70 bg-gradient-to-b from-sky-100/40 via-white/10 to-transparent lg:block" />
      ) : null}
      <div className="bg-dots absolute top-[18%] right-[4%] size-40 opacity-80" />
      <div className="absolute bottom-[10%] left-[-3%] size-28 rounded-full border border-emerald-200/60" />
      <div className="absolute bottom-0 left-1/2 h-px w-[40%] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
    </div>
  );
}
