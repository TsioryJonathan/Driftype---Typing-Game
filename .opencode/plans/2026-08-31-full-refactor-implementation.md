# Driftype Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate code duplication, decompose the script.js monolith, centralize shared patterns, and fix backend bugs across the Driftype codebase.

**Architecture:** Create shared utility modules in `src/utils/`, decompose `script.js` into focused game modules, extract duplicated HTML into a reusable header component, and clean up backend dead code and bugs.

**Tech Stack:** Vanilla JS (ES modules), Tailwind CSS v4, Express.js, PostgreSQL

---

## Phase 1: Shared Utilities (Agent 1)

### Task 1.1: Create auth.js utility

**Files:**
- Create: `src/utils/auth.js`

- [ ] **Step 1: Create auth.js with localStorage abstraction**

```javascript
const KEYS = {
  user: 'typing_game_user',
  token: 'typing_game_token',
};

export const getUser = () => {
  try {
    const raw = localStorage.getItem(KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getToken = () => localStorage.getItem(KEYS.token);

export const setUser = (user) => localStorage.setItem(KEYS.user, JSON.stringify(user));

export const setToken = (token) => localStorage.setItem(KEYS.token, token);

export const clearAuth = () => {
  localStorage.removeItem(KEYS.user);
  localStorage.removeItem(KEYS.token);
};

export const isAuthenticated = () => !!getToken() && !!getUser();
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/auth.js
git commit -m "feat: add auth utility for localStorage abstraction"
```

### Task 1.2: Create api.js utility

**Files:**
- Create: `src/utils/api.js`
- Modify: `src/utils/url.js` (import API_URL from here)

- [ ] **Step 1: Create api.js with authenticated fetch wrapper**

```javascript
import { API_URL } from './url.js';
import { getToken, clearAuth } from './auth.js';

const headers = () => {
  const h = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
};

export const apiGet = async (path) => {
  const res = await fetch(`${API_URL}${path}`, { headers: headers() });
  if (res.status === 401) { clearAuth(); window.location.href = '/login'; return; }
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
};

export const apiPost = async (path, body) => {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (res.status === 401) { clearAuth(); window.location.href = '/login'; return; }
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
};
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/api.js
git commit -m "feat: add API utility with authenticated fetch wrapper"
```

### Task 1.3: Create ui.js utility

**Files:**
- Create: `src/utils/ui.js`

- [ ] **Step 1: Create ui.js with shared UI components**

```javascript
export const showSpinner = () => `
  <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-[var(--color-text)] animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
  </svg>`;

export const showError = (element, message) => {
  if (!element) return;
  element.textContent = message;
  element.classList.remove('hidden');
};

export const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300 z-50 text-white ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

export const setLoadingState = (button, loading) => {
  if (!button) return;
  button.disabled = loading;
  if (loading) {
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `${showSpinner()} Loading...`;
  } else {
    button.innerHTML = button.dataset.originalText || button.innerHTML;
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/ui.js
git commit -m "feat: add shared UI utility (spinner, error, toast, loading state)"
```

### Task 1.4: Create settings.js utility

**Files:**
- Create: `src/utils/settings.js`

- [ ] **Step 1: Create settings.js with generic load/save pattern**

```javascript
export const loadSettings = (key, defaults = {}) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
};

export const saveSettings = (key, settings) => {
  localStorage.setItem(key, JSON.stringify(settings));
};

export const initSettingsToggle = (elementId, storageKey, property, callback) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  const settings = loadSettings(storageKey);
  if (property in settings) el.checked = settings[property];
  el.addEventListener('change', () => {
    const current = loadSettings(storageKey);
    current[property] = el.checked;
    saveSettings(storageKey, current);
    if (callback) callback(current);
  });
};
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/settings.js
git commit -m "feat: add settings utility for localStorage load/save pattern"
```

---

## Phase 2: script.js Decomposition (Agent 2)

### Task 2.1: Create game engine module

**Files:**
- Create: `src/components/js/game/engine.js`
- Modify: `src/components/js/script.js` (extract code)

- [ ] **Step 1: Create game/engine.js with extracted logic**

Move from script.js: word generation, timer, keystroke handling, game state variables.

