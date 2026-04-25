import React, { useState, useRef, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { Rnd } from 'react-rnd';
import { PDFDocument } from 'pdf-lib';
import Controls from './Controls';
import { mergePdfs } from '../utils/pdfExport';

export default function PreviewSection({
  baseFile, setBaseFile, letterheadImage, letterheadSize, letterheadFile,
  opacity, scale, rotation, position, pageOverrides, editMode,
  onOpacityChange, onScaleChange, onRotationChange, onPositionChange,
  setPageOverrides, setEditMode,
  settings, onBack, setLoading, setMergedBlob, setStep, addToast,
}) {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);

  const containerRef = useRef(null);
  const [containerBounds, setContainerBounds] = useState({ width: 0, height: 0 });
  const [docUIHeight, setDocUIHeight] = useState(500 * 1.414);

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContainerBounds({
            width: entry.target.offsetWidth,
            height: entry.target.offsetHeight,
          });
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const currentOpacity = editMode === 'individual' && pageOverrides[pageNumber] ? (pageOverrides[pageNumber].opacity ?? opacity) : opacity;
  const currentScale = editMode === 'individual' && pageOverrides[pageNumber] ? (pageOverrides[pageNumber].scale ?? scale) : scale;
  const currentRotation = editMode === 'individual' && pageOverrides[pageNumber] ? (pageOverrides[pageNumber].rotation ?? rotation) : rotation;
  const currentPosition = editMode === 'individual' && pageOverrides[pageNumber] ? (pageOverrides[pageNumber].position ?? position) : position;

  const handleOverrideChange = (prop, value) => {
    if (editMode === 'geral') {
      if (prop === 'opacity') onOpacityChange(value);
      if (prop === 'scale') onScaleChange(value);
      if (prop === 'rotation') onRotationChange(value);
      if (prop === 'position') onPositionChange(value);
    } else {
      setPageOverrides(prev => ({
        ...prev,
        [pageNumber]: {
          ...({ opacity, scale, rotation, position, ...prev[pageNumber] }),
          [prop]: value
        }
      }));
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      // Fetch the actual file bytes from the blob URLs
      const baseResponse = await fetch(baseFile);
      const baseBytes = new Uint8Array(await baseResponse.arrayBuffer());
      const letterheadResponse = await fetch(letterheadFile);
      const letterheadBytes = new Uint8Array(await letterheadResponse.arrayBuffer());

      const blob = await mergePdfs(baseBytes, letterheadBytes, {
        ...settings,
        scale,
        rotation,
        position,
        pageOverrides,
        containerBounds,
        docUiWidth: 500, // The width we pass to <Page>
      });

      setMergedBlob(blob);
      setStep('result');
      addToast('PDF mesclado com sucesso!', 'success');
    } catch (err) {
      console.error('Export error:', err);
      addToast(`Erro ao exportar: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async () => {
    if (numPages <= 1) return;
    setLoading(true);
    try {
      const response = await fetch(baseFile);
      const bytes = new Uint8Array(await response.arrayBuffer());
      const pdfDoc = await PDFDocument.load(bytes);

      pdfDoc.removePage(pageNumber - 1);

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setBaseFile(url);

      // Update pageNumber if we deleted the last page
      if (pageNumber > pdfDoc.getPageCount()) {
        setPageNumber(pdfDoc.getPageCount());
      }

      addToast('Página removida com sucesso!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Erro ao remover página', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages: n }) => {
    setNumPages(n);
  };

  return (
    <section className="preview-section">
      <div className="preview-section__inner">
        {/* Top Bar */}
        <div className="preview-topbar">
          <button className="btn btn--ghost" onClick={onBack} id="btn-back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            Voltar
          </button>
          <h2 className="preview-topbar__title">Preview da Mesclagem</h2>
          <button className="btn btn--primary" onClick={handleExport} id="btn-export">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Mesclar PDF
          </button>
        </div>

        <div className="preview-layout">
          {/* Preview Area */}
          <div className="preview-viewport">
            <div
              className="preview-container"
              ref={containerRef}
              style={{
                backgroundImage: letterheadImage ? `url(${letterheadImage})` : 'none',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                aspectRatio: letterheadSize ? `${letterheadSize.width} / ${letterheadSize.height}` : 'auto',
                width: '100%',
                maxWidth: '500px',
                margin: '0 auto',
                overflow: 'hidden'
              }}
            >
              <Rnd
                position={currentPosition}
                onDragStop={(e, d) => handleOverrideChange('position', { x: d.x, y: d.y })}
                enableResizing={false}
                style={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0 }}
              >
                <div
                  className="documento-overlay"
                  style={{
                    opacity: currentOpacity,
                    transform: `scale(${currentScale}) rotate(${currentRotation}deg)`,
                    transformOrigin: 'center center',
                    cursor: 'move',
                    pointerEvents: 'none' // Let Rnd handle the drag events on its wrapper
                  }}
                >
                  <Document
                    file={baseFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="pdf-loading">Renderizando documento...</div>}
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={500}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      onLoadSuccess={(page) => {
                        const vp = page.getViewport({ scale: 1 });
                        setDocUIHeight(vp.height * (500 / vp.width));
                      }}
                    />
                  </Document>
                </div>
              </Rnd>
            </div>

            {/* Page Navigation */}
            {numPages > 1 && (
              <div className="page-nav" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                <button
                  className="btn btn--icon"
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={pageNumber <= 1}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <span className="page-nav__info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Página
                  <input
                    type="number"
                    min={1}
                    max={numPages}
                    value={pageNumber}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setPageNumber(Math.min(Math.max(1, val), numPages));
                    }}
                    className="form-input"
                    style={{ width: '60px', textAlign: 'center', padding: '0.25rem' }}
                  />
                  de {numPages}
                </span>
                <button
                  className="btn btn--icon"
                  onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                  disabled={pageNumber >= numPages}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
                <button
                  className="btn btn--icon btn--danger"
                  onClick={handleDeletePage}
                  disabled={numPages <= 1}
                  title="Remover página atual"
                  style={{ marginLeft: '0.5rem' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            )}
          </div>

          {/* Controls Panel */}
          <div className="controls-wrapper" style={{ width: '100%', minWidth: '300px' }}>
            {numPages > 1 && (
              <div className="controls-panel" style={{ paddingBottom: '1rem' }}>
                <h3 className="controls-panel__title" style={{ marginBottom: '0.5rem' }}>Modo de Edição</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className={`btn btn--sm ${editMode === 'geral' ? 'btn--primary' : 'btn--outline'}`}
                    onClick={() => setEditMode('geral')}
                    style={{ flex: 1 }}
                  >
                    Geral
                  </button>
                  <button
                    className={`btn btn--sm ${editMode === 'individual' ? 'btn--primary' : 'btn--outline'}`}
                    onClick={() => {
                      // Clone current settings if not existing
                      if (!pageOverrides[pageNumber]) {
                        setPageOverrides(prev => ({
                          ...prev,
                          [pageNumber]: { opacity, scale, rotation, position }
                        }));
                      }
                      setEditMode('individual');
                    }}
                    style={{ flex: 1 }}
                  >
                    Página Atual
                  </button>
                </div>
              </div>
            )}
            <Controls
              opacity={currentOpacity}
              scale={currentScale}
              rotation={currentRotation}
              onOpacityChange={(v) => handleOverrideChange('opacity', v)}
              onScaleChange={(v) => handleOverrideChange('scale', v)}
              onRotationChange={(v) => handleOverrideChange('rotation', v)}
              onPositionPreset={(preset) => {
                const docH = docUIHeight;
                const vW = 500 * currentScale; // Visual width

                // RndX to perfectly center the visual item
                const centerX = (containerBounds.width / 2) - 250;
                const centerY = (containerBounds.height / 2) - (docH / 2);

                if (preset === 'center') {
                  handleOverrideChange('position', { x: Math.round(centerX), y: Math.round(centerY) });
                } else if (preset === 'left') {
                  // align left edge of visual box with 0
                  const leftX = -(500 - vW) / 2;
                  handleOverrideChange('position', { x: Math.round(leftX), y: Math.round(centerY) });
                } else if (preset === 'right') {
                  // align right edge of visual box with container width
                  const rightX = containerBounds.width - (250 + (vW / 2));
                  handleOverrideChange('position', { x: Math.round(rightX), y: Math.round(centerY) });
                }
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
