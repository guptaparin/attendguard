---
doc: prd
status: approved
---

<!-- Provenance: the learner delegated product details ("go with the best answers you decide").
     Everything below that is not from scope's learner choices is an agent recommendation,
     presented for the learner's approval. -->

# AttendGuard — Product Requirements

A phone-first attendance calculator for college students with a minimum-attendance rule: per subject, it shows exactly how many classes they can skip or must attend.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
1. The student opens AttendGuard for the first time and sees a short welcome: what the app does, the current requirement (75%), and an **Add subject** form. (`scope.md > The Core Loop`)
2. They type a subject name, classes held so far, and classes attended, then tap **Add**.
3. A card appears for that subject showing its percentage and a big verdict: "You can skip 8" (green), "Don't skip — you're on the edge" (amber), or "Attend the next 20 in a row" (red).
4. They add their other subjects. An overall summary at the top tells them how many subjects are in danger.
5. After a class, they tap **Present** or **Absent** on the card. Held and attended update, and the verdict changes instantly.
6. If they tapped by mistake, they tap **Undo** to reverse their last tap.
7. They close the tab. Next time they open it, everything is exactly as they left it.

Success: the student can decide "skip or attend?" for any subject in under five seconds.

## Screens and Layout
One screen. Phone: a single column with the semester status above the subjects. Desktop (960px and up): the register on the left, with a sticky side panel holding the semester status and the Add form.
- **Header:** the app name, plus the requirement control ("Required: 75%") that can be tapped to change.
- **Summary strip:** subjects tracked, and how many are safe / on the edge / in danger.
- **Subject cards:** one per subject, listed in the order added.
- **Add subject form:** at the bottom of the list (and the main content when there are no subjects).

## Look and Feel
(Revised after the official judging guidance; see `checklist.md > Revisions`. The original dark "scoreboard" look read as a generic AI-app default.)
- An **attendance register**, the object students already know: ruled notebook paper, a red margin line, and ballpoint-blue ink.
- Each subject is a printed slip. Its status is a **rubber stamp** (SAFE / ON THE LINE / SHORT), and the verdict number is **handwritten**, as if marked in the register.
- Status colors are stamp inks (green, amber, red). Each is always paired with a word, so the meaning never relies on color alone.
- Student vernacular: "bunk", "short attendance", "min. attendance".
- Big tap targets with P/A markers for Present/Absent; usable one-handed.

## Features and Behavior

### Subjects
- Add a subject with a name, classes held, and classes attended.
- Edit a subject's name, held, or attended count (fixing typos or syncing with the portal).
- Delete a subject, with a confirmation so it can't be deleted by accident.
  - [ ] Adding "Digital Electronics, 40 held, 36 attended" shows a card with 90%.
  - [ ] Editing the counts updates the verdict immediately.
  - [ ] Deleting asks to confirm, then removes the card.

### The Verdict
For each subject, using the required percentage R:
- **Safe** (at or above R, and at least 2 skippable): "You can skip N". This is the largest N such that attending none of the next N classes keeps them at or above R.
- **On the edge** (at or above R, but 0–1 skippable): "You can skip 1 — careful" or "Don't skip — you're right at the line".
- **Danger** (below R): "Attend the next N in a row". This is the smallest N such that attending N consecutive classes brings them back to R.
- **Unreachable:** if the requirement is 100% and they've already missed a class, it says plainly that 100% is no longer possible.
- **No classes yet** (held = 0): "No classes yet", with no verdict.
  - [ ] 36/40 at 75%: Safe, skip 8.
  - [ ] 30/40 at 75%: On the edge, skip 0.
  - [ ] 25/40 at 75%: Danger, attend 20 in a row.
  - [ ] 0/0: "No classes yet".

### One-Tap Marking
- **Present** adds 1 to held and 1 to attended. **Absent** adds 1 to held only.
- **Undo** reverses the most recent Present/Absent tap on that subject (one level per subject).
  - [ ] Tapping Absent on a 36/40 subject shows 36/41 and changes "skip 8" to "skip 7".
  - [ ] Undo after that returns it to 36/40, "skip 8".

### Required Percentage
- Defaults to 75%. The student can change it (any whole number from 1 to 100), and all verdicts recalculate.
  - [ ] Changing 75 to 80 makes 36/40 show "skip 5".

### Summary
- At the top: total subjects, and counts of safe / edge / danger.
  - [ ] With the two example subjects, the summary shows 1 safe and 1 in danger.

### Sample Register
(Added after the judging guidance: "pre-populate with realistic demo data".)
- On a first visit the app opens on 5 realistic, clearly labeled sample subjects covering every verdict (safe, on the line, short). A banner says it's a sample, with **Clear sample** and **Add my own**.
- Clearing removes only sample subjects. Editing a sample subject makes it the user's own.
- An empty register offers **Load sample register**.
  - [ ] A first-time visitor sees verdicts without typing anything.
  - [ ] Clear sample keeps every subject the user added or edited.

### Semester Status
- The summary names the one thing to do next, e.g. "You're short in Engineering Maths III. Don't bunk it: attend the next 14 classes."
  - [ ] With the sample register, the advice names Engineering Maths III.

### Bunk Budget Cells
- Under each verdict, one register cell per class you can still bunk, or per class you must attend (capped at 24, then "+N").

## States and Boundaries
- **First use:** opens on the labeled sample register (see **Sample Register**), with the one-line promise "Can you skip tomorrow?" at the top.
- **Empty register:** after clearing, an empty state offers to add a subject or reload the sample.
- **Invalid input:** attended greater than held, negative numbers, non-whole numbers, or an empty name. An inline message explains the problem and nothing is saved.
- **What persists:** subjects, counts, the required percentage, and undo history survive a refresh. Data lives only on that device and browser.
- **Storage unavailable** (private mode or blocked): the app still works for the session and shows a small note that data won't be saved.

## Product Decisions
- Name "AttendGuard"; browser-only; free (learner).
- One screen, cards, big verdict numbers, traffic-light status; Undo instead of a full history; a single global requirement rather than per-subject (agent recommendations, delegated by the learner).
- The edge threshold is at most 1 skippable class, because skipping one more would take them below the line (agent recommendation).

## What We're Building
Everything under **Features and Behavior** and **States and Boundaries** above, on one mobile-first screen.

## Deferred From the POC
- **Per-subject requirement** (some colleges differ by subject type). One global value proves the kernel.
- **Full attendance history / calendar.** Undo covers mistakes, and the history adds data-model weight.

## Possible Later Enhancements
- A "What if I skip today?" multi-subject planner.
- Timetable-aware projections ("by end of semester you'll be at...").
- Shareable summary image.

## Non-Goals
- No accounts, sync, backend, or database (free and private).
- No college-portal scraping.
- No notifications.

## Open Questions
None blocking `4-spec`.
