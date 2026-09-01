# Driftype UI/UX Redesign — Design Spec

**Date:** 2026-09-01
**Scope:** Complete visual and UX redesign of the Driftype typing game
**Constraint:** Preserve all application logic, JS dependencies, and data flow

---

## 1. Design System

### 1.1 Color Palette

Single warm dark identity. No light mode. Theme switcher removed.

**Backgrounds:**
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-deep` | `#1C1108` | Page background, body |
| `--bg-mid` | `#24150B` | Cards, panels, nav backdrop |
| `--bg-surface` | `#2C1A0E` | Inputs, elevated surfaces |

**Accents:**
| Token | Value | Usage |
|-------|-------|-------|
| `--orange` | `#D96B27` | Primary accent, buttons, active states |
| `--orange-light` | `#E8792E` | Hover states |
| `--orange-bright` | `#F28A3D` | Highlights, cursor |
| `--rust` | `#9E4825` | Secondary accent |
| `--rust-light` | `#B9572B` | Borders on hover |

**Text:**
| Token | Value | Usage |
|-------|-------|-------|
| `--cream` | `#F3E6D0` | Primary text, headings |
| `--cream-muted` | `#E8D6BC` | Secondary text |
| `--text-muted` | `#B9A895` | Body, descriptions |
| `--text-dim` | `#806F5D` | Labels, annotations, metadata |

**Borders:**
| Token | Value | Usage |
|-------|-------|-------|
| `--border` | `rgba(243,230,208,0.08)` | Default borders |
| `--border-accent` | `rgba(232,121,46,0.20)` | Emphasized borders |

**Game-specific:**
| Token | Value | Usage |
|-------|-------|-------|
| `--correct` | `#D96B27` | Correct letter color |
| `--incorrect` | `#E85D4A` | Incorrect letter color |
| `--cursor-color` | `#F28A3D` | Cursor underline color |

### 1.2 Typography

**Display: Fraunces**
- Large titles, WPM numbers, major statistics, editorial elements
- Use italic variants strategically (`font-style: italic`)
- `font-variation-settings: 'opsz' 144` for display sizes

**UI: Space Grotesk**
- Navigation, buttons, controls, labels, secondary information
- Technical metadata, small interface text

**Contrast:** Fraunces = personality, Space Grotesk = precision

### 1.3 Grain/Texture

Subtle noise overlay via SVG filter on `body::before`:
```css
opacity: 0.035;
background-image: url("data:image/svg+xml,...feTurbulence...");
background-size: 256px 256px;
pointer-events: none;
z-index: 9999;
```

### 1.4 Borders and Radii

- Default border: `1px solid var(--border)`
- Corner radii: `2px`, `3px`, `4px`, `6px` — never large rounded cards
- Thin lines preferred over filled containers

### 1.5 Graphic Language

Technical annotations, coordinates, measurements:
- Session numbers: `SESSION 024`
- Timer labels: `60s`
- Section markers: `01 / 01`
- Coordinates: `DRIFTYPE — 2026`
- Thin accent lines (1px, gradient fade)
- Small dots for status indicators

---

## 2. Global Changes

### 2.1 Fonts

**Remove from Google Fonts import:**
- Poppins
- Raleway
- Architects Daughter
- Fira Code (keep for typing display only if desired, or replace with Space Grotesk)

**Add to Google Fonts import:**
- Fraunces (variable, opsZ 9–144, wght 100–900, italic)
- Space Grotesk (wght 300–700)

### 2.2 Theme System

**Remove:**
- `toggleTheme.js` script tag from all `<head>` sections
- Light theme CSS variables (`:root`, `[data-theme='light']`)
- Auto theme media query
- `data-theme` attribute handling
- `#theme-select` from settings page (or repurpose as appearance-only)
- `colorScheme` style assignment in JS

**Replace with:** Single `:root` block containing the warm dark palette.

### 2.3 CSS Variables

