---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast (learner prefers speed; hands-on checkpoints still apply)

## Slices

- [x] **1. You can add a subject and see its verdict**
  Becomes usable: A running, styled app where adding "Digital Electronics, 40 held, 36 attended" shows a card that says "You can skip 8" in green. Nothing persists yet.
  Why now: This is the kernel. It proves the calculator and the whole render path first, and the scaffold is included here.
  PRD ref: `prd.md > The Core Journey` (steps 1–3), `prd.md > The Verdict`, `prd.md > Subjects`, `prd.md > Look and Feel`
  Spec ref: `spec.md > attendance.js (calculator)`, `spec.md > SubjectForm`, `spec.md > SubjectCard`, `spec.md > File Structure`, `spec.md > Look and Feel`
  Build: Scaffold Vite + React per the file structure; write `attendance.js` and its Vitest cases; build the Add form with validation, the subject card with status and verdict, and the dark scoreboard styling.
  Verify (mechanical): `npm test` passes all PRD verdict cases (36/40→skip 8, 30/40→edge 0, 25/40→attend 20, 0/0→empty, 100% unreachable); `npm run build` succeeds; a headless browser adds a subject and the card text reads "skip 8".
  Learner check: Open the app, add a subject with your real numbers, and see whether the verdict matches what you'd expect.
  Commit: `Add subject form and live attendance verdict`

- [x] **2. One tap updates the verdict, with undo, edit, and delete**
  Becomes usable: Tapping Present/Absent changes the counts and verdict instantly; Undo reverses a mistaken tap; subjects can be edited or deleted; a summary shows safe/edge/danger counts.
  Why now: This is the core loop the student repeats every day. It builds on the slice 1 card.
  PRD ref: `prd.md > One-Tap Marking`, `prd.md > Subjects`, `prd.md > Summary`
  Spec ref: `spec.md > useSubjects (state + persistence hook)`, `spec.md > SubjectCard`, `spec.md > Header and Summary`
  Build: Add `useSubjects` with `mark`/`undo`/`update`/`remove`; add the Present/Absent/Undo/Edit/Delete controls and the summary strip.
  Verify (mechanical): A headless browser taps Absent on 36/40 and sees 36/41 "skip 7"; Undo returns "skip 8"; delete removes the card after confirm; the summary counts are correct for the two example subjects.
  Learner check: Tap Absent a few times and watch the skip count drop, then press Undo.
  Commit: `Add one-tap marking, undo, edit, delete and summary`

- [x] **3. Everything survives a refresh, and the requirement is adjustable**
  Becomes usable: Data and the required % persist in the browser; changing 75→80 recalculates all verdicts; first-use welcome and storage-unavailable note appear when relevant.
  Why now: Persistence and settings are cheap once the state hook exists, and they complete the demo ("refresh — still there").
  PRD ref: `prd.md > Required Percentage`, `prd.md > States and Boundaries`, `prd.md > The Core Journey` (step 7)
  Spec ref: `spec.md > Data Model`, `spec.md > Important Failure Modes`, `spec.md > Header and Summary`
  Build: Save and load `attendguard:v1` in `useSubjects` with shape validation; add the editable requirement in the header; add the empty-state welcome and the storage note; add README and the single-file build script.
  Verify (mechanical): A headless browser adds subjects, reloads, and sees them; setting 80% makes 36/40 show "skip 5"; corrupted storage loads empty without errors; `npm run build:single` outputs one HTML file.
  Learner check: Add subjects, refresh the page, and change the requirement to 80%.
  Commit: `Persist data, adjustable requirement, empty and error states`

## Hands-on Checkpoints

- [x] Early usable behavior explored — combined with the final review session (tiny 3-slice build; learner asked to proceed straight through)
- [x] Final kick-the-tires exploration and feedback completed — learner tried the live demo: "everything is good"; asked for any remaining improvements

## Final Review

- [x] Verdict number animates ("pops") when it changes — makes the one-tap update visible; respects reduced-motion. Verified: animationName = pop after Absent.
- [x] Verdict line announced to screen readers (`aria-live="polite"`). Verified in headless browser.
- [x] Free live link: GitHub Actions workflow deploys `dist/` to GitHub Pages on push (tests must pass first). Verified: build uses relative asset paths for the Pages sub-path.
- [x] Final review complete — feedback resolved and learner confirms ready to ship

