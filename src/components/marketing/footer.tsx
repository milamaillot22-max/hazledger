import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { routes, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            SDS management and HazCom compliance for US dental, veterinary and medical practices.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-16 gap-y-2 text-sm">
          {siteConfig.nav.map((item) => (
            <a key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </a>
          ))}
          <Link href={routes.login} className="text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Link href={routes.signup} className="text-muted-foreground hover:text-foreground">
            Start free trial
          </Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs leading-relaxed text-slate-500 sm:px-6">
          © {siteConfig.copyrightYear} {siteConfig.name}. {siteConfig.name} helps
          you organize Hazard Communication records; it does not replace your
          written HazCom program, employee training or professional safety advice.
          OSHA is a US government agency and does not endorse products.
        </p>
      </div>
    </footer>
  );
}
