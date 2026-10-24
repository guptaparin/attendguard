import { verdict } from '../attendance.js';

// "Semester status": counts plus one plain sentence naming what to do next.
export default function Summary({ subjects, required, className = '', testId = 'summary' }) {
  const rows = subjects.map((s) => ({ s, v: verdict(s.held, s.attended, required) }));
  const safe = rows.filter((r) => r.v.status === 'safe');
  const edge = rows.filter((r) => r.v.status === 'edge');
  const short = rows.filter((r) => r.v.status === 'danger' || r.v.status === 'unreachable');

  let advice;
  if (short.length) {
    const worst = short.slice().sort((a, b) => b.v.count - a.v.count)[0];
    advice = short.length === 1
      ? <>You’re short in <b>{worst.s.name}</b>. Don’t bunk it: attend the next {worst.v.count || 'all'} classes.</>
      : <>You’re short in {short.length} subjects. Start with <b>{worst.s.name}</b>, it needs the most classes.</>;
  } else if (edge.length) {
    advice = <><b>{edge[0].s.name}</b> is right on the line. Bunk anything else first.</>;
  } else if (safe.length) {
    const tightest = safe.slice().sort((a, b) => a.v.count - b.v.count)[0];
    advice = <>All clear. Your tightest subject is <b>{tightest.s.name}</b>, with {tightest.v.count} bunks left.</>;
  } else {
    advice = <>Mark a class to see where you stand.</>;
  }

  return (
    <section className={`summary ${className}`} aria-label="Semester status" data-testid={testId}>
      <h2 className="panel-title">Semester status</h2>
      <div className="tally">
        <div className="tally-cell safe"><b>{safe.length}</b><span>Safe</span></div>
        <div className="tally-cell edge"><b>{edge.length}</b><span>On the line</span></div>
        <div className="tally-cell short"><b>{short.length}</b><span>Short</span></div>
      </div>
      <p className="advice" data-testid={`${testId}-advice`}>{advice}</p>
    </section>
  );
}
