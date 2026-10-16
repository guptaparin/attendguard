import { useState } from 'react';

// Validates per prd.md > States and Boundaries (invalid input).
export function validate({ name, held, attended }) {
  if (!name.trim()) return 'Give the subject a name.';
  const isWhole = (s) => /^\d+$/.test(String(s).trim());
  if (!isWhole(held) || !isWhole(attended)) return 'Classes must be whole numbers (0 or more).';
  if (Number(attended) > Number(held)) return 'Attended can’t be more than classes held.';
  return null;
}

export default function SubjectForm({ initial, submitLabel = 'Add subject', onSubmit, onCancel, autoFocus }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [held, setHeld] = useState(initial ? String(initial.held) : '');
  const [attended, setAttended] = useState(initial ? String(initial.attended) : '');
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const problem = validate({ name, held, attended });
    if (problem) return setError(problem);
    onSubmit({ name: name.trim(), held: Number(held), attended: Number(attended) });
    if (!initial) { setName(''); setHeld(''); setAttended(''); }
    setError(null);
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate aria-label={submitLabel}>
      <label className="field field-wide">
        <span>Subject</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Digital Electronics" autoFocus={autoFocus} maxLength={60} />
      </label>
      <label className="field">
        <span>Classes held</span>
        <input value={held} onChange={(e) => setHeld(e.target.value)} inputMode="numeric" placeholder="40" />
      </label>
      <label className="field">
        <span>Attended</span>
        <input value={attended} onChange={(e) => setAttended(e.target.value)} inputMode="numeric" placeholder="36" />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        {onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
}
