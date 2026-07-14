// Postmark-style circular stamp — used to mark features, badges, and milestones
// throughout the app (Home features, achievement badges, roadmap nodes).
import { cn } from "@/lib/utils/cn";

interface PostmarkStampProps {
  /** Text curved along the top of the ring, e.g. "FLUENI • EST. 2026 •" */
  label?: string;
  /** Content in the center — a number, icon, or short word */
  children: React.ReactNode;
  size?: number;
  color?: "ink-navy" | "airmail" | "stamp-teal" | "gold-foil";
  /** Rotation in degrees — small random-looking tilt makes it read as hand-stamped */
  rotate?: number;
  className?: string;
}

const colorMap = {
  "ink-navy": "#1B2A4C",
  airmail: "#E8543F",
  "stamp-teal": "#2A9D8F",
  "gold-foil": "#D4A657",
};

export default function PostmarkStamp({ label, children, size = 96, color = "ink-navy", rotate = -6, className }: PostmarkStampProps) {
  const stroke = colorMap[color];
  const id = `postmark-path-${label?.replace(/\s+/g, "-") ?? "default"}`;
  const r = size / 2;
  const textRadius = r - 10;

  return (
    <div
      className={cn("inline-flex items-center justify-center select-none", className)}
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)` }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute">
        <defs>
          <path id={id} d={`M ${r},${r} m -${textRadius},0 a ${textRadius},${textRadius} 0 1,1 ${textRadius * 2},0 a ${textRadius},${textRadius} 0 1,1 -${textRadius * 2},0`} />
        </defs>
        {/* Outer double ring, dashed like a real postmark */}
        <circle cx={r} cy={r} r={r - 3} fill="none" stroke={stroke} strokeWidth={2} strokeDasharray="3 3" />
        <circle cx={r} cy={r} r={r - 8} fill="none" stroke={stroke} strokeWidth={1.5} />
        {label && (
          <text fontSize={size * 0.1} fill={stroke} letterSpacing="1.5" fontFamily="var(--font-body)" fontWeight={600}>
            <textPath href={`#${id}`} startOffset="0%">
              {label}
            </textPath>
          </text>
        )}
      </svg>
      <div
        className="relative z-10 flex flex-col items-center justify-center font-display font-bold"
        style={{ color: stroke, fontSize: size * 0.22 }}
      >
        {children}
      </div>
    </div>
  );
}
