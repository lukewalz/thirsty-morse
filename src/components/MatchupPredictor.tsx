import type { ESPNPredictor } from "@/lib/types";

interface Props {
  predictor: ESPNPredictor;
  awayAbbr: string;
  homeAbbr: string;
}

export default function MatchupPredictor({
  predictor,
  awayAbbr,
  homeAbbr,
}: Props) {
  const homePct = clamp(parseFloat(predictor.homeTeam.gameProjection));
  const awayPct = clamp(parseFloat(predictor.awayTeam.gameProjection));
  if (!Number.isFinite(homePct) || !Number.isFinite(awayPct)) return null;
  const favored = homePct >= awayPct ? "home" : "away";

  return (
    <section className="rounded-lg border border-line bg-surface p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
        ESPN Matchup Predictor
      </div>
      <h2 className="mt-1 text-xl font-semibold tracking-tight">
        {favored === "home" ? homeAbbr : awayAbbr}{" "}
        <span className="text-ink-dim">favored</span>{" "}
        {favored === "home" ? homePct.toFixed(1) : awayPct.toFixed(1)}%
      </h2>

      <div className="mt-5">
        <div className="mb-2 flex items-baseline justify-between font-mono text-xs tabular-nums">
          <span className="text-ink-muted">
            <span className="text-ink-dim">{awayAbbr}</span>{" "}
            <span className="font-semibold text-ink">{awayPct.toFixed(1)}%</span>
          </span>
          <span className="text-ink-muted">
            <span className="font-semibold text-ink">{homePct.toFixed(1)}%</span>{" "}
            <span className="text-ink-dim">{homeAbbr}</span>
          </span>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-surface-3">
          <div
            className="bg-ink-muted transition-all duration-500"
            style={{ width: `${awayPct}%` }}
          />
          <div
            className="bg-accent transition-all duration-500"
            style={{ width: `${homePct}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return n;
  return Math.max(0, Math.min(100, n));
}
