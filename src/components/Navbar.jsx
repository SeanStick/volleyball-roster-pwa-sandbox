import React from 'react';
import { Plus, Database, Layers, Share2, Dumbbell, PenTool } from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';
import UserMenu from './UserMenu';

export default function Navbar({
  onOpenAddModal,
  onOpenImportExportModal,
  onOpenMatchWizard,
  onOpenLineupStudio,
  onOpenDrillsModal,
  onOpenWhiteboard,
  user,
  syncStatus,
  lastSyncTime,
  activeTeam,
  lastScoreEvent,
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
          <VolleyballIcon size={20} color="#ffffff" />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          {/* App Title */}
          <div className="brand-title">
            Go Stand Over There
          </div>
          
          {/* Team Name Subtitle / Switcher */}
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
                gap: '4px',
                cursor: 'pointer',
                textAlign: 'left',
                maxWidth: '100%'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: activeTeam.primaryColor || '#ff6b35',
                  display: 'inline-block',
                  flexShrink: 0
                }}
              />
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {activeTeam.teamName || 'CVA Black - 9th'} {activeTeam.season ? `(${activeTeam.season})` : ''}
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="header-actions">
        {/* 📋 TACTICAL WHITEBOARD BUTTON (Desktop/Tablet) */}
        {onOpenWhiteboard && (
          <button
            type="button"
            className="btn btn-sm hide-mobile"
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

        {/* 🎯 DRILLS & PRACTICE HUB BUTTON (Desktop/Tablet) */}
        {onOpenDrillsModal && (
          <button
            type="button"
            className="btn btn-sm hide-mobile"
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

        {/* Share Squad Quick Action (Desktop Only) */}
        {activeTeam && onOpenShareModal && (
          <button
            className="btn-icon hide-mobile"
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

        {/* User Menu, Coaching Tools & Cloud Sync Pill */}
        <UserMenu
          user={user}
          syncStatus={syncStatus}
          lastSyncTime={lastSyncTime}
          activeTeam={activeTeam}
          lastScoreEvent={lastScoreEvent}
          onOpenAuthModal={onOpenAuthModal}
          onOpenTeamManagerModal={onOpenTeamManagerModal}
          onOpenShareModal={onOpenShareModal}
          onOpenFirebaseSettingsModal={onOpenFirebaseSettingsModal}
          onOpenMatchWizard={onOpenMatchWizard}
          onOpenLineupStudio={onOpenLineupStudio}
          onOpenWhiteboard={onOpenWhiteboard}
          onOpenDrills={onOpenDrillsModal}
          onManualSync={onManualSync}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
