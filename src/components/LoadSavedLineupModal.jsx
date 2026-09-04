import React, { useState } from 'react';
import {
  X,
  FolderOpen,
  Check,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  Shield,
  Save,
  Users,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import VolleyballIcon from './icons/VolleyballIcon';

const ZONE_LABELS = {
  pos1: 'Pos 1 (Serve/BR)',
  pos2: 'Pos 2 (FR)',
  pos3: 'Pos 3 (Middle/FM)',
  pos4: 'Pos 4 (FL)',
  pos5: 'Pos 5 (BL)',
  pos6: 'Pos 6 (BM)'
};

export default function LoadSavedLineupModal({
  isOpen,
  onClose,
  savedPresets = [],
  currentLineup = {},
  roster = [],
  onApplyPreset,
  onSaveCurrentAsPreset,
  onDeletePreset,
  onOpenLineupStudio
}) {
  const [isSavingNew, setIsSavingNew] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  if (!isOpen) return null;

  const getPlayer = (id) => roster.find(p => p.id === id);

  // Check if current court matches a preset
  const isPresetActive = (preset) => {
    if (!preset?.lineup || !currentLineup) return false;
    const zones = ['pos1', 'pos2', 'pos3', 'pos4', 'pos5', 'pos6'];
    return zones.every(z => (preset.lineup[z] || null) === (currentLineup[z] || null));
  };

  const handleApply = (preset) => {
    if (!preset || !preset.lineup) return;
    onApplyPreset(preset.lineup, preset.liberoId);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
    onClose();
  };

  const handleSaveCurrent = (e) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;
    onSaveCurrentAsPreset(newPresetName.trim(), newPresetDesc.trim());
    setNewPresetName('');
    setNewPresetDesc('');
    setIsSavingNew(false);
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
  };

  const handleDelete = (presetId) => {
    onDeletePreset(presetId);
    setConfirmDeleteId(null);
  };

  // Check how many positions are filled on current court
  const filledCount = Object.values(currentLineup || {}).filter(Boolean).length;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 24, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.18s ease-out'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          backgroundColor: '#0f172a',
          border: '1.5px solid rgba(59, 130, 246, 0.35)',
          borderRadius: '18px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65), 0 0 30px rgba(59, 130, 246, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.1rem 1.35rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3) 0%, rgba(15, 23, 42, 0.6) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
              }}
            >
              <FolderOpen size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc' }}>
                Load Saved Lineup
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                Quickly apply a saved 6-player rotation preset directly to the court
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-icon"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Scrollable Presets List */}
        <div
          style={{
            padding: '1.1rem 1.35rem',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem'
          }}
        >
          {/* Quick Save Current Court Bar */}
          {!isSavingNew ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.9rem',
                borderRadius: '12px',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px dashed rgba(59, 130, 246, 0.4)',
                gap: '0.5rem'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#93c5fd' }}>Current Court:</strong> {filledCount}/6 positions assigned
              </div>
              <button
                type="button"
                onClick={() => setIsSavingNew(true)}
                disabled={filledCount === 0}
                className="btn btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  cursor: filledCount === 0 ? 'not-allowed' : 'pointer',
                  opacity: filledCount === 0 ? 0.5 : 1
                }}
                title={filledCount === 0 ? 'Assign players to the court first' : 'Save current positions as a preset'}
              >
                <Save size={13} />
                <span>Save Current as Preset</span>
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSaveCurrent}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: 'rgba(30, 58, 138, 0.25)',
                border: '1.5px solid rgba(59, 130, 246, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#93c5fd' }}>
                  Save Current Court as New Preset
                </span>
                <button
                  type="button"
                  onClick={() => setIsSavingNew(false)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <input
                type="text"
                className="input-field"
                placeholder="Preset Name (e.g. Starting 6-2 A, Tall Blockers)"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              />

              <input
                type="text"
                className="input-field"
                placeholder="Optional notes / description"
                value={newPresetDesc}
                onChange={(e) => setNewPresetDesc(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.8rem'
                }}
              />

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsSavingNew(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPresetName.trim()}
                  className="btn btn-primary btn-sm"
                  style={{
                    background: '#3b82f6',
                    borderColor: '#3b82f6',
                    fontSize: '0.78rem',
                    fontWeight: 800
                  }}
                >
                  Save Preset
                </button>
              </div>
            </form>
          )}

          {/* Preset Cards List */}
          {savedPresets.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2.2rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
              <h4 style={{ margin: '0 0 0.4rem 0', color: '#f8fafc', fontSize: '0.98rem' }}>
                No Saved Lineups Yet
              </h4>
              <p style={{ margin: '0 0 1.1rem 0', color: '#94a3b8', fontSize: '0.82rem', maxWidth: '340px', marginInline: 'auto', lineHeight: 1.4 }}>
                Set up your 6 positions on the court and tap <strong>"Save Current as Preset"</strong> above, or open the <strong>Lineup Studio</strong> to generate smart 6-2 presets with AI.
              </p>
              {onOpenLineupStudio && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenLineupStudio();
                  }}
                  className="btn btn-sm"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    boxShadow: '0 3px 12px rgba(168, 85, 247, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Sparkles size={14} />
                  <span>Open 6-2 Lineup Studio</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {savedPresets.map((preset) => {
                const isActive = isPresetActive(preset);
                const liberoPlayer = preset.liberoId ? getPlayer(preset.liberoId) : null;

                return (
                  <div
                    key={preset.id}
                    style={{
                      borderRadius: '14px',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)'
                        : 'rgba(255, 255, 255, 0.03)',
                      border: `1.5px solid ${isActive ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
                      padding: '0.9rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 18px rgba(16, 185, 129, 0.2)' : 'none'
                    }}
                  >
                    {/* Card Top Row: Title & Active Badge */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.96rem', fontWeight: 900, color: '#f8fafc' }}>
                            {preset.name}
                          </span>
                          {isActive && (
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                background: '#10b981',
                                color: '#042f2e',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '999px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem'
                              }}
                            >
                              <Check size={11} strokeWidth={3} /> On Court
                            </span>
                          )}
                        </div>
                        {preset.description && (
                          <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                            {preset.description}
                          </div>
                        )}
                      </div>

                      {/* Delete action */}
                      {confirmDeleteId === preset.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handleDelete(preset.id)}
                            className="btn btn-sm"
                            style={{
                              background: '#ef4444',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '0.7rem',
                              padding: '0.2rem 0.5rem',
                              fontWeight: 800
                            }}
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(preset.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Delete preset"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    {/* Visual 6-Zone Court Grid Preview */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.4rem',
                        background: 'rgba(0, 0, 0, 0.25)',
                        padding: '0.55rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      {/* Row 1: Front Row (Pos 4, Pos 3, Pos 2) */}
                      {['pos4', 'pos3', 'pos2'].map(zoneKey => {
                        const pId = preset.lineup?.[zoneKey];
                        const player = pId ? getPlayer(pId) : null;
                        return (
                          <div
                            key={zoneKey}
                            style={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              border: '1px solid rgba(59, 130, 246, 0.25)',
                              borderRadius: '6px',
                              padding: '0.35rem 0.45rem',
                              textAlign: 'center',
                              minWidth: 0
                            }}
                          >
                            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase' }}>
                              {zoneKey === 'pos4' ? 'P4 (FL)' : zoneKey === 'pos3' ? 'P3 (FM)' : 'P2 (FR)'}
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: player ? '#ffffff' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {player ? `#${player.jerseyNumber || ''} ${player.name.split(' ')[0]}` : '—'}
                            </div>
                          </div>
                        );
                      })}

                      {/* Row 2: Back Row (Pos 5, Pos 6, Pos 1) */}
                      {['pos5', 'pos6', 'pos1'].map(zoneKey => {
                        const pId = preset.lineup?.[zoneKey];
                        const player = pId ? getPlayer(pId) : null;
                        return (
                          <div
                            key={zoneKey}
                            style={{
                              background: 'rgba(168, 85, 247, 0.1)',
                              border: '1px solid rgba(168, 85, 247, 0.25)',
                              borderRadius: '6px',
                              padding: '0.35rem 0.45rem',
                              textAlign: 'center',
                              minWidth: 0
                            }}
                          >
                            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>
                              {zoneKey === 'pos5' ? 'P5 (BL)' : zoneKey === 'pos6' ? 'P6 (BM)' : 'P1 (BR/S)'}
                            </div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: player ? '#ffffff' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {player ? `#${player.jerseyNumber || ''} ${player.name.split(' ')[0]}` : '—'}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Row: Libero & Load Action Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.15rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: '#94a3b8' }}>
                        {liberoPlayer ? (
                          <>
                            <Shield size={13} color="#f59e0b" />
                            <span>Libero: <strong style={{ color: '#fcd34d' }}>#{liberoPlayer.jerseyNumber} {liberoPlayer.name}</strong></span>
                          </>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.72rem' }}>No Libero assigned</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApply(preset)}
                        className="btn btn-sm"
                        style={{
                          background: isActive
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: `1.5px solid ${isActive ? '#10b981' : '#059669'}`,
                          color: '#ffffff',
                          fontWeight: 900,
                          fontSize: '0.78rem',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          cursor: 'pointer',
                          boxShadow: isActive ? 'none' : '0 3px 12px rgba(16, 185, 129, 0.35)'
                        }}
                        title="Load this lineup onto the 6-position court"
                      >
                        <Check size={14} />
                        <span>{isActive ? 'Reload Court' : 'Load Onto Court'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '0.85rem 1.35rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.8)'
          }}
        >
          {onOpenLineupStudio ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLineupStudio();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#c084fc',
                fontSize: '0.8rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                padding: '0.3rem 0'
              }}
            >
              <Sparkles size={14} />
              <span>Make Lineup (6-2 Studio) →</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
