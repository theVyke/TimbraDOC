import React from 'react';

export default function Header({ onSettings, onHistory }) {
  return (
    <header className="header" id="app-header">
      <div className="header__inner">
        <div className="header__brand">
          <svg className="header__logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="24" height="30" rx="3" stroke="url(#grad1)" strokeWidth="2.5" fill="none"/>
            <rect x="14" y="4" width="24" height="30" rx="3" stroke="url(#grad2)" strokeWidth="2.5" fill="rgba(139,92,246,0.15)"/>
            <defs>
              <linearGradient id="grad1" x1="2" y1="6" x2="26" y2="36"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient>
              <linearGradient id="grad2" x1="14" y1="4" x2="38" y2="34"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#c084fc"/></linearGradient>
            </defs>
          </svg>
          <span className="header__title">Timbra<span className="header__title--accent">Doc</span></span>
        </div>
        <nav className="header__nav">
          <button className="btn btn--ghost" onClick={onSettings}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Configurações
          </button>
        </nav>
      </div>
    </header>
  );
}
