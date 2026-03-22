import React, { useState, useCallback } from 'react';
import { pdfjs } from 'react-pdf';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import PreviewSection from './components/PreviewSection';
import ResultSection from './components/ResultSection';

import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import LoadingOverlay from './components/LoadingOverlay';

// Configure pdf.js worker using matching pdfjs-dist v5.4.296
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();
export default function App() {
  // Files
  const [baseFile, setBaseFile] = useState(null);
  const [baseName, setBaseName] = useState('');
  const [letterheadFile, setLetterheadFile] = useState(null);
  const [letterheadName, setLetterheadName] = useState('');
  const [letterheadImage, setLetterheadImage] = useState(null);
  const [letterheadSize, setLetterheadSize] = useState({ width: 0, height: 0 });

  // Preview controls
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(0.8);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [pageOverrides, setPageOverrides] = useState({});
  const [editMode, setEditMode] = useState('geral'); // 'geral' | 'individual'

  // App state
  const [step, setStep] = useState('upload'); // 'upload' | 'preview' | 'result'
  const [mergedBlob, setMergedBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Modals
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    pages: 'all',
    customPages: '',
  });

  // Toast helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Convert letterhead PDF first page to image (for CSS background)
  const convertLetterheadToImage = useCallback(async (fileUrl) => {
    try {
      const pdf = await pdfjs.getDocument(fileUrl).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport }).promise;
      return {
        url: canvas.toDataURL('image/png'),
        width: viewport.width,
        height: viewport.height,
      };
    } catch {
      return null;
    }
  }, []);

  // Handle base file upload
  const handleBaseUpload = useCallback((file) => {
    if (!file || file.type !== 'application/pdf') {
      addToast('Selecione um arquivo PDF válido.', 'error');
      return;
    }
    const url = URL.createObjectURL(file);
    setBaseFile(url);
    setBaseName(file.name);
    addToast(`Documento "${file.name}" carregado!`, 'success');
  }, [addToast]);

  // Handle letterhead file upload
  const handleLetterheadUpload = useCallback(async (file) => {
    if (!file || file.type !== 'application/pdf') {
      addToast('Selecione um arquivo PDF válido.', 'error');
      return;
    }
    const url = URL.createObjectURL(file);
    setLetterheadFile(url);
    setLetterheadName(file.name);
    const result = await convertLetterheadToImage(url);
    if (result) {
      setLetterheadImage(result.url);
      setLetterheadSize({ width: result.width, height: result.height });
    }
    addToast(`Timbrado "${file.name}" carregado!`, 'success');
  }, [addToast, convertLetterheadToImage]);

  // Remove file
  const removeBase = useCallback(() => {
    if (baseFile) URL.revokeObjectURL(baseFile);
    setBaseFile(null);
    setBaseName('');
    setStep('upload');
    addToast('Documento removido.', 'info');
  }, [baseFile, addToast]);

  const removeLetterhead = useCallback(() => {
    if (letterheadFile) URL.revokeObjectURL(letterheadFile);
    setLetterheadFile(null);
    setLetterheadName('');
    setLetterheadImage(null);
    setStep('upload');
    addToast('Timbrado removido.', 'info');
  }, [letterheadFile, addToast]);

  // Go to preview
  const goToPreview = useCallback(() => {
    if (!baseFile || !letterheadFile) {
      addToast('Carregue ambos os documentos primeiro.', 'error');
      return;
    }
    setStep('preview');
  }, [baseFile, letterheadFile, addToast]);

  // Reset all
  const resetAll = useCallback(() => {
    if (baseFile) URL.revokeObjectURL(baseFile);
    if (letterheadFile) URL.revokeObjectURL(letterheadFile);
    setBaseFile(null);
    setBaseName('');
    setLetterheadFile(null);
    setLetterheadName('');
    setLetterheadImage(null);
    setMergedBlob(null);
    setOpacity(1);
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setPageOverrides({});
    setEditMode('geral');
    setStep('upload');
  }, [baseFile, letterheadFile]);

  return (
    <>
      <Header
        onSettings={() => setSettingsOpen(true)}
      />

      {step === 'upload' && (
        <UploadSection
          baseFile={baseFile}
          baseName={baseName}
          letterheadFile={letterheadFile}
          letterheadName={letterheadName}
          onBaseUpload={handleBaseUpload}
          onLetterheadUpload={handleLetterheadUpload}
          onRemoveBase={removeBase}
          onRemoveLetterhead={removeLetterhead}
          onPreview={goToPreview}
          bothReady={!!baseFile && !!letterheadFile}
        />
      )}

      {step === 'preview' && (
        <PreviewSection
          baseFile={baseFile}
          letterheadImage={letterheadImage}
          letterheadSize={letterheadSize}
          letterheadFile={letterheadFile}
          opacity={opacity}
          scale={scale}
          rotation={rotation}
          position={position}
          pageOverrides={pageOverrides}
          editMode={editMode}
          onOpacityChange={setOpacity}
          onScaleChange={setScale}
          onRotationChange={setRotation}
          onPositionChange={setPosition}
          setPageOverrides={setPageOverrides}
          setEditMode={setEditMode}
          settings={settings}
          onBack={() => setStep('upload')}
          setLoading={setLoading}
          setMergedBlob={setMergedBlob}
          setStep={setStep}
          addToast={addToast}
        />
      )}

      {step === 'result' && (
        <ResultSection
          mergedBlob={mergedBlob}
          onNewMerge={resetAll}
          addToast={addToast}
        />
      )}


      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={(s) => { setSettings(s); setSettingsOpen(false); addToast('Configurações salvas!', 'success'); }}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {loading && <LoadingOverlay />}
      <Toast toasts={toasts} />
    </>
  );
}
