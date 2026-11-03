import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import Stamp from "../components/Stamp";
import { profile } from "../data/profile";

const EASE = [0.16, 1, 0.3, 1] as const;

const facts = [
  { k: "代号 / HANDLE", v: profile.handle },
  { k: "坐标 / POSITION", v: profile.location },
  { k: "状态 / STATUS", v: profile.status, accent: true },
  { k: "时区 / ZONE", v: profile.timezone },
  { k: "邮箱 / MAIL", v: profile.email },
  { k: "语言 / LANGS", v: "ZH · EN · RU(读)" },
];

export default function Dossier() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yPlate = useTransform(scrollYProgress, [0, 1], ["12%", reduce ? "12%" : "-12%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-2.4, 1.6]);
  const yStamp = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -30]);
  const cutScale = useTransform(scrollYProgress, [0.55, 0.95], reduce ? [1, 1] : [0, 1]);
  const plateClip = useTransform(scrollYProgress, [0.02, 0.34], reduce ? ["inset(0 0 0 0)", "inset(0 0 0 0)"] : ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]);

  return (
    <section className="dossier" id="dossier" ref={ref} aria-labelledby="dossier-title">
      <div className="dossier__head">
        <Reveal className="dossier__kicker">
          <span className="mono">01 / ДОСЬЕ</span>
          <span className="dossier__kicker-rule" aria-hidden="true" />
          <span className="mono">PERSONNEL FILE</span>
        </Reveal>
        <h2 className="dossier__title display" id="dossier-title">
          <span className="dossier__title-cn">档案</span>
          <span className="dossier__title-en">DOSSIER</span>
        </h2>
      </div>

      <div className="dossier__grid">
        <motion.figure className="dossier__plate" style={{ y: yPlate, rotate, clipPath: plateClip }}>
          <div className="dossier__plate-frame">
            <div className="dossier__plate-spine" aria-hidden="true">
              <span className="mono">ЛИЧНОЕ ДЕЛО · № 023 · СЕКТОР 7</span>
            </div>

            <div className="dossier__plate-inner">
              <div className="dossier__plate-top mono">
                <span>ФОТО 01 / АВТОПОРТРЕТ</span>
                <span>2026</span>
              </div>

              <div className="dossier__plate-img">
                <img src="/portrait-ink.jpg" alt="COOKIE 的自画像（双色调印刷处理）" width={900} height={900} loading="lazy" />
                <img className="dossier__plate-half" src="/portrait-halftone.png" alt="" aria-hidden="true" width={900} height={900} loading="lazy" />
                <span className="dossier__plate-num display" aria-hidden="true">023</span>
              </div>

              <div className="dossier__plate-name">
                <span className="dossier__plate-name-en display">COOKIE</span>
                <span className="dossier__plate-name-ru mono">КУКИ</span>
              </div>

              <dl className="dossier__plate-rows">
                <div><dt className="mono">ДОЛЖНОСТЬ</dt><dd>全栈工程师</dd></div>
                <div><dt className="mono">ОТДЕЛ</dt><dd>Agent 工程 / 系统</dd></div>
                <div><dt className="mono">ДАКТА</dt><dd>2025 — 2029</dd></div>
              </dl>

              <div className="dossier__plate-barcode" aria-hidden="true" />
              <div className="dossier__plate-sign mono">
                <span>ПОДПИСЬ / 签名</span>
                <span className="dossier__plate-sign-line" aria-hidden="true" />
              </div>
            </div>

            <span className="dossier__plate-corner dossier__plate-corner--tl" aria-hidden="true" />
            <span className="dossier__plate-corner dossier__plate-corner--tr" aria-hidden="true" />
            <span className="dossier__plate-corner dossier__plate-corner--bl" aria-hidden="true" />
            <span className="dossier__plate-corner dossier__plate-corner--br" aria-hidden="true" />
          </div>
          <motion.div className="dossier__stamp" style={{ y: yStamp }}>
            <Stamp text="УТВЕРЖДЕНО · PROLETARIAN APPROVED · 2026 ·" sub="СЕКТОР 023" size={140} ink="red" />
          </motion.div>
        </motion.figure>

        <div className="dossier__body">
          <Reveal>
            <p className="dossier__statement">
              我用代码建造机器，<br />
              用<span className="dossier__hl">纪律</span>驯服它。
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="dossier__manifesto">
              <span className="dossier__manifesto-index mono">МАНИФЕСТ / 001</span>
              <p>{profile.manifesto}</p>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <dl className="dossier__facts">
              {facts.map((fact) => (
                <div className={`dossier__fact ${fact.accent ? "is-accent" : ""}`} key={fact.k}>
                  <dt className="mono">{fact.k}</dt>
                  <dd>{fact.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="dossier__stats">
              {profile.stats.map((stat) => (
                <div className="dossier__stat" key={stat.label}>
                  <span className="dossier__stat-num display">
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="dossier__stat-label">{stat.label}</span>
                  <span className="dossier__stat-ru mono">{stat.labelRu}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="dossier__cut" aria-hidden="true">
        <span className="mono">РАЗРЕЗ A—A</span>
        <motion.span className="dossier__cut-line" style={{ scaleX: cutScale }} />
        <span className="dossier__cut-tri" />
      </div>

    </section>
  );
}
