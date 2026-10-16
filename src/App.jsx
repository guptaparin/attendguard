import SubjectCard from './components/SubjectCard.jsx';
import SubjectForm from './components/SubjectForm.jsx';
import Summary from './components/Summary.jsx';
import useSubjects from './useSubjects.js';

export default function App() {
  const { subjects, required, add, update, remove, mark, undo } = useSubjects();

  return (
    <div className="app">
      <header className="top">
        <h1 className="brand">Attend<span>Guard</span></h1>
        <span className="req">Required: <strong>{required}%</strong></span>
      </header>

      <main>
        {subjects.length > 0 && <Summary subjects={subjects} required={required} />}
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
          <h2 className="add-title">Add a subject</h2>
          <SubjectForm onSubmit={add} />
        </section>
      </main>
    </div>
  );
}
