import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { getGameById, LEAGUE_LABEL, LEAGUE_TAG } from "@/lib/espn";
import { useWagers } from "@/store/wagers";
import StateBadge from "@/components/StateBadge";
import type { ESPNDetailCompetitor, SportSlug } from "@/lib/types";

const SPORTS: SportSlug[] = [
  "nba",
  "mens-college-basketball",
  "mlb",
  "college-baseball",
];

export default function Dashboard() {
  const wagers = useWagers((s) => s.wagers);
  const pending = wagers.filter((w) => w.status === "pending");

  const liveGames = useQueries({
    queries: pending.map((w) => ({
      queryKey: ["game", w.league, w.game_id] as const,
      queryFn: () => getGameById(w.league, w.game_id),
      refetchInterval: 10_000,
      staleTime: 5_000,
    })),
  });

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
            {pending.map((w, i) => {
              const detail = liveGames[i]?.data;
              const comp = detail?.header.competitions[0];
              return (
                <LiveWagerCard
                  key={w.id}
                  league={w.league}
                  gameId={w.game_id}
                  selection={w.selection}
                  amount={w.amount}
                  wagerType={w.wager_type}
                  state={comp?.status.type.state ?? "pre"}
                  detail={comp?.status.type.detail ?? "Loading…"}
                  competitors={comp?.competitors}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function LiveWagerCard({
  league,
  gameId,
  selection,
  amount,
  wagerType,
  state,
  detail,
  competitors,
}: {
  league: SportSlug;
  gameId: string;
  selection: string;
  amount: number;
  wagerType: "spread" | "ou";
  state: "pre" | "in" | "post";
  detail: string;
  competitors?: ESPNDetailCompetitor[];
}) {
  const home = competitors?.find((c) => c.homeAway === "home");
  const away = competitors?.find((c) => c.homeAway === "away");

  return (
    <Link
      to={`/games/${league}/${gameId}`}
      className="group block rounded-lg border border-line bg-surface px-5 py-4 transition-colors hover:border-line-strong"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <StateBadge state={state}>{state === "in" ? "Live" : state === "post" ? "Final" : "Soon"}</StateBadge>
          <div className="font-mono text-sm tabular-nums">
            {away ? `${away.team.abbreviation} ${away.score}` : "—"}
            <span className="px-2 text-ink-dim">@</span>
            {home ? `${home.team.abbreviation} ${home.score}` : "—"}
          </div>
          <div className="text-xs text-ink-muted">{detail}</div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">
              {wagerType === "spread" ? "Spread" : "Total"}
            </div>
            <div className="font-mono text-sm font-medium tabular-nums">
              {selection}
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">
              Stake
            </div>
            <div className="font-mono text-sm font-medium tabular-nums">
              ${amount}
            </div>
          </div>
          <span className="text-ink-dim group-hover:text-ink">→</span>
        </div>
      </div>
    </Link>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
      {children}
    </div>
  );
}
