import type { ESPNWinProbabilityPoint } from "@/lib/types";

interface Props {
  points: ESPNWinProbabilityPoint[];
  /** Which team's probability to draw. Defaults to home. */
  side?: "home" | "away";
  width?: number;
  height?: number;
  className?: string;
}

export default function WinProbChart({
  points,
  side = "home",
  width = 180,
  height = 44,
  className,
}: Props) {
  if (!points || points.length < 2) return null;

  const series = points.map((p) =>
    side === "home" ? p.homeWinPercentage : 1 - p.homeWinPercentage,
  );
  const last = series[series.length - 1];

  const pad = 2;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const xStep = w / (series.length - 1);
  const path = series
    .map((v, i) => {
      const x = pad + i * xStep;
      const y = pad + (1 - v) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  /* Area under the curve, anchored to the 50% line */
  const baseline = pad + 0.5 * h;
  const areaPath =
    `M${pad},${baseline.toFixed(1)} ` +
    series
      .map((v, i) => {
        const x = pad + i * xStep;
        const y = pad + (1 - v) * h;
        return `L${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") +
    ` L${(pad + w).toFixed(1)},${baseline.toFixed(1)} Z`;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        aria-hidden="true"
      >
        {/* 50% reference line */}
        <line
          x1={pad}
          x2={pad + w}
          y1={baseline}
          y2={baseline}
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeDasharray="2 3"
        />
        <path d={areaPath} fill="var(--color-accent)" fillOpacity="0.12" />
        <path
          d={path}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* End dot */}
        <circle
          cx={pad + (series.length - 1) * xStep}
          cy={pad + (1 - last) * h}
          r="2.5"
          fill="var(--color-accent)"
        />
      </svg>
    </div>
  );
}
