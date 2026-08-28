import React, { useState } from 'react';
import { X, Download, Upload, FileText, FileSpreadsheet, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { storageService, INITIAL_SAMPLE_ROSTER } from '../services/storageService';

export default function ImportExportModal({ isOpen, onClose, onRosterUpdated }) {
  const [importText, setImportText] = useState('');
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    storageService.exportJSON();
    setMessage({ type: 'success', text: 'Downloaded JSON backup file.' });
  };

  const handleExportCSV = () => {
    storageService.exportCSV();
    setMessage({ type: 'success', text: 'Downloaded CSV spreadsheet file.' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (file.name.endsWith('.csv')) {
        const res = storageService.importCSV(content);
        if (res.success) {
          onRosterUpdated(res.roster);
          setMessage({ type: 'success', text: `Imported ${res.roster.length} players from CSV!` });
        } else {
          setMessage({ type: 'error', text: res.error });
        }
      } else {
        const res = storageService.importJSON(content);
        if (res.success) {
          onRosterUpdated(res.roster);
          setMessage({ type: 'success', text: `Imported ${res.roster.length} players from JSON!` });
        } else {
          setMessage({ type: 'error', text: res.error });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleImportText = () => {
    if (!importText.trim()) return;
    const text = importText.trim();
    let res;
    if (text.startsWith('[') || text.startsWith('{')) {
      res = storageService.importJSON(text);
    } else {
      res = storageService.importCSV(text);
    }

    if (res.success) {
      onRosterUpdated(res.roster);
      setMessage({ type: 'success', text: `Successfully imported ${res.roster.length} players!` });
      setImportText('');
    } else {
      setMessage({ type: 'error', text: res.error });
    }
  };

  const handleResetSample = () => {
    storageService.saveRoster(INITIAL_SAMPLE_ROSTER);
    onRosterUpdated(INITIAL_SAMPLE_ROSTER);
    setMessage({ type: 'success', text: 'Restored Thunderbolts VC sample roster!' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Backup & Import Roster</h2>
          <button className="btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {message && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: message.type === 'success' ? '#34d399' : '#f87171',
            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Export Options */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Export Roster Backup</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={handleExportCSV}>
              <FileSpreadsheet size={18} color="#10b981" /> Export CSV (Excel)
            </button>
            <button className="btn btn-secondary" onClick={handleExportJSON}>
              <FileText size={18} color="#3b82f6" /> Export JSON Backup
            </button>
          </div>
        </div>

        {/* Import File */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Import from CSV or JSON File</label>
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileUpload}
            style={{
              width: '100%',
              padding: '0.6rem',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px dashed var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Paste Content */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label">Or Paste CSV/JSON Content</label>
          <textarea
            rows="3"
            className="form-textarea"
            placeholder="Number,Name,Position... OR [{ number: 7, name: 'Maya' }]"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
          />
          <button
            className="btn btn-secondary btn-sm"
            style={{ marginTop: '0.5rem' }}
            onClick={handleImportText}
            disabled={!importText.trim()}
          >
            <Upload size={14} /> Parse & Apply
          </button>
        </div>

        {/* Restore Demo Sample */}
        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={handleResetSample}>
            <RotateCcw size={14} /> Load Demo Squad (8 Players)
          </button>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
