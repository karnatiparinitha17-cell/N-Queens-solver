import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Zap, 
  Sparkles, 
  Sliders, 
  Activity,
  Flame,
  GitBranch,
  TrendingDown
} from 'lucide-react';

export default function VisualizerControls({
  algorithm,
  setAlgorithm,
  n,
  setN,
  isPlaying,
  isPaused,
  onStart,
  onPause,
  onResume,
  onReset,
  onStepForward,
  onStepBackward,
  speed,
  setSpeed,
  currentStepIndex,
  totalSteps,
  showRays,
  setShowRays,
  showHeatmap,
  setShowHeatmap,
  canStepForward,
  canStepBackward
}) {
  const PRESET_SIZES = [4, 5, 6, 7, 8, 10];

  return (
    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      
      {/* 1. Algorithm Selector Grid */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.6rem' }}>
          Select AI Algorithm
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          
          {/* Backtracking */}
          <button
            onClick={() => setAlgorithm('backtracking')}
            className="glass-card"
            style={{
              padding: '0.75rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
              border: algorithm === 'backtracking' ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
              background: algorithm === 'backtracking' ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-input)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <GitBranch size={16} color="#3b82f6" />
              <strong style={{ fontSize: '0.9rem' }}>Backtracking</strong>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
              Exact DFS with branch pruning & conflict checking.
            </p>
          </button>

          {/* Hill Climbing */}
          <button
            onClick={() => setAlgorithm('hill_climbing')}
            className="glass-card"
            style={{
              padding: '0.75rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
              border: algorithm === 'hill_climbing' ? '2px solid var(--accent-emerald)' : '1px solid var(--border-color)',
              background: algorithm === 'hill_climbing' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-input)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <TrendingDown size={16} color="#10b981" />
              <strong style={{ fontSize: '0.9rem' }}>Hill Climbing</strong>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
              Heuristic steepest descent with random restarts.
            </p>
          </button>

          {/* Simulated Annealing */}
          <button
            onClick={() => setAlgorithm('simulated_annealing')}
            className="glass-card"
            style={{
              padding: '0.75rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
              border: algorithm === 'simulated_annealing' ? '2px solid var(--accent-amber)' : '1px solid var(--border-color)',
              background: algorithm === 'simulated_annealing' ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-input)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Flame size={16} color="#f59e0b" />
              <strong style={{ fontSize: '0.9rem' }}>Simulated Annealing</strong>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
              Stochastic Boltzmann cooling & probabilistic search.
            </p>
          </button>

        </div>
      </div>

      {/* 2. Board Size Selection */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            Board Size (N × N, Queens = {n})
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
            {n} Queens on a {n}×{n} Grid
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {PRESET_SIZES.map(size => (
            <button
              key={size}
              onClick={() => setN(size)}
              className="btn btn-secondary"
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderColor: n === size ? 'var(--accent-blue)' : undefined,
                background: n === size ? 'rgba(59, 130, 246, 0.2)' : undefined,
                color: n === size ? 'var(--accent-blue)' : undefined
              }}
            >
              {size} × {size}
            </button>
          ))}

          {/* Custom Size Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Custom N:</span>
            <input
              type="range"
              min="4"
              max="20"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value, 10))}
              style={{ width: '100px' }}
            />
            <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '24px' }}>
              {n}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Action Controls & Playback */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        
        {/* Play/Pause/Resume & Step Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {!isPlaying && !isPaused && (
            <button
              onClick={onStart}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem' }}
            >
              <Play size={16} />
              <span>Solve & Visualize</span>
            </button>
          )}

          {isPlaying && (
            <button
              onClick={onPause}
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1rem' }}
            >
              <Pause size={16} />
              <span>Pause</span>
            </button>
          )}

          {isPaused && (
            <button
              onClick={onResume}
              className="btn btn-success"
              style={{ padding: '0.55rem 1.1rem' }}
            >
              <Play size={16} />
              <span>Resume</span>
            </button>
          )}

          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={!canStepBackward}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 0.75rem' }}
            title="Previous Step"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={!canStepForward}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 0.75rem' }}
            title="Next Step"
          >
            <ChevronRight size={16} />
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 0.85rem' }}
            title="Reset Board"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        {/* Speed Slider & Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={14} color="#f59e0b" />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Speed:</span>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={505 - speed} // inverted so right is faster
              onChange={(e) => setSpeed(505 - parseInt(e.target.value, 10))}
              style={{ width: '80px' }}
              title={`Delay: ${speed}ms per step`}
            />
          </div>

          {/* Laser Rays Toggle */}
          <button
            onClick={() => setShowRays(!showRays)}
            className="btn btn-secondary"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              background: showRays ? 'rgba(239, 68, 68, 0.15)' : undefined,
              borderColor: showRays ? 'rgba(239, 68, 68, 0.4)' : undefined,
              color: showRays ? '#f43f5e' : undefined
            }}
            title="Toggle Laser Conflict Rays"
          >
            Laser Rays
          </button>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="btn btn-secondary"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              background: showHeatmap ? 'rgba(245, 158, 11, 0.15)' : undefined,
              borderColor: showHeatmap ? 'rgba(245, 158, 11, 0.4)' : undefined,
              color: showHeatmap ? '#f59e0b' : undefined
            }}
            title="Toggle Attack Density Heatmap"
          >
            Heatmap
          </button>

        </div>

      </div>

      {/* Step Progress Bar */}
      {totalSteps > 0 && (
        <div style={{ marginTop: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            <span>Visualization Progress</span>
            <span className="font-mono">
              Step {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)',
              transition: 'width 0.1s linear'
            }} />
          </div>
        </div>
      )}

    </div>
  );
}
