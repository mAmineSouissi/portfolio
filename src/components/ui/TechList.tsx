"use client";

import { techFilterStore, toggleTech, useStore } from "@/lib/store";

export default function TechList({ tech, size = "sm" }: { tech: readonly string[]; size?: "sm" | "md" }) {
  const active = useStore(techFilterStore);

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
      {tech.map((t) => {
        const on = active === t;
        return (
          <li key={t}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => toggleTech(t)}
              title={on ? `Clear ${t} filter` : `Highlight everything built with ${t}`}
              data-cursor="hover"
              className={`tech-pill ${size === "md" ? "!px-3 !text-[0.85rem]" : ""}`}
            >
              {t}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
