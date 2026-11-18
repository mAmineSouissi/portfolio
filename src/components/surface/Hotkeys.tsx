"use client";

import { useEffect } from "react";
import { hydrateHunt } from "@/lib/tokens";
import { techFilterStore } from "@/lib/store";

export default function Hotkeys() {
  useEffect(() => {
    hydrateHunt();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && techFilterStore.get()) techFilterStore.set(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
