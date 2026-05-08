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
  nhl: "hockey",
  "mens-college-hockey": "hockey",
};

export const LEAGUE_LABEL: Record<SportSlug, string> = {
  nba: "NBA",
  "mens-college-basketball": "Men's College Basketball",
  mlb: "MLB",
  "college-baseball": "College Baseball",
  nhl: "NHL",
  "mens-college-hockey": "College Hockey",
};

export const LEAGUE_TAG: Record<SportSlug, string> = {
  nba: "NBA",
  "mens-college-basketball": "NCAAM",
  mlb: "MLB",
  "college-baseball": "NCAAB",
  nhl: "NHL",
  "mens-college-hockey": "NCAAH",
};

/* Leagues whose scoreboard needs `groups=50` to return the full D1 slate.
   Other leagues either don't use groups (pro leagues) or break with it
   (college hockey returns 0 events with groups=50). */
const NEEDS_D1_FILTER = new Set<SportSlug>([
  "mens-college-basketball",
  "college-baseball",
]);

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
  if (NEEDS_D1_FILTER.has(league)) params.set("groups", "50");

  const url = `https://site.web.api.espn.com/apis/v2/scoreboard/header?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ESPN scoreboard ${res.status}`);
  const json = await res.json();
  return json?.sports?.[0]?.leagues?.[0]?.events ?? [];
}

export async function getGameById(
  league: SportSlug,
  gameId: string,
): Promise<ESPNGameDetail> {
  const sport = sportFor(league);
  /* The CORS-friendly summary endpoint. The legacy
     www.espn.com/.../game?xhr=1 endpoint returns 200 but no
     Access-Control-Allow-Origin header, so browser fetches were
     blocked. */
  const url = `https://site.web.api.espn.com/apis/site/v2/sports/${sport}/${league}/summary?event=${gameId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ESPN summary ${res.status}`);
  const json = await res.json();
  if (!json?.header) throw new Error("ESPN summary payload missing header");
  return { ...json, league, sport };
}
