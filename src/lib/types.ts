export type SportSlug =
  | "nba"
  | "mens-college-basketball"
  | "mlb"
  | "college-baseball"
  | "nhl"
  | "mens-college-hockey";

export type Sport = "basketball" | "baseball" | "hockey";

export type WagerType = "spread" | "ou";

export type WagerStatus = "pending" | "won" | "lost" | "push";

export interface PlacedAt {
  /** Score and clock at the moment of placement. Only populated for live bets. */
  home_score: number;
  away_score: number;
  detail: string;
}

export interface WagerLeg {
  id: string;
  league: SportSlug;
  sport: Sport;
  game_id: string;
  game_label: string;
  wager_type: WagerType;
  selection: string;
  /** Whether this leg was placed during a live game. */
  live?: boolean;
  placed_at?: PlacedAt;
  /** Per-leg settlement, set as games finish. */
  status: WagerStatus;
}

export interface Wager {
  id: string;
  legs: WagerLeg[];
  amount: number;
  wager_date: string;
  /** Aggregate status. For parlays: pending while any leg pending; lost
   *  if any leg lost; push if all legs settled and at least one push and
   *  no losses; otherwise won. */
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
  score: string | number | null;
  team: {
    id: string;
    abbreviation: string;
    displayName: string;
    shortDisplayName?: string;
    logo?: string;
    logos?: { href: string }[];
  };
}

export interface ESPNOdds {
  details?: string;
  overUnder?: number;
  spread?: number;
  provider?: { name: string };
  awayTeamOdds?: { favorite?: boolean; teamId?: string; moneyLine?: number };
  homeTeamOdds?: { favorite?: boolean; teamId?: string; moneyLine?: number };
}

export interface ESPNDetailCompetition {
  id: string;
  date: string;
  status: ESPNFullStatus;
  competitors: ESPNDetailCompetitor[];
  odds?: ESPNOdds[];
}

export interface ESPNWinProbabilityPoint {
  playId: string;
  homeWinPercentage: number;
  tiePercentage: number;
}

export interface ESPNPredictor {
  header?: string;
  homeTeam: { id: string; gameProjection: string };
  awayTeam: { id: string; gameProjection: string };
}

export interface ESPNGameDetail {
  header: { competitions: ESPNDetailCompetition[] };
  pickcenter?: ESPNOdds[];
  odds?: ESPNOdds[];
  winprobability?: ESPNWinProbabilityPoint[];
  predictor?: ESPNPredictor;
  league: SportSlug;
  sport: Sport;
}
