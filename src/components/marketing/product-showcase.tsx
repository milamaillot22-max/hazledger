import { ProductPreview } from "@/components/marketing/product-preview";
import { SectionHeading } from "@/components/marketing/section-heading";

export function ProductShowcase() {
  return (
    <section id="product" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        align="center"
        eyebrow="Your SDS library"
        title="Every chemical in your practice, in one inspection-ready place."
        description="Disinfectants, etchants, fixatives, anesthetic gases — reviewed by you, searchable by your team, and flagged when a revision is old or a field needs a second look."
      />
      <div className="mx-auto mt-14 max-w-5xl">
        <ProductPreview />
      </div>
    </section>
  );
}
