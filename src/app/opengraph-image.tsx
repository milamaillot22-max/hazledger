import { ImageResponse } from "next/og";

import { OSHA_PENALTIES } from "@/config/compliance";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default share image for every route without its own (home, sign-up…). */
export default function Image() {
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
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#0284c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            H
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>
            OSHA Compliance Isn&apos;t Optional.
          </div>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5, color: "#0284c7" }}>
            Stay Inspection-Ready, Every Day.
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 24, color: "#475569" }}>
          <span>SDS management for US dental, veterinary &amp; medical practices</span>
          <span>·</span>
          <span>Serious citations up to ${OSHA_PENALTIES.seriousMax.toLocaleString("en-US")}</span>
        </div>
      </div>
    ),
    size
  );
}
