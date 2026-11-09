"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ArrowRight, Check, Loader2, ShieldCheck } from "lucide-react";

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
import { PRACTICE_ICONS } from "@/features/clinics/practice-icons";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "h-12 rounded-xl border-slate-200 bg-white px-4 text-[15px] shadow-xs placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-sky-100";

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
    <form action={formAction} noValidate>
      {state.message ? (
        <div
          role="alert"
          className="mb-8 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_240px]">
        <Field label="Clinic name" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sunset Family Dental"
            autoComplete="organization"
            aria-invalid={Boolean(errors.name) || undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={FIELD_CLASS}
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
              className={cn(FIELD_CLASS, "h-12! w-full data-placeholder:text-slate-400")}
            >
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent position="popper" className="max-h-72 rounded-xl">
              {US_STATES.map((s) => (
                <SelectItem key={s.code} value={s.code}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <fieldset
        className="mt-10"
        aria-describedby={errors.practiceType ? "practiceType-error" : undefined}
      >
        <legend className="text-base font-semibold text-slate-900">
          What type of practice is it?
        </legend>
        <p className="mt-1 text-sm text-slate-600">
          We tailor your chemical templates and safety checklists to your specialty.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRACTICE_TYPES.map((p) => {
            const Icon = PRACTICE_ICONS[p.value];
            const selected = practiceType === p.value;
            return (
              <label
                key={p.value}
                className={cn(
                  "relative flex cursor-pointer flex-col gap-3 rounded-2xl border bg-white p-4 transition-all duration-150",
                  selected
                    ? "border-primary shadow-md ring-4 shadow-sky-100 ring-sky-100"
                    : "border-slate-200 hover:-translate-y-px hover:border-sky-200 hover:shadow-md hover:shadow-slate-200/60",
                  "has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-sky-200"
                )}
              >
                <input
                  type="radio"
                  name="practiceType"
                  value={p.value}
                  checked={selected}
                  onChange={() => setPracticeType(p.value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl transition-colors",
                    selected ? "bg-primary text-white" : "bg-brand-soft text-primary"
                  )}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-slate-900">
                    {p.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                    {p.hint}
                  </span>
                </span>
                {selected ? (
                  <span className="absolute top-3.5 right-3.5 flex size-5 items-center justify-center rounded-full bg-success text-white ring-4 ring-success-soft">
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                ) : null}
              </label>
            );
          })}
        </div>
        {errors.practiceType ? (
          <p id="practiceType-error" className="mt-3 text-sm text-red-600">
            {errors.practiceType}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-10 flex flex-col-reverse items-stretch gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-sm text-slate-500 sm:items-center">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success sm:mt-0" />
          <span>
            You&apos;ll be the <span className="font-semibold text-slate-700">Owner</span> of
            this clinic. Invite your team next.
          </span>
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
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-slate-700">
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-red-600">
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
          Creating your clinic…
        </>
      ) : (
        <>
          Create my clinic
          <ArrowRight data-icon="inline-end" />
        </>
      )}
    </Button>
  );
}
