import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/** A vermilion registration dot + lagging ring; grows over interactive nodes. */
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 160, damping: 22, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 160, damping: 22, mass: 0.35 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      setActive(Boolean(t?.closest("a,button,[role='tab'],[data-cursor='hover']")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="cursor" aria-hidden="true">
      <motion.div className={`cursor__ring ${active ? "is-active" : ""}`} style={{ x: ringX, y: ringY }} />
      <motion.div className="cursor__dot" style={{ x, y }} />
    </div>
  );
}
