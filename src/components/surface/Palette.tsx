"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { files, profile, projects } from "@/lib/data";
import { createStore, mergedStore, openPeek, toast, useStore, walletOpenStore, resumeOpenStore } from "@/lib/store";
import { scrollToId } from "@/lib/scroll";

export const paletteStore = createStore(false);

type Item = { group: string; label: string; hint?: string; run: () => void };

const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

function useItems(): Item[] {
  return useMemo(
    () => [
      ...files.map((f) => ({ group: "Go to file", label: f.name, hint: f.commit, run: () => scrollToId(f.id) })),
      ...projects.map((p) => ({
        group: "Open project",
        label: `projects/${p.title}`,
        hint: p.liveUrl ? "live" : "private",
        run: () => openPeek(p.title),
      })),
      {
        group: "Actions",
        label: "Email me",
        hint: profile.email,
        run: () => {
          mergedStore.set(true);
          window.location.href = `mailto:${profile.email}`;
        },
      },
      { group: "Actions", label: "Open resume.pdf", hint: "read it here", run: () => resumeOpenStore.set(true) },
      {
        group: "Actions",
        label: "Download resume.pdf",
        run: () => Object.assign(document.createElement("a"), { href: profile.resumeUrl, download: "Mohamed-Amine-Souissi-CV.pdf" }).click(),
      },
      {
        group: "Actions",
        label: "Copy email address",
        hint: profile.email,
        run: () =>
          navigator.clipboard
            .writeText(profile.email)
            .then(() => toast("Email copied to clipboard."))
            .catch(() => toast("Couldn't copy. The address is " + profile.email)),
      },
      {
        group: "Actions",
        label: "Trace a request through Reborn",
        hint: "architecture.ts",
        run: () => scrollToId("architecture"),
      },
      { group: "Actions", label: "Open wallet", hint: "token hunt", run: () => walletOpenStore.set(true) },
      {
        group: "Actions",
        label: "Toggle light / dark theme",
        run: () => document.querySelector<HTMLButtonElement>('[aria-label^="Switch to"]')?.click(),
      },
      ...profile.socials
        .filter((s) => s.platform !== "Email")
        .map((s) => ({ group: "Actions", label: `Open ${s.platform}`, hint: s.url.replace(/^https?:\/\//, ""), run: () => window.open(s.url, "_blank", "noopener,noreferrer") })),
    ],
    []
  );
}

export function PaletteButton() {
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(isMac()), []);
  return (
    <button
      type="button"
      onClick={() => paletteStore.set(true)}
      className="mono hidden h-8 min-w-[15rem] items-center gap-2 rounded-[var(--sc-r-sm)] border border-[var(--sc-hairline-strong)] bg-[var(--sc-surface)] px-3 text-[0.8rem] text-[var(--sc-ink-soft)] hover:border-[var(--sc-accent)] md:flex"
      aria-label="Open command palette"
    >
      <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden>
        <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      Search files, projects, actions
      <kbd className="ml-auto rounded-[4px] border border-[var(--sc-hairline-strong)] px-1.5 text-[0.7rem]">{mac ? "⌘K" : "Ctrl K"}</kbd>
    </button>
  );
}

export default function Palette() {
  const open = useStore(paletteStore);
  const items = useItems();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        paletteStore.set(!paletteStore.get());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setSel(0);
    const prev = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => input.current?.focus());
    return () => prev?.focus?.();
  }, [open]);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(t));
  }, [items, q]);

  useEffect(() => {
    list.current?.querySelector(`[data-i="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  if (!open) return null;

  const choose = (i: Item | undefined) => {
    if (!i) return;
    paletteStore.set(false);
    i.run();
  };


  return (
    <div className="fixed inset-0 z-[1000] flex justify-center px-3 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command palette">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-[color-mix(in_oklab,var(--sc-canvas)_60%,transparent)]" onClick={() => paletteStore.set(false)} />
      <div className="window toast-in relative h-fit w-full max-w-xl">
        <div className="flex items-center gap-3 border-b border-[var(--sc-hairline)] px-4">
          <span className="text-[var(--sc-accent)]" aria-hidden>
            ›
          </span>
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(shown.length - 1, s + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(0, s - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                choose(shown[sel]);
              } else if (e.key === "Escape") paletteStore.set(false);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={shown[sel] ? `palette-${sel}` : undefined}
            placeholder="Type a file, project or action"
            className="mono h-12 flex-1 bg-transparent text-[0.95rem] text-[var(--sc-ink)] outline-none placeholder:text-[var(--syn-com)]"
          />
          <kbd className="mono rounded-[4px] border border-[var(--sc-hairline-strong)] px-1.5 text-[0.7rem] text-[var(--sc-ink-soft)]">esc</kbd>
        </div>
        <ul ref={list} id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {shown.length === 0 && <li className="mono px-3 py-6 text-center text-[0.85rem] text-[var(--sc-ink-soft)]">No match. Try &quot;kibo&quot; or &quot;email&quot;.</li>}
          {shown.map((it, i) => {
            const head = i === 0 || shown[i - 1].group !== it.group;
            return (
              <li key={it.group + it.label} role="presentation">
                {head && <p className="label px-3 pb-1 pt-3 first:pt-1">{it.group}</p>}
                <div
                  id={`palette-${i}`}
                  data-i={i}
                  role="option"
                  aria-selected={i === sel}
                  onMouseMove={() => setSel(i)}
                  onClick={() => choose(it)}
                  className={`flex cursor-pointer items-center gap-3 rounded-[var(--sc-r-sm)] px-3 py-2 ${i === sel ? "bg-[var(--surface-2)]" : ""}`}
                >
                  <span className="mono truncate text-[0.88rem] text-[var(--sc-ink)]">{it.label}</span>
                  {it.hint && <span className="mono ml-auto max-w-[45%] truncate text-[0.75rem] text-[var(--sc-ink-soft)]">{it.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
