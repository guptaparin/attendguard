import { verdict, describe } from '../attendance.js';

const CAPTION = {
  safe: 'classes you can skip',
  edge: 'classes you can skip',
  danger: 'classes to attend in a row',
  unreachable: 'target not reachable',
  empty: '',
};

export default function SubjectCard({ subject, required, children }) {
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
        <span className="verdict-num" data-testid="verdict-num">{d.headline}</span>
        <span className="verdict-caption">{CAPTION[v.status]}</span>
      </div>
      <p className="verdict-line" data-testid="verdict-line">{d.line}</p>

      {pct !== null && (
        <div className="gauge" role="img" aria-label={`${pct.toFixed(1)}% attended, requirement ${required}%`}>
          <div className="gauge-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
          <div className="gauge-line" style={{ left: `${required}%` }} />
        </div>
      )}
      {children}
    </article>
  );
}
