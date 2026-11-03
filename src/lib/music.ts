/**
 * Background music bed — a single looping MP3, faded with a hand-rolled
 * volume ramp so it can duck under the synthesized UI ticks instead of
 * fighting them. Started only from an explicit gesture (the sound toggle).
 */
const SRC = "/audio/music-bed.mp3";
const LEVEL = 0.3;
const DUCK = 0.07;

let el: HTMLAudioElement | null = null;

let raf = 0;
let from = 0;
let to = 0;
let startedAt = 0;
let duration = 0;
let done: (() => void) | null = null;

function node(): HTMLAudioElement {
  if (el) return el;
  const a = new Audio(SRC);
  a.loop = true;
  a.preload = "auto";
  a.volume = 0;
  a.setAttribute("aria-hidden", "true");
  a.style.display = "none";
  document.body.appendChild(a);
  el = a;
  return a;
}

function fade(next: number, ms: number, onDone?: () => void) {
  const a = node();
  from = a.volume;
  to = next;
  duration = ms;
  startedAt = 0;
  done = onDone ?? null;
  if (!raf) raf = requestAnimationFrame(step);
}

function step(t: number) {
  const a = el;
  if (!a) {
    raf = 0;
    return;
  }
  if (!startedAt) startedAt = t;
  const p = duration <= 0 ? 1 : Math.min(1, (t - startedAt) / duration);
  const eased = 1 - Math.pow(1 - p, 3);
  a.volume = Math.max(0, Math.min(1, from + (to - from) * eased));
  if (p < 1) {
    raf = requestAnimationFrame(step);
  } else {
    raf = 0;
    const fn = done;
    done = null;
    fn?.();
  }
}

function onVisibility() {
  if (!el || el.paused) return;
  const next = document.hidden ? DUCK : LEVEL;
  if (Math.abs(el.volume - next) > 0.01) fade(next, 900);
}

export const music = {
  get playing() {
    return Boolean(el && !el.paused);
  },
  get volume() {
    return el?.volume ?? 0;
  },
  start() {
    const a = node();
    a.volume = 0;
    void a.play().catch(() => {
      /* blocked or unsupported — stay silent */
    });
    fade(LEVEL, 2800);
    document.addEventListener("visibilitychange", onVisibility);
  },
  stop() {
    document.removeEventListener("visibilitychange", onVisibility);
    if (!el) return;
    fade(0, 700, () => el?.pause());
  },
  toggle(on: boolean) {
    if (on) music.start();
    else music.stop();
  },
};
