import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";
import { getPlan } from "@/config/pricing";
import { routes, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms that govern your ${siteConfig.name} subscription: trial, billing, cancellation, refunds and acceptable use.`,
  alternates: { canonical: routes.terms },
};

const starter = getPlan("starter");
const pro = getPlan("pro");

const SECTIONS: LegalSection[] = [
  {
    title: "The service",
    body: [
      `${siteConfig.name} is online software that helps dental, veterinary and medical practices organize Safety Data Sheets (SDSs), extract their content with AI-assisted scanning, and give staff access to them through a QR code.`,
      `${siteConfig.name} is a tool. It does not provide legal, safety or regulatory advice, and using it does not by itself make a workplace compliant with OSHA's Hazard Communication Standard (29 CFR 1910.1200) or any state plan. You remain responsible for your hazard communication program, labels, training and for reviewing every SDS record before relying on it. OSHA does not certify or endorse software.`,
    ],
  },
  {
    title: "Accounts",
    body: [
      "You must provide accurate information and keep your sign-in email secure. The person who creates a clinic is its owner and may invite others. You are responsible for activity under your clinic's accounts and for the team QR link you share; you can regenerate it at any time.",
    ],
  },
  {
    title: "Free trial",
    body: [
      `Each new clinic gets a ${siteConfig.trialDays}-day free trial with every feature. No payment card is required to start. If you subscribe during the trial, your remaining trial days are kept and the first charge happens when the trial ends.`,
    ],
  },
  {
    title: "Plans, billing and renewal",
    body: [
      [
        `Starter: $${starter.monthly} per location per month, or $${starter.monthly * 10} per year. Includes up to 150 SDSs and 25 AI scans per month.`,
        `Pro: $${pro.monthly} per location per month, or $${pro.monthly * 10} per year. Includes unlimited SDSs and unlimited AI scans under a fair-use policy covering your location's own documents.`,
      ],
      "Prices are in US dollars and exclude applicable taxes, which are added at checkout where required. Subscriptions are billed in advance and renew automatically at the end of each monthly or annual period until cancelled. Payments are processed by Stripe; we never see or store your full card number.",
      "We may change prices with at least 30 days' notice by email. Changes apply from your next renewal after the notice period.",
    ],
  },
  {
    title: "Cancellation and refunds",
    body: [
      "You can cancel at any time from Billing in your dashboard. Cancellation takes effect at the end of the current paid period; you keep full access until then and are not charged again.",
      "Fees already paid are non-refundable, including for partially used periods, except where a refund is required by law. If you were charged in error, contact us within 30 days and we will refund the erroneous charge.",
      "After a subscription ends, your library stays readable and your team's QR access to SDSs is not switched off for billing reasons; adding new SDSs requires an active plan or trial.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      [
        "Upload only Safety Data Sheets, product labels and related documents you are entitled to use.",
        "Do not upload patient information or other protected health information — the service is not designed to store it.",
        "Do not attempt to access other clinics' data, disrupt the service, or resell it without our written agreement.",
        "Fair use on Pro means scans of your own location's products; automated or bulk scanning for third parties is not included.",
      ],
    ],
  },
  {
    title: "Your data",
    body: [
      "You own the documents and records you add. We process them only to provide the service, as described in our Privacy Policy. You can export or ask us to delete your data at any time by emailing us.",
    ],
  },
  {
    title: "AI-assisted extraction",
    body: [
      "Scanning uses AI to read documents. Results can contain errors, which is why every record is flagged for review and nothing goes live to your team until an owner or admin confirms it. Always check extracted data against the original SDS.",
    ],
  },
  {
    title: "Availability and changes",
    body: [
      "We work to keep the service available and secure but do not guarantee uninterrupted operation. We may improve or change features; we will not remove a core paid feature during a paid period without offering a pro-rated refund.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      `To the extent permitted by law, ${siteConfig.name} is provided "as is", and our total liability for any claim relating to the service is limited to the fees you paid in the 12 months before the claim. We are not liable for indirect or consequential losses, including regulatory fines, except where such limitation is not permitted by law.`,
    ],
  },
  {
    title: "Termination",
    body: [
      "We may suspend or terminate accounts that breach these terms, after notice where reasonably possible. You may stop using the service at any time.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update these terms. Material changes will be emailed to clinic owners at least 30 days before they take effect. Continuing to use the service after that date means you accept the updated terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="November 13, 2026"
      intro={`These terms are an agreement between you (the clinic and its users) and ${siteConfig.name}. By starting a trial or subscribing, you agree to them.`}
      sections={SECTIONS}
    />
  );
}
