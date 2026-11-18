"use client";

import { techFilterStore, toastStore, useStore } from "@/lib/store";

export default function Toaster() {
  const toasts = useStore(toastStore);
  const filter = useStore(techFilterStore);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-[950] flex flex-col items-center gap-2 px-4"
      style={{ bottom: "calc(var(--chrome-bottom) + var(--graph-h) + 12px)", paddingLeft: "calc(var(--side-w) + 1rem)" }}
    >
      {toasts.map((t) => (
        <p
          key={t.id}
          className="toast-in mono rounded-[var(--sc-r-sm)] border border-[var(--sc-hairline-strong)] bg-[var(--surface-2)] px-4 py-2.5 text-[0.85rem] text-[var(--sc-ink)]"
          style={{ boxShadow: "var(--sc-e2)" }}
        >
          <span className="text-[var(--sc-accent)]">◎ </span>
          {t.message}
        </p>
      ))}
      {filter && (
        <button
          type="button"
          onClick={() => techFilterStore.set(null)}
          className="mono pointer-events-auto rounded-[var(--sc-r-sm)] border border-[var(--sc-accent)] bg-[var(--surface-2)] px-4 py-2.5 text-[0.85rem]"
          style={{ boxShadow: "var(--sc-e2)" }}
        >
          <span className="t-com">{"// highlighting "}</span>
          <strong className="text-[var(--sc-accent)]">{filter}</strong>
          <span className="t-com"> · clear (esc)</span>
        </button>
      )}
    </div>
  );
}
