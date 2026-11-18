"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

let topZ = 30;
const nextZ = () => ++topZ;

/**
 * A real window: drag it by the title bar (mouse or pen), double-click the bar or
 * press the red light to put it back, yellow minimises, green maximises.
 * Arrow keys move it while the title bar has focus.
 */
export default function Window({
  title,
  right,
  children,
  className = "",
  bodyClassName = "",
  maximizable = true,
  path,
}: {
  title: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  maximizable?: boolean;
  /** breadcrumb under the bar, e.g. ["portfolio", "work.tsx"] */
  path?: string[];
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [z, setZ] = useState<number | undefined>(undefined);
  const [min, setMin] = useState(false);
  const [max, setMax] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!max) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMax(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [max]);

  const front = () => setZ(nextZ());
  const reset = () => {
    setPos({ x: 0, y: 0 });
    setMin(false);
    setMax(false);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    front();
    if (max || e.pointerType === "touch" || (e.target as HTMLElement).closest("button,a,input")) return;
    if (!matchMedia("(pointer: fine)").matches) return;
    e.preventDefault();
    drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
    setDragging(true);
    document.documentElement.classList.add("is-dragging");
    const move = (ev: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      setPos({ x: d.ox + ev.clientX - d.sx, y: d.oy + ev.clientY - d.sy });
    };
    const up = () => {
      drag.current = null;
      setDragging(false);
      document.documentElement.classList.remove("is-dragging");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 48 : 16;
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (d) {
      e.preventDefault();
      setPos((p) => ({ x: p.x + d[0], y: p.y + d[1] }));
    } else if (e.key === "Home") reset();
  };

  const moved = pos.x !== 0 || pos.y !== 0;

  const win = (
    <div
      onPointerDownCapture={front}
      className={`window ${max ? "window--max" : className} ${dragging ? "window--dragging" : ""}`}
      style={max ? undefined : { translate: moved ? `${pos.x}px ${pos.y}px` : undefined, zIndex: z }}
    >
      <div
        className="window__bar"
        onPointerDown={onPointerDown}
        onDoubleClick={(e) => !(e.target as HTMLElement).closest("button,a") && reset()}
        onKeyDown={onKeyDown}
        tabIndex={0}
        aria-label="Window title bar. Drag or use arrow keys to move, Home to reset."
        style={{ cursor: max ? "default" : dragging ? "grabbing" : "grab" }}
      >
        <span className="lights">
          <button type="button" className="light light--red" aria-label="Reset window" onClick={reset} />
          <button type="button" className="light light--yellow" aria-label={min ? "Restore window" : "Minimize window"} onClick={() => setMin((v) => !v)} />
          {maximizable && (
            <button
              type="button"
              className="light light--green"
              aria-label={max ? "Exit full screen" : "Maximize window"}
              onClick={() => {
                setMin(false);
                setMax((v) => !v);
              }}
            />
          )}
        </span>
        <span className="min-w-0 truncate">{title}</span>
        {right && <span className="ml-auto flex shrink-0 items-center gap-2">{right}</span>}
      </div>
      {path && !min && (
        <p className="window__crumbs">
          {path.map((p, i) => (
            <span key={i}>
              {i > 0 && <span aria-hidden className="mx-1.5 opacity-60">›</span>}
              <span className={i === path.length - 1 ? "text-[var(--sc-ink)]" : ""}>{p}</span>
            </span>
          ))}
        </p>
      )}
      <div hidden={min} className={max ? `overflow-auto ${bodyClassName}` : bodyClassName} style={max ? { maxHeight: "calc(100% - 38px)" } : undefined}>
        {children}
      </div>
    </div>
  );

  if (max && mounted) {
    return (
      <>
        <div className={`window ${className} invisible`} aria-hidden>
          <div className="window__bar" />
        </div>
        {createPortal(
          <div className="window-max-backdrop" onClick={(e) => e.target === e.currentTarget && setMax(false)}>
            {win}
          </div>,
          document.body
        )}
      </>
    );
  }
  return win;
}
