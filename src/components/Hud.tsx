import { useEffect, useState } from "react";
import { useScroll, useMotionValueEvent, motion } from "motion/react";
import FpsMeter from "./FpsMeter";

/** Fixed instrument cluster: scroll %, pointer coords, grid switch. */
export default function Hud({ section }: { section: string }) {
  const { scrollYProgress } = useScroll();
  const [pct, setPct] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [grid, setGrid] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => setPct(Math.round(v * 100)));

  useEffect(() => {
    const onMove = (e: PointerEvent) => setPointer({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key.toLowerCase() === "g") setGrid((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.div
        className={`gridlines ${grid ? "is-on" : ""}`}
        aria-hidden="true"
        initial={false}
        animate={{ opacity: grid ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="gridlines__cols" />
        <div className="gridlines__baseline" />
        <span className="gridlines__tag mono">СЕТКА 12 · BASELINE 8</span>
      </motion.div>

      <div className="hud" aria-hidden="true">
        <span className="hud__cell mono">СКРОЛЛ {String(pct).padStart(3, "0")}%</span>
        <span className="hud__cell mono hud__cell--hide">{section.toUpperCase()}</span>
        <span className="hud__cell mono hud__cell--hide">
          X {String(pointer.x).padStart(4, "0")} Y {String(pointer.y).padStart(4, "0")}
        </span>
        <button
          type="button"
          className={`hud__cell hud__grid mono ${grid ? "is-on" : ""}`}
          onClick={() => setGrid((v) => !v)}
          aria-pressed={grid}
          aria-label="显示或隐藏栅格"
          tabIndex={-1}
        >
          <span className="hud__grid-icon" aria-hidden="true"><i /><i /></span>
          СЕТКА
        </button>
        <FpsMeter className="hud__fps" />
      </div>
    </>
  );
}
