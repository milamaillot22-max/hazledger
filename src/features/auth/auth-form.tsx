"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ArrowRight, Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes, siteConfig } from "@/config/site";
import {
  sendMagicLink,
  signInWithGoogle,
  type MagicLinkState,
} from "@/features/auth/actions";
import { GoogleIcon } from "@/features/auth/google-icon";

const URL_ERRORS: Record<string, string> = {
  link_invalid:
    "That sign-in link is invalid or has expired. Request a new one below.",
  oauth: "Google sign-in couldn't be started. Try again or use your email.",
};

type Mode = "login" | "signup";

const COPY: Record<Mode, { title: string; subtitle: string; cta: string }> = {
  login: {
    title: "Sign in to your account",
    subtitle: "Welcome back. We'll email you a secure sign-in link.",
    cta: "Email me a sign-in link",
  },
  signup: {
    title: "Start your free trial",
    subtitle: `${siteConfig.trialDays} days, every feature, no credit card.`,
    cta: "Create my account",
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  // Remounting the form resets the action state ("use a different email").
  const [formKey, setFormKey] = useState(0);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? routes.dashboard;
  const urlError = URL_ERRORS[searchParams.get("error") ?? ""];

  return (
    <EmailFlow
      key={formKey}
      mode={mode}
      next={next}
      urlError={urlError}
      onReset={() => setFormKey((k) => k + 1)}
    />
  );
}

function EmailFlow({
  mode,
  next,
  urlError,
  onReset,
}: {
  mode: Mode;
  next: string;
  urlError?: string;
  onReset: () => void;
}) {
  const [state, formAction] = useActionState<MagicLinkState, FormData>(
    sendMagicLink,
    { status: "idle" }
  );
  const copy = COPY[mode];

  if (state.status === "sent") {
    return <CheckInbox email={state.email} onReset={onReset} />;
  }

  const error = state.status === "error" ? state.message : urlError;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{copy.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{copy.subtitle}</p>

      {error ? (
        <div
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-red-50 px-3.5 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <form action={signInWithGoogle} className="mt-8">
        <input type="hidden" name="next" value={next} />
        <GoogleButton />
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-border" />
        or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="space-y-4" noValidate>
        <input type="hidden" name="next" value={next} />
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@yourclinic.com"
            defaultValue={state.status === "error" ? state.email : undefined}
            aria-invalid={state.status === "error" || undefined}
            className="h-10 bg-card"
            required
            autoFocus
          />
        </div>
        <SubmitButton label={copy.cta} />
      </form>

      {mode === "signup" ? (
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          By creating an account you agree to the {siteConfig.name} Terms of
          Service and Privacy Policy.
        </p>
      ) : null}

      <p className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        {mode === "signup" ? "Already have an account? " : `New to ${siteConfig.name}? `}
        <Link
          href={mode === "signup" ? routes.login : routes.signup}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {mode === "signup" ? "Sign in" : "Start a free trial"}
        </Link>
      </p>
    </div>
  );
}

function GoogleButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      size="xl"
      disabled={pending}
      className="w-full bg-card font-medium"
    >
      {pending ? (
        <Loader2 data-icon="inline-start" className="animate-spin" />
      ) : (
        <GoogleIcon className="size-4" />
      )}
      Continue with Google
    </Button>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="xl" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 data-icon="inline-start" className="animate-spin" />
          Sending link…
        </>
      ) : (
        <>
          {label}
          <ArrowRight data-icon="inline-end" />
        </>
      )}
    </Button>
  );
}

function CheckInbox({ email, onReset }: { email: string; onReset: () => void }) {
  return (
    <div role="status" aria-live="polite">
      <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft">
        <MailCheck className="size-5 text-primary" />
      </span>
      <h1 className="mt-6 text-2xl font-bold text-foreground">Check your inbox</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        We sent a secure sign-in link to{" "}
        <span className="font-medium text-foreground">{email}</span>. It expires
        in 1 hour and can only be used once.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Not there? Check spam or quarantine — clinic email filters often hold
        automated messages.
      </div>
      <Button
        type="button"
        variant="ghost"
        size="lg"
        onClick={onReset}
        className="mt-6 -ml-2.5 text-muted-foreground"
      >
        Use a different email
      </Button>
    </div>
  );
}

/** Static placeholder shown in the prerendered shell while search params resolve. */
export function AuthFormSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="h-7 w-2/3 rounded-md bg-slate-200/70" />
      <div className="mt-3 h-4 w-5/6 rounded bg-slate-200/60" />
      <div className="mt-8 h-11 rounded-lg bg-slate-200/60" />
      <div className="my-6 h-px bg-border" />
      <div className="h-4 w-24 rounded bg-slate-200/60" />
      <div className="mt-2 h-10 rounded-lg bg-slate-200/60" />
      <div className="mt-4 h-11 rounded-lg bg-slate-200/70" />
    </div>
  );
}
