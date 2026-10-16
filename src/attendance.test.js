import { describe as group, it, expect } from 'vitest';
import { verdict, describe } from './attendance.js';

group('verdict — cases from prd.md > The Verdict', () => {
  it('36/40 at 75% → safe, skip 8', () => {
    expect(verdict(40, 36, 75)).toMatchObject({ status: 'safe', count: 8, percent: 90 });
  });
  it('30/40 at 75% → edge, skip 0', () => {
    expect(verdict(40, 30, 75)).toMatchObject({ status: 'edge', count: 0 });
  });
  it('25/40 at 75% → danger, attend 20 in a row', () => {
    expect(verdict(40, 25, 75)).toMatchObject({ status: 'danger', count: 20 });
  });
  it('0/0 → no classes yet', () => {
    expect(verdict(0, 0, 75).status).toBe('empty');
  });
  it('100% required after a miss → unreachable (no divide by zero)', () => {
    expect(verdict(10, 9, 100).status).toBe('unreachable');
  });
  it('100% required with perfect attendance → edge, skip 0', () => {
    expect(verdict(10, 10, 100)).toMatchObject({ status: 'edge', count: 0 });
  });
});

group('verdict — one-tap marking and requirement changes', () => {
  it('Absent on 36/40 → 36/41 → skip 7', () => {
    expect(verdict(41, 36, 75).count).toBe(7);
  });
  it('36/40 at 80% → skip 5', () => {
    expect(verdict(40, 36, 80)).toMatchObject({ status: 'safe', count: 5 });
  });
  it('exactly one skippable → edge', () => {
    // 31/40 at 75%: floor((3100-3000)/75) = 1
    expect(verdict(40, 31, 75)).toMatchObject({ status: 'edge', count: 1 });
  });
});

group('verdict — brute-force check against simulation', () => {
  const simulateSkip = (h, a, r) => { let k = 0; while (100 * a >= r * (h + k + 1)) k++; return k; };
  const simulateNeed = (h, a, r) => { let n = 0; while (100 * (a + n) < r * (h + n)) n++; return n; };
  it('matches simulation for every h ≤ 60, a ≤ h, r in {50,60,65,75,80,85,90}', () => {
    for (const r of [50, 60, 65, 75, 80, 85, 90]) {
      for (let h = 1; h <= 60; h++) {
        for (let a = 0; a <= h; a++) {
          const v = verdict(h, a, r);
          if (v.status === 'danger') expect(v.count).toBe(simulateNeed(h, a, r));
          else expect(v.count).toBe(simulateSkip(h, a, r));
        }
      }
    }
  });
});

group('describe — copy', () => {
  it('safe copy names the number', () => {
    expect(describe(verdict(40, 36, 75)).line).toBe('You can skip 8 more classes.');
  });
  it('danger copy names the streak', () => {
    expect(describe(verdict(40, 25, 75)).line).toContain('Attend the next 20 in a row');
  });
});
