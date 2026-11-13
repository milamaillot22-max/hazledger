import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";
import { routes, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `What data ${siteConfig.name} collects, why, who processes it and your choices.`,
  alternates: { canonical: routes.privacy },
};

const SECTIONS: LegalSection[] = [
  {
    title: "What we collect",
    body: [
      [
        "Account data: your email address and, if you sign in with Google, your name and profile basics provided by Google.",
        "Clinic data: clinic name, US state, practice type and team roles.",
        "Documents you upload: SDS PDFs, label photos and the records extracted from them.",
        "Billing data: plan, billing status and your billing name and address. Card details are collected and stored by Stripe, never by us.",
        "Technical data: basic logs needed to run and secure the service (for example IP address and request times).",
      ],
      "We do not want patient information or other protected health information; please don't upload it.",
    ],
  },
  {
    title: "How we use it",
    body: [
      [
        "To provide the service: store your SDS library, extract SDS content, and serve your team's QR view.",
        "To bill your subscription and send account and billing emails.",
        "To keep the service secure, prevent abuse and fix problems.",
      ],
      "We do not sell your data and do not use your documents to train AI models.",
    ],
  },
  {
    title: "Service providers",
    body: [
      "We rely on a small number of providers who process data on our behalf, under contracts that limit their use of it:",
      [
        "Supabase — database, file storage and sign-in (hosted in the United States, us-east-1).",
        "Vercel — website and application hosting.",
        "Stripe — payments, invoices and tax calculation.",
        "Anthropic — AI extraction of the SDS documents you choose to scan.",
        "Google — optional sign-in with Google.",
      ],
    ],
  },
  {
    title: "Cookies",
    body: [
      "We use only the cookies needed to keep you signed in and secure. We do not use advertising or cross-site tracking cookies.",
    ],
  },
  {
    title: "Security",
    body: [
      "Data is encrypted in transit (TLS) and at rest. Each clinic's records and files are isolated with row-level security, and only confirmed SDSs are shown on the team QR view. You can regenerate the team QR link at any time.",
    ],
  },
  {
    title: "Retention",
    body: [
      "We keep your data while your clinic account exists. When you ask us to delete your account, we delete your clinic data within 30 days, except billing records we must keep for tax and accounting purposes.",
    ],
  },
  {
    title: "Your choices and rights",
    body: [
      "You can access, correct, export or delete your data by emailing us. Depending on where you live, you may have additional rights under laws such as the CCPA or the GDPR; we honor these requests.",
    ],
  },
  {
    title: "Changes",
    body: ["We will post updates here and email clinic owners about material changes."],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="November 13, 2026"
      intro={`This policy explains how ${siteConfig.name} handles information when you use our website and service.`}
      sections={SECTIONS}
    />
  );
}
