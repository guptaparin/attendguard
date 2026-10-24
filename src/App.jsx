import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import SubjectCard from './components/SubjectCard.jsx';
import SubjectForm from './components/SubjectForm.jsx';
import Summary from './components/Summary.jsx';
import useSubjects from './useSubjects.js';

export default function App() {
  const { subjects, required, storageOk, add, update, remove, mark, undo, setRequired, loadSample, clearSample } = useSubjects();
  const isEmpty = subjects.length === 0;
  const hasSample = subjects.some((s) => s.sample);

  return (
    <div className="page">
      <Header required={required} onChange={setRequired} />

      <div className="layout">
        <main className="register">
          <section className="intro">
            <h2 className="intro-title">Can you skip tomorrow?</h2>
            <p className="intro-line">
              Enter classes held and attended for each subject. AttendGuard tells you exactly how many you can bunk, or how many you must attend in a row, to stay above {required}%.
            </p>
          </section>

          {!storageOk && <p className="notice" role="status">This browser won’t save your register. It resets when you close the tab.</p>}

          {hasSample && (
            <div className="sample-banner" role="status">
              <span><b>This is a sample register.</b> Tap Present or Absent to try it, then clear it and add your own subjects.</span>
              <span className="banner-actions">
                <a className="link" href="#add">Add my own ↓</a>
                <button className="btn btn-quiet" onClick={clearSample}>Clear sample</button>
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
              {subjects.map((s) => (
                <SubjectCard
                  key={s.id}
                  subject={s}
                  required={required}
                  onMark={(present) => mark(s.id, present)}
                  onUndo={() => undo(s.id)}
                  onUpdate={(next) => update(s.id, next)}
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
            <SubjectForm onSubmit={add} />
          </section>
        </aside>
      </div>

      <Footer required={required} />
    </div>
  );
}
