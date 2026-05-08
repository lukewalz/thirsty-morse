import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWagers } from "@/store/wagers";
import {
  combinedDecimal,
  decimalToAmerican,
  projectedPayout,
  projectedProfit,
} from "@/lib/odds";
import { LEAGUE_TAG } from "@/lib/espn";

export default function ParlaySlip() {
  const slip = useWagers((s) => s.slip);
  const removeFromSlip = useWagers((s) => s.removeFromSlip);
  const clearSlip = useWagers((s) => s.clearSlip);
  const placeSlip = useWagers((s) => s.placeSlip);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("50");
  const [closeKey, setCloseKey] = useState(0);

  if (slip.length === 0) return null;

  const stake = Number(amount);
  const valid = Number.isFinite(stake) && stake > 0;
  const decimal = combinedDecimal(slip.length);
  const american = decimalToAmerican(decimal);
  const payout = projectedPayout(stake || 0, slip.length);
  const profit = projectedProfit(stake || 0, slip.length);

  function place() {
    if (!valid) return;
    placeSlip(stake);
    setOpen(false);
    setCloseKey((k) => k + 1);
    navigate("/");
  }

  return (
    <div
      key={closeKey}
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-xl border border-line bg-surface shadow-[0_8px_30px_rgba(15,18,24,0.18)]"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3"
      >
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-accent px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-white">
            Parlay
          </span>
          <span className="font-mono text-sm tabular-nums">
            {slip.length} {slip.length === 1 ? "leg" : "legs"}
          </span>
          <span className="font-mono text-xs text-ink-muted tabular-nums">
            {american} · {decimal.toFixed(2)}x
          </span>
        </div>
        <span className="font-mono text-xs text-ink-dim">
          {open ? "Hide ↓" : "Open ↑"}
        </span>
      </button>

      {open && (
        <div className="border-t border-line px-5 pb-5 pt-4">
          <ul className="space-y-2">
            {slip.map((leg) => (
              <li
                key={leg.id}
                className="flex items-center justify-between gap-3 rounded-md border border-line bg-surface-2 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-dim">
                    <span>{LEAGUE_TAG[leg.league]}</span>
                    <span>·</span>
                    <span>{leg.wager_type === "ou" ? "Total" : "Spread"}</span>
                    {leg.live && (
                      <span className="rounded-sm bg-accent/15 px-1 text-[10px] text-accent">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="truncate text-sm">
                    <span className="font-mono font-medium tabular-nums">
                      {leg.selection}
                    </span>
                    <span className="ml-2 text-ink-muted">{leg.game_label}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromSlip(leg.id)}
                  className="font-mono text-[11px] uppercase tracking-wider text-ink-dim hover:text-negative"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {slip.length < 2 && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink-dim">
              Add at least one more leg for a parlay.
            </p>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-end">
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">
                Stake
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-ink-muted">$</span>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-24 rounded-md border border-line bg-surface px-3 py-2 font-mono text-base tabular-nums focus:border-accent focus:outline-none"
                />
              </div>
            </label>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">
                If wins
              </div>
              <div className="mt-1 font-mono text-sm tabular-nums">
                <span className="text-positive">+${profit.toFixed(2)}</span>
                <span className="ml-2 text-ink-dim">
                  (${payout.toFixed(2)} payout)
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => clearSlip()}
                className="rounded-md border border-line px-3 py-2 text-sm text-ink-muted hover:border-negative hover:text-negative"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={!valid || slip.length === 0}
                onClick={place}
                className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-ink-dim"
              >
                Place {slip.length > 1 ? "parlay" : "wager"} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
