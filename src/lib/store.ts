"use client";

import { useSyncExternalStore } from "react";

export type Store<T> = {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
  initial: T;
};

export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    initial,
    get: () => state,
    set: (next) => {
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      listeners.forEach((l) => l());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, () => store.initial);
}

/* ── Toasts ─────────────────────────────── */
export type Toast = { id: number; message: string };
export const toastStore = createStore<Toast[]>([]);
let toastId = 0;
export function toast(message: string) {
  const id = ++toastId;
  toastStore.set((t) => [...t, { id, message }]);
  setTimeout(() => toastStore.set((t) => t.filter((x) => x.id !== id)), 3200);
}

/* ── Tech filter ────────────────────────── */
export const techFilterStore = createStore<string | null>(null);
export function toggleTech(tech: string) {
  techFilterStore.set((cur) => (cur === tech ? null : tech));
}

/* ── Surface UI ─────────────────────────── */
export const walletOpenStore = createStore(false);
export const drawerStore = createStore(false);
/** Open project windows, last = front-most. */
export const peekStore = createStore<string[]>([]);
export const openPeek = (title: string) => peekStore.set((a) => [...a.filter((t) => t !== title), title]);
export const closePeek = (title: string) => peekStore.set((a) => a.filter((t) => t !== title));
/** Set when the visitor runs `hire` or `email`: the commit graph draws its final merge. */
export const mergedStore = createStore(false);
export const resumeOpenStore = createStore(false);
