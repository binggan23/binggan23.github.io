import { motion } from "motion/react";
import type { ElementType } from "react";

type SplitTextProps = {
  text: string;
  className?: string;
  as?: ElementType;
  /** split granularity; CJK reads better as chars */
  mode?: "chars" | "words";
  delay?: number;
  stagger?: number;
  duration?: number;
  inView?: boolean;
  ariaHidden?: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Masks each unit in an overflow-hidden box and slides it up into registration.
 * Zero dependency; keeps text selectable & screen-reader friendly.
 */
export default function SplitText({
  text,
  className,
  as: Tag = "span",
  mode = "chars",
  delay = 0,
  stagger = 0.03,
  duration = 1.05,
  inView = true,
  ariaHidden = false,
}: SplitTextProps) {
  const units = mode === "words" ? text.split(/(\s+)/) : Array.from(text);

  return (
    <Tag className={className} aria-label={ariaHidden ? undefined : text} aria-hidden={ariaHidden || undefined}>
      {units.map((unit, i) => {
        if (unit.trim() === "") return <span key={`s-${i}`} aria-hidden="true" className="split__space"> </span>;
        return (
          <span className="split__mask" aria-hidden="true" key={`u-${i}`}>
            <motion.span
              className="split__unit"
              initial={{ y: "115%", rotate: mode === "chars" ? 4 : 0, opacity: 0 }}
              animate={inView ? { y: "0%", rotate: 0, opacity: 1 } : undefined}
              whileInView={inView ? undefined : { y: "0%", rotate: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration, delay: delay + i * stagger, ease: EASE }}
            >
              {unit}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
