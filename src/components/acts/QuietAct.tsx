/** Authored silence before the peak. Almost nothing on purpose (see BRIEF.md). */
export default function QuietAct() {
  return (
    <section data-sc-act="flow" aria-label="Transition to the architecture walkthrough" className="act-pad flex min-h-[70svh] items-center">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mono text-[clamp(1rem,1.6vw,1.2rem)]" data-sc-in>
          <span className="text-[var(--sc-accent)]">$</span> trace <span className="t-key">--project</span>{" "}
          <span className="t-str">reborn</span> <span className="t-key">--request</span>{" "}
          <span className="t-str">&quot;send a chat message&quot;</span>
        </p>
        <p className="mt-4 max-w-[46ch] text-[clamp(1.15rem,2vw,1.5rem)] text-[var(--sc-ink-soft)]" data-sc-in>
          Every screen above talks to a backend. Keep scrolling and watch one request go through it.
        </p>
      </div>
    </section>
  );
}
