"use client";

import { certifications, experience, type Experience } from "@/lib/data";
import { techFilterStore, useStore } from "@/lib/store";
import TechList from "@/components/ui/TechList";
import Token from "@/components/hunt/Token";
import Window from "@/components/surface/Window";

const iso = (period: string) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [m, y] = period.split(" ").slice(0, 2);
  return `${y}-${String(months.indexOf(m) + 1).padStart(2, "0")}`;
};

function Line({ job, genesis }: { job: Experience; genesis: boolean }) {
  const filter = useStore(techFilterStore);
  const dim = filter !== null && !job.tech.includes(filter);

  return (
    <li className="border-b border-[var(--sc-hairline)]">
      <div className={`grid gap-x-5 gap-y-2 py-5 transition-opacity sm:grid-cols-[6.5rem_1fr] ${dim ? "dim-filtered" : ""}`}>
      <div className="mono text-[0.85rem]">
        <p className="t-num">{iso(job.period)}</p>
        <p className="t-com">{genesis ? "genesis" : "INFO"}</p>
        {genesis && <Token id="path" size={22} className="-ml-2 mt-1" />}
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-snug">
          {job.role} <span className="font-normal text-[var(--sc-ink-soft)]">at</span>{" "}
          <span className="text-[var(--sc-accent)]">{job.company}</span>
        </p>
        <p className="mono mt-0.5 text-[0.8rem] text-[var(--sc-ink-soft)]">{job.period}</p>
        <p className="mt-2 max-w-[68ch] text-[var(--sc-ink-soft)]">{job.description}</p>
        <div className="mt-3">
          <TechList tech={job.tech} />
        </div>
      </div>
      </div>
    </li>
  );
}

export default function CareerAct() {
  return (
    <section id="career" data-file="career" data-sc-act="flow" className="act-pad">
      <div className="mx-auto w-full max-w-6xl">
        <Window title="career.log" right={<span className="t-com">tail -n {experience.length}</span>} path={["portfolio", "career.log"]}>
          <div className="px-4 pt-6 sm:px-7">
            <h2 className="headline text-[clamp(1.8rem,3.8vw,3rem)]">Five teams since 2023.</h2>
            <p className="mono mt-2 text-[0.85rem] t-com">{"// newest first · click a tool to highlight where I used it"}</p>
          </div>
          <ol className="px-4 pb-2 sm:px-7" data-sc-in data-sc-stagger="70">
            {experience.map((job, i) => (
              <Line key={job.company} job={job} genesis={i === experience.length - 1} />
            ))}
          </ol>
          <ul className="px-4 pb-4 sm:px-7">
            {certifications.map((c) => (
              <li key={c.url} className="grid gap-x-5 gap-y-1 border-b border-[var(--sc-hairline)] py-5 last:border-0 sm:grid-cols-[6.5rem_1fr]">
                <p className="mono text-[0.85rem]">
                  <span className="t-num block">{c.date}</span>
                  <span className="t-str">CERT</span>
                </p>
                <p className="min-w-0">
                  <span className="text-lg font-bold">{c.title}</span>{" "}
                  <span className="text-[var(--sc-ink-soft)]">by</span> <span className="text-[var(--sc-accent)]">{c.issuer}</span>
                  <a href={c.url} target="_blank" rel="noreferrer" className="mono ml-3 text-[0.8rem] text-[var(--sc-ink-soft)] underline-offset-4 hover:text-[var(--sc-ink)] hover:underline">
                    verify ↗
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </Window>
      </div>
    </section>
  );
}
