"use client";

import { useFormStatus } from "react-dom";
import { Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { rotateTeamAccessToken } from "@/features/team-access/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      size="lg"
      disabled={pending}
      className="border-red-200 bg-white text-red-700 hover:bg-red-50 hover:text-red-800"
    >
      {pending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <RefreshCw data-icon="inline-start" />}
      Regenerate QR code
    </Button>
  );
}

export function RotateTokenButton() {
  return (
    <form
      action={rotateTeamAccessToken}
      onSubmit={(e) => {
        if (!window.confirm("Every printed poster will stop working immediately. Regenerate the QR code?")) {
          e.preventDefault();
        }
      }}
    >
      <Submit />
    </form>
  );
}
