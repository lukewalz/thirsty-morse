import { format } from "date-fns";
import { useWagers } from "@/store/wagers";
import StateBadge from "@/components/StateBadge";
import StreakBadge from "@/components/StreakBadge";
import PLChart from "@/components/PLChart";
import { LEAGUE_LABEL } from "@/lib/espn";
import { computePLSeries, computeStreak } from "@/lib/stats";
import type { Wager } from "@/lib/types";

export default function History() {
  const wagers = useWagers((s) => s.wagers);
  const remove = useWagers((s) => s.remove);
  const clearAll = useWagers((s) => s.clearAll);

  const totals = wagers.reduce(
    (acc, w) => {
      if (w.status === "won") acc.won += 1;
      if (w.status === "lost") acc.lost += 1;
      if (w.status === "pending") acc.pending += 1;
      acc.staked += w.amount;
      acc.pl += w.result ?? 0;
      return acc;
    },
    { won: 0, lost: 0, pending: 0, staked: 0, pl: 0 },
  );
  const streak = computeStreak(wagers);
  const plSeries = computePLSeries(wagers);

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4 border-b border-line pb-4">
        <div className="flex items-end gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
              Your record
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">History</h1>
          </div>
          <StreakBadge streak={streak} className="mb-1" />
        </div>
        {wagers.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Delete all wagers? This can't be undone.")) clearAll();
            }}
            className="rounded-md border border-line bg-surface px-3 py-1.5 text-xs text-ink-muted hover:border-negative hover:text-negative"
          >
            Clear all
          </button>
        )}
      </header>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="Pending" value={totals.pending} />
        <Stat label="Won" value={totals.won} />
        <Stat label="Lost" value={totals.lost} />
        <Stat label="P/L" value={`$${totals.pl}`} accent={totals.pl >= 0 ? "positive" : "negative"} />
      </div>

      {plSeries.length >= 2 && (
        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
              P/L over time
            </div>
            <div className="font-mono text-[11px] tabular-nums text-ink-dim">
              {plSeries.length} settled
            </div>
          </div>
          <div className="mt-2 text-ink-muted">
            <PLChart points={plSeries} />
          </div>
        </div>
      )}

      {wagers.length === 0 ? (
        <p className="text-ink-muted">No wagers yet.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-2 font-mono text-[11px] uppercase tracking-wider text-ink-dim">
              <tr>
                <th className="px-4 py-3 font-medium">Placed</th>
                <th className="px-4 py-3 font-medium">League</th>
                <th className="px-4 py-3 font-medium">Selection</th>
                <th className="px-4 py-3 text-right font-medium">Stake</th>
                <th className="px-4 py-3 text-right font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {wagers.map((w) => (
                <Row key={w.id} wager={w} onRemove={() => remove(w.id)} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ wager, onRemove }: { wager: Wager; onRemove: () => void }) {
  const isParlay = wager.legs.length > 1;
  const firstLeg = wager.legs[0];
  return (
    <tr className="border-b border-line last:border-b-0 align-top">
      <td className="px-4 py-3 font-mono text-xs text-ink-muted tabular-nums">
        {format(new Date(wager.wager_date), "MMM d, h:mm a")}
      </td>
      <td className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-ink-muted">
        {isParlay ? `Parlay (${wager.legs.length})` : LEAGUE_LABEL[firstLeg.league]}
      </td>
      <td className="px-4 py-3">
        {isParlay ? (
          <ul className="space-y-1">
            {wager.legs.map((leg) => (
              <li key={leg.id} className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-dim">
                  {leg.wager_type === "ou" ? "Total" : "Spread"}
                </span>
                <StateBadge state={leg.status}>{leg.status}</StateBadge>
                <span className="font-mono text-sm tabular-nums">{leg.selection}</span>
                <span className="text-xs text-ink-muted">{leg.game_label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <span className="capitalize">
              {firstLeg.wager_type === "ou" ? "Over/Under" : "Spread"}
            </span>
            {firstLeg.live && (
              <span className="rounded-sm bg-accent/15 px-1 font-mono text-[10px] uppercase text-accent">
                Live
              </span>
            )}
            <span className="font-mono text-sm tabular-nums">{firstLeg.selection}</span>
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
        ${wager.amount}
      </td>
      <td className="px-4 py-3 text-right">
        <StateBadge state={wager.status}>{wager.status}</StateBadge>
        {wager.result != null && wager.result !== 0 && (
          <div
            className={`mt-1 font-mono text-xs tabular-nums ${
              wager.result > 0 ? "text-positive" : "text-negative"
            }`}
          >
            {wager.result > 0 ? "+" : ""}${wager.result.toFixed(2)}
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          onClick={onRemove}
          className="font-mono text-[11px] uppercase tracking-wider text-ink-dim hover:text-negative"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: "positive" | "negative";
}) {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-3">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
        {label}
      </div>
      <div
        className={`mt-1 font-mono text-2xl font-bold tabular-nums ${
          accent === "positive" ? "text-positive" : accent === "negative" ? "text-negative" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
