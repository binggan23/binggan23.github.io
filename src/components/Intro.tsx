import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const COLUMNS = [
  ["КОНСТРУКТ", "ЛИЧНОЕ ДЕЛО", "023", "СЕКТОР 7"],
  ["COOKIE", "BINGGAN23", "КУКИ", "АРХИВ"],
  ["МАШИНА", "ДИСЦИПЛИНА", "ТРУД", "ПОРЯДОК"],
  ["AGENT", "HARNESS", "LOOP", "MCP"],
  ["СИСТЕМА", "LINUX", "DOCKER", "CLI"],
  ["2026", "ММXXVI", "36.20N", "117.09E"],
  ["ПРОЛОГ", "ПРОТОКОЛ", "ЗАПУСК", "ГОТОВ"],
];

/** Loader: seven columns of typefall, a counting meter, then a lime flash-cut. */
export default function Intro({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }
    document.documentElement.classList.add("is-locked");
    const started = performance.now();
    const DURATION = 2150;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - started) / DURATION);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const timer = window.setTimeout(onDone, DURATION + 220);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      document.documentElement.classList.remove("is-locked");
    };
  }, [reduce, onDone]);

  if (reduce) return null;

  return (
    <motion.div
      className="intro2"
      initial={{ opacity: 1 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <div className="intro2__cols">
        {COLUMNS.map((words, i) => (
          <div className="intro2__col" key={i}>
            <div className="intro2__strip" style={{ animationDelay: `${-i * 1.7}s` }}>
              {[0, 1].map((rep) =>
                words.map((word, j) => <span key={`${rep}-${j}`}>{word}</span>),
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="intro2__core">
        <span className="intro2__label mono">ЛИЧНОЕ ДЕЛО № 023 · ЗАГРУЗКА</span>
        <h2 className="intro2__word">
          <motion.span initial={{ y: "108%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}>
            COOKIE
          </motion.span>
        </h2>
        <div className="intro2__meter">
          <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.9, ease: [0.4, 0, 0.2, 1] }} />
        </div>
        <span className="intro2__count mono">{String(pct).padStart(3, "0")}% · INITIALIZING CORE</span>
      </div>

      <div className="intro2__meta intro2__meta--top mono">
        <span>СЕКТОР 01 · ОТКРЫТ</span>
        <span>36.20°N / 117.09°E</span>
      </div>
      <div className="intro2__meta intro2__meta--bottom mono">
        <span>КОНСТРУКТ · 1924 — 2026</span>
        <span>PERSONAL FILE — LOADING</span>
      </div>

      <motion.div
        className="intro2__flash"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.5, times: [0, 0.4, 1] }}
      />
      <div className="intro2__tape hazard" />
    </motion.div>
  );
}