Replace all `--color-*` custom properties with the new tokens:
- `--color-bg` → `var(--bg-deep)`
- `--color-bg-secondary` → `var(--bg-mid)`
- `--color-text` → `var(--cream)`
- `--color-text-secondary` → `var(--text-muted)`
- `--color-primary` → `var(--orange)`
- `--color-primary-hover` → `var(--orange-light)`
- `--color-accent` → `var(--orange-bright)`
- `--color-border` → `var(--border)`
- `--color-card` → `var(--bg-mid)`
- `--color-success` → `var(--orange)` (unified accent)
- `--color-error` → `var(--incorrect)`
- `--color-warning` → `var(--orange-bright)`
- `--color-input` → `var(--bg-surface)`
- `--color-input-border` → `var(--border)`

**Keep:** `--color-neutral-*` scale (may need adjustment for new palette)

### 2.4 Tailwind @theme Block

Replace the `@theme` block in `src/css/input.css`:
- Remove `--font-poppins`, `--font-raleway`, `--font-architects`
- Add `--font-fraunces: 'Fraunces'`
- Add `--font-space-grotesk: 'Space Grotesk'`
- Replace `--color-midnight-*` with `--color-warm-*` (new warm scale)
- Replace `--color-active-*` with `--color-accent-*` (orange scale)
- Keep `--color-neutral-*` but adjust values if needed

### 2.5 Body Default

```css
body {
  font-family: var(--font-space-grotesk);
  background: var(--bg-deep);
  color: var(--cream);
}
```

### 2.6 Tailwind Utility Colors

All hardcoded Tailwind color classes in HTML must be updated:
- `text-amber-500` → `text-[var(--correct)]` (game engine letter color)
- `text-red-500` → `text-[var(--incorrect)]` (game engine letter color)
- `bg-blue-*`, `text-blue-*` → warm equivalents
- All `neutral-*` references → warm equivalents

---

## 3. Navbar

### 3.1 States

**Logged Out (landing, login, register, forgot-password, reset-password):**
```
DRIFTYPE                        LOG IN    SIGN UP
```

**Logged In (dashboard, profile, setting, statistics):**
```
DRIFTYPE    PLAY    STATISTICS    PROFILE              [J]
```
- Right side: avatar circle with initial letter (no dropdown on landing)
- No user menu dropdown on landing page

### 3.2 Structure

- Fixed position, backdrop blur, `rgba(28,17,8,0.85)` background
- 1px bottom border with `var(--border)`
- Logo: Fraunces, bold, uppercase, orange accent on "type"
- Nav links: Space Grotesk, 12px, uppercase, letter-spacing 0.08em
- Active link: orange color
- Inactive links: `var(--text-dim)`
- Mobile: hamburger menu (existing `toggleMenu.js` logic preserved)

### 3.3 Landing Page Navbar

- No avatar
- "Log in" text link + "Sign up" button (orange, small)
- Mobile: hamburger + slide-out menu with Log in / Sign up

### 3.4 Authenticated Pages Navbar

- Avatar circle (32px, border, initial letter in Fraunces)
- No dropdown on navbar (dropdown moved to avatar click in userMenu.js — keep existing behavior)
- Nav links: Play → `/dashboard`, Statistics → `/statistics`, Profile → `/profile`
- No Settings link in nav (accessed via avatar dropdown)

---

## 4. Landing Page

### 4.1 Hero

**Layout:** Two-column grid
- Left: editorial text (annotation, title, subtitle, CTA)
- Right: typing instrument preview

**Left column:**
- Annotation: `THE TYPING INSTRUMENT` (11px, uppercase, dim, with dash line)
- Title: `Type with rhythm.` (Fraunces, 48–80px, "rhythm" in italic orange)
- Subtitle: description text (16px, `var(--text-muted)`)
- CTA: single "Start typing" button (orange, primary)

