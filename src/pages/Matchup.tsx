import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { useGame } from "@/hooks/useGames";
import { useWagers } from "@/store/wagers";
import { LEAGUE_LABEL, sportFor } from "@/lib/espn";
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
  const add = useWagers((s) => s.add);

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
  const odds = comp?.odds?.[0];

  const spread = odds?.spread;
  const overUnder = odds?.overUnder;

  const spreadOptions = useMemo(() => {
    if (!home || !away || spread == null) return [];
    return [
      { value: `${away.team.abbreviation}@${spread > 0 ? `+${spread}` : spread}`, label: `${away.team.abbreviation} ${spread > 0 ? `+${spread}` : spread}` },
      { value: `${home.team.abbreviation}@${spread > 0 ? `-${spread}` : Math.abs(spread)}`, label: `${home.team.abbreviation} ${spread > 0 ? `-${spread}` : `+${Math.abs(spread)}`}` },
    ];
  }, [home, away, spread]);

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
  const canPlace = state === "pre" && selection && Number(amount) > 0;

  function placeWager() {
    const numAmount = Number(amount);
    if (!canPlace || !Number.isFinite(numAmount) || numAmount <= 0) return;
    add({
      league: league as SportSlug,
      sport: sportFor(league as SportSlug),
      game_id: gameId!,
      wager_type: wagerType,
      selection,
      amount: numAmount,
    });
    navigate("/");
  }

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

      {state === "pre" ? (
        <section className="rounded-lg border border-line bg-surface p-6">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-dim">
            Place a wager
          </div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">
            {odds ? odds.details ?? "Lines available" : "No line posted yet"}
          </h2>

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

            <button
              type="button"
              disabled={!canPlace}
              onClick={placeWager}
              className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-ink-dim"
            >
              Place wager →
            </button>
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-line bg-surface p-6 text-ink-muted">
          {state === "in"
            ? "Game is in progress — new wagers are locked."
            : "Game is final — no new wagers."}
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
        {parseInt(String(team.score ?? "0"), 10) || "—"}
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
