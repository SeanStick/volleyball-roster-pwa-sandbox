import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Send,
  Flame,
  Shield,
  Target,
  Users,
  Key,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Zap,
  Award,
  AlertCircle
} from 'lucide-react';
import { askGeminiHeadCoach } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { speakTimeoutAdvice, stopSpeakingAdvice } from '../services/timeoutAdvisorService';

export default function GeminiCoachModal({
  isOpen,
  onClose,
  user = null,
  onOpenAuthModal = null,
  matchStats = {},
  rotation = 1,
  phase = 'receive',
  roster = [],
  courtLineup = {},
  opponentName = 'Opponent',
  initialQuestion = ''
}) {
  const safeInitialQuestion = typeof initialQuestion === 'string' ? initialQuestion : '';
  const [adviceData, setAdviceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState(safeInitialQuestion);
  const [apiKey, setApiKey] = useState(() => storageService.getGeminiApiKey() || '');
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedChip, setSelectedChip] = useState('');

  const QUICK_PROMPTS = [
    { label: '🔥 Break Opponent Run', query: 'The opponent is on a scoring run. How do we break their momentum immediately?' },
    { label: '🎯 Target Weak Passers', query: 'Where should we serve to exploit their weakest passers and create free balls?' },
    { label: '🛡️ Tighten Blocking', query: 'How should our front-row block set up against their strongest hitters?' },
    { label: '⚡ Setter Offense', query: 'What offensive plays and set distributions should our setter run in this rotation?' },
    { label: '💪 Motivational Pep Talk', query: 'Give the team an inspiring, fired-up huddle speech to lock in and win this set.' }
  ];

  // Fetch advice when opened or when manually triggered
  const handleAnalyze = async (overrideQuestion = null) => {
    // Require a login for AI Coach to analyze
    if (!user || !user.uid) {
      return;
    }

    setLoading(true);
    stopSpeakingAdvice();
    setIsSpeaking(false);

    const questionToAsk = typeof overrideQuestion === 'string'
      ? overrideQuestion
      : (typeof customQuestion === 'string' ? customQuestion : '');

    try {
      const result = await askGeminiHeadCoach({
        gameData: {
          matchStats,
          rotation,
          phase,
          roster,
          courtLineup,
          opponentName
        },
        customQuestion: questionToAsk,
        apiKey: apiKey
      });

      setAdviceData(result);
    } catch (err) {
      console.error('Failed to get Gemini coaching advice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const q = typeof initialQuestion === 'string' ? initialQuestion : '';
      setCustomQuestion(q);
      if (user?.uid) {
        handleAnalyze(q);
      }
    } else {
      stopSpeakingAdvice();
      setIsSpeaking(false);
    }
  }, [isOpen, initialQuestion, user?.uid]);

  const handleSaveApiKey = () => {
    const cleanKey = typeof tempApiKey === 'string' ? tempApiKey.trim() : '';
    storageService.saveGeminiApiKey(cleanKey);
    setApiKey(cleanKey);
    setIsApiKeyOpen(false);
    // Re-run analysis with new key
    setTimeout(() => {
      handleAnalyze();
    }, 100);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeakingAdvice();
      setIsSpeaking(false);
      return;
    }

    if (!adviceData) return;
    const textToSpeak = `${adviceData.motivationalSpeech}. Key focus: ${adviceData.tacticalAdvice.slice(0, 2).join('. ')}`;
    setIsSpeaking(true);
    speakTimeoutAdvice(textToSpeak, () => setIsSpeaking(false));
  };

  const handleCopy = () => {
    if (!adviceData) return;
    const formatted = `🏐 GEMINI HEAD COACH ADVICE:\n\n` +
      `TACTICAL GAMEPLAN:\n${adviceData.tacticalAdvice.map(a => `• ${a}`).join('\n')}\n\n` +
      `PLAYER DIRECTIVES:\n${adviceData.playerFocus.map(p => `• ${p}`).join('\n')}\n\n` +
      `HUDDLE SPEECH:\n${adviceData.motivationalSpeech}`;

    navigator.clipboard?.writeText(formatted).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSelectChip = (chip) => {
    setSelectedChip(chip.label);
    setCustomQuestion(chip.query);
    handleAnalyze(chip.query);
  };

  if (!isOpen) return null;

  const ourScore = matchStats?.ourScore || 0;
  const oppScore = matchStats?.opponentScore || 0;
  const setNumber = matchStats?.setNumber || 1;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        zIndex: 1350,
        position: 'fixed',
        inset: 0,
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.75rem'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '92vh',
          background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)',
          border: '1.5px solid rgba(168, 85, 247, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -10px rgba(168, 85, 247, 0.35), 0 0 40px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.22) 0%, rgba(59, 130, 246, 0.22) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.5)'
              }}
            >
              <Sparkles size={22} color="#ffffff" className="animate-pulse" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.3px' }}>
                  Gemini Head Coach
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: apiKey ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.25)',
                    color: apiKey ? '#34d399' : '#e9d5ff',
                    border: `1px solid ${apiKey ? 'rgba(16, 185, 129, 0.4)' : 'rgba(168, 85, 247, 0.4)'}`
                  }}
                >
                  {apiKey ? 'Gemini 1.5 Flash' : 'Built-In Coach Engine'}
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>
                Tactical intelligence, game adjustment & motivational huddle speech
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => {
                setTempApiKey(apiKey);
                setIsApiKeyOpen(!isApiKeyOpen);
              }}
              className="btn-icon btn-sm"
              title="Configure Gemini API Key"
              style={{
                background: apiKey ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                color: apiKey ? '#34d399' : '#cbd5e1',
                borderRadius: '8px',
                padding: '0.4rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Key size={16} />
            </button>
            <button
              type="button"
              className="btn-icon btn-sm"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '0.4rem',
                color: '#94a3b8',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* API Key Drawer */}
        {isApiKeyOpen && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              background: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              animation: 'slideDown 0.15s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e2e8f0' }}>
                Google Gemini API Key (Optional)
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.72rem',
                  color: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  textDecoration: 'none',
                  fontWeight: 700
                }}
              >
                <span>Get Free Key at Google AI Studio</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="password"
                placeholder="AIzaSy... (Paste Gemini API key or leave blank for built-in coach)"
                className="form-input"
                style={{ flex: 1, fontSize: '0.82rem', padding: '0.45rem 0.75rem' }}
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveApiKey}
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  borderColor: '#a855f7',
                  padding: '0.45rem 0.9rem',
                  fontWeight: 800,
                  fontSize: '0.8rem'
                }}
              >
                Save Key
              </button>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              Your key is saved locally in your browser and used to power real-time AI volleyball coaching.
            </div>
          </div>
        )}

        {/* Live Match Ribbon */}
        <div
          style={{
            padding: '0.55rem 1.25rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.76rem',
            fontWeight: 700,
            color: '#cbd5e1'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>Set {setNumber}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
            <span style={{ color: '#f8fafc', fontWeight: 900 }}>
              US {ourScore} - {oppScore} {opponentName}
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
            <span style={{ color: '#c084fc' }}>Rotation {rotation}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>|</span>
            <span style={{ color: phase === 'serve' ? '#60a5fa' : '#fbbf24' }}>
              {phase === 'serve' ? '🏐 Serving' : '🛡️ Receiving'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={handleSpeak}
              className="btn btn-secondary btn-sm"
              disabled={loading || !adviceData}
              style={{
                fontSize: '0.72rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                background: isSpeaking ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                borderColor: isSpeaking ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                color: isSpeaking ? '#fca5a5' : '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              title="Speak Head Coach huddle pep talk aloud"
            >
              {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span>{isSpeaking ? 'Stop Audio' : 'Speak to Huddle'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="btn btn-secondary btn-sm"
              disabled={loading || !adviceData}
              style={{
                fontSize: '0.72rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              title="Copy tactical breakdown & pep talk"
            >
              {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleAnalyze()}
              className="btn btn-primary btn-sm"
              disabled={loading}
              style={{
                fontSize: '0.72rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #a855f7, #3b82f6)',
                borderColor: '#a855f7',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontWeight: 800
              }}
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Thinking...' : 'Refresh Advice'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div
          style={{
            padding: '1rem 1.25rem',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            flex: 1
          }}
        >
          {(!user || !user.uid) ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                border: '1.5px dashed rgba(168, 85, 247, 0.35)',
                margin: 'auto 0'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(59, 130, 246, 0.35))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  border: '1px solid rgba(168, 85, 247, 0.5)'
                }}
              >
                <Sparkles size={28} color="#c084fc" />
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#f8fafc', fontWeight: 800 }}>
                Sign In Required for AI Coach
              </h3>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.86rem', color: '#94a3b8', maxWidth: '400px', lineHeight: 1.5 }}>
                To consult the Gemini Head Coach for tactical rotations, live error adjustments, and huddle pep talks, please log in or create a free coach account.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (onOpenAuthModal) onOpenAuthModal();
                }}
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  border: 'none',
                  padding: '0.65rem 1.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
                  cursor: 'pointer'
                }}
              >
                Sign In to Unlock AI Coach
              </button>
            </div>
          ) : (
            <>
              {/* Quick Scenario Chips */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Quick Situational Inquiries:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {QUICK_PROMPTS.map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleSelectChip(p)}
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '0.3rem 0.65rem',
                        borderRadius: '8px',
                        background: selectedChip === p.label ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${selectedChip === p.label ? '#a855f7' : 'rgba(255, 255, 255, 0.1)'}`,
                        color: selectedChip === p.label ? '#e9d5ff' : '#cbd5e1',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1rem',
                gap: '0.75rem',
                color: '#c084fc'
              }}
            >
              <Sparkles size={36} className="animate-spin" />
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                Head Coach Analyzing Match State...
              </div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                Evaluating rotation R{rotation}, error distribution & momentum against {opponentName}
              </div>
            </div>
          )}

          {/* Advice Render */}
          {!loading && adviceData && (
            <>
              {/* Card 1: Tactical Gameplan */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1.5px solid rgba(59, 130, 246, 0.35)',
                  borderRadius: '16px',
                  padding: '1rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Target size={16} color="#60a5fa" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Tactical Adjustments (What To Do Right Now)
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {adviceData.tacticalAdvice.map((t, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontSize: '0.84rem',
                        lineHeight: 1.45,
                        color: '#f1f5f9',
                        padding: '0.45rem 0.6rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.03)'
                      }}
                    >
                      <Zap size={14} color="#3b82f6" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <div>{t}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Rotation & Player Directives */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1.5px solid rgba(168, 85, 247, 0.35)',
                  borderRadius: '16px',
                  padding: '1rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'rgba(168, 85, 247, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Users size={16} color="#c084fc" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#e9d5ff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Rotation {rotation} Player Directives
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {adviceData.playerFocus.map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontSize: '0.84rem',
                        lineHeight: 1.45,
                        color: '#f1f5f9',
                        padding: '0.45rem 0.6rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.03)'
                      }}
                    >
                      <Award size={14} color="#a855f7" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <div>{p}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Head Coach Motivational Pep Talk */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.12) 100%)',
                  border: '1.5px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '16px',
                  padding: '1.15rem',
                  boxShadow: '0 8px 30px rgba(245, 158, 11, 0.15)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'rgba(245, 158, 11, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Flame size={16} color="#fbbf24" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 900, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Head Coach Huddle Speech
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleSpeak}
                    style={{
                      background: isSpeaking ? '#ef4444' : 'rgba(245, 158, 11, 0.25)',
                      color: isSpeaking ? '#fff' : '#fef08a',
                      border: `1px solid ${isSpeaking ? '#ef4444' : 'rgba(245, 158, 11, 0.5)'}`,
                      borderRadius: '6px',
                      padding: '0.2rem 0.5rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    <span>{isSpeaking ? 'Stop' : 'Play to Team'}</span>
                  </button>
                </div>

                <div
                  style={{
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    lineHeight: 1.55,
                    color: '#fffbeb',
                    borderLeft: '3px solid #f59e0b',
                    paddingLeft: '0.85rem'
                  }}
                >
                  {adviceData.motivationalSpeech}
                </div>
              </div>
            </>
          )}

          {/* Interactive Question Input Box */}
          <div
            style={{
              marginTop: '0.25rem',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '0.75rem 0.9rem'
            }}
          >
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MessageSquare size={13} color="#a855f7" />
              <span>Ask Coach a Specific Question or Scenario:</span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = typeof customQuestion === 'string' ? customQuestion.trim() : '';
                if (q) {
                  handleAnalyze(q);
                }
              }}
              style={{ display: 'flex', gap: '0.5rem' }}
            >
              <input
                type="text"
                placeholder="e.g. Their middle is dominating on quick 1s, how do we counter?"
                className="form-input"
                style={{ flex: 1, fontSize: '0.82rem', padding: '0.5rem 0.75rem' }}
                value={typeof customQuestion === 'string' ? customQuestion : ''}
                onChange={(e) => setCustomQuestion(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={loading || typeof customQuestion !== 'string' || !customQuestion.trim()}
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  borderColor: '#a855f7',
                  padding: '0.5rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: 800
                }}
              >
                <Send size={14} />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </>
      )}

    </div>
  </div>
    </div>
  );
}
