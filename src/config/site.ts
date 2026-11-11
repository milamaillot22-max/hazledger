/**
 * Single source of truth for brand, routes and marketing links.
 * Rename the product here — every page reads from this file.
 */
export const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  onboarding: "/onboarding",
  authCallback: "/auth/callback",
  sdsLibrary: "/dashboard/sds",
  sdsScan: "/dashboard/sds/scan",
  teamAccess: "/dashboard/team-access",
  teamAccessPrint: "/dashboard/team-access/print",
  solution: (slug: string) => `/solutions/${slug}`,
} as const;

/** Login-free employee view opened by the team QR code. */
export const publicLibraryPath = (token: string) => `/c/${token}`;

/** US national Poison Help line (America's Poison Centers). */
export const POISON_HELP_LINE = { display: "1-800-222-1222", tel: "+18002221222" } as const;

export const siteConfig = {
  name: "HazLedger",
  tagline: "OSHA compliance for dental, veterinary & medical practices",
  description:
    "Scan and organize every Safety Data Sheet in your dental, veterinary or dermatology practice. HazLedger keeps your SDS library current and your team inspection-ready for OSHA 29 CFR 1910.1200.",
  copyrightYear: 2026,
  contactEmail: "sales@gethazledger.com",
  links: {
    // Swap for a Cal.com / Calendly link once sales booking is live.
    bookDemo: "/#demo",
    startTrial: routes.signup,
    signIn: routes.login,
  },
  nav: [
    { label: "Product", href: "/#product" },
    { label: "Specialties", href: "/#specialties" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Compare", href: "/#compare" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
  ],
  trialDays: 14,
} as const;

export type SiteConfig = typeof siteConfig;
