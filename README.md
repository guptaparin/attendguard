# AttendGuard

**Live app: https://guptaparin.github.io/attendguard/** · **Demo video: https://youtu.be/skvFK5r2egg**

**Can you skip tomorrow?** AttendGuard tells college students, per subject, exactly how many classes they can skip, or how many they must attend in a row, to stay above their attendance requirement (75% by default).

- Opens on a **sample register** with a 3-step guided tour, so you see it working in one second. Clear it and add your own subjects.
- Each subject gets a stamped verdict: **SAFE**, **ON THE LINE**, or **SHORT**, plus a handwritten count of classes you can bunk or must attend.
- **Semester status** tells you what to do next ("You're short in Engineering Maths III. Attend the next 14 classes.").
- One tap of **Present** / **Absent** after each class updates the verdict live, and **Undo** fixes a mistaken tap.
- Change the required percentage, and every verdict recalculates.
- Careful input checks: duplicate subjects, impossible counts and code-like input are rejected with a message on the exact field.
- Honest framing: results are an estimate from your numbers; your college's official record decides.
- Free and private: it runs entirely in your browser, data stays on your device (localStorage), and there's no account or server. Fonts are bundled, so it works offline.

## Run it

Requires Node 18+.

```bash
npm install
npm run dev      # open the printed URL (http://localhost:5173)
npm test         # unit tests for the attendance calculator
npm run build    # static build in dist/
npm run build:single   # everything in one HTML file: dist-single/index.html
```

## How the math works

For classes held `h`, attended `a`, and required `R`%, using integers only:

- Classes you can still skip: `floor((100·a − R·h) / R)`
- Classes to attend in a row when below the line: `ceil((R·h − 100·a) / (100 − R))`

`src/attendance.test.js` checks these against the PRD examples and a brute-force simulation.

## How it was built

Planned and built with the [Devpost Learn skill pack](https://github.com/challengepost/learn-ai-basics) for **Build With AI: Basics**. The planning docs are in [`devpost/`](devpost/): [`scope.md`](devpost/scope.md), [`prd.md`](devpost/prd.md), [`spec.md`](devpost/spec.md), and the build [`checklist.md`](devpost/checklist.md).

Stack: React 18, Vite 5, plain CSS, Vitest, @fontsource (Archivo, IBM Plex, Kalam).

**Iteration:** after the judges' *Will It Ship* guidance, the app was revised: realistic sample data on first visit, an attendance-register visual identity instead of a generic dark theme, a desktop layout, footer details, a guided tour, stricter validation and clearer wording. See [`devpost/checklist.md`](devpost/checklist.md) → *Second review* and *Revisions*.
