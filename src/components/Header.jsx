import { useState } from 'react';

// App name + editable requirement (prd.md > Required Percentage).
export default function Header({ required, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(required));

  function commit() {
    const n = Number(draft);
    if (/^\d+$/.test(draft.trim()) && n >= 1 && n <= 100) onChange(n);
    setEditing(false);
  }

  return (
    <header className="top">
      <h1 className="brand">Attend<span>Guard</span></h1>
      {editing ? (
        <label className="req">
          Required:
          <input
            className="req-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
            inputMode="numeric"
            aria-label="Required attendance percentage"
            autoFocus
          />
          %
        </label>
      ) : (
        <button className="req" onClick={() => { setDraft(String(required)); setEditing(true); }} title="Change the required percentage">
          Required: <strong>{required}%</strong> <span aria-hidden="true">✎</span>
        </button>
      )}
    </header>
  );
}
