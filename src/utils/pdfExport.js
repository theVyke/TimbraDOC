import { PDFDocument, degrees } from 'pdf-lib';

/**
 * Parse custom page ranges like "1,3,5-8" into 0-indexed array
 */
function parsePageRange(rangeStr, totalPages) {
  const result = new Set();
  const parts = rangeStr.split(',').map((s) => s.trim());
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end && i <= totalPages; i++) {
        result.add(i - 1);
      }
    } else {
      const num = parseInt(part, 10);
      if (num >= 1 && num <= totalPages) {
        result.add(num - 1);
      }
    }
  }
  return [...result];
}

/**
 * Merge base PDF with letterhead PDF using pdf-lib
 * Only called when user clicks "Export"
 */
export async function mergePdfs(baseBytes, letterheadBytes, settings) {
  const { 
    pages = 'all', customPages = '', opacity = 1, scale = 1, rotation = 0,
    position = { x: 0, y: 0 },
    pageOverrides = {},
    containerBounds = { width: 1000, height: 1000 },
    docUiWidth = 500
  } = settings;

  const basePdf = await PDFDocument.load(baseBytes);
  const letterheadPdf = await PDFDocument.load(letterheadBytes);

  const basePages = basePdf.getPages();
  const letterheadPages = letterheadPdf.getPages();

  if (letterheadPages.length === 0) {
    throw new Error('O timbrado não possui páginas.');
  }

  // Determine which pages to apply letterhead
  let pagesToApply;
  if (pages === 'all') {
    pagesToApply = Array.from({ length: basePages.length }, (_, i) => i);
  } else if (pages === 'first') {
    pagesToApply = [0];
  } else {
    pagesToApply = parsePageRange(customPages, basePages.length);
  }

  // Create result PDF
  const resultPdf = await PDFDocument.create();

  for (let i = 0; i < basePages.length; i++) {
    if (pagesToApply.includes(i)) {
      const pageNum = i + 1;
      const currentScale = pageOverrides[pageNum]?.scale ?? scale;
      const currentRotation = pageOverrides[pageNum]?.rotation ?? rotation;
      const currentOpacity = pageOverrides[pageNum]?.opacity ?? opacity;
      const currentPosition = pageOverrides[pageNum]?.position ?? position;

      const theta = -currentRotation * (Math.PI / 180);

      // 1. Copy the letterhead page to act as the background
      const letterheadIdx = Math.min(i, letterheadPages.length - 1);
      const [bgPage] = await resultPdf.copyPages(letterheadPdf, [letterheadIdx]);
      resultPdf.addPage(bgPage);

      // 2. Embed the base document page to draw on top of the letterhead
      const [embeddedDoc] = await resultPdf.embedPages([basePdf.getPages()[i]]);

      const bgDims = bgPage.getSize();
      const docDims = embeddedDoc.scale(1); 
      
      const sWidth = docDims.width * currentScale;
      const sHeight = docDims.height * currentScale;

      // Calculate the document center in the UI to find relative percentages
      const uiHeight = docDims.height * (docUiWidth / docDims.width);
      const uiCx = currentPosition.x + (docUiWidth / 2);
      const uiCy = currentPosition.y + (uiHeight / 2);

      const pctX = containerBounds.width ? uiCx / containerBounds.width : 0.5;
      const pctY = containerBounds.height ? uiCy / containerBounds.height : 0.5;

      const bgCx = bgDims.width * pctX;
      const bgCy = bgDims.height * (1 - pctY);

      // Calculate the offset so that the rotated document remains centered
      const dx = (sWidth / 2) * Math.cos(theta) - (sHeight / 2) * Math.sin(theta);
      const dy = (sWidth / 2) * Math.sin(theta) + (sHeight / 2) * Math.cos(theta);

      const x = bgCx - dx;
      const y = bgCy - dy;

      // Draw the document on the letterhead background
      bgPage.drawPage(embeddedDoc, {
        x,
        y,
        width: sWidth,
        height: sHeight,
        rotate: degrees(-rotation),
        opacity: 1, // Fixa em 1 para exportação
      });

    } else {
      // Just copy the base page if no letterhead is applied
      const [copiedBasePage] = await resultPdf.copyPages(basePdf, [i]);
      resultPdf.addPage(copiedBasePage);
    }
  }

  const pdfBytes = await resultPdf.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
