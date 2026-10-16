import Header from './components/Header.jsx';
import SubjectCard from './components/SubjectCard.jsx';
import SubjectForm from './components/SubjectForm.jsx';
import Summary from './components/Summary.jsx';
import useSubjects from './useSubjects.js';

export default function App() {
  const { subjects, required, storageOk, add, update, remove, mark, undo, setRequired } = useSubjects();
  const isEmpty = subjects.length === 0;

  return (
    <div className="app">
      <Header required={required} onChange={setRequired} />

      <main>
        {!storageOk && <p className="notice" role="status">Data won’t be saved in this browser — it’ll reset when you close the tab.</p>}

        {isEmpty ? (
          <section className="welcome">
            <h2>Can you skip tomorrow?</h2>
            <p>Add each subject with classes held and attended. AttendGuard tells you exactly how many you can skip — or must attend in a row — to stay above {required}%.</p>
          </section>
        ) : (
          <Summary subjects={subjects} required={required} />
        )}

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

        <section className="add">
          <h2 className="add-title">{isEmpty ? 'Add your first subject' : 'Add a subject'}</h2>
          <SubjectForm onSubmit={add} />
        </section>
      </main>

      <footer className="foot">Saved only on this device. No account, no server.</footer>
    </div>
  );
}
