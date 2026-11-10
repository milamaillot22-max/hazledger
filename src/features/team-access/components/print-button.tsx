"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PrintButton() {
  return (
    <Button type="button" size="xl" onClick={() => window.print()}>
      <Printer data-icon="inline-start" />
      Print poster
    </Button>
  );
}
