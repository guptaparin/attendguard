import { useState } from 'react';
import SubjectCard from './components/SubjectCard.jsx';
import SubjectForm from './components/SubjectForm.jsx';

const newId = () => Math.random().toString(36).slice(2, 10);

export default function App() {
  const [subjects, setSubjects] = useState([]);
  const required = 75;

  return (
    <div className="app">
      <header className="top">
        <h1 className="brand">Attend<span>Guard</span></h1>
        <span className="req">Required: {required}%</span>
      </header>

      <main>
        {subjects.map((s) => <SubjectCard key={s.id} subject={s} required={required} />)}
        <section className="add">
          <h2 className="add-title">Add a subject</h2>
          <SubjectForm onSubmit={(s) => setSubjects((list) => [...list, { id: newId(), ...s }])} />
        </section>
      </main>
    </div>
  );
}
