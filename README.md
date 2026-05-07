# thirsty.morse

A clean point-spread + over/under tracker that watches your picks live against ESPN's public APIs. No accounts, no real money, no backend — just localStorage, fast polling, and an honest scoreboard.

Originally a 2022 MERN project. Rewritten in 2026 as a static SPA on Cloudflare Pages.

## Stack

- **Vite + React 19 + TypeScript** — fresh build, no webpack legacy
- **Tailwind v4** — clean light theme, single accent, Inter + JetBrains Mono
- **TanStack Query** — handles ESPN polling, caching, and refetch intervals natively (replaces the old `setInterval` loop and its crash bug)
- **Zustand + persist** — wager state in localStorage; no Redux, no auth
- **React Router v7** — `/`, `/games/:league`, `/games/:league/:gameId`, `/history`

## Running locally

```bash
npm install
npm run dev
```

ESPN's public scoreboard and game endpoints support CORS for browsers, so no proxy is needed.

## Deploy

Cloudflare Pages, framework preset "Vite". Build command `npm run build`, output `dist`. SPA rewrites are wired via `public/_redirects`.

## What changed from the original

- ❌ MongoDB + Mongoose models, JWT auth, bcrypt, Netlify Functions backend
- ❌ Material UI v4, React 16, react-scripts 4, Redux + Redux-Saga
- ❌ Hardcoded Sentry DSN, client-side cookie token storage
- ✅ Stateless SPA, ~70% less code, deploys to a CDN edge
