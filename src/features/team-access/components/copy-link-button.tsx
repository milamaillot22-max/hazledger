"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="shrink-0 border-slate-200 bg-white text-slate-700"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard blocked (insecure context): the URL is still selectable.
        }
      }}
    >
      {copied ? <Check data-icon="inline-start" className="text-success" /> : <Copy data-icon="inline-start" />}
      {copied ? "Copied" : "Copy link"}
    </Button>
  );
}
