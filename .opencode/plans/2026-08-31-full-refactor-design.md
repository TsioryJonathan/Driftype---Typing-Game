# Refactor Plan — Driftype Codebase Cleanup

## Goal

Eliminate code duplication, decompose the script.js monolith, centralize shared patterns, and fix backend bugs. No visual changes.

## Phase 1 — Shared Utilities

Create `src/utils/` modules that all pages import:

### `src/utils/auth.js`
- `getUser()` — reads `typing_game_user` from localStorage, returns parsed object or null
- `getToken()` — reads `typing_game_token` from localStorage
- `setUser(user)` / `setToken(token)` — write to localStorage
- `clearAuth()` — removes both keys
- `isAuthenticated()` — boolean check
- Replaces 34+ raw `localStorage.getItem()` calls across 15 files

### `src/utils/api.js`
- `apiGet(path)` — fetch with auth header, returns JSON
- `apiPost(path, body)` — fetch POST with auth header, returns JSON
- Handles 401 (redirect to login), network errors, JSON parsing
- Replaces manual `fetch()` + `Authorization: Bearer` pattern in every file

### `src/utils/ui.js`
- `showSpinner()` — returns the loading SVG string (1 copy instead of 6)
- `showError(element, message)` — sets text, shows element (replaces 2+ definitions)
- `showToast(message, type)` — simple toast notification
- `setLoadingState(button, loading)` — disables button, shows/hides spinner

### `src/utils/settings.js`
- `loadSettings(key, defaults)` — reads from localStorage with defaults
- `saveSettings(key, settings)` — writes to localStorage
- `initSettingsToggle(elementId, key, property)` — binds a toggle to a setting
- Replaces the identical load/save pattern in `gamePreferences.js`, `soundAndFeedback.js`, `appearance.js`, `notificationAndPrivacy.js`

## Phase 2 — script.js Decomposition

Split `src/components/js/script.js` (699 lines) into focused modules:

### `src/components/js/game/engine.js`
- Word generation, timer logic, keystroke handling
- Game state (currentWordIndex, currentLetterIndex, counters)
- Exports: `startTest()`, `endTest()`, `getCurrentStats()`

### `src/components/js/game/results.js`
- Result display HTML template (currently inline in script.js lines 308-349)
- Fireworks animation
- Exports: `renderResults(stats)`, `launchFireworks()`

### `src/components/js/game/chart.js`
- Chart.js timeline setup and update
- Timeline tracking arrays and intervals
- Exports: `initChart()`, `updateChart()`, `destroyChart()`

### `src/components/js/game/statsApi.js`
- POST stats to backend
- Badge checking
- Exports: `postStats(userId, stats)`, `checkBadges(userId, stats)`

### `src/components/js/script.js` (slimmed)
- Imports from game/*
- Event listener wiring
- Initialization

## Phase 3 — HTML/Duplication Cleanup

### Shared Header Component
Create `src/components/js/components/header.js`:
- `renderHeader(activePage)` — returns the navbar HTML string
- Used by dashboard, statistics, profile, setting pages
- Replaces ~516 lines of duplicated HTML

### CDN Centralization
Create a partial or ensure all pages use the same CDN block:
- Font Awesome CSS + JS
- animate.css
- Chart.js (only on pages that need it)

### Dead Code Removal
- Delete `backend/src/controllers/statisticsController.js` (fully commented out)
- Remove `formStyle.js` dead theme mapping (3 themes → same image)
- Remove `console.log('Helloo')` from `dashboard.js`

## Phase 4 — Backend Cleanup

### Fix `getRecentUserStat`
- `statController.js:17` — add `res.status(500).json({ message: '...' })` in catch block

### Input Validation
- Add `zod` dependency
- Create `backend/src/middleware/validate.js`
- Validate auth endpoints (email format, password strength, token presence)

### Remove Dead Code
- Delete `statisticsController.js`
- Remove redundant token expiry check in `auth.js:19` (jwt.verify handles it)

## Execution

4 parallel agents:
1. **Agent 1**: Phase 1 — shared utilities (auth, api, ui, settings)
2. **Agent 2**: Phase 2 — script.js decomposition
3. **Agent 3**: Phase 3 — HTML cleanup (header component, dead code)
4. **Agent 4**: Phase 4 — backend cleanup

Phases 1-4 are independent and can run simultaneously. After all complete, a final integration pass updates existing pages to use the new shared utilities.

## Verification

After all phases:
- `npm run build` succeeds (CSS unaffected)
- No raw `localStorage.getItem("typing_game_token")` in page files (moved to auth.js)
- No duplicate spinner SVGs (moved to ui.js)
- `script.js` under 200 lines
- Backend tests pass (if any), manual check of auth flow
- No `console.log('Helloo')` or dead code remaining
