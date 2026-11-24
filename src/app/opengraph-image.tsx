export const dynamic = "force-static";
import { ImageResponse } from "next/og";
import { hero } from "@/content/sv";

export const alt = "Proptex – hela huset i en 3D-modell du kan klicka i";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#071426",
        color: "#F6F2EA",
        padding: 72,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", fontSize: 34, letterSpacing: -1 }}>
        Proptex<span style={{ color: "#E58A5B" }}>.</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 84,
            lineHeight: 1.02,
            letterSpacing: -3,
            maxWidth: 700,
          }}
        >
          <span>{hero.titleLines[0]}</span>
          <span>{hero.titleLines[1]}</span>
        </div>
        <svg width="330" height="240" viewBox="0 0 400 260">
          <g stroke="#F6F2EA" strokeWidth="2" fill="none" strokeLinejoin="round">
            <path d="M80 190 L80 120 L200 152 L200 222 Z" fill="#17324F" />
            <path d="M200 222 L200 152 L310 122 L310 192 Z" fill="#0E2238" />
            <path d="M80 120 L140 60 L250 90 L200 152 Z" fill="#24405F" />
            <path d="M200 152 L250 90 L310 122" />
            <path d="M100 116 L140 76 L190 89 L152 130 Z" fill="#E58A5B" stroke="none" />
          </g>
        </svg>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#B9C0C8" }}>
        El, värme, ritningar och lagkrav i en modell du kan klicka i.
      </div>
    </div>,
    size,
  );
}
