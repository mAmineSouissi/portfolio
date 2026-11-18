# PLAN: grammar, gate, score

## Grammar: Live surface (2.3)

The honest pitch for a developer is "watch what he builds", which is this
grammar's definition. Why the other seven lost:

- **Filmic one-shot:** a marketing film about a developer says nothing about
  code. Also the template every prior build drifted into.
- **Chaptered editorial:** the previous version of this site. Reads, does not demonstrate.
- **Continuous world:** no real geography to travel. A world for its own sake is decoration.
- **Typographic poster:** throws away the strongest assets (live sites, real architecture).
- **Gallery / catalog:** fits the project list but not the peak. A request travelling a system is an operation, not an object.
- **Split stage:** there is no two-sided argument.
- **Rhythmic cutlist:** bans pin, and the peak needs a held stage.

Constraints honoured: app chrome replaces nav (title bar with file tabs, side
explorer, status bar). No marketing bar, no scrims, no full-bleed photography,
no kinetic headline stacks, no scroll cue. Bans: `scrub`, `kinetic`,
`spotlight`, `drift` past two stops. Copy lives in the surface idiom: file
names, comments, log lines, labels, a prompt. Hero is the surface already in a
state. Close is an actual input.

**Honesty rule:** every panel computes from real arrays in `src/lib/data.ts`
and `src/lib/systems.ts`. The architecture flows are labelled as a walkthrough
drawn from the project descriptions. Screenshots are real captures of live
sites. The prompt parses real commands with real outcomes (open a project,
download the CV, compose an email). No painted terminals.

## Fingerprint gate

Registry `scrollcraft/FINGERPRINTS.md` is empty, so the gate passes trivially.
Recorded honestly: this is the first build.

## Score

| # | File (act) | Feeling | Device | Span | Why this device |
|---|---|---|---|---|---|
| 1 | about.md | Curiosity | `flow` + layered planes + pointer | natural | The surface is already in a state; depth comes from overlapping windows moving at different rates |
| 2 | work.tsx | Confidence | `pin` (selection from `--sc-p`) + `reveal` on screenshot swap | 2.4 | The panel holds while its selection advances, like operating a file browser |
| 3 | trace (quiet) | Anticipation | `flow`, one line, nothing else | natural, short | Authored silence before the peak |
| 4 | architecture.ts | Awe, clarity | `pin`, packet position and log from `--sc-p` | **4.4 (largest)** | The surface holds while three requests (chat, sign in, file upload) travel every route, under the reader's hand |
| 5 | career.log | Trust | `flow` + `in` (lines append with stagger) | natural | A log prints; it does not perform |
| 6 | stack.json | Delight | `count` (real per-tech project counts) | natural | Numbers bloom from data the visitor can check |
| 7 | contact.sh | Resolve | `pin`, greet-and-hold ground, real input | 1.3 | The page stops moving and hands over a cursor |

Checks: families used are flow, pin, reveal, in, count (five). No family twice
in a row (1 flow, 2 pin, 3 flow, 4 pin, 5 flow+in, 6 count, 7 pin). Zero
`scrub`. Peak span 4.4 against a next-largest of 2.4. Seven acts, roughly 11
viewport-heights in total, outside the 13.6 to 13.8 band.

## Hero layer contract (about.md)

| Plane | What | Movement | Rule |
|---|---|---|---|
| Far | Workspace canvas with grain and one warm light falloff | none / slowest | Never competes with type |
| Mid | Editor window, `about.md`, real `<h1>` inside | slowest scroll rate | Holds the headline, always readable |
| Focal | Preview window: avatar, availability, Email me | moderate, overlaps editor | Overlap is the depth cue |
| Near | Stickers (hackathon 3rd place, open to work) | strongest, slight rotation | Frames the preview, never covers the h1 |
| Type & controls | Semantic HTML in the editor and preview | stable | Name, role, one line, one action visible without scrolling |

Opening: windows stacked with clear overlap. Midpoint: planes separate as the
editor recedes. Exit: the explorer selection moves to `work.tsx`. Mobile:
preview window first, editor below, stickers smaller, no pointer parallax.

## Palette and type

Two families: **Archivo** (UI and prose; width 112 for text, expanded black for
the one headline) and **JetBrains Mono** (code, file names, log lines, data).
Bronze is the one interface accent. Syntax colours appear only on code tokens,
where colour is information. Light theme re-inks every role, including syntax.
