"use client";

import { experience, projects, skills } from "@/lib/data";
import { techFilterStore, toggleTech, useStore } from "@/lib/store";
import Token from "@/components/hunt/Token";
import Window from "@/components/surface/Window";
import { huntStore } from "@/lib/tokens";

function MasValue() {
  const { found, ready } = useStore(huntStore);
  if (ready && found.includes("stack")) return <span className="t-str">&quot;mined&quot;</span>;
  return <Token id="stack" size={22} />;
}

const usage = (() => {
  const all = [...projects.map((p) => p.tech), ...experience.map((e) => e.tech)];
  const names = new Set(skills.flatMap((g) => g.items).concat(all.flat()));
  return [...names]
    .map((name) => ({ name, n: all.filter((t) => t.includes(name)).length }))
    .filter((u) => u.n > 1)
    .sort((a, b) => b.n - a.n || a.name.localeCompare(b.name))
    .slice(0, 10);
})();

const key = (k: string) => k.toLowerCase().replace(/[^a-z]+/g, "_").replace(/_$/, "");

function Str({ value }: { value: string }) {
  const active = useStore(techFilterStore);
  return (
    <button
      type="button"
      onClick={() => toggleTech(value)}
      aria-pressed={active === value}
      title={`Highlight everything built with ${value}`}
      className={`rounded-[4px] px-0.5 underline-offset-4 hover:underline ${active === value ? "bg-[var(--sc-accent)] text-[var(--sc-accent-ink)]" : "t-str"}`}
    >
      &quot;{value}&quot;
    </button>
  );
}

export default function StackAct() {
  return (
    <section id="stack" data-file="stack" data-sc-act="flow" className="act-pad">
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:pt-10">
          <h2 className="headline text-[clamp(1.8rem,3.8vw,3rem)]">The stack, counted.</h2>
          <p className="mt-3 max-w-[40ch] text-lg text-[var(--sc-ink-soft)]">
            Each number is how many of my projects and jobs actually used that tool, computed from the work on this
            page. Click any name to highlight it everywhere.
          </p>
        </div>

        <Window title="stack.json" right={<span className="t-com">JSON</span>} path={["portfolio", "stack.json"]}>
          <div className="code overflow-x-auto px-4 py-5 text-[0.86rem] sm:px-6">
            <p>{"{"}</p>
            <p className="pl-5">
              <span className="t-key">&quot;used_in_real_work&quot;</span>: {"{"}
            </p>
            <ul className="stack-bars pl-10" data-sc-in>
              {usage.map((u, i) => (
                <li key={u.name} className="grid grid-cols-[minmax(0,13rem)_1fr] items-center gap-3">
                  <span className="truncate">
                    <Str value={u.name} />:{" "}
                    <span className="t-num" data-sc-count={`0 ${u.n}`} data-sc-cue="0.08">
                      {u.n}
                    </span>
                    {i < usage.length - 1 ? "," : ""}
                  </span>
                  <span aria-hidden className="flex items-center gap-2">
                    <span
                      className="stack-bar block h-2.5 rounded-[2px]"
                      style={{
                        width: `${(u.n / usage[0].n) * 100}%`,
                        background: i === 0 ? "var(--sc-accent)" : "color-mix(in oklab, var(--sc-accent) 55%, var(--surface-2))",
                        transitionDelay: `${i * 60}ms`,
                      }}
                    />
                  </span>
                </li>
              ))}
            </ul>
            <p className="pl-5">{"},"}</p>
            {skills.map((g) => (
              <div key={g.category} className="pl-5">
                <span className="t-key">&quot;{key(g.category)}&quot;</span>: [
                <span className="inline">
                  {g.items.map((item, i) => (
                    <span key={item}>
                      <Str value={item} />
                      {i < g.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </span>
                ]{g.category === "Data & Tools" ? (
                  <>
                    ,
                    <p className="flex items-center gap-1">
                      <span className="t-key">&quot;$MAS&quot;</span>: <MasValue />
                    </p>
                  </>
                ) : (
                  ","
                )}
              </div>
            ))}
            <p>{"}"}</p>
          </div>
        </Window>
      </div>
    </section>
  );
}
