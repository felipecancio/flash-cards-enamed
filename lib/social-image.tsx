import { site } from "@/config/site";
import { ImageResponse } from "next/og";

export const socialSize = {
  width: 1200,
  height: 630,
};

export const socialContentType = "image/png";

export function createSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c2340",
          color: "#ffffff",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div style={{ display: "flex", fontSize: 64, lineHeight: 1.12, letterSpacing: -1 }}>
            {site.name}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 32, lineHeight: 1.35, color: "#d5dde6" }}>
            {site.hero.title}
          </div>
        </div>
        <div style={{ display: "flex", width: 180, height: 8, background: "#1a6848" }} />
      </div>
    ),
    { ...socialSize },
  );
}
