"use client";

import { createStore, toast } from "./store";

export const TOKENS = [
  { id: "who", hint: "Look behind the preview window.", where: "about.md" },
  { id: "work", hint: "There's gold in the bot. Try the projects/ folder.", where: "projects/" },
  { id: "arch", hint: "Wait for the request to land.", where: "architecture.ts" },
  { id: "path", hint: "Every chain has a genesis.", where: "career.log" },
  { id: "stack", hint: "Check the toolbox.", where: "stack.json" },
] as const;

export type TokenId = (typeof TOKENS)[number]["id"];

export type HuntState = {
  found: TokenId[];
  foundAt: Partial<Record<TokenId, number>>;
  card: number | null;
  mintedAt: number | null;
  hintsUsed: boolean;
  ready: boolean;
};

const EMPTY: HuntState = {
  found: [],
  foundAt: {},
  card: null,
  mintedAt: null,
  hintsUsed: false,
  ready: false,
};

const KEY = "mas-token-hunt";
export const huntStore = createStore<HuntState>(EMPTY);

function persist(s: HuntState) {
  localStorage.setItem(KEY, JSON.stringify({ ...s, ready: undefined })); // undefined drops the key
}

export function hydrateHunt() {
  if (huntStore.get().ready) return;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    const valid = TOKENS.map((t) => t.id) as string[];
    const found = (Array.isArray(raw.found) ? raw.found : []).filter((id: string) =>
      valid.includes(id)
    ) as TokenId[];
    huntStore.set({
      found,
      foundAt: raw.foundAt && typeof raw.foundAt === "object" ? raw.foundAt : {},
      card: typeof raw.card === "number" ? raw.card : null,
      mintedAt: typeof raw.mintedAt === "number" ? raw.mintedAt : null,
      hintsUsed: raw.hintsUsed === true,
      ready: true,
    });
  } catch {
    huntStore.set({ ...EMPTY, ready: true });
  }
}

function update(next: HuntState) {
  huntStore.set(next);
  persist(next);
}

export function collectToken(id: TokenId) {
  const s = huntStore.get();
  if (s.found.includes(id)) return;
  const now = Date.now();
  const found = TOKENS.map((t) => t.id).filter((t) => t === id || s.found.includes(t));
  const complete = found.length === TOKENS.length;
  update({
    ...s,
    found,
    foundAt: { ...s.foundAt, [id]: now },
    card: complete && s.card === null ? Math.floor(1000 + Math.random() * 9000) : s.card,
    mintedAt: complete && s.mintedAt === null ? now : s.mintedAt,
  });
  toast(
    complete
      ? "Chain complete. Open your wallet to mint the card."
      : `Block ${found.length} of ${TOKENS.length} mined. Added to the chain.`
  );
}

export function markHintsUsed() {
  const s = huntStore.get();
  if (!s.hintsUsed) update({ ...s, hintsUsed: true });
}

export function resetHunt() {
  update({ ...EMPTY, ready: true });
}
