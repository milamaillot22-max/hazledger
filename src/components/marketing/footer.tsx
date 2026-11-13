import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { routes, siteConfig } from "@/config/site";
import { POSTS } from "@/features/blog/posts";
import { SOLUTIONS } from "@/features/solutions/data";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: routes.product },
      { label: "Pricing", href: routes.pricing },
      { label: "Start free trial", href: routes.signup },
      { label: "Sign in", href: routes.login },
    ],
  },
  { title: "Solutions", links: SOLUTIONS.map((s) => ({ label: s.name, href: routes.solution(s.slug) })) },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: routes.blog },
      ...POSTS.slice(0, 3).map((p) => ({ label: p.title.split(":")[0], href: routes.blogPost(p.slug) })),
      { label: "Terms of Service", href: routes.terms },
      { label: "Privacy Policy", href: routes.privacy },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo badge />
          <p className="mt-4 text-sm leading-relaxed text-slate-500">
            SDS management and OSHA HazCom compliance for US dental, veterinary and medical practices.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
            <ShieldCheck className="size-3.5" />
            Built for 29 CFR 1910.1200
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-slate-200/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs leading-relaxed text-slate-500 sm:px-6 md:flex-row md:justify-between">
          <p>
            © {siteConfig.copyrightYear} {siteConfig.name}. Helps you organize Hazard Communication records; does not replace your
            written HazCom program, employee training or professional safety advice. OSHA does not endorse products.
          </p>
          <a href={`mailto:${siteConfig.contactEmail}`} className="shrink-0 text-slate-500 hover:text-slate-900">
            {siteConfig.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
