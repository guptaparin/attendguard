import { useRef, useState } from 'react';

export const MAX_CLASSES = 999;
const isWhole = (s) => /^\d{1,4}$/.test(String(s).trim());
export const normalizeName = (s) => String(s).trim().replace(/\s+/g, ' ');

// Validates per prd.md > States and Boundaries (invalid input).
// Returns { field, message } for the first problem, or null when the input is clean.
// `existingNames` are the other subjects' names, used to block duplicates.
export function validate({ name, held, attended }, existingNames = []) {
  const clean = normalizeName(name);
  if (!clean) return { field: 'name', message: 'Give the subject a name, as it appears on your timetable.' };
  if (!/[\p{L}\p{N}]/u.test(clean)) return { field: 'name', message: 'The subject name needs at least one letter or number.' };
  if (existingNames.some((n) => normalizeName(n).toLowerCase() === clean.toLowerCase()))
    return { field: 'name', message: `You already have “${clean}”. Edit that one instead.` };
  if (!isWhole(held)) return { field: 'held', message: 'Classes held must be a whole number, like 40.' };
  if (!isWhole(attended)) return { field: 'attended', message: 'Classes attended must be a whole number, like 36.' };
  if (Number(held) > MAX_CLASSES) return { field: 'held', message: `That’s more than ${MAX_CLASSES} classes. Check the number.` };
  if (Number(attended) > Number(held)) return { field: 'attended', message: 'Attended can’t be more than classes held.' };
  return null;
}

export default function SubjectForm({ initial, existingNames = [], submitLabel = 'Add subject', onSubmit, onCancel, autoFocus }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [held, setHeld] = useState(initial ? String(initial.held) : '');
  const [attended, setAttended] = useState(initial ? String(initial.attended) : '');
  const [error, setError] = useState(null);
  const refs = { name: useRef(null), held: useRef(null), attended: useRef(null) };
  const uid = useRef(Math.random().toString(36).slice(2, 8)).current;

  function handleSubmit(e) {
    e.preventDefault();
    const problem = validate({ name, held, attended }, existingNames);
    if (problem) {
      setError(problem);
      refs[problem.field].current?.focus();
      return;
    }
    onSubmit({ name: normalizeName(name), held: Number(held), attended: Number(attended) });
    if (!initial) { setName(''); setHeld(''); setAttended(''); }
    setError(null);
  }

  const bad = (f) => (error?.field === f ? { 'aria-invalid': true, 'aria-describedby': `err-${uid}` } : {});

  return (
    <form className="form" onSubmit={handleSubmit} noValidate aria-label={submitLabel}>
      <label className="field field-wide">
        <span>Subject name</span>
        <input ref={refs.name} id={`name-${uid}`} value={name} onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Digital Electronics" autoFocus={autoFocus} maxLength={60} autoComplete="off" {...bad('name')} />
      </label>
      <label className="field">
        <span>Classes held so far</span>
        <input ref={refs.held} id={`held-${uid}`} value={held} onChange={(e) => setHeld(e.target.value)}
          inputMode="numeric" placeholder="40" maxLength={4} autoComplete="off" {...bad('held')} />
      </label>
      <label className="field">
        <span>Classes attended</span>
        <input ref={refs.attended} id={`att-${uid}`} value={attended} onChange={(e) => setAttended(e.target.value)}
          inputMode="numeric" placeholder="36" maxLength={4} autoComplete="off" {...bad('attended')} />
      </label>
      {error && <p className="form-error" id={`err-${uid}`} role="alert">{error.message}</p>}
      {!initial && !error && <p className="form-hint">Copy both numbers from your college portal.</p>}
      <div className="form-actions">
        {onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
}
