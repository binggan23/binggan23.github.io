import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  /** clip-path wipe across the element, poster style */
  wipe?: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Reveal({ children, delay = 0, y = 26, className, once = true, wipe = false }: RevealProps) {
  const variants: Variants = wipe
    ? {
        hidden: { opacity: 0, y, clipPath: "inset(0 100% 0 0)" },
        show: {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0% 0 0)",
          transition: { duration: 1.05, delay, ease: EASE },
        },
      }
    : {
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.85, delay, ease: EASE } },
      };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-8% 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}
