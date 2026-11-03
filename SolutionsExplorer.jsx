import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Download, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import Chessboard from './Chessboard.jsx';
import { fetchAllSolutionsAPI } from '../api.js';
import { KNOWN_N_QUEENS_SOLUTIONS } from '../algorithms.js';

export default function SolutionsExplorer({ currentN = 8, useBackend = false }) {
  const [n, setN] = useState(currentN > 10 ? 8 : currentN);
  const [solutions, setSolutions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const reference = KNOWN_N_QUEENS_SOLUTIONS[n];

  const loadAllSolutions = async (boardSize) => {
    setIsLoading(true);
    try {
      const data = await fetchAllSolutionsAPI(boardSize, 200, useBackend);
      setSolutions(data.solutions || []);
      setCurrentIndex(0);
      setStats({
        executionTimeMs: data.executionTimeMs,
        iterations: data.iterations,
        backtracks: data.backtracks,
        totalFound: data.totalFound
      });
    } catch (err) {
      console.error('Failed to load solutions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllSolutions(n);
  }, [n, useBackend]);

  const currentBoard = solutions[currentIndex] || [];

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crown size={22} color="#fbbf24" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              All Valid Solutions Explorer (Backtracking)
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            Exhaustively enumerates valid non-attacking configurations and displays them interactively.
          </p>
        </div>

        {/* Board size selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Size N:</span>
          {[4, 5, 6, 7, 8, 9, 10].map(size => (
            <button
              key={size}
              onClick={() => setN(size)}
              className="btn btn-secondary"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                borderColor: n === size ? 'var(--accent-blue)' : undefined,
                background: n === size ? 'rgba(59, 130, 246, 0.2)' : undefined,
                color: n === size ? 'var(--accent-blue)' : undefined
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Chessboard on Left, Solution Browser & List on Right */}
      <div className="grid-visualizer">
        
        {/* Left: Active Solution Board */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="metric-badge metric-badge-success" style={{ fontSize: '0.75rem' }}>
              <CheckCircle2 size={13} /> Solution #{currentIndex + 1} of {solutions.length}
            </span>
          </div>

          <Chessboard
            board={currentBoard}
            n={n}
            showRays={false}
          />

          {/* Solution Vector */}
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vector:</span>
            <code className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
              [{currentBoard.join(', ')}]
            </code>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0 || isLoading}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem' }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, minWidth: '80px', textAlign: 'center' }}>
              {currentIndex + 1} / {solutions.length}
            </span>

            <button
              onClick={() => setCurrentIndex(prev => Math.min(solutions.length - 1, prev + 1))}
              disabled={currentIndex >= solutions.length - 1 || isLoading}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem' }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right: Telemetry & Solution Selection Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Reference Stats Card */}
          <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--accent-blue)' }}>
              Combinatorial Reference for N={n}
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Total Distinct Solutions:</span>
                <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
                  {reference ? reference.total.toLocaleString() : 'N/A'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)' }}>Fundamental (Non-Symmetric):</span>
                <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-violet)' }}>
                  {reference ? reference.fundamental.toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            {stats && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Enumerated in <strong>{stats.executionTimeMs} ms</strong> ({stats.iterations.toLocaleString()} explorations, {stats.backtracks.toLocaleString()} backtracks).
              </div>
            )}
          </div>

          {/* Quick Clickable Solution Grid */}
          <div style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', maxHeight: '340px', overflowY: 'auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Jump Directly to Solution:
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))', gap: '0.35rem' }}>
              {solutions.map((sol, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className="font-mono"
                  style={{
                    padding: '0.4rem 0.2rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: currentIndex === idx ? 800 : 500,
                    borderRadius: '6px',
                    border: currentIndex === idx ? '2px solid var(--accent-blue)' : '1px solid var(--border-color)',
                    background: currentIndex === idx ? 'rgba(59, 130, 246, 0.3)' : 'var(--bg-secondary)',
                    color: currentIndex === idx ? '#ffffff' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
