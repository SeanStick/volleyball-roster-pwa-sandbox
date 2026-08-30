import React, { useState } from 'react';
import {
  X,
  Plus,
  Layers,
  Check,
  Trash2,
  Copy,
  Users,
  Calendar,
  Palette,
  Cloud,
  Shield,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TeamManagerModal({
  isOpen,
  onClose,
  teams = [],
  activeTeamId,
  onSelectTeam,
  onCreateTeam,
  onDuplicateTeam,
  onDeleteTeam,
  user
}) {
  const [view, setView] = useState('list'); // 'list' | 'create'
  const [newTeamName, setNewTeamName] = useState('');
  const [newSeason, setNewSeason] = useState('2026 - 2027');
  const [newPrimaryColor, setNewPrimaryColor] = useState('#ff6b35');
  const [newSecondaryColor, setNewSecondaryColor] = useState('#1e3a8a');
  const [newLiberoColor, setNewLiberoColor] = useState('#8b5cf6');
  const [cloneCurrentRoster, setCloneCurrentRoster] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      setErrorMsg('Please enter a team name.');
      return;
    }

    const teamPayload = {
      id: `team-${Date.now()}`,
      teamName: newTeamName.trim(),
      season: newSeason.trim() || '2026 - 2027',
      primaryColor: newPrimaryColor,
      secondaryColor: newSecondaryColor,
      liberoColor: newLiberoColor,
      cloneRoster: cloneCurrentRoster,
      updatedAt: new Date().toISOString()
    };

    onCreateTeam(teamPayload);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });

    // Reset and back to list
    setNewTeamName('');
    setView('list');
    setErrorMsg(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '580px', padding: '1.75rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ff6b35, #1e3a8a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={20} color="#ffffff" />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.2rem' }}>
                Manage Volleyball Squads
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {user ? `Tied to ${user.email} on Google Cloud` : 'Manage and switch between your teams'}
              </p>
            </div>
          </div>
          <button className="btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* View Switcher Bar */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
            marginBottom: '1.25rem'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setView('list');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: view === 'list' ? 'var(--accent-orange)' : 'transparent',
              color: view === 'list' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Layers size={14} /> My Teams ({teams.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setView('create');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: view === 'create' ? 'var(--accent-orange)' : 'transparent',
              color: view === 'create' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Plus size={14} /> + New Squad
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
            {teams.map((t) => {
              const isActive = t.id === activeTeamId;
              return (
                <div
                  key={t.id}
                  style={{
                    background: isActive ? 'rgba(255, 107, 53, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${isActive ? 'var(--accent-orange)' : 'var(--border-glass)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Jersey Palette Dots */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: t.primaryColor || '#ff6b35',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      />
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: t.secondaryColor || '#1e3a8a',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                          {t.teamName || 'Volleyball Team'}
                        </span>
                        {isActive && (
                          <span
                            style={{
                              background: 'var(--accent-orange)',
                              color: '#ffffff',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em'
                            }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Season: {t.season || '2026'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {!isActive ? (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          onSelectTeam(t.id);
                          onClose();
                        }}
                        style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem' }}
                      >
                        Switch
                      </button>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          color: '#34d399',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          padding: '0.35rem 0.5rem'
                        }}
                      >
                        <Check size={16} /> Current
                      </div>
                    )}

                    {onDuplicateTeam && (
                      <button
                        type="button"
                        className="btn-icon btn-sm"
                        onClick={() => onDuplicateTeam(t)}
                        title="Duplicate Team"
                        aria-label="Duplicate Team"
                      >
                        <Copy size={14} />
                      </button>
                    )}

                    {teams.length > 1 && onDeleteTeam && (
                      <button
                        type="button"
                        className="btn-icon btn-sm"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${t.teamName}"?`)) {
                            onDeleteTeam(t.id);
                          }
                        }}
                        title="Delete Team"
                        aria-label="Delete Team"
                        style={{ color: '#f87171' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create View */}
        {view === 'create' && (
          <form onSubmit={handleCreateNew} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="form-label">Team / Squad Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. CVA Blue - 10th or Varsity Squad"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Season / League</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2026 - 2027 Club Season"
                value={newSeason}
                onChange={(e) => setNewSeason(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Primary Jersey</label>
                <input
                  type="color"
                  className="form-input"
                  style={{ height: '38px', padding: '2px', cursor: 'pointer' }}
                  value={newPrimaryColor}
                  onChange={(e) => setNewPrimaryColor(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Secondary Color</label>
                <input
                  type="color"
                  className="form-input"
                  style={{ height: '38px', padding: '2px', cursor: 'pointer' }}
                  value={newSecondaryColor}
                  onChange={(e) => setNewSecondaryColor(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Libero Jersey</label>
                <input
                  type="color"
                  className="form-input"
                  style={{ height: '38px', padding: '2px', cursor: 'pointer' }}
                  value={newLiberoColor}
                  onChange={(e) => setNewLiberoColor(e.target.value)}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-glass)'
              }}
            >
              <input
                type="checkbox"
                id="cloneRosterCheck"
                checked={cloneCurrentRoster}
                onChange={(e) => setCloneCurrentRoster(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-orange)', cursor: 'pointer' }}
              />
              <label htmlFor="cloneRosterCheck" style={{ fontSize: '0.82rem', color: '#ffffff', cursor: 'pointer' }}>
                Copy current roster players to this new team
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setView('list')}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Plus size={16} /> Create Squad
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
