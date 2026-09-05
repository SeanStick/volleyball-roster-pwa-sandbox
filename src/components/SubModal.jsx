import React from 'react';
import { ArrowLeftRight, X, ShieldAlert, CheckCircle, AlertCircle, Shield, Sparkles, Lock, Star } from 'lucide-react';
import {
  ZONE_LABELS,
  FRONT_ROW_ZONES,
  BACK_ROW_ZONES,
  checkSubstitutionLegality,
  getSubstitutionPairLocks
} from '../services/volleyballRules';

export default function SubModal({
  isOpen,
  onClose,
  targetZoneKey,
  currentLineup,
  roster,
  startingLineup = {},
  subHistory = [],
  onExecuteSub,
  maxSubs = 12,
  enforcePositionLock = false,
  onTogglePositionLock
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

  // Pair Locks under USAV Rule 15.6 / NFHS Rule 10-3
  const { playerToStarter } = getSubstitutionPairLocks(subHistory, startingLineup, roster);
  const currentOccupantStarterId = currentOccupant ? (playerToStarter.get(currentOccupant.id) || currentOccupant.id) : null;
  const designatedPartner = currentOccupantStarterId ? benchPlayers.find(p => playerToStarter.get(p.id) === currentOccupantStarterId) : null;

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

        {/* Current Occupant Card with Pair Lock Status */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1rem',
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

        {/* Designated Legal Partner Card (USAV Rule 15.6) */}
        {designatedPartner && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(180, 83, 9, 0.25) 100%)',
              border: '1.5px solid #f59e0b',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.65rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.88rem'
                }}
              >
                #{designatedPartner.number}
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fcd34d', textTransform: 'uppercase' }}>
                  ⭐ USAV Rule 15.6 Designated Partner
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#ffffff' }}>
                  {designatedPartner.name} ({designatedPartner.position})
                </div>
                <div style={{ fontSize: '0.7rem', color: '#fde68a' }}>
                  Tied with #{currentOccupant?.number} {currentOccupant?.name?.split(' ')[0]} in this rotational slot
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onExecuteSub(targetZoneKey, designatedPartner, currentOccupant, false)}
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#0f172a',
                fontWeight: 900,
                border: 'none',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
                whiteSpace: 'nowrap'
              }}
            >
              <CheckCircle size={14} />
              <span>Legal Sub In</span>
            </button>
          </div>
        )}

        {/* Rule Notes & Strict Sub Lock Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            {isFrontRow ? (
              <span style={{ color: '#fca5a5' }}><strong>Rule 19.3:</strong> Liberos prohibited in front row</span>
            ) : (
              <span style={{ color: '#c4b5fd' }}><strong>Back Row:</strong> Libero replacement is a free exchange</span>
            )}
          </div>

          {onTogglePositionLock && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.74rem', color: '#f1f5f9' }}>
              <input
                type="checkbox"
                checked={enforcePositionLock}
                onChange={onTogglePositionLock}
                style={{ accentColor: '#f59e0b', width: '14px', height: '14px' }}
              />
              <span style={{ fontWeight: 700 }}>Strict USAV/NFHS Lock</span>
            </label>
          )}
        </div>

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
                  { maxSubs, enforcePositionLock, startingLineup, roster }
                );

                const isLibero = player.position === 'Libero' || player.isLibero;
                const isDesignatedPartner = designatedPartner?.id === player.id;

                return (
                  <div
                    key={player.id}
                    className={`sub-player-row ${legality.isLegal ? 'is-legal' : 'is-illegal'}`}
                    style={{
                      background: isDesignatedPartner
                        ? 'rgba(245, 158, 11, 0.15)'
                        : legality.isLegal ? 'rgba(30, 41, 59, 0.7)' : 'rgba(30, 20, 20, 0.4)',
                      border: `1px solid ${isDesignatedPartner ? '#f59e0b' : legality.isLegal ? (legality.isLiberoExchange ? '#8b5cf6' : 'var(--border-glass)') : 'rgba(239, 68, 68, 0.4)'}`,
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.92rem' }}>
                            {player.name}
                          </span>
                          {isDesignatedPartner && (
                            <span style={{ background: 'rgba(245, 158, 11, 0.25)', border: '1px solid #f59e0b', color: '#fde68a', fontSize: '0.65rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                              ⭐ Legal Partner
                            </span>
                          )}
                          {legality.isPairLocked && (
                            <span style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', fontSize: '0.65rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <Lock size={9} /> Pair Locked
                            </span>
                          )}
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
