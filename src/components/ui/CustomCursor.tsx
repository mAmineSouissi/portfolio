"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    // The div is always rendered, so ref.current is available here.
    const el = ref.current;
    if (!el) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const xTo = gsap.quickTo(el, "x", { duration: 0.12, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.12, ease: "power3" });

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (e.target instanceof HTMLIFrameElement) {
        setVisible(false);
        return;
      }
      xTo(e.clientX);
      yTo(e.clientY);
      setVisible(true);
    };

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element &&
      !!t.closest('a, button, input, textarea, label, .window__bar, [data-cursor="hover"]');

    // inside an embedded live site the page cannot see the pointer, so hand over to the native cursor
    const over = (e: PointerEvent) => {
      if (e.target instanceof HTMLIFrameElement) {
        setVisible(false);
        return;
      }
      setHovering(isInteractive(e.target));
    };

    // pointer events keep firing during drags, where mouse events are suppressed
    window.addEventListener("pointermove", move, { passive: true, capture: true });
    window.addEventListener("pointerover", over, { passive: true, capture: true });

    return () => {
      window.removeEventListener("pointermove", move, { capture: true });
      window.removeEventListener("pointerover", over, { capture: true });
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[10000] will-change-transform"
      style={{ opacity: enabled && visible ? 1 : 0 }}
    >
      <img
        src={
          hovering
            ? "/cursor/hover-custom-cursor.png"
            : "/cursor/custom-cursor.png"
        }
        alt=""
        draggable={false}
        className={`block h-auto select-none transition-[width,transform] duration-200 ${
          hovering ? "w-9 -translate-x-1/3" : "w-7"
        }`}
        style={{
          filter: "var(--cursor-filter)",
        }}
      />
    </div>
  );
}
