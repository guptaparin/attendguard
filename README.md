# AttendGuard

**Live app: https://guptaparin.github.io/attendguard/** · **Demo video: https://youtu.be/skvFK5r2egg**

**Can you skip tomorrow?** AttendGuard tells college students, per subject, exactly how many classes they can skip, or how many they must attend in a row, to stay above their attendance requirement (75% by default).

- Add subjects with classes held and attended, and get an instant verdict: **Safe**, **On the edge**, or **Danger**.
- One tap of **Present** / **Absent** after each class updates the verdict live, and **Undo** fixes a mistaken tap.
- Change the required percentage, and every verdict recalculates.
- Free and private: it runs entirely in your browser, data stays on your device (localStorage), and there's no account or server.

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

Stack: React 18, Vite 5, plain CSS, Vitest.
