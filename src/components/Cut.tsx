import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/** Hazard strip that slides sideways as the page scrolls past it. */
export default function Cut({ label, reverse = false }: { label: string; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : reverse ? ["-12%", "12%"] : ["12%", "-12%"]);

  return (
    <div className="cut" ref={ref} aria-hidden="true">
      <motion.div className="cut__tape hazard" style={{ x }} />
      <div className="cut__line">
        <span className="cut__mark" />
        <span className="cut__label mono">{label}</span>
        <span className="cut__rule" />
        <span className="cut__mark" />
      </div>
    </div>
  );
}
