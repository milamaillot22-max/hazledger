import { Footer } from "@/components/marketing/footer";
import { MobileCta } from "@/components/marketing/mobile-cta";
import { Navbar } from "@/components/marketing/navbar";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileCta />
    </>
  );
}
