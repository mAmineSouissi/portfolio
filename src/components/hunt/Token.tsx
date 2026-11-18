"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useStore } from "@/lib/store";
import { TOKENS, collectToken, huntStore, type TokenId } from "@/lib/tokens";

export function Coin({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className="block">
      <circle cx="16" cy="16" r="15" fill="var(--sc-accent)" />
      <circle cx="16" cy="16" r="11.5" fill="none" stroke="var(--sc-canvas)" strokeOpacity=".45" strokeWidth="1.2" />
      <text
        x="16"
        y="20.5"
        textAnchor="middle"
        fontSize="12"
        fontWeight="800"
        fontFamily="var(--sc-font-display)"
        fill="var(--sc-canvas)"
      >
        M
      </text>
    </svg>
  );
}

export default function Token({
  id,
  size = 28,
  className = "",
  tabIndex,
}: {
  id: TokenId;
  size?: number;
  className?: string;
  tabIndex?: number;
}) {
  const { found, ready } = useStore(huntStore);
  const ref = useRef<HTMLButtonElement>(null);
  const n = TOKENS.findIndex((t) => t.id === id) + 1;

  if (!ready || found.includes(id)) return null;

  const onClick = () => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return collectToken(id);
    el.style.animation = "none";
    gsap.to(el, {
      scale: 1.8,
      rotationY: 540,
      autoAlpha: 0,
      duration: 0.7,
      ease: "power3.in",
      onComplete: () => collectToken(id),
    });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      tabIndex={tabIndex}
      data-cursor="hover"
      aria-label={`Collect hidden token ${n} of ${TOKENS.length}`}
      className={`token-coin inline-grid place-items-center rounded-full p-2 [perspective:400px] ${className}`}
    >
      <Coin size={size} />
    </button>
  );
}
