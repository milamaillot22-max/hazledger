import type { Metadata } from "next";

import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  robots: { index: false },
};

/**
 * Authenticated app shell.
 * TODO(auth): verify the session here (server-side) and redirect to /login.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-14 items-center border-b border-border bg-card px-4 sm:px-6">
        <Logo />
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
