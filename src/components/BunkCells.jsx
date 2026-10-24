// A row of register cells that makes the verdict countable at a glance:
// one cell per class you can still bunk (safe/edge), or per class you must attend (short).
const MAX = 24;

export default function BunkCells({ status, count }) {
  if (status === 'empty' || status === 'unreachable') return null;
  const shown = Math.min(count, MAX);
  const extra = count - shown;
  const kind = status === 'danger' ? 'must' : 'free';
  const label =
    status === 'danger'
      ? `${count} classes you must attend`
      : count === 0
        ? 'No bunks left'
        : `${count} bunks left`;

  return (
    <div className={`cells cells-${kind}`} role="img" aria-label={label}>
      {count === 0 ? (
        <span className="cell cell-none" />
      ) : (
        Array.from({ length: shown }, (_, i) => <span key={i} className="cell" />)
      )}
      {extra > 0 && <span className="cells-more">+{extra}</span>}
      <span className="cells-legend">{kind === 'must' ? 'must attend' : count === 0 ? 'no bunks left' : 'bunks left'}</span>
    </div>
  );
}
