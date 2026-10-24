import { useState } from 'react';
import { verdict, describe } from '../attendance.js';
import SubjectForm from './SubjectForm.jsx';
import BunkCells from './BunkCells.jsx';

const CAPTION = {
  safe: 'classes you can bunk',
  edge: 'classes you can bunk',
  danger: 'to attend in a row',
  unreachable: 'target not reachable',
  empty: 'no classes marked yet',
};

export default function SubjectCard({ subject, required, onMark, onUndo, onUpdate, onRemove }) {
  const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'confirm'
  const v = verdict(subject.held, subject.attended, required);
  const d = describe(v);
  const pct = v.percent;

  return (
    <article className={`slip status-${v.status}`} data-testid="subject-card">
      <header className="slip-head">
        <div className="slip-title">
          <h3 className="slip-name">{subject.name}</h3>
          <p className="slip-meta">
            <span className="mono">{subject.attended}/{subject.held}</span> attended
            {pct !== null && <> · <span className="mono strong">{pct.toFixed(1)}%</span></>}
          </p>
        </div>
        {/* key re-mounts the stamp when the status changes, so it "stamps" again */}
        <span key={v.status} className="stamp">{d.label}</span>
      </header>

      <div className="verdict">
        <span key={`${v.status}-${d.headline}`} className="verdict-num" data-testid="verdict-num">{d.headline}</span>
        <span className="verdict-caption">{CAPTION[v.status]}</span>
      </div>
      <p className="verdict-line" data-testid="verdict-line" aria-live="polite">{d.line}</p>
      <BunkCells status={v.status} count={v.count} />

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
            <button className="btn btn-present" onClick={() => onMark(true)}>
              <span className="mark-letter" aria-hidden="true">P</span> Present
            </button>
            <button className="btn btn-absent" onClick={() => onMark(false)}>
              <span className="mark-letter" aria-hidden="true">A</span> Absent
            </button>
          </div>
          {mode === 'confirm' ? (
            <div className="confirm" role="group" aria-label="Confirm delete">
              <span>Delete {subject.name}?</span>
              <span className="spacer" />
              <button className="btn btn-quiet" onClick={() => setMode('view')}>Keep</button>
              <button className="btn btn-danger" onClick={onRemove}>Delete</button>
            </div>
          ) : (
            <div className="slip-tools">
              {subject.last && (
                <button className="link link-undo" onClick={onUndo}>
                  ↶ Undo {subject.last.present ? 'Present' : 'Absent'}
                </button>
              )}
              <span className="spacer" />
              {subject.sample && <span className="tag" title="Example data. Clear it from the banner above.">sample</span>}
              <button className="link" onClick={() => setMode('edit')}>Edit</button>
              <button className="link" onClick={() => setMode('confirm')}>Delete</button>
            </div>
          )}
        </>
      )}
    </article>
  );
}
