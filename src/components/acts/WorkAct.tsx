"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { liveFrameHover, unlockPageScroll } from "@/lib/scrollLock";
import { projects } from "@/lib/data";
import { openPeek } from "@/lib/store";
import { useActProgress } from "@/lib/useActProgress";
import TechList from "@/components/ui/TechList";
import Window from "@/components/surface/Window";

const live = projects.filter((p) => p.liveUrl && p.image);
const others = projects.filter((p) => !live.includes(p));

export default function WorkAct() {
  const act = useRef<HTMLElement>(null);
  const p = useActProgress(act, 120);
  const i = Math.min(live.length - 1, Math.floor(p * live.length));
  const sel = live[i];
  const host = new URL(sel.liveUrl!).host;
  const [liveFor, setLiveFor] = useState<string | null>(null);
  const showLive = liveFor === sel.title;
  useEffect(() => {
    if (!showLive) unlockPageScroll();
  }, [showLive]);

  return (
    <section id="work" data-file="work" data-sc-act="pin" data-sc-span="3.2" ref={act}>
      <div data-sc-stage className="stage-pad flex items-center" data-sc-verify-state={`sel-${i}`}>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-5 lg:grid-cols-[minmax(0,19rem)_1fr]">
          {/* the file panel: selection is driven by scroll, clicking still works */}
          <Window title="work.tsx" right={<span className="t-com">{i + 1}/{live.length}</span>} path={["portfolio", "work.tsx"]}>
            <div className="code px-4 py-4 text-[0.85rem] leading-relaxed">
              <p>
                <span className="t-key">const</span> <span className="t-fn">live</span> = [
              </p>
              <ul className="my-1">
                {live.map((p, k) => (
                  <li key={p.title}>
                    <button
                      type="button"
                      onClick={() => openPeek(p.title)}
                      aria-current={k === i ? "true" : undefined}
                      className={`flex w-full items-center gap-2 rounded-[var(--sc-r-sm)] px-2 py-1.5 text-left transition-colors ${
                        k === i ? "bg-[var(--surface-2)] text-[var(--sc-ink)]" : "text-[var(--sc-ink-soft)]"
                      }`}
                    >
                      <span aria-hidden className={k === i ? "text-[var(--sc-accent)]" : "opacity-0"}>
                        ▸
                      </span>
                      <span className="t-str">&quot;{p.title}&quot;</span>,
                    </button>
                  </li>
                ))}
              </ul>
              <p>];</p>
              <p className="mt-3 hidden t-com lg:block">{"// more in projects/"}</p>
              <ul className="mt-1 hidden flex-wrap gap-x-3 gap-y-1 lg:flex">
                {others.map((p) => (
                  <li key={p.title}>
                    <button type="button" onClick={() => openPeek(p.title)} className="text-[var(--sc-ink-soft)] underline-offset-4 hover:text-[var(--sc-ink)] hover:underline">
                      {p.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Window>

          {/* the browser pane: a real screenshot of the live site */}
          <Window
            title={
              <span className="flex min-w-0 items-center gap-2 rounded-[var(--sc-r-sm)] bg-[var(--sc-surface)] px-3 py-1 text-[0.78rem] text-[var(--sc-ink)]">
                <span className="hot-dot shrink-0" aria-hidden /> {host}
              </span>
            }
          >
            <div className="relative aspect-[1456/816] max-h-[40svh] w-full bg-[var(--surface-2)] lg:max-h-[46svh]">
              {live.map((p, k) => (
                <Image
                  key={k === i ? `on-${k}` : `off-${k}`}
                  src={p.image!}
                  alt={k === i ? `Screenshot of ${p.title}, live at ${host}` : ""}
                  aria-hidden={k !== i}
                  fill
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 760px"
                  className={`object-cover ${k === i ? "wipe-in z-10" : "opacity-0"}`}
                />
              ))}
              {showLive && (
                <iframe
                  {...liveFrameHover}
                  key={sel.title}
                  src={sel.liveUrl}
                  title={`${sel.title}, live demo`}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
                  className="absolute inset-0 z-20 h-full w-full border-0 bg-white"
                />
              )}
              {showLive && (
                <p className="mono pointer-events-none absolute bottom-2 right-2 z-30 rounded-[var(--sc-r-sm)] bg-[var(--surface-2)] px-2 py-1 text-[0.72rem] text-[var(--sc-ink)]">
                  live · scroll inside
                </p>
              )}
            </div>
            <div className="flex flex-col gap-4 border-t border-[var(--sc-hairline)] p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
              <div className="min-w-0">
                <p className="label">
                  {sel.year} · {sel.category} · live
                </p>
                <h2 className="headline mt-1 text-[clamp(1.6rem,3vw,2.4rem)]">{sel.title}</h2>
                <p className="mt-1 hidden text-[var(--sc-ink-soft)] sm:block">{sel.summary}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setLiveFor(showLive ? null : sel.title)}
                  aria-pressed={showLive}
                  className="btn btn--primary"
                >
                  {showLive ? "■ Back to screenshot" : "▶ Try it live here"}
                </button>
                <a href={sel.liveUrl} target="_blank" rel="noreferrer" className="btn btn--ghost" aria-label={`Open ${host} in a new tab`}>
                  ↗
                </a>
              </div>
            </div>
            <div className="hidden border-t border-[var(--sc-hairline)] px-4 py-3 sm:block sm:px-5">
              <TechList tech={sel.tech} />
            </div>
          </Window>
        </div>
      </div>
    </section>
  );
}
