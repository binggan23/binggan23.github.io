import { useEffect, useRef, useState } from "react";

/** Live frame-rate readout — honesty about the render budget. */
export default function FpsMeter({ className }: { className?: string }) {
  const [fps, setFps] = useState(60);
  const frames = useRef(0);
  const last = useRef(performance.now());

  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      frames.current += 1;
      if (now - last.current >= 1000) {
        setFps(Math.round((frames.current * 1000) / (now - last.current)));
        frames.current = 0;
        last.current = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span className={`fps ${className ?? ""}`} aria-hidden="true">
      <span className="fps__bars">
        {Array.from({ length: 4 }).map((_, i) => (
          <i key={i} className={fps > 24 + i * 15 ? "is-on" : undefined} />
        ))}
      </span>
      <span className="mono">{String(fps).padStart(2, "0")} FPS</span>
    </span>
  );
}
