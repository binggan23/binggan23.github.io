import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { Toast } from "@base-ui/react/toast";
import Intro from "./components/Intro";
import TopBar from "./components/TopBar";
import SideRail from "./components/SideRail";
import Cursor from "./components/Cursor";
import Toaster from "./components/Toaster";
import CommandPalette from "./components/CommandPalette";
import Hud from "./components/Hud";
import ScrollRail from "./components/ScrollRail";
import Cut from "./components/Cut";
import Film from "./sections/Film";
import Hero from "./sections/Hero";
import Dossier from "./sections/Dossier";
import Manifesto from "./sections/Manifesto";
import Interlude from "./sections/Interlude";
import Arsenal from "./sections/Arsenal";
import Terminal from "./sections/Terminal";
import Archive from "./sections/Archive";
import Honors from "./sections/Honors";
import Path from "./sections/Path";
import Contact from "./sections/Contact";
import { navItems } from "./data/profile";
import { useActiveSection, usePrefersReducedMotion, useSmoothScroll } from "./lib/hooks";
import { bindSoundToDom, sound } from "./lib/sound";
import { toastManager } from "./lib/toast";
import { useEasterEgg } from "./lib/easterEgg";

const SECTION_IDS = [...navItems.map((n) => n.id), "manifesto", "interlude", "film", "terminal"];

export default function App() {
  const reduce = usePrefersReducedMotion();
  const [introDone, setIntroDone] = useState(reduce);
  const active = useActiveSection(SECTION_IDS);

  useSmoothScroll(!reduce && introDone);
  useEasterEgg();

  useEffect(() => bindSoundToDom(), []);

  useEffect(() => {
    if (active) sound.play("tick");
  }, [active]);

  const finishIntro = useCallback(() => {
    setIntroDone(true);
    document.documentElement.classList.remove("is-locked");
    sound.play("whoosh");
  }, []);

  useEffect(() => {
    if (!reduce) document.documentElement.classList.add("is-locked");
  }, [reduce]);

  return (
    <MotionConfig reducedMotion={reduce ? "always" : "user"}>
      <Toast.Provider toastManager={toastManager} timeout={4200} limit={3}>
        <a className="skip-link" href="#dossier">跳到主要内容</a>

        <AnimatePresence>{!introDone && <Intro onDone={finishIntro} />}</AnimatePresence>

        <TopBar />
        <SideRail active={active} />
        <Cursor />
        <Hud section={active} />
        <ScrollRail />

        <main className="page">
          <Hero />
          <Dossier />
          <Manifesto />
          <Interlude />
          <Film />
          <Cut label="АРСЕНАЛ · 02 → 03" />
          <Arsenal />
          <Terminal />
          <Archive />
          <Cut label="ЗАСЛУГИ · 04" reverse />
          <Honors />
          <Path />
          <Contact />
        </main>

        <CommandPalette />
        <Toaster />
      </Toast.Provider>
    </MotionConfig>
  );
}
