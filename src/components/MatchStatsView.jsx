import React, { useState } from 'react';
import {
  Printer,
  Download,
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
  Volleyball,
  Calendar,
  Layers,
  Sparkles,
  Trash2,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  computeErrorRankings,
  computeCategoryBreakdown,
  computePlayerStats,
  ERROR_CATEGORIES,
  VOLLEYBALL_ERRORS
} from '../services/matchStatsService';

export default function MatchStatsView({
  matchStats,
  setMatchStats,
  roster = [],
  teamSettings = {},
  onResetScore,
  onStartNewSet,
  onResetFullMatch
}) {
  const [selectedSetFilter, setSelectedSetFilter] = useState('ALL');
  const [tableSortKey, setTableSortKey] = useState('totalErrors');
  const [tableSortAsc, setTableSortAsc] = useState(false);

  const {
    ourScore = 0,
    opponentScore = 0,
    setNumber = 1,
    ourSetsWon = 0,
    opponentSetsWon = 0,
    opponentName = 'Opponent',
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
        // Recalculate score from updated history for the active set
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

  return (
    <div className="stats-view-container">
      {/* Printable Report Header (Visible only when Printing / Saving as PDF) */}
      <div className="print-only-header">
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#000000' }}>
          {teamSettings?.teamName || 'Volleyball Team'} — Match Error & Performance Report
        </h1>
        <div style={{ fontSize: '0.9rem', color: '#555555', marginTop: '0.25rem' }}>
          Date: {new Date().toLocaleDateString()} • Opponent: {opponentName} • Final Score: {ourSetsWon} - {opponentSetsWon} Sets
        </div>
      </div>

      {/* Top Hero Banner & Controls */}
      <div className="stats-hero-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <Trophy size={24} color="#f59e0b" />
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#f8fafc', fontWeight: 800 }}>
              Match Stats & Error Analytics
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Real-time tracking of team errors, scoring efficiency, and player performance.
          </p>
        </div>

        {/* Action Buttons: Print PDF & New Set */}
        <div className="no-print" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
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

      {/* Set Filter Pill Ribbon */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
          Filter by Set:
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
              // Find top player who made this error
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
          <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {[...filteredPoints].reverse().map((pt, idx) => {
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
    </div>
  );
}
