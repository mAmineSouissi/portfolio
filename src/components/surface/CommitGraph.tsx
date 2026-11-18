"use client";

import { useEffect, useRef, useState } from "react";
import { files, projects } from "@/lib/data";
import { mergedStore, useStore } from "@/lib/store";
import { scrollToId } from "@/lib/scroll";

type Node = { id: string; label: string; frac: number; lane: 0 | 1; target: string; y?: number };

const live = projects.filter((p) => p.liveUrl && p.image);

function shortHash(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193) >>> 0;
  return h.toString(16).padStart(8, "0").slice(0, 7);
}

function measure(): Node[] {
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const top = (el: Element) => el.getBoundingClientRect().top + scrollY;
  const nodes: Node[] = [];
  for (const f of files) {
    const el = document.querySelector(`[data-file="${f.id}"]`);
    if (!el) continue;
    const t = top(el);
    nodes.push({ id: f.id, label: f.commit, frac: Math.min(1, t / max), lane: 0, target: f.id, y: t });
    if (f.id === "work") {
      const travel = Math.max(1, (el as HTMLElement).offsetHeight - innerHeight);
      live.forEach((p, i) => {
        const y = t + ((i + 0.5) / live.length) * travel;
        nodes.push({ id: `work-${i}`, label: `feat/${p.title.toLowerCase().split(" ")[0]}: ${p.summary.replace(/\.$/, "")}`, frac: Math.min(1, y / max), lane: 1, target: "work", y });
      });
    }
  }
  return nodes;
}

export default function CommitGraph() {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [head, setHead] = useState(0);
  const [reached, setReached] = useState(0);
  const [tip, setTip] = useState<Node | null>(null);
  const merged = useStore(mergedStore);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const relayout = () => {
      setW(el.clientWidth);
      setNodes(measure());
    };
    relayout();
    const ro = new ResizeObserver(relayout);
    ro.observe(el);
    ro.observe(document.body);
    const t1 = setTimeout(relayout, 600);
    const t2 = setTimeout(relayout, 2000);
    return () => {
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = -1;
    const tick = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const f = Math.round((scrollY / max) * 1000) / 1000;
      if (f !== last) {
        last = f;
        setHead(f);
        setReached((r) => Math.max(r, f));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pad = 18;
  const X = (f: number) => pad + f * Math.max(0, w - pad * 2);
  const MAIN = 30;
  const LANE = 12;
  const branch = nodes.filter((n) => n.lane === 1);
  const workNode = nodes.find((n) => n.id === "work");
  const archNode = nodes.find((n) => n.id === "architecture");
  const last = nodes.filter((n) => n.lane === 0).at(-1);
  const stamped = (n: Node) => n.frac <= reached + 0.002;

  const branchPath =
    workNode && archNode && branch.length
      ? `M ${X(workNode.frac)} ${MAIN} C ${X(workNode.frac) + 14} ${MAIN}, ${X(branch[0].frac) - 14} ${LANE}, ${X(branch[0].frac)} ${LANE} L ${X(branch.at(-1)!.frac)} ${LANE} C ${X(branch.at(-1)!.frac) + 14} ${LANE}, ${X(archNode.frac) - 14} ${MAIN}, ${X(archNode.frac)} ${MAIN}`
      : "";
  const mergeX = last ? Math.min(w - 8, X(last.frac) + 40) : 0;

  return (
    <div
      ref={wrap}
      className="fixed bottom-[var(--chrome-bottom)] right-0 z-40 h-[var(--graph-h)] border-t border-[var(--sc-hairline)] bg-[color-mix(in_oklab,var(--sc-canvas)_86%,transparent)] backdrop-blur-sm"
      style={{ left: "var(--side-w)" }}
      role="navigation"
      aria-label="Commit history of this visit"
    >
      {w > 0 && (
        <svg width={w} height={44} className="absolute inset-0" aria-hidden>
          <line x1={X(0)} y1={MAIN} x2={X(1)} y2={MAIN} stroke="var(--sc-hairline-strong)" strokeWidth="2" strokeDasharray="3 5" />
          <line x1={X(0)} y1={MAIN} x2={X(Math.min(reached, 1))} y2={MAIN} stroke="var(--sc-accent)" strokeWidth="2" />
          {branchPath && (
            <path
              d={branchPath}
              fill="none"
              stroke={workNode && reached >= (branch.at(-1)?.frac ?? 1) ? "var(--syn-key)" : "var(--sc-hairline-strong)"}
              strokeWidth="2"
            />
          )}
          {merged && last && (
            <path
              d={`M ${X(last.frac)} ${MAIN} C ${X(last.frac) + 12} ${MAIN}, ${mergeX - 18} ${LANE}, ${mergeX} ${LANE}`}
              fill="none"
              stroke="var(--syn-str)"
              strokeWidth="2"
            />
          )}
          <line x1={X(head)} y1={4} x2={X(head)} y2={40} stroke="var(--sc-ink)" strokeWidth="1" opacity="0.5" />
        </svg>
      )}

      {w > 0 &&
        nodes.map((n) => {
          const on = stamped(n);
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => scrollToId(n.target)}
              onMouseEnter={() => setTip(n)}
              onMouseLeave={() => setTip(null)}
              onFocus={() => setTip(n)}
              onBlur={() => setTip(null)}
              aria-label={`Commit ${shortHash(n.label)}: ${n.label}`}
              className="absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left: X(n.frac), top: n.lane ? LANE : MAIN }}
            >
              <span
                aria-hidden
                className="block rounded-full border-2 transition-colors duration-200"
                style={{
                  width: n.lane ? 9 : 12,
                  height: n.lane ? 9 : 12,
                  borderColor: n.lane ? "var(--syn-key)" : "var(--sc-accent)",
                  background: on ? (n.lane ? "var(--syn-key)" : "var(--sc-accent)") : "var(--sc-canvas)",
                }}
              />
            </button>
          );
        })}

      {merged && last && w > 0 && (
        <span
          aria-label="Commit: merge hire/you into main"
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--syn-str)]"
          style={{ left: mergeX, top: LANE }}
        />
      )}

      {tip && (
        <p
          className="mono pointer-events-none absolute bottom-[calc(100%+6px)] max-w-[min(90vw,420px)] -translate-x-1/2 truncate rounded-[var(--sc-r-sm)] border border-[var(--sc-hairline-strong)] bg-[var(--surface-2)] px-3 py-1.5 text-[0.78rem]"
          style={{ left: Math.min(Math.max(X(tip.frac), 140), w - 140), boxShadow: "var(--sc-e2)" }}
        >
          <span className="t-fn">{shortHash(tip.label)}</span> {tip.label}
        </p>
      )}
    </div>
  );
}
