import { useState } from 'react';
import { verdict, describe } from '../attendance.js';
import SubjectForm from './SubjectForm.jsx';

const CAPTION = {
  safe: 'classes you can skip',
  edge: 'classes you can skip',
  danger: 'classes to attend in a row',
  unreachable: 'target not reachable',
  empty: '',
};

export default function SubjectCard({ subject, required, onMark, onUndo, onUpdate, onRemove }) {
  const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'confirm'
  const v = verdict(subject.held, subject.attended, required);
  const d = describe(v);
  const pct = v.percent;

  return (
    <article className={`card status-${v.status}`} data-testid="subject-card">
      <header className="card-head">
        <div>
          <h2 className="card-name">{subject.name}</h2>
          <p className="card-meta">
            {subject.attended}/{subject.held} attended{pct !== null && <> · <strong>{pct.toFixed(1)}%</strong></>}
          </p>
        </div>
        <span className="pill">{d.label}</span>
      </header>

      <div className="verdict">
        {/* key changes with the verdict, so the number re-mounts and plays its pop animation */}
        <span key={`${v.status}-${d.headline}`} className="verdict-num" data-testid="verdict-num">{d.headline}</span>
        <span className="verdict-caption">{CAPTION[v.status]}</span>
      </div>
      <p className="verdict-line" data-testid="verdict-line" aria-live="polite">{d.line}</p>

      {pct !== null && (
        <div className="gauge" role="img" aria-label={`${pct.toFixed(1)}% attended, requirement ${required}%`}>
          <div className="gauge-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
          <div className="gauge-line" style={{ left: `${required}%` }} />
        </div>
      )}

      {mode === 'edit' ? (
        <SubjectForm
          initial={subject}
          submitLabel="Save changes"
          autoFocus
          onSubmit={(next) => { onUpdate(next); setMode('view'); }}
          onCancel={() => setMode('view')}
        />
      ) : (
        <>
          <div className="mark">
            <button className="btn btn-present" onClick={() => onMark(true)}>✓ Present</button>
            <button className="btn btn-absent" onClick={() => onMark(false)}>✕ Absent</button>
          </div>
          {mode === 'confirm' ? (
            <div className="confirm" role="group" aria-label="Confirm delete">
              <span>Delete {subject.name}?</span>
              <span className="spacer" />
              <button className="btn btn-ghost" onClick={() => setMode('view')}>Keep</button>
              <button className="btn btn-danger" onClick={onRemove}>Delete</button>
            </div>
          ) : (
            <div className="card-tools">
              {subject.last && (
                <button className="link link-undo" onClick={onUndo}>
                  ↶ Undo {subject.last.present ? 'Present' : 'Absent'}
                </button>
              )}
              <span className="spacer" />
              <button className="link" onClick={() => setMode('edit')}>Edit</button>
              <button className="link" onClick={() => setMode('confirm')}>Delete</button>
            </div>
          )}
        </>
      )}
    </article>
  );
}
