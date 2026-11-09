import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="ghost" size="lg" className="text-muted-foreground">
        <LogOut data-icon="inline-start" />
        Sign out
      </Button>
    </form>
  );
}
