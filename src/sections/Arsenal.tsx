import { Tabs } from "@base-ui/react/tabs";
import { motion } from "motion/react";
import { useState } from "react";
import Reveal from "../components/Reveal";
import Marquee from "../components/Marquee";
import { skills, marqueeWordsRu } from "../data/profile";
import { sound } from "../lib/sound";

export default function Arsenal() {
  const [active, setActive] = useState("А-02");
  const current = skills.find((s) => s.code === active) ?? skills[0];

  return (
    <section className="arsenal" id="arsenal" aria-labelledby="arsenal-title">
      <div className="arsenal__band" aria-hidden="true">
        <Marquee words={marqueeWordsRu} duration={52} reverse separator="·" />
      </div>

      <header className="sec-head">
        <Reveal className="sec-head__line">
          <span className="mono">02 / АРСЕНАЛ</span>
          <span className="sec-head__rule" aria-hidden="true" />
          <span className="mono">CAPABILITY SHEET</span>
        </Reveal>
        <div className="sec-head__main">
          <h2 className="sec-head__title display" id="arsenal-title">
            能力<span className="sec-head__title-en">ARSENAL</span>
          </h2>
          <p className="sec-head__note">
            语言是手，Agent 是车间，Linux 是地基，Docker 是出厂运输。每一层都要能被验证。
          </p>
        </div>
      </header>

      <div className="arsenal__body">
        <Tabs.Root
          className="tabs"
          orientation="vertical"
          defaultValue={skills[1].code}
          onValueChange={(value) => {
            setActive(String(value));
            sound.play("switch");
          }}
        >
          <Tabs.List className="tabs__list" aria-label="能力分类">
            {skills.map((skill, i) => (
              <Tabs.Tab key={skill.code} value={skill.code} className="tabs__tab">
                <span className="tabs__num mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="tabs__label display">{skill.label}</span>
                <span className="tabs__ru mono">{skill.labelRu}</span>
                <span className="tabs__code mono">{skill.code}</span>
              </Tabs.Tab>
            ))}
            <Tabs.Indicator className="tabs__indicator" />
          </Tabs.List>

          <div className="tabs__stage">
            {skills.map((skill) => (
              <Tabs.Panel key={skill.code} value={skill.code} className="tabs__panel">
                <div className="tabs__panel-head">
                  <span className="mono">РАЗДЕЛ {skill.code}</span>
                  <span className="tabs__panel-count display">{String(skill.items.length).padStart(2, "0")}</span>
                </div>
                <ul className="spec">
                  {skill.items.map((item, i) => (
                    <motion.li
                      className="spec__row"
                      key={item.name}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <span className="spec__index mono">{String(i + 1).padStart(2, "0")}</span>
                      <span className="spec__name">{item.name}</span>
                      <span className="spec__note">{item.note}</span>
                      <span className="spec__glyph" aria-hidden="true">+</span>
                    </motion.li>
                  ))}
                </ul>
              </Tabs.Panel>
            ))}
          </div>
        </Tabs.Root>

        <aside className="arsenal__aside" aria-hidden="true">
          <div className="arsenal__gauge">
            <span className="mono">СМЕНА</span>
            <span className="arsenal__gauge-num display">8</span>
            <span className="mono">ЧАСОВ</span>
          </div>
          <div className="arsenal__bars">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scaleY: 0.15 }}
                whileInView={{ scaleY: 0.2 + ((i * 37) % 80) / 100 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>
          <span className="arsenal__aside-label mono">{current.labelRu} / {current.code}</span>
        </aside>
      </div>
    </section>
  );
}
