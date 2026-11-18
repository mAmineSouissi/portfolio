"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { liveFrameHover, unlockPageScroll } from "@/lib/scrollLock";

/**
 * The real site, running inside the portfolio: scroll and click it without leaving.
 * The screenshot holds the frame until the live page has loaded.
 */
export default function LiveFrame({
  url,
  title,
  image,
  className = "h-[68svh]",
}: {
  url: string;
  title: string;
  image?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [nonce, setNonce] = useState(0);
  const host = new URL(url).host;
  useEffect(() => unlockPageScroll, []);

  return (
    <div className="flex flex-col">
      <div className="mono flex items-center gap-2 border-b border-[var(--sc-hairline)] bg-[var(--surface-2)] px-3 py-2 text-[0.78rem]">
        <button
          type="button"
          onClick={() => {
            setLoaded(false);
            setNonce((n) => n + 1);
          }}
          aria-label={`Reload ${title}`}
          className="grid h-7 w-7 place-items-center rounded-[var(--sc-r-sm)] text-[var(--sc-ink-soft)] hover:text-[var(--sc-ink)]"
        >
          ↻
        </button>
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate rounded-[var(--sc-r-sm)] bg-[var(--sc-surface)] px-3 py-1 text-[var(--sc-ink)]">
          <span className="hot-dot shrink-0" aria-hidden /> {host}
        </span>
        <span className="hidden text-[var(--sc-ink-soft)] sm:inline">{loaded ? "live · scroll inside" : "loading…"}</span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${title} in a new tab`}
          className="grid h-7 w-7 place-items-center rounded-[var(--sc-r-sm)] text-[var(--sc-ink-soft)] hover:text-[var(--sc-ink)]"
        >
          ↗
        </a>
      </div>
      <div className={`relative w-full overflow-hidden bg-[var(--surface-2)] ${className}`} {...liveFrameHover}>
        {image && !loaded && (
          <Image src={image} alt="" fill sizes="900px" className="object-cover object-top opacity-60" aria-hidden />
        )}
        {!loaded && (
          <p className="mono absolute inset-x-0 bottom-4 text-center text-[0.8rem] text-[var(--sc-ink)]" aria-live="polite">
            connecting to {host}…
          </p>
        )}
        <iframe
          key={nonce}
          src={url}
          title={`${title}, live demo`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
          referrerPolicy="no-referrer-when-downgrade"
          className={`absolute inset-0 h-full w-full border-0 bg-white transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}
