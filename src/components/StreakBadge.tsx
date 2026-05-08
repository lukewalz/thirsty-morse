import clsx from "clsx";
import type { Streak } from "@/lib/stats";

export default function StreakBadge({
  streak,
  className,
}: {
  streak: Streak;
  className?: string;
}) {
  if (streak.count === 0) return null;
  const winning = streak.type === "won";
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs font-medium",
        winning
          ? "bg-positive/10 text-positive"
          : "bg-negative/10 text-negative",
        className,
      )}
    >
      <span aria-hidden="true">{winning ? "🔥" : "🥶"}</span>
      <span className="tabular-nums">
        {streak.count} {winning ? "W" : "L"} streak
      </span>
    </span>
  );
}
