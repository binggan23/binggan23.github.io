# КОНСТРУКТ — Design Brief

> Personal site of **COOKIE** (@binggan23). A constructivist agit-prop poster turned into a machine.
> Stack: React 19 · Vite 8 · TypeScript · three.js · Motion (motion.dev) · Base UI · Lenis.

---

## 1. Concept

A single continuous **wall**, not a stack of sections. Everything lives on one printed surface:
paper, ink, vermilion, hairline rules, diagonal beams, huge numerals, rotated labels, stencil stamps.
The page behaves like a machine that assembles itself as you scroll: type slides into registration,
rules draw themselves, the 3D monolith rotates behind the paper, cards are pinned and shuffled.

**Never**: rounded-corner SaaS cards, glassmorphism, gradient buttons, centered-everything hero,
emoji icons, purple/dark-mode-neon, generic fade-up-everything.

**Always**: asymmetry, diagonal composition, oversized type, visible grid, honest materials
(paper texture, ink, halftone), one accent color used with discipline.

## 2. Palette

| token | value | usage |
|---|---|---|
| `--paper` | `#E9E1D2` | base surface (aged paper) |
| `--paper-2` | `#F3ECDF` | raised paper |
| `--ink` | `#16130F` | text, rules, fills |
| `--ink-2` | `#3A342B` | secondary text |
| `--red` | `#DA2C1F` | THE accent: beams, numerals, active states |
| `--red-deep` | `#9E1B12` | hover / shadow of red |
| `--ochre` | `#C89B3C` | rare tertiary (medals, stamps) |
| `--line` | `rgba(22,19,15,0.22)` | hairlines |

Dark "ink plates" (`--ink` background) may be used for 1–2 sections max (e.g. the Archive) for rhythm.

## 3. Typography

- Display: **Unbounded Variable** (200–900) — titles, numerals, Cyrillic marks. Tracking tight (-0.03em), line-height 0.82–0.92.
- Condensed: **Oswald** — labels, marquees, nav, small caps meta. Uppercase, letter-spacing 0.08–0.18em.
- Mono: **JetBrains Mono Variable** — data readouts, code, coordinates, clock.
- CJK body: system stack `"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif`.
- Scale: fluid `clamp()`. Hero name: `clamp(3.6rem, 13vw, 15rem)`. Section titles: `clamp(2.4rem, 7vw, 7rem)`.

Language mix: Chinese as the carrier, English/Russian as structural ornament (label, code, numeral).
Russian must be *correct*: ДОСЬЕ, АРСЕНАЛ, АРХИВ, ЗАСЛУГИ, ПУТЬ, КОНТАКТ, ЛИЧНОЕ ДЕЛО, ПРОЕКТ, ТРУД, СЛАВА, МАНИФЕСТ.

## 4. Grid & layout rules

- 12-col grid, `--gutter: clamp(16px, 2.4vw, 40px)`, page margin `clamp(18px, 4vw, 72px)`.
- A persistent **left index rail** (desktop ≥1024px): vertical list 00–06, rotates 90°, active item underlined by a red needle; plus a scroll progress hairline pinned to the far left.
- Sections deliberately break the grid: elements span 5/12 and overlap the next section by 40–120px via negative margins; rotated (-6°…+4°) labels and rubber stamps; big numerals behind copy at 18–26vw.
- Hairline rules that *cross* the whole page and continue into the next section.
- Mobile (<768px): collapse to single column, keep diagonal accents, no horizontal scroll except the archive (which becomes vertical).

## 5. Motion rules (motion.dev)

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for entrances; `cubic-bezier(0.65, 0, 0.35, 1)` for wipes.
- Entrances: clip-path wipe (left→right) + y 24px + opacity, staggered 60–90ms, `whileInView` once.
- Text: per-word/char stagger with `SplitText`-style manual split (no paid Motion+ API): wrap words in spans, animate y from 110% with overflow hidden.
- Scroll-linked: hero type translates/scales slightly; archive is pinned horizontally; numerals count up on view; progress hairline widens.
- Hover: magnetic links (translate toward cursor max 8px), image cards tilt ≤4°, red underline grows from left.
- Lenis smooth scroll (skip when `prefers-reduced-motion`).
- **Accessibility**: every animation must be disabled under `prefers-reduced-motion: reduce`; content must be fully readable with JS animation off.

## 6. Base UI components (mandatory usage)

- `Tabs` — section 02 arsenal (vertical tab list + spec panels), custom red beam `Tabs.Indicator`.
- `Dialog` — project detail modal in the archive; poster-like, no rounded corners.
- `Toast` — copy-to-clipboard feedback for social links / QQ mail.
- `Tooltip` — small technical hints on data readouts.
- `Accordion` — honors ledger rows (optional alternative: hover-expand list).
- `Progress` — thin readout in the header (scroll).
Do not restyle into generic pills; keep square, ruled, typographic.

## 7. three.js scene (hero)

- Fixed full-bleed canvas behind hero type, `pointer-events:none`, DPR clamped to 2, pauses when offscreen/hidden.
- Composition: a slow-rotating cluster of constructivist primitives — cylinder / box / torus / wedge — in matte ink + vermilion, lit by one hard key light, plus a hairline wireframe ring and drifting paper dust particles.
- Post: subtle film grain via custom shader or CSS overlay; vignette. Optional thin red "beam" plane that catches light.
- Must run ≥50fps on integrated GPU, < 120 draw calls, no external HDR/textures, procedural only.
- Respect `prefers-reduced-motion` (render one static frame, no RAF loop).
- Provide `<HeroScene />` from `src/sections/HeroStage.tsx` with a clean unmount/dispose path.

## 8. Content (source of truth: `src/data/profile.ts`)

Name **COOKIE**, handle **@binggan23**. Do not invent honors or dates beyond the data file.
Chinese copy tone: short, declarative, poster-like ("我用代码建造机器。"). Avoid marketing fluff.

## 9. Quality bar

- Lighthouse-ish: LCP < 2.5s, no layout shift, no console errors, 0 TypeScript errors, no horizontal overflow at 360/768/1024/1440/1920.
- Semantic HTML, focus-visible styles, aria labels on icon buttons, keyboard-operable tabs/dialog/copy.
- Print-clean code, no dead files, deterministic build (`pnpm build` green).
