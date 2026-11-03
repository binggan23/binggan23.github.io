import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import Reveal from "../components/Reveal";
import { schools } from "../data/profile";

export default function Path() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 40%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="path" id="path" ref={ref} aria-labelledby="path-title">
      <header className="sec-head">
        <Reveal className="sec-head__line">
          <span className="mono">05 / ПУТЬ</span>
          <span className="sec-head__rule" aria-hidden="true" />
          <span className="mono">EDUCATION</span>
        </Reveal>
        <div className="sec-head__main">
          <h2 className="sec-head__title display" id="path-title">
            学历<span className="sec-head__title-en">PATH</span>
          </h2>
          <p className="sec-head__note">两条并行的轨道：一条通向数据工程，一条通向计算机应用。都在 2025 年出发。</p>
        </div>
      </header>

      <div className="path__body">
        <div className="path__axis" aria-hidden="true">
          <span className="path__axis-line">
            <motion.i style={{ scaleY: reduce ? 1 : lineScale }} />
          </span>
          <span className="mono path__axis-label">2025</span>
          <span className="mono path__axis-label path__axis-label--end">2029</span>
        </div>

        {schools.map((school, i) => (
          <Reveal key={school.id} delay={i * 0.1} className={`path__row ${i % 2 ? "path__row--alt" : ""}`}>
            <article className="path__card">
              <div className="path__card-top">
                <span className="mono path__period">{school.period}</span>
                <span className="path__status mono">{school.status}</span>
              </div>
              <h3 className="path__school display">{school.school}</h3>
              <div className="path__meta">
                <span className="path__degree">{school.degree}</span>
                <span className="path__dot" aria-hidden="true" />
                <span className="path__major">{school.major}</span>
              </div>
              <p className="path__note">{school.note}</p>
              <span className="path__index display" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
