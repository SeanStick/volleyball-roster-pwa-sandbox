import React, { useState, useMemo } from 'react';
import {
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
  Dumbbell,
  Filter
} from 'lucide-react';
import { DRILL_CATEGORIES, VOLLEYBALL_DRILLS } from '../services/drillsData';
import DrillAnimationPlayer from './DrillAnimationPlayer';
import '../styles/drills.css';

export default function DrillHubPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedDrillId, setSelectedDrillId] = useState(VOLLEYBALL_DRILLS[0]?.id || 'warmup-3step-approach');
  const [practicePlan, setPracticePlan] = useState([]);
  const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false);
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);

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

  // Active selected drill object
  const activeDrill = useMemo(() => {
    return VOLLEYBALL_DRILLS.find((d) => d.id === selectedDrillId) || filteredDrills[0] || VOLLEYBALL_DRILLS[0];
  }, [selectedDrillId, filteredDrills]);

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
    <div className="drills-page-container">
      {/* =========================================================================
          1. HERO HEADER BANNER
         ========================================================================= */}
      <div className="drills-hero-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 18px rgba(59, 130, 246, 0.45)',
              flexShrink: 0
            }}
          >
            <Dumbbell size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.3px' }}>
              Volleyball Practice & Drill Lab
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#93c5fd', margin: '0.15rem 0 0 0', fontWeight: 700 }}>
              Life-like 2D court animations, coaching cues & custom practice session builder
            </p>
          </div>
        </div>

        {/* Practice Plan Drawer Button */}
        <button
          type="button"
          onClick={() => setIsPlanDrawerOpen(!isPlanDrawerOpen)}
          style={{
            background: practicePlan.length > 0
              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.35), rgba(5, 150, 105, 0.45))'
              : 'rgba(255, 255, 255, 0.05)',
            border: practicePlan.length > 0 ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            padding: '0.45rem 1rem',
            color: practicePlan.length > 0 ? '#a7f3d0' : '#cbd5e1',
            fontSize: '0.82rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            boxShadow: practicePlan.length > 0 ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
          title="Open Practice Plan Builder"
        >
          <ListOrdered size={16} color={practicePlan.length > 0 ? '#34d399' : '#94a3b8'} />
          <span>Practice Plan ({practicePlan.length})</span>
          {practicePlan.length > 0 && (
            <span style={{ background: '#10b981', color: '#090e1a', padding: '0.1rem 0.45rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 900 }}>
              {totalPlanMinutes}m
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
          2. CATEGORY SELECTOR BAR
         ========================================================================= */}
      <div className="drills-categories-bar">
        {DRILL_CATEGORIES.map((cat) => {
          const isSel = activeCategory === cat.id;
          const count = cat.id === 'all'
            ? VOLLEYBALL_DRILLS.length
            : VOLLEYBALL_DRILLS.filter((d) => d.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              className={`drills-category-chip ${isSel ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat.id);
                setIsMobileDetailOpen(false);
              }}
              style={{
                borderColor: isSel ? cat.color : 'rgba(255, 255, 255, 0.08)',
                background: isSel ? `${cat.color}30` : 'rgba(255, 255, 255, 0.03)'
              }}
            >
              <span style={{ color: cat.color }}>{getCategoryIcon(cat.icon)}</span>
              <span>{cat.label}</span>
              <span style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '999px', fontSize: '0.68rem', fontWeight: 800 }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          3. MAIN RESPONSIVE TWO-COLUMN LAYOUT
         ========================================================================= */}
      <div className="drills-main-layout">
        {/* -----------------------------------------------------------------
            LEFT COLUMN: SEARCH, FILTERS & DRILLS LIST
           ----------------------------------------------------------------- */}
        <div className={`drills-sidebar ${isMobileDetailOpen ? 'hide-mobile' : ''}`}>
          {/* Search & Difficulty Filter */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search drill or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.1rem', fontSize: '0.84rem' }}
              />
            </div>

            <select
              className="form-control"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.55rem' }}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: '#94a3b8', padding: '0 0.2rem' }}>
            <span><strong>{filteredDrills.length}</strong> Drills Available</span>
            <span style={{ color: '#60a5fa' }}>Tap to view animation</span>
          </div>

          {/* Scrollable List of Drill Cards */}
          <div className="drills-scroll-list">
            {filteredDrills.map((drill) => {
              const isSelected = activeDrill?.id === drill.id;
              const isInPlan = practicePlan.includes(drill.id);

              return (
                <div
                  key={drill.id}
                  onClick={() => {
                    setSelectedDrillId(drill.id);
                    setIsMobileDetailOpen(true);
                  }}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(30, 41, 59, 0.95))'
                      : 'linear-gradient(135deg, rgba(30, 41, 59, 0.65), rgba(15, 23, 42, 0.9))',
                    border: isSelected
                      ? '1.5px solid #3b82f6'
                      : isInPlan
                      ? '1.5px solid #10b981'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '0.75rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 18px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                        {drill.categoryLabel}
                      </span>
                      <span style={{ fontSize: '0.66rem', fontWeight: 800, color: drill.difficulty === 'Beginner' ? '#34d399' : drill.difficulty === 'Intermediate' ? '#fbbf24' : '#f87171', background: 'rgba(255, 255, 255, 0.05)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                        {drill.difficulty}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleTogglePlan(drill.id, e)}
                      style={{ background: 'none', border: 'none', padding: '0.1rem', cursor: 'pointer' }}
                      title={isInPlan ? 'Remove from Practice Plan' : 'Add to Practice Plan'}
                    >
                      {isInPlan ? <BookmarkCheck size={17} color="#10b981" /> : <Bookmark size={17} color="#64748b" />}
                    </button>
                  </div>

                  <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: isSelected ? '#ffffff' : '#f1f5f9', margin: 0, lineHeight: 1.3 }}>
                    {drill.title}
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', paddingTop: '0.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={11} color="#60a5fa" /> {drill.durationMinutes}m • <Users size={11} color="#c084fc" /> {drill.minPlayers}-{drill.maxPlayers}
                    </span>
                    <span style={{ color: isSelected ? '#60a5fa' : '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                      <span>View</span>
                      <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* -----------------------------------------------------------------
            RIGHT COLUMN: FOCUSED 2D ANIMATED DEMONSTRATION & COACHING CUES
           ----------------------------------------------------------------- */}
        {activeDrill && (
          <div className={`drills-detail-view ${!isMobileDetailOpen ? 'hide-mobile' : ''}`}>
            {/* Mobile Back Button */}
            <div className="show-mobile" style={{ marginBottom: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsMobileDetailOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', width: '100%', justifyContent: 'center' }}
              >
                <ArrowLeft size={15} />
                <span>Back to All Drills</span>
              </button>
            </div>

            {/* Drill Title & Action Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                  <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                    {activeDrill.categoryLabel}
                  </span>
                  <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                    Level: {activeDrill.difficulty}
                  </span>
                  <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#e9d5ff', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800 }}>
                    Intensity: {activeDrill.intensity}
                  </span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#cbd5e1', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {activeDrill.durationMinutes} mins
                  </span>
                  <span style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#cbd5e1', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Users size={12} /> {activeDrill.minPlayers}-{activeDrill.maxPlayers} Players
                  </span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f8fafc', margin: 0, lineHeight: 1.25 }}>
                  {activeDrill.title}
                </h2>
              </div>

              {/* Bookmark to Practice Plan */}
              <button
                type="button"
                onClick={() => handleTogglePlan(activeDrill.id)}
                style={{
                  background: practicePlan.includes(activeDrill.id) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: practicePlan.includes(activeDrill.id) ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '0.4rem 0.85rem',
                  color: practicePlan.includes(activeDrill.id) ? '#34d399' : '#cbd5e1',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {practicePlan.includes(activeDrill.id) ? (
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

            {/* 2D ANIMATED COURT DEMONSTRATION PLAYER */}
            <DrillAnimationPlayer drill={activeDrill} />

            {/* Overview Card */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.95rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#38bdf8', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Drill Objective & Purpose
              </div>
              <p style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5, margin: 0 }}>
                {activeDrill.overview}
              </p>
            </div>

            {/* Setup & Equipment Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.95rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#fbbf24', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Court Setup
                </div>
                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.45, margin: 0 }}>
                  {activeDrill.setup}
                </p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.95rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#a7f3d0', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Equipment Checklist
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
                  {activeDrill.equipment.map((eq, i) => (
                    <li key={i} style={{ marginBottom: '0.2rem' }}>{eq}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.95rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#60a5fa', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Step-by-Step Drill Execution
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {activeDrill.instructions.map((inst, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <span style={{ background: '#3b82f6', color: '#ffffff', fontWeight: 900, fontSize: '0.72rem', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.86rem', color: '#f1f5f9', lineHeight: 1.45 }}>
                      {inst}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Coaching Cues */}
            <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.9))', border: '1.5px solid rgba(16, 185, 129, 0.4)', borderRadius: '14px', padding: '0.95rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#34d399', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Key Coaching Points to Watch</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {activeDrill.coachingKeys.map((cue, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{cue}</li>
                ))}
              </ul>
            </div>

            {/* Variations & Progressions */}
            {activeDrill.variations && activeDrill.variations.length > 0 && (
              <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '0.95rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#c084fc', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Variations & Progressions
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
                  {activeDrill.variations.map((v, i) => (
                    <li key={i} style={{ marginBottom: '0.2rem' }}>{v}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================================================================
          4. PRACTICE PLAN SLIDE-UP DRAWER
         ========================================================================= */}
      {isPlanDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: '#090e1a',
            borderTop: '2.5px solid #10b981',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            maxHeight: '45vh',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            boxShadow: '0 -20px 45px rgba(0, 0, 0, 0.85)',
            zIndex: 1500
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <ListOrdered size={18} color="#10b981" />
                <span>Today's Practice Session Plan</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#a7f3d0', marginTop: '0.1rem' }}>
                {planDrills.length} Drills Selected • Total Estimated Time: <strong>{totalPlanMinutes} Minutes</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setPracticePlan([])}
                style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Clear Plan
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsPlanDrawerOpen(false)}
                style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
              >
                Close
              </button>
            </div>
          </div>

          {planDrills.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              No drills added yet. Tap the bookmark icon on any drill to assemble today's practice!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {planDrills.map((d, index) => (
                <div
                  key={d.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ background: '#10b981', color: '#0f172a', fontWeight: 900, fontSize: '0.75rem', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {index + 1}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff' }}>
                        {d.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {d.categoryLabel} • {d.durationMinutes} mins • {d.difficulty}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePlan(d.id)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.3rem' }}
                    title="Remove from plan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
