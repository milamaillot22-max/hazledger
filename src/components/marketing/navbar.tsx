import Link from "next/link";
import { ArrowRight, BookOpen, PawPrint, Stethoscope } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { Tooth } from "@/components/icons/tooth";
import { MobileMenu } from "@/components/marketing/mobile-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { routes, siteConfig } from "@/config/site";
import { POSTS } from "@/features/blog/posts";
import { SOLUTIONS } from "@/features/solutions/data";

export const SECTOR_ICON = { dental: Tooth, veterinary: PawPrint, medical: Stethoscope } as const;

const linkClass =
  "rounded-md px-3 py-2 text-[13.5px] font-medium text-slate-600 transition-colors outline-none hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-sky-200";
// `!` overrides the base component's compound variants (data-open:hover:bg-muted…).
const triggerClass =
  "h-auto rounded-md bg-transparent! px-3 py-2 text-[13.5px] font-medium text-slate-600! hover:bg-slate-100/70! hover:text-slate-900! focus:bg-slate-100/70! data-open:bg-slate-100! data-open:text-slate-900!";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo />
          <NavigationMenu viewport={false} className="hidden md:flex">
            <NavigationMenuList className="gap-0.5">
              <NavigationMenuItem>
                <Link href={routes.product} className={linkClass}>
                  Product
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerClass}>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent className="!rounded-2xl !bg-white !p-2 !shadow-xl !shadow-slate-200/70 !ring-slate-200/80">
                  <ul className="grid w-[380px] gap-1">
                    {SOLUTIONS.map((s) => {
                      const Icon = SECTOR_ICON[s.sector];
                      return (
                        <li key={s.slug}>
                          <NavigationMenuLink asChild>
                            <Link href={routes.solution(s.slug)} className="flex items-start gap-3 rounded-xl p-3 hover:bg-slate-50">
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-primary ring-1 ring-sky-100">
                                <Icon className="size-[18px]" />
                              </span>
                              <span>
                                <span className="block text-sm font-semibold text-slate-900">{s.name}</span>
                                <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                                  {s.chemicals
                                    .slice(0, 3)
                                    .map((c) => c.name.split(" ")[0].replace(/,$/, ""))
                                    .join(" · ")}
                                </span>
                              </span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href={routes.pricing} className={linkClass}>
                  Pricing
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerClass}>Resources</NavigationMenuTrigger>
                <NavigationMenuContent className="!rounded-2xl !bg-white !p-2 !shadow-xl !shadow-slate-200/70 !ring-slate-200/80">
                  <div className="w-[400px]">
                    <NavigationMenuLink asChild>
                      <Link href={routes.blog} className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-success-soft text-success ring-1 ring-emerald-100">
                          <BookOpen className="size-[18px]" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-slate-900">Blog</span>
                          <span className="block text-xs text-slate-500">OSHA inspections, HazCom 2024, penalties</span>
                        </span>
                      </Link>
                    </NavigationMenuLink>
                    <ul className="mt-1 border-t border-slate-100 pt-1">
                      {POSTS.map((p) => (
                        <li key={p.slug}>
                          <NavigationMenuLink asChild>
                            <Link href={routes.blogPost(p.slug)} className="block rounded-lg px-3 py-2 text-[13px] leading-snug text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                              {p.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <Link href={siteConfig.links.signIn} className={`hidden sm:block ${linkClass}`}>
            Sign in
          </Link>
          <Link
            href={siteConfig.links.startTrial}
            className="group hidden items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[13.5px] font-semibold text-white shadow-sm shadow-sky-600/20 transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_0_4px_rgb(2_132_199/0.12)] sm:inline-flex"
          >
            Start free trial
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
