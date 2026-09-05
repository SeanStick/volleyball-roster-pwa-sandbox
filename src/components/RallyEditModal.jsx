import React, { useState } from 'react';
import {
  X,
  Edit3,
  Trophy,
  AlertTriangle,
  ArrowRightLeft,
  Trash2,
  Check,
  Sparkles,
  Flame,
  Shield,
  Clock
} from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';
import { POINT_EARNED_TYPES, VOLLEYBALL_ERRORS } from '../services/matchStatsService';

export default function RallyEditModal({
  isOpen,
  onClose,
  point,
  roster = [],
  courtLineup = {},
  onSavePoint,
  onDeletePoint
}) {
  if (!isOpen || !point) return null;

  const [pointWonBy, setPointWonBy] = useState(point.pointWonBy || 'us');
  const [earnedType, setEarnedType] = useState(point.earnedType || 'kill');
  const [earnedPlayerId, setEarnedPlayerId] = useState(point.earnedPlayerId || null);
  const [errorTypeId, setErrorTypeId] = useState(point.errorTypeId || 'unspecified_error');
  const [errorPlayerId, setErrorPlayerId] = useState(point.errorPlayerId || null);
  const [isOverturned, setIsOverturned] = useState(false);

  const isUs = pointWonBy === 'us';

  // Handle referee overturn flip
  const handleToggleOverturn = () => {
    const nextWinner = pointWonBy === 'us' ? 'opponent' : 'us';
    setPointWonBy(nextWinner);
    setIsOverturned(prev => !prev);
  };

  const handleSave = () => {
    const earnedPlayer = roster.find(p => p.id === earnedPlayerId);
    const errorPlayer = roster.find(p => p.id === errorPlayerId);
    const errorDef = VOLLEYBALL_ERRORS.find(e => e.id === errorTypeId);
    const earnedDef = POINT_EARNED_TYPES.find(e => e.id === earnedType);

    const updatedPoint = {
      ...point,
      pointWonBy,
      earnedType: isUs ? earnedType : null,
      earnedTypeName: isUs ? (earnedDef?.label || earnedType) : null,
      earnedPlayerId: isUs ? (earnedPlayer?.id || null) : null,
      earnedPlayerName: isUs ? (earnedPlayer?.name || null) : null,
      earnedPlayerNumber: isUs ? (earnedPlayer?.number || null) : null,
      errorTypeId: !isUs ? errorTypeId : null,
      errorTypeName: !isUs ? (errorDef?.label || errorTypeId) : null,
      errorCategory: !isUs ? (errorDef?.category || null) : null,
      errorPlayerId: !isUs ? (errorPlayer?.id || null) : null,
      errorPlayerName: !isUs ? (errorPlayer?.name || null) : null,
      errorPlayerNumber: !isUs ? (errorPlayer?.number || null) : null,
      isOverturned
    };

    onSavePoint(point.id, updatedPoint, isOverturned);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 24, 0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem',
        animation: 'fadeIn 0.15s ease-out'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          backgroundColor: '#0f172a',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '0.9rem 1.15rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: isUs
              ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(15, 23, 42, 0.7))'
              : 'linear-gradient(90deg, rgba(239, 68, 68, 0.2), rgba(15, 23, 42, 0.7))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isUs ? '#10b981' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Edit3 size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 900, color: '#f8fafc' }}>
                Edit Rally / Overturn Call
              </h3>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Set {point.setNumber || 1} • Rot #{point.rotation || 1} • {new Date(point.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: '1rem 1.15rem',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem'
          }}
        >
          {/* Referee Overturn Action Banner */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: isUs ? '#a7f3d0' : '#fca5a5' }}>
                Point Awarded To: <strong>{isUs ? 'Our Squad (US)' : 'Opponent (THEM)'}</strong>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Ref reversed call or touched out? Tap to flip
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleOverturn}
              style={{
                background: isUs ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                border: isUs ? '1px solid #ef4444' : '1px solid #10b981',
                color: isUs ? '#fca5a5' : '#a7f3d0',
                fontWeight: 800,
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <ArrowRightLeft size={13} />
              <span>Flip to {isUs ? 'Opponent' : 'Us'}</span>
            </button>
          </div>

          {/* Point Attributes (Us) */}
          {isUs ? (
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#93c5fd', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Earned Point Type:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.85rem' }}>
                {[
                  { id: 'kill', label: 'Kill', icon: '💥' },
                  { id: 'ace', label: 'Ace', icon: '🏐' },
                  { id: 'block', label: 'Block', icon: '🧱' },
                  { id: 'opp_error', label: 'Opp Error', icon: '❌' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEarnedType(item.id)}
                    style={{
                      padding: '0.5rem 0.25rem',
                      borderRadius: '8px',
                      border: earnedType === item.id ? '1.5px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: earnedType === item.id ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      color: earnedType === item.id ? '#93c5fd' : '#cbd5e1',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.15rem'
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Player Attribution */}
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                Select Player Credited:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.35rem' }}>
                {roster.map((p) => {
                  const isSelected = earnedPlayerId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setEarnedPlayerId(isSelected ? null : p.id)}
                      style={{
                        padding: '0.4rem 0.5rem',
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: isSelected ? '#a7f3d0' : '#f1f5f9',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      #{p.number} {p.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Opponent Error Attributes */
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fca5a5', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Error Category:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem', marginBottom: '0.85rem' }}>
                {[
                  { id: 'missed_serve_net', label: 'Missed Serve', icon: '🏐' },
                  { id: 'spike_out', label: 'Attack Out / Net', icon: '💥' },
                  { id: 'pass_over_out', label: 'Pass / Receive Error', icon: '🎯' },
                  { id: 'net_touch', label: 'Net Violation', icon: '⚠️' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setErrorTypeId(item.id)}
                    style={{
                      padding: '0.5rem 0.5rem',
                      borderRadius: '8px',
                      border: errorTypeId === item.id ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                      background: errorTypeId === item.id ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      color: errorTypeId === item.id ? '#fca5a5' : '#cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
                Player Responsible (Optional):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.35rem' }}>
                {roster.map((p) => {
                  const isSelected = errorPlayerId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setErrorPlayerId(isSelected ? null : p.id)}
                      style={{
                        padding: '0.4rem 0.5rem',
                        borderRadius: '8px',
                        border: isSelected ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isSelected ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: isSelected ? '#fca5a5' : '#f1f5f9',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      #{p.number} {p.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.75rem 1.15rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.95)'
          }}
        >
          {onDeletePoint ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this point from rally history?')) {
                  onDeletePoint(point.id);
                  onClose();
                }
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Trash2 size={13} />
              <span>Delete Point</span>
            </button>
          ) : <div />}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary btn-sm"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '0.4rem 1rem'
              }}
            >
              Save Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
