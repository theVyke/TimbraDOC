import React from 'react';

export default function ResultSection({ mergedBlob, onNewMerge, addToast }) {
  const handleDownload = () => {
    if (!mergedBlob) return;
    const url = URL.createObjectURL(mergedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento-timbrado.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Download iniciado!', 'success');
  };

  return (
    <section className="result-section">
      <div className="result-section__inner">
        <div className="result-success">
          <div className="result-success__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className="section-title">Exportação Concluída!</h2>
          <p className="section-subtitle">Seu documento mesclado com o timbrado está pronto para download</p>

          <div className="result-actions">
            <button className="btn btn--primary btn--lg" onClick={handleDownload} id="btn-download">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Baixar PDF Mesclado
            </button>
            <button className="btn btn--outline" onClick={onNewMerge} id="btn-new-merge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              Nova Mesclagem
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
