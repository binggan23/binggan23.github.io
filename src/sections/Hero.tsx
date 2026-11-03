import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import HeroStage from "../components/HeroStage";
import SplitText from "../components/SplitText";
import Marquee from "../components/Marquee";
import Emblem from "../components/Emblem";
import HazardTape from "../components/HazardTape";
import { profile, marqueeWords } from "../data/profile";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const reduce = useReducedMotion();
  const yName = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-18%"]);
  const yStage = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "24%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scaleNum = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.16]);
  const tapeX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-28%"]);
  const stageScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.72]);
  const stageFade = useTransform(scrollYProgress, [0, 0.85], reduce ? [1, 1] : [1, 0.08]);
  const nameScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.94]);
  const nameFade = useTransform(scrollYProgress, [0.55, 1], reduce ? [1, 1] : [1, 0]);
  const [tele, setTele] = useState({ rpm: 60, core: 100 });
  const handleTelemetry = useRef((t: { rpm: number; core: number }) => {
    setTele((prev) => (Math.abs(prev.rpm - t.rpm) > 8 || Math.abs(prev.core - t.core) > 4 ? t : prev));
  }).current;

  return (
    <section className="hero" id="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero__stage" aria-hidden="true">
        <motion.div style={{ y: yStage, scale: stageScale, opacity: stageFade }} className="hero__stage-inner">
          <HeroStage className="hero__canvas" onTelemetry={handleTelemetry} />
        </motion.div>
      </div>


      <div className="hero__beam" aria-hidden="true" />
      <Emblem className="hero__emblem" />
      <span className="hero__stencil mono" aria-hidden="true">ЗОНА ОГРАНИЧЕННОГО ДОСТУПА</span>
      <motion.div className="hero__tape-wrap" style={{ x: tapeX }} aria-hidden="true">
        <HazardTape className="hero__tape" />
      </motion.div>

      <div className="hero__notes" aria-hidden="true">
        {[
          { id: "01", ru: "ЯДРО", en: "CORE", pos: "a", len: 96 },
          { id: "03", ru: "ОРБИТА", en: "ORBIT", pos: "c", len: 120 },
        ].map((n) => (
          <div className={`hero__note hero__note--${n.pos}`} key={n.id}>
            <span className="hero__note-id mono">{n.id}</span>
            <span className="hero__note-ru mono">{n.ru}</span>
            <span className="hero__note-en mono">{n.en}</span>
            <span className="hero__note-line" style={{ width: n.len }} />
            <span className="hero__note-dot" />
          </div>
        ))}
      </div>
      <div className="hero__rule hero__rule--a" aria-hidden="true" />
      <div className="hero__rule hero__rule--b" aria-hidden="true" />

      <motion.div className="hero__num" style={{ scale: scaleNum, opacity }} aria-hidden="true">
        <span className="hero__num-text">01</span>
      </motion.div>

      <div className="hero__inner">
        <div className="hero__meta">
          <motion.div className="hero__meta-line" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}>
            <span className="mono">ПРОЛОГ / 00</span>
            <span className="hero__meta-dash" aria-hidden="true" />
            <span className="mono">ЛИЧНОЕ ДЕЛО № {profile.fileNo}</span>
          </motion.div>
          <motion.div className="hero__meta-line hero__meta-line--right" initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }}>
            <span className="mono">{profile.coordinates}</span>
            <span className="hero__meta-dash" aria-hidden="true" />
            <span className="mono">{profile.timezone}</span>
          </motion.div>
        </div>

        <div className="hero__type">
          <motion.p className="hero__kicker cond" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.42, ease: EASE }}>
            {profile.taglineRu}
          </motion.p>

          <motion.div style={{ y: yName, scale: nameScale, opacity: nameFade }} className="hero__name-wrap">
            <h1 className="hero__name" id="hero-title">
              <span className="visually-hidden">{profile.name} — {profile.tagline}</span>
              <SplitText text={profile.name} className="hero__name-line" ariaHidden stagger={0.075} duration={1.35} delay={0.36} />
            </h1>
            <div className="hero__name-sub" aria-hidden="true">
              <span className="hero__name-ru mono">{profile.nameRu}</span>
              <span className="hero__name-rule" />
              <span className="hero__name-handle mono">{profile.handle}</span>
            </div>
          </motion.div>

          <div className="hero__bottom">
            <motion.p className="hero__lede" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9, ease: EASE }}>
              <span className="hero__lede-mark" aria-hidden="true">✳</span>
              {profile.manifestoShort}
              <span className="hero__lede-en mono">BUILD · TAME · SHIP</span>
            </motion.p>

            <motion.div className="hero__chips" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.02, ease: EASE }}>
              {profile.roles.map((role, i) => (
                <span className="hero__chip" key={role}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {role}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.a
          href="#dossier"
          className="hero__scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          aria-label="向下滚动到档案"
        >
          <span className="hero__scroll-label mono">СКРОЛЛ</span>
          <span className="hero__scroll-line" aria-hidden="true">
            <i />
          </span>
          <span className="hero__scroll-ru mono">ВНИЗ ↓</span>
        </motion.a>
      </div>

      <div className="hero__gauge" aria-hidden="true">
        <div className="hero__gauge-head mono">
          <span>РЕАКТОР / CORE</span>
          <span className="hero__gauge-live"><i /> LIVE</span>
        </div>
        <div className="hero__gauge-row">
          <span className="mono">ЯДРО</span>
          <span className="hero__gauge-bar">
            <i style={{ width: `${Math.max(6, Math.min(100, tele.core))}%` }} />
          </span>
          <span className="mono hero__gauge-num">{String(tele.core).padStart(3, "0")}</span>
        </div>
        <div className="hero__gauge-row">
          <span className="mono">ОБОРОТ</span>
          <span className="hero__gauge-bar">
            <i className="is-cool" style={{ width: `${Math.max(6, Math.min(100, tele.rpm / 12))}%` }} />
          </span>
          <span className="mono hero__gauge-num">{String(tele.rpm).padStart(3, "0")}</span>
        </div>
        <div className="hero__gauge-foot mono">
          <span>СЕКТОР 01</span>
          <span>НЕТ ОШИБОК</span>
        </div>
      </div>

      <div className="hero__ticker" aria-hidden="true">
        <Marquee words={marqueeWords} duration={44} />
      </div>

      <div className="hero__side" aria-hidden="true">
        <span className="mono">СЕКТОР 01 · ОТКРЫТ</span>
        <span className="hero__side-rule" />
        <span className="mono">MMXXVI</span>
      </div>
    </section>
  );
}
