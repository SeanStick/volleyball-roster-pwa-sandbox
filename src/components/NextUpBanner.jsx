import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Zap,
  ArrowRight,
  Shield,
  Sparkles,
  Users,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import VolleyballIcon from './icons/VolleyballIcon';

/**
 * NextUpBanner - Sideline Anticipation & Side-Out Tactical Banner
 * 
 * In high-speed volleyball matches, coaches constantly plan ahead:
 * - "Who is serving if we side out right now?"
 * - "Who is our front row on the next sideout?"
 * - "Do we have 2 or 3 front-row hitters (Setter in front or back)?"
 */
export default function NextUpBanner({
  lineup = {},
  roster = [],
  rotation = 1,
  phase = 'serve', // 'serve' | 'receive'
  liberoServingRotation = null,
  liberoExchanges = {},
  onNavigateTab = null
}) {
  const [isExpanded, setIsExpanded] = useState(() => {
    try {
      const saved = localStorage.getItem('gostandoverthere_next_up_expanded');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleExpanded = () => {
    setIsExpanded(prev => {
      const next = !prev;
      try {
        localStorage.setItem('gostandoverthere_next_up_expanded', String(next));
      } catch {}
      return next;
    });
  };

  const getPlayer = (id) => roster.find(p => p.id === id);

  const isReceiving = phase === 'receive';
  const nextRotation = (rotation % 6) + 1;

  // Compute Upcoming Rotated Lineup on Sideout:
  // Zone 2 -> Zone 1 (Server)
  // Zone 3 -> Zone 2 (Right Front)
  // Zone 4 -> Zone 3 (Middle Front)
  // Zone 5 -> Zone 4 (Left Front) -- note: if pos5 was Libero, original MB returns!
  // Zone 6 -> Zone 5 (Left Back)
  // Zone 1 -> Zone 6 (Middle Back)
  const sideoutLineup = useMemo(() => {
    if (!lineup) return {};

    // Check Libero front-row exit rule:
    // If player in pos5 is Libero, they cannot rotate to pos4 (front row).
    // The replaced player returns to pos4.
    let pos4PlayerId = lineup.pos5;
    const pos5Player = getPlayer(pos4PlayerId);
    if (pos5Player && (pos5Player.position === 'Libero' || pos5Player.isLibero)) {
      const originalMBId = liberoExchanges[pos5Player.id];
      if (originalMBId) {
        pos4PlayerId = originalMBId;
      }
    }

    return {
      pos1: lineup.pos2 || null, // Server
      pos2: lineup.pos3 || null, // Right Front
      pos3: lineup.pos4 || null, // Middle Front
      pos4: pos4PlayerId || null, // Left Front
      pos5: lineup.pos6 || null, // Left Back
      pos6: lineup.pos1 || null  // Middle Back
    };
  }, [lineup, liberoExchanges, roster]);

  // Determine Server on Sideout
  const sideoutServerPlayer = useMemo(() => {
    // Check if Libero is designated to serve in the upcoming rotation
    const teamLibero = roster.find(p => p.position === 'Libero' || p.isLibero);
    if (teamLibero && liberoServingRotation === nextRotation) {
      return teamLibero;
    }
    return getPlayer(sideoutLineup.pos1);
  }, [sideoutLineup, liberoServingRotation, nextRotation, roster]);

  // Current Server (when serving)
  const currentServerPlayer = useMemo(() => {
    const teamLibero = roster.find(p => p.position === 'Libero' || p.isLibero);
    if (teamLibero && liberoServingRotation === rotation) {
      return teamLibero;
    }
    return getPlayer(lineup.pos1);
  }, [lineup, liberoServingRotation, rotation, roster]);

  // Front Row Hitters
  const relevantFrontRow = useMemo(() => {
    if (isReceiving) {
      // On sideout: pos4 (LF), pos3 (MF), pos2 (RF)
      return [
        { zone: 'LF', roman: 'IV', player: getPlayer(sideoutLineup.pos4) },
        { zone: 'MF', roman: 'III', player: getPlayer(sideoutLineup.pos3) },
        { zone: 'RF', roman: 'II', player: getPlayer(sideoutLineup.pos2) }
      ];
    } else {
      // Current front row when serving
      return [
        { zone: 'LF', roman: 'IV', player: getPlayer(lineup.pos4) },
        { zone: 'MF', roman: 'III', player: getPlayer(lineup.pos3) },
        { zone: 'RF', roman: 'II', player: getPlayer(lineup.pos2) }
      ];
    }
  }, [isReceiving, sideoutLineup, lineup, roster]);

  // Offensive Attack Type (2-Hitter vs 3-Hitter attack)
  const attackAnalysis = useMemo(() => {
    const targetLineup = isReceiving ? sideoutLineup : lineup;
    const backRowIds = [targetLineup.pos1, targetLineup.pos6, targetLineup.pos5].filter(Boolean);
    const frontRowIds = [targetLineup.pos4, targetLineup.pos3, targetLineup.pos2].filter(Boolean);

    const backRowPlayers = backRowIds.map(getPlayer).filter(Boolean);
    const frontRowPlayers = frontRowIds.map(getPlayer).filter(Boolean);

    const hasBackRowSetter = backRowPlayers.some(p => p.position === 'Setter' || p.secondaryPosition === 'Setter');
    const hasFrontRowSetter = frontRowPlayers.some(p => p.position === 'Setter');

    if (hasBackRowSetter) {
      return {
        type: '3-Hitter',
        label: '3-Hitter Attack',
        subtext: 'Setter in back row (3 front-row hitters)',
        isOptimal: true
      };
    } else if (hasFrontRowSetter) {
      return {
        type: '2-Hitter',
        label: '2-Hitter Attack',
        subtext: 'Setter in front row (2 hitters + setter dump)',
        isOptimal: false
      };
    } else {
      return {
        type: 'Standard',
        label: 'Front Row Ready',
        subtext: 'Standard attacking formation',
        isOptimal: true
      };
    }
  }, [isReceiving, sideoutLineup, lineup, roster]);

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95))',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '12px',
        padding: '0.45rem 0.75rem',
        marginBottom: '0.75rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
        transition: 'all 0.2s ease',
        userSelect: 'none'
      }}
    >
      {/* Compact Main Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}
      >
        {/* Left: Server / Next Up Capsule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: isReceiving ? 'rgba(56, 189, 248, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: `1px solid ${isReceiving ? 'rgba(56, 189, 248, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
              padding: '0.22rem 0.55rem',
              borderRadius: '999px',
              fontSize: '0.76rem',
              fontWeight: 800,
              color: isReceiving ? '#38bdf8' : '#34d399'
            }}
          >
            <VolleyballIcon size={13} />
            <span>
              {isReceiving ? `On Sideout (Rot ${nextRotation}):` : `Now Serving (Rot ${rotation}):`}
            </span>
            <strong style={{ color: '#ffffff', fontWeight: 900 }}>
              {isReceiving
                ? sideoutServerPlayer ? `#${sideoutServerPlayer.number} ${sideoutServerPlayer.name.split(' ')[0]}` : 'Vacant'
                : currentServerPlayer ? `#${currentServerPlayer.number} ${currentServerPlayer.name.split(' ')[0]}` : 'Vacant'
              }
            </strong>
          </div>

          {/* Front Row Hitters Quick Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              color: '#cbd5e1'
            }}
          >
            <span style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Front:
            </span>
            {relevantFrontRow.map((slot, idx) => (
              <span
                key={slot.zone}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
                title={`${slot.zone} (${slot.roman}): ${slot.player?.name || 'Vacant'} (${slot.player?.position || ''})`}
              >
                <strong style={{ color: '#38bdf8' }}>
                  {slot.player ? `#${slot.player.number}` : '--'}
                </strong>
                <span style={{ color: '#e2e8f0', fontSize: '0.68rem' }}>
                  {slot.player?.position ? slot.player.position.slice(0, 2) : ''}
                </span>
                {idx < 2 && <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Attack System Badge & Expand Chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Offensive System Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '999px',
              fontSize: '0.7rem',
              fontWeight: 800,
              background: attackAnalysis.isOptimal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${attackAnalysis.isOptimal ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
              color: attackAnalysis.isOptimal ? '#6ee7b7' : '#fcd34d'
            }}
            title={attackAnalysis.subtext}
          >
            <Zap size={11} />
            <span>{attackAnalysis.label}</span>
          </div>

          {/* Toggle Details Chevron */}
          <button
            type="button"
            onClick={toggleExpanded}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0.22rem 0.5rem',
              color: '#cbd5e1',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={isExpanded ? 'Collapse rotation preview' : 'Expand full rotational breakdown'}
          >
            <span>{isExpanded ? 'Hide' : 'Details'}</span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Expanded Rotational Preview Card */}
      {isExpanded && (
        <div
          style={{
            marginTop: '0.65rem',
            paddingTop: '0.6rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={13} />
              <span>
                {isReceiving
                  ? `Upcoming Floor Layout on Sideout (Rotation ${nextRotation})`
                  : `Current Floor Layout (Rotation ${rotation})`}
              </span>
            </div>

            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('formations')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#93c5fd',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <span>View Serve-Receive Formations</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>

          {/* Mini 6-Zone Floor Breakdown Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.4rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '0.5rem'
            }}
          >
            {/* Top Row (Net / Front Row: IV, III, II) */}
            {[
              { zoneKey: 'pos4', roman: 'IV', label: 'LF' },
              { zoneKey: 'pos3', roman: 'III', label: 'MF' },
              { zoneKey: 'pos2', roman: 'II', label: 'RF' },
              { zoneKey: 'pos5', roman: 'V', label: 'LB' },
              { zoneKey: 'pos6', roman: 'VI', label: 'MB' },
              { zoneKey: 'pos1', roman: 'I', label: 'RB (Server)' }
            ].map((box) => {
              const activeSourceLineup = isReceiving ? sideoutLineup : lineup;
              const pId = activeSourceLineup[box.zoneKey];
              const p = getPlayer(pId);
              const isServer = box.zoneKey === 'pos1';

              return (
                <div
                  key={box.zoneKey}
                  style={{
                    background: isServer
                      ? 'rgba(16, 185, 129, 0.15)'
                      : box.zoneKey === 'pos4' || box.zoneKey === 'pos3' || box.zoneKey === 'pos2'
                      ? 'rgba(56, 189, 248, 0.1)'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isServer ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '8px',
                    padding: '0.35rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.62rem', color: '#64748b', fontWeight: 800 }}>
                    <span style={{ color: isServer ? '#34d399' : '#38bdf8' }}>{box.roman}</span>
                    <span>{box.label}</span>
                  </div>
                  <strong style={{ fontSize: '1.05rem', color: '#ffffff', fontFamily: 'var(--font-jersey, Impact, sans-serif)', marginTop: '0.1rem' }}>
                    {p ? `#${p.number}` : '--'}
                  </strong>
                  <span style={{ fontSize: '0.68rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                    {p ? p.name.split(' ')[0] : 'Empty'}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', marginTop: '0.1rem' }}>
                    {p ? p.position : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Tactical Note */}
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ color: '#38bdf8' }}>💡 Coach Tip:</span>
            <span>
              {isReceiving
                ? `Winning this rally rotates your team to Rotation ${nextRotation} with #${sideoutServerPlayer?.number || '--'} serving.`
                : `Currently serving in Rotation ${rotation}. Sideout by opponent will switch to receive before next rotation.`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
