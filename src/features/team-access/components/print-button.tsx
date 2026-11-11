"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { markPosterPrinted } from "@/features/team-access/actions";

export function PrintButton({ track = true, label = "Print poster" }: { track?: boolean; label?: string }) {
  return (
    <Button
      type="button"
      size="xl"
      onClick={() => {
        // Fire-and-forget: printing must never wait on the network.
        if (track) void markPosterPrinted().catch(() => undefined);
        window.print();
      }}
    >
      <Printer data-icon="inline-start" />
      {label}
    </Button>
  );
}
