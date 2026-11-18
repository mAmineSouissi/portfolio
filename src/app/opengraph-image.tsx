import { ImageResponse } from "next/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name}, ${profile.role}. Open to full-stack and mobile roles.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function googleFont(family: string, weight: number, text: string) {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const headline = "FULL-STACK, END TO END.";
  const name = profile.name.toUpperCase();
  const display = await googleFont("Unbounded", 800, headline + name + "MA.S");
  const body = await googleFont("Archivo", 500, profile.tagline + "Open to full-stack and mobile roles · Tunisia");

  const fonts = [
    display && { name: "Unbounded", data: display, weight: 800 as const, style: "normal" as const },
    body && { name: "Archivo", data: body, weight: 500 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 800 | 500; style: "normal" }[];

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
          background: "linear-gradient(120deg, #100e0c 45%, #2e2011 100%)",
          color: "#f3ece2",
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontFamily: "Unbounded", fontSize: 34 }}>
            MA<span style={{ color: "#c8924f" }}>.</span>S
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 22,
              padding: "10px 22px",
              borderRadius: 999,
              border: "1px solid rgba(243,236,226,0.2)",
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#c6ff3d" }} />
            Open to full-stack and mobile roles
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#c8924f", fontFamily: "Unbounded", marginBottom: 20 }}>{name}</div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Unbounded", fontSize: 92, lineHeight: 0.95 }}>
            <span>FULL-STACK,</span>
            <span style={{ color: "#c8924f" }}>END TO END.</span>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#d8cfc2" }}>
          <span>{profile.tagline}</span>
          <span>Tunisia</span>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
