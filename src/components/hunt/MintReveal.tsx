"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { profile } from "@/lib/data";
import { toast } from "@/lib/store";
import { drawCard, mintFromHunt, type Mint } from "@/lib/mint";
import { resetHunt, type HuntState } from "@/lib/tokens";
import { prefersReducedMotion } from "@/lib/gsap";

const MintCard3D = dynamic(() => import("./MintCard3D"), { ssr: false });

function downloadVCard() {
  const [first, ...rest] = profile.name.split(" ");
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${rest.join(" ")};${first};;;`,
    `FN:${profile.name}`,
    `TITLE:${profile.role}`,
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `TEL;TYPE=CELL:${profile.phone.replace(/[^+\d]/g, "")}`,
    ...profile.socials.filter((s) => s.platform !== "Email").map((s) => `URL:${s.url}`),
    `ADR;TYPE=HOME:;;;;;;${profile.location}`,
    "END:VCARD",
  ].join("\r\n");
  save(new Blob([vcf], { type: "text/vcard" }), "amine-souissi.vcf");
  toast("Contact card saved.");
}

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function MintReveal({ hunt }: { hunt: HuntState }) {
  const [mint, setMint] = useState<Mint | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<"hashing" | "done">("hashing");
  const [nonce, setNonce] = useState(0);
  const [use3D, setUse3D] = useState(false);
  const [img, setImg] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const m = await mintFromHunt(hunt);
      if (!m || !alive) return;
      const c = document.createElement("canvas");
      await drawCard(c, m);
      setImg(c.toDataURL("image/png"));
      setMint(m);
      setCanvas(c);
      setUse3D(!prefersReducedMotion() && !!document.createElement("canvas").getContext("webgl2"));
    })();
    return () => {
      alive = false;
    };
  }, [hunt]);

  useEffect(() => {
    if (!mint) return;
    const firstReveal = sessionStorage.getItem(`minted-card-${mint.card}`) !== "1";
    if (!firstReveal || prefersReducedMotion()) {
      setPhase("done");
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      setNonce(Math.floor((now - start) * 37.3));
      if (now - start < 1600) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem(`minted-card-${mint.card}`, "1");
        setPhase("done");
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mint]);

  const downloadPng = () => {
    canvas?.toBlob((b) => b && save(b, `mas-collective-${mint?.card}.png`), "image/png");
    toast("Card saved as PNG.");
  };

  const share = async () => {
    if (!canvas || !mint) return;
    const text = `I found all 5 hidden tokens on ${profile.name}'s portfolio and minted card #${mint.card} (${mint.rarity}).`;
    const url = window.location.origin;
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
    const file = blob && new File([blob], `mas-collective-${mint.card}.png`, { type: "image/png" });
    if (file && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard?.writeText(`${text} ${url}`).catch(() => {});
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
    toast("Share text copied. Paste it into your LinkedIn post.");
  };

  if (!mint || !canvas || phase === "hashing") {
    return (
      <div className="grid min-h-[28rem] place-items-center p-8" role="status">
        <div className="text-center">
          <p className="label text-[var(--sc-accent)]">Minting card</p>
          <p className="headline mt-3 text-2xl tabular-nums">nonce {nonce.toLocaleString("en-US")}</p>
          <p className="label mt-3 break-all !normal-case">
            sha256 · {mint ? `0x${mint.hash.slice(0, (nonce % 48) + 16)}` : "preparing…"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 p-6 md:grid-cols-[minmax(0,26rem)_1fr] md:items-center md:p-8">
      <div className="relative aspect-[3/4] w-full">
        {use3D ? (
          <MintCard3D source={canvas} edge={mint.palette.metal[1]} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={`Collectible card number ${mint.card}`} className="h-full w-full rounded-[14px]" />
        )}
        {use3D && <p className="label absolute -bottom-7 inset-x-0 text-center">Hover or tilt your phone</p>}
      </div>

      <div>
        <p className="label text-[var(--sc-accent)]">
          No. {String(mint.card).padStart(4, "0")} · {mint.rarity}
        </p>
        <p className="headline mt-3 text-[clamp(1.6rem,3vw,2.4rem)]">Your card is minted.</p>
        <p className="text-lg text-[var(--sc-ink-soft)] mt-4">
          Generated from the exact moments you found each token, so no one else has this one. That&apos;s
          the attention to detail I bring to products.
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border bg-[var(--sc-hairline)]">
          {mint.traits.map((t) => (
            <div key={t.label} className="bg-[var(--sc-surface)] p-4">
              <dt className="label">{t.label}</dt>
              <dd className="mt-1 font-medium text-[var(--sc-ink)]">{t.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn btn--primary" onClick={downloadPng} data-cursor="hover">
            Download card <span aria-hidden>↓</span>
          </button>
          <button type="button" className="btn btn--ghost" onClick={share} data-cursor="hover">
            Share
          </button>
          <button type="button" className="btn btn--ghost" onClick={downloadVCard} data-cursor="hover">
            Save contact
          </button>
          <button type="button" className="btn btn--ghost" onClick={resetHunt} data-cursor="hover">
            Reset hunt
          </button>
        </div>
      </div>
    </div>
  );
}
