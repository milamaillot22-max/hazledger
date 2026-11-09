import Link from "next/link";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

/** Sticky bottom CTA on small screens — keeps the primary action one tap away. */
export function MobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
      <Button asChild size="xl" className="w-full">
        <Link href={siteConfig.links.startTrial}>
          Start free trial — no card needed
        </Link>
      </Button>
    </div>
  );
}