**Right column:**
- Instrument card: dark panel with header, typing preview, footer stats
- Header: "Live preview" label + orange dot "Ready" status
- Body: typing text with cursor animation
- Footer: WPM + accuracy stats + timer

**No "View statistics" button.** Single CTA only.

### 4.2 Bottom Section

Below the hero grid:
- Left: `A DIGITAL TYPING INSTRUMENT` annotation
- Right: three stats (Avg WPM, Accuracy, Best WPM) in large Fraunces numbers

### 4.3 Decorative Elements

- Warm glow: radial gradient behind hero (subtle, `rgba(217,107,39,0.08)`)
- Coordinates: `01 / 01` top-left, `DRIFTYPE — 2026` bottom-right
- Thin accent lines: vertical, gradient fade, positioned at edges

### 4.4 Content Sections (if any)

Only real application capabilities:
- The Experience (typing preview)
- Speed (WPM as visual)
- Precision (accuracy)
- Progression (session tracking)
- Final CTA: "Start typing"

No invented features.

### 4.5 Removed

- Vanta.js (Three.js animated background)
- Typed.js (typewriter animation)
- Three.js dependency
- "View statistics" button from hero
- Three-column feature cards
- Testimonials section (if generic)
- Contact form (keep if real, remove if placeholder)

---

## 5. Game Page (Dashboard)

### 5.1 Controls Bar

Compact horizontal bar above the game area:
```
[Language: English ▾]  [Mode: Normal ▾]  [Duration: 60s ▾]        ⏱ 00:42
```

- Label + select pattern: small uppercase label, dark select with chevron
- Dividers between groups (1px vertical lines)
- Right side: restart hint (`Ctrl + Enter`) + timer display

### 5.2 Progress Bar

Thin 2px line across full width, orange fill, animated width.

### 5.3 Game Area

Centered, dominant:
- Word display: large text, clear letter states (correct/current/incorrect)
- Cursor: thin orange underline on current letter, blinking bar below text
- Technical annotations on sides: session number, time

### 5.4 Live Stats

Below the word display:
```
087 WPM        96.4%        03 Errors
```

- Large Fraunces numbers
- Small uppercase labels
- Separated by thin vertical lines

### 5.5 Bottom Bar

Language + difficulty badges on left, character count on right.

### 5.6 Results Overlay

After test completion, results appear in `#results-container`:
- WPM as dominant number (Fraunces, large)
- Accuracy percentage
- Performance graph (Chart.js — keep existing)
- Errors, time, characters
- "Try again" button

Graph styling: warm orange line, dark background, cream labels, subtle grid.

### 5.7 Preserved JS Elements

All IDs must remain: `#mode`, `#timer`, `#language`, `#word-display`, `#test-container`, `#results-container`, `#progress-bar`, `#countdown-timer`, `#restart-button`, `#stat-popup`, `#not-logged-popup`, `#toast-simple`, `#badges-container`

Dynamic classes preserved: `.letter`, `.word`, `.correct`, `.incorrect`, `.current`, `hidden`

---

## 6. Statistics Page

### 6.1 Layout

Not a dashboard. Performance overview.

```
STATISTICS

AVG WPM              BEST WPM
087                  112

────────────────────────────

PERFORMANCE OVER TIME
[ECharts graph]

────────────────────────────

RECENT SESSIONS
[table]
```

### 6.2 Top Stats

Two large numbers (Fraunces):
- AVG WPM + label
- BEST WPM + label

Below: accuracy + total tests

### 6.3 Graph

ECharts graph with warm dark styling:
- Orange line
- Dark background (`var(--bg-mid)`)
- Cream axis labels
- Subtle grid lines (`var(--border)`)
- Tooltip with warm styling

### 6.4 Recent Sessions Table

Clean table with:
- 1px top/bottom borders
- Hover state: `var(--bg-surface)` background
- Columns: date, WPM, accuracy, language, difficulty, time
- No heavy card wrapping

