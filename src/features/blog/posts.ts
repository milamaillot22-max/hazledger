/**
 * Blog content. Every regulatory statement links to a primary or reputable
 * source in `sources`. Review dates and figures before republishing.
 */

import type { StaticImageData } from "next/image";

import procedureRoomPhoto from "@/assets/images/clinic-procedure-room.webp";
import receptionPhoto from "@/assets/images/clinic-reception.webp";
import waitingRoomPhoto from "@/assets/images/clinic-window-room.webp";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type Post = {
  slug: string;
  title: string;
  description: string;
  category: "Regulation" | "Inspections" | "Penalties";
  publishedAt: string;
  readingMinutes: number;
  cover: StaticImageData;
  coverAlt: string;
  keywords: string[];
  blocks: Block[];
  sources: { label: string; url: string }[];
};

export const POSTS: Post[] = [
  {
    slug: "hazcom-2024-compliance-deadlines",
    title: "HazCom 2024 deadlines: what dental, veterinary and medical practices must do — and when",
    description:
      "OSHA's updated Hazard Communication Standard is phasing in. The employer deadline for substances is November 20, 2026. Here is the full timeline and a practical checklist.",
    category: "Regulation",
    publishedAt: "2026-11-11",
    readingMinutes: 6,
    cover: procedureRoomPhoto,
    coverAlt: "Bright procedure room with light wood floor and built-in storage",
    keywords: ["HazCom 2024", "OSHA hazard communication deadline", "HCS 2024 compliance dates", "GHS Revision 7"],
    blocks: [
      {
        type: "p",
        text: "OSHA's revised Hazard Communication Standard (HCS 2024) took effect on July 19, 2024. It aligns the US rule with Revision 7 of the Globally Harmonized System (GHS) and phases in new obligations — first for chemical manufacturers, importers and distributors, then for the employers who use their products. Dental, veterinary and medical practices are in the second group.",
      },
      {
        type: "callout",
        title: "The date that matters now",
        text: "In January 2026 OSHA extended every HCS 2024 compliance date by four months (91 FR 1695). For substances, employers must update workplace labeling, their written hazard communication program and employee training for newly identified hazards by November 20, 2026.",
      },
      { type: "h2", text: "The full timeline (after the January 2026 extension)" },
      {
        type: "table",
        head: ["Deadline", "Who", "What"],
        rows: [
          ["May 19, 2026", "Manufacturers, importers, distributors", "Substances: updated SDSs and shipped-container labels"],
          ["Nov 20, 2026", "Employers", "Substances: workplace labeling, written program and training updates"],
          ["Nov 19, 2027", "Manufacturers, importers, distributors", "Mixtures: updated SDSs and shipped-container labels"],
          ["May 19, 2028", "Employers", "Mixtures: workplace labeling, written program and training updates"],
        ],
      },
      {
        type: "p",
        text: "Most products a clinic stocks — disinfectants, etchants, sterilants, fixatives — are mixtures, so many updated SDSs will keep arriving through 2027. The practical consequence: your SDS library is not a one-time project this cycle. Expect new revisions from suppliers and plan to swap them in as they arrive.",
      },
      { type: "h2", text: "What changed in HCS 2024" },
      {
        type: "ul",
        items: [
          "Alignment with GHS Revision 7, including updated hazard classification criteria.",
          "Small-container labeling relief: containers of 100 mL or less may carry abbreviated labels when the full label appears on the immediate outer package; containers of 3 mL or less may show only the product identifier when a label would interfere with normal use.",
          "New provisions on concentration ranges when manufacturers claim a composition as a trade secret.",
        ],
      },
      { type: "h2", text: "A practical checklist for practices" },
      {
        type: "ul",
        items: [
          "Inventory every hazardous product in operatories, labs, sterilization, surgery and storage.",
          "Request current SDSs from suppliers for anything with a revision date before 2024, and file new revisions as they arrive.",
          "Re-label secondary containers (spray bottles, decanted disinfectants) with the product identifier and hazard information.",
          "Update your written hazard communication program: chemical list, labeling method, SDS access, training.",
          "Train staff on any newly identified hazards and document it.",
          "Keep SDSs readily accessible to employees on every shift — electronic access is allowed when it creates no barriers (1910.1200(g)(8)).",
        ],
      },
      {
        type: "callout",
        title: "State Plan states",
        text: "If you operate in a State Plan state (for example California, Washington or Oregon), your state must adopt standards at least as effective as federal OSHA's and may set its own dates. Check with your state program.",
      },
    ],
    sources: [
      { label: "Federal Register — HCS compliance date extension, 91 FR 1695 (Jan 15, 2026)", url: "https://www.govinfo.gov/content/pkg/FR-2026-01-15/html/2026-00653.htm" },
      { label: "OSHA — HCS 2024 compliance date extension notice", url: "https://www.osha.gov/hazcom/rulemaking/extension" },
      { label: "OSHA — 29 CFR 1910.1200 Hazard Communication", url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200" },
    ],
  },
  {
    slug: "osha-hazcom-inspection-checklist",
    title: "What an OSHA inspector checks in a HazCom review: a checklist for clinics",
    description:
      "Written program, labels, Safety Data Sheets, access on every shift and training — the five things an inspector looks at under 29 CFR 1910.1200, explained for healthcare practices.",
    category: "Inspections",
    publishedAt: "2026-11-11",
    readingMinutes: 7,
    cover: receptionPhoto,
    coverAlt: "Bright dental practice reception with light wood floors",
    keywords: ["OSHA inspection dental office", "HazCom checklist", "SDS requirements clinic", "1910.1200 checklist"],
    blocks: [
      {
        type: "p",
        text: "Hazard Communication is consistently among OSHA's most frequently cited standards. In healthcare practices, the gaps are rarely dramatic: a binder that hasn't been touched in years, a spray bottle with no label, a new assistant who was never shown where the SDSs are. Here is what an inspector reviews, requirement by requirement.",
      },
      { type: "h2", text: "1. A written hazard communication program — 1910.1200(e)(1)" },
      {
        type: "p",
        text: "You need a written program that describes how you meet the labeling, SDS and training requirements, and that includes a list of the hazardous chemicals known to be present. The list should match what is actually on your shelves, and the product identifiers should match the SDSs.",
      },
      { type: "h2", text: "2. Workplace labels — 1910.1200(f)(6)" },
      {
        type: "p",
        text: "Original containers keep the manufacturer's label. Secondary containers — the disinfectant you decant into a spray bottle, the solution in an ultrasonic cleaner — need the product identifier and the hazards, either in full or through an alternative system your staff are trained on.",
      },
      { type: "h2", text: "3. An SDS for every hazardous chemical — 1910.1200(g)(1)" },
      {
        type: "p",
        text: "Every hazardous chemical in the workplace needs a current Safety Data Sheet. Some products are exempt — for example, drugs in solid, final form for direct administration to the patient, and consumer products used in the same way and at the same frequency as a consumer would use them. When in doubt, keep the SDS.",
      },
      { type: "h2", text: "4. Ready access on every shift — 1910.1200(g)(8)" },
      {
        type: "p",
        text: "SDSs must be readily accessible to employees in their work area during each work shift. Electronic access is allowed when it creates no barriers to immediate access — no login an assistant doesn't have, no single computer in a locked office. Inspectors may ask a staff member to find a specific SDS.",
      },
      { type: "h2", text: "5. Training — 1910.1200(h)(1)" },
      {
        type: "p",
        text: "Employees must be trained at the time of their initial assignment and whenever a new chemical hazard is introduced. Training covers how to detect releases, the physical and health hazards, protective measures, and how to read labels and SDSs. Keep records of who was trained and when.",
      },
      {
        type: "callout",
        title: "Quick self-audit",
        text: "Pick three products at random. Can a staff member find each SDS in under a minute, on the shift they work? Does each secondary container carry a label? Is each product on your written chemical list? If any answer is no, that is where an inspector would start.",
      },
      { type: "h2", text: "The checklist" },
      {
        type: "ul",
        items: [
          "Written program on file, with a current chemical list",
          "Every container labeled, including secondary containers",
          "A current SDS for every hazardous product",
          "SDSs reachable by every employee on every shift",
          "Training at hire and when new hazards are introduced, documented",
        ],
      },
    ],
    sources: [
      { label: "OSHA — 29 CFR 1910.1200 Hazard Communication", url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1200" },
      { label: "OSHA — Hazard Communication overview", url: "https://www.osha.gov/hazcom" },
    ],
  },
  {
    slug: "osha-penalties-2026-healthcare-practices",
    title: "OSHA penalties in 2026: what a HazCom citation can cost a small practice",
    description:
      "Maximum OSHA penalties did not increase in 2026. Here are the current figures, how size reductions work for practices with fewer than 25 employees, and a worked example.",
    category: "Penalties",
    publishedAt: "2026-11-11",
    readingMinutes: 5,
    cover: waitingRoomPhoto,
    coverAlt: "Calm treatment room with light wood cabinetry and a large window",
    keywords: ["OSHA penalties 2026", "OSHA fine dental office", "HazCom citation cost", "OSHA small business penalty reduction"],
    blocks: [
      {
        type: "p",
        text: "OSHA adjusts its maximum civil penalties for inflation every January — except in 2026. In a May 21, 2026 memo, OSHA confirmed there would be no inflation adjustment this year, so the 2025 maximums remain in effect.",
      },
      {
        type: "table",
        head: ["Violation type", "Maximum penalty (2026)"],
        rows: [
          ["Serious", "$16,550 per violation"],
          ["Other-than-serious", "$16,550 per violation"],
          ["Failure to abate", "$16,550 per day beyond the abatement date"],
          ["Willful or repeated", "$165,514 per violation"],
        ],
      },
      { type: "h2", text: "Size reductions for small practices" },
      {
        type: "p",
        text: "OSHA's Field Operations Manual allows penalty reductions based on employer size, counted across all of the employer's US workplaces. Since the July 2025 revision, the maximum reduction is 70% for employers with 1 to 25 employees, 30% for 26 to 100, and 10% for 101 to 250. Employers above 250 receive no size reduction. Gravity, good faith and inspection history also affect the final amount.",
      },
      { type: "h2", text: "A worked example" },
      {
        type: "p",
        text: "A dental practice with 12 employees is cited for a serious HazCom violation assessed at the maximum gravity. After the maximum 70% size reduction, the penalty would be about $4,965. If the inspector cites several separate requirements — say, missing SDSs, unlabeled secondary containers and no documented training — each item can carry its own penalty.",
      },
      {
        type: "callout",
        title: "The cost that isn't on the citation",
        text: "Abatement takes staff time too: rebuilding the binder, relabeling containers, retraining — often during clinic hours. Prevention is almost always cheaper than correction.",
      },
      {
        type: "p",
        text: "State Plan states run their own programs and may use different penalty structures; check your state's figures if you operate in one.",
      },
    ],
    sources: [
      { label: "OSHA — 2026 annual adjustments to OSHA civil penalties (memo, May 21, 2026)", url: "https://www.osha.gov/memos/2026-05-21/2026-annual-adjustments-osha-civil-penalties" },
      { label: "US Department of Labor — OSHA penalty reductions for small businesses (July 14, 2025)", url: "https://www.dol.gov/newsroom/releases/osha/osha20250714" },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
