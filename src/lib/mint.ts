"use client";

import { profile } from "./data";
import { TOKENS, type HuntState } from "./tokens";

export const CARD_W = 600;
export const CARD_H = 840;

type Palette = {
  name: string;
  weight: number;
  points: number;
  bg: [string, string];
  metal: [string, string, string];
};

const PALETTES: Palette[] = [
  { name: "Bronze", weight: 40, points: 0, bg: ["#21170e", "#0b0806"], metal: ["#e8bd84", "#c8924f", "#6e4a22"] },
  { name: "Copper", weight: 25, points: 1, bg: ["#24120b", "#0c0605"], metal: ["#f3ad86", "#c46a3f", "#5e2a14"] },
  { name: "Gold", weight: 20, points: 2, bg: ["#211a08", "#0b0903"], metal: ["#ffe69a", "#d9a92e", "#6f500e"] },
  { name: "Patina", weight: 10, points: 3, bg: ["#0f1a15", "#050a08"], metal: ["#aee8d0", "#4f9e86", "#1d4a40"] },
  { name: "Obsidian", weight: 5, points: 4, bg: ["#121214", "#030303"], metal: ["#e7e2da", "#8a847c", "#2a2725"] },
];

export type Trait = { label: string; value: string };
export type Mint = {
  hash: string;
  palette: Palette;
  traits: Trait[];
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  card: number;
  mintedAt: number;
};