```javascript
import { getRandomWord } from '../dictionaries.js';
import { tinykeys } from '../tinykeys.js';

let startTime = null;
let timeLeft = 0;
let timerInterval = null;
let currentWordIndex = 0;
let currentLetterIndex = 0;
let correctLetters = 0;
let totalLetters = 0;
let totalKeystrokes = 0;
let incorrectLetters = 0;
let extraLetters = 0;
const wordsToType = [];

export const getGameState = () => ({
  startTime, timeLeft, currentWordIndex, currentLetterIndex,
  correctLetters, totalLetters, totalKeystrokes, incorrectLetters, extraLetters,
});

export const resetGameState = () => {
  startTime = null; timeLeft = 0; currentWordIndex = 0; currentLetterIndex = 0;
  correctLetters = 0; totalLetters = 0; totalKeystrokes = 0;
  incorrectLetters = 0; extraLetters = 0; wordsToType.length = 0;
  clearInterval(timerInterval);
};

export const setTimeLeft = (t) => { timeLeft = t; };
export const getTimeLeft = () => timeLeft;

export const generateWords = (mode, count = 200) => {
  for (let i = 0; i < count; i++) wordsToType.push(getRandomWord(mode));
  return wordsToType;
};

export const startTimer = (onTick, onEnd) => {
  if (!startTime) {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      if (timeLeft > 0) { timeLeft--; onTick(); }
      if (timeLeft <= 0) onEnd();
    }, 1000);
  }
};

export const getCurrentStats = () => {
  const elapsed = Math.max((Date.now() - startTime) / 1000, 1);
  const wordsTyped = correctLetters / 5;
  return {
    wpm: Math.round((wordsTyped / elapsed) * 60),
    raw: Math.round((totalKeystrokes / 5 / elapsed) * 60),
    accuracy: totalKeystrokes > 0 ? Math.round((correctLetters / totalKeystrokes) * 10000) / 100 : 0,
    correct: correctLetters, incorrect: incorrectLetters, extra: extraLetters,
  };
};

// ... (keystroke handling, letter update, word rendering functions)
```

- [ ] **Step 2: Commit**

```bash
git add src/components/js/game/engine.js
git commit -m "feat: extract game engine from script.js"
```

### Task 2.2: Create results renderer module

**Files:**
- Create: `src/components/js/game/results.js`

- [ ] **Step 1: Create game/results.js with result display logic**

Move the ~40-line inline HTML template and fireworks from script.js.

```javascript
export const renderResults = (stats, langLabel, modeLabel, timerValue) => {
  // Returns the results HTML string (moved from script.js lines 308-349)
};

export const launchFireworks = () => {
  // Moved from script.js launchFireworks()
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/js/game/results.js
git commit -m "feat: extract results renderer from script.js"
```

### Task 2.3: Create chart manager module

**Files:**
- Create: `src/components/js/game/chart.js`

- [ ] **Step 1: Create game/chart.js with Chart.js logic**

Move timeline chart setup, update, and tracking arrays from script.js.

```javascript
let timelineChart = null;
let timelineWpm = [];
let timelineErrors = [];
let timelineLabels = [];

export const initChart = () => { /* ... */ };
export const updateChart = (wpm, errors) => { /* ... */ };
export const destroyChart = () => { /* ... */ };
export const startTimelineTracking = () => { /* ... */ };
export const stopTimelineTracking = () => { /* ... */ };
```

- [ ] **Step 2: Commit**

```bash
git add src/components/js/game/chart.js
git commit -m "feat: extract chart manager from script.js"
```

### Task 2.4: Create stats API module

**Files:**
- Create: `src/components/js/game/statsApi.js`

- [ ] **Step 1: Create game/statsApi.js with API calls**

Move statPost and badge checking from script.js.

```javascript
import { apiPost } from '../../utils/api.js';

export const postStats = async (userId, stats) => {
  return apiPost(`/stats/${userId}`, stats);
};

export const checkBadges = async (userId, stats) => {
  // Moved from badges.js integration
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/js/game/statsApi.js
git commit -m "feat: extract stats API module from script.js"
```

### Task 2.5: Slim down script.js

**Files:**
- Modify: `src/components/js/script.js`

- [ ] **Step 1: Rewrite script.js to import from game modules**

Replace the monolith with imports and event wiring only. Target: under 200 lines.

- [ ] **Step 2: Verify game still works**

Open `/dashboard` in browser, run a typing test, verify results display.

- [ ] **Step 3: Commit**

```bash
git add src/components/js/script.js
git commit -m "refactor: slim down script.js to import wiring only"
```

---

## Phase 3: HTML/Duplication Cleanup (Agent 3)

### Task 3.1: Create header component

**Files:**
- Create: `src/components/js/components/header.js`

- [ ] **Step 1: Create header.js that renders the navbar**

```javascript
export const renderHeader = (activePage = '') => `
  <header class="sticky top-0 backdrop-blur-md bg-[var(--color-bg-secondary)] flex items-center justify-between px-10 h-[60px] z-50">
    <div class="h-full flex items-center">
      <a href="/"><img src="/src/assets/noBg.png" alt="Drifttype" class="h-full w-40 object-cover"></a>
    </div>
    <nav class="w-full max-w-md mx-auto h-[40px]">
      <div class="flex justify-between items-center bg-[var(--color-input)] rounded-full h-full p-1">
        <button id="practice-btn" class="... ${activePage === 'practice' ? 'active' : ''}">Practice</button>
        <button id="stat-btn" class="... ${activePage === 'stats' ? 'active' : ''}">Stats</button>
        <button id="setting-btn" class="... ${activePage === 'settings' ? 'active' : ''}">Settings</button>
      </div>
    </nav>
    <!-- avatar + logout -->
  </header>
