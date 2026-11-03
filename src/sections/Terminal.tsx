import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Reveal from "../components/Reveal";
import { sound } from "../lib/sound";

type Line = { prompt: boolean; text: string; out?: string };

const SESSION: Line[] = [
  { prompt: true, text: "uname -a", out: "Linux cookie 7.0.0 #38 SMP x86_64 GNU/Linux" },
  { prompt: true, text: "dsh --agent neo --workspace ./site", out: "▸ harness ready · skills 12 · mcp servers 3" },
  { prompt: true, text: "neo-skill plan --goal 'ship personal page'", out: "▸ state machine: DRAFT → REVIEW → GATED → SHIPPED" },
  { prompt: true, text: "docker compose up -d --build", out: "✔ web  healthy  443/tcp  0.8s" },
  { prompt: true, text: "curl -sI https://binggan23.github.io", out: "HTTP/2 200 · cf-cache-status: HIT" },
];

export default function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(reduce ? SESSION.length : 0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView || reduce) return;
    let cancelled = false;
    let timer = 0;

    const typeLine = (lineIndex: number) => {
      if (cancelled || lineIndex >= SESSION.length) return;
      const text = SESSION[lineIndex].text;
      let i = 0;
      const step = () => {
        if (cancelled) return;
        i += 1;
        setTyped(text.slice(0, i));
        if (i < text.length) {
          timer = window.setTimeout(step, 18 + Math.random() * 30);
        } else {
          setVisible(lineIndex + 1);
          setTyped("");
          timer = window.setTimeout(() => typeLine(lineIndex + 1), 620);
        }
      };
      timer = window.setTimeout(step, 240);
    };

    timer = window.setTimeout(() => typeLine(0), 380);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [inView, reduce]);

  return (
    <section className="terminal" id="terminal" aria-labelledby="terminal-title">
      <Reveal className="terminal__frame">
        <div className="terminal__bar">
          <span className="terminal__dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="mono">cookie@konstruckt — /srv/portfolio</span>
          <span className="mono terminal__bar-right">zsh · 220×48</span>
        </div>
        <h2 className="visually-hidden" id="terminal-title">工作流终端演示</h2>
        <div className="terminal__body" ref={ref} aria-label="终端会话演示">
          {SESSION.map((line, i) => (
            <div className="terminal__line" key={line.text}>
              {i < visible ? (
                <>
                  <span className="terminal__prompt">cookie@dsh</span>
                  <span className="terminal__path">:~$</span>
                  <span className="terminal__cmd">{line.text}</span>
                  <span className="terminal__out">{line.out}</span>
                </>
              ) : null}
            </div>
          ))}
          {visible < SESSION.length && (
            <div className="terminal__line terminal__line--typing">
              <span className="terminal__prompt">cookie@dsh</span>
              <span className="terminal__path">:~$</span>
              <span className="terminal__cmd">{typed}</span>
              <span className="terminal__caret" aria-hidden="true" />
            </div>
          )}
          {visible >= SESSION.length && (
            <div className="terminal__line">
              <span className="terminal__prompt">cookie@dsh</span>
              <span className="terminal__path">:~$</span>
              <span className="terminal__caret" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="terminal__foot">
          <button
            type="button"
            className="terminal__btn mono"
            onClick={() => {
              setVisible(0);
              setTyped("");
              sound.play("open");
              window.dispatchEvent(new Event("resize"));
              setTimeout(() => setVisible(SESSION.length), 40);
            }}
          >
            ↻ 重放会话
          </button>
          <span className="mono terminal__hint">真实流水：plan → gate → ship</span>
        </div>
        <div className="terminal__scanlines" aria-hidden="true" />
      </Reveal>
    </section>
  );
}
