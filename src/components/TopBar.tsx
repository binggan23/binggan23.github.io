import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Dialog } from "@base-ui/react/dialog";
import { profile, navItems } from "../data/profile";
import { sound } from "../lib/sound";
import SoundToggle from "./SoundToggle";

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return (
    <span className="topbar__clock mono" aria-label="本地时间">
      <span className="topbar__dot" aria-hidden="true" />
      CN {hh}:{mm}:{ss}
    </span>
  );
}

export default function TopBar() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.3 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) sound.play("open");
  }, [open]);

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="topbar__mark" href="#hero" aria-label="回到序章">
          <span className="topbar__mark-glyph" aria-hidden="true">СК</span>
          <span className="topbar__mark-text mono">
            {profile.name} <em>/</em> {profile.nameRu}
          </span>
        </a>

        <span className="topbar__file mono" aria-hidden="true">
          ЛИЧНОЕ ДЕЛО <b>№ {profile.fileNo}</b>
        </span>

        <div className="topbar__right">
          <SoundToggle />
          <Clock />
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="topbar__menu" aria-label="打开章节索引">
              <span className="mono">索引</span>
              <span className="topbar__burger" aria-hidden="true">
                <i />
                <i />
              </span>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="index__backdrop" />
              <Dialog.Viewport className="index__viewport">
                <Dialog.Popup className="index__popup">
                  <Dialog.Title className="visually-hidden">页面章节索引</Dialog.Title>
                  <Dialog.Description className="visually-hidden">全站七个章节的目录</Dialog.Description>
                  <div className="index__head">
                    <span className="mono">СОДЕРЖАНИЕ / 目录</span>
                    <Dialog.Close className="index__close mono">ЗАКРЫТЬ ✕</Dialog.Close>
                  </div>
                  <nav className="index__nav" aria-label="章节索引">
                    {navItems.map((item, i) => (
                      <motion.a
                        key={item.id}
                        href={`#${item.id}`}
                        className="index__row"
                        onClick={() => setOpen(false)}
                        initial={{ opacity: 0, x: -28 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="index__num mono">{item.index}</span>
                        <span className="index__label display">{item.label}</span>
                        <span className="index__ru mono">{item.labelRu}</span>
                        <span className="index__arrow" aria-hidden="true">↗</span>
                      </motion.a>
                    ))}
                  </nav>
                  <div className="index__foot mono">
                    <span>{profile.email}</span>
                    <span>© 2026 {profile.name}</span>
                  </div>
                </Dialog.Popup>
              </Dialog.Viewport>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <motion.div className="topbar__progress" style={{ scaleX: width }} aria-hidden="true" />
    </header>
  );
}
