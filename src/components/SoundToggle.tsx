import { useEffect, useRef, useState } from "react";
import { sound } from "../lib/sound";
import { music } from "../lib/music";

const KEY = "konstruckt:sound";

/**
 * Sound master switch. The synth kit and the music bed share it, so one
 * gesture arms the whole room. The bed also lazily starts on the very first
 * interaction unless the visitor muted the site on a previous visit.
 */
export default function SoundToggle() {
  const [on, setOn] = useState(false);
  const onRef = useRef(false);

  const apply = (next: boolean) => {
    onRef.current = next;
    setOn(next);
    sound.setEnabled(next);
    music.toggle(next);
    try {
      window.localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    if (stored === "0") return; // visitor muted the site last time — stay quiet

    const arm = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest(".sound")) return; // let the toggle handle its own click
      apply(true);
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
    window.addEventListener("pointerdown", arm, { passive: true });
    window.addEventListener("keydown", arm);
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, []);

  useEffect(() => () => music.stop(), []);

  return (
    <button
      type="button"
      className={"sound" + (on ? " is-on" : "")}
      onClick={() => apply(!onRef.current)}
      aria-pressed={on}
      aria-label={on ? "关闭音效与背景音乐" : "开启音效与背景音乐"}
      title={on ? "ЗВУК + МУЗЫКА ON" : "ЗВУК + МУЗЫКА OFF"}
    >
      <span className="sound__bars" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </span>
      <span className="mono">{on ? "ЗВУК ON" : "ЗВУК OFF"}</span>
    </button>
  );
}
