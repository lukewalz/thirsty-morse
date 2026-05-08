export type SportSlug = "nba" | "mens-college-basketball";

export type WagerType = "spread" | "ou";

export type WagerStatus = "pending" | "won" | "lost" | "push";

export interface Wager {
  id: string;
  league: SportSlug;
  sport: "basketball";
  game_id: string;
  wager_type: WagerType;
  selection: string;
  amount: number;
  wager_date: string;
  status: WagerStatus;
  result?: number;
}

/* Scoreboard list (`getGames`) — fields are flat on each event/competitor */
export interface ESPNScoreboardCompetitor {
  id: string;
  homeAway: "home" | "away";
  displayName: string;
  abbreviation: string;
  score: string;
  logo?: string;
  logoDark?: string;
}

export interface ESPNFullStatus {
  type: {
    state: "pre" | "in" | "post";
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  };
  displayClock?: string;
  period?: number;
}

export interface ESPNScoreboardEvent {
  id: string;
  date: string;
  name: string;
  shortName: string;
  status: "pre" | "in" | "post";
  fullStatus: ESPNFullStatus;
  competitors: ESPNScoreboardCompetitor[];
}

/* Game detail (`getGameById`) — nested under header.competitions[0] */
export interface ESPNDetailCompetitor {
  id: string;
  homeAway: "home" | "away";
  score: string;
  team: {
    id: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    logo?: string;
    logos?: { href: string }[];
  };
}

export interface ESPNOdds {
  details?: string;
  overUnder?: number;
  spread?: number;
}

export interface ESPNDetailCompetition {
  id: string;
  date: string;
  status: ESPNFullStatus;
  competitors: ESPNDetailCompetitor[];
  odds?: ESPNOdds[];
}

export interface ESPNGameDetail {
  header: { competitions: ESPNDetailCompetition[] };
  league: SportSlug;
  sport: "basketball";
}
