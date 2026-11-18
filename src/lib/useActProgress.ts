"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Reads the engine's --sc-p off an act element once per frame and returns it
 * quantised, so React only re-renders when the rendered state can change.
 */
export function useActProgress(ref: RefObject<HTMLElement | null>, steps = 200) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const raw = parseFloat(el.style.getPropertyValue("--sc-p"));
        const q = Number.isFinite(raw) ? Math.round(raw * steps) / steps : 0;
        if (q !== last) {
          last = q;
          setP(q);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref, steps]);
  return p;
}
