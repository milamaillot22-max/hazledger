"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClinic, type CreateClinicState } from "@/features/clinics/actions";
import { PRACTICE_TYPES, US_STATES } from "@/features/clinics/constants";
import { cn } from "@/lib/utils";

export function OnboardingForm() {
  const [state, formAction] = useActionState<CreateClinicState, FormData>(
    createClinic,
    { status: "idle" }
  );
  // Controlled so values survive React's automatic form reset after an action.
  const [name, setName] = useState("");
  const [usState, setUsState] = useState("");
  const [practiceType, setPracticeType] = useState("");
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-8" noValidate>
      {state.message ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-red-50 px-3.5 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-[1fr_220px]">
        <Field label="Clinic name" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sunset Family Dental"
            autoComplete="organization"
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="h-10 bg-card"
            maxLength={120}
            autoFocus
          />
        </Field>

        <Field label="State" htmlFor="state" error={errors.state}>
          <Select name="state" value={usState} onValueChange={setUsState}>
            <SelectTrigger
              id="state"
              aria-invalid={Boolean(errors.state) || undefined}
              aria-describedby={errors.state ? "state-error" : undefined}
              className="h-10! w-full bg-card"
            >
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-72">
              {US_STATES.map((s) => (
                <SelectItem key={s.code} value={s.code}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <fieldset aria-describedby={errors.practiceType ? "practiceType-error" : undefined}>
        <legend className="text-sm font-medium text-foreground">Practice type</legend>
        <p className="mt-1 text-sm text-muted-foreground">
          We tailor your chemical templates and checklists to your specialty.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {PRACTICE_TYPES.map((p) => (
            <label
              key={p.value}
              className={cn(
                "group relative flex cursor-pointer flex-col rounded-lg border border-border bg-card px-3.5 py-3 transition-colors",
                "hover:border-slate-300",
                "has-[input:checked]:border-primary has-[input:checked]:bg-brand-soft/50 has-[input:checked]:ring-1 has-[input:checked]:ring-primary",
                "has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/40"
              )}
            >
              <input
                type="radio"
                name="practiceType"
                value={p.value}
                checked={practiceType === p.value}
                onChange={() => setPracticeType(p.value)}
                className="sr-only"
              />
              <span className="pr-5 text-sm font-medium text-foreground">{p.label}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">{p.hint}</span>
              <span className="absolute top-3 right-3 hidden size-4 items-center justify-center rounded-full bg-primary text-primary-foreground group-has-[input:checked]:flex">
                <Check className="size-2.5" strokeWidth={3.5} />
              </span>
            </label>
          ))}
        </div>
        {errors.practiceType ? (
          <p id="practiceType-error" className="mt-2 text-sm text-destructive">
            {errors.practiceType}
          </p>
        ) : null}
      </fieldset>

      <div className="flex flex-col-reverse items-start gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          You&apos;ll be the <span className="font-medium text-slate-700">Owner</span> of
          this clinic. You can invite your team next.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="xl" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 data-icon="inline-start" className="animate-spin" />
          Creating clinic…
        </>
      ) : (
        <>
          Create clinic
          <ArrowRight data-icon="inline-end" />
        </>
      )}
    </Button>
  );
}
