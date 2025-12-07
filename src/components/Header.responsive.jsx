import React from 'react';
import { Bot, Sun, Moon, LogIn, LogOut, Menu } from 'lucide-react';

export default function Header({ 
  darkMode, 
  setDarkMode, 
  currentUser, 
  handleLogout, 
  handleLogin, 
  sidebarOpen, 
  setSidebarOpen 
}) {
  return (
    <header className={`app-header ${darkMode ? 'dark-mode' : ''}`}>
      <div className="top-bar">
        {/* Header Left - Logo & Branding */}
        <div className="header-left">
          {/* Mobile Menu Toggle */}
          <button 
            className="header-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Menu"
            aria-label="Toggle Menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <div className="brand-logo">
            <Bot size={24} style={{ color: 'white' }} />
          </div>

          {/* Brand Text */}
          <div className="brand-text">
            <h1 className="brand-title">AI Multi-Utility Assistant</h1>
            <p className="brand-subtitle">Professional AI Solutions</p>
          </div>
        </div>

        {/* Header Right - Actions */}
        <div className="header-right">
          {/* Theme Toggle */}
          <button 
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Auth Section */}
          {!currentUser ? (
            <button 
              className="auth-btn"
              onClick={handleLogin}
              title="Login"
              style={{
                background: 'linear-gradient(135deg, var(--accent-500), var(--accent-indigo))',
                border: 'none',
                color: 'white',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <LogIn size={16} />
              <span style={{ display: 'none' }} className="d-sm-inline">Login</span>
            </button>
          ) : (
            <>
              {/* User Avatar - Hidden on Mobile */}
              <div className="user-avatar">
                <div className="avatar-circle">
                  {currentUser[0].toUpperCase()}
                </div>
                <div className="avatar-text">
                  <p className="avatar-name">{currentUser}</p>
                  <p className="avatar-role">Student</p>
                </div>
              </div>

              {/* Logout Button */}
              <button 
                className="auth-btn"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
