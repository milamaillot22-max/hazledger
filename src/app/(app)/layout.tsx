import type { Metadata } from "next";
import { Suspense } from "react";

import { Logo } from "@/components/brand/logo";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { stateName } from "@/features/clinics/constants";
import { getActiveClinic, getUser } from "@/lib/auth/dal";

export const metadata: Metadata = {
  robots: { index: false },
};

/**
 * Authenticated shell. The session read lives inside <Suspense> (Cache
 * Components); each page enforces access itself via requireClinic().
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <Logo />
            <span className="hidden h-5 w-px bg-border sm:block" />
            <Suspense fallback={<div className="h-4 w-32 animate-pulse rounded bg-slate-200/70" />}>
              <ClinicBadge />
            </Suspense>
          </div>
          <div className="flex items-center gap-1">
            <Suspense fallback={null}>
              <UserEmail />
            </Suspense>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}

async function ClinicBadge() {
  const clinic = await getActiveClinic();
  if (!clinic) return null;
  return (
    <div className="hidden min-w-0 items-center gap-2 sm:flex">
      <span className="truncate text-sm font-medium text-foreground">{clinic.name}</span>
      <span className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
        {clinic.state}
      </span>
      <span className="sr-only">{stateName(clinic.state)}</span>
    </div>
  );
}

async function UserEmail() {
  const user = await getUser();
  if (!user?.email) return null;
  return <span className="hidden text-sm text-muted-foreground md:block">{user.email}</span>;
}
