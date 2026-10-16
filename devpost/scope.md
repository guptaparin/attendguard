---
doc: scope
status: approved
---

<!-- Provenance: the learner chose the AttendGuard idea and the "completely free, no database" constraint.
     For the remaining decisions the learner said "go with the best answers you decide";
     those are agent recommendations, labeled as such, presented for the learner's approval. -->

# AttendGuard

A phone-first attendance calculator that tells a college student, per subject, exactly how many classes they can skip, or how many they must attend in a row, to stay above their attendance requirement.

## The Unique Kernel
It answers the real question instead of showing a percentage: **"Can I skip tomorrow?"** Every subject gets a plain verdict, like "You can skip 3 more" or "Attend the next 5 in a row", and the verdict changes instantly with one tap of Present or Absent.

## Who It's For
An Indian engineering student at a college with a 75% attendance rule (like Thapar), juggling 5–7 subjects. Today they open the college portal, see "72.4%", and do mental math to decide whether to bunk. They get it wrong near exams and risk being debarred.

## The Core Loop
After each class (or at the end of the day) they open AttendGuard, tap **Present** or **Absent** on the subject, and read the updated verdict. Before skipping a class, they glance at the verdict to decide. They come back because it is the fastest way to know where they stand.

## Inspiration & Identity
Feels like a calm, trustworthy instrument: a scoreboard, not a dashboard. Big bold numbers, traffic-light status (safe / on the edge / danger), and short student-friendly copy. Dark, high-contrast, and readable on a phone in a corridor. (Agent recommendation, accepted.)

## Why This Matters to the Learner
"This is a hackathon — let's build our best and win this." The learner wants a useful, polished, free entry that any student instantly understands.

## What "Working" Looks Like
On a phone-size screen: add Digital Electronics with 36 of 40 attended and see **"Safe — you can skip 8."** Add Maths with 25 of 40 and see **"Danger — attend the next 20 in a row."** Tap Absent on Digital Electronics and watch it drop to 7. Refresh the page and everything is still there.

The "oh, that's cool" beat: tapping Absent and watching the skip budget tick down live.

## The POC Boundary
- Add, edit, and delete subjects (name, classes held, classes attended).
- Per-subject verdict with exact skip/attend count and a safe / edge / danger status.
- One-tap Present / Absent, plus undo for a mistaken tap.
- An adjustable required percentage (default 75%).
- Data saved in the browser, so it survives a refresh.

## Later
- A "What if I skip today?" planner across several subjects.
- Weekly timetable to project future classes.
- Export or share a summary.

## Explicitly Cut
- **Login or accounts.** Requires a backend and costs time; the data is personal to one phone.
- **Backend or database.** The learner requires the project to be completely free; browser storage is enough.
- **Scraping the college portal.** Fragile, college-specific, and not needed to prove the kernel.
- **Notifications and reminders.** These need extra platform permissions and are not part of the core loop.
