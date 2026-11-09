import { routes } from "@/config/site";

/** Only allow same-origin relative paths as post-login destinations. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return routes.dashboard;
  }
  return next;
}
