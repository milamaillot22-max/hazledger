import type { MetadataRoute } from "next";

import { routes } from "@/config/site";
import { POSTS } from "@/features/blog/posts";
import { SOLUTIONS } from "@/features/solutions/data";
import { absoluteUrl } from "@/lib/seo";

/** Public, indexable pages only. App, auth and staff QR views are excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl(routes.product), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl(routes.pricing), changeFrequency: "monthly", priority: 0.9 },
    ...SOLUTIONS.map((s) => ({
      url: absoluteUrl(routes.solution(s.slug)),
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: absoluteUrl(routes.blog), changeFrequency: "weekly", priority: 0.7 },
    ...POSTS.map((p) => ({
      url: absoluteUrl(routes.blogPost(p.slug)),
      lastModified: p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl(routes.signup), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl(routes.terms), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl(routes.privacy), changeFrequency: "yearly", priority: 0.2 },
  ];
}
