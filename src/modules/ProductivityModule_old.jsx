import React, { useState, useEffect, useRef } from "react";

export default function ProductivityModule() {
  // Notes
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("mui_notes") || "[]"));
  const [noteTxt, setNoteTxt] = useState("");
  // Todos
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem("mui_todos") || "[]"));
  const [todoTxt, setTodoTxt] = useState("");
  // Reminders
  const [reminders, setReminders] = useState(() => JSON.parse(localStorage.getItem("mui_reminders") || "[]"));
  const [remTxt, setRemTxt] = useState("");
  const [remDate, setRemDate] = useState("");
  // Pomodoro
  const [pomo, setPomo] = useState(25 * 60);
  const [pomoActive, setPomoActive] = useState(false);
  const pomoRef = useRef();

  // Notes handlers
  useEffect(() => { localStorage.setItem("mui_notes", JSON.stringify(notes)); }, [notes]);
  const addNote = () => { if (!noteTxt.trim()) return; setNotes(n => [{ txt: noteTxt, t: new Date().toISOString(), id: Math.random().toString(36).slice(2, 9) }, ...n]); setNoteTxt(""); };
  const delNote = id => setNotes(n => n.filter(x => x.id !== id));

  // Todos handlers
  useEffect(() => { localStorage.setItem("mui_todos", JSON.stringify(todos)); }, [todos]);
  const addTodo = () => { if (!todoTxt.trim()) return; setTodos(t => [{ txt: todoTxt, done: false, id: Math.random().toString(36).slice(2, 9) }, ...t]); setTodoTxt(""); };
  const toggleTodo = id => setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const delTodo = id => setTodos(t => t.filter(x => x.id !== id));

  // Reminders handlers
  useEffect(() => { localStorage.setItem("mui_reminders", JSON.stringify(reminders)); }, [reminders]);
  const addRem = () => {
    if (!remTxt.trim() || !remDate) return;
    setReminders(r => [{ txt: remTxt, date: remDate, id: Math.random().toString(36).slice(2, 9) }, ...r]);
    setRemTxt(""); setRemDate("");
  };
  const delRem = id => setReminders(r => r.filter(x => x.id !== id));

  // Pomodoro timer
  useEffect(() => {
    if (!pomoActive) return;
    pomoRef.current = setInterval(() => {
      setPomo(p => {
        if (p <= 1) { clearInterval(pomoRef.current); setPomoActive(false); return 25 * 60; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(pomoRef.current);
  }, [pomoActive]);

  const startPomo = () => setPomoActive(true);
  const stopPomo = () => { setPomoActive(false); clearInterval(pomoRef.current); };
  const resetPomo = () => { setPomo(25 * 60); setPomoActive(false); clearInterval(pomoRef.current); };

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Simple Habit Tracker
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem("mui_habits") || "[]"));
  useEffect(() => { localStorage.setItem("mui_habits", JSON.stringify(habits)); }, [habits]);
  const addHabit = () => { if (!habit.trim()) return; setHabits(hs => [{ txt: habit, done: false, id: Math.random().toString(36).slice(2, 9) }, ...hs]); setHabit(""); };
  const toggleHabit = id => setHabits(hs => hs.map(h => h.id === id ? { ...h, done: !h.done } : h));
  const delHabit = id => setHabits(hs => hs.filter(h => h.id !== id));

  // Simple Daily Journal
  const [journal, setJournal] = useState("");
  const [journalList, setJournalList] = useState(() => JSON.parse(localStorage.getItem("mui_journal") || "[]"));
  useEffect(() => { localStorage.setItem("mui_journal", JSON.stringify(journalList)); }, [journalList]);
  const addJournal = () => { if (!journal.trim()) return; setJournalList(jl => [{ txt: journal, t: new Date().toISOString(), id: Math.random().toString(36).slice(2, 9) }, ...jl]); setJournal(""); };
  const delJournal = id => setJournalList(jl => jl.filter(j => j.id !== id));

  return (
    <div>
      <h5 className="mb-3">📝 Productivity Tools</h5>
      {/* Notes */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="h6 mb-2">🗒️ Notes</div>
          <div className="d-flex gap-2 mb-2">
            <input className="form-control" value={noteTxt} onChange={e=>setNoteTxt(e.target.value)} placeholder="Write a note..." />
            <button className="btn btn-primary btn-sm" onClick={addNote}>Add</button>
          </div>
          <div style={{ maxHeight: 120, overflow: "auto" }}>
            {notes.map(n => (
              <div key={n.id} className="d-flex align-items-center justify-content-between p-2 bg-light rounded mb-2">
                <div>
                  <div className="small">{n.txt}</div>
                  <div className="text-muted tiny">{new Date(n.t).toLocaleString()}</div>
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={()=>delNote(n.id)}>Delete</button>
              </div>
            ))}
            {notes.length === 0 && <div className="text-muted small">No notes yet.</div>}
          </div>
        </div>
      </div>
      {/* Todos */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="h6 mb-2">✅ To-Do List</div>
          <div className="d-flex gap-2 mb-2">
            <input className="form-control" value={todoTxt} onChange={e=>setTodoTxt(e.target.value)} placeholder="Add a task..." />
            <button className="btn btn-primary btn-sm" onClick={addTodo}>Add</button>
          </div>
          <div style={{ maxHeight: 120, overflow: "auto" }}>
            {todos.map(td => (
              <div key={td.id} className="d-flex align-items-center gap-2 p-2 bg-light rounded mb-2">
                <input type="checkbox" checked={td.done} onChange={()=>toggleTodo(td.id)} />
                <div className={td.done ? "text-decoration-line-through text-muted" : ""}>{td.txt}</div>
                <button className="btn btn-sm btn-outline-secondary ms-auto" onClick={()=>delTodo(td.id)}>Delete</button>
              </div>
            ))}
            {todos.length === 0 && <div className="text-muted small">No tasks yet.</div>}
          </div>
        </div>
      </div>
      {/* Reminders */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="h6 mb-2">⏰ Reminders</div>
          <div className="row g-2 mb-2">
            <div className="col"><input className="form-control" value={remTxt} onChange={e=>setRemTxt(e.target.value)} placeholder="Reminder..." /></div>
            <div className="col"><input className="form-control" type="datetime-local" value={remDate} onChange={e=>setRemDate(e.target.value)} /></div>
            <div className="col-auto"><button className="btn btn-primary btn-sm" onClick={addRem}>Add</button></div>
          </div>
          <div style={{ maxHeight: 120, overflow: "auto" }}>
            {reminders.map(r => (
              <div key={r.id} className="d-flex align-items-center justify-content-between p-2 bg-light rounded mb-2">
                <div>
                  <div className="small">{r.txt}</div>
                  <div className="text-muted tiny">{new Date(r.date).toLocaleString()}</div>
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={()=>delRem(r.id)}>Delete</button>
              </div>
            ))}
            {reminders.length === 0 && <div className="text-muted small">No reminders yet.</div>}
          </div>
        </div>
      </div>
      {/* Pomodoro Timer */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="h6 mb-2">🍅 Pomodoro Timer</div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="display-6">{formatTime(pomo)}</span>
            <button className="btn btn-success btn-sm" onClick={startPomo} disabled={pomoActive}>Start</button>
            <button className="btn btn-warning btn-sm" onClick={stopPomo} disabled={!pomoActive}>Pause</button>
            <button className="btn btn-secondary btn-sm" onClick={resetPomo}>Reset</button>
          </div>
          <div className="small text-muted">25 min focus, 5 min break. Stay productive!</div>
        </div>
      </div>
      {/* Habit Tracker */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="h6 mb-2">📈 Habit Tracker</div>
          <div className="d-flex gap-2 mb-2">
            <input className="form-control" value={habit} onChange={e=>setHabit(e.target.value)} placeholder="Add a habit..." />
            <button className="btn btn-primary btn-sm" onClick={addHabit}>Add</button>
          </div>
          <div style={{ maxHeight: 120, overflow: "auto" }}>
            {habits.map(h => (
              <div key={h.id} className="d-flex align-items-center gap-2 p-2 bg-light rounded mb-2">
                <input type="checkbox" checked={h.done} onChange={()=>toggleHabit(h.id)} />
                <div className={h.done ? "text-decoration-line-through text-muted" : ""}>{h.txt}</div>
                <button className="btn btn-sm btn-outline-secondary ms-auto" onClick={()=>delHabit(h.id)}>Delete</button>
              </div>
            ))}
            {habits.length === 0 && <div className="text-muted small">No habits yet.</div>}
          </div>
        </div>
      </div>
      {/* Daily Journal */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="h6 mb-2">📔 Daily Journal</div>
          <div className="d-flex gap-2 mb-2">
            <input className="form-control" value={journal} onChange={e=>setJournal(e.target.value)} placeholder="Write today's journal..." />
            <button className="btn btn-primary btn-sm" onClick={addJournal}>Add</button>
          </div>
          <div style={{ maxHeight: 120, overflow: "auto" }}>
            {journalList.map(j => (
              <div key={j.id} className="d-flex align-items-center justify-content-between p-2 bg-light rounded mb-2">
                <div>
                  <div className="small">{j.txt}</div>
                  <div className="text-muted tiny">{new Date(j.t).toLocaleString()}</div>
                </div>
                <button className="btn btn-sm btn-outline-secondary" onClick={()=>delJournal(j.id)}>Delete</button>
              </div>
            ))}
            {journalList.length === 0 && <div className="text-muted small">No journal entries yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
