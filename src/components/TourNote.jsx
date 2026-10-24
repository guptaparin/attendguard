// One step of the 3-step guided tour, shown right next to the control it talks about.
// Show, don't tell: the user learns by doing the action, not by reading a list first.
export default function TourNote({ step, children, onSkip }) {
  return (
    <div className="tour" role="note" aria-label={`Tour step ${step} of 3`} data-testid="tour">
      <div className="tour-top">
        <span className="tour-step">Step {step} of 3</span>
        <span className="tour-dots" aria-hidden="true">
          {[1, 2, 3].map((n) => <i key={n} className={n <= step ? 'on' : ''} />)}
        </span>
        <button className="link tour-skip" onClick={onSkip}>Skip tour</button>
      </div>
      <p className="tour-text">{children}</p>
    </div>
  );
}
