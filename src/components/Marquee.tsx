import { motion, useReducedMotion } from "motion/react";

type MarqueeProps = {
  words: string[];
  reverse?: boolean;
  duration?: number;
  className?: string;
  separator?: string;
};

/** Infinite ticker; duplicated track, GPU transform only. */
export default function Marquee({ words, reverse = false, duration = 38, className, separator = "✳" }: MarqueeProps) {
  const reduce = useReducedMotion();
  const row = (
    <div className="marquee__row" aria-hidden="true">
      {words.map((word, i) => (
        <span className="marquee__item" key={`${word}-${i}`}>
          {word}
          <span className="marquee__sep">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee ${className ?? ""}`} role="marquee" aria-label={words.join(" · ")}>
      <motion.div
        className="marquee__track"
        animate={reduce ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={reduce ? undefined : { duration, ease: "linear", repeat: Infinity }}
      >
        {row}
        {row}
      </motion.div>
    </div>
  );
}
