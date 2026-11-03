import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import InkField from "../components/InkField";
import Scramble from "../components/Scramble";

export default function Interlude() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["6%", "-16%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-12%", "10%"]);
  const rot = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-4, 3]);

  return (
    <section className="interlude" id="interlude" ref={ref} aria-labelledby="interlude-title">
      <InkField className="interlude__field" />
      <div className="interlude__veil" aria-hidden="true" />

      <div className="interlude__content">
        <motion.p className="interlude__label mono" style={{ x: x1 }}>
          <Scramble text="ИНТЕРЛЮДИЯ · 间奏" speed={60} />
        </motion.p>

        <motion.h2 className="interlude__title display" id="interlude-title" style={{ x: x2, rotate: rot }}>
          <span className="interlude__line">СТРОЙ</span>
          <span className="interlude__line interlude__line--indent">СЕБЯ</span>
        </motion.h2>

        <div className="interlude__meta">
          <span className="mono">1924 — 2026</span>
          <span className="interlude__meta-rule" aria-hidden="true" />
          <span className="mono">FORM FOLLOWS FUNCTION</span>
          <span className="interlude__meta-rule" aria-hidden="true" />
          <span className="mono">构成 · 非客观 · 机器崇拜</span>
        </div>
      </div>

      <div className="interlude__edge mono" aria-hidden="true">
        <span>ПЛОСКОСТЬ / ПЛОТНОСТЬ / НАПРЯЖЕНИЕ</span>
      </div>
    </section>
  );
}
