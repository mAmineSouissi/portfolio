"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

let topZ = 100;
const nextZ = () => ++topZ;

/**
 * A Finder-style floating window: several can be open at once, each one dragged
 * anywhere by its title bar (mouse, pen or touch). Red closes, yellow minimises,
 * green maximises. Esc closes the window that has focus.
 */
export default function FloatingWindow({
  title,
  onClose,
  index = 0,
  width = 640,
  front = false,
  children,
}: {
  title: string;
  onClose: () => void;
  index?: number;
  width?: number;
  /** true when this window was just (re)opened: raise it */
  front?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [z, setZ] = useState(() => nextZ());
  const [min, setMin] = useState(false);
  const [max, setMax] = useState(false);
  const [dragging, setDragging] = useState(false);

  // open centred in the workspace, cascading like Finder
  useEffect(() => {
    const side = innerWidth >= 1024 ? 248 : 0;
    const w = Math.min(width, innerWidth - 24);
    const free = innerWidth - side;
    const step = (index % 6) * 28;
    setPos({
      x: Math.max(12, side + (free - w) / 2 + step),
      y: Math.max(56, Math.min(innerHeight * 0.1, 120) + step),
    });
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => prev?.focus?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (front) {
      setZ(nextZ());
      setMin(false);
    }
  }, [front]);

  const onPointerDown = (e: React.PointerEvent) => {
    setZ(nextZ());
    if (max || !pos || (e.target as HTMLElement).closest("button,a,input")) return;
    e.preventDefault();
    const start = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
    setDragging(true);
    document.documentElement.classList.add("is-dragging");
    const move = (ev: PointerEvent) => {
      const w = ref.current?.offsetWidth ?? width;
      // keep at least the title bar reachable
      const x = Math.min(innerWidth - 80, Math.max(80 - w, start.ox + ev.clientX - start.sx));
      const y = Math.min(innerHeight - 70, Math.max(44, start.oy + ev.clientY - start.sy));
      setPos({ x, y });
    };
    const up = () => {
      setDragging(false);
      document.documentElement.classList.remove("is-dragging");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  if (!pos) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-label={title}
      onPointerDownCapture={() => setZ(nextZ())}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      }}
      className={`window toast-in fixed flex flex-col outline-none ${dragging ? "window--dragging" : ""}`}
      style={
        max
          ? {
              zIndex: z,
              top: "calc(var(--chrome-top) + 10px)",
              bottom: "calc(var(--chrome-bottom) + var(--graph-h) + 10px)",
              left: "calc(var(--side-w) + 10px)",
              right: 10,
            }
          : {
              zIndex: z,
              left: pos.x,
              top: pos.y,
              width: `min(${width}px, calc(100vw - 24px))`,
              maxHeight: min ? undefined : `max(220px, calc(100svh - ${Math.round(pos.y)}px - var(--chrome-bottom) - 12px))`,
            }
      }
    >
      <div
        className="window__bar shrink-0 touch-none"
        onPointerDown={onPointerDown}
        onDoubleClick={(e) => !(e.target as HTMLElement).closest("button") && setMax((v) => !v)}
        style={{ cursor: max ? "default" : dragging ? "grabbing" : "grab" }}
      >
        <span className="lights">
          <button type="button" className="light light--red" aria-label="Close window" onClick={onClose} />
          <button type="button" className="light light--yellow" aria-label={min ? "Restore window" : "Minimize window"} onClick={() => setMin((v) => !v)} />
          <button
            type="button"
            className="light light--green"
            aria-label={max ? "Exit full screen" : "Maximize window"}
            onClick={() => {
              setMin(false);
              setMax((v) => !v);
            }}
          />
        </span>
        <span className="min-w-0 truncate">{title}</span>
        <button type="button" onClick={onClose} className="ml-auto grid h-8 w-8 place-items-center hover:text-[var(--sc-ink)]" aria-label="Close">
          ✕
        </button>
      </div>
      <div hidden={min} className="min-h-0 flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
