"use client";

import { useEffect, useState } from "react";
import { files, profile, projects } from "@/lib/data";
import { drawerStore, openPeek, useStore, walletOpenStore, resumeOpenStore } from "@/lib/store";
import { scrollToId } from "@/lib/scroll";
import { TOKENS, huntStore, markHintsUsed } from "@/lib/tokens";
import { activeFileStore } from "./Engine";

const ext = (name: string) => name.split(".").pop();
const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const iconColor: Record<string, string> = {
  md: "var(--syn-num)",
  tsx: "var(--syn-key)",
  ts: "var(--syn-num)",
  log: "var(--syn-com)",
  json: "var(--syn-fn)",
  sh: "var(--syn-str)",
  py: "var(--syn-type)",
};

function FileIcon({ name }: { name: string }) {
  return (
    <span aria-hidden className="mono w-7 shrink-0 text-[0.68rem] font-bold" style={{ color: iconColor[ext(name) ?? ""] }}>
      {ext(name)}
    </span>
  );
}

function Wallet() {
  const { found, ready, hintsUsed } = useStore(huntStore);
  const [hints, setHints] = useState(false);
  const complete = found.length === TOKENS.length;
  if (!ready) return null;

  return (
    <section aria-labelledby="wallet-h" className="border-t border-[var(--sc-hairline)] px-4 py-4">
      <h2 id="wallet-h" className="label mb-3 flex items-center justify-between">
        WALLET <span className="text-[var(--sc-ink)]">{found.length}/{TOKENS.length}</span>
      </h2>
      <ol className="mb-3 flex gap-1.5" aria-label="Chain progress">
        {TOKENS.map((t, i) => {
          const got = found.includes(t.id);
          return (
            <li
              key={t.id}
              className={`mono grid h-8 flex-1 place-items-center rounded-[var(--sc-r-sm)] border text-[0.7rem] ${
                got ? "border-[var(--sc-accent)] bg-[var(--sc-accent)] text-[var(--sc-accent-ink)]" : "border-dashed border-[var(--sc-hairline-strong)] text-[var(--sc-ink-soft)]"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
              <span className="sr-only">{got ? " found" : " not found"}</span>
            </li>
          );
        })}
      </ol>
      {complete ? (
        <button type="button" onClick={() => walletOpenStore.set(true)} className="btn btn--primary h-10 w-full justify-center text-[0.85rem]">
          Mint your card
        </button>
      ) : (
        <>
          <p className="text-[0.85rem] leading-snug text-[var(--sc-ink-soft)]">
            Five bronze tokens are hidden in this workspace. Find them all to mint a card.
          </p>
          <button
            type="button"
            aria-expanded={hints}
            onClick={() => {
              if (!hints) markHintsUsed();
              setHints((v) => !v);
            }}
            className="mono mt-2 block text-left text-[0.8rem] text-[var(--sc-accent)] hover:underline"
          >
            {hints ? "hide hints" : hintsUsed ? "show hints" : "show hints (noted on your card)"}
          </button>
          {hints && (
            <ul className="mt-2 space-y-1.5">
              {TOKENS.filter((t) => !found.includes(t.id)).map((t) => (
                <li key={t.id} className="text-[0.82rem] leading-snug">
                  <span className="mono text-[var(--sc-accent)]">{t.where}</span>{" "}
                  <span className="text-[var(--sc-ink-soft)]">{t.hint}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

function Explorer({ onNavigate }: { onNavigate?: () => void }) {
  const active = useStore(activeFileStore);
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-2 py-3">
        <p className="label px-2 pb-2">EXPLORER</p>
        <p className="mono flex items-center gap-1 px-2 py-1 text-[0.82rem] text-[var(--sc-ink)]">▾ portfolio</p>
        <ul>
          {files.map((f) => (
            <li key={f.id}>
              <a
                href={`#${f.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(f.id);
                  onNavigate?.();
                }}
                aria-current={f.id === active ? "page" : undefined}
                className={`mono flex h-8 items-center rounded-[var(--sc-r-sm)] pl-5 pr-2 text-[0.84rem] ${
                  f.id === active ? "bg-[var(--surface-2)] text-[var(--sc-ink)]" : "text-[var(--sc-ink-soft)] hover:text-[var(--sc-ink)]"
                }`}
              >
                <FileIcon name={f.name} />
                {f.name}
              </a>
            </li>
          ))}
          <li>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="mono flex h-8 w-full items-center pl-5 text-[0.84rem] text-[var(--sc-ink)]"
            >
              {open ? "▾" : "▸"} projects/
            </button>
            {open && (
              <ul>
                {projects.map((p) => {
                  const name = `${slug(p.title)}.${p.title === "XAU/USD Bot" ? "py" : "tsx"}`;
                  return (
                    <li key={p.title}>
                      <button
                        type="button"
                        onClick={() => {
                          openPeek(p.title);
                          onNavigate?.();
                        }}
                        className="mono flex h-8 w-full items-center rounded-[var(--sc-r-sm)] pl-9 pr-2 text-left text-[0.8rem] text-[var(--sc-ink-soft)] hover:text-[var(--sc-ink)]"
                      >
                        <FileIcon name={name} />
                        <span className="truncate">{name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        </ul>
      </div>
      <Wallet />
      <div className="flex gap-2 border-t border-[var(--sc-hairline)] px-4 py-3">
        <a href={profile.resumeUrl} onClick={(e) => { e.preventDefault(); resumeOpenStore.set(true); }} className="mono flex-1 text-[0.8rem] text-[var(--sc-ink-soft)] hover:text-[var(--sc-ink)]">
          resume.pdf
        </a>
        <a href={profile.socials[0].url} target="_blank" rel="noreferrer" className="mono text-[0.8rem] text-[var(--sc-ink-soft)] hover:text-[var(--sc-ink)]">
          github ↗
        </a>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const drawer = useStore(drawerStore);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && drawerStore.set(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  return (
    <>
      <aside
        aria-label="Explorer"
        className="fixed bottom-[var(--chrome-bottom)] left-0 top-[var(--chrome-top)] z-40 hidden w-[var(--side-w)] border-r border-[var(--sc-hairline)] bg-[var(--sc-surface)] lg:block"
      >
        <Explorer />
      </aside>

      {drawer && (
        <div className="fixed inset-0 z-[55] lg:hidden" role="dialog" aria-modal="true" aria-label="Explorer">
          <button
            type="button"
            aria-label="Close explorer"
            className="absolute inset-0 bg-[color-mix(in_oklab,var(--sc-canvas)_70%,transparent)]"
            onClick={() => drawerStore.set(false)}
          />
          <div className="toast-in absolute bottom-0 left-0 top-0 w-[min(84vw,300px)] border-r border-[var(--sc-hairline-strong)] bg-[var(--sc-surface)]" style={{ boxShadow: "var(--sc-e3)" }}>
            <Explorer onNavigate={() => drawerStore.set(false)} />
          </div>
        </div>
      )}
    </>
  );
}
