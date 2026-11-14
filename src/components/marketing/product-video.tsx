import { SectionHeading } from "@/components/marketing/section-heading";

/**
 * 40-second product tour, self-hosted (no third-party player, no cookies).
 * preload="none": nothing downloads until the visitor presses play.
 */
export function ProductVideo() {
  return (
    <section id="tour" aria-labelledby="tour-title" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <SectionHeading
        id="tour-title"
        align="center"
        eyebrow="40-second tour"
        title="See HazLedger in action."
        description="From a label photo to an inspection-ready library and a QR poster your whole team can use."
      />
      <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl bg-white p-2 shadow-2xl shadow-sky-900/10 ring-1 ring-slate-200/80 sm:p-3">
        <video
          className="aspect-video w-full rounded-2xl bg-slate-100"
          controls
          playsInline
          preload="none"
          poster="/videos/hazledger-demo-poster.jpg"
          aria-label="HazLedger product tour: scan a label or PDF, review the extracted SDS, share it with your team through one QR poster, one plan with everything included."
        >
          <source src="/videos/hazledger-demo.mp4" type="video/mp4" />
          Your browser can&apos;t play this video.
        </video>
      </div>
    </section>
  );
}
