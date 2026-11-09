"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  FileUp,
  Loader2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/config/site";
import { processSdsUpload } from "@/features/sds/actions";
import { ACCEPTED_MIME_TYPES, MAX_UPLOAD_BYTES, type AcceptedMimeType } from "@/features/sds/schema";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const EXTENSIONS: Record<AcceptedMimeType, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const STEPS = [
  "Uploading securely",
  "Reading the document",
  "Extracting hazards and the 16 sections",
  "Validating CAS numbers and dates",
] as const;

type Phase =
  | { kind: "idle" }
  | { kind: "working"; fileName: string; step: number }
  | { kind: "error"; message: string; recordId?: string };

function validate(file: File): string | null {
  if (!ACCEPTED_MIME_TYPES.includes(file.type as AcceptedMimeType)) {
    return file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")
      ? "HEIC photos aren't supported yet. On iPhone, use “Take a photo” here or export as JPEG."
      : "Use a PDF, JPEG, PNG or WebP file.";
  }
  if (file.size > MAX_UPLOAD_BYTES) return "This file is larger than 20 MB.";
  if (file.size === 0) return "This file is empty.";
  return null;
}

export function SdsUploader({ clinicId }: { clinicId: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [dragging, setDragging] = useState(false);
  const [, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  // Advance the "reading / extracting" steps while the server works.
  const working = phase.kind === "working" && phase.step >= 1;
  useEffect(() => {
    if (!working) return;
    const t = setInterval(() => {
      setPhase((p) => (p.kind === "working" && p.step < STEPS.length - 1 ? { ...p, step: p.step + 1 } : p));
    }, 9000);
    return () => clearInterval(t);
  }, [working]);

  async function handleFile(file: File) {
    const invalid = validate(file);
    if (invalid) return setPhase({ kind: "error", message: invalid });

    const mime = file.type as AcceptedMimeType;
    const path = `${clinicId}/${crypto.randomUUID()}.${EXTENSIONS[mime]}`;
    setPhase({ kind: "working", fileName: file.name, step: 0 });

    const supabase = createClient();
    const { error } = await supabase.storage
      .from("sds-files")
      .upload(path, file, { contentType: mime, upsert: false });
    if (error) {
      return setPhase({ kind: "error", message: "Upload failed. Check your connection and try again." });
    }

    setPhase({ kind: "working", fileName: file.name, step: 1 });
    startTransition(async () => {
      const result = await processSdsUpload({ path, name: file.name, size: file.size, mime });
      if (result.ok) {
        setPhase({ kind: "working", fileName: file.name, step: STEPS.length });
        router.push(`${routes.sdsLibrary}/${result.id}`);
      } else {
        setPhase({ kind: "error", message: result.error, recordId: result.id });
      }
    });
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) void handleFile(file);
  }

  if (phase.kind === "working") {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8" aria-live="polite">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-primary">
            <Loader2 className="size-5 animate-spin" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Scanning your document</p>
            <p className="truncate text-sm text-slate-500">{phase.fileName}</p>
          </div>
        </div>
        <ol className="mt-6 space-y-3">
          {STEPS.map((label, i) => {
            const done = i < phase.step;
            const active = i === phase.step;
            return (
              <li key={label} className="flex items-center gap-3 text-sm">
                {done ? (
                  <CheckCircle2 className="size-5 text-success" />
                ) : active ? (
                  <Loader2 className="size-5 animate-spin text-primary" />
                ) : (
                  <span className="size-5 rounded-full border-2 border-slate-200" />
                )}
                <span className={cn(done ? "text-slate-500" : active ? "font-medium text-slate-900" : "text-slate-400")}>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          Usually 20–60 seconds. Keep this page open — you&apos;ll review every field before it&apos;s added to your library.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-200/50 sm:p-6">
      {phase.kind === "error" ? (
        <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1">
            <p>{phase.message}</p>
            {phase.recordId ? (
              <a href={`${routes.sdsLibrary}/${phase.recordId}`} className="mt-1 inline-block font-semibold underline-offset-4 hover:underline">
                View the failed scan
              </a>
            ) : null}
          </div>
          <button type="button" onClick={() => setPhase({ kind: "idle" })} className="text-red-700/70 hover:text-red-700" aria-label="Dismiss">
            <RotateCcw className="size-4" />
          </button>
        </div>
      ) : null}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
        className={cn(
          "flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          dragging ? "border-primary bg-brand-soft" : "border-sky-200 bg-brand-soft/40"
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-sky-100">
          <FileUp className="size-6" />
        </span>
        <p className="mt-5 text-lg font-semibold text-slate-900">Drop an SDS or a product label</p>
        <p className="mt-1 text-sm text-slate-500">PDF, JPEG, PNG or WebP · up to 20 MB</p>
        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button type="button" size="xl" onClick={() => cameraInput.current?.click()} className="sm:order-2">
            <Camera data-icon="inline-start" />
            Take a photo
          </Button>
          <Button
            type="button"
            size="xl"
            variant="outline"
            onClick={() => fileInput.current?.click()}
            className="border-slate-200 bg-white text-slate-700 shadow-xs sm:order-1"
          >
            <FileUp data-icon="inline-start" />
            Choose a file
          </Button>
        </div>
        <input ref={fileInput} type="file" accept=".pdf,image/jpeg,image/png,image/webp" className="sr-only" onChange={onPick} tabIndex={-1} />
        <input ref={cameraInput} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="sr-only" onChange={onPick} tabIndex={-1} />
      </div>
      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <ShieldCheck className="size-3.5 text-success" />
        Stored privately for your clinic · encrypted in transit and at rest
      </p>
    </div>
  );
}
