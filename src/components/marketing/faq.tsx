import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/marketing/section-heading";
import { siteConfig } from "@/config/site";

const FAQ = [
  {
    q: "Is electronic SDS access OSHA-compliant?",
    a: "Yes. 29 CFR 1910.1200(g)(8) permits electronic access instead of paper copies, as long as it creates no barriers to immediate employee access in each workplace. QR codes posted in each work area, with no login required to view, are designed for exactly that.",
  },
  {
    q: "What does the HazCom 2024 update change for us?",
    a: "OSHA's updated Hazard Communication Standard aligns with a newer revision of the GHS, so manufacturers and distributors are reissuing SDSs and labels on a phased schedule. As updated sheets arrive, employers need to keep their library, labels and training current — revision alerts flag every product that needs attention.",
  },
  {
    q: "Do employees need an account?",
    a: "No. Anyone in the work area can scan a QR code and view the SDSs for that area. Accounts are only for the people who manage the library.",
  },
  {
    q: "What happens to our existing binders?",
    a: "Send us scans, PDFs or the binders' supplier list. We bulk-import and extract them for you during onboarding, free of charge.",
  },
  {
    q: "How is our data protected?",
    a: "Data is encrypted in transit and at rest and hosted in US data centers. Every edit is recorded in an audit trail, and access is controlled by role.",
  },
  {
    q: "How long is the trial, and what happens after?",
    a: `${siteConfig.trialDays} days with every feature, no credit card. Keep going on a flat per-location plan, month to month — or export everything and leave.`,
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions safety managers ask us."
          description={
            <>
              Something else?{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
            </>
          }
        />
        <Accordion type="single" collapsible className="border-t border-border">
          {FAQ.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`} className="border-b border-border">
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-foreground hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
