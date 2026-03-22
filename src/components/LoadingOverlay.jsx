import React from 'react';

export default function LoadingOverlay() {
  return (
    <div className="loading-overlay" id="loading-overlay">
      <div className="loading-spinner">
        <div className="loading-spinner__ring"></div>
        <p className="loading-spinner__text">Processando documentos...</p>
      </div>
    </div>
  );
}
