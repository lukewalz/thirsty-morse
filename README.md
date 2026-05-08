# thirsty.morse

A clean point-spread, over/under, and parlay tracker that watches your picks live against ESPN's public APIs. No accounts, no real money, no backend — just localStorage, fast polling, and an honest scoreboard.

Originally a 2022 MERN project. Rewritten in 2026 as a static SPA on Cloudflare.

## Features

- **Six leagues** — NBA, NCAAM, MLB, NCAAB, NHL, NCAAH
- **Real lines** — DraftKings spread + over/under via ESPN's `pickcenter`
- **Pre-game and live betting** — place a wager any time before the final whistle. Live placements record the score and game state at the moment of placement
- **Parlays** — stack 2+ legs into a slip-style builder; combined odds at -110 per leg, all-or-nothing settlement
- **Auto-settle** — wagers resolve themselves when games end; W/L/push and P/L update with no clicks
- **Live cover meter** — per pending wager, a green/red bar showing how far the score is from covering the line
- **Win-probability sparkline** — SVG line graph over ESPN's per-play win probability, plus current home/away %
- **Matchup predictor** — pre-game ESPN team-level win projections rendered as a tug-of-war bar
- **Score flash** — subtle accent flash whenever a tracked score changes
- **Streak badge** — 🔥 N W streak / 🥶 N L streak on the dashboard and history
- **Cumulative P/L chart** — running line graph of every settled wager on the history page

## Stack

- **Vite + React 19 + TypeScript** — fresh build, no webpack legacy
- **Tailwind v4** — clean light theme, single accent, Inter + JetBrains Mono
- **TanStack Query** — handles ESPN polling, caching, and refetch intervals natively
- **Zustand + persist** — wager state in localStorage with versioned migrations; no Redux, no auth
- **React Router v7** — `/`, `/games/:league`, `/games/:league/:gameId`, `/history`

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Dashboard. Sport picker, active wagers with live cover + win-prob, streak badge |
| `/games/:league` | Day-paginated game list for the league |
| `/games/:league/:gameId` | Matchup detail. Pre-game predictor, live wager form, parlay add |
| `/history` | All wagers, P/L chart, streak |

## Running locally

```bash
npm install
npm run dev
```

ESPN's `site.web.api.espn.com` (scoreboard + summary) returns `Access-Control-Allow-Origin: *`, so no proxy is needed. The legacy `www.espn.com/.../game?xhr=1` endpoint does *not* support CORS — avoid it.

## Deploy

Cloudflare Workers (Static Assets binding), framework preset Vite. Build command `npm run build`, output `dist`. SPA fallback is configured in `wrangler.toml`:

```toml
name = "thirsty-morse"
compatibility_date = "2026-01-01"

[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

Cloudflare auto-deploys on push to `main`.

## What changed from the original

Removed:
- MongoDB + Mongoose models, JWT auth, bcrypt, Netlify Functions backend
- Material UI v4, React 16, react-scripts 4, Redux + Redux-Saga
- Hardcoded Sentry DSN, client-side cookie token storage

Added since the initial rewrite: live betting, auto-settle, cover meter, win-probability sparkline, streak badge, P/L chart, parlays with slip builder, ESPN matchup predictor, score flash.

Stateless, ~70% less code than the original, deploys to a CDN edge.
