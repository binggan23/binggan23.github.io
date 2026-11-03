# COOKIE · КОНСТРУКТ

个人档案式主页 — constructivist / non-objective / Soviet-print aesthetic, built with React 19, three.js, motion and Base UI.

**Live:** https://binggan23.github.io/

## Stack

- React 19 + TypeScript (strict) + Vite 8
- three.js 0.187 — procedural reactor (hero) and GLSL film strip, no textures
- motion 14 — scroll-linked choreography, pinned film stage
- lenis — smooth scroll
- Base UI — dialog/tooltip primitives
- WebAudio — fully synthesized UI sounds, plus a looping music bed (`public/audio/music-bed.mp3`) with a hand-rolled fade/duck ramp

## Scripts

```bash
pnpm dev         # local dev server
pnpm typecheck   # tsc --noEmit
pnpm build       # production build
pnpm preview     # serve dist on :4173
pnpm shoot       # playwright screenshot pass (needs preview running)
pnpm og          # regenerate public/og.png
```

## Structure

```
src/
  components/   ReactorStage, FilmField, InkField, Intro, Emblem, Cursor, Hud, ...
  sections/     Hero, Dossier, Manifesto, Interlude, Film, Arsenal, Terminal, Archive, Honors, Path, Contact
  styles/       tokens + base + per-band layers (site.css ... site6.css)
  lib/          sound engine, music bed, hooks
  data/         profile.ts — single source of truth for copy
```

Deployment: push to `main`; `.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
