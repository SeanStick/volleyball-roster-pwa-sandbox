import React, { useState, useEffect } from 'react';
import {
  Printer,
  RotateCcw,
  RefreshCw,
  Trophy,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Calendar,
  Layers,
  Sparkles,
  Trash2,
  Plus,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  Compass,
  Archive,
  BarChart3,
  Check,
  Zap,
  Info,
  Settings
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  computeErrorRankings,
  computeCategoryBreakdown,
  computePlayerStats,
  computeRotationPerformance,
  computeHistoricalAverages,
  generateTacticalSuggestions,
  ERROR_CATEGORIES,
  VOLLEYBALL_ERRORS
} from '../services/matchStatsService';
import { storageService } from '../services/storageService';

export default function MatchStatsView({
  matchStats,
  setMatchStats,
  roster = [],
  teamSettings = {},
  onResetScore,
  onStartNewSet,
  onResetFullMatch,
  onNavigateTab,
  matchHistory = [],
  onArchiveMatch,
  onDeleteMatchHistory,
  onOpenMatchSetup
}) {
  const [selectedSetFilter, setSelectedSetFilter] = useState('ALL');
  const [suggestionFilter, setSuggestionFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'TACTICAL' | 'ROTATION' | 'HISTORICAL'
  const [tableSortKey, setTableSortKey] = useState('totalErrors');
  const [tableSortAsc, setTableSortAsc] = useState(false);
  const [isArchiveSuccess, setIsArchiveSuccess] = useState(false);
  const [tournamentFilter, setTournamentFilter] = useState('ALL');

  const {
    tournamentName = 'Tournament',
    courtNumber = 'Court 1',
    opponentName = 'Opponent',
    matchStage = 'Pool Play - Match 1',
    matchFormat = 'Best of 3 (25, 25, 15)',
    targetPoints = 25,
    ourScore = 0,
    opponentScore = 0,
    setNumber = 1,
    ourSetsWon = 0,
    opponentSetsWon = 0,
    pointHistory = [],
    setHistory = []
  } = matchStats || {};

  // Filter points by Set if specific set chosen
  const filteredPoints = selectedSetFilter === 'ALL'
    ? pointHistory
    : pointHistory.filter(pt => pt.setNumber === Number(selectedSetFilter));

  // Compute analytics
  const errorRankings = computeErrorRankings(filteredPoints);
  const categoryBreakdown = computeCategoryBreakdown(filteredPoints);
  const playerStats = computePlayerStats(filteredPoints, roster);
  const rotationStats = computeRotationPerformance(filteredPoints);
  const historicalAverages = computeHistoricalAverages(matchHistory, roster);

  // Generate deep tactical coaching suggestions
  const allSuggestions = generateTacticalSuggestions({
    currentMatch: matchStats,
    matchHistory,
    roster,
    teamSettings
  });

  // Filter suggestions based on active pill
  const filteredSuggestions = allSuggestions.filter(s => {
    if (suggestionFilter === 'ALL') return true;
    if (suggestionFilter === 'CRITICAL') return s.priority === 'critical';
    if (suggestionFilter === 'TACTICAL') return s.priority === 'tactical' || s.priority === 'positive';
    if (suggestionFilter === 'ROTATION') return s.type === 'rotation';
    if (suggestionFilter === 'HISTORICAL') return s.type === 'historical';
    return true;
  });

  // Overall Match Totals
  const totalOurPoints = filteredPoints.filter(p => p.pointWonBy === 'us').length;
  const totalOpponentPoints = filteredPoints.filter(p => p.pointWonBy === 'opponent').length;
  const totalErrorsLogged = filteredPoints.filter(p => p.pointWonBy === 'opponent' && p.errorTypeId).length;
  const totalAces = filteredPoints.filter(p => p.earnedType === 'ace').length;
  const totalKills = filteredPoints.filter(p => p.earnedType === 'kill').length;
  const totalBlocks = filteredPoints.filter(p => p.earnedType === 'block').length;

  // Print to PDF Trigger
  const handlePrintPDF = () => {
    window.print();
  };

  // Archive Current Match to History
  const handleArchiveMatch = () => {
    if (onArchiveMatch) {
      const success = onArchiveMatch(opponentName || 'Opponent');
      if (success) {
        setIsArchiveSuccess(true);
        setTimeout(() => setIsArchiveSuccess(false), 3500);
        confetti({ particleCount: 35, spread: 55, origin: { y: 0.4 } });
      }
    } else {
      const opp = prompt('Enter Opponent Team Name for match archive:', opponentName || 'Opponent');
      if (opp !== null) {
        const archived = storageService.archiveCurrentMatch(matchStats, opp);
        if (archived) {
          setIsArchiveSuccess(true);
          setTimeout(() => setIsArchiveSuccess(false), 3500);
          confetti({ particleCount: 35, spread: 55, origin: { y: 0.4 } });
        }
      }
    }
  };

  // Delete an archived match
  const handleDeleteArchivedMatch = (matchId) => {
    if (window.confirm('Delete this past match from your history archive?')) {
      if (onDeleteMatchHistory) {
        onDeleteMatchHistory(matchId);
      } else {
        storageService.deleteMatchFromHistory(matchId);
      }
    }
  };

  // Sort Table
  const handleSort = (key) => {
    if (tableSortKey === key) {
      setTableSortAsc(prev => !prev);
    } else {
      setTableSortKey(key);
      setTableSortAsc(false);
    }
  };

  const sortedPlayerStats = [...playerStats].sort((a, b) => {
    let valA = a[tableSortKey];
    let valB = b[tableSortKey];
    if (tableSortKey === 'name') {
      valA = a.player.name.toLowerCase();
      valB = b.player.name.toLowerCase();
      return tableSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    if (tableSortKey === 'number') {
      valA = a.player.number;
      valB = b.player.number;
    }
    return tableSortAsc ? valA - valB : valB - valA;
  });

  // Handle deleting a single point from history
  const handleDeletePoint = (pointId) => {
    if (window.confirm('Delete this point entry from the match record?')) {
      setMatchStats(prev => {
        const updatedHistory = prev.pointHistory.filter(p => p.id !== pointId);
        const activeSetPoints = updatedHistory.filter(p => p.setNumber === prev.setNumber);
        const newOurScore = activeSetPoints.filter(p => p.pointWonBy === 'us').length;
        const newOppScore = activeSetPoints.filter(p => p.pointWonBy === 'opponent').length;

        return {
          ...prev,
          pointHistory: updatedHistory,
          ourScore: newOurScore,
          opponentScore: newOppScore
        };
      });
    }
  };

  const criticalCount = allSuggestions.filter(s => s.priority === 'critical').length;
  const tacticalCount = allSuggestions.filter(s => s.priority === 'tactical').length;

  return (
    <div className="stats-view-container">
      {/* Printable Report Header (Visible only when Printing / Saving as PDF) */}
      <div className="print-only-header">
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#000000' }}>
          {teamSettings?.teamName || 'Volleyball Team'} — Match Error & Performance Report
        </h1>
        <div style={{ fontSize: '0.95rem', color: '#333333', marginTop: '0.35rem', fontWeight: 600 }}>
          📍 {tournamentName} • {courtNumber} | 🆚 {matchStage} vs {opponentName}
        </div>
        <div style={{ fontSize: '0.85rem', color: '#666666', marginTop: '0.2rem' }}>
          Date: {new Date().toLocaleDateString()} • Format: {matchFormat} • Final: {ourSetsWon} - {opponentSetsWon} Sets
          {setHistory && setHistory.length > 0 && ` (${setHistory.map(s => `${s.ourScore}-${s.opponentScore}`).join(', ')})`}
        </div>
      </div>

      {/* Top Hero Banner & Controls */}
      <div className="stats-hero-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <Trophy size={24} color="#f59e0b" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#f8fafc', fontWeight: 800 }}>
              Match Stats & Tactical Analysis
            </h2>

            {/* Tournament & Location Pill */}
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#93c5fd'
              }}
            >
              📍 {tournamentName} • {courtNumber}
            </span>

            {/* Match Stage & Opponent Pill */}
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5'
              }}
            >
              🆚 {matchStage} vs {opponentName}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Real-time tracking of team errors, 6-2 tactical adjustments, and multi-game historical trends.
          </p>
        </div>

        {/* Action Buttons: Print PDF, Save to Archive & New Set */}
        <div className="no-print stats-actions-bar">
          {onOpenMatchSetup && (
            <button
              className="btn btn-secondary"
              onClick={onOpenMatchSetup}
              title="Edit tournament name, court #, opponent, or set format"
              style={{ borderColor: 'rgba(59, 130, 246, 0.4)', color: '#93c5fd' }}
            >
              <Settings size={15} />
              <span>Match Info</span>
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={handlePrintPDF}
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderColor: '#3b82f6' }}
            title="Open browser print dialog to print or save a formatted PDF report"
          >
            <Printer size={16} />
            <span>Export / Print PDF</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleArchiveMatch}
            title="Save and archive this match into historical games"
            style={isArchiveSuccess ? { borderColor: '#10b981', color: '#34d399' } : {}}
          >
            {isArchiveSuccess ? <Check size={16} /> : <Archive size={16} />}
            <span>{isArchiveSuccess ? 'Match Archived!' : 'Save to History'}</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              if (window.confirm(`Complete Set ${setNumber} (${ourScore} - ${opponentScore}) and advance to Set ${setNumber + 1}?`)) {
                onStartNewSet();
                confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
              }
            }}
            title="Archive current set and start next set"
          >
            <Plus size={16} />
            <span>Finish Set & Start Next</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => {
              if (window.confirm('Reset all match stats, set history, and scores back to initial state?')) {
                onResetFullMatch();
              }
            }}
            title="Clear all recorded stats for a brand new match"
          >
            <RefreshCw size={15} />
            <span>Reset Match</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          🧠 TACTICAL COACHING & GAME ADJUSTMENT SUGGESTIONS PANEL
         ========================================================================= */}
      <div className="tactical-coaching-panel">
        <div className="tactical-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="tactical-brain-icon">
              <Lightbulb size={22} color="#fbbf24" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
                Tactical Coaching Suggestions & Match Adjustments
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Rule-compliant volleyball adjustments analyzing current rally data & {matchHistory.length} saved historical games.
              </p>
            </div>
          </div>

          {/* Quick Badges */}
          <div className="no-print" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {criticalCount > 0 && (
              <span className="badge-critical">
                <AlertTriangle size={12} /> {criticalCount} Critical
              </span>
            )}
            <span className="badge-tactical">
              <Compass size={12} /> 6-2 System
            </span>
          </div>
        </div>

        {/* Suggestion Filter Pills */}
        <div className="no-print suggestion-filter-row">
          <button
            className={`sug-filter-pill ${suggestionFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setSuggestionFilter('ALL')}
          >
            All Suggestions ({allSuggestions.length})
          </button>
          <button
            className={`sug-filter-pill ${suggestionFilter === 'CRITICAL' ? 'active' : ''}`}
            onClick={() => setSuggestionFilter('CRITICAL')}
          >
            Critical Action Items ({criticalCount})
          </button>
          <button
            className={`sug-filter-pill ${suggestionFilter === 'ROTATION' ? 'active' : ''}`}
            onClick={() => setSuggestionFilter('ROTATION')}
          >
            Rotation Weaknesses
          </button>
          <button
            className={`sug-filter-pill ${suggestionFilter === 'HISTORICAL' ? 'active' : ''}`}
            onClick={() => setSuggestionFilter('HISTORICAL')}
          >
            Saved Games Trends ({matchHistory.length})
          </button>
        </div>

        {/* List of Suggestion Cards */}
        <div className="suggestion-cards-list">
          {filteredSuggestions.map(sug => {
            const isCrit = sug.priority === 'critical';
            const isPos = sug.priority === 'positive';

            return (
              <div
                key={sug.id}
                className={`tactical-sug-card ${isCrit ? 'critical' : isPos ? 'positive' : 'tactical'}`}
              >
                <div className="tactical-sug-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`sug-priority-badge ${sug.priority}`}>
                      {isCrit ? 'CRITICAL ADJUSTMENT' : isPos ? 'POSITIVE TREND' : 'TACTICAL OPPORTUNITY'}
                    </span>
                    <span className="sug-category-label">{sug.category}</span>
                  </div>

                  {sug.ruleReference && (
                    <span className="sug-rule-ref">
                      <Info size={12} /> {sug.ruleReference}
                    </span>
                  )}
                </div>

                <h4 className="tactical-sug-title">{sug.title}</h4>

                {/* Evidence / Data Box */}
                {sug.evidence && (
                  <div className="tactical-sug-evidence">
                    <strong style={{ color: isCrit ? '#fca5a5' : isPos ? '#6ee7b7' : '#93c5fd' }}>
                      Data Diagnostic:
                    </strong>{' '}
                    {sug.evidence}
                  </div>
                )}

                {/* Recommendation */}
                <div className="tactical-sug-rec">
                  <strong>Coach Recommendation:</strong> {sug.recommendation}
                </div>

                {/* Action Link / Navigation */}
                {sug.actionLabel && onNavigateTab && (
                  <div className="no-print" style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        if (sug.targetRotation) {
                          onNavigateTab('formations', sug.targetRotation);
                        } else if (sug.type === 'formation' || sug.category.includes('6-2') || sug.category.includes('Receive')) {
                          onNavigateTab('formations');
                        } else if (sug.type === 'timeout') {
                          alert('Tactical Timeout Called! 30-second break.');
                        } else {
                          onNavigateTab('court');
                        }
                      }}
                      style={{ fontSize: '0.76rem', gap: '0.35rem' }}
                    >
                      <span>{sug.actionLabel}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          ROTATION PERFORMANCE GRID (R1 - R6 SIDE-OUT & ERROR CONCESSION MAP)
         ========================================================================= */}
      <div className="error-leaderboard-card">
        <div className="leaderboard-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={20} color="#38bdf8" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800 }}>
              6-2 Rotational Performance & Side-Out Efficiency (R1 – R6)
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Identifies rotation vulnerabilities under USAV 6-2 System
          </span>
        </div>

        <div className="rotations-grid">
          {rotationStats.map(rStat => {
            const isWeak = rStat.netDifferential < 0 && rStat.totalRallies >= 2;
            const isStrong = rStat.netDifferential > 0 && rStat.totalRallies >= 2;

            return (
              <div
                key={rStat.rotation}
                className={`rotation-stat-card ${isWeak ? 'weak' : isStrong ? 'strong' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.92rem', color: '#f8fafc' }}>
                    Rotation {rStat.rotation}
                  </strong>
                  <span className={`net-badge ${rStat.netDifferential > 0 ? 'positive' : rStat.netDifferential < 0 ? 'negative' : 'neutral'}`}>
                    {rStat.netDifferential > 0 ? `+${rStat.netDifferential}` : rStat.netDifferential} Net
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  <span>Side-Out: <strong style={{ color: rStat.sideOutPercentage >= 60 ? '#34d399' : '#f87171' }}>{rStat.sideOutPercentage}%</strong></span>
                  <span>Rallies: <strong>{rStat.totalRallies}</strong></span>
                </div>

                {rStat.topError ? (
                  <div style={{ fontSize: '0.72rem', color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)', padding: '0.25rem 0.4rem', borderRadius: '4px', marginTop: '0.3rem' }}>
                    Top Error: <strong>{rStat.topError.label.split('(')[0]}</strong> ({rStat.topError.count}x)
                  </div>
                ) : (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    {rStat.totalRallies === 0 ? 'No rallies logged' : 'Clean rotation'}
                  </div>
                )}

                {onNavigateTab && (
                  <button
                    className="no-print btn btn-secondary btn-sm"
                    onClick={() => onNavigateTab('formations', rStat.rotation)}
                    style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.72rem', padding: '0.3rem' }}
                    title={`View Rotation ${rStat.rotation} Tactics Board`}
                  >
                    View Tactics (R{rStat.rotation})
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          ⏱️ & 🔄 OFFICIAL TIMEOUTS & SUBSTITUTIONS BOX SCORE
         ========================================================================= */}
      <div className="error-leaderboard-card">
        <div className="leaderboard-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="#f59e0b" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800 }}>
              Set-by-Set Substitutions & Timeouts Box Score
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Official USAV/NFHS Tracking (2 Timeouts & {matchStats?.maxSubs || 12} Subs per Set)
          </span>
        </div>

        {/* Set-by-Set Table */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginTop: '0.75rem' }}>
          <table className="stats-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th style={{ padding: '0.55rem 0.75rem', color: '#94a3b8' }}>Set</th>
                <th style={{ padding: '0.55rem 0.75rem', color: '#94a3b8' }}>Score</th>
                <th style={{ padding: '0.55rem 0.75rem', color: '#94a3b8' }}>Winner</th>
                <th style={{ padding: '0.55rem 0.75rem', color: '#34d399' }}>US Timeouts</th>
                <th style={{ padding: '0.55rem 0.75rem', color: '#f87171' }}>OPP Timeouts</th>
                <th style={{ padding: '0.55rem 0.75rem', color: '#60a5fa' }}>Team Subs</th>
              </tr>
            </thead>
            <tbody>
              {/* Completed Sets */}
              {setHistory && setHistory.map((s) => (
                <tr key={s.setNumber} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 800, color: '#f8fafc' }}>
                    Set {s.setNumber}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 700 }}>
                    <span style={{ color: '#10b981' }}>{s.ourScore}</span> - <span style={{ color: '#ef4444' }}>{s.opponentScore}</span>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 700, color: s.winner === 'us' ? '#34d399' : '#f87171' }}>
                    {s.winner === 'us' ? 'US' : (opponentName || 'OPP')}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', color: '#6ee7b7' }}>
                    {s.ourTimeoutsUsed ?? 0} / 2 Used
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', color: '#fca5a5' }}>
                    {s.opponentTimeoutsUsed ?? 0} / 2 Used
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', color: '#93c5fd', fontWeight: 700 }}>
                    {s.subsCount ?? 0} / {matchStats?.maxSubs || 12}
                  </td>
                </tr>
              ))}

              {/* Active Set */}
              <tr style={{ background: 'rgba(59, 130, 246, 0.08)', borderBottom: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 800, color: '#93c5fd', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                  <span>Set {setNumber} (Live)</span>
                </td>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 800 }}>
                  <span style={{ color: '#34d399' }}>{ourScore}</span> - <span style={{ color: '#f87171' }}>{opponentScore}</span>
                </td>
                <td style={{ padding: '0.55rem 0.75rem', color: '#fbbf24', fontWeight: 700 }}>
                  In Progress
                </td>
                <td style={{ padding: '0.55rem 0.75rem', color: '#6ee7b7', fontWeight: 700 }}>
                  {2 - (matchStats?.ourTimeoutsRemaining ?? 2)} / 2 Used ({matchStats?.ourTimeoutsRemaining ?? 2} left)
                </td>
                <td style={{ padding: '0.55rem 0.75rem', color: '#fca5a5', fontWeight: 700 }}>
                  {2 - (matchStats?.opponentTimeoutsRemaining ?? 2)} / 2 Used ({matchStats?.opponentTimeoutsRemaining ?? 2} left)
                </td>
                <td style={{ padding: '0.55rem 0.75rem', color: '#93c5fd', fontWeight: 800 }}>
                  {(matchStats?.subHistory || []).filter(sub => (sub.setNumber === undefined || sub.setNumber === setNumber) && !sub.isLiberoExchange).length} / {matchStats?.maxSubs || 12}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Timeout History Log List */}
        {matchStats?.timeoutHistory && matchStats.timeoutHistory.length > 0 && (
          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.4rem' }}>
              Timeout Calling Timeline:
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {matchStats.timeoutHistory.map((to, idx) => {
                const isUs = to.team === 'us';
                return (
                  <div
                    key={to.id || idx}
                    style={{
                      fontSize: '0.74rem',
                      padding: '0.25rem 0.55rem',
                      borderRadius: '6px',
                      background: isUs ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: isUs ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
                      color: isUs ? '#a7f3d0' : '#fca5a5',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>{isUs ? '🏐 US TO' : `🛡️ ${(opponentName || 'OPP').slice(0, 4)} TO`}</span>
                    <span style={{ opacity: 0.8 }}>• S{to.setNumber} @ {to.ourScore}-{to.opponentScore}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          HISTORICAL MULTI-MATCH BENCHMARKS & SAVED MATCH ARCHIVE
         ========================================================================= */}
      <div className="error-leaderboard-card">
        <div className="leaderboard-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="#a855f7" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800 }}>
              Cross-Game Historical Analysis ({matchHistory.length} Saved Games)
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Win Rate: {historicalAverages.winRate}% ({historicalAverages.matchesWon}/{historicalAverages.totalMatches} Matches)
          </span>
        </div>

        {/* Historical vs Current Comparison Bar */}
        <div className="historical-comparison-grid">
          <div className="hist-comp-item">
            <span className="hist-comp-label">Avg Errors / Set</span>
            <div className="hist-comp-value">{historicalAverages.avgErrorsPerSet}</div>
            <span className="hist-comp-sub">Multi-game average</span>
          </div>

          <div className="hist-comp-item">
            <span className="hist-comp-label">Service Error %</span>
            <div className="hist-comp-value" style={{ color: '#fbbf24' }}>{historicalAverages.serviceErrorPct}%</div>
            <span className="hist-comp-sub">Of total errors</span>
          </div>

          <div className="hist-comp-item">
            <span className="hist-comp-label">Attack Error %</span>
            <div className="hist-comp-value" style={{ color: '#f87171' }}>{historicalAverages.attackErrorPct}%</div>
            <span className="hist-comp-sub">Of total errors</span>
          </div>

          <div className="hist-comp-item">
            <span className="hist-comp-label">Passing Error %</span>
            <div className="hist-comp-value" style={{ color: '#60a5fa' }}>{historicalAverages.passingErrorPct}%</div>
            <span className="hist-comp-sub">Of total errors</span>
          </div>
        </div>

        {/* List of Saved Historical Matches */}
        <div className="no-print" style={{ marginTop: '1rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Archived Past Matches:
          </div>

          {matchHistory.length === 0 ? (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              No matches archived yet. Use the "Save to History" button at the top to save your completed games.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '220px', overflowY: 'auto' }}>
              {matchHistory.map(m => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.55rem 0.85rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{
                      fontWeight: 800,
                      color: m.result === 'WON' ? '#34d399' : '#f87171',
                      background: m.result === 'WON' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}>
                      {m.result}
                    </span>
                    <strong>vs {m.opponentName}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>({m.finalScore})</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {new Date(m.date).toLocaleDateString()}
                    </span>
                    <button
                      className="btn-icon btn-sm"
                      onClick={() => handleDeleteArchivedMatch(m.id)}
                      title="Delete this match from history"
                      style={{ color: '#ef4444', padding: '0.2rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Set Filter Pill Ribbon */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
          Filter Current Match by Set:
        </span>
        <button
          className={`btn-sm btn ${selectedSetFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedSetFilter('ALL')}
        >
          All Sets Combined
        </button>
        {Array.from({ length: setNumber }, (_, i) => i + 1).map(sNum => (
          <button
            key={sNum}
            className={`btn-sm btn ${selectedSetFilter === String(sNum) ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedSetFilter(String(sNum))}
          >
            Set {sNum} {sNum === setNumber ? '(Current)' : ''}
          </button>
        ))}
      </div>

      {/* KPI Overview Cards */}
      <div className="stats-kpi-grid">
        <div className="stats-kpi-card">
          <span className="stats-kpi-label">Current Score (Set {setNumber})</span>
          <div className="stats-kpi-value" style={{ color: ourScore > opponentScore ? '#10b981' : '#f87171' }}>
            {ourScore} - {opponentScore}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Sets Won: {ourSetsWon} (Us) - {opponentSetsWon} ({opponentName.slice(0, 4)})
          </span>
        </div>

        <div className="stats-kpi-card">
          <span className="stats-kpi-label">Total Errors Logged</span>
          <div className="stats-kpi-value" style={{ color: '#ef4444' }}>
            {totalErrorsLogged}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Points conceded via unforced errors
          </span>
        </div>

        <div className="stats-kpi-card">
          <span className="stats-kpi-label">Attack Kills</span>
          <div className="stats-kpi-value" style={{ color: '#60a5fa' }}>
            {totalKills}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Earned spike winners
          </span>
        </div>

        <div className="stats-kpi-card">
          <span className="stats-kpi-label">Service Aces</span>
          <div className="stats-kpi-value" style={{ color: '#34d399' }}>
            {totalAces}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Direct point-scoring serves
          </span>
        </div>

        <div className="stats-kpi-card">
          <span className="stats-kpi-label">Block Kills</span>
          <div className="stats-kpi-value" style={{ color: '#c084fc' }}>
            {totalBlocks}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Point-ending roof blocks
          </span>
        </div>
      </div>

      {/* =========================================================================
          ERROR FREQUENCY LEADERBOARD (RANKED MOST COMMON TO LEAST COMMON)
         ========================================================================= */}
      <div className="error-leaderboard-card">
        <div className="leaderboard-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} color="#f59e0b" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800 }}>
              Team Error Analysis (Ranked: Most Common to Least Common)
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {errorRankings.length} distinct error types recorded
          </span>
        </div>

        {errorRankings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏐</div>
            <div>No errors recorded yet for this selection.</div>
            <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
              Log errors during rallies using the scoreboard bar above to generate rankings.
            </div>
          </div>
        ) : (
          <div>
            {errorRankings.map((item, index) => {
              const topPlayerEntry = Object.entries(item.playerCounts).sort((a, b) => b[1] - a[1])[0];
              const topPlayer = topPlayerEntry ? roster.find(p => p.id === topPlayerEntry[0]) : null;

              return (
                <div key={item.errorId} className="leaderboard-item">
                  <div className="leaderboard-info-row">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="leaderboard-rank">#{index + 1}</span>
                      <span style={{ fontSize: '1.2rem', marginRight: '0.45rem' }}>{item.icon}</span>
                      <strong style={{ color: '#f8fafc' }}>{item.label}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                        ({item.category})
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {topPlayer && (
                        <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>
                          Primary: #{topPlayer.number} {topPlayer.name.split(' ')[0]} ({topPlayerEntry[1]})
                        </span>
                      )}
                      <span style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.95rem' }}>
                        {item.count} {item.count === 1 ? 'error' : 'errors'} ({item.percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="leaderboard-progress-bg">
                    <div
                      className="leaderboard-progress-fill"
                      style={{
                        width: `${item.percentage}%`,
                        background: index === 0 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #f59e0b, #d97706)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          PLAYER ERROR & CONTRIBUTION LEDGER TABLE
         ========================================================================= */}
      <div className="error-leaderboard-card">
        <div className="leaderboard-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="#3b82f6" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800 }}>
              Player Error Ledger & Impact Breakdown
            </h3>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Click column headers to sort
          </span>
        </div>

        <div className="stats-table-wrapper">
          <table className="stats-table">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('number')}>
                  # {tableSortKey === 'number' && (tableSortAsc ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  Player {tableSortKey === 'name' && (tableSortAsc ? '▲' : '▼')}
                </th>
                <th>Position</th>
                <th style={{ cursor: 'pointer', color: '#f87171' }} onClick={() => handleSort('totalErrors')}>
                  Total Errors {tableSortKey === 'totalErrors' && (tableSortAsc ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('serviceErrors')}>
                  Serve Err {tableSortKey === 'serviceErrors' && (tableSortAsc ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('attackErrors')}>
                  Attack Err {tableSortKey === 'attackErrors' && (tableSortAsc ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('passingErrors')}>
                  Pass/Rec {tableSortKey === 'passingErrors' && (tableSortAsc ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('handlingErrors')}>
                  Ball Hand. {tableSortKey === 'handlingErrors' && (tableSortAsc ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer', color: '#34d399' }} onClick={() => handleSort('pointsEarned')}>
                  Points Won {tableSortKey === 'pointsEarned' && (tableSortAsc ? '▲' : '▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('netScore')}>
                  Net +/- {tableSortKey === 'netScore' && (tableSortAsc ? '▲' : '▼')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayerStats.map(stat => {
                const isPositive = stat.netScore > 0;
                const isNegative = stat.netScore < 0;

                return (
                  <tr key={stat.player.id}>
                    <td>
                      <strong style={{ color: stat.player.position === 'Libero' ? '#c084fc' : '#f8fafc' }}>
                        #{stat.player.number}
                      </strong>
                    </td>
                    <td>
                      <strong>{stat.player.name}</strong>
                      {stat.player.isStarter && (
                        <span style={{ fontSize: '0.65rem', color: '#10b981', marginLeft: '0.35rem' }}>★</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {stat.player.position}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: stat.totalErrors > 0 ? '#f87171' : 'var(--text-muted)' }}>
                        {stat.totalErrors}
                      </strong>
                    </td>
                    <td>{stat.serviceErrors || '-'}</td>
                    <td>{stat.attackErrors || '-'}</td>
                    <td>{stat.passingErrors || '-'}</td>
                    <td>{stat.handlingErrors || '-'}</td>
                    <td>
                      <strong style={{ color: stat.pointsEarned > 0 ? '#34d399' : 'var(--text-muted)' }}>
                        {stat.pointsEarned}
                      </strong>
                      {stat.kills > 0 && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '0.3rem' }}>
                          ({stat.kills}k {stat.aces > 0 ? `${stat.aces}a` : ''} {stat.blocks > 0 ? `${stat.blocks}b` : ''})
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`net-badge ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
                        {stat.netScore > 0 ? `+${stat.netScore}` : stat.netScore}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          PLAY-BY-PLAY RALLY LOG TIMELINE
         ========================================================================= */}
      <div className="error-leaderboard-card no-print">
        <div className="leaderboard-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800 }}>
              Play-by-Play Rally Timeline ({filteredPoints.length} rallies)
            </h3>
          </div>
        </div>

        {filteredPoints.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
            No rallies logged yet.
          </div>
        ) : (
          <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[...filteredPoints].reverse().map((pt) => {
              const isUs = pt.pointWonBy === 'us';

              return (
                <div
                  key={pt.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 0.85rem',
                    background: isUs ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    borderLeft: `4px solid ${isUs ? '#10b981' : '#ef4444'}`,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <strong style={{ color: isUs ? '#34d399' : '#f87171' }}>
                      {isUs ? '+1 US' : '+1 OPP'}
                    </strong>
                    <span style={{ color: 'var(--text-muted)' }}>
                      [Set {pt.setNumber} • R{pt.rotation}]
                    </span>
                    <span>
                      {isUs ? (
                        <>
                          <strong>{pt.earnedTypeName || pt.earnedType || 'Point Won'}</strong>
                          {pt.earnedPlayerName && ` by #${pt.earnedPlayerNumber} ${pt.earnedPlayerName}`}
                        </>
                      ) : (
                        <>
                          <span style={{ color: '#fca5a5' }}>{pt.errorTypeName || pt.errorTypeId || 'Error'}</span>
                          {pt.errorPlayerName && (
                            <strong style={{ marginLeft: '0.3rem' }}>
                              (#{pt.errorPlayerNumber || ''} {pt.errorPlayerName})
                            </strong>
                          )}
                        </>
                      )}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <button
                      className="btn-icon btn-sm"
                      onClick={() => handleDeletePoint(pt.id)}
                      title="Delete this rally entry"
                      style={{ color: '#ef4444', padding: '0.2rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          🏆 TOURNAMENT PAST MATCHES & GAME ARCHIVE
         ========================================================================= */}
      <div className="error-leaderboard-card no-print" style={{ marginTop: '1.5rem' }}>
        <div className="leaderboard-title-row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} color="#f59e0b" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 800 }}>
              Tournament Matches Archive ({matchHistory.length} matches)
            </h3>
          </div>

          {/* Tournament Filter */}
          {matchHistory.length > 0 && (
            <select
              className="filter-select"
              value={tournamentFilter}
              onChange={(e) => setTournamentFilter(e.target.value)}
              style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
            >
              <option value="ALL">All Tournaments & Events</option>
              {[...new Set(matchHistory.map(m => m.tournamentName).filter(Boolean))].map(tName => (
                <option key={tName} value={tName}>{tName}</option>
              ))}
            </select>
          )}
        </div>

        {matchHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No completed matches in history yet. Click <strong>"Save Match"</strong> on the scoreboard to archive finished tournament matches.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {matchHistory
              .filter(m => tournamentFilter === 'ALL' || m.tournamentName === tournamentFilter)
              .map((pastMatch) => {
                const isWin = pastMatch.result === 'WON' || pastMatch.ourSetsWon > pastMatch.opponentSetsWon;

                return (
                  <div
                    key={pastMatch.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1.1rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isWin ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                      borderRadius: '12px',
                      flexWrap: 'wrap',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          background: isWin ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: isWin ? '#34d399' : '#f87171',
                          border: `1px solid ${isWin ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
                        }}
                      >
                        {isWin ? 'WON' : 'LOST'} ({pastMatch.ourSetsWon || 0} - {pastMatch.opponentSetsWon || 0})
                      </span>

                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                          vs {pastMatch.opponentName || 'Opponent'}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem', flexWrap: 'wrap' }}>
                          {pastMatch.tournamentName && (
                            <span>📍 {pastMatch.tournamentName} {pastMatch.courtNumber ? `• ${pastMatch.courtNumber}` : ''}</span>
                          )}
                          {pastMatch.matchStage && (
                            <span>• {pastMatch.matchStage}</span>
                          )}
                          <span>• {new Date(pastMatch.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Set Scores Breakdown & Delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', fontFamily: 'monospace' }}>
                          {pastMatch.finalScore || (pastMatch.setScores ? pastMatch.setScores.map(s => `${s.ourScore}-${s.opponentScore}`).join(', ') : 'Match Complete')}
                        </div>
                        {pastMatch.setScores && pastMatch.setScores.length > 0 && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {pastMatch.setScores.length} Sets Played
                          </div>
                        )}
                      </div>

                      <button
                        className="btn-icon btn-sm"
                        onClick={() => handleDeleteArchivedMatch(pastMatch.id)}
                        title="Delete match from history"
                        style={{ color: '#64748b', padding: '0.35rem' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
