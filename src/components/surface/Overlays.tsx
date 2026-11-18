"use client";

import Image from "next/image";
import { useState } from "react";
import { profile, projects } from "@/lib/data";
import { closePeek, peekStore, resumeOpenStore, useStore, walletOpenStore } from "@/lib/store";
import { TOKENS, huntStore } from "@/lib/tokens";
import TechList from "@/components/ui/TechList";
import Token from "@/components/hunt/Token";
import MintReveal from "@/components/hunt/MintReveal";
import FloatingWindow from "./FloatingWindow";
import LiveFrame from "./LiveFrame";

const statusLabel = { live: "live", "private-demo": "private · demo on request", "in-progress": "in progress" } as const;

function Peek({ title, index, front }: { title: string; index: number; front: boolean }) {
  const p = projects.find((x) => x.title === title);
  const [tab, setTab] = useState<"live" | "details">(p?.liveUrl ? "live" : "details");
  if (!p) return null;

  const details = (
    <div className="grid gap-5 p-5 sm:p-7">
      <p className="mono text-[0.85rem]">
        <span className="t-key">export const</span> <span className="t-fn">project</span> = {"{"} year:{" "}
        <span className="t-num">{p.year}</span>, type: <span className="t-str">&quot;{p.category}&quot;</span>, status:{" "}
        <span className="t-str">&quot;{statusLabel[p.status]}&quot;</span> {"}"}
      </p>
      <h2 className="headline text-[clamp(1.9rem,4vw,2.8rem)]">{p.title}</h2>
      <p className="text-lg font-medium">{p.summary}</p>
      <p className="max-w-[62ch] text-[var(--sc-ink-soft)]">{p.description}</p>
      <TechList tech={p.tech} />
      <div className="flex flex-wrap items-center gap-3">
        {p.liveUrl ? (
          <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn--primary">
            Open live site ↗
          </a>
        ) : (
          <p className="t-com mono text-[0.85rem]">{"// private codebase, demo on request"}</p>
        )}
        {p.title === "XAU/USD Bot" && <Token id="work" size={30} />}
      </div>
    </div>
  );

  return (
    <FloatingWindow title={`projects/${p.title}`} onClose={() => closePeek(title)} index={index} front={front} width={p.liveUrl ? 1040 : 640}>
      {p.liveUrl && (
        <div role="tablist" aria-label={`${p.title} views`} className="mono flex gap-1 border-b border-[var(--sc-hairline)] px-3 pt-2 text-[0.8rem]">
          {(["live", "details"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`relative rounded-t-[var(--sc-r-sm)] px-3 py-2 ${tab === t ? "bg-[var(--surface-2)] text-[var(--sc-ink)]" : "text-[var(--sc-ink-soft)] hover:text-[var(--sc-ink)]"}`}
            >
              {tab === t && <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-[var(--sc-accent)]" />}
              {t === "live" ? "▶ Live demo" : "Details"}
            </button>
          ))}
        </div>
      )}
      {p.liveUrl && tab === "live" ? <LiveFrame url={p.liveUrl} title={p.title} image={p.image} /> : (
        <>
          {p.image && (
            <Image src={p.image} alt={`Screenshot of ${p.title}, live`} width={1456} height={816} className="h-auto w-full border-b border-[var(--sc-hairline)]" />
          )}
          {details}
        </>
      )}
    </FloatingWindow>
  );
}

function Resume() {
  return (
    <FloatingWindow title="resume.pdf" onClose={() => resumeOpenStore.set(false)} width={880} index={1} front>
      <div className="mono flex items-center gap-3 border-b border-[var(--sc-hairline)] bg-[var(--surface-2)] px-3 py-2 text-[0.8rem]">
        <span className="text-[var(--sc-ink-soft)]">{profile.name} · CV · scroll inside</span>
        <a href={profile.resumeUrl} download="Mohamed-Amine-Souissi-CV.pdf" className="ml-auto text-[var(--sc-accent)] hover:underline">
          download ↓
        </a>
      </div>
      <iframe src={`${profile.resumeUrl}#view=FitH`} title={`${profile.name} CV`} className="block h-[72svh] w-full border-0 bg-white" />
    </FloatingWindow>
  );
}

function Wallet() {
  const hunt = useStore(huntStore);
  const close = () => walletOpenStore.set(false);
  const complete = hunt.found.length === TOKENS.length;

  return (
    <FloatingWindow title="wallet/card.png" onClose={close} width={920} index={2} front>
      {complete ? (
        <MintReveal hunt={hunt} />
      ) : (
        <div className="grid gap-3 p-7">
          <p className="headline text-3xl">
            {hunt.found.length} of {TOKENS.length} blocks mined
          </p>
          <p className="max-w-[52ch] text-[var(--sc-ink-soft)]">
            Five bronze tokens are hidden across this workspace. Find them all and the card mints itself here,
            generated from the moments you found each one.
          </p>
        </div>
      )}
    </FloatingWindow>
  );
}

export default function Overlays() {
  const peeks = useStore(peekStore);
  const wallet = useStore(walletOpenStore);
  const resume = useStore(resumeOpenStore);
  return (
    <>
      {resume && <Resume />}
      {peeks.map((t, i) => (
        <Peek key={t} title={t} index={i} front={i === peeks.length - 1} />
      ))}
      {wallet && <Wallet />}
    </>
  );
}
