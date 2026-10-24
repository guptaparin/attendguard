import { useEffect, useState } from 'react';
import { makeSample } from './sample.js';

export const STORAGE_KEY = 'attendguard:v1';
// Guided tour on the sample register: 0 = mark a class, 1 = undo it, 2 = make it yours, 3 = done.
export const TOUR_DONE = 3;
const EMPTY = { required: 75, subjects: [], tour: TOUR_DONE };

const isCount = (n) => Number.isInteger(n) && n >= 0;
const newId = () => Math.random().toString(36).slice(2, 10);

// Load saved data, ignoring anything malformed (spec.md > Important Failure Modes).
function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    // First visit: open on a labeled sample register instead of an empty form.
    if (!raw) return { data: { required: 75, subjects: makeSample(newId), tour: 0 }, ok: true };
    const d = JSON.parse(raw);
    const required = Number.isInteger(d?.required) && d.required >= 1 && d.required <= 100 ? d.required : 75;
    const subjects = Array.isArray(d?.subjects)
      ? d.subjects
          .filter((x) => x && typeof x.name === 'string' && isCount(x.held) && isCount(x.attended) && x.attended <= x.held)
          .map((x) => ({
            id: typeof x.id === 'string' ? x.id : Math.random().toString(36).slice(2, 10),
            name: x.name,
            held: x.held,
            attended: x.attended,
            last: x.last && isCount(x.last.held) && isCount(x.last.attended) ? x.last : null,
            sample: x.sample === true,
          }))
      : [];
    const tour = Number.isInteger(d?.tour) && d.tour >= 0 && d.tour <= TOUR_DONE ? d.tour : TOUR_DONE;
    return { data: { required, subjects, tour }, ok: true };
  } catch {
    // Storage blocked (private mode) → still show the sample; corrupted JSON → start empty.
    const ok = canStore();
    return { data: ok ? EMPTY : { required: 75, subjects: makeSample(newId), tour: 0 }, ok };
  }
}

function canStore() {
  try {
    const k = STORAGE_KEY + ':probe';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

// All app state lives here (spec.md > useSubjects).
export default function useSubjects() {
  const [initial] = useState(load);
  const [state, setState] = useState(initial.data);
  const [storageOk, setStorageOk] = useState(initial.ok);

  // Save after every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      setStorageOk(false);
    }
  }, [state]);

  const patch = (id, fn) =>
    setState((s) => ({ ...s, subjects: s.subjects.map((x) => (x.id === id ? fn(x) : x)) }));

  return {
    ...state,
    storageOk,
    add: ({ name, held, attended }) =>
      setState((s) => ({ ...s, subjects: [...s.subjects, { id: newId(), name, held, attended, last: null }] })),
    update: (id, { name, held, attended }) => patch(id, (x) => ({ ...x, name, held, attended, last: null, sample: false })),
    loadSample: () => setState((s) => ({ ...s, subjects: [...s.subjects.filter((x) => !x.sample), ...makeSample(newId)] })),
    clearSample: () => setState((s) => ({ ...s, subjects: s.subjects.filter((x) => !x.sample) })),
    remove: (id) => setState((s) => ({ ...s, subjects: s.subjects.filter((x) => x.id !== id) })),
    // Present: held+1, attended+1. Absent: held+1. Remember previous counts for one-level undo.
    mark: (id, present) =>
      patch(id, (x) => ({
        ...x,
        held: Math.min(x.held + 1, 999),
        attended: x.held >= 999 ? x.attended : x.attended + (present ? 1 : 0),
        last: { held: x.held, attended: x.attended, present },
      })),
    undo: (id) => patch(id, (x) => (x.last ? { ...x, held: x.last.held, attended: x.last.attended, last: null } : x)),
    setRequired: (required) => setState((s) => ({ ...s, required })),
    // Move the tour forward only (never back); `to` is the step just reached.
    advanceTour: (to) => setState((s) => (s.tour < to ? { ...s, tour: Math.min(to, TOUR_DONE) } : s)),
  };
}
