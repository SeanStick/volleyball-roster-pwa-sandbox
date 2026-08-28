import React from 'react';
import { ArrowLeftRight, X, ShieldAlert, CheckCircle, AlertCircle, Shield, Sparkles } from 'lucide-react';
import {
  ZONE_LABELS,
  FRONT_ROW_ZONES,
  BACK_ROW_ZONES,
  checkSubstitutionLegality
} from '../services/volleyballRules';

export default function SubModal({
  isOpen,
  onClose,
  targetZoneKey,
  currentLineup,
  roster,
  subHistory = [],
  onExecuteSub,
  maxSubs = 12,
  enforcePositionLock = false
}) {
  if (!isOpen || !targetZoneKey) return null;

  const zoneInfo = ZONE_LABELS[targetZoneKey];
  const isFrontRow = FRONT_ROW_ZONES.includes(targetZoneKey);
  const currentOccupantId = currentLineup[targetZoneKey];
  const currentOccupant = roster.find(p => p.id === currentOccupantId);

  // Bench players (those not on the court)
  const courtPlayerIds = Object.values(currentLineup).filter(Boolean);
  const benchPlayers = roster.filter(p => !courtPlayerIds.includes(p.id));

  // Count subs used
  const regularSubsUsed = subHistory.filter(s => !s.isLiberoExchange).length;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1050 }}>
      <div
        className="modal-content sub-modal"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-orange), #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
            }}>
              <ArrowLeftRight size={20} color="#ffffff" />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.15rem' }}>
                Player Substitution — Zone {zoneInfo?.num} ({zoneInfo?.name})
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {isFrontRow ? '🔴 Front-Row Position (Attack Zone)' : '🟢 Back-Row Position (Defense Zone)'}
              </p>
            </div>
          </div>
          <button className="btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Current Occupant Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700 }}>
              Currently on Court in Zone {zoneInfo?.num}
            </div>
            {currentOccupant ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.3rem' }}>
                <span className={`jersey-badge ${currentOccupant.position === 'Libero' ? 'libero-num' : ''}`}>
                  #{currentOccupant.number}
                </span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                  {currentOccupant.name}
                </span>
                <span className="badge-status" style={{ fontSize: '0.72rem' }}>
                  {currentOccupant.position}
                </span>
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Slot is currently empty (+ Assign Player)
              </div>
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Set Subs Count</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: regularSubsUsed >= maxSubs ? '#ef4444' : '#60a5fa' }}>
              {regularSubsUsed} / {maxSubs} Used
            </div>
          </div>
        </div>

        {/* Rule Notes */}
        {isFrontRow ? (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.6rem 0.85rem',
            marginBottom: '1rem',
            fontSize: '0.78rem',
            color: '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <ShieldAlert size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            <span><strong>Rule 19.3:</strong> Liberos are strictly prohibited in the front row (Zones 4, 3, 2).</span>
          </div>
        ) : (
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.6rem 0.85rem',
            marginBottom: '1rem',
            fontSize: '0.78rem',
            color: '#c4b5fd',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Sparkles size={16} color="#a78bfa" style={{ flexShrink: 0 }} />
            <span><strong>Back Row:</strong> Libero replacements are free exchanges (not counted towards set sub limits).</span>
          </div>
        )}

        {/* Bench Substitutes Selection List */}
        <div>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#ffffff',
            marginBottom: '0.75rem'
          }}>
            Available Substitutes on Bench ({benchPlayers.length})
          </div>

          {benchPlayers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              background: 'rgba(15, 23, 42, 0.5)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem'
            }}>
              No players currently on the bench. Add more players in the Roster tab to enable substitutions.
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              maxHeight: '280px',
              overflowY: 'auto',
              paddingRight: '4px'
            }}>
              {benchPlayers.map(player => {
                const legality = checkSubstitutionLegality(
                  player,
                  targetZoneKey,
                  currentLineup,
                  subHistory,
                  { maxSubs, enforcePositionLock }
                );

                const isLibero = player.position === 'Libero' || player.isLibero;

                return (
                  <div
                    key={player.id}
                    className={`sub-player-row ${legality.isLegal ? 'is-legal' : 'is-illegal'}`}
                    style={{
                      background: legality.isLegal ? 'rgba(30, 41, 59, 0.7)' : 'rgba(30, 20, 20, 0.4)',
                      border: `1px solid ${legality.isLegal ? (legality.isLiberoExchange ? '#8b5cf6' : 'var(--border-glass)') : 'rgba(239, 68, 68, 0.4)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: legality.isLegal ? 1 : 0.65,
                      cursor: legality.isLegal ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => {
                      if (legality.isLegal) {
                        onExecuteSub(targetZoneKey, player, currentOccupant, legality.isLiberoExchange);
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className={`jersey-badge ${isLibero ? 'libero-num' : ''}`}>
                        #{player.number}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.92rem' }}>
                          {player.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                          <span className="badge-position" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                            {player.position}
                          </span>
                          {player.height && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                              {player.height}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {legality.isLegal ? (
                        <button
                          className="btn btn-sm"
                          style={{
                            background: legality.isLiberoExchange ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'linear-gradient(135deg, var(--accent-orange), #ea580c)',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.78rem'
                          }}
                        >
                          <CheckCircle size={14} />
                          {legality.isLiberoExchange ? 'Libero Exchange' : 'Sub In'}
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f87171', fontSize: '0.74rem', maxWidth: '240px', textAlign: 'right' }}>
                          <AlertCircle size={14} style={{ flexShrink: 0 }} />
                          <span>{legality.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Clear slot option */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {currentOccupant ? (
            <button
              className="btn btn-secondary btn-sm"
              style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
              onClick={() => onExecuteSub(targetZoneKey, null, currentOccupant, false)}
            >
              Clear Zone Slot
            </button>
          ) : <div />}

          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
