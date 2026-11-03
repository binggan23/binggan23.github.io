import { useState } from "react";
import { Accordion } from "@base-ui/react/accordion";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import { honors } from "../data/profile";
import { sound } from "../lib/sound";

export default function Honors() {
  const [open, setOpen] = useState<string[]>(["h1"]);

  return (
    <section className="honors" id="honors" aria-labelledby="honors-title">
      <div className="honors__beam" aria-hidden="true" />

      <header className="honors__head">
        <Reveal className="sec-head__line">
          <span className="mono">04 / ЗАСЛУГИ</span>
          <span className="sec-head__rule" aria-hidden="true" />
          <span className="mono">HONORS &amp; CERTIFICATION</span>
        </Reveal>
        <div className="honors__head-grid">
          <h2 className="honors__title display" id="honors-title">
            荣誉<span className="honors__title-en">HONORS</span>
          </h2>
          <div className="honors__score">
            <span className="honors__score-num display">
              <CountUp to={honors.length} pad={2} />
            </span>
            <span className="honors__score-label mono">条记录 / ЗАПИСЕЙ</span>
            <p>国家级、省级、市级与云厂商认证——从竞技场到生产环境，都被记录在案。</p>
          </div>
        </div>
      </header>

      <Accordion.Root
        className="ledger"
        multiple
        value={open}
        onValueChange={(value) => {
          setOpen(value as string[]);
          sound.play("switch");
        }}
      >
        {honors.map((honor, i) => (
          <Accordion.Item key={honor.id} value={honor.id} className="ledger__item">
            <Accordion.Header className="ledger__header">
              <Accordion.Trigger className="ledger__trigger">
                <span className="ledger__no mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="ledger__year mono">{honor.year}</span>
                <span className="ledger__name">{honor.title}</span>
                <span className="ledger__level">{honor.level}</span>
                <span className="ledger__kind mono">{honor.kind}</span>
                <span className="ledger__plus" aria-hidden="true">
                  <i />
                  <i />
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="ledger__panel">
              <AnimatePresence initial={false}>
                <motion.div
                  className="ledger__inner"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p>{honor.org}</p>
                  <span className="ledger__stamp mono">ЗАВЕРШЕНО · 已归档</span>
                </motion.div>
              </AnimatePresence>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
