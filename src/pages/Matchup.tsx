import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { useGame } from "@/hooks/useGames";
import { useWagers } from "@/store/wagers";
import { LEAGUE_LABEL, sportFor } from "@/lib/espn";
import { formatScore } from "@/lib/format";
import StateBadge from "@/components/StateBadge";
import type { ESPNDetailCompetitor, SportSlug, WagerType } from "@/lib/types";

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

export default function Matchup() {
  const { league, gameId } = useParams();
  const navigate = useNavigate();
  const placeStraight = useWagers((s) => s.placeStraight);
  const addToSlip = useWagers((s) => s.addToSlip);
  const slip = useWagers((s) => s.slip);

  const [wagerType, setWagerType] = useState<WagerType>("spread");
  const [selection, setSelection] = useState<string>("");
  const [amount, setAmount] = useState<string>("100");

  const { data, isLoading, isError } = useGame(
    isValidLeague(league) ? league : undefined,
    gameId,
  );

  const comp = data?.header.competitions[0];
  const home = comp?.competitors.find((c) => c.homeAway === "home");
  const away = comp?.competitors.find((c) => c.homeAway === "away");
  /* Lines live in `pickcenter` on the summary endpoint. ESPN also
     duplicates them at top-level `odds`; `competitions[0].odds` is
     usually null. Use the first provider (DraftKings is priority 1). */
  const odds = data?.pickcenter?.[0] ?? data?.odds?.[0];

  const spread = odds?.spread;
  const overUnder = odds?.overUnder;
  const awayIsFavorite = odds?.awayTeamOdds?.favorite === true;

  const spreadOptions = useMemo(() => {
    if (!home || !away || spread == null || spread === 0) return [];
    const mag = Math.abs(spread);
    const fav = awayIsFavorite ? away : home;
    const dog = awayIsFavorite ? home : away;
    return [
      { value: `${fav.team.abbreviation}@-${mag}`, label: `${fav.team.abbreviation} -${mag}` },
      { value: `${dog.team.abbreviation}@+${mag}`, label: `${dog.team.abbreviation} +${mag}` },
    ];
  }, [home, away, spread, awayIsFavorite]);

  const ouOptions = useMemo(() => {
    if (overUnder == null) return [];
    return [
      { value: `o@${overUnder}`, label: `Over ${overUnder}` },
      { value: `u@${overUnder}`, label: `Under ${overUnder}` },
    ];
  }, [overUnder]);

  if (!isValidLeague(league) || !gameId) {
    return <p className="text-ink-muted">Unknown game.</p>;
  }
  if (isLoading) return <p className="text-ink-muted">Loading game…</p>;
  if (isError || !comp || !home || !away) {
    return <p className="text-negative">Couldn't load this game.</p>;
  }

  const state = comp.status.type.state;
  const isLive = state === "in";
  const canPlace = state !== "post" && Boolean(selection) && Number(amount) > 0;

  function buildLeg() {
    return {
      league: league as SportSlug,
      sport: sportFor(league as SportSlug),
      game_id: gameId!,
      game_label: `${away!.team.abbreviation} @ ${home!.team.abbreviation}`,
      wager_type: wagerType,
      selection,
      live: isLive,
      placed_at: isLive
        ? {
            home_score: parseInt(String(home!.score ?? "0"), 10) || 0,
            away_score: parseInt(String(away!.score ?? "0"), 10) || 0,
            detail: comp!.status.type.shortDetail ?? comp!.status.type.detail,
          }
        : undefined,
    };
  }

  function placeWager() {
    const numAmount = Number(amount);
    if (!canPlace || !Number.isFinite(numAmount) || numAmount <= 0) return;
    placeStraight(buildLeg(), numAmount);
    navigate("/");
  }

  function addToParlay() {
    if (!selection) return;
    addToSlip(buildLeg());
  }

  const inSlip = slip.some(
    (l) => l.game_id === gameId && l.wager_type === wagerType,
  );

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
          <span>{LEAGUE_LABEL[league]}</span>
          <StateBadge state={state}>{state === "in" ? "Live" : state === "post" ? "Final" : "Upcoming"}</StateBadge>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {away.team.displayName} <span className="text-ink-dim">at</span>{" "}
          {home.team.displayName}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {format(new Date(comp.date), "EEEE, MMM d · h:mm a")}
          {state !== "pre" && ` · ${comp.status.type.detail}`}
        </p>
      </header>

      <section className="grid gap-3 rounded-lg border border-line bg-surface p-6 sm:grid-cols-2">
        <ScoreLine team={away} />
        <ScoreLine team={home} />
      </section>

      {state !== "post" ? (
        <section className="rounded-lg border border-line bg-surface p-6">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
            <span>{isLive ? "Place a live wager" : "Place a wager"}</span>
            {isLive && <StateBadge state="in">Live</StateBadge>}
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {odds ? odds.details ?? "Lines available" : "No line posted yet"}
          </h2>
          {isLive && (
            <p className="mt-2 text-xs text-ink-muted">
              Live placement against the closing line. Score and game state at
              placement will be recorded with your wager.
            </p>
          )}

          <div className="mt-6 space-y-6">
            <Field label="Type">
              <SegmentedControl
                value={wagerType}
                onChange={(v) => {
                  setWagerType(v as WagerType);
                  setSelection("");
                }}
                options={[
                  { value: "spread", label: "Spread", disabled: spread == null },
                  { value: "ou", label: "Over / Under", disabled: overUnder == null },
                ]}
              />
            </Field>

            <Field label="Selection">
              <SegmentedControl
                value={selection}
                onChange={setSelection}
                options={wagerType === "spread" ? spreadOptions : ouOptions}
              />
            </Field>

            <Field label="Stake (USD)">
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-32 rounded-md border border-line bg-surface px-3 py-2 font-mono text-base tabular-nums focus:border-accent focus:outline-none"
              />
            </Field>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!canPlace}
                onClick={placeWager}
                className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-ink-dim"
              >
                {isLive ? "Place live wager →" : "Place wager →"}
              </button>
              <button
                type="button"
                disabled={!selection}
                onClick={addToParlay}
                className="rounded-md border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                {inSlip ? "✓ In parlay slip" : "+ Add to parlay"}
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-line bg-surface p-6 text-ink-muted">
          Game is final — no new wagers.
        </section>
      )}
    </div>
  );
}

function ScoreLine({ team }: { team: ESPNDetailCompetitor }) {
  const logo = team.team.logo ?? team.team.logos?.[0]?.href;
  return (
    <div className="flex items-center gap-4">
      {logo && (
        <img
          src={logo}
          alt={`${team.team.displayName} logo`}
          className="h-10 w-10"
        />
      )}
      <div className="flex-1">
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-dim">
          {team.homeAway}
        </div>
        <div className="font-semibold">{team.team.displayName}</div>
      </div>
      <div className="font-mono text-3xl font-bold tabular-nums">
        {formatScore(team.score)}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
        {label}
      </div>
      {children}
    </div>
  );
}

function SegmentedControl({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
}) {
  if (options.length === 0) {
    return <p className="text-sm text-ink-muted">Not available for this game.</p>;
  }
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-md border border-line bg-surface-2 p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            className={`rounded px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              active
                ? "bg-ink text-surface"
                : "text-ink-muted hover:bg-surface-3 hover:text-ink"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