export async function mintFromHunt(s: HuntState): Promise<Mint | null> {
  if (s.card === null || s.mintedAt === null) return null;
  const times = TOKENS.map((t) => s.foundAt[t.id] ?? 0);
  const seed = `${s.card}|${times.join(",")}|${s.mintedAt}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
  const hash = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");

  const roll = parseInt(hash.slice(0, 4), 16) % 100;
  let acc = 0;
  const palette = PALETTES.find((p) => (acc += p.weight) > roll) ?? PALETTES[0];

  const known = times.filter(Boolean);
  const span = known.length > 1 ? Math.max(...known) - Math.min(...known) : 0;
  const mins = Math.floor(span / 60000);
  const secs = Math.floor((span % 60000) / 1000);
  const timing = span < 3 * 60000 ? "Speedrunner" : span < 10 * 60000 ? "Steady hand" : "Explorer";

  const hour = new Date(s.mintedAt).getHours();
  const hourTrait = hour < 5 ? "Night Owl" : hour < 9 ? "Early Bird" : hour < 18 ? "Daylight" : "Evening";

  const points =
    palette.points + (timing === "Speedrunner" ? 2 : 0) + (s.hintsUsed ? 0 : 1) + (hourTrait === "Night Owl" ? 1 : 0);
  const rarity = points >= 6 ? "Legendary" : points >= 4 ? "Epic" : points >= 2 ? "Rare" : "Common";

  return {
    hash,
    palette,
    rarity,
    card: s.card,
    mintedAt: s.mintedAt,
    traits: [
      { label: "Metal", value: palette.name },
      { label: "Hunt time", value: `${timing} · ${mins}m ${String(secs).padStart(2, "0")}s` },
      { label: "Minted", value: hourTrait },
      { label: "Hints", value: s.hintsUsed ? "Used" : "None" },
    ],
  };
}

function prng(hash: string) {
  let a = parseInt(hash.slice(8, 16), 16) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function cube(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  s: number,
  [light, mid, dark]: [string, string, string],
  flip: boolean
) {
  const h = s * 0.58;
  const faces: [string, [number, number][]][] = [
    [light, [[x, y - h], [x + s, y], [x, y + h], [x - s, y]]],
    [flip ? dark : mid, [[x - s, y], [x, y + h], [x, y + h + s], [x - s, y + s]]],
    [flip ? mid : dark, [[x + s, y], [x, y + h], [x, y + h + s], [x + s, y + s]]],
  ];
  for (const [fill, pts] of faces) {
    ctx.beginPath();
    pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function fontVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export async function drawCard(canvas: HTMLCanvasElement, m: Mint, scale = 2) {
  await document.fonts.ready;
  canvas.width = CARD_W * scale;
  canvas.height = CARD_H * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(scale, scale);
  const rand = prng(m.hash);
  const [light, mid, dark] = m.palette.metal;
  const display = fontVar("--font-archivo", "sans-serif");
  const mono = fontVar("--font-jetbrains", "monospace");
  const sans = fontVar("--font-archivo", "sans-serif");

  // background
  const bg = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
  bg.addColorStop(0, m.palette.bg[0]);
  bg.addColorStop(1, m.palette.bg[1]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // light source
  const lx = 120 + rand() * 360;
  const ly = 120 + rand() * 260;
  const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, 380);
  glow.addColorStop(0, mid + "66");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // coin rings
  const rings = 3 + Math.floor(rand() * 5);
  ctx.strokeStyle = light + "22";
  for (let i = 1; i <= rings; i++) {
    ctx.beginPath();
    ctx.arc(CARD_W / 2, 300, 40 + i * 32, 0, Math.PI * 2);
    ctx.lineWidth = i % 2 ? 1 : 2;
    ctx.stroke();
  }

  // the chain: five blocks, one per token
  const flip = lx > CARD_W / 2;
  const pts = Array.from({ length: 5 }, (_, i) => ({
    x: 140 + i * 82 + (rand() - 0.5) * 24,
    y: 430 - i * 64 + (rand() - 0.5) * 22,
    s: 28 + rand() * 12,
  }));
  ctx.strokeStyle = light + "aa";
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.stroke();
  ctx.setLineDash([]);
  pts.forEach((p) => cube(ctx, p.x, p.y, p.s, [light, mid, dark], flip));

  // grain
  for (let i = 0; i < 4500; i++) {
    ctx.fillStyle = rand() > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.09)";
    ctx.fillRect(rand() * CARD_W, rand() * CARD_H, 1.4, 1.4);
  }

  // frame
  ctx.strokeStyle = mid;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(16, 16, CARD_W - 32, CARD_H - 32, 20);
  ctx.stroke();

  // header
  ctx.fillStyle = "#f3ece2";
  ctx.font = `500 14px ${mono}`;
  ctx.textBaseline = "top";
  ctx.fillText("MA.S COLLECTIVE", 40, 40);
  ctx.textAlign = "right";
  ctx.fillStyle = light;
  ctx.fillText(`NO. ${String(m.card).padStart(4, "0")}`, CARD_W - 40, 40);
  ctx.fillText(m.rarity.toUpperCase(), CARD_W - 40, 62);
  ctx.textAlign = "left";

  // name
  ctx.fillStyle = "#f3ece2";
  ctx.font = `800 54px ${display}`;
  ctx.fillText("AMINE", 40, 520);
  ctx.fillText("SOUISSI", 40, 574);
  ctx.fillStyle = light;
  ctx.font = `500 18px ${sans}`;
  ctx.fillText(`${profile.role} · ${profile.location}`, 40, 640);

  // traits
  ctx.font = `500 13px ${mono}`;
  m.traits.forEach((t, i) => {
    const y = 682 + i * 24;
    ctx.fillStyle = "rgba(243,236,226,0.6)";
    ctx.fillText(t.label.toUpperCase(), 40, y);
    ctx.fillStyle = "#f3ece2";
    ctx.fillText(t.value, 180, y);
  });

  ctx.fillStyle = "rgba(243,236,226,0.5)";
  ctx.font = `500 11px ${mono}`;
  ctx.fillText(`0x${m.hash.slice(0, 10)}…${m.hash.slice(-8)}`, 40, CARD_H - 52);
  ctx.textAlign = "right";
  ctx.fillText(new Date(m.mintedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), CARD_W - 40, CARD_H - 52);
  ctx.textAlign = "left";
}
