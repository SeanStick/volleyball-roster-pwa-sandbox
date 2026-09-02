import React from 'react';
import { Plus, Database, Volleyball, Layers, Share2, Dumbbell, PenTool } from 'lucide-react';
import UserMenu from './UserMenu';

export default function Navbar({
  onOpenAddModal,
  onOpenImportExportModal,
  onOpenMatchWizard,
  onOpenDrillsModal,
  onOpenWhiteboard,
  user,
  syncStatus,
  lastSyncTime,
  activeTeam,
  onOpenAuthModal,
  onOpenTeamManagerModal,
  onOpenShareModal,
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
              title="Click to manage, share or switch squads"
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
        {/* ⚡ PROMINENT START GAME / MATCH WIZARD BUTTON */}
        {onOpenMatchWizard && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={onOpenMatchWizard}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderColor: '#10b981',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)',
              cursor: 'pointer'
            }}
            title="Start New Volleyball Game & Lineup Wizard"
          >
            <Volleyball size={15} />
            <span>Start Game</span>
          </button>
        )}

        {/* 📋 TACTICAL WHITEBOARD BUTTON */}
        {onOpenWhiteboard && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={onOpenWhiteboard}
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.35))',
              border: '1px solid rgba(59, 130, 246, 0.5)',
              color: '#93c5fd',
              fontWeight: 800,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            title="Open Tactical Volleyball Whiteboard & Chalkboard"
          >
            <PenTool size={15} color="#60a5fa" />
            <span>Board</span>
          </button>
        )}

        {/* 🎯 DRILLS & PRACTICE HUB BUTTON */}
        {onOpenDrillsModal && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={onOpenDrillsModal}
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(147, 51, 234, 0.35))',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              color: '#e9d5ff',
              fontWeight: 800,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            title="Open Volleyball Drills & Animated Practice Hub"
          >
            <Dumbbell size={15} color="#c084fc" />
            <span>Drills</span>
          </button>
        )}

        {/* Share Squad Quick Action */}
        {activeTeam && onOpenShareModal && (
          <button
            className="btn-icon"
            onClick={() => onOpenShareModal(activeTeam)}
            title="Share Squad & Invite Co-Coaches"
            aria-label="Share Squad"
            style={{ color: 'var(--accent-orange)' }}
          >
            <Share2 size={18} />
          </button>
        )}

        {/* Import / Export Modal Trigger (Desktop Only) */}
        <button
          className="btn-icon hide-mobile"
          onClick={onOpenImportExportModal}
          title="Backup & Import Roster"
          aria-label="Backup and Import Roster"
        >
          <Database size={18} />
        </button>

        {/* User Menu & Cloud Sync Pill */}
        <UserMenu
          user={user}
          syncStatus={syncStatus}
          lastSyncTime={lastSyncTime}
          activeTeam={activeTeam}
          onOpenAuthModal={onOpenAuthModal}
          onOpenTeamManagerModal={onOpenTeamManagerModal}
          onOpenShareModal={onOpenShareModal}
          onOpenFirebaseSettingsModal={onOpenFirebaseSettingsModal}
          onManualSync={onManualSync}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
