import React, { useRef, useCallback, useState } from 'react';
import { Document, Page } from 'react-pdf';

function DropZone({ type, onUpload, icon, title, description, badge, badgeClass }) {
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      className={`upload-card__dropzone${dragover ? ' dragover' : ''}`}
      onDragEnter={(e) => { handleDrag(e); setDragover(true); }}
      onDragOver={(e) => { handleDrag(e); setDragover(true); }}
      onDragLeave={(e) => { handleDrag(e); setDragover(false); }}
      onDrop={(e) => { handleDrag(e); setDragover(false); onUpload(e.dataTransfer.files[0]); }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="upload-card__input"
        style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files[0]) onUpload(e.target.files[0]); }}
      />
      <div className={`upload-card__icon${type === 'letterhead' ? ' upload-card__icon--accent' : ''}`}>{icon}</div>
      <h3 className="upload-card__title">{title}</h3>
      <p className="upload-card__desc">{description}</p>
      <span className={`upload-card__badge${badgeClass ? ' ' + badgeClass : ''}`}>{badge}</span>
    </div>
  );
}

function FilePreview({ file, name, onRemove }) {
  return (
    <div className="upload-card__preview" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '320px' }}>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--space-md)',
        padding: '1rem',
        overflow: 'hidden'
      }}>
        <Document file={file} loading={<div className="pdf-loading">Carregando PDF...</div>}>
          {/* Usar height limita a altura e auto-calcula a largura proporcionalmente, evitando esticar PDFs longos */}
          <Page pageNumber={1} height={240} renderTextLayer={false} renderAnnotationLayer={false} className="upload-preview-page" />
        </Document>
      </div>
      <div className="upload-card__file-info" style={{ marginTop: 'auto' }}>
        <span className="upload-card__file-name">{name}</span>
        <button className="btn btn--icon btn--danger" onClick={onRemove} title="Remover arquivo">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    </div>
  );
}

export default function UploadSection({
  baseFile, baseName, letterheadFile, letterheadName,
  onBaseUpload, onLetterheadUpload, onRemoveBase, onRemoveLetterhead,
  onPreview, onSlice, bothReady,
}) {
  const [dismissSuggestion, setDismissSuggestion] = useState(false);

  // Auto-dismiss if base file is removed
  React.useEffect(() => {
    if (!baseFile) setDismissSuggestion(false);
  }, [baseFile]);

  return (
    <section className="upload-section" id="upload-section">
      <div className="upload-section__inner">
        <h2 className="section-title">Carregue seus documentos</h2>
        <p className="section-subtitle">Arraste e solte ou clique para selecionar os arquivos PDF</p>

        <div className="upload-grid">
          {/* Base Document */}
          <div className="upload-card">
            {!baseFile ? (
              <DropZone
                type="base"
                onUpload={onBaseUpload}
                icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>}
                title="Documento Base"
                description="O documento principal que receberá o timbrado"
                badge="PDF"
              />
            ) : (
              <FilePreview file={baseFile} name={baseName} onRemove={onRemoveBase} />
            )}
          </div>

          {/* Letterhead */}
          <div className="upload-card">
            {!letterheadFile ? (
              <DropZone
                type="letterhead"
                onUpload={onLetterheadUpload}
                icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
                title="Timbrado"
                description="O timbrado que será sobreposto ao documento"
                badge="OVERLAY"
                badgeClass="upload-card__badge--accent"
              />
            ) : (
              <FilePreview file={letterheadFile} name={letterheadName} onRemove={onRemoveLetterhead} />
            )}
          </div>
        </div>

        {/* Action Bar */}
        {bothReady && (
          <div className="action-bar" style={{ marginTop: '2rem' }}>
            <div className="action-bar__inner">
              <div className="action-bar__info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                <span>2 documentos carregados — pronto para visualizar</span>
              </div>
              <div className="action-bar__buttons">
                <button className="btn btn--primary" onClick={onPreview} id="btn-go-preview">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  Visualizar Preview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Suggestion Pop-up */}
        {baseFile && !dismissSuggestion && (
          <div className="suggestion-popup">
            <div className="suggestion-popup__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            </div>
            <div className="suggestion-popup__content">
              <h4>Sugestão!</h4>
              <p>O documento base parece ser extenso? Divida-o automaticamente em folhas A4!</p>
              <button className="btn btn--primary btn--sm" onClick={onSlice} style={{ marginTop: '0.5rem', boxShadow: 'var(--shadow-glow)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><line x1="2" y1="12" x2="22" y2="12" /></svg>
                Divisão Inteligente
              </button>
            </div>
            <button className="suggestion-popup__close" onClick={() => setDismissSuggestion(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
