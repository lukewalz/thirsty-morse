import type {
  ESPNDetailCompetition,
  WagerLeg,
  WagerStatus,
} from "./types";

/** Determine if a finished game settles a single leg won/lost/push.
 *  Returns null if the game isn't final or scores aren't readable. */
export function settleLeg(
  leg: WagerLeg,
  comp: ESPNDetailCompetition | undefined,
): WagerStatus | null {
  if (!comp || comp.status.type.state !== "post") return null;
  const ctx = readContext(leg, comp);
  if (!ctx) return null;
  const { side, line, total, teamMargin } = ctx;

  if (leg.wager_type === "ou") {
    if (total === line) return "push";
    if ((side === "o" && total > line) || (side === "u" && total < line)) {
      return "won";
    }
    return "lost";
  }

  /* Spread. teamMargin already includes the line. */
  if (teamMargin === 0) return "push";
  return teamMargin > 0 ? "won" : "lost";
}

/** Live cover differential — same math but works pre-final. */
export function coverDifferential(
  leg: WagerLeg,
  comp: ESPNDetailCompetition | undefined,
): { value: number; label: string } | null {
  if (!comp) return null;
  const ctx = readContext(leg, comp);
  if (!ctx) return null;
  const { side, line, total, teamMargin } = ctx;

  if (leg.wager_type === "ou") {
    const diff = side === "o" ? total - line : line - total;
    return {
      value: diff,
      label: `Total ${total} / ${side === "o" ? "O" : "U"} ${line}`,
    };
  }
  return { value: teamMargin, label: `${side} ${signed(line)}` };
}

interface Context {
  side: string;
  line: number;
  total: number;
  /** teamScore - oppScore + line. Positive = covering. */
  teamMargin: number;
}

function readContext(
  leg: WagerLeg,
  comp: ESPNDetailCompetition,
): Context | null {
  const home = comp.competitors.find((c) => c.homeAway === "home");
  const away = comp.competitors.find((c) => c.homeAway === "away");
  if (!home || !away) return null;
  const homeScore = numScore(home.score);
  const awayScore = numScore(away.score);
  if (homeScore == null || awayScore == null) return null;

  const [side, lineStr] = leg.selection.split("@");
  const line = parseFloat(lineStr);
  if (!Number.isFinite(line)) return null;

  const total = homeScore + awayScore;
  let teamMargin = 0;
  if (leg.wager_type === "spread") {
    const isHome = home.team.abbreviation === side;
    const isAway = away.team.abbreviation === side;
    if (!isHome && !isAway) return null;
    const teamScore = isHome ? homeScore : awayScore;
    const oppScore = isHome ? awayScore : homeScore;
    teamMargin = teamScore - oppScore + line;
  }
  return { side, line, total, teamMargin };
}

function numScore(s: string | number | null | undefined): number | null {
  if (s == null || s === "") return null;
  const n = parseInt(String(s), 10);
  return Number.isFinite(n) ? n : null;
}

function signed(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}
