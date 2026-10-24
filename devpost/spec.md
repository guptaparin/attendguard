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
- `npm run build` produces `dist/` (static). Deployment chosen (optional, free): GitHub Pages serving the `gh-pages` branch (the built `dist/` plus `.nojekyll`), enabled under Settings → Pages → Source: Deploy from a branch → `gh-pages` / root. Live at https://guptaparin.github.io/attendguard/. `.github/workflows/deploy.yml` is an alternative that builds on GitHub Actions if runners are available.
- Submission needs a short demo video and a public GitHub repository. Deployment is optional.

## Sharing
- Public repository: https://github.com/guptaparin/attendguard
- Demo video: https://youtu.be/skvFK5r2egg
- Live app (optional): https://guptaparin.github.io/attendguard/

## Look and Feel
From `prd.md > Look and Feel` (attendance-register identity):
- Paper #f3f5f0 with blue ruling every 32px and a red margin line (desktop). The ink is #1c2a4a and the cover band uses the same ink.
- Stamp inks: safe #1e7a4c, on the line #a86a12, short #c0352b. They appear on the stamp, the handwritten number, and the bunk cells.
- Type: Archivo 800 for headings and stamps, IBM Plex Sans for body, IBM Plex Mono for counts, and Kalam 700 (an Indian Type Foundry handwriting face) for the verdict number. All are **bundled with the app** via @fontsource, so it renders identically offline.
- Slips have a 1.5px ink border and an offset print shadow. Buttons press down on click and lift on hover. The stamp re-stamps and the number pops when the status changes, and both respect reduced motion.
- Layout: one column under 960px; register plus a 360px sticky side panel above that; two slip columns from 720px.

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
`validate(input, existingNames)` returns `{ field, message }` or null (duplicates, 999 cap, letters-or-digits name, whole numbers). Errors focus the bad field and set `aria-invalid`. Tested in `src/form.test.js`.
Handles Add and Edit. Validates the input (a name is required; whole numbers ≥ 0; attended ≤ held) and shows inline errors.
PRD ref: `prd.md > Subjects`, `prd.md > States and Boundaries`.

### SubjectCard
Shows the name, attended/held, percentage, status pill, and the big verdict. Has Present, Absent, Undo (shown when available), Edit, and Delete (with confirm).
PRD ref: `prd.md > The Verdict`, `prd.md > One-Tap Marking`, `prd.md > Subjects`.

### Header, Summary and Footer
Shows the app name and an editable required percentage, plus the safe / edge / danger counts.
PRD ref: `prd.md > Required Percentage`, `prd.md > Summary`.

### Sample register (sample.js)
`SAMPLE_SUBJECTS` holds 5 realistic subjects covering every verdict. `useSubjects` loads them on a first visit (no saved data) flagged `sample: true`, and provides `loadSample` / `clearSample`. Editing a sample subject sets `sample: false`.
PRD ref: `prd.md > Sample Register`.

### TourNote (guided tour)
`tour` (0–3) is stored with the register. 0 = mark a class (note on the first slip), 1 = undo (note on the slip just marked), 2 = make it yours (note in the sample banner), 3 = done. `advanceTour(n)` only moves forward. Old saves without `tour` load as done.
PRD ref: `prd.md > Guided Tour`.

### BunkCells
One cell per class you can bunk or must attend (capped at 24).
PRD ref: `prd.md > Bunk Budget Cells`.

## Data Model
Saved in `localStorage["attendguard:v1"]`:
```json
{ "required": 75,
  "subjects": [ { "id": "abc123", "name": "Digital Electronics", "held": 40, "attended": 36,
                  "last": { "held": 39, "attended": 35 }, "sample": false } ] }
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
│   ├── form.test.js        # validation cases (duplicates, injection-like input, caps)
│   ├── useSubjects.js      # state + localStorage
│   ├── sample.js           # sample register for first visits
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Summary.jsx
│   │   ├── SubjectCard.jsx
│   │   ├── BunkCells.jsx       # bunk-budget register cells
│   │   ├── Footer.jsx          # how it's calculated + links
│   │   ├── TourNote.jsx        # one step of the guided tour
│   │   └── SubjectForm.jsx
│   └── styles.css          # palette + layout
├── devpost/                # planning docs (profile is git-ignored)
└── README.md               # what it is + how to run
```

## External Services and Dependencies
None at runtime. Fonts are bundled via @fontsource (https://fontsource.org), so nothing is fetched. No APIs, keys, or costs.

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
