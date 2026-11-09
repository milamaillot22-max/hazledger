/**
 * Single source of truth for brand, routes and marketing links.
 * Rename the product here — every page reads from this file.
 */
export const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  sdsLibrary: "/dashboard/sds",
  sdsScan: "/dashboard/sds/scan",
} as const;

export const siteConfig = {
  name: "HazLedger",
  tagline: "OSHA HazCom compliance, without the binder",
  description:
    "Scan, index and share every Safety Data Sheet in minutes. HazLedger keeps your SDS library current and your team audit-ready for OSHA 29 CFR 1910.1200.",
  copyrightYear: 2026,
  contactEmail: "sales@hazledger.com",
  links: {
    // Swap for a Cal.com / Calendly link once sales booking is live.
    bookDemo: "#demo",
    startTrial: routes.signup,
    signIn: routes.login,
  },
  nav: [
    { label: "Product", href: "#product" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Compare", href: "#compare" },
    { label: "FAQ", href: "#faq" },
  ],
  trialDays: 14,
} as const;

export type SiteConfig = typeof siteConfig;
