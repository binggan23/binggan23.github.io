import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/** Right-edge vertical progress rail with hazard hatch fill. */
export default function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <div className="scrollrail" aria-hidden="true">
      <span className="scrollrail__cap mono">00</span>
      <div className="scrollrail__track">
        <motion.div className="scrollrail__fill" style={{ scaleY: reduce ? 1 : scaleY }} />
      </div>
      <span className="scrollrail__cap mono">100</span>
    </div>
  );
}
