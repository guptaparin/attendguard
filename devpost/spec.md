---
doc: spec
status: approved
---

<!-- Provenance: learner constraint = free, no backend/database, browser-only.
     Stack and architecture are agent recommendations (learner delegated: "go with the best answers you decide"),
     chosen to match the learner's existing React experience. -->

# AttendGuard — Technical Spec

## How This Works, In Plain Language
AttendGuard is a single web page built with React. It has three pieces:
1. **The calculator:** a small set of plain functions that take "held, attended, required %" and return the verdict (skip N, attend N, edge, and so on). They have no UI, so they're easy to test.
2. **The screen:** React components that show the cards, buttons, summary, and form, asking the calculator what to display.
3. **The save slot:** the browser's built-in `localStorage`, where the list of subjects is saved after every change and read back when the page opens.

There's no server and no database, so it costs nothing to run and the data never leaves the phone. This is the smallest shape that proves the kernel.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.
1. The page loads, and `useSubjects` reads saved data from `localStorage`. If nothing is saved, the welcome and empty form appear.
2. The student submits the Add form. `SubjectForm` validates the input, then `useSubjects.add()` adds the subject to state and saves it.
3. `SubjectCard` calls `verdict(held, attended, required)` from `attendance.js` and renders the status, number, and copy.
4. The student taps Present or Absent. `useSubjects.mark()` updates the counts, remembers the previous counts for undo, and saves. React re-renders, and the verdict updates.
5. Undo calls `useSubjects.undo()`, which restores the remembered counts.
6. On a later visit, step 1 restores everything.

## Stack
- **React 18 + Vite 5**. This matches the learner's React experience, and Vite gives a fast dev server and a static build. Docs: https://react.dev, https://vitejs.dev
- **Vitest** for unit-testing the calculator only. Docs: https://vitest.dev
- **Plain CSS** (one stylesheet with CSS variables), with no UI library, which keeps the look custom.
- **Fonts:** Space Grotesk (headings and numbers) and Inter (body) from Google Fonts, with system-font fallbacks so the app still works offline.
- **vite-plugin-singlefile** for an optional one-file build that makes the demo easy to open and share. Docs: https://github.com/richardtallent/vite-plugin-singlefile
- Tradeoff accepted: no TypeScript, to keep the build small.

## Where It Runs and How Someone Tries It
- Runs in any modern browser. Requirements: Node 18+ and npm.
- `npm install` then `npm run dev`, and open the printed URL (http://localhost:5173). Use the browser's device toolbar (phone size) for the demo recording.
- `npm test` runs the calculator tests.
- `npm run build` produces `dist/` (static). Deployment chosen (optional, free): GitHub Pages via `.github/workflows/deploy.yml`, which runs the tests, builds, and publishes on every push to `main`. Enable it once in the repo under Settings → Pages → Source: GitHub Actions.
- Submission needs a short demo video and a public GitHub repository. Deployment is optional.

## Look and Feel
From `prd.md > Look and Feel`:
- Background near-black ink (#0d0f12), raised cards (#171a20), and soft text (#e8eaed / #9aa3ad).
- Status colors: safe #3ddc84, edge #ffb020, danger #ff5a5f. These are used for a left accent bar, a status pill, and the verdict number. A word label always appears alongside.
- The verdict number is about 56px Space Grotesk bold; the rest is 15–16px Inter.
- Spacious single column, max width 480px, 16px gutters, and 44px+ tap targets.
- Copy is short and second person ("You can skip 8").

## Components

### attendance.js (calculator)
Pure functions:
- `percent(held, attended)`
- `verdict(held, attended, required)` → `{ status: 'empty'|'safe'|'edge'|'danger'|'unreachable', count, percent }`
- Skip count: `floor((100·a − R·h) / R)` when at or above target.
- Attend count: `ceil((R·h − 100·a) / (100 − R))` when below target.
- Integer arithmetic only, to avoid floating-point errors.

PRD ref: `prd.md > The Verdict`.

### useSubjects (state + persistence hook)
Holds `subjects` and `required`. Provides `add`, `update`, `remove`, `mark(id, present)`, `undo(id)`, and `setRequired`. It saves to `localStorage` key `attendguard:v1` on every change, and loads on start (validating the shape, falling back to empty). If storage fails, it sets a `storageOk=false` flag.
PRD ref: `prd.md > One-Tap Marking`, `prd.md > Required Percentage`, `prd.md > States and Boundaries`.

### SubjectForm
Handles Add and Edit. Validates the input (a name is required; whole numbers ≥ 0; attended ≤ held) and shows inline errors.
PRD ref: `prd.md > Subjects`, `prd.md > States and Boundaries`.

### SubjectCard
Shows the name, attended/held, percentage, status pill, and the big verdict. Has Present, Absent, Undo (shown when available), Edit, and Delete (with confirm).
PRD ref: `prd.md > The Verdict`, `prd.md > One-Tap Marking`, `prd.md > Subjects`.

### Header and Summary
Shows the app name and an editable required percentage, plus the safe / edge / danger counts.
PRD ref: `prd.md > Required Percentage`, `prd.md > Summary`.

## Data Model
Saved in `localStorage["attendguard:v1"]`:
```json
{ "required": 75,
  "subjects": [ { "id": "abc123", "name": "Digital Electronics", "held": 40, "attended": 36,
                  "last": { "held": 39, "attended": 35 } } ] }
```
`last` holds the counts before the most recent tap (used for undo). It is cleared after an undo or edit. The data persists until the user deletes it or clears their browser data.

## File Structure
```
attendguard/
├── index.html              # page shell, fonts
├── package.json            # scripts: dev, build, test, build:single
├── vite.config.js
├── src/
│   ├── main.jsx            # mounts <App/>
│   ├── App.jsx             # layout: header, summary, cards, form
│   ├── attendance.js       # the calculator (pure functions)
│   ├── attendance.test.js  # Vitest cases from prd.md acceptance criteria
│   ├── useSubjects.js      # state + localStorage
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Summary.jsx
│   │   ├── SubjectCard.jsx
│   │   └── SubjectForm.jsx
│   └── styles.css          # palette + layout
├── devpost/                # planning docs (profile is git-ignored)
└── README.md               # what it is + how to run
```

## External Services and Dependencies
None at runtime besides optional Google Fonts (free, no key). No APIs, keys, or costs.

## Important Failure Modes
- **localStorage blocked or full** → the app works in memory and shows "Data won't be saved in this browser."
- **Corrupted saved data** → it's ignored, and the app starts empty instead of crashing.
- **Requirement 100% with a class missed** → it shows "100% isn't reachable anymore" instead of dividing by zero.

## What Was Simplified and Why
- **One-level undo per subject** instead of a full history: this covers mistaken taps without a log or data model.
- **A single global requirement** instead of per-subject: this proves the kernel. A per-subject version would add one field to each subject.
- **localStorage** instead of a database: this is free and private. Syncing across devices would need accounts and a backend.

## Decisions and Open Issues
- Learner choices: free, no backend/database, browser-only, the AttendGuard concept.
- Agent recommendations accepted via delegation: React + Vite, plain CSS, Vitest for the calculator, integer-only math, and a single-file build for the demo.
- One genuine uncertainty: none was raised by the learner (they delegated). The build will verify the agent's formula against the PRD's acceptance criteria with tests before any UI depends on it.
- Unresolved: none.
