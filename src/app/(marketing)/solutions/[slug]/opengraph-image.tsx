import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { getSolution, SOLUTIONS } from "@/features/solutions/data";

export const alt = `${siteConfig.name} — OSHA HazCom compliance`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSolution(slug);
  const eyebrow = s?.eyebrow ?? "OSHA HazCom compliance";
  const title = s ? `${s.title} ${s.titleAccent}` : siteConfig.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 55%, #ecfdf5 100%)",
          color: "#0f172a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 30, fontWeight: 700 }}>
            H
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignSelf: "flex-start", padding: "8px 18px", borderRadius: 999, background: "#ecfdf5", color: "#047857", fontSize: 24, fontWeight: 600 }}>
            {eyebrow}
          </div>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>{title}</div>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#475569" }}>
          <span>OSHA HazCom · 29 CFR 1910.1200</span>
          <span>·</span>
          <span>{siteConfig.trialDays}-day free trial · Cancel anytime</span>
        </div>
      </div>
    ),
    size
  );
}
