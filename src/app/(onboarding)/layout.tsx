import type { Metadata } from "next";

import { Logo } from "@/components/brand/logo";
import { SignOutButton } from "@/features/auth/sign-out-button";

export const metadata: Metadata = {
  title: "Set up your clinic",
  robots: { index: false },
};

export default function OnboardingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
