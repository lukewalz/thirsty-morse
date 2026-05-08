import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { getGameById, LEAGUE_LABEL, LEAGUE_TAG } from "@/lib/espn";
import { formatScore } from "@/lib/format";
import { coverDifferential, settleWager } from "@/lib/settle";
import { useWagers } from "@/store/wagers";
import StateBadge from "@/components/StateBadge";
import CoverMeter from "@/components/CoverMeter";
import WinProbChart from "@/components/WinProbChart";
import ScoreFlash from "@/components/ScoreFlash";
import type {
  ESPNGameDetail,
  SportSlug,
  Wager,
} from "@/lib/types";

const SPORTS: SportSlug[] = [
  "nba",
  "mens-college-basketball",
  "mlb",
  "college-baseball",
  "nhl",
  "mens-college-hockey",
];

export default function Dashboard() {
  const wagers = useWagers((s) => s.wagers);
  const settle = useWagers((s) => s.settle);
  const pending = wagers.filter((w) => w.status === "pending");

  const liveGames = useQueries({
    queries: pending.map((w) => ({
      queryKey: ["game", w.league, w.game_id] as const,
      queryFn: () => getGameById(w.league, w.game_id),
      refetchInterval: 10_000,
      staleTime: 5_000,
    })),
  });

  /* Auto-settle: when a pending wager's game goes final, compute the
     outcome and persist it. The wager then drops out of `pending` on
     the next render, so this can't loop. */
  useEffect(() => {
    pending.forEach((w, i) => {
      const detail = liveGames[i]?.data;
      const comp = detail?.header.competitions[0];
      const outcome = settleWager(w, comp);
      if (outcome) settle(w.id, outcome.status, outcome.result);
    });
  }, [pending, liveGames, settle]);

  return (
    <div className="space-y-12">
      <section>
        <Eyebrow>Place a wager</Eyebrow>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Track your bets in real time.
        </h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          Pick a side or total against the consensus line, then watch the score
          live as the game plays out. No accounts. No real money.
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
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {pending.length === 0 ? "Nothing in play" : `${pending.length} active`}
        </h2>

        {pending.length === 0 ? (
          <p className="mt-3 max-w-xl text-ink-muted">
            Pick a league above and place a bet to see it tracked here in real
            time. Updates poll every 10 seconds.
          </p>
        ) : (
          <div className="mt-6 grid gap-3">
            {pending.map((w, i) => (
              <LiveWagerCard key={w.id} wager={w} game={liveGames[i]?.data} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function LiveWagerCard({
  wager,
  game,
}: {
  wager: Wager;
  game?: ESPNGameDetail;
}) {
  const comp = game?.header.competitions[0];
  const home = comp?.competitors.find((c) => c.homeAway === "home");
  const away = comp?.competitors.find((c) => c.homeAway === "away");
  const state = comp?.status.type.state ?? "pre";
  const detail = comp?.status.type.shortDetail ?? "Loading…";

  const cover = coverDifferential(wager, comp);
  const wp = game?.winprobability ?? [];

  const placedAtDetail = wager.placed_at
    ? `${wager.placed_at.away_score}-${wager.placed_at.home_score} · ${wager.placed_at.detail}`
    : undefined;

  return (
    <Link
      to={`/games/${wager.league}/${wager.game_id}`}
      className="group block rounded-lg border border-line bg-surface p-5 transition-colors hover:border-line-strong"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <StateBadge state={state}>
            {state === "in" ? "Live" : state === "post" ? "Final" : "Soon"}
          </StateBadge>
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
        <div className="flex items-center gap-5 text-right">
          <div>
            <div className="flex items-center justify-end gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-dim">
              {wager.wager_type === "spread" ? "Spread" : "Total"}
              {wager.live && (
                <span className="rounded-sm bg-accent/15 px-1 font-mono text-[10px] text-accent">
                  LIVE
                </span>
              )}
            </div>
            <div className="font-mono text-sm font-medium tabular-nums">
              {wager.selection}
            </div>
            {placedAtDetail && (
              <div className="font-mono text-[10px] text-ink-dim tabular-nums">
                @ {placedAtDetail}
              </div>
            )}
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">
              Stake
            </div>
            <div className="font-mono text-sm font-medium tabular-nums">
              ${wager.amount}
            </div>
          </div>
          <span className="text-ink-dim group-hover:text-ink">→</span>
        </div>
      </div>

      {state === "in" && (cover || wp.length > 0) && (
        <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-[1fr_auto] sm:items-center">
          {cover ? (
            <div>
              <div className="mb-2 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wider text-ink-dim">
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
      <WinProbChart points={points} side="home" />
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
