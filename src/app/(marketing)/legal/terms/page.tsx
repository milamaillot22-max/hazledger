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

const operator = siteConfig.legalEntity
  ? `${siteConfig.legalEntity.name}, ${siteConfig.legalEntity.address}`
  : `${siteConfig.name}, ${siteConfig.legalSeat}`;

const SECTIONS: LegalSection[] = [
  {
    title: "Who we are",
    body: [
      `${siteConfig.name} is operated by ${operator} ("we", "us"). You can reach us at ${siteConfig.contactEmail}.`,
      "The service is designed for businesses (dental, veterinary and medical practices and similar workplaces). By starting a trial or subscribing, you confirm you are acting on behalf of a business and not as a consumer.",
    ],
  },
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
      `Each new clinic can start one ${siteConfig.trialDays}-day free trial of the plan it chooses. A valid payment card is required to start the trial; nothing is charged on the day you start. The trial includes up to 15 SDSs and a limited number of AI scans.`,
      `Unless you cancel before the trial ends, your subscription starts automatically at the end of the trial and your card is charged the price of the plan you chose, then on every renewal. The checkout page shows the date of the first charge before you confirm, and we email you a reminder about 7 days before the trial ends. You can cancel at any time during the trial from Billing in your dashboard and you will not be charged.`,
    ],
  },
  {
    title: "Plans, billing and renewal",
    body: [
      [
        `Starter: $${starter.monthly} per location per month, or $${starter.monthly * 10} per year. Includes up to 150 SDSs and 25 AI scans per month.`,
        `Pro: $${pro.monthly} per location per month, or $${pro.monthly * 10} per year. Includes unlimited SDSs and unlimited AI scans under a fair-use policy covering your location's own documents.`,
      ],
      "Prices are in US dollars and exclude applicable sales, use, VAT or similar taxes, which are added to your invoice where we are required to collect them; you are responsible for any other taxes that apply to your purchase. Your bank may show the charge in your local currency and apply its own exchange rate. Subscriptions are billed in advance and renew automatically at the end of each monthly or annual period until cancelled. Payments are processed by Stripe; we never see or store your full card number.",
      "We may change prices with at least 30 days' notice by email. Changes apply from your next renewal after the notice period.",
    ],
  },
  {
    title: "Cancellation and refunds",
    body: [
      "You can cancel at any time from Billing in your dashboard. Cancellation takes effect at the end of the current paid period; you keep full access until then and are not charged again.",
      "Fees already paid are non-refundable, including for partially used periods, except where a refund is required by law. If you were charged in error, contact us within 30 days and we will refund the erroneous charge.",
      "After a subscription or trial ends, your library is kept and stays readable by owners and admins, but adding new SDSs requires an active plan. Your team's QR access keeps working for 14 days after the end date, then pauses until you choose a plan again; scanning the poster then shows that access is paused.",
      "Keeping Safety Data Sheets accessible to your employees remains your responsibility under OSHA's Hazard Communication Standard. Before cancelling, or before access pauses, make sure your team has another way to reach them.",
    ],
  },
  {
    title: "Acceptable use",
    body: [
      [
        "Upload only Safety Data Sheets, product labels and related documents you are entitled to use.",
        "Do not upload patient information or other protected health information (PHI) — the service is not designed to store it, and we do not act as a HIPAA business associate.",
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
    title: "Governing law and disputes",
    body: [
      "These terms are governed by the substantive laws of Switzerland, excluding its conflict-of-law rules and the United Nations Convention on Contracts for the International Sale of Goods (CISG).",
      `Before starting any proceedings, please email us at ${siteConfig.contactEmail} so we can try to resolve the issue informally within 30 days. If we cannot, the courts at our registered office in ${siteConfig.legalSeat} have exclusive jurisdiction, subject to any mandatory law that provides otherwise.`,
    ],
  },
  {
    title: "General",
    body: [
      [
        "These terms and the Privacy Policy are the entire agreement between you and us about the service.",
        "If a provision is found unenforceable, the rest of the terms remain in effect.",
        "We are not liable for delays or failures caused by events beyond our reasonable control (for example outages of internet or hosting providers).",
        "You may not transfer your account without our consent; we may transfer these terms as part of a reorganization or sale of the business, with notice to you.",
        "Notices are sent by email: ours to the clinic owner's email address, yours to our contact address.",
        "These terms are written in English; any translation is for convenience only.",
      ],
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
