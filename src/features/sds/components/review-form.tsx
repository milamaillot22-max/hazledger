"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { GhsDiamond } from "@/components/marketing/ghs-pictogram";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmSdsReview, type ReviewState } from "@/features/sds/actions";
import { GHS_CODES } from "@/features/sds/schema";
import { cn } from "@/lib/utils";

const PICTOGRAM_LABELS: Record<(typeof GHS_CODES)[number], string> = {
  GHS01: "Explosive",
  GHS02: "Flammable",
  GHS03: "Oxidizer",
  GHS04: "Compressed gas",
  GHS05: "Corrosive",
  GHS06: "Acute toxicity",
  GHS07: "Irritant / harmful",
  GHS08: "Health hazard",
  GHS09: "Environment",
};

const FIELD =
  "h-11 rounded-xl border-slate-200 bg-white px-3.5 text-[15px] shadow-xs focus-visible:border-primary focus-visible:ring-sky-100";

export type ReviewDefaults = {
  id: string;
  product_name: string | null;
  manufacturer: string | null;
  emergency_phone: string | null;
  revision_date: string | null;
  signal_word: string | null;
  pictograms: string[];
  cas_numbers: string[];
  confidence: Partial<Record<"product_name" | "manufacturer" | "revision_date" | "hazards" | "ingredients", number>>;
  isCurrent: boolean;
};

function Confidence({ value }: { value?: number }) {
  if (value === undefined) return null;
  const pct = Math.round(value * 100);
  const tone = value >= 0.9 ? "text-emerald-700 bg-success-soft" : value >= 0.7 ? "text-sky-700 bg-brand-soft" : "text-amber-700 bg-amber-50";
  return <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", tone)}>{pct}% confident</span>;
}

function Field({ label, htmlFor, confidence, children }: { label: string; htmlFor: string; confidence?: number; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex min-h-6 items-center justify-between gap-2">
        <Label htmlFor={htmlFor} className="text-slate-700">{label}</Label>
        <Confidence value={confidence} />
      </div>
      {children}
    </div>
  );
}

export function SdsReviewForm({ defaults }: { defaults: ReviewDefaults }) {
  const [state, action] = useActionState<ReviewState, FormData>(confirmSdsReview, { status: "idle" });
  const c = defaults.confidence;

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={defaults.id} />
      {state.message ? (
        <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </div>
      ) : null}

      <Field label="Product name" htmlFor="product_name" confidence={c.product_name}>
        <Input id="product_name" name="product_name" defaultValue={defaults.product_name ?? ""} required maxLength={200} className={FIELD} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Manufacturer" htmlFor="manufacturer" confidence={c.manufacturer}>
          <Input id="manufacturer" name="manufacturer" defaultValue={defaults.manufacturer ?? ""} maxLength={200} className={FIELD} />
        </Field>
        <Field label="Emergency phone" htmlFor="emergency_phone">
          <Input id="emergency_phone" name="emergency_phone" defaultValue={defaults.emergency_phone ?? ""} maxLength={60} className={FIELD} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Revision date" htmlFor="revision_date" confidence={c.revision_date}>
          <Input id="revision_date" name="revision_date" type="date" defaultValue={defaults.revision_date ?? ""} className={FIELD} />
        </Field>
        <Field label="Signal word" htmlFor="signal_word">
          <select
            id="signal_word"
            name="signal_word"
            defaultValue={defaults.signal_word ?? ""}
            className={cn(FIELD, "w-full border outline-none focus-visible:ring-3")}
          >
            <option value="">None</option>
            <option value="Warning">Warning</option>
            <option value="Danger">Danger</option>
          </select>
        </Field>
      </div>

      <fieldset>
        <div className="flex items-center justify-between gap-2">
          <legend className="text-sm font-medium text-slate-700">GHS pictograms</legend>
          <Confidence value={c.hazards} />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {GHS_CODES.map((code) => (
            <label
              key={code}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 transition-colors has-[input:checked]:border-primary has-[input:checked]:bg-brand-soft has-[input:checked]:ring-2 has-[input:checked]:ring-sky-100 has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-sky-200"
            >
              <input type="checkbox" name="pictograms" value={code} defaultChecked={defaults.pictograms.includes(code)} className="sr-only" />
              <GhsDiamond code={code} className="size-6" />
              <span className="leading-tight">{PICTOGRAM_LABELS[code]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="CAS numbers" htmlFor="cas_numbers" confidence={c.ingredients}>
        <Input
          id="cas_numbers"
          name="cas_numbers"
          defaultValue={defaults.cas_numbers.join(", ")}
          placeholder="e.g. 67-63-0, 7732-18-5"
          className={cn(FIELD, "tabular")}
        />
        <p className="text-xs text-slate-500">Separate with commas. Only check-digit-valid numbers were kept from the scan.</p>
      </Field>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <CheckCircle2 className="size-3.5 text-success" />
          You confirm the fields match the document.
        </p>
        <SubmitButton isCurrent={defaults.isCurrent} />
      </div>
    </form>
  );
}

function SubmitButton({ isCurrent }: { isCurrent: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="xl" disabled={pending}>
      {pending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <CheckCircle2 data-icon="inline-start" />}
      {isCurrent ? "Save changes" : "Confirm & add to library"}
    </Button>
  );
}
