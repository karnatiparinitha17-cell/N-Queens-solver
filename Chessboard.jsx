import React, { useMemo } from 'react';
import { getAttackingPairs, getConflictingColumns, computeAttackHeatmap } from '../algorithms.js';
import { Flame, Eye, EyeOff } from 'lucide-react';

// Royal Queen SVG Piece with gradient and crown details
export function QueenPiece({ conflicted = false, size = '100%' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`queen-piece ${conflicted ? 'queen-conflicted' : ''}`}
      style={{ width: size, height: size }}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="conflictGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="50%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
      </defs>

      {/* Base */}
      <ellipse
        cx="50"
        cy="86"
        rx="36"
        ry="8"
        fill={conflicted ? "url(#conflictGradient)" : "url(#goldGradient)"}
      />
      <path
        d="M 20 86 Q 50 80 80 86 L 75 74 Q 50 78 25 74 Z"
        fill={conflicted ? "#be123c" : "#d97706"}
      />

      {/* Main Body */}
      <path
        d="M 25 74 L 14 38 L 32 54 L 50 26 L 68 54 L 86 38 L 75 74 Z"
        fill={conflicted ? "url(#conflictGradient)" : "url(#goldGradient)"}
        stroke={conflicted ? "#881337" : "#78350f"}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Crown Jewels (Balls on peaks) */}
      <circle cx="14" cy="36" r="5" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="32" cy="52" r="4.5" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="50" cy="24" r="6" fill="#fef08a" stroke="#78350f" strokeWidth="2" />
      <circle cx="68" cy="52" r="4.5" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="86" cy="36" r="5" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />

      {/* Center Ruby Accent */}
      <ellipse
        cx="50"
        cy="66"
        rx="5.5"
        ry="7"
        fill={conflicted ? "#ffffff" : "#ef4444"}
        stroke="#78350f"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function Chessboard({
  board = [],
  n = 8,
  showRays = true,
  showHeatmap = false,
  highlightCell = null,
  isMini = false
}) {
  const columnLabels = useMemo(() => {
    return Array.from({ length: n }, (_, i) => {
      return i < 26 ? String.fromCharCode(65 + i) : `C${i}`;
    });
  }, [n]);

  // Find attacking pairs and conflicting columns
  const attackingPairs = useMemo(() => {
    return getAttackingPairs(board);
  }, [board]);

  const conflictingCols = useMemo(() => {
    return getConflictingColumns(board);
  }, [board]);

  const heatmap = useMemo(() => {
    if (!showHeatmap) return null;
    return computeAttackHeatmap(board, n);
  }, [board, n, showHeatmap]);

  // Sizing calculation
  const maxBoardPx = isMini ? 260 : Math.min(540, Math.max(340, 560 - (n - 4) * 8));

  return (
    <div className="chessboard-wrapper" style={{ padding: isMini ? '0.5rem' : '1rem' }}>
      
      {/* Chessboard container with labels */}
      <div style={{ position: 'relative' }}>
        
        {/* Top Column Labels */}
        {!isMini && n <= 14 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${n}, 1fr)`,
            width: `${maxBoardPx}px`,
            margin: '0 auto 4px auto',
            textAlign: 'center',
            fontSize: n > 10 ? '0.65rem' : '0.8rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: 'var(--text-muted)'
          }}>
            {columnLabels.map((lbl, idx) => (
              <div key={idx}>{lbl}</div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          
          {/* Left Row Labels */}
          {!isMini && n <= 14 && (
            <div style={{
              display: 'grid',
              gridTemplateRows: `repeat(${n}, 1fr)`,
              height: `${maxBoardPx}px`,
              marginRight: '6px',
              alignItems: 'center',
              fontSize: n > 10 ? '0.65rem' : '0.8rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--text-muted)'
            }}>
              {Array.from({ length: n }, (_, i) => (
                <div key={i} style={{ textAlign: 'right', paddingRight: '4px' }}>
                  {n - i}
                </div>
              ))}
            </div>
          )}

          {/* Actual Board Grid */}
          <div
            className="board-outer"
            style={{
              width: `${maxBoardPx}px`,
              height: `${maxBoardPx}px`,
            }}
          >
            {/* SVG Laser Rays for Conflicts */}
            {showRays && attackingPairs.length > 0 && (
              <svg className="conflict-overlay">
                {attackingPairs.map((pair, pIdx) => {
                  const [p1, p2] = pair;
                  const cellSizePct = 100 / n;
                  const x1 = (p1.col + 0.5) * cellSizePct;
                  const y1 = (p1.row + 0.5) * cellSizePct;
                  const x2 = (p2.col + 0.5) * cellSizePct;
                  const y2 = (p2.row + 0.5) * cellSizePct;
                  return (
                    <line
                      key={pIdx}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      className="conflict-ray"
                    />
                  );
                })}
              </svg>
            )}

            <div
              className="board-grid"
              style={{
                gridTemplateColumns: `repeat(${n}, 1fr)`,
                gridTemplateRows: `repeat(${n}, 1fr)`,
              }}
            >
              {Array.from({ length: n * n }).map((_, idx) => {
                const row = Math.floor(idx / n);
                const col = idx % n;
                const isLight = (row + col) % 2 === 0;

                // Queen state
                const hasQueen = board[col] === row;
                const isConflicted = hasQueen && conflictingCols.has(col);
                const isHighlight = highlightCell && highlightCell.row === row && highlightCell.col === col;

                // Heatmap intensity
                const heatCount = heatmap ? heatmap[row][col] : 0;
                const heatBg = heatCount > 0 ? `rgba(239, 68, 68, ${Math.min(0.55, heatCount * 0.12)})` : null;

                return (
                  <div
                    key={`${row}-${col}`}
                    className={`board-cell ${isLight ? 'cell-light' : 'cell-dark'} ${
                      isConflicted ? 'has-conflict' : ''
                    } ${isHighlight ? 'is-safe' : ''}`}
                    style={{
                      background: heatBg || undefined,
                      border: isHighlight ? '2px solid #3b82f6' : undefined
                    }}
                    title={`Row: ${n - row}, Col: ${columnLabels[col] || col} (${row}, ${col})`}
                  >
                    {hasQueen && (
                      <QueenPiece
                        conflicted={isConflicted}
                        size={n > 12 ? '90%' : '80%'}
                      />
                    )}

                    {/* Heatmap overlay count */}
                    {showHeatmap && !hasQueen && heatCount > 0 && !isMini && (
                      <span
                        className="heatmap-indicator"
                        style={{
                          background: heatCount > 2 ? 'rgba(239, 68, 68, 0.85)' : 'rgba(245, 158, 11, 0.85)',
                          color: '#ffffff'
                        }}
                      >
                        {heatCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
