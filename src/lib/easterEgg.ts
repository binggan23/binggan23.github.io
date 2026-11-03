import { useEffect } from "react";
import { sound } from "./sound";
import { stampNotice } from "./toast";

const WORD = "ussr";

/**
 * Type "ussr" anywhere (not in an input) to fire the agit-prop sweep.
 * Pure theatre; nothing functional depends on it.
 */
export function useEasterEgg() {
  useEffect(() => {
    let buffer = "";

    const fire = () => {
      const el = document.createElement("div");
      el.className = "agit";
      el.innerHTML = '<span class="agit__text">ТРУД · ЗНАНИЕ · МАШИНА</span><span class="agit__sub">СЛАВА ИНЖЕНЕРАМ / 工程师万岁</span>';
      document.body.appendChild(el);
      sound.play("stamp");
      stampNotice("СЕКРЕТНЫЙ ПРОТОКОЛ / 秘密协议", "你找到了隐藏的标语层。");
      window.setTimeout(() => el.classList.add("is-out"), 2400);
      window.setTimeout(() => el.remove(), 3200);
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-WORD.length);
      if (buffer === WORD) {
        buffer = "";
        fire();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
