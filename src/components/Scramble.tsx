import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

const GLYPHS = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ0123456789/\\*—+";

type ScrambleProps = {
  text: string;
  className?: string;
  /** ms per revealed character */
  speed?: number;
  once?: boolean;
  delay?: number;
};

/** Terminal-style decode: random glyphs resolve into the final string. */
export default function Scramble({ text, className, speed = 34, once = true, delay = 0 }: ScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [out, setOut] = useState(reduce ? text : "");

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setOut(text);
      return;
    }
    let raf = 0;
    let start = 0;
    const total = text.length;
    const run = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start - delay;
      const revealed = Math.max(0, Math.floor(elapsed / speed));
      let next = "";
      for (let i = 0; i < total; i++) {
        if (i < revealed) next += text[i];
        else if (text[i] === " ") next += " ";
        else next += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(next);
      if (revealed <= total) raf = requestAnimationFrame(run);
      else setOut(text);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, speed, delay, reduce]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out || "\u00A0"}</span>
    </span>
  );
}
