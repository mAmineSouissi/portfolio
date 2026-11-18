"use client";

import { files } from "@/lib/data";
import { drawerStore, useStore } from "@/lib/store";
import { scrollToId } from "@/lib/scroll";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { activeFileStore } from "./Engine";
import { PaletteButton, paletteStore } from "./Palette";

export default function TitleBar() {
  const active = useStore(activeFileStore);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex h-[var(--chrome-top)] items-stretch border-b border-[var(--sc-hairline)] bg-[var(--surface-2)]"
      style={{ boxShadow: "var(--sc-e1)" }}
    >
      <div className="flex shrink-0 items-center gap-3 px-3 lg:w-[var(--side-w)] lg:border-r lg:border-[var(--sc-hairline)] lg:px-4">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-[var(--sc-r-sm)] border border-[var(--sc-hairline-strong)] lg:hidden"
          aria-label="Open explorer"
          onClick={() => drawerStore.set(true)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <span className="dots hidden lg:inline-flex" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <a href="#about" onClick={(e) => { e.preventDefault(); scrollToId("about"); }} className="mono text-[0.85rem] font-medium">
          amine<span className="text-[var(--sc-accent)]">@</span>portfolio
        </a>
      </div>

      <nav aria-label="Files" className="flex min-w-0 flex-1 items-stretch overflow-x-auto [scrollbar-width:none]">
        {files.map((f) => {
          const on = f.id === active;
          return (
            <a
              key={f.id}
              href={`#${f.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(f.id);
              }}
              aria-current={on ? "page" : undefined}
              className={`mono relative flex shrink-0 items-center gap-2 border-r border-[var(--sc-hairline)] px-4 text-[0.82rem] transition-colors ${
                on ? "bg-[var(--sc-surface)] text-[var(--sc-ink)]" : "text-[var(--sc-ink-soft)] hover:text-[var(--sc-ink)]"
              }`}
            >
              {on && <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-[var(--sc-accent)]" />}
              {f.name}
            </a>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-2 px-3">
        <PaletteButton />
        <button
          type="button"
          onClick={() => paletteStore.set(true)}
          aria-label="Open command palette"
          className="grid h-8 w-8 place-items-center rounded-full border border-[var(--sc-hairline-strong)] md:hidden"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden>
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
