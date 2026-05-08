import { format } from "date-fns";
import type {
  ESPNGameDetail,
  ESPNScoreboardEvent,
  Sport,
  SportSlug,
} from "./types";

const SPORT_BY_LEAGUE: Record<SportSlug, Sport> = {
  nba: "basketball",
  "mens-college-basketball": "basketball",
  mlb: "baseball",
  "college-baseball": "baseball",
};

export const LEAGUE_LABEL: Record<SportSlug, string> = {
  nba: "NBA",
  "mens-college-basketball": "Men's College Basketball",
  mlb: "MLB",
  "college-baseball": "College Baseball",
};

export const LEAGUE_TAG: Record<SportSlug, string> = {
  nba: "NBA",
  "mens-college-basketball": "NCAAM",
  mlb: "MLB",
  "college-baseball": "NCAAB",
};

export function sportFor(league: SportSlug): Sport {
  return SPORT_BY_LEAGUE[league];
}

export function dateKey(date: Date): string {
  return format(date, "yyyyMMdd");
}

export async function getGames(
  league: SportSlug,
  date: Date,
): Promise<ESPNScoreboardEvent[]> {
  const sport = sportFor(league);
  const params = new URLSearchParams({
    sport,
    league,
    region: "us",
    lang: "en",
    dates: dateKey(date),
  });
  if (league.includes("college")) params.set("groups", "50");

  const url = `https://site.web.api.espn.com/apis/v2/scoreboard/header?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ESPN scoreboard ${res.status}`);
  const json = await res.json();
  return json?.sports?.[0]?.leagues?.[0]?.events ?? [];
}

export async function getGameById(league: SportSlug, gameId: string): Promise<ESPNGameDetail> {
  const url = `https://www.espn.com/${league}/game?gameId=${gameId}&xhr=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ESPN game ${res.status}`);
  const json = await res.json();
  const pkg = json?.gamepackageJSON;
  if (!pkg) throw new Error("ESPN game payload missing");
  return { ...pkg, league, sport: sportFor(league) };
}
