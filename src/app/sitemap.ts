import type { MetadataRoute } from "next";

import { routes } from "@/config/site";
import { SOLUTIONS } from "@/features/solutions/data";
import { absoluteUrl } from "@/lib/seo";

/** Public, indexable pages only. App, auth and staff QR views are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    ...SOLUTIONS.map((s) => ({
      url: absoluteUrl(routes.solution(s.slug)),
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: absoluteUrl(routes.signup), changeFrequency: "yearly", priority: 0.5 },
  ];
}
