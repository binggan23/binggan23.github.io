import { useEffect, useMemo, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { motion } from "motion/react";
import { navItems, projects, profile } from "../data/profile";
import { sound } from "../lib/sound";
import { stampNotice } from "../lib/toast";

type Cmd = { id: string; group: string; label: string; hint: string; run: () => void };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "/" && !open) {
        const t = e.target as HTMLElement;
        if (t.tagName === "INPUT" || t.tagName === "TEXTAREA") return;
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      sound.play("open");
    }
  }, [open]);

  const commands: Cmd[] = useMemo(() => {
    const jump = (id: string) => () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpen(false);
    };
    return [
      ...navItems.map((n) => ({
        id: `nav-${n.id}`,
        group: "跳转 / НАВИГАЦИЯ",
        label: `${n.index} · ${n.label} — ${n.labelRu}`,
        hint: "SECTION",
        run: jump(n.id),
      })),
      ...projects.map((p) => ({
        id: `proj-${p.id}`,
        group: "项目 / АРХИВ",
        label: `${p.title} — ${p.subtitle}`,
        hint: p.year,
        run: () => {
          window.open(p.link, "_blank", "noopener");
          setOpen(false);
        },
      })),
      {
        id: "mail",
        group: "联系 / КОНТАКТ",
        label: `复制邮箱 ${profile.email}`,
        hint: "COPY",
        run: async () => {
          await navigator.clipboard.writeText(profile.email).catch(() => undefined);
          stampNotice("已复制邮箱", profile.email);
          setOpen(false);
        },
      },
      {
        id: "github",
        group: "联系 / КОНТАКТ",
        label: "打开 GitHub 主页",
        hint: "↗",
        run: () => {
          window.open(profile.links.github, "_blank", "noopener");
          setOpen(false);
        },
      },
      {
        id: "bili",
        group: "联系 / КОНТАКТ",
        label: "打开 Bilibili 空间",
        hint: "↗",
        run: () => {
          window.open(profile.links.bilibili, "_blank", "noopener");
          setOpen(false);
        },
      },
    ];
  }, []);

  const filtered = commands.filter((c) => (c.label + c.group + c.hint).toLowerCase().includes(query.toLowerCase()));
  const groups = Array.from(new Set(filtered.map((c) => c.group)));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(filtered.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[cursor]?.run();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="cmdk__backdrop" />
        <Dialog.Viewport className="cmdk__viewport">
          <Dialog.Popup className="cmdk">
            <Dialog.Title className="visually-hidden">命令面板</Dialog.Title>
            <div className="cmdk__bar">
              <span className="cmdk__prompt mono">»</span>
              <input
                autoFocus
                className="cmdk__input"
                placeholder="搜索章节、项目、联系方式…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onKeyDown}
                aria-label="搜索命令"
              />
              <span className="cmdk__esc mono">ESC</span>
            </div>
            <div className="cmdk__list" role="listbox" aria-label="命令列表">
              {groups.length === 0 && <p className="cmdk__empty mono">НЕТ РЕЗУЛЬТАТОВ / 无结果</p>}
              {groups.map((group) => (
                <div className="cmdk__group" key={group}>
                  <span className="cmdk__group-label mono">{group}</span>
                  {filtered
                    .filter((c) => c.group === group)
                    .map((cmd) => {
                      const index = filtered.indexOf(cmd);
                      return (
                        <motion.button
                          key={cmd.id}
                          type="button"
                          role="option"
                          aria-selected={index === cursor}
                          className={`cmdk__item ${index === cursor ? "is-active" : ""}`}
                          onMouseEnter={() => setCursor(index)}
                          onClick={cmd.run}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.2) }}
                        >
                          <span className="cmdk__label">{cmd.label}</span>
                          <span className="cmdk__hint mono">{cmd.hint}</span>
                        </motion.button>
                      );
                    })}
                </div>
              ))}
            </div>
            <div className="cmdk__foot mono">
              <span>↑↓ 选择</span>
              <span>↵ 执行</span>
              <span>⌘K / / 关闭</span>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
