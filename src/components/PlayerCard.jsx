import React from 'react';
import { Star, Edit3, Trash2, Copy, Shield, Award, Volleyball } from 'lucide-react';

const POSITION_CLASSES = {
  'Setter': 'pos-setter',
  'Outside Hitter': 'pos-outside',
  'Middle Blocker': 'pos-middle',
  'Libero': 'pos-libero',
  'Opposite Hitter': 'pos-opposite',
  'Right Side': 'pos-opposite',
  'Defensive Specialist': 'pos-ds',
  'Serving Specialist': 'pos-ds',
};

export default function PlayerCard({ player, onEdit, onDelete, onDuplicate, roster = [] }) {
  const isLibero = player.position === 'Libero';
  const posClass = POSITION_CLASSES[player.position] || 'pos-outside';
  const subPartner = player.subPartnerId ? roster.find(p => p.id === player.subPartnerId) : null;

  return (
    <div className={`player-card ${player.isCaptain ? 'is-captain' : ''} ${isLibero ? 'is-libero' : ''}`}>
      <div className="card-top">
        <div className={`jersey-badge-lg ${isLibero ? 'libero-num' : ''}`}>
          #{player.number}
        </div>
        
        <div className="card-actions">
          <button
            className="btn-icon btn-sm"
            onClick={() => onDuplicate(player)}
            title="Duplicate Player"
            aria-label="Duplicate Player"
          >
            <Copy size={14} />
          </button>
          <button
            className="btn-icon btn-sm"
            onClick={() => onEdit(player)}
            title="Edit Player"
            aria-label="Edit Player"
          >
            <Edit3 size={14} />
          </button>
          <button
            className="btn-icon btn-sm"
            style={{ color: '#ef4444' }}
            onClick={() => onDelete(player.id)}
            title="Delete Player"
            aria-label="Delete Player"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="player-identity">
        <div className="player-name">
          <span>{player.name}</span>
          {player.isCaptain && (
            <Star size={16} className="captain-star" fill="#f59e0b" title="Team Captain" />
          )}
          {player.isStarter && (
            <Award size={15} color="#10b981" title="Starting Lineup" />
          )}
          {player.isFirstServer && (
            <Volleyball size={15} color="#38bdf8" title="Designated First Server" />
          )}
        </div>

        <div className="player-meta-badges">
          <span className={`badge-position ${posClass}`}>
            {player.position}
          </span>
          {player.secondaryPosition && (
            <span className="badge-status">
              2nd: {player.secondaryPosition}
            </span>
          )}
          {player.isStarter && (
            <span className="badge-status" style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.15)' }}>
              Starter
            </span>
          )}
          {player.isFirstServer && (
            <span className="badge-status" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              1st Server
            </span>
          )}
          {subPartner && (
            <span className="badge-status" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              🔄 Sub for #{subPartner.number} ({player.subTrigger === 'back_row' ? 'Back' : player.subTrigger === 'serving' ? 'Serve' : 'Front'})
            </span>
          )}
        </div>
      </div>

      {player.notes && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
          "{player.notes}"
        </p>
      )}

      <div className="player-details">
        <span>Height: <strong>{player.height || '—'}</strong></span>
        <span className="badge-status">{player.status || 'Active'}</span>
      </div>
    </div>
  );
}
