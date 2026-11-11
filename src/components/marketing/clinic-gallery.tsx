import Image, { type StaticImageData } from "next/image";

import supplyRoomPhoto from "@/assets/images/clinic-supply-room.webp";
import dentalTeamPhoto from "@/assets/images/team-dental-xray.webp";
import vetUltrasoundPhoto from "@/assets/images/vet-ultrasound.webp";
import { SectionHeading } from "@/components/marketing/section-heading";
import { cn } from "@/lib/utils";

type Tile = { photo: StaticImageData; alt: string; room: string; caption: string; className: string; sizes: string };

const TILES: Tile[] = [
  {
    photo: supplyRoomPhoto,
    alt: "Organized clinic supply and procedure room with labeled storage",
    room: "Supply & lab",
    caption: "Reagents, sterilants and cleaners, each with a current SDS.",
    className: "md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto",
    sizes: "(min-width: 768px) 760px, 100vw",
  },
  {
    photo: dentalTeamPhoto,
    alt: "Dental hygienist reviewing an X-ray on a tablet with a patient",
    room: "Operatory",
    caption: "Etchants, bonding agents and disinfectants mapped to the chair.",
    className: "aspect-[4/3]",
    sizes: "(min-width: 768px) 370px, 100vw",
  },
  {
    photo: vetUltrasoundPhoto,
    alt: "Veterinary team performing an ultrasound on a small dog",
    room: "Treatment room",
    caption: "Anesthetic gases and lab reagents, one scan away for every tech.",
    className: "aspect-[4/3]",
    sizes: "(min-width: 768px) 370px, 100vw",
  },
];

/** Photo mosaic of real clinic rooms — where the chemicals (and the QR poster) live. */
export function ClinicGallery({ className }: { className?: string }) {
  return (
    <section aria-labelledby="clinic-gallery-title" className={cn("mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24", className)}>
      <SectionHeading
        id="clinic-gallery-title"
        eyebrow="Built for real practices"
        title="Every room where chemicals live — covered."
        description="From the operatory to the supply closet, your team finds the right Safety Data Sheet with one scan of the poster on the wall."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
        {TILES.map((t) => (
          <figure key={t.room} className={cn("group relative overflow-hidden rounded-3xl ring-1 ring-slate-200/70", t.className)}>
            <Image
              src={t.photo}
              alt={t.alt}
              fill
              placeholder="blur"
              sizes={t.sizes}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/5 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <span className="inline-flex rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800 backdrop-blur">
                {t.room}
              </span>
              <p className="mt-2 max-w-sm text-[14px] leading-snug font-medium text-white">{t.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
