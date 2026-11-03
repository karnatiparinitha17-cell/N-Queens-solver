import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Hash, 
  RotateCcw, 
  Thermometer, 
  Sparkles, 
  GitBranch, 
  Info 
} from 'lucide-react';

export default function LiveMetricsPanel({
  status, // 'idle' | 'running' | 'paused' | 'solved' | 'failed'
  algorithm,
  conflicts,
  iterations,
  executionTimeMs,
  backtracks = 0,
  restarts = 0,
  temperature = null,
  currentStepDescription = '',
  board = [],
  n = 8
}) {
  const isSolved = status === 'solved' || (conflicts === 0 && board.length === n && !board.includes(-1));
  const isFailed = status === 'failed';

  return (
    <div className="glass-card" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header with Status Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
          Live Search Telemetry
        </h3>

        {status === 'running' && (
          <span className="metric-badge metric-badge-info" style={{ animation: 'pulse 1.5s infinite' }}>
            Searching...
          </span>
        )}
        {status === 'paused' && (
          <span className="metric-badge metric-badge-warning">
            Paused
          </span>
        )}
        {isSolved && (
          <span className="metric-badge metric-badge-success">
            <CheckCircle size={12} /> Solved (0 Conflicts)
          </span>
        )}
        {isFailed && (
          <span className="metric-badge metric-badge-danger">
            <ShieldAlert size={12} /> Search Limit Reached
          </span>
        )}
        {status === 'idle' && (
          <span className="metric-badge" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
            Standby
          </span>
        )}
      </div>

      {/* 4 Metric Counter Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        
        {/* Metric 1: Conflicts */}
        <div style={{
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          background: isSolved ? 'rgba(16, 185, 129, 0.1)' : conflicts > 0 ? 'rgba(244, 63, 94, 0.1)' : 'var(--bg-input)',
          border: `1px solid ${isSolved ? 'rgba(16, 185, 129, 0.3)' : conflicts > 0 ? 'rgba(244, 63, 94, 0.25)' : 'var(--border-color)'}`,
          transition: 'all 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isSolved ? '#10b981' : conflicts > 0 ? '#f43f5e' : 'var(--text-secondary)', marginBottom: '0.25rem' }}>
            <ShieldAlert size={15} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Attacking Pairs</span>
          </div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: isSolved ? '#10b981' : conflicts > 0 ? '#f43f5e' : 'var(--text-primary)' }}>
            {conflicts}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {isSolved ? 'Valid non-attacking placement' : 'Conflict pairs to eliminate'}
          </span>
        </div>

        {/* Metric 2: Search Steps / Iterations */}
        <div style={{
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-blue)', marginBottom: '0.25rem' }}>
            <Hash size={15} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Search Steps</span>
          </div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            {iterations.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Nodes / States explored
          </span>
        </div>

        {/* Metric 3: Measured Time */}
        <div style={{
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', marginBottom: '0.25rem' }}>
            <Clock size={15} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Execution Time</span>
          </div>
          <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            {executionTimeMs} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>ms</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Actual high-res benchmark
          </span>
        </div>

        {/* Metric 4: Algorithm Specific Metric */}
        <div style={{
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-color)'
        }}>
          {algorithm === 'backtracking' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-violet)', marginBottom: '0.25rem' }}>
                <GitBranch size={15} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Backtracks</span>
              </div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-violet)' }}>
                {backtracks}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Pruned dead ends
              </span>
            </>
          )}

          {algorithm === 'hill_climbing' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', marginBottom: '0.25rem' }}>
                <RotateCcw size={15} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Random Restarts</span>
              </div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {restarts}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Escapes from local optima
              </span>
            </>
          )}

          {algorithm === 'simulated_annealing' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', marginBottom: '0.25rem' }}>
                <Thermometer size={15} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Temperature (T)</span>
              </div>
              <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                {temperature !== null ? temperature : '0.00'}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Current cooling status
              </span>
            </>
          )}
        </div>

      </div>

      {/* Live Step Action Log Snippet */}
      <div style={{
        marginTop: 'auto',
        padding: '0.85rem',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        minHeight: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
          <Info size={14} />
          <span>Step Action Description</span>
        </div>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          margin: 0,
          lineHeight: 1.4,
          fontFamily: 'var(--font-mono)'
        }}>
          {currentStepDescription || 'Press "Solve & Visualize" to watch the algorithm explore the board.'}
        </p>
      </div>

      {/* Board State Notation */}
      <div style={{
        marginTop: '0.75rem',
        padding: '0.65rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          State Vector (col &rarr; row):
        </span>
        <code className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
          [{board.map(r => (r === -1 ? '_' : r)).join(', ')}]
        </code>
      </div>

    </div>
  );
}
