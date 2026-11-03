import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "motion/react";
import { Dialog } from "@base-ui/react/dialog";
import { projects, type Project } from "../data/profile";
import Reveal from "../components/Reveal";
import { sound } from "../lib/sound";
import { useMediaQuery } from "../lib/hooks";

function ProjectPlate({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  return (
    <article className={`plate plate--${project.accent}`} data-cursor="hover">
      <div className="plate__top">
        <span className="plate__index display">{project.index}</span>
        <span className="plate__year mono">{project.year}</span>
      </div>

      <div className="plate__mid">
        <span className="mono plate__role">{project.role}</span>
        <h3 className="plate__title display">{project.title}</h3>
        <p className="plate__sub">{project.subtitle}</p>
      </div>

      <p className="plate__summary">{project.summary}</p>

      <div className="plate__tags">
        {project.tags.map((tag) => (
          <span className="plate__tag mono" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="plate__actions">
        <button type="button" className="plate__open" onClick={() => onOpen(project)}>
          <span className="mono">拆开档案</span>
          <span className="plate__open-arrow" aria-hidden="true">→</span>
        </button>
        <a className="plate__link mono" href={project.link} target="_blank" rel="noreferrer noopener">
          GITHUB ↗
        </a>
      </div>
    </article>
  );
}

export default function Archive() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [selected, setSelected] = useState<Project | null>(null);
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!wide) {
      setDistance(0);
      return;
    }
    const measure = () => {
      const track = trackRef.current;
      const wrap = wrapRef.current;
      if (!track || !wrap) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 96));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [wide]);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const rawX = useTransform(scrollYProgress, [0.02, 0.98], [0, -distance]);
  const x = useSpring(rawX, { stiffness: 120, damping: 26, mass: 0.4 });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const openProject = (p: Project) => {
    setSelected(p);
    sound.play("open");
  };

  return (
    <section className="archive" id="archive" aria-labelledby="archive-title">
      <div className="archive__head">
        <Reveal className="sec-head__line">
          <span className="mono">03 / АРХИВ</span>
          <span className="sec-head__rule" aria-hidden="true" />
          <span className="mono">OPEN SOURCE RECORD</span>
        </Reveal>
        <div className="archive__head-main">
          <h2 className="archive__title display" id="archive-title">
            项目<span className="archive__title-en">ARCHIVE</span>
          </h2>
          <p className="archive__intro">
            {projects.length} 份已归档的工程：从浏览器操作层、语音工作室，到把人机共驾编译成状态机的
            neo-skill。全部开源，全部可复现。
          </p>
        </div>
      </div>

      {wide ? (
        <div className="archive__pin" ref={wrapRef} style={{ height: `calc(100vh + ${distance}px)` }}>
          <div className="archive__viewport">
            <div className="archive__hud" aria-hidden="true">
              <span className="mono">СКРОЛЛ ВПРАВО →</span>
              <div className="archive__hud-bar">
                <motion.span style={{ width: progress }} />
              </div>
              <span className="mono">{String(projects.length).padStart(2, "0")} ДЕЛ</span>
            </div>
            <motion.div className="archive__track" ref={trackRef} style={{ x: reduce ? 0 : x }}>
              {projects.map((project) => (
                <ProjectPlate key={project.id} project={project} onOpen={openProject} />
              ))}
              <div className="archive__endcap" aria-hidden="true">
                <span className="display">КОНЕЦ</span>
                <span className="mono">END OF RECORD</span>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="archive__stack">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.04}>
              <ProjectPlate project={project} onOpen={openProject} />
            </Reveal>
          ))}
        </div>
      )}

      <Dialog.Root open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Backdrop className="detail__backdrop" />
          <Dialog.Viewport className="detail__viewport">
            <Dialog.Popup className="detail">
              <div className="detail__head">
                <span className="mono">ДЕЛО № {selected?.index} / {selected?.year}</span>
                <Dialog.Close className="detail__close mono" aria-label="关闭项目档案">
                  ЗАКРЫТЬ ✕
                </Dialog.Close>
              </div>
              <Dialog.Title className="detail__title display">{selected?.title}</Dialog.Title>
              <Dialog.Description className="detail__sub">{selected?.subtitle}</Dialog.Description>

              <div className="detail__grid">
                <div className="detail__left">
                  <ul className="detail__points">
                    {selected?.detail.map((point, i) => (
                      <li key={i}>
                        <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                        <p>{point}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <dl className="detail__meta">
                  <div>
                    <dt className="mono">Роль</dt>
                    <dd>{selected?.role}</dd>
                  </div>
                  <div>
                    <dt className="mono">Срок</dt>
                    <dd>{selected?.year}</dd>
                  </div>
                  <div>
                    <dt className="mono">Стек</dt>
                    <dd>{selected?.tags.join(" · ")}</dd>
                  </div>
                </dl>
              </div>

              <div className="detail__foot">
                <a className="detail__cta" href={selected?.link} target="_blank" rel="noreferrer noopener">
                  <span className="mono">ОТКРЫТЬ РЕПОЗИТОРИЙ</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <Dialog.Close className="detail__back mono">← НАЗАД</Dialog.Close>
              </div>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
