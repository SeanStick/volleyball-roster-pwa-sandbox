import React from 'react';
import { BookOpen, Shield, Award, Sparkles, CheckCircle, AlertTriangle, ArrowRight, User, Volleyball } from 'lucide-react';

export default function FormationTacticsGuide({
  rotationData,
  phase = 'receiving',
  rotation = 1,
  lineup = {},
  roster = []
}) {
  if (!rotationData) return null;

  const isReceive = phase === 'receiving' || phase === 'receive';
  const currentPhaseData = isReceive ? rotationData.receiving : rotationData.serving;

  const getPlayerForRole = (roleText) => {
    if (!lineup || !roster) return null;
    const clean = roleText.toLowerCase();

    // 1. Direct match with positions token zone in current rotation
    if (currentPhaseData?.positions) {
      for (const [roleKey, token] of Object.entries(currentPhaseData.positions)) {
        if (clean.includes(roleKey.toLowerCase()) || clean.includes(token.name?.toLowerCase())) {
          const occupantId = lineup[`pos${token.zone}`];
          if (occupantId) {
            const p = roster.find(player => player.id === occupantId);
            if (p) return p;
          }
        }
      }
    }

    // 2. Fallback search in lineup
    for (const [zoneKey, id] of Object.entries(lineup)) {
      if (!id) continue;
      const p = roster.find(player => player.id === id);
      if (!p) continue;
      if (clean.includes('setter') && p.position === 'Setter') return p;
      if (clean.includes('libero') && (p.position === 'Libero' || p.isLibero)) return p;
      if (clean.includes('opp') && (p.position === 'Opposite Hitter' || p.position === 'Right Side')) return p;
      if (clean.includes('oh1') && p.position === 'Outside Hitter') return p;
      if (clean.includes('oh2') && p.position === 'Outside Hitter') return p;
      if (clean.includes('mb1') && p.position === 'Middle Blocker') return p;
      if (clean.includes('mb2') && p.position === 'Middle Blocker') return p;
    }
    return null;
  };

  const getLastName = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    return parts.length > 1 ? parts[parts.length - 1] : parts[0];
  };

  return (
    <div className="formation-tactics-guide">
      {/* Overview Banner */}
      <div className="guide-overview-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <BookOpen size={18} color="var(--accent-orange)" />
          <h3 style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 800 }}>
            {rotationData.title} — {isReceive ? '🛡️ Serve Receive Stack' : '🏐 Base Defense & Transition'}
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {currentPhaseData?.summary}
        </p>
      </div>

      {/* First Server / Receive Start Callout in Rotation 1 Receive */}
      {rotation === 1 && isReceive && (
        <div style={{
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: '#bae6fd',
          lineHeight: 1.4,
          marginBottom: '1rem'
        }}>
          <Volleyball size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
          <div>
            <strong>1st Side-Out Rotation Rule (USAV 7.3.5.2):</strong> When starting on receive, the team rotates clockwise upon the 1st side-out, bringing the player in <strong>Zone 2 into Zone 1</strong> to take the team's opening serve.
          </div>
        </div>
      )}

      {/* Overlap Rules Callout (Crucial for volleyball rules compliance) */}
      <div className="guide-overlap-callout">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#f59e0b', fontWeight: 800, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
          <AlertTriangle size={15} />
          <span>Official Overlap Constraints (FIVB / USAV Rule 7.4):</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#fef3c7', lineHeight: 1.45 }}>
          {currentPhaseData?.overlapRules}
        </div>
      </div>

      {/* Role Duties Grid */}
      <div className="tactics-roles-grid">
        {currentPhaseData?.tactics?.map((tactic, idx) => {
          const assignedPlayer = getPlayerForRole(tactic.role);
          return (
            <div key={idx} className="tactic-role-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flexShrink: 0 }}>
                <div className="tactic-role-badge">
                  {tactic.role}
                </div>
                {assignedPlayer && (
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: '#93c5fd',
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    padding: '0.1rem 0.35rem',
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}>
                    #{assignedPlayer.number} {getLastName(assignedPlayer.name)}
                  </div>
                )}
              </div>
              <div className="tactic-role-desc">
                {tactic.desc}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
