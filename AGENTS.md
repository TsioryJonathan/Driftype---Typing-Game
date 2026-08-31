# AGENTS.md

## Project Overview

Driftype is a typing speed game with a vanilla JS frontend and an Express.js backend. No framework — just HTML, Tailwind CSS v4, and ES modules.

## Architecture

- **Frontend**: `src/` — JS modules in `src/components/js/`, CSS in `src/css/input.css`. HTML pages at root level: `/login/`, `/dashboard/`, `/register/`, etc.
- **Backend**: `backend/` — Express server, PostgreSQL via `postgres` package, JWT auth, Google OAuth
- **Routing**: Vercel serves clean URLs natively from root-level directories (`/login/index.html` → `/login`). No rewrite rules needed.
- **API URL**: `src/utils/url.js` auto-detects `localhost:3000` (dev) vs Railway production URL

## Commands

```bash
# Frontend: rebuild Tailwind CSS (must run after CSS changes)
npm run build

# Frontend: start Live Server (for dev, serves on :5500)
# Use VS Code Live Server extension — no npm script for this

# Backend: install deps and start (production-like)
npm run server

# Backend: development with nodemon
cd backend && npm run dev

# Full start: build CSS then start backend
npm start
```

**No test framework is configured.** `npm test` just echoes an error.

## Key Conventions

- **Tailwind v4**: Uses `@import 'tailwindcss'` and `@theme` block in `src/css/input.css` — NOT a `tailwind.config.js`. Custom colors/fonts defined there as CSS variables.
- **Theming**: CSS custom properties (`--color-bg`, `--color-primary`, etc.) switch between light/dark via `data-theme` attribute. See `toggleTheme.js`.
- **ES Modules**: Both frontend and backend use `"type": "module"`. Import/export everywhere, no CommonJS.
- **Auth flow**: Token stored as `typing_game_token` in localStorage, user info as `typing_game_user`.
- **Backend startup**: Runs DB connection test, then `restoreData()`, then listens. Graceful shutdown calls `backupData()`.

## Common Pitfalls

- After editing `src/css/input.css`, you MUST run `npm run build` to regenerate `src/css/output.css` — the HTML imports `output.css`, not `input.css`.
- `output.css` is gitignored. If it's missing, run the build.
- Frontend dev server is port 5500 (Live Server default). Backend is port 3000. CORS is configured for both.
- Backend requires a `.env` file — copy from `backend/.env.example`. Needs PostgreSQL credentials, JWT secret, SMTP, and Google OAuth.
- When adding a new page, create a directory at root level (e.g., `/my-page/index.html`) — Vercel serves it automatically at `/my-page`.
