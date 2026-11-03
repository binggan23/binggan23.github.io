import { useState } from "react";
import { motion } from "motion/react";
import { profile } from "../data/profile";
import SplitText from "../components/SplitText";
import Magnetic from "../components/Magnetic";
import { sound } from "../lib/sound";
import { stampNotice } from "../lib/toast";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      sound.play("stamp");
      stampNotice("已复制到剪贴板", profile.email);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      stampNotice("复制失败", "请手动选中邮箱地址：" + profile.email);
    }
  };

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact__grid" aria-hidden="true" />
      <div className="contact__dotted" aria-hidden="true" />
      <div className="contact__beam" aria-hidden="true" />

      <header className="contact__head">
        <span className="mono">06 / КОНТАКТ</span>
        <span className="contact__head-rule" aria-hidden="true" />
        <span className="mono">SIGNAL · CHANNEL OPEN</span>
      </header>

      <div className="contact__body">
        <h2 className="contact__title display" id="contact-title">
          <span className="contact__title-line">
            <SplitText text="把下一台机器" mode="chars" stagger={0.028} duration={1.2} />
          </span>
          <span className="contact__title-line contact__title-line--indent">
            <SplitText text="交给我。" mode="chars" stagger={0.028} duration={1.2} delay={0.16} />
          </span>
        </h2>

        <p className="contact__serif serif" aria-hidden="true">
          and that&rsquo;s how it runs<span className="contact__serif-dot">.</span>
        </p>

        <div className="contact__links">
          <motion.a
            className="contact__link"
            href={profile.links.github}
            target="_blank"
            rel="noreferrer noopener"
            whileHover={{ x: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="contact__link-key mono">GITHUB</span>
            <span className="contact__link-val">github.com/binggan23</span>
            <span className="contact__link-arrow" aria-hidden="true">↗</span>
          </motion.a>

          <motion.a
            className="contact__link"
            href={profile.links.bilibili}
            target="_blank"
            rel="noreferrer noopener"
            whileHover={{ x: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="contact__link-key mono">BILIBILI</span>
            <span className="contact__link-val">{profile.links.bilibiliHandle}</span>
            <span className="contact__link-arrow" aria-hidden="true">↗</span>
          </motion.a>

          <button type="button" className="contact__link contact__link--button" onClick={copy}>
            <span className="contact__link-key mono">MAIL / QQ</span>
            <span className="contact__link-val">{profile.email}</span>
            <span className="contact__link-arrow" aria-hidden="true">{copied ? "✓" : "⧉"}</span>
          </button>
        </div>
      </div>

      <footer className="contact__foot">
        <span className="mono">© 2026 {profile.name} · {profile.nameRu}</span>
        <Magnetic strength={6}>
          <a className="contact__top mono" href="#hero">НАВЕРХ ↑</a>
        </Magnetic>
        <span className="mono">THREE.JS · MOTION · BASE UI</span>
      </footer>
    </section>
  );
}
