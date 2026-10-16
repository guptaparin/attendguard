import { useState } from 'react';

const newId = () => Math.random().toString(36).slice(2, 10);

// All app state lives here (spec.md > useSubjects).
export default function useSubjects() {
  const [state, setState] = useState({ required: 75, subjects: [] });

  const patch = (id, fn) =>
    setState((s) => ({ ...s, subjects: s.subjects.map((x) => (x.id === id ? fn(x) : x)) }));

  return {
    ...state,
    add: ({ name, held, attended }) =>
      setState((s) => ({ ...s, subjects: [...s.subjects, { id: newId(), name, held, attended, last: null }] })),
    update: (id, { name, held, attended }) => patch(id, (x) => ({ ...x, name, held, attended, last: null })),
    remove: (id) => setState((s) => ({ ...s, subjects: s.subjects.filter((x) => x.id !== id) })),
    // Present: held+1, attended+1. Absent: held+1. Remember previous counts for one-level undo.
    mark: (id, present) =>
      patch(id, (x) => ({
        ...x,
        held: x.held + 1,
        attended: x.attended + (present ? 1 : 0),
        last: { held: x.held, attended: x.attended, present },
      })),
    undo: (id) => patch(id, (x) => (x.last ? { ...x, held: x.last.held, attended: x.last.attended, last: null } : x)),
    setRequired: (required) => setState((s) => ({ ...s, required })),
  };
}
