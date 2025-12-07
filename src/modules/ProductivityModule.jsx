import React, { useState, useEffect, useRef } from 'react';

export default function ProductivityModule({ darkMode = false }) {
  const [activeTab, setActiveTab] = useState('todos');
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('prod_todos') || '[]'));
  const [todoTxt, setTodoTxt] = useState('');
  const [todoPriority, setTodoPriority] = useState('normal');

  const addTodo = () => {
    if (!todoTxt.trim()) return;
    const newTodo = { id: Date.now(), txt: todoTxt, done: false, priority: todoPriority, createdAt: new Date().toLocaleDateString() };
    setTodos(t => [newTodo, ...t]);
    setTodoTxt('');
    setTodoPriority('normal');
  };

  const toggleTodo = (id) => setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const delTodo = (id) => setTodos(t => t.filter(x => x.id !== id));

  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem('prod_goals') || '[]'));
  const [goalTxt, setGoalTxt] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');

  const addGoal = () => {
    if (!goalTxt.trim()) return;
    const newGoal = { id: Date.now(), txt: goalTxt, progress: 0, deadline: goalDeadline, createdAt: new Date().toLocaleDateString() };
    setGoals(g => [newGoal, ...g]);
    setGoalTxt('');
    setGoalDeadline('');
  };

  const updateGoalProgress = (id, progress) => {
    setGoals(g => g.map(x => x.id === id ? { ...x, progress: Math.min(100, Math.max(0, progress)) } : x));
  };

  const delGoal = (id) => setGoals(g => g.filter(x => x.id !== id));

  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem('prod_habits') || '[]'));
  const [habitTxt, setHabitTxt] = useState('');
  const [habitFreq, setHabitFreq] = useState('daily');

  const addHabit = () => {
    if (!habitTxt.trim()) return;
    const newHabit = { id: Date.now(), txt: habitTxt, freq: habitFreq, streak: 0, completed: [], createdAt: new Date().toLocaleDateString() };
    setHabits(h => [newHabit, ...h]);
    setHabitTxt('');
    setHabitFreq('daily');
  };

  const completeHabit = (id) => {
    setHabits(h => h.map(x => x.id === id ? { ...x, streak: x.streak + 1, completed: [...x.completed, new Date().toLocaleDateString()] } : x));
  };

  const delHabit = (id) => setHabits(h => h.filter(x => x.id !== id));

  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('prod_notes') || '[]'));
  const [noteTxt, setNoteTxt] = useState('');

  const addNote = () => {
    if (!noteTxt.trim()) return;
    const newNote = { id: Date.now(), txt: noteTxt, createdAt: new Date().toLocaleString() };
    setNotes(n => [newNote, ...n]);
    setNoteTxt('');
  };

  const delNote = (id) => setNotes(n => n.filter(x => x.id !== id));

  const [pomo, setPomo] = useState(25 * 60);
  const [pomoActive, setPomoActive] = useState(false);
  const pomoRef = useRef();

  useEffect(() => {
    if (!pomoActive) return;
    pomoRef.current = setInterval(() => {
      setPomo(p => {
        if (p <= 1) { clearInterval(pomoRef.current); setPomoActive(false); alert('Pomodoro finished!'); return 25 * 60; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(pomoRef.current);
  }, [pomoActive]);

  const formatTime = (s) => {
    const mins = String(Math.floor(s / 60)).padStart(2, '0');
    const secs = String(s % 60).padStart(2, '0');
    return mins + ':' + secs;
  };

  const [timeTracking, setTimeTracking] = useState(() => JSON.parse(localStorage.getItem('prod_timetrack') || '[]'));
  const [trackName, setTrackName] = useState('');
  const [trackTime, setTrackTime] = useState(0);
  const trackRef = useRef();

  const startTracking = () => {
    if (!trackName.trim()) return;
    trackRef.current = setInterval(() => {
      setTrackTime(t => t + 1);
    }, 1000);
  };

  const stopTracking = () => {
    clearInterval(trackRef.current);
    if (trackTime > 0 && trackName.trim()) {
      const newTrack = { id: Date.now(), name: trackName, duration: trackTime, date: new Date().toLocaleDateString() };
      setTimeTracking(t => [newTrack, ...t]);
      setTrackName('');
      setTrackTime(0);
    }
  };

  useEffect(() => { localStorage.setItem('prod_todos', JSON.stringify(todos)); }, [todos]);
  useEffect(() => { localStorage.setItem('prod_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('prod_habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('prod_notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('prod_timetrack', JSON.stringify(timeTracking)); }, [timeTracking]);

  const completedTodos = todos.filter(t => t.done).length;
  const todoProgress = todos.length > 0 ? (completedTodos / todos.length * 100) : 0;
  const totalHabitStreak = habits.reduce((sum, h) => sum + h.streak, 0);

  return (
    <div style={{ background: darkMode ? 'linear-gradient(135deg, #0f172015 0%, #151a3315 100%)' : 'linear-gradient(135deg, #fa709a15 0%, #fee14015 100%)', borderRadius: '12px', padding: 'clamp(0.75rem, 2vw, 1rem)', height: '100%', overflowY: 'auto' }}>
      <div className="mb-4"><h3 className="fw-bold mb-1" style={{ color: darkMode ? '#e8f0ff' : '#333', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}>Productivity & Time Management</h3><p className="text-muted small" style={{ color: darkMode ? '#a8afc7' : '#666', fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)' }}>Manage tasks, track time, build habits, and achieve goals</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(100px, 22vw, 150px), 1fr))', gap: 'clamp(0.75rem, 2vw, 1rem)', marginBottom: '1.5rem' }}>
        <div style={{ background: darkMode ? '#1f2d42' : 'white', padding: 'clamp(0.75rem, 1.5vw, 1rem)', borderRadius: '12px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${darkMode ? '#2a3f5f' : '#f0f0f0'}` }}><div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 'bold', color: '#fa709a' }}>{completedTodos}/{todos.length}</div><div style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', color: darkMode ? '#a8afc7' : '#666', marginTop: '0.3rem' }}>Tasks Done</div></div>
        <div style={{ background: darkMode ? '#1f2d42' : 'white', padding: 'clamp(0.75rem, 1.5vw, 1rem)', borderRadius: '12px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${darkMode ? '#2a3f5f' : '#f0f0f0'}` }}><div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 'bold', color: '#fee140' }}>{goals.length}</div><div style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', color: darkMode ? '#a8afc7' : '#666', marginTop: '0.3rem' }}>Active Goals</div></div>
        <div style={{ background: darkMode ? '#1f2d42' : 'white', padding: 'clamp(0.75rem, 1.5vw, 1rem)', borderRadius: '12px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${darkMode ? '#2a3f5f' : '#f0f0f0'}` }}><div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 'bold', color: '#30cfd0' }}>{habits.length}</div><div style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', color: darkMode ? '#a8afc7' : '#666', marginTop: '0.3rem' }}>Habits</div></div>
        <div style={{ background: darkMode ? '#1f2d42' : 'white', padding: 'clamp(0.75rem, 1.5vw, 1rem)', borderRadius: '12px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${darkMode ? '#2a3f5f' : '#f0f0f0'}` }}><div style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 'bold', color: '#f59e0b' }}>{totalHabitStreak}</div><div style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', color: darkMode ? '#a8afc7' : '#666', marginTop: '0.3rem' }}>Total Streak</div></div>
      </div>
      <div className="d-flex gap-2 mb-4" style={{ borderBottom: `2px solid ${darkMode ? '#1f2d42' : '#e5e7eb'}`, paddingBottom: '1rem', flexWrap: 'wrap' }}>
        {['todos', 'goals', 'habits', 'notes', 'timetrack', 'pomodoro'].map(tab => (<button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? 'linear-gradient(135deg, #fa709a, #fee140)' : 'transparent', color: activeTab === tab ? 'white' : (darkMode ? '#a8afc7' : '#666'), border: activeTab === tab ? 'none' : `1px solid ${darkMode ? '#2a3f5f' : '#ddd'}`, padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: activeTab === tab ? '600' : '500', whiteSpace: 'nowrap', transition: 'all 0.3s ease' }}>{tab === 'todos' && 'Todos'}{tab === 'goals' && 'Goals'}{tab === 'habits' && 'Habits'}{tab === 'notes' && 'Notes'}{tab === 'timetrack' && 'Time'}{tab === 'pomodoro' && 'Pomodoro'}</button>))}
      </div>
      {activeTab === 'todos' && (<div><div style={{ marginBottom: '1.5rem' }}><div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}><input type="text" placeholder="Add a task..." value={todoTxt} onChange={(e) => setTodoTxt(e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, outline: 'none', fontSize: '0.9rem', background: darkMode ? '#0a0e27' : '#ffffff', color: darkMode ? '#e8f0ff' : '#000' }} /><select value={todoPriority} onChange={(e) => setTodoPriority(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, outline: 'none', fontSize: '0.9rem', background: darkMode ? '#0a0e27' : '#ffffff', color: darkMode ? '#e8f0ff' : '#000' }}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select><button onClick={addTodo} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #fa709a, #fee140)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}>Add</button></div><div style={{ width: '100%', height: '6px', background: darkMode ? '#1f2d42' : '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: todoProgress + '%', height: '100%', background: 'linear-gradient(90deg, #fa709a, #fee140)', transition: 'width 0.3s' }} /></div><div style={{ fontSize: '0.85rem', color: darkMode ? '#a8afc7' : '#666', marginTop: '0.5rem' }}>{completedTodos}/{todos.length} completed</div></div>{todos.length === 0 ? (<div style={{ textAlign: 'center', padding: '2rem', color: darkMode ? '#6b7280' : '#999' }}><p>No tasks yet</p></div>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>{todos.map(todo => (<div key={todo.id} style={{ background: darkMode ? '#1f2d42' : 'white', padding: '1rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)', border: todo.done ? '2px solid #10b981' : `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><h6 style={{ fontWeight: 'bold', margin: 0, color: darkMode ? '#e8f0ff' : '#333', textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.txt}</h6><span style={{ background: todo.priority === 'high' ? '#fee2e2' : todo.priority === 'normal' ? '#fef3c7' : '#dbeafe', color: todo.priority === 'high' ? '#dc2626' : todo.priority === 'normal' ? '#d97706' : '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '0.3rem', display: 'inline-block' }}>{todo.priority.toUpperCase()}</span></div><div style={{ display: 'flex', gap: '0.5rem' }}><button onClick={() => toggleTodo(todo.id)} style={{ padding: '0.4rem 0.8rem', background: todo.done ? '#10b981' : darkMode ? '#2a3f5f' : '#f3f4f6', color: todo.done ? 'white' : darkMode ? '#a8afc7' : '#666', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>{todo.done ? 'Done' : 'Mark'}</button><button onClick={() => delTodo(todo.id)} style={{ padding: '0.4rem 0.8rem', background: '#ffe5e5', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#ef4444', fontSize: '0.85rem' }}>Delete</button></div></div>))}</div>)}</div>)}
      {activeTab === 'goals' && (<div><div style={{ marginBottom: '1.5rem' }}><div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}><input type="text" placeholder="Goal name..." value={goalTxt} onChange={(e) => setGoalTxt(e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, outline: 'none', fontSize: '0.9rem', minWidth: '150px', background: darkMode ? '#0a0e27' : '#ffffff', color: darkMode ? '#e8f0ff' : '#000' }} /><input type="date" value={goalDeadline} onChange={(e) => setGoalDeadline(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, outline: 'none', fontSize: '0.9rem', background: darkMode ? '#0a0e27' : '#ffffff', color: darkMode ? '#e8f0ff' : '#000' }} /><button onClick={addGoal} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #fa709a, #fee140)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}>Add</button></div></div>{goals.length === 0 ? (<div style={{ textAlign: 'center', padding: '2rem', color: darkMode ? '#6b7280' : '#999' }}><p>No goals yet</p></div>) : (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>{goals.map(goal => (<div key={goal.id} style={{ background: darkMode ? '#1f2d42' : 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}` }}><h6 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: darkMode ? '#e8f0ff' : '#333' }}>{goal.txt}</h6>{goal.deadline && <div style={{ fontSize: '0.85rem', color: darkMode ? '#a8afc7' : '#666', marginBottom: '1rem' }}>Deadline: {goal.deadline}</div>}<div style={{ marginBottom: '1rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.8rem', color: darkMode ? '#a8afc7' : '#666' }}><span>Progress</span><span style={{ fontWeight: 'bold', color: '#fa709a' }}>{goal.progress}%</span></div><input type="range" min="0" max="100" value={goal.progress} onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} /></div><button onClick={() => delGoal(goal.id)} style={{ width: '100%', padding: '0.6rem', background: '#ffe5e5', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', fontSize: '0.85rem', fontWeight: '600' }}>Delete</button></div>))}</div>)}</div>)}
      {activeTab === 'habits' && (<div><div style={{ marginBottom: '1.5rem' }}><div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}><input type="text" placeholder="Habit name..." value={habitTxt} onChange={(e) => setHabitTxt(e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, outline: 'none', fontSize: '0.9rem', background: darkMode ? '#0a0e27' : '#ffffff', color: darkMode ? '#e8f0ff' : '#000' }} /><select value={habitFreq} onChange={(e) => setHabitFreq(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, outline: 'none', fontSize: '0.9rem', background: darkMode ? '#0a0e27' : '#ffffff', color: darkMode ? '#e8f0ff' : '#000' }}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select><button onClick={addHabit} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #fa709a, #fee140)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}>Add</button></div></div>{habits.length === 0 ? (<div style={{ textAlign: 'center', padding: '2rem', color: darkMode ? '#6b7280' : '#999' }}><p>No habits yet</p></div>) : (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>{habits.map(habit => (<div key={habit.id} style={{ background: darkMode ? '#1f2d42' : 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}` }}><h6 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: darkMode ? '#e8f0ff' : '#333' }}>{habit.txt}</h6><div style={{ fontSize: '0.85rem', color: darkMode ? '#a8afc7' : '#666', marginBottom: '1rem' }}><span style={{ background: darkMode ? '#0a0e27' : '#f3f4f6', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', color: darkMode ? '#a8afc7' : '#666' }}>{habit.freq}</span><span style={{ marginLeft: '0.5rem', fontWeight: 'bold', color: '#fa709a' }}>Streak: {habit.streak}</span></div><div style={{ display: 'flex', gap: '0.5rem' }}><button onClick={() => completeHabit(habit.id)} style={{ flex: 1, padding: '0.6rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Done</button><button onClick={() => delHabit(habit.id)} style={{ padding: '0.6rem', background: '#ffe5e5', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', fontSize: '0.85rem' }}>Delete</button></div></div>))}</div>)}</div>)}
      {activeTab === 'notes' && (<div><div style={{ marginBottom: '1.5rem' }}><textarea placeholder="Write notes..." value={noteTxt} onChange={(e) => setNoteTxt(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit', minHeight: '100px', resize: 'vertical', marginBottom: '1rem', background: darkMode ? '#0a0e27' : '#ffffff', color: darkMode ? '#e8f0ff' : '#000' }} /><button onClick={addNote} style={{ padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #fa709a, #fee140)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save Note</button></div>{notes.length === 0 ? (<div style={{ textAlign: 'center', padding: '2rem', color: darkMode ? '#6b7280' : '#999' }}><p>No notes yet</p></div>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{notes.map(note => (<div key={note.id} style={{ background: darkMode ? '#1f2d42' : 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}` }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}><span style={{ fontSize: '0.85rem', color: darkMode ? '#6b7280' : '#999' }}>{note.createdAt}</span><button onClick={() => delNote(note.id)} style={{ padding: '0.4rem 0.8rem', background: '#ffe5e5', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#ef4444', fontSize: '0.85rem' }}>Delete</button></div><p style={{ color: darkMode ? '#e8f0ff' : '#333', fontSize: '0.95rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{note.txt}</p></div>))}</div>)}</div>)}
      {activeTab === 'timetrack' && (<div><div style={{ marginBottom: '1.5rem', background: darkMode ? '#1f2d42' : 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)' }}><div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}><input type="text" placeholder="Activity name..." value={trackName} onChange={(e) => setTrackName(e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, outline: 'none', fontSize: '0.9rem', background: darkMode ? '#0a0e27' : '#ffffff', color: darkMode ? '#e8f0ff' : '#000' }} /></div><div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fa709a', marginBottom: '1rem', textAlign: 'center' }}>{formatTime(trackTime)}</div><div style={{ display: 'flex', gap: '0.5rem' }}><button onClick={startTracking} disabled={trackTime > 0} style={{ flex: 1, padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', opacity: trackTime > 0 ? 0.5 : 1 }}>Start</button><button onClick={stopTracking} disabled={trackTime === 0} style={{ flex: 1, padding: '0.75rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', opacity: trackTime === 0 ? 0.5 : 1 }}>Stop</button></div></div>{timeTracking.length === 0 ? (<div style={{ textAlign: 'center', padding: '2rem', color: darkMode ? '#6b7280' : '#999' }}><p>No time tracked yet</p></div>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{timeTracking.map(track => (<div key={track.id} style={{ background: darkMode ? '#1f2d42' : 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${darkMode ? '#2a3f5f' : '#e5e7eb'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><h6 style={{ fontWeight: 'bold', margin: 0, color: darkMode ? '#e8f0ff' : '#333' }}>{track.name}</h6><div style={{ fontSize: '0.85rem', color: darkMode ? '#a8afc7' : '#666', marginTop: '0.5rem' }}>{formatTime(track.duration)} on {track.date}</div></div></div>))}</div>)}</div>)}
      {activeTab === 'pomodoro' && (<div style={{ textAlign: 'center', padding: '2rem', background: darkMode ? '#1f2d42' : 'white', borderRadius: '12px', boxShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)' }}><h5 style={{ color: '#fa709a', marginBottom: '1rem' }}>Pomodoro Timer</h5><div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#fa709a', marginBottom: '2rem', fontFamily: 'monospace' }}>{formatTime(pomo)}</div><div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}><button onClick={() => setPomoActive(true)} disabled={pomoActive} style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', opacity: pomoActive ? 0.5 : 1 }}>Start</button><button onClick={() => setPomoActive(false)} style={{ padding: '0.75rem 1.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Pause</button><button onClick={() => { setPomo(25 * 60); setPomoActive(false); }} style={{ padding: '0.75rem 1.5rem', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Reset</button></div><p style={{ color: darkMode ? '#6b7280' : '#999', marginTop: '1.5rem', fontSize: '0.9rem' }}>25 minutes of focused work</p></div>)}
    </div>
  );
}