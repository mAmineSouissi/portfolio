# DESIGN.md — Bronze Vault

Portfolio of Mohamed Amine Souissi, full-stack & mobile developer. Mode: **Experience**: the work leads, the interface recedes.

References: hape.io (bronze-on-black, film grain, extended uppercase display, chaptered scroll, corner HUD, % loader) and the Dries Bos portfolio (projects as a spreadsheet-style index). The crypto/NFT feel comes from *material and ritual* (bronze, grain, minting loader, token ticker), not neon.

## 1. Principles
1. **Readable first.** Body ≥17px, every text token ≥4.5:1 in both themes, no text under 12px.
2. **One accent.** Bronze is the only accent. `hot` (acid) is reserved for one thing: the live/available signal.
3. **A story in chapters.** Five chapters (Who, Work, Path, Stack, Talk). The HUD always shows where you are.
4. **Materials, not effects.** Grain, bronze light, and dark warmth. No gradient text, no glows, no glass as decoration.

## 2. Color tokens
| Token | Dark | Light | Use |
|---|---|---|---|
| `bg` | `#100e0c` | `#efe9df` | Page |
| `surface` | `#1a1714` | `#e6dfd2` | Cards, table hover |
| `surface-2` | `#24201b` | `#dcd3c4` | Pressed / keycaps |
| `fg` | `#f3ece2` | `#17130f` | Headings, primary text |
| `fg-secondary` | `#d8cfc2` | `#3a322a` | Body copy |
| `muted` | `#a89c8c` | `#5e5448` | Meta, labels |
| `accent` | `#c8924f` | `#82531f` | Bronze: links, chapter marks, CTA fill |
| `accent-strong` | `#e3b679` | `#6e4515` | Hover on accent |
| `hot` | `#c6ff3d` | `#3d6b00` | Live/available dot only |
| `line` | `rgba(243,236,226,.10)` | `rgba(23,19,15,.12)` | Rules, table borders |

Verified contrast (on `bg` / `surface`): dark fg 16.4/15.2, fg-2 12.5, muted 7.2/6.6, accent 7.1/6.5; light fg 15.3, fg-2 10.4, muted 6.1/5.6, accent ≥4.9/4.6. CTA text is `bg` on `accent` (7.1 dark, 4.9 light).

## 3. Typography
| Role | Font | Spec |
|---|---|---|
| Display | **Unbounded** 800 | UPPERCASE, tracking −0.03em, line-height 0.92, max 7.5rem |
| Heading | Unbounded 700 | sentence case allowed, 1.75–3rem |
| Body | **Archivo** (wdth 112, wght 400/500) | 1.0625rem / 1.7, measure 60–70ch |
| Data | **JetBrains Mono** 500 | 0.8125rem, tracking 0.04em; dates, chapter marks, index columns, tickers |

Mono is only for data: dates, counts, IDs, and keys. It is never used as decoration.

## 4. Space, shape, depth
- Spacing scale (rem): 0.25 · 0.5 · 0.75 · 1 · 1.5 · 2 · 3 · 4 · 6 · 8 · 12. Chapters are separated by 8–12rem.
- Radius: 14px cards, 999px pills/keycaps, 0 on tables.
- Elevation: only borders (`line`). Floating HUD gets one soft offset shadow `0 12px 32px -12px rgb(0 0 0 / .5)`.
- Grain: fixed full-screen SVG noise at 7% (dark) / 5% (light), `mix-blend-mode: overlay`, pointer-events none.

## 5. Components
- **Loader ("minting")**: full-screen `bg`, wordmark, a circular % ring counting 0→100, and the caption "Minting portfolio…". Shows once per session, ~1.4s, and is skipped under reduced motion.
- **TopBar**: wordmark `MA.S` top-left, round theme button and the "Available" sticker (hot dot) top-right.
- **HUD (bottom bar)**: left is the current chapter pill ("CH 02 / WORK"); centre reads `PRESS [ ← ] [ → ] TO SWITCH CHAPTER` with clickable keycaps; right is a progress counter `02 / 05`. Arrow keys move between chapters.
- **Chapter heading**: mono mark `CH 02 / WORK`, then an Unbounded display title, then a one-line body lede.
- **Ticker**: a mono marquee of `$TOKEN · n projects` derived from real project data. Only facts appear in it, never prices.
- **Featured card**: `surface`, 1px `line`, 14px radius. Year + status, Unbounded title, summary, description, tech pills, bronze CTA.
- **Index table**: columns `Year | Project | Type | Status | →`. Mono for year/status, rows divided by `line`, hover fills `surface`. Private rows expand in place (`button[aria-expanded]`).
- **Tech pill**: 1px `line`, mono 0.8rem, `fg-secondary`.
- **Buttons**: primary is `accent` fill with `bg` text; secondary is a 1px `line` outline with `fg` text. Both are pills.
- **Focus**: 2px `accent` outline, 3px offset, on everything focusable.

## 6. Motion
- Easing `cubic-bezier(.16,1,.3,1)`. Content is visible by default and animation only enhances it.
- One authored moment per chapter: hero lines rise; titles reveal word by word; the 3D camera orbits with scroll.
- 3D: a stack of bronze blocks (the "chain") under warm rim light, floating ember particles, and a camera scrubbed by scroll. Disabled under 640px and under reduced motion.
- Reduced motion: no loader, no marquee, no reveals (`transform` and `translate` both reset).
