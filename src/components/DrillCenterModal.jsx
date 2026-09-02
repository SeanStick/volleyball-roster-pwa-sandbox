import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Sparkles,
  Flame,
  Target,
  Shield,
  Layers,
  Zap,
  ShieldAlert,
  Trophy,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  Play,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ListOrdered,
  Plus,
  Trash2,
  Printer,
  ChevronRight,
  SlidersHorizontal,
  Dumbbell
} from 'lucide-react';
import { DRILL_CATEGORIES, VOLLEYBALL_DRILLS } from '../services/drillsData';
import DrillAnimationPlayer from './DrillAnimationPlayer';

export default function DrillCenterModal({ isOpen, onClose }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [practicePlan, setPracticePlan] = useState([]); // List of drill IDs
  const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);

  // Filtered drills
  const filteredDrills = useMemo(() => {
    return VOLLEYBALL_DRILLS.filter((d) => {
      const matchesCat = activeCategory === 'all' || d.category === activeCategory;
      const matchesDiff = difficultyFilter === 'all' || d.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.overview.toLowerCase().includes(q) ||
        d.categoryLabel.toLowerCase().includes(q) ||
        d.equipment.some((eq) => eq.toLowerCase().includes(q));

      return matchesCat && matchesDiff && matchesSearch;
    });
  }, [activeCategory, difficultyFilter, searchTerm]);

  if (!isOpen) return null;

  // Toggle drill in practice plan
  const handleTogglePlan = (drillId, e) => {
    if (e) e.stopPropagation();
    setPracticePlan((prev) =>
      prev.includes(drillId) ? prev.filter((id) => id !== drillId) : [...prev, drillId]
    );
  };

  const planDrills = VOLLEYBALL_DRILLS.filter((d) => practicePlan.includes(d.id));
  const totalPlanMinutes = planDrills.reduce((sum, d) => sum + (d.durationMinutes || 15), 0);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Flame': return <Flame size={16} />;
      case 'Target': return <Target size={16} />;
      case 'Shield': return <Shield size={16} />;
      case 'Layers': return <Layers size={16} />;
      case 'Zap': return <Zap size={16} />;
      case 'ShieldAlert': return <ShieldAlert size={16} />;
      case 'Trophy': return <Trophy size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1400,
        padding: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '94dvh',
          background: 'linear-gradient(180deg, #131d36 0%, #090e1a 100%)',
          border: '1.5px solid rgba(59, 130, 246, 0.45)',
          borderRadius: '24px',
          padding: '0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(59, 130, 246, 0.25)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* =========================================================================
            TOP HEADER
           ========================================================================= */}
        <div
          style={{
            padding: '0.9rem 1.25rem',
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.25), rgba(168, 85, 247, 0.3))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
              }}
            >
              <Dumbbell size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                Volleyball Drill Lab & Practice Hub
              </h3>
              <p style={{ fontSize: '0.74rem', color: '#93c5fd', margin: 0, fontWeight: 700 }}>
                Interactive 2D animations, coaching cues & practice plan builder
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Practice Plan Pill Trigger */}
            <button
              type="button"
              onClick={() => setIsPlanDrawerOpen(!isPlanDrawerOpen)}
              style={{
                background: practicePlan.length > 0
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.4))'
                  : 'rgba(255, 255, 255, 0.05)',
                border: practicePlan.length > 0 ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                padding: '0.3rem 0.75rem',
                color: practicePlan.length > 0 ? '#a7f3d0' : '#cbd5e1',
                fontSize: '0.76rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
              title="View your saved Practice Plan"
            >
              <ListOrdered size={14} color={practicePlan.length > 0 ? '#34d399' : '#94a3b8'} />
              <span>Practice Plan ({practicePlan.length})</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
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
        </div>

        {/* =========================================================================
            CATEGORY HORIZONTAL TABS
           ========================================================================= */}
        {!selectedDrill && (
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              background: 'rgba(15, 23, 42, 0.85)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              flexShrink: 0
            }}
          >
            {DRILL_CATEGORIES.map((cat) => {
              const isSel = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    border: isSel ? `1.5px solid ${cat.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSel ? `${cat.color}25` : 'rgba(255, 255, 255, 0.03)',
                    color: isSel ? '#ffffff' : '#94a3b8',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ color: cat.color }}>{getCategoryIcon(cat.icon)}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            SCROLLABLE CONTENT AREA (DRILLS LIST OR DRILL DETAIL)
           ========================================================================= */}
        <div
          style={{
            padding: '1rem 1.25rem',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* -------------------------------------------------------------
              VIEW 1: DRILL DETAIL WITH 2D ANIMATION
             ------------------------------------------------------------- */}
          {selectedDrill ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Back Button & Title Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedDrill(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <ArrowLeft size={15} />
                  <span>Back to Drills</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTogglePlan(selectedDrill.id)}
                  style={{
                    background: practicePlan.includes(selectedDrill.id) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: practicePlan.includes(selectedDrill.id) ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.75rem',
                    color: practicePlan.includes(selectedDrill.id) ? '#34d399' : '#cbd5e1',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer'
                  }}
                >
                  {practicePlan.includes(selectedDrill.id) ? (
                    <>
                      <BookmarkCheck size={16} color="#10b981" />
                      <span>In Practice Plan</span>
                    </>
                  ) : (
                    <>
                      <Bookmark size={16} />
                      <span>+ Add to Practice Plan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title & Metadata Pills */}
              <div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                    {selectedDrill.categoryLabel}
                  </span>
                  <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                    {selectedDrill.difficulty}
                  </span>
                  <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#e9d5ff', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                    Intensity: {selectedDrill.intensity}
                  </span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#cbd5e1', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {selectedDrill.durationMinutes} mins
                  </span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#cbd5e1', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Users size={12} /> {selectedDrill.minPlayers}-{selectedDrill.maxPlayers} Players
                  </span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                  {selectedDrill.title}
                </h2>
              </div>

              {/* 2D ANIMATED DEMONSTRATION */}
              <DrillAnimationPlayer drill={selectedDrill} />

              {/* Overview & Objective */}
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#38bdf8', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Drill Objective & Overview
                </div>
                <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>
                  {selectedDrill.overview}
                </p>
              </div>

              {/* Setup & Equipment Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#fbbf24', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Court Setup
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4, margin: 0 }}>
                    {selectedDrill.setup}
                  </p>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#a7f3d0', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Equipment Needed
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    {selectedDrill.equipment.map((eq, i) => (
                      <li key={i} style={{ marginBottom: '0.15rem' }}>{eq}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#60a5fa', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Step-by-Step Drill Execution
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {selectedDrill.instructions.map((inst, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ background: '#3b82f6', color: '#ffffff', fontWeight: 900, fontSize: '0.72rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        {i + 1}
                      </span>
                      <span style={{ fontSize: '0.84rem', color: '#f1f5f9', lineHeight: 1.4 }}>
                        {inst}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Coaching Cues */}
              <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9))', border: '1.5px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#34d399', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Key Coaching Points to Watch</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.45 }}>
                  {selectedDrill.coachingKeys.map((cue, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>{cue}</li>
                  ))}
                </ul>
              </div>

              {/* Variations & Progressions */}
              {selectedDrill.variations && selectedDrill.variations.length > 0 && (
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#c084fc', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Variations & Progressions
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    {selectedDrill.variations.map((v, i) => (
                      <li key={i} style={{ marginBottom: '0.2rem' }}>{v}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* -------------------------------------------------------------
                VIEW 2: DRILLS BROWSER GRID & SEARCH
               ------------------------------------------------------------- */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Search & Filter Strip */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search drill name, skill, or equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '2.2rem', fontSize: '0.86rem' }}
                  />
                </div>

                <select
                  className="form-control"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '0.4rem 0.6rem' }}
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Count Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: '#94a3b8' }}>
                <span>Showing <strong>{filteredDrills.length}</strong> Drills</span>
                {practicePlan.length > 0 && (
                  <span style={{ color: '#6ee7b7' }}>
                    ⭐ {practicePlan.length} Drill(s) in Practice Plan ({totalPlanMinutes} mins)
                  </span>
                )}
              </div>

              {/* Drills Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {filteredDrills.map((drill) => {
                  const isInPlan = practicePlan.includes(drill.id);

                  return (
                    <div
                      key={drill.id}
                      onClick={() => setSelectedDrill(drill)}
                      style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.95))',
                        border: isInPlan ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.65rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <div>
                        {/* Top Pills */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                            {drill.categoryLabel}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleTogglePlan(drill.id, e)}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                            title={isInPlan ? 'Remove from Practice Plan' : 'Add to Practice Plan'}
                          >
                            {isInPlan ? <BookmarkCheck size={18} color="#10b981" /> : <Bookmark size={18} color="#64748b" />}
                          </button>
                        </div>

                        {/* Title */}
                        <h4 style={{ fontSize: '0.94rem', fontWeight: 900, color: '#f8fafc', margin: '0 0 0.35rem 0', lineHeight: 1.3 }}>
                          {drill.title}
                        </h4>

                        {/* Description Preview */}
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {drill.overview}
                        </p>
                      </div>

                      {/* Bottom Details Strip */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.45rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.72rem', color: '#cbd5e1' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Clock size={12} color="#60a5fa" /> {drill.durationMinutes}m
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Users size={12} color="#c084fc" /> {drill.minPlayers}-{drill.maxPlayers}
                          </span>
                        </div>

                        <span style={{ color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <span>Animate</span>
                          <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            PRACTICE PLAN SLIDE-UP DRAWER
           ========================================================================= */}
        {isPlanDrawerOpen && (
          <div
            style={{
              background: '#090e1a',
              borderTop: '2px solid #10b981',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxHeight: '40vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              boxShadow: '0 -15px 30px rgba(0, 0, 0, 0.8)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ListOrdered size={16} color="#10b981" />
                  <span>Today's Practice Session Plan</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#a7f3d0' }}>
                  {planDrills.length} Drills Selected • Total Estimated Duration: <strong>{totalPlanMinutes} Minutes</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPracticePlan([])}
                style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Clear Plan
              </button>
            </div>

            {planDrills.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.82rem' }}>
                No drills added yet. Tap the bookmark icon on any drill to add it to today's practice!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {planDrills.map((d, index) => (
                  <div
                    key={d.id}
                    style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ background: '#10b981', color: '#0f172a', fontWeight: 900, fontSize: '0.74rem', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {index + 1}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
                          {d.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                          {d.categoryLabel} • {d.durationMinutes} mins
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePlan(d.id)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.2rem' }}
                      title="Remove from plan"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
