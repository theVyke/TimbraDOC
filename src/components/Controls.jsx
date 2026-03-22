import React from 'react';

export default function Controls({
  opacity, scale, rotation,
  onOpacityChange, onScaleChange, onRotationChange, onPositionPreset,
}) {
  return (
    <div className="controls-panel">
      <h3 className="controls-panel__title">Controles do Documento</h3>

      {/* Opacity */}
      <div className="control-group">
        <label className="control-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2v20" /><path d="M12 2a10 10 0 0 1 0 20" /></svg>
          Opacidade (Visualização)
        </label>
        <div className="control-slider">
          <input
            type="range"
            className="form-range"
            min="0"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          />
          <span className="control-value">{Math.round(opacity * 100)}%</span>
        </div>
      </div>

      {/* Scale */}
      <div className="control-group">
        <label className="control-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
          Escala
        </label>
        <div className="control-slider">
          <input
            type="range"
            className="form-range"
            min="0.3"
            max="2"
            step="0.05"
            value={scale}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
          />
          <span className="control-value">{Math.round(scale * 100)}%</span>
        </div>
      </div>

      {/* Rotation */}
      <div className="control-group">
        <label className="control-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
          Rotação
        </label>
        <div className="control-rotation">
          <button
            className="btn btn--outline btn--sm"
            onClick={() => onRotationChange(rotation - 90)}
            title="Girar -90°"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
            −90°
          </button>
          <span className="control-value control-value--rotation">{rotation}°</span>
          <button
            className="btn btn--outline btn--sm"
            onClick={() => onRotationChange(rotation + 90)}
            title="Girar +90°"
          >
            +90°
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: 'scaleX(-1)' }}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
          </button>
        </div>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => onRotationChange(0)}
          style={{ marginTop: '0.5rem', width: '100%' }}
        >
          Resetar Rotação
        </button>
      </div>

      {/* Divider */}
      <div className="controls-divider"></div>

      {/* Quick Presets */}
      <div className="control-group">
        <label className="control-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          Presets Rápidos
        </label>
        <div className="control-presets">
          <button
            className="btn btn--outline btn--sm"
            onClick={() => { onOpacityChange(1); onScaleChange(1); onRotationChange(0); }}
          >
            Original
          </button>
          <button
            className="btn btn--outline btn--sm"
            onClick={() => onPositionPreset('center')}
          >
            Centralizado
          </button>
          <button
            className="btn btn--outline btn--sm"
            onClick={() => onPositionPreset('left')}
          >
            Esquerda
          </button>
          <button
            className="btn btn--outline btn--sm"
            onClick={() => onPositionPreset('right')}
          >
            Direita
          </button>
        </div>
      </div>
    </div>
  );
}
