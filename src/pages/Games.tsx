import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addDays, format } from "date-fns";
import { useGames } from "@/hooks/useGames";
import { LEAGUE_LABEL } from "@/lib/espn";
import StateBadge from "@/components/StateBadge";
import type { SportSlug } from "@/lib/types";

const VALID_LEAGUES: SportSlug[] = ["nba", "mens-college-basketball"];

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
      {games && games.length === 0 && (
        <p className="text-ink-muted">No games scheduled.</p>
      )}

      <div className="grid gap-3">
        {games?.map((g) => {
          const comp = g.competitions[0];
          const home = comp.competitors.find((c) => c.homeAway === "home");
          const away = comp.competitors.find((c) => c.homeAway === "away");
          const state = g.status.type.state;

          return (
            <Link
              key={g.id}
              to={`/games/${league}/${g.id}`}
              className="group flex items-center justify-between gap-4 rounded-lg border border-line bg-surface px-5 py-4 hover:border-line-strong"
            >
              <div className="flex items-center gap-4">
                <StateBadge state={state}>
                  {state === "in" ? "Live" : state === "post" ? "Final" : format(new Date(g.date), "h:mm a")}
                </StateBadge>
                <div className="font-mono text-sm tabular-nums">
                  <div className="flex items-center gap-2">
                    <TeamLine team={away} />
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <TeamLine team={home} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div className="font-mono text-xs text-ink-muted">
                  {g.status.type.detail}
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

function TeamLine({
  team,
}: {
  team:
    | {
        score: string;
        team: { abbreviation: string; shortDisplayName: string };
      }
    | undefined;
}) {
  if (!team) return <span className="text-ink-dim">—</span>;
  const score = parseInt(team.score || "0", 10);
  return (
    <>
      <span className="inline-block w-12 text-ink-dim">{team.team.abbreviation}</span>
      <span className="font-medium">{team.team.shortDisplayName}</span>
      <span className="ml-auto pl-4 text-right tabular-nums">
        {score > 0 ? score : "—"}
      </span>
    </>
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
