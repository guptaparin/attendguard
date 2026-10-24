import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import SubjectCard from './components/SubjectCard.jsx';
import SubjectForm from './components/SubjectForm.jsx';
import Summary from './components/Summary.jsx';
import TourNote from './components/TourNote.jsx';
import useSubjects, { TOUR_DONE } from './useSubjects.js';
import { verdict } from './attendance.js';

export default function App() {
  const {
    subjects, required, storageOk, tour,
    add, update, remove, mark, undo, setRequired, loadSample, clearSample, advanceTour,
  } = useSubjects();
  const isEmpty = subjects.length === 0;
  const hasSample = subjects.some((s) => s.sample);
  const touring = hasSample && tour < TOUR_DONE;
  const skipTour = () => advanceTour(TOUR_DONE);

  // Step 1 sits on the first slip; step 2 sits on whichever slip was just marked.
  const first = subjects[0];
  const undoTarget = subjects.find((s) => s.last)?.id;
  const stepOneText = (() => {
    if (!first) return null;
    const now = verdict(first.held, first.attended, required);
    const next = verdict(first.held + 1, first.attended, required);
    const same = now.status === next.status && (now.status === 'safe' || now.status === 'edge');
    return same
      ? <>Missed a class? Press <b>Absent</b> and watch <b>{now.count}</b> become <b>{next.count}</b>.</>
      : <>Missed a class? Press <b>Absent</b> and watch the verdict update.</>;
  })();

  const handleMark = (id, present) => { mark(id, present); advanceTour(1); };
  const handleUndo = (id) => { undo(id); advanceTour(2); };
  const handleAdd = (s) => { add(s); advanceTour(TOUR_DONE); };
  const handleClear = () => { clearSample(); advanceTour(TOUR_DONE); };
  const namesExcept = (id) => subjects.filter((s) => s.id !== id).map((s) => s.name);

  return (
    <div className="page">
      <Header required={required} onChange={setRequired} />

      <div className="layout">
        <main className="register">
          <section className="intro">
            <h2 className="intro-title">Can you skip tomorrow?</h2>
            <p className="intro-line">
              Enter classes held and attended for each subject. AttendGuard tells you exactly how many you can skip, or how many you must attend in a row, to stay above {required}%.
            </p>
            <p className="intro-note">
              75% is the usual minimum in Indian colleges. If yours uses a different rule, change <b>Min. attendance</b> at the top.
            </p>
          </section>

          {!storageOk && <p className="notice" role="status">This browser won’t save your register. It resets when you close the tab.</p>}

          {hasSample && (
            <div className={`sample-banner${touring && tour === 2 ? ' is-tour' : ''}`} role="status">
              {touring && tour === 2 ? (
                <TourNote step={3} onSkip={skipTour}>
                  That’s all there is to it. <b>Clear the sample</b> and add your real subjects from your college portal.
                </TourNote>
              ) : (
                <span><b>This is a sample register.</b> Press Present or Absent to try it, then clear it and add your own subjects.</span>
              )}
              <span className="banner-actions">
                <a className="link" href="#add">Add my own ↓</a>
                <button className="btn btn-quiet" onClick={handleClear}>Clear sample</button>
              </span>
            </div>
          )}

          {/* On phones the summary comes before the detail; on desktop it lives in the side panel. */}
          {!isEmpty && <Summary subjects={subjects} required={required} className="only-narrow" testId="summary-narrow" />}

          {isEmpty ? (
            <div className="empty">
              <p>Your register is empty. Add your first subject, or load a sample to see how it works.</p>
              <button className="btn btn-quiet" onClick={loadSample}>Load sample register</button>
            </div>
          ) : (
            <div className="slips">
              {subjects.map((s, i) => (
                <SubjectCard
                  key={s.id}
                  subject={s}
                  required={required}
                  otherNames={namesExcept(s.id)}
                  tipMark={touring && tour === 0 && i === 0 ? <TourNote step={1} onSkip={skipTour}>{stepOneText}</TourNote> : null}
                  tipTools={touring && tour === 1 && s.id === undoTarget
                    ? <TourNote step={2} onSkip={skipTour}>Pressed it by mistake? <b>Undo</b> puts it back.</TourNote>
                    : null}
                  onMark={(present) => handleMark(s.id, present)}
                  onUndo={() => handleUndo(s.id)}
                  onUpdate={(next) => { update(s.id, next); }}
                  onRemove={() => remove(s.id)}
                />
              ))}
            </div>
          )}
        </main>

        <aside className="side">
          {!isEmpty && <Summary subjects={subjects} required={required} className="only-wide" />}
          <section className="add" id="add" aria-label="Add a subject">
            <h2 className="panel-title">{isEmpty ? 'Add your first subject' : 'Add a subject'}</h2>
            <SubjectForm onSubmit={handleAdd} existingNames={subjects.map((s) => s.name)} />
          </section>
        </aside>
      </div>

      <Footer required={required} />
    </div>
  );
}
