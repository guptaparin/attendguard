// Footer: how the number is calculated, privacy, and where the code lives.
export default function Footer({ required }) {
  return (
    <footer className="foot">
      <details className="howto">
        <summary>How is the number calculated?</summary>
        <div className="howto-body">
          <p>For <i>H</i> classes held, <i>A</i> attended and a minimum of <i>R</i>% (now {required}%):</p>
          <p className="formula"><span>Classes you can skip</span><code>⌊ (100·A − R·H) ÷ R ⌋</code></p>
          <p className="formula"><span>Classes to attend in a row</span><code>⌈ (R·H − 100·A) ÷ (100 − R) ⌉</code></p>
          <p>Example: 38 of 42 at 75% → ⌊(3800 − 3150) ÷ 75⌋ = <b>8</b>. Integer math only, so there are no rounding surprises. Every case up to 60 classes is checked by a test.</p>
          <p>It assumes every future class counts the same. Medical leave, duty leave or separate lab rules aren’t included, so treat the result as an estimate and confirm with your college portal.</p>
        </div>
      </details>
      <div className="foot-row">
        <span>Saved only on this device. No account, no server.</span>
        <span className="foot-links">
          <a href="https://github.com/guptaparin/attendguard" target="_blank" rel="noreferrer">Source on GitHub</a>
          <span aria-hidden="true">·</span>
          <span>Made by Parin Gupta at Thapar Institute, Patiala</span>
        </span>
      </div>
    </footer>
  );
}