### Second review: against the official judging guidance (Will It Ship video)
The learner shared the judges' criteria (Design & Product Experience, Innovation, Presentation) and asked for the project to be revised against them. The audit found:
- [x] Judges land on an empty form → **sample register on first visit**, labeled, with Clear sample / Add my own. Verified: 5 slips on first load; clear keeps user subjects; edit makes a sample user-owned.
- [x] Dark neon look matched generic AI-app defaults → **attendance-register redesign** (ruled paper, ink, rubber stamps, handwritten verdicts, bunk cells). Verified at 390/768/1024/1440px with no horizontal scroll.
- [x] Phone column on desktop → **two-column desktop layout** with a sticky side panel; on phones the summary comes first.
- [x] Missing small details → **favicon**, **footer** (how it's calculated, source link, credit), and a **semester status sentence** naming what to do next.
- [x] Fonts depended on Google Fonts → **bundled locally**, so the app is fully offline.
- [x] Regression: 14 unit tests (2 new for the sample) and 25 headless behavior checks pass, with no page errors.

### Third review: the judges' detailed notes (trust, validation, UX nuance, responsible framing)
- [x] "Show, don't tell" onboarding → **3-step guided tour** placed next to each control, with step indicator and Skip tour. Verified: advances on the real action, follows the slip that was marked, persists across reload, ends on clear/add.
- [x] Database hygiene / validation → **duplicate names blocked**, 999-class cap, name must contain a letter or number, field-specific errors with focus + `aria-invalid`. Verified: 10 new unit tests; `<img onerror>` in a name renders as text.
- [x] Clear, translatable wording → functional copy uses **skip / press / Present / Absent**; "bunk" kept only in the tagline.
- [x] "Signals, not verdicts" → **estimate caveat** under Semester status and an assumptions note in the footer.
- [x] Baked-in regional context must be stated → home screen says **75% is the usual Indian minimum** and where to change it.
- [x] Link previews → Open Graph tags + preview image for sharing on WhatsApp/Discord.
- [x] Regression: 24 unit tests and 24 headless checks pass (incl. old-format saves, blocked storage, keyboard reachability), no page errors.

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Brief evidence-based recap (learner chose to go straight to shipping). Connection: PRD verdict examples (`prd.md > The Verdict`) became `src/attendance.test.js` plus a brute-force simulation, run before any UI depended on the math.
Route and stops: Reference route only, not toured live: `SubjectCard.jsx` (btn-absent) → `useSubjects.js` (mark) → `attendance.js` (verdict/skippable).
Edit outcome: Not applicable (no hands-on edit).
Reflection: Transfer question offered when the map was shown.
Activity mode: Recap with static reference map (checked headless, scripts disabled, phone width, dark theme).

## Revisions

- Early hands-on checkpoint merged into the final review — the learner chose to build straight through; all three slices were verified mechanically in a headless phone-size browser before the learner's hands-on session.
- Form inputs overflowed the phone width in slice 1 — fixed with `minmax(0, 1fr)` grid columns and full-width inputs.
- Summary label shortened from "On the edge" to "Edge" — it wrapped onto two lines at phone width.
- Pages deploy switched to a pre-built `gh-pages` branch — the GitHub Actions run sat in "Queued" for 16+ minutes waiting for a runner; serving the built `dist/` from a branch needs no runner. The Actions workflow stays in the repo as an alternative.
- Visual identity replaced (dark scoreboard → attendance register) — the official judging guidance penalizes generic AI-generated looks, and the original palette/fonts/left-accent cards matched those defaults. Product behavior and math are unchanged.
- First visit now opens on a labeled sample register instead of an empty form — judges said to pre-populate realistic demo data; `scope.md > What "Working" Looks Like` is now visible without typing.
- Desktop layout added (register + side panel) — judges marked down phone-only interfaces shown on desktop.
- Fonts bundled with @fontsource instead of Google Fonts — a headless check showed the handwritten verdict falling back to a serif when the font CDN was unreachable.
- Guided tour added on the sample register — the judges said onboarding should happen inside the app at the moment of use, not as instructions to read first.
- Functional copy switched from "bunk" to "skip" — judges warned that slang and platform-specific verbs break under translation; "bunk" stays in the tagline as identity only.
- Validation returns the failing field — a single generic message didn't say which input to fix; duplicates were previously allowed.
- Deploy path corrected — Pages was still set to "GitHub Actions", so pushes to the `gh-pages` branch never went live and the site stayed on the Oct 16 build; the workflow's push trigger is restored so every push to `main` deploys.
