"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/** Greeting the visitor from home first, then the rest of the world. */
const GREETINGS = [
  { text: "عسلامة", lang: "aeb" },
  { text: "Bonjour", lang: "fr" },
  { text: "Hello", lang: "en" },
  { text: "Hola", lang: "es" },
  { text: "こんにちは", lang: "ja" },
];
/* Even, unhurried rhythm: fast swaps read as flicker, not as cinema. */
const HOLD = 0.4;
const IN = 0.65; // longer than HOLD, so each word dissolves into the next
const OUT = 0.4; // <= HOLD keeps two words on screen at most; HOLD + OUT >= IN so an arrival never outlives its exit

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-minted")) {
      setDone(true);
      return;
    }
    const el = root.current;
    if (!el) return;

    const code = el.querySelector<HTMLElement>("[data-code]")!;
    const words = gsap.utils.toArray<HTMLElement>("[data-greet]", el);
    const name = el.querySelector<HTMLElement>("[data-name]")!;
    const nameInner = el.querySelector<HTMLElement>("[data-name-inner]")!;
    const bar = el.querySelector<HTMLElement>("[data-bar]")!;
    const count = el.querySelector<HTMLElement>("[data-count]")!;
    const chrome = el.querySelectorAll<HTMLElement>("[data-chrome]");

    const setCode = (html: string) => () => {
      gsap.fromTo(code, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out", overwrite: true });
      code.innerHTML = html;
    };

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        sessionStorage.setItem("minted", "1");
        setDone(true);
      },
    });

    // opening: the frame breathes in from black
    tl.fromTo(el, { "--lift": 0 }, { "--lift": 1, duration: 1.2, ease: "sine.inOut" }, 0);
    tl.fromTo(chrome, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.1);
    tl.call(setCode(`<span class="t-key">const</span> hello = <span class="t-fn">greet</span>(<span class="t-str">"world"</span>);`), [], 0.2);

    // greetings: each rises out of a blur and dissolves upward as the next arrives
    let t = 0.3;
    words.forEach((w, k) => {
      tl.fromTo(
        w,
        { autoAlpha: 0, yPercent: 18, filter: "blur(8px)" },
        { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: IN, ease: "power2.out" },
        t
      );
      t += HOLD;
      if (k < words.length - 1) {
        tl.to(w, { autoAlpha: 0, yPercent: -14, filter: "blur(8px)", duration: OUT, ease: "power2.inOut" }, t);
      }
    });
    const greetEnd = t;

    // progress runs on the same clock, continuously
    const prog = { v: 0 };
    tl.to(
      prog,
      {
        v: 100,
        duration: greetEnd - 0.3,
        ease: "power1.inOut",
        onUpdate: () => {
          count.textContent = String(Math.round(prog.v)).padStart(3, "0");
          bar.style.transform = `scaleX(${prog.v / 100})`;
        },
      },
      0.3
    );

    // the name: last greeting melts away, the name rises from behind a mask and settles
    const last = words[words.length - 1];
    tl.to(last, { autoAlpha: 0, yPercent: -14, filter: "blur(8px)", duration: OUT, ease: "power2.inOut" }, greetEnd);
    tl.call(setCode(`<span class="t-key">return</span> <span class="t-str">"welcome"</span>;`), [], greetEnd + 0.15);
    tl.set(name, { autoAlpha: 1 }, greetEnd + 0.2);
    tl.fromTo(
      nameInner,
      { yPercent: 110, filter: "blur(12px)", letterSpacing: "0.06em" },
      { yPercent: 0, filter: "blur(0px)", letterSpacing: "-0.035em", duration: 0.8, ease: "expo.out" },
      greetEnd + 0.2
    );

    // exit: hold, then a slow curtain lifts the whole frame away
    tl.addLabel("exit", greetEnd + 0.85);
    tl.to(name, { yPercent: -12, autoAlpha: 0, filter: "blur(6px)", duration: 0.7, ease: "power2.inOut" }, "exit");
    tl.to(chrome, { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, "exit");
    tl.fromTo(
      el,
      { clipPath: "inset(0% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "expo.inOut" },
      "exit+=0.15"
    );

    const skip = () => {
      if (tl.time() < tl.labels.exit) tl.seek("exit");
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      tl.kill();
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading Mohamed Amine Souissi's portfolio"
      className="loader fixed inset-0 z-[1100] grid place-items-center overflow-hidden bg-[var(--sc-canvas)]"
    >
      {/* a slow warm light that rises with the opening */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, color-mix(in oklab, var(--sc-accent) 30%, transparent), transparent 65%)",
          opacity: "calc(var(--lift, 0) * 0.55)",
          transform: "translate(-50%, -50%) scale(calc(0.8 + var(--lift, 0) * 0.2))",
        }}
      />

      <div className="relative flex w-full flex-col items-center px-6 text-center">
        <p data-code className="mono invisible mb-6 h-5 text-[0.85rem] text-[var(--sc-ink-soft)]" aria-hidden />

        <div className="relative grid h-[clamp(4rem,13vw,10rem)] w-full place-items-center">
          {GREETINGS.map((g) => (
            <span
              key={g.lang}
              data-greet
              lang={g.lang}
              dir="auto"
              className="headline invisible absolute text-[clamp(3rem,11vw,8rem)] text-[var(--sc-ink)] will-change-[transform,filter,opacity]"
            >
              {g.text}
            </span>
          ))}
          <span data-name className="invisible absolute overflow-hidden pb-[0.12em]">
            <span data-name-inner className="headline block text-[clamp(2.6rem,9vw,7rem)] text-[var(--sc-ink)] will-change-transform">
              Hi, I&apos;m <span className="text-[var(--sc-accent)]">Amine</span>.
            </span>
          </span>
        </div>
      </div>

      <div data-chrome className="invisible absolute inset-x-0 bottom-[10vh] flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <span className="relative block h-px w-48 overflow-hidden bg-[var(--sc-hairline-strong)]" aria-hidden>
            <span data-bar className="absolute inset-0 origin-left bg-[var(--sc-accent)]" style={{ transform: "scaleX(0)" }} />
          </span>
          <span data-count className="mono w-8 text-[0.8rem] tabular-nums text-[var(--sc-ink)]">
            000
          </span>
        </div>
        <p className="mono text-[0.75rem] text-[var(--sc-ink-soft)]">Full-stack developer · opening workspace · click to skip</p>
      </div>
    </div>
  );
}
