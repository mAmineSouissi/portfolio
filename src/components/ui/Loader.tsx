"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/** Greeting the visitor from home first, then the rest of the world. */
const GREETINGS = [
  { text: "عسلامة", locale: "aeb-TN", lang: "aeb" },
  { text: "Aslema", locale: "aeb-Latn", lang: "aeb-Latn" },
  { text: "مرحبا", locale: "ar", lang: "ar" },
  { text: "Bonjour", locale: "fr", lang: "fr" },
  { text: "Hello", locale: "en", lang: "en" },
  { text: "Hola", locale: "es", lang: "es" },
  { text: "Ciao", locale: "it", lang: "it" },
  { text: "Hallo", locale: "de", lang: "de" },
  { text: "Olá", locale: "pt", lang: "pt" },
  { text: "Merhaba", locale: "tr", lang: "tr" },
  { text: "こんにちは", locale: "ja", lang: "ja" },
  { text: "你好", locale: "zh", lang: "zh" },
  { text: "Привет", locale: "ru", lang: "ru" },
];
/* How long each greeting holds: slow in, quick through the middle, slow out. */
const HOLDS = [0.5, 0.32, 0.22, 0.16, 0.12, 0.1, 0.1, 0.1, 0.11, 0.14, 0.18, 0.24, 0.34];
const IN = 0.55;
const OUT = 0.45;

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
    tl.fromTo(el, { "--lift": 0 }, { "--lift": 1, duration: 0.9, ease: "sine.inOut" }, 0);
    tl.fromTo(chrome, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power2.out", stagger: 0.08 }, 0.15);

    // greetings: each rises out of a blur and dissolves upward as the next arrives
    let t = 0.35;
    words.forEach((w, k) => {
      const g = GREETINGS[k];
      tl.call(setCode(`<span class="t-key">i18n</span>.<span class="t-fn">greet</span>(<span class="t-str">"${g.locale}"</span>)`), [], t);
      tl.fromTo(
        w,
        { autoAlpha: 0, yPercent: 35, filter: "blur(14px)", scale: 0.98 },
        // arrival always finishes inside its own hold, so it can never fight the exit
        { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", scale: 1, duration: Math.min(IN, HOLDS[k]), ease: "expo.out" },
        t
      );
      const outAt = t + HOLDS[k];
      if (k < words.length - 1) {
        // never longer than the next greeting's hold, so at most two words share the frame
        const out = Math.min(OUT, HOLDS[k + 1] * 0.95);
        tl.to(w, { autoAlpha: 0, yPercent: -30, filter: "blur(10px)", duration: out, ease: "power2.in" }, outAt);
        // the next greeting starts rising while this one dissolves: a crossfade, never a cut
        t = outAt;
      } else {
        t = outAt;
      }
    });
    const greetEnd = t;

    // progress runs on the same clock, continuously
    const prog = { v: 0 };
    tl.to(
      prog,
      {
        v: 100,
        duration: greetEnd - 0.35,
        ease: "power1.inOut",
        onUpdate: () => {
          count.textContent = String(Math.round(prog.v)).padStart(3, "0");
          bar.style.transform = `scaleX(${prog.v / 100})`;
        },
      },
      0.35
    );

    // the name: last greeting melts away, the name rises from behind a mask and settles
    const last = words[words.length - 1];
    tl.to(last, { autoAlpha: 0, yPercent: -30, filter: "blur(10px)", duration: OUT, ease: "power2.in" }, greetEnd);
    tl.call(setCode(`<span class="t-key">return</span> <span class="t-str">"welcome"</span>;`), [], greetEnd + 0.15);
    tl.set(name, { autoAlpha: 1 }, greetEnd + 0.2);
    tl.fromTo(
      nameInner,
      { yPercent: 110, filter: "blur(12px)", letterSpacing: "0.06em" },
      { yPercent: 0, filter: "blur(0px)", letterSpacing: "-0.035em", duration: 1.15, ease: "expo.out" },
      greetEnd + 0.2
    );

    // exit: hold, then a slow curtain lifts the whole frame away
    tl.addLabel("exit", greetEnd + 1.25);
    tl.to(name, { yPercent: -12, autoAlpha: 0, filter: "blur(6px)", duration: 0.7, ease: "power2.inOut" }, "exit");
    tl.to(chrome, { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, "exit");
    tl.fromTo(
      el,
      { clipPath: "inset(0% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 100% 0%)", duration: 1.05, ease: "expo.inOut" },
      "exit+=0.2"
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
              key={g.locale}
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
