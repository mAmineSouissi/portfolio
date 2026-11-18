"use client";

import { useEffect } from "react";
import { files, type FileId } from "@/lib/data";
import { createStore } from "@/lib/store";

type ScApi = { destroy?: () => void };
type ScGlobal = { mount: (root?: Element | Document) => ScApi };

export const activeFileStore = createStore<FileId>("about");

/** Mounts the unmodified scrollcraft engine and tracks which file the reader is in. */
export default function Engine() {
  useEffect(() => {
    let api: ScApi | undefined;
    let cancelled = false;
    const start = () => {
      const sc = (window as unknown as { ScrollCraft?: ScGlobal }).ScrollCraft;
      if (!cancelled && sc) api = sc.mount(document);
    };
    const existing = document.querySelector<HTMLScriptElement>('script[data-scrollcraft]');
    if ((window as unknown as { ScrollCraft?: ScGlobal }).ScrollCraft) start();
    else if (existing) existing.addEventListener("load", start, { once: true });
    else {
      const s = document.createElement("script");
      s.src = "/scrollcraft/scrollcraft.js";
      s.dataset.scrollcraft = "";
      s.addEventListener("load", start, { once: true });
      document.body.appendChild(s);
    }
    return () => {
      cancelled = true;
      api?.destroy?.();
    };
  }, []);

  useEffect(() => {
    const els = files
      .map((f) => document.querySelector<HTMLElement>(`[data-file="${f.id}"]`))
      .filter((el): el is HTMLElement => !!el);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) activeFileStore.set(e.target.getAttribute("data-file") as FileId);
        }
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return null;
}