`;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/js/components/header.js
git commit -m "feat: add shared header component"
```

### Task 3.2: Update pages to use header component

**Files:**
- Modify: `dashboard/index.html`
- Modify: `statistics/index.html`
- Modify: `profile/index.html`
- Modify: `setting/index.html`

- [ ] **Step 1: Replace inline header in each page with JS import**

In each page, replace the ~130-line header HTML with:
```javascript
import { renderHeader } from '/src/components/js/components/header.js';
document.querySelector('header').outerHTML = renderHeader('practice');
```

- [ ] **Step 2: Verify nav works on all 4 pages**

- [ ] **Step 3: Commit**

```bash
git add dashboard/ statistics/ profile/ setting/
git commit -m "refactor: use shared header component in 4 pages"
```

### Task 3.3: Remove dead code

**Files:**
- Delete: `backend/src/controllers/statisticsController.js`
- Modify: `src/components/js/formStyle.js`
- Modify: `src/components/js/pages/dashboard.js`

- [ ] **Step 1: Delete dead statistics controller**

```bash
git rm backend/src/controllers/statisticsController.js
```

- [ ] **Step 2: Remove dead code in formStyle.js (lines 3-8, same image for all themes)**

- [ ] **Step 3: Remove `console.log('Helloo')` from dashboard.js**

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove dead code and debug logs"
```

---

## Phase 4: Backend Cleanup (Agent 4)

### Task 4.1: Fix getRecentUserStat error handling

**Files:**
- Modify: `backend/src/controllers/statController.js`

- [ ] **Step 1: Add missing error response in catch block**

```javascript
// In getRecentUserStat, the catch block currently has no res.status() call
} catch (error) {
  console.error('Error fetching recent stats:', error);
  res.status(500).json({ message: 'Internal server error' });  // ADD THIS
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/controllers/statController.js
git commit -m "fix: add missing error response in getRecentUserStat"
```

### Task 4.2: Add input validation

**Files:**
- Create: `backend/src/middleware/validate.js`
- Modify: `backend/package.json` (add zod dependency)
- Modify: `backend/src/routes/authRoutes.js`

- [ ] **Step 1: Install zod**

```bash
cd backend && npm install zod
```

- [ ] **Step 2: Create validate middleware**

```javascript
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: result.error.errors[0].message });
  }
  req.body = result.data;
  next();
};
```

- [ ] **Step 3: Add validation schemas to auth routes**

```javascript
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(1, 'Username is required'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
```

- [ ] **Step 4: Commit**

```bash
git add backend/
git commit -m "feat: add input validation with zod for auth endpoints"
```

### Task 4.3: Clean up redundant code

**Files:**
- Modify: `backend/src/middleware/auth.js`

- [ ] **Step 1: Remove redundant token expiry check**

In `auth.js:19`, `decoded.exp < Date.now() / 1000` is redundant because `jwt.verify()` already throws `TokenExpiredError`. Remove the manual check.

- [ ] **Step 2: Commit**

```bash
git add backend/src/middleware/auth.js
git commit -m "chore: remove redundant token expiry check in auth middleware"
```

---

## Final Integration (After All 4 Agents Complete)

### Task 5.1: Update existing pages to use shared utilities

**Files:**
- Modify: `login/index.html` + `src/components/js/pages/login.js`
- Modify: `register/index.html` + `src/components/js/pages/register.js`
- Modify: `reset-password/index.html` + `src/components/js/pages/reset-password.js`
- Modify: `dashboard/index.html` + multiple JS files

- [ ] **Step 1: Replace raw localStorage calls with auth.js**

Search for `localStorage.getItem("typing_game_token")` and `localStorage.getItem("typing_game_user")` across all JS files, replace with `import { getToken, getUser } from '../../utils/auth.js'`.

- [ ] **Step 2: Replace manual fetch with api.js**

Search for `fetch(\`${API_URL}` patterns, replace with `apiGet()` / `apiPost()`.

- [ ] **Step 3: Replace duplicated spinners with ui.js**

Search for the spinner SVG block in HTML files, replace with `showSpinner()` import.

- [ ] **Step 4: Verify all pages load correctly**

- [ ] **Step 5: Run `npm run build` to verify CSS still builds**

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: integrate shared utilities across all pages"
```
