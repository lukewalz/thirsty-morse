import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addDays, format } from "date-fns";
import { useGames } from "@/hooks/useGames";
import { LEAGUE_LABEL } from "@/lib/espn";
import { formatScore } from "@/lib/format";
import StateBadge from "@/components/StateBadge";
import type { ESPNScoreboardCompetitor, SportSlug } from "@/lib/types";

const VALID_LEAGUES: SportSlug[] = [
  "nba",
  "mens-college-basketball",
  "mlb",
  "college-baseball",
  "nhl",
  "mens-college-hockey",
];

function isValidLeague(s: string | undefined): s is SportSlug {
  return Boolean(s && (VALID_LEAGUES as string[]).includes(s));
}

export default function Games() {
  const { league } = useParams();
  const [offset, setOffset] = useState(0);

  if (!isValidLeague(league)) {
    return <p className="text-ink-muted">Unknown league.</p>;
  }

  const date = addDays(new Date(), offset);
  const { data: games, isLoading, isError } = useGames(league, date);

  const sorted = games
    ? [...games].sort((a, b) => (a.date > b.date ? 1 : -1))
    : [];

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
            {LEAGUE_LABEL[league]}
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {format(date, "EEEE, MMM d")}
          </h1>
        </div>
        <DayPicker offset={offset} setOffset={setOffset} />
      </header>

      {isLoading && <p className="text-ink-muted">Loading games…</p>}
      {isError && <p className="text-negative">Couldn't reach ESPN. Try again.</p>}
      {!isLoading && sorted.length === 0 && (
        <p className="text-ink-muted">No games scheduled.</p>
      )}

      <div className="grid gap-3">
        {sorted.map((g) => {
          const home = g.competitors?.find((c) => c.homeAway === "home");
          const away = g.competitors?.find((c) => c.homeAway === "away");
          const state = g.status;
          const detail = g.fullStatus?.type?.shortDetail ?? "";

          return (
            <Link
              key={g.id}
              to={`/games/${league}/${g.id}`}
              className="group flex items-center justify-between gap-4 rounded-lg border border-line bg-surface px-5 py-4 hover:border-line-strong"
            >
              <div className="flex flex-1 items-center gap-4">
                <StateBadge state={state}>
                  {state === "in"
                    ? "Live"
                    : state === "post"
                      ? "Final"
                      : format(new Date(g.date), "h:mm a")}
                </StateBadge>
                <div className="flex-1 font-mono text-sm">
                  <TeamRow comp={away} />
                  <TeamRow comp={home} />
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div className="hidden font-mono text-xs text-ink-muted sm:block">
                  {state === "pre" ? "" : detail}
                </div>
                <span className="text-ink-dim group-hover:text-ink">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function TeamRow({ comp }: { comp: ESPNScoreboardCompetitor | undefined }) {
  if (!comp) return null;
  return (
    <div className="flex items-center gap-3 py-0.5">
      {comp.logo ? (
        <img src={comp.logo} alt="" className="h-5 w-5 shrink-0" />
      ) : (
        <span className="inline-block h-5 w-5" />
      )}
      <span className="w-12 shrink-0 text-ink-dim">{comp.abbreviation}</span>
      <span className="flex-1 font-medium">{comp.displayName}</span>
      <span className="tabular-nums">{formatScore(comp.score)}</span>
    </div>
  );
}

function DayPicker({
  offset,
  setOffset,
}: {
  offset: number;
  setOffset: (n: number) => void;
}) {
  const days = [-1, 0, 1, 2];
  return (
    <div className="flex gap-1 rounded-md border border-line bg-surface p-1">
      {days.map((d) => {
        const date = addDays(new Date(), d);
        const active = d === offset;
        return (
          <button
            key={d}
            onClick={() => setOffset(d)}
            className={`rounded px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              active
                ? "bg-ink text-surface"
                : "text-ink-muted hover:bg-surface-3 hover:text-ink"
            }`}
          >
            {d === 0 ? "Today" : format(date, "EEE")}
          </button>
        );
      })}
    </div>
  );
}
