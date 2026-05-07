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

export interface ESPNCompetitor {
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

export interface ESPNStatus {
  type: { state: "pre" | "in" | "post"; completed: boolean; description: string; detail: string };
  displayClock?: string;
  period?: number;
}

export interface ESPNOdds {
  details?: string;
  overUnder?: number;
  spread?: number;
}

export interface ESPNCompetition {
  id: string;
  date: string;
  status: ESPNStatus;
  competitors: ESPNCompetitor[];
  odds?: ESPNOdds[];
}

export interface ESPNGame {
  id: string;
  date: string;
  shortName: string;
  status: ESPNStatus;
  competitions: ESPNCompetition[];
}

export interface ESPNGameDetail {
  header: { competitions: ESPNCompetition[] };
  league: SportSlug;
  sport: "basketball";
}
