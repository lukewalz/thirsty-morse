import type { PLPoint } from "@/lib/stats";

interface Props {
  points: PLPoint[];
  width?: number;
  height?: number;
  className?: string;
}

export default function PLChart({
  points,
  width = 480,
  height = 110,
  className,
}: Props) {
  if (points.length < 2) return null;

  const last = points[points.length - 1].cumulative;
  const positive = last >= 0;
  const stroke = positive ? "var(--color-positive)" : "var(--color-negative)";

  const values = points.map((p) => p.cumulative);
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const span = max - min || 1;

  const padX = 4;
  const padY = 6;
  const w = width - padX * 2;
  const h = height - padY * 2;

  const xStep = w / (points.length - 1);
  const y = (v: number) => padY + ((max - v) / span) * h;
  const zeroY = y(0);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(padX + i * xStep).toFixed(1)},${y(p.cumulative).toFixed(1)}`)
    .join(" ");

  const areaPath =
    `M${padX},${zeroY.toFixed(1)} ` +
    points
      .map(
        (p, i) =>
          `L${(padX + i * xStep).toFixed(1)},${y(p.cumulative).toFixed(1)}`,
      )
      .join(" ") +
    ` L${(padX + (points.length - 1) * xStep).toFixed(1)},${zeroY.toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      {/* zero baseline */}
      <line
        x1={padX}
        x2={padX + w}
        y1={zeroY}
        y2={zeroY}
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeDasharray="3 4"
      />
      <path d={areaPath} fill={stroke} fillOpacity="0.1" />
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={padX + (points.length - 1) * xStep}
        cy={y(last)}
        r="3"
        fill={stroke}
      />
    </svg>
  );
}
