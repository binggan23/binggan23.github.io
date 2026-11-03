import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "motion/react";
import FilmField from "../components/FilmField";
import { sound } from "../lib/sound";
import HazardTape from "../components/HazardTape";

const CHAPTERS = [
  { id: "01", label: "ИНИЦИАЛИЗАЦИЯ", cn: "初始化", note: "自检 · 引导 · 姿态" },
  { id: "02", label: "ТОПОГРАФИЯ", cn: "地形", note: "边界 · 等高 · 密度" },
  { id: "03", label: "ОГРАЖДЕНИЕ", cn: "围挡", note: "警示 · 阈值 · 门禁" },
  { id: "04", label: "РАЗВЁРТКА", cn: "扫描", note: "切片 · 采样 · 对齐" },
  { id: "05", label: "СЕТКА", cn: "网格", note: "编排 · 收敛 · 交付" },
];

/**
 * Film strip: a pinned 300vh stage where the wheel edits the footage —
 * five procedurally generated scenes cut against each other while the type
 * and chapter index track the playhead.
 */
export default function Film() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setProgress((prev) => (Math.abs(prev - v) > 0.004 ? v : prev));
  });

  const idx = Math.min(CHAPTERS.length - 1, Math.floor(progress * 4.999));
  const entered = useRef(false);
  const lastIdx = useRef(-1);
  useEffect(() => {
    if (lastIdx.current !== -1 && lastIdx.current !== idx) sound.play("tick");
    lastIdx.current = idx;
  }, [idx]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !entered.current) {
          entered.current = true;
          sound.play("whoosh");
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const chapter = CHAPTERS[idx];
  const pct = String(Math.round(progress * 100)).padStart(3, "0");

  const fillWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const typeY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["6%", "-6%"]);
  const numRotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-8, 8]);
  const typeX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-3%", "3%"]);

  return (
    <section className="film" id="film" ref={ref} aria-labelledby="film-title">
      <div className="film__pin">
        <FilmField className="film__canvas" progress={progress} />
        <div className="film__scan" aria-hidden="true" />

        <div className="film__corner film__corner--tl mono" aria-hidden="true">
          <div>КАДР 0{idx + 1} / 05</div>
          <div>ISO 400 · 24 FPS</div>
        </div>
        <div className="film__corner film__corner--tr mono" aria-hidden="true">
          <div>СЕКТОР 07 · ПЛЁНКА</div>
          <div>{pct}%</div>
        </div>

        <motion.div className="film__type" style={{ y: typeY, x: typeX }}>
          <span className="film__rec mono">
            <i aria-hidden="true" /> REC · {chapter.label}
          </span>
          <h2 className="film__title" id="film-title">
            机器<em className="film__title-em">在</em>运行
          </h2>
          <span className="film__sub">{chapter.cn} · {chapter.note}</span>
        </motion.div>

        <div className="film__hud mono" aria-hidden="true">
          <span>00</span>
          <div className="film__hud-bar">
            <div className="film__hud-ticks" />
            <motion.i style={{ width: fillWidth }} />
          </div>
          <span className="film__hud-num">{pct} / 100</span>
        </div>

        <motion.div className="film__index" style={{ rotate: numRotate }} aria-hidden="true">
          <span className="display">0{idx + 1}</span>
        </motion.div>

        <div className="film__chap mono" aria-hidden="true">
          {CHAPTERS.map((c, i) => (
            <span key={c.id} className={i === idx ? "is-on" : undefined}>
              {c.id}
            </span>
          ))}
        </div>

        <HazardTape className="film__tape" />
      </div>
    </section>
  );
}
