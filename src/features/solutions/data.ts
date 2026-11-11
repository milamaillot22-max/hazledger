import type { StaticImageData } from "next/image";

import dentalChairPhoto from "@/assets/images/clinic-dental-chair.webp";
import supplyRoomPhoto from "@/assets/images/clinic-supply-room.webp";
import dentalPhoto from "@/assets/images/specialty-dental.webp";
import medicalPhoto from "@/assets/images/specialty-medical.webp";
import veterinaryPhoto from "@/assets/images/specialty-veterinary.webp";
import vetUltrasoundPhoto from "@/assets/images/vet-ultrasound.webp";
import type { Sector } from "@/features/roi/calculator";

export type Solution = {
  slug: string;
  sector: Sector;
  /** Short label for links and breadcrumbs. */
  name: string;
  audience: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  photo: StaticImageData;
  photoAlt: string;
  /** Second, in-context photo shown next to the chemical list. */
  scenePhoto: StaticImageData;
  sceneAlt: string;
  pains: { title: string; body: string }[];
  chemicalsIntro: string;
  chemicals: { name: string; note: string }[];
  rooms: string[];
  faq: { q: string; a: string }[];
  /** ISO date of the last content review (sitemap lastModified). */
  updatedAt: string;
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "dental-compliance",
    sector: "dental",
    name: "Dental practices",
    audience: "Dental practices",
    metaTitle: "Dental OSHA Compliance Software — SDS Management for Dental Practices",
    metaDescription:
      "Keep every dental SDS current and accessible in each operatory. Scan etchants, bonding resins, amalgam and disinfectants, post one QR code, stay inspection-ready.",
    keywords: [
      "dental OSHA compliance",
      "dental SDS management",
      "dental hazard communication",
      "OSHA HazCom dental office",
      "dental safety data sheets",
    ],
    eyebrow: "For dental practices",
    title: "OSHA HazCom for dental practices,",
    titleAccent: "without the binder in the sterilization room.",
    intro:
      "Etchants, bonding resins, amalgam, sterilants and surface disinfectants — every product in your operatories needs a current Safety Data Sheet your team can reach on every shift. HazLedger scans them, keeps them current and puts them one QR scan away.",
    photo: dentalPhoto,
    photoAlt: "Dentist and dental assistant treating a patient in a modern operatory",
    scenePhoto: dentalChairPhoto,
    sceneAlt: "Bright, modern dental treatment room",
    pains: [
      {
        title: "Dozens of products, constant reorders",
        body: "Every new supplier or reformulated product brings a new SDS. Keeping the binder in sync with what's actually in the operatories is a part-time job nobody owns.",
      },
      {
        title: "Suppliers are reissuing SDSs",
        body: "OSHA's HazCom 2024 update has manufacturers revising SDSs and labels on a phased schedule. An outdated sheet in the binder is a citable gap.",
      },
      {
        title: "Hygienists need answers in seconds",
        body: "An etchant splash or a sterilant spill can't wait for someone to find the binder. The SDS must be readily accessible in the work area, on every shift.",
      },
    ],
    chemicalsIntro: "What dental teams scan first",
    chemicals: [
      { name: "Phosphoric acid etchants", note: "Corrosive — first-aid steps matter in the operatory." },
      { name: "Bonding agents & methacrylate resins", note: "Common skin sensitizers; PPE guidance in Section 8." },
      { name: "Dental amalgam", note: "Contains mercury; storage and spill procedures." },
      { name: "Glutaraldehyde & high-level disinfectants", note: "Toxic by inhalation; ventilation requirements." },
      { name: "Surface disinfectants & wipes", note: "Often alcohol-based and flammable." },
      { name: "Nitrous oxide & oxygen", note: "Compressed gases with their own SDS." },
      {
        name: "Local anesthetics",
        note: "Check each product: HazCom exempts drugs in solid, final form for direct patient administration.",
      },
      { name: "X-ray developer & fixer", note: "For practices still processing film." },
    ],
    rooms: ["Operatories", "Sterilization area", "Lab", "Supply closet"],
    faq: [
      {
        q: "Does OSHA's Hazard Communication Standard apply to dental offices?",
        a: "Yes. Dental practices with employees who may be exposed to hazardous chemicals must keep a written hazard communication program, an SDS for each hazardous chemical, proper labels and employee training under 29 CFR 1910.1200.",
      },
      {
        q: "Can our SDSs be digital instead of a binder?",
        a: "Yes. 29 CFR 1910.1200(g)(8) allows electronic access as long as it creates no barriers to immediate employee access in each workplace. A QR code in each operatory with no login required is built for exactly that.",
      },
      {
        q: "Do we need SDSs for local anesthetics?",
        a: "It depends on the product. HazCom exempts drugs in solid, final form for direct administration to the patient. Liquids and other forms may still require an SDS — scan what your supplier provides and keep it on file.",
      },
      {
        q: "How long does setup take for a typical practice?",
        a: "Most of the work is scanning what's on your shelves. Each SDS takes about 30 seconds to extract and a quick review to confirm; your team QR poster is ready to print the moment your clinic is created.",
      },
    ],
    updatedAt: "2026-11-11",
  },
  {
    slug: "veterinary-safety",
    sector: "veterinary",
    name: "Veterinary practices",
    audience: "Veterinary practices",
    metaTitle: "Veterinary OSHA Compliance Software — SDS & Chemical Safety for Vet Clinics",
    metaDescription:
      "SDS management built for veterinary clinics: anesthetic gases, formalin, radiology chemicals and kennel disinfectants, reviewed and one QR scan away for every tech.",
    keywords: [
      "veterinary OSHA compliance",
      "veterinary SDS management",
      "vet clinic hazard communication",
      "isoflurane SDS",
      "veterinary chemical safety",
    ],
    eyebrow: "For veterinary practices",
    title: "Chemical safety for veterinary teams,",
    titleAccent: "from the surgery suite to the kennels.",
    intro:
      "Anesthetic gases, formalin, radiology chemicals, lab reagents and the disinfectants used in every run — veterinary clinics handle more hazardous products than most medical offices. HazLedger keeps every SDS reviewed and one QR scan away for every tech.",
    photo: veterinaryPhoto,
    photoAlt: "Veterinarian examining a dog during a checkup",
    scenePhoto: vetUltrasoundPhoto,
    sceneAlt: "Veterinary team performing an ultrasound on a small dog",
    pains: [
      {
        title: "More products than most clinics",
        body: "Surgery, in-house lab, imaging, pharmacy and kennels each bring their own chemicals — and their own SDSs to collect and update.",
      },
      {
        title: "Anesthetic gas exposure is real",
        body: "Isoflurane and sevoflurane SDSs carry exposure and ventilation guidance your techs need to know where they actually work.",
      },
      {
        title: "Night and weekend shifts",
        body: "Emergency and boarding staff need the same access as the day team. A QR poster in each area works at 3 a.m. without anyone's login.",
      },
    ],
    chemicalsIntro: "What veterinary teams scan first",
    chemicals: [
      { name: "Isoflurane & sevoflurane", note: "Anesthetic gases; exposure limits and ventilation." },
      { name: "Oxygen & other compressed gases", note: "Cylinder storage and handling." },
      { name: "Formalin", note: "Biopsy and histology fixative; respiratory hazard." },
      { name: "Kennel disinfectants", note: "Bleach, accelerated hydrogen peroxide, quaternary ammonium." },
      { name: "Radiology chemicals", note: "Developer and fixer for film-based imaging." },
      { name: "In-house lab reagents & stains", note: "Often methanol-based and flammable." },
    ],
    rooms: ["Surgery suite", "Treatment area", "In-house lab", "Kennels & runs"],
    faq: [
      {
        q: "Does OSHA HazCom apply to veterinary clinics?",
        a: "Yes. Veterinary practices are general industry employers under OSHA. If your employees can be exposed to hazardous chemicals, 29 CFR 1910.1200 requires a written program, SDSs, labels and training.",
      },
      {
        q: "Is a QR code an acceptable way to provide SDS access?",
        a: "OSHA permits electronic access when there are no barriers to immediate employee access in each workplace (1910.1200(g)(8)). HazLedger's staff view requires no app and no login.",
      },
      {
        q: "Can staff find SDSs quickly in each area?",
        a: "Yes. Post the team QR poster in the surgery suite, lab, imaging and kennels; staff search by product name and see first aid first. Per-room product mapping is on our roadmap.",
      },
      {
        q: "What if we only have the label, not the SDS?",
        a: "Scan the label to capture the hazards immediately. HazLedger flags the record so you can request the full 16-section SDS from the manufacturer.",
      },
    ],
    updatedAt: "2026-11-11",
  },
  {
    slug: "medical-clinics",
    sector: "medical",
    name: "Medical clinics & ASCs",
    audience: "Medical clinics, laboratories and ambulatory surgery centers",
    metaTitle: "OSHA HazCom Software for Medical Clinics, Labs & Ambulatory Surgery Centers",
    metaDescription:
      "SDS management for medical clinics, physician-office labs and ambulatory surgery centers. Keep sterilants, fixatives, lab reagents and cryogens documented and inspection-ready.",
    keywords: [
      "medical clinic OSHA compliance",
      "ambulatory surgery center OSHA",
      "physician office lab SDS",
      "healthcare hazard communication software",
      "SDS management for clinics",
    ],
    eyebrow: "For medical clinics & surgery centers",
    title: "Hazard communication for clinics, labs",
    titleAccent: "and ambulatory surgery centers.",
    intro:
      "Sterilants, fixatives, lab reagents, cryogens and hand antiseptics move through procedure rooms, labs and reprocessing areas every day. HazLedger gives every location one current SDS library and every employee instant access.",
    photo: medicalPhoto,
    photoAlt: "Two clinicians reviewing information on a tablet",
    scenePhoto: supplyRoomPhoto,
    sceneAlt: "Organized clinic supply and procedure room with labeled storage",
    pains: [
      {
        title: "Multiple departments, one standard",
        body: "Procedure rooms, the lab and sterile processing each keep their own products. One library with room mapping replaces scattered binders.",
      },
      {
        title: "High-level disinfectants and fixatives",
        body: "Glutaraldehyde, OPA and formalin are among the most hazardous products in a clinic — their SDSs need to be current and easy to reach.",
      },
      {
        title: "Every location, its own library",
        body: "Each site stocks different products. A separate, current library per location keeps every site's poster accurate.",
      },
    ],
    chemicalsIntro: "What clinics and ASCs scan first",
    chemicals: [
      { name: "Glutaraldehyde & ortho-phthalaldehyde (OPA)", note: "High-level disinfectants for scope reprocessing." },
      { name: "Hydrogen peroxide sterilants", note: "Oxidizers used in low-temperature sterilization." },
      { name: "Formalin", note: "Specimen fixative in procedure rooms and labs." },
      { name: "Lab reagents & stains", note: "Physician-office and in-house laboratory testing." },
      { name: "Liquid nitrogen", note: "Cryotherapy; cold burns and asphyxiation hazards." },
      { name: "Alcohol-based hand rubs", note: "Flammable — storage quantities matter." },
    ],
    rooms: ["Procedure rooms", "Laboratory", "Sterile processing", "Storage"],
    faq: [
      {
        q: "Which OSHA standard covers chemicals in a medical clinic?",
        a: "The Hazard Communication Standard, 29 CFR 1910.1200, covers hazardous chemicals in the workplace. Laboratories may also fall under 29 CFR 1910.1450 for laboratory chemical hygiene; HazLedger keeps the SDSs both rely on.",
      },
      {
        q: "Does HazLedger work for multiple locations?",
        a: "Each location is set up as its own clinic with its own library and QR poster, priced per location. A multi-location dashboard is on our roadmap — contact us for groups and DSOs.",
      },
      {
        q: "How do staff access SDSs during an exposure?",
        a: "They scan the QR poster with any phone camera. First-aid measures, spill response and PPE appear first — no app or login.",
      },
      {
        q: "Is our data secure?",
        a: "Files are stored privately per clinic, encrypted in transit and at rest, and only confirmed SDSs are visible on the staff view.",
      },
    ],
    updatedAt: "2026-11-11",
  },
];

export function getSolution(slug: string) {
  return SOLUTIONS.find((s) => s.slug === slug);
}
