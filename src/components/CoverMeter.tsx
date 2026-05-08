import clsx from "clsx";

interface Props {
  value: number;
  /** Soft clamp range — values outside still render but pin to the edge. */
  range?: number;
  className?: string;
}

export default function CoverMeter({
  value,
  range = 10,
  className,
}: Props) {
  const clamped = Math.max(-range, Math.min(range, value));
  /* 0 maps to 50%; +range maps to 100%; -range maps to 0% */
  const pct = ((clamped + range) / (range * 2)) * 100;
  const covering = value > 0;
  const push = value === 0;

  return (
    <div className={clsx("w-full", className)}>
      <div className="relative h-1.5 w-full rounded-full bg-surface-3">
        {/* Center line marker */}
        <div className="absolute left-1/2 top-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2 bg-ink-dim" />
        {/* Indicator */}
        <div
          className={clsx(
            "absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500",
            push
              ? "bg-ink-muted"
              : covering
                ? "bg-positive shadow-[0_0_0_3px_rgba(22,163,74,0.15)]"
                : "bg-negative shadow-[0_0_0_3px_rgba(220,38,38,0.15)]",
          )}
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-ink-dim">
        <span>−{range}</span>
        <span
          className={clsx(
            "font-medium",
            push ? "text-ink-muted" : covering ? "text-positive" : "text-negative",
          )}
        >
          {push ? "EVEN" : covering ? `+${value.toFixed(1)}` : value.toFixed(1)}
        </span>
        <span>+{range}</span>
      </div>
    </div>
  );
}