### 6.5 Preserved JS Elements

`#chart`, `#tbody`, `#avg-wpm`, `#max-wpm`, `#avg-accuracy`, `#complete-test`, `#leaderboard-avg-wpm`, `#leaderboard-avg-accuracy`, `#login-warning-toast`

---

## 7. Profile Page

### 7.1 Layout

Typographic identity, not account settings.

```
PROFILE / 01

JONATHAN

TYPEWRITER
SINCE 2026

087                  112
AVG WPM              BEST WPM

────────────────────────────

BIO
[editable bio text]

────────────────────────────

BADGES
[badge grid]
```

### 7.2 Username

Large Fraunces typography. Strong presence.

### 7.3 Stats

Two-column: AVG WPM + BEST WPM in large numbers.

### 7.4 Bio

Editable with modal (existing `bioUpdate.js` logic). Clean textarea, simple save/cancel.

### 7.5 Badges

Badge grid with warm styling. Existing `badges-display.js` logic preserved, visual refreshed.

### 7.6 Preserved JS Elements

`#initial`, `#username`, `#bio-text`, `#edit-bio-btn`, `#bio-modal`, `#bio-input`, `#cancel-bio-btn`, `#save-bio-btn`, `#avg-wpm`, `#avg-accuracy`, `#complete-test`, `#badges-container`

---

## 8. Settings Page

### 8.1 Layout

Clean vertical sections with collapsible panels. Not a dashboard grid.

```
SETTINGS

── Profile ──────────────────
  Username: [input]
  Email: [input]
  [Save Changes]

── Game Preferences ─────────
  Real-time stats: [toggle]
  Instant feedback: [toggle]

── Sound & Feedback ─────────
  Enable sounds: [toggle]
  Keyboard sounds: [toggle]

── Appearance ───────────────
  Theme: [removed or single option]
  Font size: [select]

── Notifications ────────────
  Email notifications: [toggle]
  Push notifications: [toggle]

── Privacy ──────────────────
  Profile visible: [toggle]
  Activity status: [toggle]
```

### 8.2 Section Design

- Thin top border per section
- Section header: bold, uppercase, with chevron toggle
- Collapsible content (existing `sectionToggle.js` logic)
- Clean toggle switches (warm orange when active)
- Inputs: dark background, subtle border, cream text

### 8.3 Theme Select

Remove theme selector (single warm dark mode). If keeping the `<select>`, make it a single "Dark" option or remove entirely.

### 8.4 Preserved JS Elements

All toggle IDs, section IDs, input IDs, `#toast-success`, `#user-info-update-btn`, `#username-input`, `#email`, `#theme-select`, `#font-size-select`

---

## 9. Auth Pages (Login, Register, Forgot Password, Reset Password)

### 9.1 Layout

Centered card on dark background. Minimal.

```
[Logo: DRIFTYPE]

────────────────────

[Form fields]

[Submit button]

[Footer links]
```

### 9.2 Form Design

- Dark card (`var(--bg-mid)`) with thin border
- Inputs: dark background (`var(--bg-surface)`), cream text, subtle border
- Icons: orange accent background
- Submit button: full-width, orange
- Error messages: red accent
- Success messages: orange accent

### 9.3 Preserved JS Elements

`#loginForm`, `#registerForm`, `#forgotPasswordForm`, `#resetPasswordForm`, `#errorMessage`, `#successMessage`, `#logo`, dynamically created `#email`, `#password`, `#username`, `#confirmPassword`, `#show-password`

Form fields injected via innerHTML — styling applied through `.input-form` and `.icon-form` classes in `formStyle.js`. Update class definitions in `formStyle.js` to match new palette.

---

## 10. Responsive Design

### 10.1 Breakpoints

- 1440px: full layout
- 1280px: slight compression
- 1024px: controls stack, hero goes single-column
- 768px: compact nav, stacked layout
- 390px: mobile-first recomposition

