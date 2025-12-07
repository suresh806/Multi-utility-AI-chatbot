import React from 'react';

export default function ModuleButton({ 
  icon, 
  label, 
  isActive, 
  onClick, 
  collapsed 
}) {
  return (
    <button
      className={`module-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? '0' : '0.75rem',
        width: '100%',
        padding: collapsed ? '0.65rem rem' : '0.65rem rem',
        border: 'none',
        background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
        color: isActive ? 'white' : 'rgba(255,255,255,0.88)',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        fontWeight: isActive ? '600' : '500',
        justifyContent: 'flex-start'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.transform = 'translateX(4px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.transform = 'translateX(0)';
        }
      }}
    >
      <div className="module-icon" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: isActive ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
        transition: 'all 0.2s ease',
        boxShadow: isActive ? '0 4px 12px rgba(11,84,84,0.15)' : 'none',
        flexShrink: 0
      }}>
        {icon}
      </div>
      
      {!collapsed && (
        <span className="module-label" style={{
          fontSize: '0.95rem',
          fontWeight: isActive ? '600' : '500',
          opacity: collapsed ? 0 : 1,
          transition: 'opacity 0.2s ease',
          whiteSpace: 'nowrap'
        }}>
          {label}
        </span>
      )}
      
      {isActive && (
        <div className="active-indicator" style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: 'linear-gradient(180deg, var(--accent-500), var(--accent-600))',
          borderRadius: '0 4px 4px 0'
        }} />
      )}
    </button>
  );
}