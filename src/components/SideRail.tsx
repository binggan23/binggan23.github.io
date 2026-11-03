import { navItems, profile } from "../data/profile";

type SideRailProps = { active: string };

export default function SideRail({ active }: SideRailProps) {
  return (
    <aside className="rail" aria-label="章节索引">
      <div className="rail__top mono">№ {profile.fileNo}</div>
      <ul className="rail__list">
        {navItems.map((item) => (
          <li key={item.id} className={active === item.id ? "is-active" : undefined}>
            <a href={`#${item.id}`} aria-current={active === item.id ? "page" : undefined}>
              <span className="rail__num mono">{item.index}</span>
              <span className="rail__label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="rail__bottom mono">
        <span className="rail__glyph" aria-hidden="true">✳</span>
        <span>2026</span>
      </div>
    </aside>
  );
}
