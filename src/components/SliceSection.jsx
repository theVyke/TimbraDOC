import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { PDFDocument } from 'pdf-lib';

export default function SliceSection({
  baseFile, setBaseFile, onBack, setLoading, addToast
}) {
  const [slices, setSlices] = useState(1);
  const [overlap, setOverlap] = useState(15);
  const [pdfInfo, setPdfInfo] = useState({ width: 0, height: 0, sliceHeight: 0 });

  useEffect(() => {
    const calcDimensions = async () => {
      try {
        const response = await fetch(baseFile);
        const bytes = new Uint8Array(await response.arrayBuffer());
        const originalPdf = await PDFDocument.load(bytes);
        const pages = originalPdf.getPages();
        
        if (pages.length > 0) {
          const { width, height } = pages[0].getSize();
          const A4_RATIO = 842 / 595;
          const sliceHeight = width * A4_RATIO;
          const advance = sliceHeight - overlap;
          
          let cY = height;
          let count = 0;
          while (cY > 0) {
            count++;
            cY -= advance;
          }
          
          setSlices(count);
          setPdfInfo({ width, height, sliceHeight });
        }
      } catch (err) {
        console.error("Erro ao pré-processar PDF:", err);
      }
    };
    calcDimensions();
  }, [baseFile, overlap]);

  const handleSlice = async () => {
    setLoading(true);
    try {
      const response = await fetch(baseFile);
      const bytes = new Uint8Array(await response.arrayBuffer());
      const originalPdf = await PDFDocument.load(bytes);
      
      const pages = originalPdf.getPages();
      if (pages.length === 0) throw new Error("Documento vazio.");
      
      const { width, height } = pages[0].getSize();
      
      const subDoc = await PDFDocument.create();
      const [embeddedPage] = await subDoc.embedPdf(originalPdf, [0]);
      
      const A4_RATIO = 842 / 595;
      const sliceHeight = width * A4_RATIO;
      const advance = sliceHeight - overlap;
      
      let currentYTop = height;
      let sliceCount = 0;
      
      while (currentYTop > 0) {
         sliceCount++;
         const newPage = subDoc.addPage([width, sliceHeight]);
         const yOffset = sliceHeight - currentYTop;
         
         newPage.drawPage(embeddedPage, {
             x: 0,
             y: yOffset,
         });
         
         currentYTop -= advance;
      }
      
      const pdfBytes = await subDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setBaseFile(url);
      addToast(`Documento dividido em ${sliceCount} páginas A4!`, 'success');
      onBack(); // go back to upload step
    } catch (err) {
      console.error(err);
      addToast(`Erro ao dividir: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="preview-section">
      <div className="preview-section__inner">
        <div className="preview-topbar" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <button className="btn btn--ghost" onClick={onBack}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            Cancelar
          </button>
          
          <div style={{ flex: 1, padding: '0 2rem' }}>
             <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Corte Automático Inteligente
                  </h3>
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ajuste fino da quebra:</label>
                     <input 
                        type="range" 
                        min="0" 
                        max="150" 
                        value={overlap} 
                        onChange={e => setOverlap(Number(e.target.value))} 
                        style={{ width: '100px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                     />
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                       <input 
                          type="number" 
                          min="0" 
                          max="150" 
                          value={overlap} 
                          onChange={e => setOverlap(Number(e.target.value))} 
                          style={{ 
                             width: '50px', 
                             padding: '0.2rem', 
                             textAlign: 'center',
                             background: 'var(--bg-tertiary)',
                             border: '1px solid var(--border-color)',
                             color: 'var(--text-primary)',
                             borderRadius: 'var(--radius-sm)',
                             fontSize: '0.85rem'
                          }}
                       />
                       <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>pt</span>
                     </div>
                  </div>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    O documento será dividido em proporção A4. Aumente o ajuste se um recorte dividir uma linha de texto.
                  </p>
                </div>
                <div style={{ textAlign: 'right', minWidth: '100px', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total de Páginas</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent-primary)', lineHeight: '1.2' }}>{slices > 0 ? slices : '...'}</div>
                </div>
             </div>
          </div>

          <button className="btn btn--primary" onClick={handleSlice}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Dividir Documento
          </button>
        </div>

        <div className="preview-layout" style={{ display: 'flex', justifyContent: 'center', paddingTop: '2rem', paddingBottom: '4rem', overflowY: 'auto' }}>
          
          <div className="preview-viewport" style={{ 
              position: 'relative', 
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)', 
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#fff',
              margin: '0 auto',
              width: 'fit-content',
              maxWidth: '100%'
          }}>
             <Document
                file={baseFile}
                loading={<div className="pdf-loading" style={{ padding: '2rem' }}>Carregando visualização...</div>}
             >
                <Page
                  pageNumber={1}
                  width={Math.min(window.innerWidth - 64, 450)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
             </Document>

             {/* Draw overlay lines for previewing cuts */}
             {slices > 1 && pdfInfo.height > 0 && (
                 <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {Array.from({ length: slices }).map((_, i) => {
                        // In the visualizer (React-PDF), coordinate 0 is top.
                        // pdfInfo.height is the total document height in points.
                        // pdfInfo.sliceHeight is the points per slice.
                        // We advance by (sliceHeight - overlap) points per slice.
                        // Visual Y percentage = (i * (sliceHeight - overlap)) / pdfInfo.height * 100
                        const advance = pdfInfo.sliceHeight - overlap;
                        const topPercentage = (i * advance) / pdfInfo.height * 100;
                        
                        if (i === 0) return null; // No top border for the very first slice
                        
                        return (
                          <div key={i} style={{ 
                              position: 'absolute',
                              top: `${topPercentage}%`,
                              left: 0,
                              width: '100%',
                              borderTop: '2px dashed #ff0000',
                              zIndex: 10
                          }}>
                             <span style={{ 
                                 position: 'absolute', 
                                 top: '4px', 
                                 left: '4px', 
                                 backgroundColor: '#ff0000', 
                                 color: '#fff', 
                                 padding: '2px 6px', 
                                 borderRadius: '4px',
                                 fontSize: '0.75rem',
                                 fontWeight: 'bold'
                             }}>
                                 Corte {i}
                             </span>
                          </div>
                        )
                    })}
                 </div>
             )}
          </div>

        </div>
      </div>
    </section>
  );
}
