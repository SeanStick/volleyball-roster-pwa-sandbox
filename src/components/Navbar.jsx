import React from 'react';
import { Plus, Database, Volleyball, Layers } from 'lucide-react';
import UserMenu from './UserMenu';

export default function Navbar({
  onOpenAddModal,
  onOpenImportExportModal,
  user,
  syncStatus,
  lastSyncTime,
  activeTeam,
  onOpenAuthModal,
  onOpenTeamManagerModal,
  onOpenFirebaseSettingsModal,
  onManualSync,
  onLogout
}) {
  return (
    <header className="header-glass">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Volleyball size={24} color="#ffffff" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="brand-title">
            Go Stand Over There
          </div>
          {activeTeam && (
            <button
              type="button"
              onClick={onOpenTeamManagerModal}
              className="navbar-team-badge"
              title="Click to manage or switch teams"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: activeTeam.primaryColor || '#ff6b35',
                  display: 'inline-block'
                }}
              />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.02em'
                }}
              >
                {activeTeam.teamName || 'CVA Black - 9th'} ({activeTeam.season || '2026'})
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="header-actions">
        {/* Import / Export Modal Trigger */}
        <button
          className="btn-icon"
          onClick={onOpenImportExportModal}
          title="Backup & Import Roster"
          aria-label="Backup and Import Roster"
        >
          <Database size={18} />
        </button>

        {/* Add Player Action */}
        <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
          <Plus size={16} />
          <span className="hide-mobile">Add Player</span>
        </button>

        {/* User Menu & Cloud Sync Pill */}
        <UserMenu
          user={user}
          syncStatus={syncStatus}
          lastSyncTime={lastSyncTime}
          activeTeam={activeTeam}
          onOpenAuthModal={onOpenAuthModal}
          onOpenTeamManagerModal={onOpenTeamManagerModal}
          onOpenFirebaseSettingsModal={onOpenFirebaseSettingsModal}
          onManualSync={onManualSync}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
