"use client";

import { resumeOpenStore } from "@/lib/store";

import Image from "next/image";
import { useRef } from "react";
import { awards, profile } from "@/lib/data";
import Token from "@/components/hunt/Token";
import Window from "@/components/surface/Window";

export default function AboutAct() {
  const root = useRef<HTMLElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = root.current!.getBoundingClientRect();
    root.current!.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    root.current!.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

  return (
    <section
      id="about"
      data-file="about"
      data-sc-act="flow"
      ref={root}
      onPointerMove={onMove}
      className="act-pad relative flex min-h-svh items-center overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] -top-[30%] h-[90vh] w-[90vh] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--sc-accent) 35%, transparent), transparent 65%)" }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:block lg:min-h-[34rem]">
        {/* mid plane: the editor, holding the real h1 */}
        <div
          data-sc-parallax="-0.05"
          className="relative z-10 order-2 lg:absolute lg:left-0 lg:top-0 lg:w-[66%]"
          style={{ translate: "calc(var(--mx, 0) * -8px) calc(var(--my, 0) * -6px)" }}
        >
          <Window title="about.md" right={<span className="t-com">markdown</span>} path={["portfolio", "about.md"]}>
          <div className="code grid grid-cols-[2.25rem_1fr] gap-x-4 px-4 py-5 sm:px-6 sm:py-7">
            <span className="gutter" aria-hidden>1</span>
            <p className="t-com">{"<!-- about.md -->"}</p>
            <span className="gutter" aria-hidden>2</span>
            <h1 className="headline py-2 text-[clamp(2.1rem,6.4vw,5.4rem)] text-[var(--sc-ink)]">
              <span className="t-key mono align-top text-[0.35em] font-normal tracking-normal" aria-hidden>
                #{" "}
              </span>
              Mohamed Amine Souissi
            </h1>
            <span className="gutter" aria-hidden>3</span>
            <p className="font-sans text-[clamp(1.1rem,1.8vw,1.4rem)] leading-snug text-[var(--sc-ink)] lg:pr-44">
              <span className="t-key mono" aria-hidden>
                {"> "}
              </span>
              Full-stack developer. I ship web and mobile products end to end, from the NestJS API to the last animation.
            </p>
            <span className="gutter" aria-hidden>4</span>
            <span />
            <span className="gutter" aria-hidden>5</span>
            <p>
              <span className="t-key">- </span>
              <span className="t-fn">based</span>: <span className="t-str">{profile.location}</span>
            </p>
            <span className="gutter" aria-hidden>6</span>
            <p>
              <span className="t-key">- </span>
              <span className="t-fn">studying</span>: <span className="t-str">{profile.education.degree}, {profile.education.school}</span>
            </p>
            <span className="gutter" aria-hidden>7</span>
            <p>
              <span className="t-key">- </span>
              <span className="t-fn">open_to</span>: <span className="t-str">full-stack and mobile roles</span>
            </p>
            <span className="gutter" aria-hidden>8</span>
            <p>
              <span className="t-key">- </span>
              <span className="t-fn">speaks</span>:{" "}
              <span className="t-str">{profile.languages.map((l) => l.name).join(", ")}</span>
            </p>
          </div>
          </Window>
        </div>

        {/* focal plane: the preview window, overlapping the editor */}
        <div
          data-sc-parallax="-0.14"
          className="relative z-20 order-1 lg:absolute lg:right-0 lg:top-[50%] lg:w-[38%]"
          style={{ translate: "calc(var(--mx, 0) * 14px) calc(var(--my, 0) * 10px)" }}
        >
          <div className="relative">
            <span className="absolute -left-4 -top-5 z-0 hidden lg:block">
              <Token id="who" size={26} />
            </span>
            <div className="pointer-events-none relative z-10 lg:rotate-[1.5deg]">
              <Window title="preview: about.md" className="pointer-events-auto">
              <div className="flex flex-col gap-5 p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={profile.avatar}
                    alt={`Illustrated portrait of ${profile.name}`}
                    width={72}
                    height={72}
                    priority
                    className="dark-invert h-[72px] w-[72px] rounded-full border border-[var(--sc-hairline-strong)] bg-[var(--surface-2)] object-cover"
                  />
                  <div>
                    <p className="text-lg font-bold leading-tight">{profile.name}</p>
                    <p className="mt-1 flex items-center gap-2 text-[var(--sc-ink-soft)]">
                      <span className="hot-dot" aria-hidden /> Open to work · {profile.role}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href={`mailto:${profile.email}`} className="btn btn--primary">
                    Email me
                  </a>
                  <a href={profile.resumeUrl} onClick={(e) => { e.preventDefault(); resumeOpenStore.set(true); }} className="btn btn--ghost">
                    resume.pdf
                  </a>
                </div>
                <Token id="who" size={24} className="lg:hidden" />
              </div>
              </Window>
            </div>
          </div>
        </div>

        {/* near plane: stickers */}
        <div
          data-sc-parallax="-0.26"
          className="order-3 flex flex-wrap gap-3 lg:pointer-events-none lg:absolute lg:bottom-[-2rem] lg:left-[46%] lg:z-30 lg:block"
          style={{ translate: "calc(var(--mx, 0) * 26px) calc(var(--my, 0) * 18px)" }}
        >
          <span className="sticker sticker--lime lg:absolute lg:left-0 lg:top-0 lg:-rotate-6">
            3rd place · {awards[0]?.context.split("·")[0].trim()} {awards[0]?.year.split(" ").at(-1)}
          </span>
          <span className="sticker sticker--pink lg:absolute lg:left-[13rem] lg:top-[2.4rem] lg:rotate-3">web + mobile</span>
          <span className="sticker sticker--cyan lg:absolute lg:left-[22rem] lg:-top-1 lg:-rotate-2">NestJS · React Native</span>
        </div>
      </div>
    </section>
  );
}
