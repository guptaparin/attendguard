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

- [ ] Early usable behavior explored — combined with the final review session (tiny 3-slice build; learner asked to proceed straight through)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence:
Route and stops:
Edit outcome:
Reflection:
Activity mode:

## Revisions

- Early hands-on checkpoint merged into the final review — the learner chose to build straight through; all three slices were verified mechanically in a headless phone-size browser before the learner's hands-on session.
- Form inputs overflowed the phone width in slice 1 — fixed with `minmax(0, 1fr)` grid columns and full-width inputs.
- Summary label shortened from "On the edge" to "Edge" — it wrapped onto two lines at phone width.
