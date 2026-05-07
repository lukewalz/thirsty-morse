import { useQuery } from "@tanstack/react-query";
import { getGameById, getGames } from "@/lib/espn";
import type { SportSlug } from "@/lib/types";

export function useGames(league: SportSlug, date: Date) {
  return useQuery({
    queryKey: ["games", league, date.toISOString().slice(0, 10)],
    queryFn: () => getGames(league, date),
    refetchInterval: 10_000,
    staleTime: 5_000,
  });
}

export function useGame(league: SportSlug | undefined, gameId: string | undefined) {
  return useQuery({
    queryKey: ["game", league, gameId],
    queryFn: () => getGameById(league!, gameId!),
    enabled: Boolean(league && gameId),
    refetchInterval: 10_000,
    staleTime: 5_000,
  });
}
