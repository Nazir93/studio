"use client";

const C_RED = "#C0392B";
const C_DARK = "#8B1A1A";
const C_CREAM = "#E8D5B7";
const C_BLUE = "#3B82A0";
const C_YELLOW = "#FACC15";
const C_WHITE = "#F5F0E8";

export function CarpetOrnamentVertical({ side = "left", className = "" }: { side?: "left" | "right"; className?: string }) {
  const flip = side === "right" ? "scaleX(-1)" : "none";
  return (
    <svg
      viewBox="0 0 60 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      style={{ transform: flip }}
    >
      {/* Outer border */}
      <rect x="0" y="0" width="2" height="900" fill={C_RED} opacity="0.6" />
      <rect x="4" y="0" width="1" height="900" fill={C_CREAM} opacity="0.3" />

      {/* Repeating pattern */}
      {Array.from({ length: 18 }).map((_, i) => {
        const y = i * 50;
        const opac = 0.5 + Math.sin(i * 0.5) * 0.2;
        return (
          <g key={i} opacity={opac}>
            {/* Main rhombus */}
            <polygon
              points={`30,${y + 5} 48,${y + 25} 30,${y + 45} 12,${y + 25}`}
              stroke={C_RED}
              strokeWidth="1.2"
              fill="none"
            />
            {/* Inner rhombus */}
            <polygon
              points={`30,${y + 12} 40,${y + 25} 30,${y + 38} 20,${y + 25}`}
              stroke={C_CREAM}
              strokeWidth="0.6"
              fill="none"
            />
            {/* Center cross */}
            <line x1="26" y1={y + 25} x2="34" y2={y + 25} stroke={C_YELLOW} strokeWidth="0.8" />
            <line x1="30" y1={y + 21} x2="30" y2={y + 29} stroke={C_YELLOW} strokeWidth="0.8" />
            {/* Corner triangles */}
            <polygon points={`12,${y + 25} 8,${y + 20} 8,${y + 30}`} fill={C_DARK} opacity="0.4" />
            <polygon points={`48,${y + 25} 52,${y + 20} 52,${y + 30}`} fill={C_DARK} opacity="0.4" />
            {/* Small blue stars */}
            <circle cx="30" cy={y + 5} r="1.5" fill={C_BLUE} opacity="0.5" />
            {/* Hook elements */}
            <path d={`M8,${y + 10} L14,${y + 10} L14,${y + 16}`} stroke={C_CREAM} strokeWidth="0.5" fill="none" opacity="0.4" />
            <path d={`M52,${y + 10} L46,${y + 10} L46,${y + 16}`} stroke={C_CREAM} strokeWidth="0.5" fill="none" opacity="0.4" />
            <path d={`M8,${y + 40} L14,${y + 40} L14,${y + 34}`} stroke={C_CREAM} strokeWidth="0.5" fill="none" opacity="0.4" />
            <path d={`M52,${y + 40} L46,${y + 40} L46,${y + 34}`} stroke={C_CREAM} strokeWidth="0.5" fill="none" opacity="0.4" />
          </g>
        );
      })}

      {/* Inner border */}
      <rect x="57" y="0" width="2" height="900" fill={C_RED} opacity="0.4" />
      <rect x="55" y="0" width="1" height="900" fill={C_CREAM} opacity="0.15" />
    </svg>
  );
}

export function CarpetBorderHorizontal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1400 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Top/bottom lines */}
      <rect x="0" y="0" width="1400" height="1.5" fill={C_RED} opacity="0.5" />
      <rect x="0" y="22" width="1400" height="1.5" fill={C_RED} opacity="0.5" />
      <rect x="0" y="3" width="1400" height="0.5" fill={C_CREAM} opacity="0.2" />
      <rect x="0" y="20" width="1400" height="0.5" fill={C_CREAM} opacity="0.2" />

      {/* Repeating diamonds */}
      {Array.from({ length: 47 }).map((_, i) => {
        const x = i * 30 + 15;
        return (
          <g key={i} opacity={0.55}>
            <polygon
              points={`${x},5 ${x + 7},12 ${x},19 ${x - 7},12`}
              stroke={C_RED}
              strokeWidth="0.8"
              fill="none"
            />
            <polygon
              points={`${x},8 ${x + 4},12 ${x},16 ${x - 4},12`}
              stroke={C_CREAM}
              strokeWidth="0.4"
              fill="none"
              opacity="0.5"
            />
            <circle cx={x} cy={12} r="1" fill={C_YELLOW} opacity="0.5" />
          </g>
        );
      })}
    </svg>
  );
}
