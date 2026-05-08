import type {
  ESPNDetailCompetition,
  Wager,
  WagerStatus,
} from "./types";

interface Outcome {
  status: WagerStatus;
  result: number;
}

/** Determine if a finished game settles a wager won/lost/push.
 *  Returns null if the game isn't final or scores aren't readable. */
export function settleWager(
  wager: Wager,
  comp: ESPNDetailCompetition | undefined,
): Outcome | null {
  if (!comp || comp.status.type.state !== "post") return null;
  const home = comp.competitors.find((c) => c.homeAway === "home");
  const away = comp.competitors.find((c) => c.homeAway === "away");
  if (!home || !away) return null;
  const homeScore = numScore(home.score);
  const awayScore = numScore(away.score);
  if (homeScore == null || awayScore == null) return null;

  const [side, lineStr] = wager.selection.split("@");
  const line = parseFloat(lineStr);
  if (!Number.isFinite(line)) return null;

  if (wager.wager_type === "ou") {
    const total = homeScore + awayScore;
    if (total === line) return push(wager);
    if ((side === "o" && total > line) || (side === "u" && total < line)) {
      return won(wager);
    }
    return lost(wager);
  }

  /* Spread. `selection` is like "TEX@-1.5" or "NYY@+1.5". `line` is signed
     relative to the picked team. Adjusted margin = teamScore - oppScore + line. */
  const isHome = home.team.abbreviation === side;
  const isAway = away.team.abbreviation === side;
  if (!isHome && !isAway) return null;
  const teamScore = isHome ? homeScore : awayScore;
  const oppScore = isHome ? awayScore : homeScore;
  const adjusted = teamScore - oppScore + line;
  if (adjusted === 0) return push(wager);
  return adjusted > 0 ? won(wager) : lost(wager);
}

/** Live cover differential — same math as final settlement but works pre-final. */
export function coverDifferential(
  wager: Wager,
  comp: ESPNDetailCompetition | undefined,
): { value: number; label: string } | null {
  if (!comp) return null;
  const home = comp.competitors.find((c) => c.homeAway === "home");
  const away = comp.competitors.find((c) => c.homeAway === "away");
  if (!home || !away) return null;
  const homeScore = numScore(home.score);
  const awayScore = numScore(away.score);
  if (homeScore == null || awayScore == null) return null;

  const [side, lineStr] = wager.selection.split("@");
  const line = parseFloat(lineStr);
  if (!Number.isFinite(line)) return null;

  if (wager.wager_type === "ou") {
    const total = homeScore + awayScore;
    const diff = side === "o" ? total - line : line - total;
    return {
      value: diff,
      label: `Total ${total} / ${side === "o" ? "O" : "U"} ${line}`,
    };
  }

  const isHome = home.team.abbreviation === side;
  const isAway = away.team.abbreviation === side;
  if (!isHome && !isAway) return null;
  const teamScore = isHome ? homeScore : awayScore;
  const oppScore = isHome ? awayScore : homeScore;
  const adjusted = teamScore - oppScore + line;
  return { value: adjusted, label: `${side} ${signed(line)}` };
}

function won(w: Wager): Outcome {
  return { status: "won", result: w.amount };
}
function lost(w: Wager): Outcome {
  return { status: "lost", result: -w.amount };
}
function push(_w: Wager): Outcome {
  return { status: "push", result: 0 };
}

function numScore(s: string | number | null | undefined): number | null {
  if (s == null || s === "") return null;
  const n = parseInt(String(s), 10);
  return Number.isFinite(n) ? n : null;
}

function signed(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}
