import { useState } from 'react';

// Register cover band: name, one-line promise, and the editable minimum (prd.md > Required Percentage).
export default function Header({ required, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(required));

  function commit() {
    const n = Number(draft);
    if (/^\d+$/.test(draft.trim()) && n >= 1 && n <= 100) onChange(n);
    setEditing(false);
  }

  return (
    <header className="cover">
      <div className="cover-inner">
        <div className="brand-block">
          <h1 className="brand">
            <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="3" y="3" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <path d="M9 16.5l4.5 4.5L23 11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            AttendGuard
          </h1>
          <p className="brand-sub">Your attendance register, with the bunk math done.</p>
        </div>
        {editing ? (
          <label className="req req-editing">
            <span>Min. attendance</span>
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
            <span>%</span>
          </label>
        ) : (
          <button className="req" onClick={() => { setDraft(String(required)); setEditing(true); }} title="Change the required percentage">
            <span>Min. attendance</span> <strong>{required}%</strong> <span className="req-edit" aria-hidden="true">✎</span>
          </button>
        )}
      </div>
    </header>
  );
}
