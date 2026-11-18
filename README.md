# Mohamed Amine Souissi · Portfolio

**Live:** https://portfolio-psi-one-11.vercel.app

The portfolio of a full-stack developer from Tunisia, built as a working IDE instead of a page.

## What's inside

- **IDE workspace.** It has a title bar with file tabs, a sidebar explorer and a status bar. Every section is a "file".
- **Real windows.** Drag them by the title bar. The traffic lights reset, minimize and maximize.
- **Live demos inside the page.** Projects run in an embedded browser, so you can scroll and click the real sites without leaving the portfolio.
- **Architecture walkthrough.** Scrolling plays a request through each system, edge by edge, until every route is covered.
- **Command palette.** Press `⌘K` / `Ctrl K` to jump to files and projects, open the résumé or copy the email.
- **Terminal contact.** A real prompt with real commands. Type `help`.
- **Token hunt.** Five hidden tokens unlock a generated collectible card, shown in 3D where WebGL allows.
- **Cinematic preloader.** Greetings in thirteen languages, starting with Tunisian Arabic.

## Stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) and React 19 |
| Language and styles | TypeScript and Tailwind CSS v4 |
| Animation | GSAP, plus a small vanilla scroll engine (`public/scrollcraft`) |
| 3D | three.js via react-three-fiber and drei |
| Hosting | Vercel, with Vercel Analytics |

## Run it locally

```bash
yarn install
yarn dev     # http://localhost:3000
yarn build   # production build
yarn lint
```

## Layout

```
src/app/              layout, page, OG image, sitemap, robots
src/components/acts/  one component per section (about, work, architecture…)
src/components/surface/  IDE chrome: windows, palette, sidebar, overlays
src/components/hunt/  token hunt and the collectible card
src/lib/              content (data.ts, systems.ts), stores, helpers
```

All content lives in `src/lib/data.ts` and `src/lib/systems.ts`.

## Contact

aminesouissi682@gmail.com · [GitHub](https://github.com/mAmineSouissi)
