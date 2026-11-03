import { useEffect, useState } from "react";
import { sound } from "../lib/sound";

const KEY = "konstruckt:sound";

export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "1") {
      // don't auto-enable audio without a gesture; remember intent only after click
      setOn(false);
    }
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    sound.setEnabled(next);
    try {
      window.localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  return (
    <button type="button" className={`sound ${on ? "is-on" : ""}`} onClick={toggle} aria-pressed={on} aria-label={on ? "关闭音效" : "开启音效"}>
      <span className="sound__bars" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </span>
      <span className="mono">{on ? "ЗВУК ON" : "ЗВУК OFF"}</span>
    </button>
  );
}
