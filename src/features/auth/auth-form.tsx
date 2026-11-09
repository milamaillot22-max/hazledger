import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/config/site";

/**
 * Presentational shell for login/signup.
 * TODO(auth): wire to a Server Action calling Supabase Auth (magic link + Google).
 */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">
        {isSignup ? "Start your free trial" : "Sign in to your account"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {isSignup
          ? "No credit card required. Set up in under 10 minutes."
          : "Welcome back. Enter your work email to continue."}
      </p>

      <form className="mt-8 space-y-4">
        {isSignup ? (
          <div className="space-y-1.5">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" autoComplete="organization" className="h-10" required />
          </div>
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="h-10"
            required
          />
        </div>
        <Button type="submit" size="xl" className="w-full">
          {isSignup ? "Create account" : "Continue with email"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignup ? "Already have an account? " : "New to HazLedger? "}
        <Link
          href={isSignup ? routes.login : routes.signup}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {isSignup ? "Sign in" : "Start a free trial"}
        </Link>
      </p>
    </div>
  );
}
