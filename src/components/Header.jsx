import React from 'react';
import { Bot, Sun, Moon, LogIn, LogOut, Menu } from 'lucide-react';

export default function Header({ darkMode, setDarkMode, currentUser, handleLogout, handleLogin, sidebarOpen, setSidebarOpen }) {
  return (
    <div className="top-bar p-3 border-bottom backdrop-blur" style={{ 
      background: darkMode ? 'rgba(22, 31, 46, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ gap: '0.5rem' }}>
        <div className="d-flex align-items-center gap-2 gap-md-3 flex-wrap" style={{ minWidth: 0, flex: '1 1 auto' }}>
          {/* Mobile Menu Button */}
          <button 
            className="btn btn-icon p-2 d-md-none d-lg-none" 
            onClick={() => setSidebarOpen(prev => !prev)}
            style={{
              background: darkMode ? '#1a2433' : 'white',
              border: `1px solid ${darkMode ? '#2a3441' : 'var(--neutral-200)'}`,
              borderRadius: '8px',
              color: darkMode ? 'var(--neutral-200)' : 'var(--neutral-700)',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Menu size={20} />
          </button>
          
          <div className="brand-logo" style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, var(--primary-400), var(--primary-600))',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,115,255,0.2)',
            flexShrink: 0
          }}>
            <Bot size={24} className="text-white" />
          </div>
          <div style={{ minWidth: 0, flex: '1 1 auto' }}>
            <h5 className="m-0 fw-bold dark-mode-text" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>AI Multi-Utility Assistant</h5>
            <div className="text-muted small" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.85rem)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Professional AI Solutions</div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 gap-md-3 flex-wrap" style={{ flexShrink: 0 }}>
          <button 
            className="theme-toggle btn btn-icon p-2" 
            onClick={() => setDarkMode(d => !d)}
            style={{
              background: darkMode ? '#1a2433' : 'white',
              border: `1px solid ${darkMode ? '#2a3441' : 'var(--neutral-200)'}`,
              borderRadius: '12px',
              color: darkMode ? 'var(--neutral-200)' : 'var(--neutral-700)',
              transition: 'all 0.2s ease',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {darkMode ? <Sun size={18}/> : <Moon size={18}/>}
          </button>

          {!currentUser ? (
            <button 
              className="btn btn-primary d-none d-sm-block" 
              onClick={handleLogin}
              style={{
                background: 'linear-gradient(135deg, var(--accent-500), var(--accent-indigo))',
                border: 'none',
                color: 'white',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(255,107,107,0.25)',
                padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 1rem)',
                borderRadius: '8px',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                flexShrink: 0
              }}
            >
              <LogIn size={16} className="me-2" style={{marginBottom: '2px'}} /> Login
            </button>
          ) : (
            <div className="d-flex align-items-center gap-2 gap-md-3">
              <div className="avatar d-flex align-items-center gap-2 d-none d-sm-flex" style={{
                background: darkMode ? '#1a2433' : 'white',
                border: `1px solid ${darkMode ? '#2a3441' : 'var(--neutral-200)'}`,
                borderRadius: '12px',
                padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.5rem, 2vw, 1rem)',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(135deg, var(--accent-500), var(--accent-indigo))',
                  border: '2px solid rgba(255,255,255,0.2)',
                  flexShrink: 0
                }}>
                  {currentUser[0].toUpperCase()}
                </div>
                <div style={{ color: darkMode ? 'var(--neutral-100)' : 'var(--neutral-900)', minWidth: 0 }}>
                  <div style={{ fontWeight: '600', fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser}</div>
                  <div className="text-muted small" style={{ margin: 0, fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)' }}>Student</div>
                </div>
              </div>
              <button 
                className="btn btn-outline-danger" 
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: '500',
                  padding: 'clamp(0.3rem, 1vw, 0.5rem) clamp(0.4rem, 1.5vw, 1rem)',
                  borderRadius: '8px',
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                  flexShrink: 0
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}