# BRIEF: amine.dev workspace

**Status:** Partially interviewed. Topics 4 to 7 were answered directly in the
scroll-craft interview (2026-11-16). Topics 1, 3 and 8 come from the owner's own
words earlier in this project. Topic 2 and the energy curve are authored
decisions, labelled as such.

Owner: Mohamed Amine Souissi, full-stack developer (NestJS, React, Next.js,
React Native, Angular), software engineering student at ESPRIT, Tunisia.
Audience: recruiters and tech leads hiring for full-stack and mobile roles.

## The eight topics

1. **Vibe.** Owner, verbatim: "add a blockchain crypto guy genz design",
   "make the colors more clearer not bright ones", "make the text clearer, MUCH
   MORE CLEARER". References he supplied: hape.io (bronze on black, chaptered
   scroll, corner HUD, % loader) and recent.design. He asked for "a WOW to the
   recruiter" and said "i need to land a job get contact".
2. **Journey (authored).** He did not give a section order. Authored order:
   who he is, what is live, how it works underneath, where he has worked, what
   he works with, how to reach him.
3. **Energy curve (authored, from "make it looks like a story").** Calm open,
   rising through the work, one held quiet beat, the peak, then a steady,
   factual descent into a concrete action.
4. **Feeling and the one moment.** Interview answer: "Watching a request run".
5. **The one thing no site does.** Interview answer: "Scroll draws a commit
   graph".
6. **Range.** Interview answer: "Maximalist Gen-Z".
7. **One world or scenes.** Interview answer: "Live surface" (the page behaves
   like a real dev tool; distinct files, not one continuous camera flight).
8. **Assets.** Avatar illustration (`public/avatar.png`), real screenshots of
   three live sites (`public/projects/ktrait.jpg`, `idols.jpg`, `kibo.jpg`), CV
   (`public/resume.pdf`), project and career data (`src/lib/data.ts`). Owner,
   verbatim: "im a fucking student i can not afford that". No generation, no
   paid APIs. Everything ships on Vercel Hobby.

## Step 1 answers

- **What it is:** a portfolio for Amine, for people hiring developers.
- **What the visitor must believe by the end:** Amine ships real products end
  to end, backend included.
- **What the visitor does next:** email him. One label everywhere: **Email me**.
- **Art direction:** the world is the product surface itself (an editor
  workspace), not photography. Maximalist through density, layered windows,
  syntax colour as information, and stickers. Bronze stays the one interface
  accent.

## Journey

```
1  Recognition   a working editor, already open on a file about him
2  Proof         his live sites, real screenshots in a real browser pane
3  Anticipation  one quiet line: every screen above talks to a backend
4  Clarity       one request travels his architecture under the reader's hand
5  Trust         his career as a log file, dated, factual
6  Range         his stack as data, counted from the projects
7  Commitment    a prompt with a cursor in it
```

## Feeling curve

```
1  Curiosity      the page is an editor, open on about.md, windows overlapping
2  Confidence     scrolling switches the selected project; each one is a live URL
3  Anticipation   near-empty ground, one terminal line, nothing moving (AUTHORED SILENCE)
4  Awe -> clarity a chat message travels phone, gateway, database, dashboard as you scroll
5  Trust          the log prints his jobs line by line, real dates, no adjectives
6  Delight        the stack file counts itself up from his real project data
7  Resolve        the graph merges into main and a prompt waits for "hire"
```

Adjacent feelings all differ. Act 3 is deliberate silence, not dead scroll: the
verification pass should expect almost no change there.

## The peak

> "you scroll and literally watch a chat message go through his backend, from
> the phone to the database to the admin dashboard"

Lives in act 4 (`architecture.ts`). It gets the largest span on the page, the
silence of act 3 in front of it, and the build budget.

## Tell-someone sentence

> It's the site where you scroll and watch a message travel through his
> backend, and the whole visit gets drawn as a git history at the bottom.

## Signature move

**The visit as a commit graph.** A git graph is fixed along the bottom edge for
the whole page. Scroll position is the playhead. Every file you pass commits a
node that stays filled, the three featured projects branch off and merge back
while you are in `work.tsx`, and nodes are clickable, so the graph is also the
navigation. Running `hire` or `email` in the closing prompt draws a final merge
commit into main. Built page-local in React; the engine is untouched.
