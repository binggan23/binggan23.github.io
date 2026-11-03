type StampProps = {
  text: string;
  sub?: string;
  size?: number;
  className?: string;
  ink?: "red" | "ink" | "ochre";
};

/** Circular rubber stamp with text on a path; rotated like a real hand stamp. */
export default function Stamp({ text, sub, size = 132, className, ink = "red" }: StampProps) {
  const id = `stamp-${text.replace(/[^a-zA-Zа-яА-Я0-9]/g, "")}${sub ? "-" + sub.replace(/[^a-zA-Zа-яА-Я0-9]/g, "") : ""}`;
  const chars = Array.from(text).join(" ");
  return (
    <div className={`stamp stamp--${ink} ${className ?? ""}`} style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="100" cy="100" r="83" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
        <path id={`${id}-path`} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" fill="none" />
        <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="13.5" fontFamily="Oswald, sans-serif" letterSpacing="1.6" fill="currentColor" style={{ fontWeight: 600 }}>
          {chars}
        </text>
        {sub ? (
          <text x="100" y="146" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="1.2" fill="currentColor" opacity="0.85">
            {sub}
          </text>
        ) : null}
        <line x1="100" y1="86" x2="100" y2="124" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      </svg>
    </div>
  );
}
