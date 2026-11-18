"use client";

import { useEffect, useRef, useState } from "react";
import { systems, type Flow, type FlowStep } from "@/lib/systems";
import { useActProgress } from "@/lib/useActProgress";
import Token from "@/components/hunt/Token";
import Window from "@/components/surface/Window";

const START = 0.05;
const END = 0.86;
const STEP_MS = 950;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** A run through one or more flows of a system; every step it passes stays lit. */
type Tour = { sys: number; flows: Flow[] };
type Manual = Tour & { t0: number };
type TourStep = FlowStep & { flow: number };

const steps = (t: Tour): TourStep[] => t.flows.flatMap((f, fi) => f.steps.map((s) => ({ ...s, flow: fi })));
const scrollTour: Tour = { sys: 0, flows: systems[0].flows };
const same = (s: FlowStep, a: string, b: string) => (s.from === a && s.to === b) || (s.from === b && s.to === a);

function usePortrait() {
  const [portrait, setPortrait] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width: 767px)");
    const set = () => setPortrait(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return portrait;
}

export default function ArchitectureAct() {
  const act = useRef<HTMLElement>(null);
  const p = useActProgress(act, 600);
  const portrait = usePortrait();
  const [manual, setManual] = useState<Manual | null>(null);
  const [now, setNow] = useState(0);

  // a replay runs on its own clock; scrolling back above the landing hands control back to the page
  useEffect(() => {
    if (!manual) return;
    let raf = 0;
    const tick = () => {
      setNow(performance.now());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [manual]);
  useEffect(() => {
    if (p < END - 0.04 && manual) setManual(null);
  }, [p, manual]);

  const tour: Tour = manual ?? scrollTour;
  const sys = systems[tour.sys];
  const all = steps(tour);
  const total = all.length;
  const progress = manual
    ? Math.min(total, Math.max(0, (now - manual.t0) / STEP_MS))
    : Math.max(0, Math.min(1, (p - START) / (END - START))) * total;

  const done = progress >= total - 0.001;
  const idx = Math.min(total - 1, Math.floor(progress));
  const local = done ? 1 : ease(progress - idx);
  const cur = all[idx];
  const curFlow = done ? tour.flows.length - 1 : cur.flow;
  const started = progress > 0.02;
  const landed = !manual && done;
  const passedSteps = all.slice(0, done ? total : idx);

  const node = (id: string) => sys.nodes.find((n) => n.id === id)!;
  const at = (id: string): [number, number] => {
    const n = node(id);
    return portrait ? n.m : [n.x, n.y];
  };
  const [ax, ay] = at(cur.from);
  const [bx, by] = at(cur.to);
  const px = ax + (bx - ax) * local;
  const py = ay + (by - ay) * local;
  const covered = sys.edges.filter(([a, b]) => passedSteps.some((s) => same(s, a, b))).length;

  // event timeStamp shares performance.now()'s clock
  const run = (t: Tour, e: React.MouseEvent) => setManual({ ...t, t0: e.timeStamp });

  return (
    <section id="architecture" data-file="architecture" data-sc-act="pin" data-sc-span="4.4" ref={act}>
      <div
        data-sc-stage
        className="stage-pad flex items-center"
        data-sc-verify-state={`${sys.project}-${idx}-${Math.round(local * 10)}-${done ? 1 : 0}`}
      >
        <div className="mx-auto grid w-full max-w-6xl gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mono text-[0.85rem]">
                <span className="t-key">trace</span>(<span className="t-str">&quot;{tour.flows[curFlow].label.toLowerCase()}&quot;</span>){" "}
                <span className="t-com">
                  {"// "}
                  {sys.project} · request {curFlow + 1}/{tour.flows.length}
                </span>
              </p>
              <h2 className="headline mt-2 text-[clamp(1.7rem,3.6vw,3rem)]">
                {done ? "Every route, delivered." : "One system, every route."}
              </h2>
            </div>
            <p className="label max-w-[34ch]">walkthrough drawn from the {sys.project} project description · private codebase</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_21rem]">
            {/* the diagram: real nodes and edges from systems.ts */}
            <Window
              title={`${sys.project.toLowerCase().split(" ")[0]}/architecture.ts`}
              right={
                <span className="t-com">
                  routes {covered}/{sys.edges.length}
                </span>
              }
            >
              <div className={`relative w-full ${portrait ? "aspect-square" : "aspect-[16/9]"}`}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
                  {sys.edges.map(([a, b]) => {
                    const [x1, y1] = at(a);
                    const [x2, y2] = at(b);
                    const on = started && !done && same(cur, a, b);
                    const passed = passedSteps.some((s) => same(s, a, b));
                    return (
                      <line
                        key={a + b}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        vectorEffect="non-scaling-stroke"
                        stroke={on ? "var(--sc-accent)" : passed ? "color-mix(in oklab, var(--sc-accent) 60%, transparent)" : "var(--sc-hairline-strong)"}
                        strokeWidth={on ? 3 : 2}
                        strokeDasharray={on || passed ? "0" : "5 6"}
                      />
                    );
                  })}
                </svg>

                {sys.nodes.map((n) => {
                  const [x, y] = portrait ? n.m : [n.x, n.y];
                  const hot = started && !done ? cur.from === n.id || cur.to === n.id : false;
                  const visited = passedSteps.some((s) => s.from === n.id || s.to === n.id);
                  return (
                    <div
                      key={n.id}
                      className={`absolute w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-[var(--sc-r-md)] border bg-[var(--sc-canvas)] px-3 py-2 transition-colors sm:w-40 ${
                        hot ? "border-[var(--sc-accent)]" : visited ? "border-[color-mix(in_oklab,var(--sc-accent)_45%,transparent)]" : "border-[var(--sc-hairline-strong)]"
                      }`}
                      style={{ left: `${x}%`, top: `${y}%`, boxShadow: hot ? "var(--sc-e2)" : undefined }}
                    >
                      <p className="text-[0.9rem] font-semibold leading-tight">{n.title}</p>
                      <p className="mono mt-0.5 text-[0.72rem] text-[var(--sc-ink-soft)]">{n.tech}</p>
                      {n.id === "db" && landed && (
                        <span className="absolute -right-3 -top-4">
                          <Token id="arch" size={24} />
                        </span>
                      )}
                    </div>
                  );
                })}

                {started && !done && (
                  <span
                    aria-hidden
                    className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--sc-accent)]"
                    style={{
                      left: `${px}%`,
                      top: `${py}%`,
                      boxShadow: "0 4px 10px -2px hsl(var(--sc-shadow-color) / 0.6), 0 0 0 5px color-mix(in oklab, var(--sc-accent) 28%, transparent)",
                    }}
                  />
                )}
              </div>
            </Window>

            {/* the log: grouped by request, current one expanded */}
            <Window
              title="trace.log"
              right={
                <span className="t-com">
                  {done ? total : started ? idx + 1 : 0}/{total}
                </span>
              }
            >
              <ol className="code space-y-3 px-4 py-4 text-[0.82rem] leading-snug" aria-live="polite">
                {tour.flows.map((f, fi) => {
                  const state = done || fi < curFlow ? "done" : fi === curFlow && started ? "live" : "next";
                  const fSteps = all.filter((s) => s.flow === fi);
                  const base = all.findIndex((s) => s.flow === fi);
                  return (
                    <li key={f.id + fi}>
                      <p className={state === "next" ? "opacity-40" : ""}>
                        <span className={state === "done" ? "t-str" : state === "live" ? "text-[var(--sc-accent)]" : "t-com"}>
                          {state === "done" ? "✓" : state === "live" ? "▶" : "·"}
                        </span>{" "}
                        <span className="text-[var(--sc-ink)]">{f.label}</span>{" "}
                        <span className="t-com">({f.steps.length} hops)</span>
                      </p>
                      {state === "live" && (
                        <ol className="mt-2 space-y-2 border-l border-[var(--sc-hairline-strong)] pl-3">
                          {fSteps.map((s, k) => {
                            const gi = base + k;
                            if (portrait && gi !== idx) return null;
                            return (
                              <li key={k} className={gi <= idx ? "" : "opacity-30"}>
                                <span className="t-fn">{node(s.from).title}</span> <span className="t-com">→</span>{" "}
                                <span className="t-fn">{node(s.to).title}</span>
                                <span className="block text-[var(--sc-ink-soft)]">{s.text}</span>
                              </li>
                            );
                          })}
                        </ol>
                      )}
                    </li>
                  );
                })}
                {done && (
                  <li className="t-str">
                    ✓ {total} hops · {covered}/{sys.edges.length} routes covered
                  </li>
                )}
              </ol>

              {(landed || manual) && (
                <div className="border-t border-[var(--sc-hairline)] px-4 py-3">
                  <p className="label mb-2">replay</p>
                  <div className="flex flex-wrap gap-2">
                    {systems.map((s, si) => (
                      <button
                        key={s.project}
                        type="button"
                        onClick={(e) => run({ sys: si, flows: s.flows }, e)}
                        className="tech-pill"
                        aria-pressed={manual?.sys === si && manual.flows.length > 1}
                      >
                        ▶ {s.project.split(" ")[0]}: every route
                      </button>
                    ))}
                    {systems.flatMap((s, si) =>
                      s.flows.map((f) => (
                        <button
                          key={s.project + f.id}
                          type="button"
                          onClick={(e) => run({ sys: si, flows: [f] }, e)}
                          className="tech-pill"
                          aria-pressed={manual?.flows.length === 1 && manual.flows[0] === f}
                        >
                          {s.project.split(" ")[0]}: {f.label}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </Window>
          </div>
        </div>
      </div>
    </section>
  );
}
