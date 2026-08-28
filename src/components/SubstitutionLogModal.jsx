import React from 'react';
import { History, X, Trash2, ArrowRight, Shield, RefreshCw } from 'lucide-react';
import { ZONE_LABELS } from '../services/volleyballRules';

export default function SubstitutionLogModal({
  isOpen,
  onClose,
  subHistory = [],
  onResetHistory,
  maxSubs = 12
}) {
  if (!isOpen) return null;

  const regularSubs = subHistory.filter(s => !s.isLiberoExchange);
  const liberoExchanges = subHistory.filter(s => s.isLiberoExchange);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1050 }}>
      <div
        className="modal-content sub-log-modal"
        style={{ maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <History size={20} color="#ffffff" />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.15rem' }}>
                Set Substitutions Log
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {regularSubs.length} of {maxSubs} Regular Subs Used • {liberoExchanges.length} Libero Exchanges
              </p>
            </div>
          </div>
          <button className="btn-icon btn-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* History List */}
        {subHistory.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem'
          }}>
            No substitutions recorded for this set yet.
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxHeight: '340px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {subHistory.map((entry, idx) => {
              const zoneNum = ZONE_LABELS[entry.zoneKey]?.num || '?';
              return (
                <div
                  key={entry.id || idx}
                  style={{
                    background: entry.isLiberoExchange ? 'rgba(139, 92, 246, 0.1)' : 'rgba(30, 41, 59, 0.6)',
                    border: `1px solid ${entry.isLiberoExchange ? 'rgba(139, 92, 246, 0.3)' : 'var(--border-glass)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.65rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      background: entry.isLiberoExchange ? '#7c3aed' : '#3b82f6',
                      color: '#ffffff'
                    }}>
                      {entry.isLiberoExchange ? 'LIBERO' : `SUB #${entry.subNumber || (idx + 1)}`}
                    </span>

                    <span style={{ color: 'var(--text-secondary)' }}>
                      Zone {zoneNum}:
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                      <span style={{ color: '#f87171' }}>
                        {entry.outgoingPlayerName ? `#${entry.outgoingPlayerNumber} ${entry.outgoingPlayerName}` : '(Empty)'}
                      </span>
                      <ArrowRight size={13} color="var(--text-secondary)" />
                      <span style={{ color: '#34d399' }}>
                        {entry.incomingPlayerName ? `#${entry.incomingPlayerNumber} ${entry.incomingPlayerName}` : '(Cleared)'}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.4)' }}
            onClick={() => {
              if (window.confirm('Reset substitutions for a new set?')) {
                onResetHistory();
              }
            }}
          >
            <RefreshCw size={14} /> New Set / Reset Count
          </button>

          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
