import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { getGameById, LEAGUE_LABEL, LEAGUE_TAG } from "@/lib/espn";
import { formatScore } from "@/lib/format";
import { coverDifferential, settleLeg } from "@/lib/settle";
import { combinedDecimal, decimalToAmerican } from "@/lib/odds";
import { computeStreak } from "@/lib/stats";
import { useWagers } from "@/store/wagers";
import StateBadge from "@/components/StateBadge";
import StreakBadge from "@/components/StreakBadge";
import CoverMeter from "@/components/CoverMeter";
import WinProbChart from "@/components/WinProbChart";
import ScoreFlash from "@/components/ScoreFlash";
import type {
  ESPNGameDetail,
  SportSlug,
  Wager,
  WagerLeg,
} from "@/lib/types";

const SPORTS: SportSlug[] = [
  "nba",
  "mens-college-basketball",
  "mlb",
  "college-baseball",
  "nhl",
  "mens-college-hockey",
];

interface GameKey {
  league: SportSlug;
  game_id: string;
}

export default function Dashboard() {
  const wagers = useWagers((s) => s.wagers);
  const settleLegAction = useWagers((s) => s.settleLeg);
  const pending = wagers.filter((w) => w.status === "pending");
  const streak = computeStreak(wagers);

  /* Unique (league, game_id) pairs across all pending legs. */
  const uniqueGames = useMemo<GameKey[]>(() => {
    const map = new Map<string, GameKey>();
    for (const w of pending) {
      for (const leg of w.legs) {
        if (leg.status !== "pending") continue;
        map.set(`${leg.league}:${leg.game_id}`, {
          league: leg.league,
          game_id: leg.game_id,
        });
      }
    }
    return [...map.values()];
  }, [pending]);

  const liveGames = useQueries({
    queries: uniqueGames.map((k) => ({
      queryKey: ["game", k.league, k.game_id] as const,
      queryFn: () => getGameById(k.league, k.game_id),
      refetchInterval: 10_000,
      staleTime: 5_000,
    })),
  });

  const gameByKey = useMemo(() => {
    const m = new Map<string, ESPNGameDetail>();
    uniqueGames.forEach((k, i) => {
      const g = liveGames[i]?.data;
      if (g) m.set(`${k.league}:${k.game_id}`, g);
    });
    return m;
  }, [uniqueGames, liveGames]);

  /* Auto-settle each pending leg as its game finishes. The aggregate
     wager status updates as a side effect of settleLeg. */
  useEffect(() => {
    pending.forEach((w) => {
      w.legs.forEach((leg) => {
        if (leg.status !== "pending") return;
        const game = gameByKey.get(`${leg.league}:${leg.game_id}`);
        const comp = game?.header.competitions[0];
        const status = settleLeg(leg, comp);
        if (status) settleLegAction(w.id, leg.id, status);
      });
    });
  }, [pending, gameByKey, settleLegAction]);

  return (
    <div className="space-y-12">
      <section>
        <Eyebrow>Place a wager</Eyebrow>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Track your bets in real time.
        </h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          Pick a side or total against the consensus line, then watch the score
          live as the game plays out. No accounts. No real money. Stack 2+ legs
          for a parlay.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {SPORTS.map((league) => (
            <Link
              key={league}
              to={`/games/${league}`}
              className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2.5 text-sm font-medium hover:border-line-strong hover:bg-surface-3"
            >
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">
                {LEAGUE_TAG[league]}
              </span>
              <span>{LEAGUE_LABEL[league]}</span>
              <span className="text-ink-dim">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <Eyebrow>Live wagers</Eyebrow>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            {pending.length === 0 ? "Nothing in play" : `${pending.length} active`}
          </h2>
          <StreakBadge streak={streak} />
        </div>

        {pending.length === 0 ? (
          <p className="mt-3 max-w-xl text-ink-muted">
            Pick a league above and place a bet to see it tracked here in real
            time. Updates poll every 10 seconds.
          </p>
        ) : (
          <div className="mt-6 grid gap-3">
            {pending.map((w) => (
              <WagerCard key={w.id} wager={w} gameByKey={gameByKey} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function WagerCard({
  wager,
  gameByKey,
}: {
  wager: Wager;
  gameByKey: Map<string, ESPNGameDetail>;
}) {
  const isParlay = wager.legs.length > 1;
  const decimal = combinedDecimal(wager.legs.length);
  const projectedProfit = wager.amount * decimal - wager.amount;

  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-3">
          {isParlay ? (
            <span className="rounded-md bg-accent px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-white">
              Parlay
            </span>
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
              Single
            </span>
          )}
          <span className="font-mono text-sm tabular-nums">
            {wager.legs.length} {wager.legs.length === 1 ? "leg" : "legs"}
          </span>
          {isParlay && (
            <span className="font-mono text-xs text-ink-muted tabular-nums">
              {decimalToAmerican(decimal)} · {decimal.toFixed(2)}x
            </span>
          )}
        </div>
        <div className="font-mono text-xs tabular-nums text-ink-muted">
          ${wager.amount} → {projectedProfit > 0 ? "+" : ""}
          ${projectedProfit.toFixed(2)} potential
        </div>
      </header>

      <ul className="mt-3 space-y-3">
        {wager.legs.map((leg) => (
          <LegRow
            key={leg.id}
            leg={leg}
            game={gameByKey.get(`${leg.league}:${leg.game_id}`)}
          />
        ))}
      </ul>
    </div>
  );
}

function LegRow({
  leg,
  game,
}: {
  leg: WagerLeg;
  game?: ESPNGameDetail;
}) {
  const comp = game?.header.competitions[0];
  const home = comp?.competitors.find((c) => c.homeAway === "home");
  const away = comp?.competitors.find((c) => c.homeAway === "away");
  const state = comp?.status.type.state ?? "pre";
  const detail = comp?.status.type.shortDetail ?? "Loading…";
  const cover = coverDifferential(leg, comp);
  const wp = game?.winprobability ?? [];

  const placedAtDetail = leg.placed_at
    ? `${leg.placed_at.away_score}-${leg.placed_at.home_score} · ${leg.placed_at.detail}`
    : undefined;

  return (
    <Link
      to={`/games/${leg.league}/${leg.game_id}`}
      className="group block rounded-md border border-line bg-surface-2 p-3 transition-colors hover:border-line-strong"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {leg.status === "pending" ? (
            <StateBadge state={state}>
              {state === "in" ? "Live" : state === "post" ? "Final" : "Soon"}
            </StateBadge>
          ) : (
            <StateBadge state={leg.status}>{leg.status}</StateBadge>
          )}
          <div className="font-mono text-sm tabular-nums">
            <span className="text-ink-dim">
              {away ? `${away.team.abbreviation} ` : "— "}
            </span>
            <ScoreFlash value={away ? formatScore(away.score) : "—"} />
            <span className="px-2 text-ink-dim">@</span>
            <span className="text-ink-dim">
              {home ? `${home.team.abbreviation} ` : "— "}
            </span>
            <ScoreFlash value={home ? formatScore(home.score) : "—"} />
          </div>
          <div className="font-mono text-xs text-ink-muted">{detail}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-dim">
              {leg.wager_type === "spread" ? "Spread" : "Total"}
              {leg.live && (
                <span className="rounded-sm bg-accent/15 px-1 font-mono text-[10px] text-accent">
                  LIVE
                </span>
              )}
            </div>
            <div className="font-mono text-sm font-medium tabular-nums">
              {leg.selection}
            </div>
            {placedAtDetail && (
              <div className="font-mono text-[10px] text-ink-dim tabular-nums">
                @ {placedAtDetail}
              </div>
            )}
          </div>
          <span className="text-ink-dim group-hover:text-ink">→</span>
        </div>
      </div>

      {state === "in" && (cover || wp.length > 0) && (
        <div className="mt-3 grid gap-3 border-t border-line pt-3 sm:grid-cols-[1fr_auto] sm:items-center">
          {cover ? (
            <div>
              <div className="mb-1.5 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-wider text-ink-dim">
                <span>Cover</span>
                <span>{cover.label}</span>
              </div>
              <CoverMeter value={cover.value} />
            </div>
          ) : (
            <span />
          )}
          {wp.length > 0 && (
            <WinProbBlock
              points={wp}
              homeAbbr={home?.team.abbreviation ?? "HOME"}
              awayAbbr={away?.team.abbreviation ?? "AWAY"}
            />
          )}
        </div>
      )}
    </Link>
  );
}

function WinProbBlock({
  points,
  homeAbbr,
  awayAbbr,
}: {
  points: { homeWinPercentage: number; tiePercentage: number; playId: string }[];
  homeAbbr: string;
  awayAbbr: string;
}) {
  const last = points[points.length - 1];
  const homePct = Math.round(last.homeWinPercentage * 100);
  const awayPct = 100 - homePct;
  return (
    <div className="flex items-center gap-3">
      <WinProbChart points={points} side="home" width={140} height={36} />
      <div className="text-right font-mono">
        <div className="text-[10px] uppercase tracking-wider text-ink-dim">
          Win prob
        </div>
        <div className="text-sm font-semibold tabular-nums">
          {homeAbbr} {homePct}%
        </div>
        <div className="text-[10px] tabular-nums text-ink-muted">
          {awayAbbr} {awayPct}%
        </div>
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
      {children}
    </div>
  );
}
