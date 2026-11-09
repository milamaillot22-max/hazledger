import type { Metadata } from "next";

import { AuthForm } from "@/features/auth/auth-form";

export const metadata: Metadata = { title: "Start your free trial" };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
