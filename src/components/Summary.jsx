import { verdict } from '../attendance.js';

export default function Summary({ subjects, required }) {
  const counts = { safe: 0, edge: 0, danger: 0 };
  for (const s of subjects) {
    const st = verdict(s.held, s.attended, required).status;
    if (st === 'safe') counts.safe++;
    else if (st === 'edge') counts.edge++;
    else if (st === 'danger' || st === 'unreachable') counts.danger++;
  }
  return (
    <section className="summary" aria-label="Summary" data-testid="summary">
      <div className="summary-cell safe"><b>{counts.safe}</b><span>Safe</span></div>
      <div className="summary-cell edge"><b>{counts.edge}</b><span>Edge</span></div>
      <div className="summary-cell danger"><b>{counts.danger}</b><span>Danger</span></div>
    </section>
  );
}
