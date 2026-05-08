import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SportSlug, Wager, WagerLeg, WagerStatus } from "@/lib/types";

interface WagerState {
  wagers: Wager[];
  /** Slip = legs queued by the user. Placement empties the slip. */
  slip: WagerLeg[];

  addToSlip: (leg: Omit<WagerLeg, "id" | "status">) => void;
  removeFromSlip: (legId: string) => void;
  clearSlip: () => void;

  /** Place the slip as a single wager (1 leg = straight, 2+ legs = parlay). */
  placeSlip: (amount: number) => void;
  /** Convenience for the matchup page's "Place wager" button — places a
   *  single-leg ticket immediately, bypassing the slip. */
  placeStraight: (leg: Omit<WagerLeg, "id" | "status">, amount: number) => void;

  remove: (id: string) => void;
  /** Apply per-leg settlement results, then recompute the parent wager's
   *  status and aggregate result. */
  settleLeg: (wagerId: string, legId: string, status: WagerStatus) => void;
  clearAll: () => void;
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface LegacyWager {
  id: string;
  league?: SportSlug;
  sport?: WagerLeg["sport"];
  game_id?: string;
  wager_type?: WagerLeg["wager_type"];
  selection?: string;
  amount?: number;
  wager_date?: string;
  status?: WagerStatus;
  result?: number;
  live?: boolean;
  placed_at?: WagerLeg["placed_at"];
  legs?: WagerLeg[];
}

/** Convert pre-parlay (single-leg) localStorage wagers to the new shape. */
function migrateWager(w: LegacyWager): Wager {
  if (Array.isArray(w.legs)) return w as Wager;
  return {
    id: w.id,
    legs: [
      {
        id: newId("leg"),
        league: w.league as SportSlug,
        sport: w.sport as WagerLeg["sport"],
        game_id: w.game_id as string,
        game_label: "",
        wager_type: w.wager_type as WagerLeg["wager_type"],
        selection: w.selection as string,
        live: w.live,
        placed_at: w.placed_at,
        status: w.status ?? "pending",
      },
    ],
    amount: w.amount ?? 0,
    wager_date: w.wager_date ?? new Date().toISOString(),
    status: w.status ?? "pending",
    result: w.result,
  };
}

function aggregateStatus(legs: WagerLeg[]): WagerStatus {
  if (legs.some((l) => l.status === "lost")) return "lost";
  if (legs.some((l) => l.status === "pending")) return "pending";
  if (legs.every((l) => l.status === "push")) return "push";
  /* All settled, no losses; either all wins or wins + pushes. Treat as won. */
  return "won";
}

export const useWagers = create<WagerState>()(
  persist(
    (set) => ({
      wagers: [],
      slip: [],

      addToSlip: (leg) =>
        set((s) => {
          const dup = s.slip.find(
            (l) => l.game_id === leg.game_id && l.wager_type === leg.wager_type,
          );
          if (dup) {
            return {
              slip: s.slip.map((l) =>
                l.id === dup.id
                  ? { ...l, selection: leg.selection, live: leg.live, placed_at: leg.placed_at }
                  : l,
              ),
            };
          }
          return {
            slip: [
              ...s.slip,
              { ...leg, id: newId("leg"), status: "pending" as WagerStatus },
            ],
          };
        }),

      removeFromSlip: (legId) =>
        set((s) => ({ slip: s.slip.filter((l) => l.id !== legId) })),

      clearSlip: () => set({ slip: [] }),

      placeSlip: (amount) =>
        set((s) => {
          if (s.slip.length === 0 || amount <= 0) return s;
          const wager: Wager = {
            id: newId("w"),
            legs: s.slip,
            amount,
            wager_date: new Date().toISOString(),
            status: "pending",
          };
          return { wagers: [wager, ...s.wagers], slip: [] };
        }),

      placeStraight: (leg, amount) =>
        set((s) => {
          if (amount <= 0) return s;
          const wager: Wager = {
            id: newId("w"),
            legs: [{ ...leg, id: newId("leg"), status: "pending" }],
            amount,
            wager_date: new Date().toISOString(),
            status: "pending",
          };
          return { wagers: [wager, ...s.wagers] };
        }),

      remove: (id) => set((s) => ({ wagers: s.wagers.filter((w) => w.id !== id) })),

      settleLeg: (wagerId, legId, status) =>
        set((s) => ({
          wagers: s.wagers.map((w) => {
            if (w.id !== wagerId) return w;
            const legs = w.legs.map((l) => (l.id === legId ? { ...l, status } : l));
            const agg = aggregateStatus(legs);
            const result = settledResult(legs, w.amount, agg);
            return { ...w, legs, status: agg, result };
          }),
        })),

      clearAll: () => set({ wagers: [], slip: [] }),
    }),
    {
      name: "thirsty-morse-wagers",
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        if (!persisted || typeof persisted !== "object") {
          return { wagers: [], slip: [] };
        }
        const cast = persisted as { wagers?: LegacyWager[]; slip?: WagerLeg[] };
        if (version < 2) {
          return {
            wagers: (cast.wagers ?? []).map(migrateWager),
            slip: cast.slip ?? [],
          };
        }
        return cast as unknown as WagerState;
      },
    },
  ),
);

/** Compute aggregate result. For parlays we use a simple -110 per leg
 *  decimal odds model: each winning leg multiplies the running decimal
 *  by 1.91. Pushed legs are dropped from the calculation. */
function settledResult(
  legs: WagerLeg[],
  stake: number,
  status: WagerStatus,
): number {
  if (status === "pending") return 0;
  if (status === "lost") return -stake;
  if (status === "push") return 0;
  const winners = legs.filter((l) => l.status === "won");
  const decimal = winners.reduce((acc) => acc * 1.91, 1);
  return Math.round((stake * decimal - stake) * 100) / 100;
}
