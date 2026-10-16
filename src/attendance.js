// The calculator: pure functions, no UI. Integer math only to avoid floating-point surprises.
// R is the required percentage as a whole number (1–100).

export function percent(held, attended) {
  if (held <= 0) return null;
  return (attended / held) * 100;
}

// How many upcoming classes can be missed while staying at or above R%.
// Largest k with 100·a >= R·(h + k)  →  k = floor((100a − R·h) / R)
export function skippable(held, attended, required) {
  return Math.floor((100 * attended - required * held) / required);
}

// How many classes must be attended in a row to climb back to R%.
// Smallest n with 100·(a + n) >= R·(h + n)  →  n = ceil((R·h − 100a) / (100 − R))
export function needed(held, attended, required) {
  return Math.ceil((required * held - 100 * attended) / (100 - required));
}

// Returns { status, count, percent }
//   status: 'empty' | 'safe' | 'edge' | 'danger' | 'unreachable'
export function verdict(held, attended, required) {
  if (held <= 0) return { status: 'empty', count: 0, percent: null };
  const pct = percent(held, attended);
  if (100 * attended >= required * held) {
    const count = skippable(held, attended, required);
    return { status: count >= 2 ? 'safe' : 'edge', count, percent: pct };
  }
  if (required >= 100) return { status: 'unreachable', count: 0, percent: pct };
  return { status: 'danger', count: needed(held, attended, required), percent: pct };
}

// Student-friendly copy for each verdict.
export function describe(v) {
  switch (v.status) {
    case 'empty':
      return { label: 'No classes yet', headline: '—', line: 'Mark your first class to see a verdict.' };
    case 'safe':
      return { label: 'Safe', headline: String(v.count), line: `You can skip ${v.count} more ${v.count === 1 ? 'class' : 'classes'}.` };
    case 'edge':
      return v.count === 1
        ? { label: 'On the edge', headline: '1', line: 'You can skip 1 — careful, that’s your last.' }
        : { label: 'On the edge', headline: '0', line: 'Don’t skip — you’re right at the line.' };
    case 'danger':
      return { label: 'Danger', headline: String(v.count), line: `Attend the next ${v.count} in a row to get back above the line.` };
    case 'unreachable':
      return { label: 'Unreachable', headline: '×', line: '100% isn’t reachable anymore — you’ve already missed a class.' };
    default:
      return { label: '', headline: '', line: '' };
  }
}
