import type { Wager } from "./types";

export interface Streak {
  count: number;
  type: "won" | "lost" | "none";
}

/** Most-recent consecutive run of same-result wagers. Pushes break the streak. */
export function computeStreak(wagers: Wager[]): Streak {
  const settled = wagers
    .filter((w) => w.status === "won" || w.status === "lost")
    .slice()
    .sort((a, b) => (b.wager_date > a.wager_date ? 1 : -1));
  if (settled.length === 0) return { count: 0, type: "none" };
  const latest = settled[0].status as "won" | "lost";
  let count = 0;
  for (const w of settled) {
    if (w.status !== latest) break;
    count++;
  }
  return { count, type: latest };
}

export interface PLPoint {
  date: string;
  cumulative: number;
}

/** Running cumulative P/L over time, oldest → newest. Pending wagers skipped. */
export function computePLSeries(wagers: Wager[]): PLPoint[] {
  const settled = wagers
    .filter((w) => w.status !== "pending")
    .slice()
    .sort((a, b) => (a.wager_date < b.wager_date ? -1 : 1));
  let cum = 0;
  return settled.map((w) => {
    cum += w.result ?? 0;
    return { date: w.wager_date, cumulative: cum };
  });
}
