import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthForm, AuthFormSkeleton } from "@/features/auth/auth-form";

export const metadata: Metadata = { title: "Start your free trial" };

export default function SignupPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
