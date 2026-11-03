import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity, useReducedMotion, useAnimationFrame, useMotionValue } from "motion/react";

const LINES = [
  { text: "ТРУД · ДИСЦИПЛИНА · МАШИНА", dir: 1, size: "big" },
  { text: "把模糊的需求编译成确定的系统", dir: -1, size: "mid" },
  { text: "AGENT THINKS / CLI DECIDES / HUMAN SIGNS", dir: 1, size: "small" },
  { text: "理解交给模型，门禁交给代码，拍板留给人", dir: -1, size: "mid" },
];

function RotatingSeal() {
  const rotate = useMotionValue(0);
  const reduce = useReducedMotion();
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    rotate.set(rotate.get() + delta * 0.012);
  });
  return (
    <motion.div className="seal" style={{ rotate }} aria-hidden="true">
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <path id="seal-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.25" />
        <text fontFamily="Oswald, sans-serif" fontSize="12.5" letterSpacing="3.4" fill="currentColor">
          <textPath href="#seal-circle" startOffset="0">
            КОНСТРУКТ · ЛИЧНОЕ ДЕЛО 023 · КОНСТРУКТ · ЛИЧНОЕ ДЕЛО 023 ·
          </textPath>
        </text>
        <path d="M100 74 L112 112 L88 112 Z" fill="currentColor" opacity="0.85" />
        <circle cx="100" cy="126" r="5" fill="currentColor" />
      </svg>
    </motion.div>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll();
  const { scrollYProgress: local } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const velocity = useVelocity(scrollY);
  const smoothVel = useSpring(velocity, { stiffness: 80, damping: 24 });
  const skew = useTransform(smoothVel, [-2600, 0, 2600], reduce ? [0, 0, 0] : [4.5, 0, -4.5]);
  const dir = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -1]);

  return (
    <section className="manifesto" id="manifesto" ref={ref} aria-label="宣言">
      <div className="manifesto__noise" aria-hidden="true" />
      <motion.div className="manifesto__rows" style={{ skewY: skew }}>
        {LINES.map((line, i) => {
          const x = useTransform(local, [0, 1], reduce ? ["0%", "0%"] : [`${line.dir * 6}%`, `${line.dir * -6}%`]);
          return (
            <motion.div className={`manifesto__line manifesto__line--${line.size}`} key={line.text} style={{ x }}>
              <span>{line.text}</span>
              <span className="manifesto__star" aria-hidden="true">✳</span>
              <span>{line.text}</span>
              <span className="manifesto__star" aria-hidden="true">✳</span>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="manifesto__core">
        <RotatingSeal />
        <p className="manifesto__quote">
          <span className="mono">МАНИФЕСТ / 002</span>
          <em>“系统不是被写出来的，是被约束出来的。”</em>
        </p>
      </div>

      <motion.div className="manifesto__scan" style={{ opacity: dir }} aria-hidden="true" />
    </section>
  );
}
