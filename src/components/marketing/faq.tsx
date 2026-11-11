import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ANNUAL_DISCOUNT_PERCENT, getPlan } from "@/config/pricing";
import { siteConfig } from "@/config/site";

const FAQ = [
  {
    q: "Does OSHA allow electronic SDS access instead of a paper binder?",
    a: "Yes. 29 CFR 1910.1200(g)(8) permits electronic access instead of paper copies, as long as it creates no barriers to immediate employee access in each workplace. QR codes posted in each operatory, lab or supply room, with no login required to view, are designed for exactly that.",
  },
  {
    q: "What does the HazCom 2024 update change for us?",
    a: "OSHA's updated Hazard Communication Standard aligns with a newer revision of the GHS, so manufacturers and distributors are reissuing SDSs and labels on a phased schedule. As updated sheets arrive, employers need to keep their library, labels and training current. HazLedger flags SDSs older than five years when you scan them; automatic supplier revision alerts are on the roadmap.",
  },
  {
    q: "Do my hygienists, assistants and vet techs need an account?",
    a: "No. Anyone in the room can scan the QR code and view the SDSs for that room. Accounts are only for the people who manage the library — usually the practice owner or office manager.",
  },
  {
    q: "What happens to our existing binders?",
    a: "On the Pro plan, we import your existing binder for you. On Starter, snap each SDS or upload the PDF — each takes about 30 seconds to extract.",
  },
  {
    q: "How is our data protected?",
    a: "Data is encrypted in transit and at rest and hosted in US data centers. Every edit is recorded in an audit trail, and access is controlled by role.",
  },
  {
    q: "How long is the trial, and what happens after?",
    a: `${siteConfig.trialDays} days with every feature, no credit card. Then choose Starter ($${getPlan("starter").monthly}) or Pro ($${getPlan("pro").monthly}) per location per month, or save ${ANNUAL_DISCOUNT_PERCENT}% with annual billing. Cancel anytime.`,
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions practice managers ask us."
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
