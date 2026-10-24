// Realistic example register shown on a first visit, so the app opens in a working state.
// Every sample subject is flagged `sample: true` and can be cleared in one tap.
// Counts are typical for mid-semester in a 2nd-year electronics branch.
export const SAMPLE_SUBJECTS = [
  { name: 'Digital Electronics', held: 42, attended: 38 },   // safe: can bunk 8
  { name: 'Analog Circuits', held: 40, attended: 33 },       // safe: can bunk 4
  { name: 'Signals & Systems', held: 40, attended: 31 },     // on the line: 1 left
  { name: 'Engineering Maths III', held: 38, attended: 25 }, // short: attend 14 in a row
  { name: 'Data Structures Lab', held: 14, attended: 12 },   // safe: can bunk 2
];

export function makeSample(newId) {
  return SAMPLE_SUBJECTS.map((s) => ({ id: newId(), ...s, last: null, sample: true }));
}
