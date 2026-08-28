import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Repeat,
  Gauge,
  Sparkles,
  Info,
  Volleyball
} from 'lucide-react';
import { FORMATION_ANIMATIONS } from '../services/formationAnimationsData';

export default function FormationAnimationPlayer({
  rotation = 1,
  phase = 'receiving',
  currentStageIndex = 0,
  isPlaying = false,
  playbackSpeed = 1,
  isLooping = true,
  onStageChange,
  onPlayPauseToggle,
  onReset,
  onSpeedChange,
  onLoopToggle
}) {
  const currentRotationData = FORMATION_ANIMATIONS[rotation] || FORMATION_ANIMATIONS[1];
  const phaseData = currentRotationData[phase] || currentRotationData.receiving;
  const stages = phaseData.stages || [];
  const currentStage = stages[currentStageIndex] || stages[0];

  const speedOptions = [0.5, 1, 1.5, 2];

  return (
    <div className="animation-player-card">
      {/* Player Header */}
      <div className="animation-player-header">
        <div className="anim-header-left">
          <div className="anim-icon-badge">
            <Volleyball size={18} color="#f59e0b" className={isPlaying ? 'anim-spin' : ''} />
          </div>
          <div>
            <div className="anim-header-title">
              Tactical Rally Simulator — Rotation {rotation}
            </div>
            <div className="anim-header-sub">
              {phase === 'receiving' ? 'Serve Receive ➔ Setter Penetration ➔ Attack Transition' : 'Serve Baseline ➔ Net Switch ➔ Base Defense ➔ Counter Attack'}
            </div>
          </div>
        </div>

        {/* Speed & Loop Controls */}
        <div className="anim-header-right">
          {/* Speed Selector */}
          <div className="anim-speed-selector">
            <Gauge size={14} color="#94a3b8" />
            {speedOptions.map((spd) => (
              <button
                key={spd}
                className={`anim-speed-btn ${playbackSpeed === spd ? 'active' : ''}`}
                onClick={() => onSpeedChange && onSpeedChange(spd)}
                title={`Playback Speed: ${spd}x`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Loop Toggle */}
          <button
            className={`anim-loop-btn ${isLooping ? 'active' : ''}`}
            onClick={onLoopToggle}
            title={isLooping ? 'Auto-Loop is ON' : 'Auto-Loop is OFF'}
          >
            <Repeat size={14} />
            <span>Loop</span>
          </button>
        </div>
      </div>

      {/* Main Transport & Timeline Bar */}
      <div className="animation-transport-bar">
        {/* Playback Buttons */}
        <div className="transport-buttons">
          <button
            className="btn-transport"
            onClick={() => onStageChange && onStageChange(Math.max(0, currentStageIndex - 1))}
            disabled={currentStageIndex === 0 && !isLooping}
            title="Previous Step (⏮)"
          >
            <SkipBack size={16} />
          </button>

          <button
            className={`btn-transport-play ${isPlaying ? 'is-playing' : ''}`}
            onClick={onPlayPauseToggle}
            title={isPlaying ? 'Pause Animation (Spacebar)' : 'Play Animation (Spacebar)'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
          </button>

          <button
            className="btn-transport"
            onClick={() => onStageChange && onStageChange((currentStageIndex + 1) % stages.length)}
            title="Next Step (⏭)"
          >
            <SkipForward size={16} />
          </button>

          <button
            className="btn-transport"
            onClick={onReset}
            title="Reset Animation to Step 1 (🔄)"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Multi-Stage Scrubber Timeline */}
        <div className="timeline-stages-wrapper">
          <div className="timeline-progress-track">
            <div
              className="timeline-progress-fill"
              style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
            />
          </div>

          <div className="timeline-stage-buttons">
            {stages.map((stg, idx) => {
              const isActive = idx === currentStageIndex;
              const isPast = idx < currentStageIndex;

              return (
                <button
                  key={stg.id}
                  className={`timeline-stage-btn ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}
                  onClick={() => onStageChange && onStageChange(idx)}
                  title={`Jump to Stage ${idx + 1}: ${stg.name}`}
                >
                  <div className="stage-num-badge">{idx + 1}</div>
                  <span className="stage-label-text">{stg.name.split('. ')[1] || stg.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-Time Tactical Narrative Box */}
      <div className="animation-narrative-box">
        <div className="narrative-header">
          <div className="narrative-badge">
            STAGE {currentStageIndex + 1} OF {stages.length}
          </div>
          <div className="narrative-title">
            {currentStage?.title || ''}
          </div>
        </div>
        <div className="narrative-desc">
          {currentStage?.narrative || ''}
        </div>
      </div>
    </div>
  );
}
