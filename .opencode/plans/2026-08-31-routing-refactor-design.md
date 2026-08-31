# Routing Refactor — Clean URLs + Vercel Migration

## Problem

All page URLs expose internal file paths: `/src/components/pages/login.html`. This is ugly in the browser, bad for SEO, and inconsistent (some links use relative paths, others absolute).

The `_redirects` file (Netlify) maps clean URLs to these ugly paths, but JS `window.location.href` assignments bypass it — users see the raw path.

## Solution

Move HTML pages from `src/components/pages/` to root-level directories, so Vercel serves clean URLs natively. Update all hardcoded paths in JS, HTML, and backend.

## New URL Mapping

| Old Path | New URL |
|---|---|
| `/src/components/pages/login.html` | `/login` |
| `/src/components/pages/dashboard.html` | `/dashboard` |
| `/src/components/pages/register.html` | `/register` |
| `/src/components/pages/forgot-password.html` | `/forgot-password` |
| `/src/components/pages/reset-password.html` | `/reset-password` |
| `/src/components/pages/profile.html` | `/profile` |
| `/src/components/pages/settingPage.html` | `/setting` |
| `/src/components/pages/gameStat.html` | `/statistics` |

## File Moves

Each HTML file moves to `<route>/index.html`:

```
src/components/pages/login.html         → /login/index.html
src/components/pages/dashboard.html     → /dashboard/index.html
src/components/pages/register.html      → /register/index.html
src/components/pages/forgot-password.html → /forgot-password/index.html
src/components/pages/reset-password.html  → /reset-password/index.html
src/components/pages/profile.html       → /profile/index.html
src/components/pages/settingPage.html   → /setting/index.html
src/components/pages/gameStat.html      → /statistics/index.html
```

`index.html` (landing page) stays at root — no change.

## Import Path Updates

Since pages move from `src/components/pages/` to `/`, relative imports change:

- **CSS**: `/src/css/output.css` (absolute, no change needed)
- **JS theme toggle**: `../js/toggleTheme.js` → `../src/components/js/toggleTheme.js`
- **JS page scripts**: `../js/<script>.js` → `../src/components/js/<script>.js`
- **Assets**: `../../assets/<file>` → `../src/assets/<file>`

Each page has slightly different imports — the implementation must update them individually.

## Navigation Links Updates

Inside each HTML page, internal links change:

- `href="./profile.html"` → `href="/profile"`
- `href="register.html"` → `href="/register"`
- `href="login.html"` → `href="/login"`

## JS Redirect Updates

Files with hardcoded paths to update:

- `src/components/js/redirectionScript.js` — 3 redirects (`login`, `register`, `dashboard`)
- `src/components/js/navBarRedirection.js` — 3 redirects (`dashboard`, `setting`, `statistics`)
- `src/components/js/pages/reset-password.js` — 1 redirect (`login`)
- `src/components/js/logoutFunc.js` — redirect after logout (if any)

All change from `/src/components/pages/X.html` → `/X`.

## Backend Updates

- `backend/src/controllers/authController.js:108` — reset URL: `${FRONTEND_URL}/src/components/pages/reset-password.html?token=...` → `${FRONTEND_URL}/reset-password?token=...`
- `backend/src/index.js:16` — CORS: add Vercel domain to origins
- `backend/.env.example` — update FRONTEND_URL example

## Google OAuth

`login.html` line 75 — `data-login_uri` must point to the production `/login` URL (not localhost with file path).

## Vercel Config

Create `vercel.json`:
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

Delete `_redirects` (Netlify-specific, no longer needed).

## Out of Scope

- Landing page (`index.html`) — stays at root
- Backend hosting — remains on Railway
- SPA router — not needed, multi-page architecture preserved
- CSS build (`npm run build`) — unchanged

## Verification

After implementation:
1. All pages load at clean URLs (`/login`, `/dashboard`, etc.)
2. All in-app navigation uses clean URLs
3. No hardcoded `/src/components/pages/` paths remain in JS or HTML
4. Backend reset email contains clean URL
5. `npm run build` still works (CSS unaffected)
6. Google OAuth redirect works
