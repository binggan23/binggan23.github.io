import { motion, useReducedMotion } from "motion/react";

/**
 * Constructivist roundel — split arcs, a hard wedge, a diagonal bar and a ring
 * of ticks. Rotating slowly, counter-rotating ticks. No soft edges.
 */
export default function Emblem({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={"emblem " + (className ?? "")} aria-hidden="true">
      <motion.svg
        viewBox="0 0 200 200"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? undefined : { duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="100" cy="100" r="93" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
        <path d="M100 100 L100 8 A92 92 0 0 1 189.7 100 Z" fill="currentColor" opacity="0.9" />
        <path d="M100 100 L12 100 A88 88 0 0 1 100 12 Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
        <rect x="20" y="96" width="160" height="8" fill="currentColor" transform="rotate(-38 100 100)" />
        <circle cx="100" cy="100" r="31" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        <circle cx="100" cy="100" r="9" fill="currentColor" />
      </motion.svg>
      <motion.svg
        className="emblem__ticks"
        viewBox="0 0 200 200"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={reduce ? undefined : { duration: 140, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 60 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="1"
            x2="100"
            y2={i % 5 === 0 ? 11 : 5.5}
            transform={`rotate(${i * 6} 100 100)`}
            stroke="currentColor"
            strokeWidth="1"
            opacity={i % 5 === 0 ? 0.85 : 0.3}
          />
        ))}
      </motion.svg>
    </div>
  );
}