### 10.2 Mobile Priorities

- Typing text gets full width
- Controls become compact (dropdowns or stacked)
- Nav becomes hamburger
- Statistics stack vertically
- Graphs remain readable (full width)
- No horizontal overflow
- No tiny unreadable text

---

## 11. Animations

### 11.1 Allowed

- Cursor blink: `@keyframes blink` (CSS, step-end)
- Page transitions: subtle fade-in on load
- Hover states: color transitions (0.2s)
- Progress bar: width transition (0.3s)
- Dropdown toggle: max-height transition
- Button hover: background color shift
- Grain: static (no animation)

### 11.2 Forbidden During Typing

- No JS-driven animations on keypress
- No DOM re-renders beyond letter span updates
- No heavy visual effects
- No animation libraries

---

## 12. Dependencies to Remove

| Library | Reason |
|---------|--------|
| Three.js | Replaced by CSS warm glow |
| Vanta.js | Replaced by editorial composition |
| Typed.js | Replaced by CSS cursor animation |
| Animate.css | Replace with targeted CSS transitions |
| Poppins font | Replaced by Space Grotesk |
| Raleway font | Replaced by Fraunces |
| Architects Daughter font | Not used in new design |
| Playfair Display | Never imported (broken ref), remove from @theme |

**Keep:**
- Chart.js (results graph)
- ECharts (statistics graph)
- Font Awesome (icons)
- Flowbite (if needed for dropdowns/modals — evaluate)
- i18next (internationalization)
- canvas-confetti (fireworks)
- Toastify.js (toast notifications)

---

## 13. Files to Modify

### CSS
- `src/css/input.css` — complete overhaul (colors, fonts, theme, globals)

### HTML Pages (all 9)
- `index.html` — landing page redesign
- `login/index.html` — auth page redesign
- `register/index.html` — auth page redesign
- `forgot-password/index.html` — auth page redesign
- `reset-password/index.html` — auth page redesign
- `dashboard/index.html` — game page redesign
- `profile/index.html` — profile redesign
- `setting/index.html` — settings redesign
- `statistics/index.html` — statistics redesign

### JavaScript (visual updates only)
- `src/components/js/toggleTheme.js` — remove or gut (no theme switching)
- `src/components/js/formStyle.js` — update class definitions for new palette
- `src/components/js/pages/badges-display.js` — update badge card colors
- `src/components/js/appearance.js` — remove theme select handling, keep font size
- `src/components/js/components/head.js` — update font imports
- `src/components/js/components/header.js` — update nav design

### CDN Removals (from HTML)
- Three.js script tag
- Vanta.js script tag
- Typed.js script tag
- Animate.css link tag
- Old Google Fonts link (replace with Fraunces + Space Grotesk)

---

## 14. What NOT to Change

- All JavaScript business logic
- Game engine (typing, WPM, accuracy, timer calculations)
- API calls and endpoints
- Authentication flow
- Session management
- Database operations
- Chart.js / ECharts data flow
- Event listeners and DOM selectors
- Element IDs referenced by JS
- Form injection logic (innerHTML in auth pages)
- Badge logic
- Settings save/load logic
- Navigation redirect logic

---

## 15. Implementation Order

1. **Global CSS** — input.css overhaul (colors, fonts, theme removal, globals)
2. **Tailwind @theme** — new custom properties
3. **Navbar component** — shared across all pages, logged in/out states
4. **Landing page** — hero, sections, CTA
5. **Game page** — controls, word display, stats, results
6. **Statistics page** — overview, graph, table
7. **Profile page** — identity, stats, badges
8. **Settings page** — sections, toggles
9. **Auth pages** — login, register, forgot/reset password
10. **Responsive pass** — mobile breakpoints
11. **Animation pass** — transitions, hover states
12. **Dependency cleanup** — remove unused CDN libs
13. **Functional verification** — test every JS-dependent feature
