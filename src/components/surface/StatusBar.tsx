"use client";

import { files, profile } from "@/lib/data";
import { useStore, walletOpenStore } from "@/lib/store";
import { TOKENS, huntStore } from "@/lib/tokens";
import { activeFileStore } from "./Engine";

const lang: Record<string, string> = {
  about: "Markdown",
  work: "TypeScript React",
  architecture: "TypeScript",
  career: "Log",
  stack: "JSON",
  contact: "Shell",
};

export default function StatusBar() {
  const active = useStore(activeFileStore);
  const { found } = useStore(huntStore);
  const file = files.find((f) => f.id === active);

  return (
    <footer
      className="mono fixed inset-x-0 bottom-0 z-50 flex h-[var(--chrome-bottom)] items-center gap-4 overflow-hidden border-t border-[var(--sc-hairline)] bg-[var(--surface-2)] px-3 text-[0.78rem] text-[var(--sc-ink-soft)]"
    >
      <span className="flex items-center gap-1.5 text-[var(--sc-ink)]">
        <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden>
          <circle cx="4" cy="3" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="4" cy="13" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 5v6M12 7c0 3-8 2-8 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        main
      </span>
      <span className="flex items-center gap-2 text-[var(--sc-ink)]">
        <span className="hot-dot" aria-hidden /> open to work
      </span>
      <span className="hidden sm:inline">{file?.name}</span>
      <span className="hidden md:inline">{lang[active]}</span>
      <span className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={() => walletOpenStore.set(true)}
          className="hidden items-center gap-1.5 text-[var(--sc-ink)] hover:text-[var(--sc-accent)] sm:flex"
          aria-label={`Wallet: ${found.length} of ${TOKENS.length} tokens found`}
        >
          ◎ {found.length}/{TOKENS.length}
        </button>
        <a href={`mailto:${profile.email}`} className="font-semibold text-[var(--sc-accent)] hover:underline">
          Email me
        </a>
      </span>
    </footer>
  );
}
