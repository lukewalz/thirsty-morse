import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Wager, WagerStatus } from "@/lib/types";

interface WagerState {
  wagers: Wager[];
  add: (w: Omit<Wager, "id" | "wager_date" | "status">) => void;
  remove: (id: string) => void;
  settle: (id: string, status: WagerStatus, result: number) => void;
  clearAll: () => void;
}

function newId(): string {
  return `w_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useWagers = create<WagerState>()(
  persist(
    (set) => ({
      wagers: [],
      add: (w) =>
        set((s) => ({
          wagers: [
            { ...w, id: newId(), wager_date: new Date().toISOString(), status: "pending" },
            ...s.wagers,
          ],
        })),
      remove: (id) => set((s) => ({ wagers: s.wagers.filter((w) => w.id !== id) })),
      settle: (id, status, result) =>
        set((s) => ({
          wagers: s.wagers.map((w) => (w.id === id ? { ...w, status, result } : w)),
        })),
      clearAll: () => set({ wagers: [] }),
    }),
    { name: "thirsty-morse-wagers" },
  ),
);
