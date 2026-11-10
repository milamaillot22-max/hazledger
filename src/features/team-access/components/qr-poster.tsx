import { Phone } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import { POISON_HELP_LINE, siteConfig } from "@/config/site";

/** US Letter poster for the team QR. Pure presentation — data comes from the page. */
export function QrPoster({ clinicName, qrSvg, url }: { clinicName: string; qrSvg: string; url: string }) {
  const shortUrl = url.replace(/^https?:\/\//, "");
  return (
    <article className="poster mx-auto flex aspect-[8.5/11] w-full max-w-[8.5in] flex-col rounded-2xl border border-slate-200 bg-white px-[7%] py-[6%] text-center shadow-xl shadow-slate-200/60 print:aspect-auto print:h-[10in] print:max-w-none print:rounded-none print:border-0 print:shadow-none">
      <header className="flex items-center justify-center gap-2">
        <span className="rounded-full bg-success-soft px-3 py-1 text-[clamp(9px,1.6vw,13px)] font-semibold text-emerald-700 ring-1 ring-emerald-100 print:text-[12px]">
          OSHA Hazard Communication · 29 CFR 1910.1200
        </span>
      </header>

      <h1 className="mt-[5%] text-[clamp(22px,5vw,44px)] leading-tight font-bold text-slate-900 print:text-[40px]">
        {clinicName}
      </h1>
      <p className="mt-2 text-[clamp(13px,2.4vw,22px)] font-semibold text-primary print:text-[20px]">
        Safety Data Sheets &amp; emergency procedures
      </p>

      <div className="mx-auto mt-[5%] w-[52%] rounded-3xl border-4 border-primary p-[3%] print:w-[3.9in]">
        <div className="[&>svg]:h-auto [&>svg]:w-full" role="img" aria-label="Team QR code" dangerouslySetInnerHTML={{ __html: qrSvg }} />
      </div>

      <p className="mx-auto mt-[5%] max-w-[85%] text-[clamp(15px,2.8vw,26px)] leading-snug font-semibold text-slate-900 print:text-[24px]">
        Scan with your phone camera to access this clinic&apos;s Safety Data Sheets and emergency procedures.
      </p>
      <p className="mt-2 text-[clamp(11px,1.9vw,17px)] text-slate-600 print:text-[16px]">
        No app · No login · Available 24/7
      </p>

      <div className="mx-auto mt-auto grid w-full max-w-[90%] grid-cols-2 gap-3 pt-[4%] text-left">
        <div className="flex items-center gap-2.5 rounded-2xl bg-red-50 px-4 py-3 ring-1 ring-red-100">
          <Phone className="size-5 shrink-0 text-red-700" />
          <div>
            <p className="text-[clamp(9px,1.5vw,12px)] font-semibold tracking-wide text-red-700 uppercase">Emergency</p>
            <p className="text-[clamp(14px,2.6vw,22px)] font-bold text-red-800 print:text-[22px]">911</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-2xl bg-red-50 px-4 py-3 ring-1 ring-red-100">
          <Phone className="size-5 shrink-0 text-red-700" />
          <div>
            <p className="text-[clamp(9px,1.5vw,12px)] font-semibold tracking-wide text-red-700 uppercase">Poison Help</p>
            <p className="text-[clamp(14px,2.6vw,22px)] font-bold text-red-800 tabular print:text-[22px]">{POISON_HELP_LINE.display}</p>
          </div>
        </div>
      </div>

      <footer className="mt-[4%] flex items-center justify-between gap-4 border-t border-slate-200 pt-[3%] text-left text-[clamp(8px,1.4vw,11px)] text-slate-500 print:text-[10px]">
        <div className="min-w-0">
          <p className="truncate">Can&apos;t scan? Go to <span className="font-semibold text-slate-700">{shortUrl}</span></p>
          <p className="mt-1">Posted: ____________ &nbsp; Location: ________________</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <LogoMark className="size-5" />
          <span className="font-semibold text-slate-700">{siteConfig.name}</span>
        </div>
      </footer>
    </article>
  );
}
