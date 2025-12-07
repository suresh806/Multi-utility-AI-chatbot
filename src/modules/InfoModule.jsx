/* eslint-disable unicode-bom */
import React, { useEffect, useState } from "react";

export default function InfoModule({ darkMode = false }) {
  const [profileName, setProfileName] = useState(localStorage.getItem('info_profile_name') || 'User');
  const [profileEmail, setProfileEmail] = useState(localStorage.getItem('info_profile_email') || 'user@example.com');
  const [joinDate] = useState(localStorage.getItem('info_join_date') || new Date().toLocaleDateString());
  const [stats, setStats] = useState({ launches: 0, tasks: 0, notes: 0, messages: 0 });
  const [editMode, setEditMode] = useState(false);
  const [tempName, setTempName] = useState(profileName);
  const [tempEmail, setTempEmail] = useState(profileEmail);

  useEffect(() => {
    const key = 'mui_launch_count';
    let count = Number(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, count);

    try {
      const todos = JSON.parse(localStorage.getItem('mui_todos') || '[]').length;
      const notes = JSON.parse(localStorage.getItem('mui_notes') || '[]').length;
      const users = JSON.parse(localStorage.getItem('mui_users') || '[]');
      let msgs = 0;
      for (const u of users) {
        msgs += JSON.parse(localStorage.getItem('mui_chats_' + u.username) || '[]').length;
      }
      setStats({ launches: count, tasks: todos, notes: notes, messages: msgs });
    } catch (e) {
      setStats({ launches: 0, tasks: 0, notes: 0, messages: 0 });
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem('info_profile_name', tempName);
    localStorage.setItem('info_profile_email', tempEmail);
    setProfileName(tempName);
    setProfileEmail(tempEmail);
    setEditMode(false);
  };

  return (
    <div style={{ background: darkMode ? 'linear-gradient(135deg, #0f172015 0%, #151a3315 100%)' : 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', borderRadius: '12px', padding: '2rem', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <h3 style={{ fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: darkMode ? '#e8f0ff' : '#333' }}>👤 User Profile</h3>
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '4rem' }}>👤</div>
        </div>

        {!editMode ? (
          <div>
            <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: `1px solid ${darkMode ? '#1f2d42' : '#eee'}` }}>
              <label style={{ fontSize: '0.85rem', color: darkMode ? '#a8afc7' : '#666', fontWeight: '600' }}>Name</label>
              <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: darkMode ? '#e8f0ff' : '#333', margin: '0.5rem 0 0 0' }}>{profileName}</p>
            </div>
            <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
              <label style={{ fontSize: '0.85rem', color: darkMode ? '#a8afc7' : '#666', fontWeight: '600' }}>Email</label>
              <p style={{ fontSize: '1rem', color: darkMode ? '#a8afc7' : '#555', margin: '0.5rem 0 0 0' }}>{profileEmail}</p>
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.85rem', color: darkMode ? '#a8afc7' : '#666', fontWeight: '600' }}>Member Since</label>
              <p style={{ fontSize: '1rem', color: '#555', margin: '0.5rem 0 0 0' }}>{joinDate}</p>
            </div>
            <button onClick={() => { setEditMode(true); setTempName(profileName); setTempEmail(profileEmail); }} style={{ width: '100%', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}>Edit Profile</button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Name</label>
              <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Email</label>
              <input type="email" value={tempEmail} onChange={e => setTempEmail(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button onClick={saveProfile} style={{ background: '#4caf50', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}>Save</button>
              <button onClick={() => { setEditMode(false); setTempName(profileName); setTempEmail(profileEmail); }} style={{ background: '#f44336', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #eee' }}>
          <h5 style={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>📊 Quick Stats</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#f0f4ff', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea', margin: '0 0 0.5rem 0' }}>{stats.launches}</p>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>App Launches</p>
            </div>
            <div style={{ background: '#e5f5ff', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4facfe', margin: '0 0 0.5rem 0' }}>{stats.tasks}</p>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>Tasks</p>
            </div>
            <div style={{ background: '#fff8e5', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fee140', margin: '0 0 0.5rem 0' }}>{stats.notes}</p>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>Notes</p>
            </div>
            <div style={{ background: '#ffe5e5', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fa709a', margin: '0 0 0.5rem 0' }}>{stats.messages}</p>
              <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>Messages</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid #eee', textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>ℹ️ Welcome to your profile dashboard. Edit your information anytime by clicking the Edit Profile button.</p>
        </div>
      </div>
    </div>
  );
}
