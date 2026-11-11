import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight, Hand, MapPin, PawPrint } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import dentalPhoto from "@/assets/images/specialty-dental.webp";
import dermatologyPhoto from "@/assets/images/specialty-dermatology.webp";
import veterinaryPhoto from "@/assets/images/specialty-veterinary.webp";
import { Tooth } from "@/components/icons/tooth";
import { SectionHeading } from "@/components/marketing/section-heading";
import { routes } from "@/config/site";

type Specialty = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  photo: StaticImageData;
  alt: string;
  clinic: string;
  location: string;
  body: string;
  chemicals: string[];
  slug: string;
};

const SPECIALTIES: Specialty[] = [
  {
    icon: Tooth,
    title: "Dental practices",
    photo: dentalPhoto,
    alt: "Dentist and dental assistant treating a patient",
    clinic: "Sunset Family Dental",
    location: "San Diego, CA",
    body: "Operatories, sterilization and lab — every product mapped to the room where it's used.",
    chemicals: ["Etchants", "Bonding agents", "Glutaraldehyde", "Surface disinfectants"],
    slug: "dental-compliance",
  },
  {
    icon: PawPrint,
    title: "Veterinary clinics",
    photo: veterinaryPhoto,
    alt: "Veterinarian examining a dog during a checkup",
    clinic: "Metro Vet Clinic",
    location: "Austin, TX",
    body: "Surgery suite, kennels and in-house lab covered, including anesthetic gases.",
    chemicals: ["Isoflurane", "Formalin", "Kennel disinfectants", "Lab reagents"],
    slug: "veterinary-safety",
  },
  {
    icon: Hand,
    title: "Dermatology & med spas",
    photo: dermatologyPhoto,
    alt: "Dermatologist examining skin with a digital dermatoscope",
    clinic: "Clearview Dermatology",
    location: "Miami, FL",
    body: "Procedure rooms and biopsy prep, with peel and cryotherapy products tracked.",
    chemicals: ["Liquid nitrogen", "Formalin", "TCA peels", "Hand antiseptics"],
    slug: "medical-clinics",
  },
];

export function Specialties() {
  return (
    <section id="specialties" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Built for your specialty"
        title="Made for the chemicals your practice actually uses."
        description="Built around the products your specialty actually stocks — scan what's on your shelves and you're covered."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {SPECIALTIES.map(({ icon: Icon, ...s }) => (
          <article
            key={s.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50 transition-shadow hover:shadow-xl hover:shadow-slate-200/70"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={s.photo}
                alt={s.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 360px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-xl bg-white/95 text-primary shadow-sm">
                <Icon className="size-5" />
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="size-3" />
                e.g. {s.clinic} · {s.location}
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{s.body}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Typical chemicals on file">
                {s.chemicals.map((c) => (
                  <li
                    key={c}
                    className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-sky-800 ring-1 ring-sky-100"
                  >
                    {c}
                  </li>
                ))}
              </ul>
              <Link
                href={routes.solution(s.slug)}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary after:absolute after:inset-0 hover:underline"
              >
                See how it works for {s.title.toLowerCase()}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
