import React, { useState } from 'react';

export default function SettingsModal({ settings, onSave, onClose }) {
  const [pages, setPages] = useState(settings.pages);
  const [customPages, setCustomPages] = useState(settings.customPages);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">Configurações de Mesclagem</h2>
          <button className="btn btn--icon" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="modal__body">
          <div className="form-group">
            <label className="form-label">Aplicar timbrado em</label>
            <select className="form-select" value={pages} onChange={(e) => setPages(e.target.value)}>
              <option value="all">Todas as páginas</option>
              <option value="first">Apenas a primeira página</option>
              <option value="custom">Páginas personalizadas</option>
            </select>
          </div>
          {pages === 'custom' && (
            <div className="form-group">
              <label className="form-label">Páginas (ex: 1,3,5-8)</label>
              <input
                type="text"
                className="form-input"
                value={customPages}
                onChange={(e) => setCustomPages(e.target.value)}
                placeholder="1,3,5-8"
              />
            </div>
          )}
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn--primary" onClick={() => onSave({ pages, customPages })}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
