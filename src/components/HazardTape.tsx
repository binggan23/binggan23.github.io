/** Diagonal hazard stripes — pure CSS, no assets. */
export default function HazardTape({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  return <div className={"hazard " + (vertical ? "hazard--v " : "") + (className ?? "")} aria-hidden="true" />;
}
