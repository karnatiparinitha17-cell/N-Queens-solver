import React, { useState } from 'react';
import { 
  Play, 
  Download, 
  Trophy, 
  Clock, 
  Hash, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle,
  BarChart2,
  GitBranch,
  TrendingDown,
  Flame,
  Layers
} from 'lucide-react';
import Chessboard from './Chessboard.jsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ComparisonDashboard({
  benchmarkData,
  onRunBenchmark,
  isRunning,
  n,
  setN,
  onExportCSV
}) {
  const PRESET_SIZES = [4, 5, 6, 7, 8, 10, 12];
  const [selectedSize, setSelectedSize] = useState(n);

  const results = benchmarkData?.results || [];
  const winner = benchmarkData?.winner;

  // Chart data setup
  const chartLabels = results.map(r => r.algorithm);
  
  const timeChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Execution Time (ms)',
        data: results.map(r => r.executionTimeMs),
        backgroundColor: [
          'rgba(59, 130, 246, 0.75)',
          'rgba(16, 185, 129, 0.75)',
          'rgba(245, 158, 11, 0.75)'
        ],
        borderColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b'
        ],
        borderWidth: 1.5,
        borderRadius: 8
      }
    ]
  };

  const stepsChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Search Steps / Iterations',
        data: results.map(r => r.iterations),
        backgroundColor: [
          'rgba(139, 92, 246, 0.75)',
          'rgba(20, 184, 166, 0.75)',
          'rgba(249, 115, 22, 0.75)'
        ],
        borderColor: [
          '#8b5cf6',
          '#14b8a6',
          '#f97316'
        ],
        borderWidth: 1.5,
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Outfit', size: 13 },
        bodyFont: { family: 'JetBrains Mono', size: 12 },
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Outfit', weight: 600 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono' } }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner & Run All Bar */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0' }}>
              Multi-Algorithm Comparative Benchmark
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              Simultaneously executes Backtracking, Hill Climbing, and Simulated Annealing with actual hardware timing.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Size selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Size N:</span>
              <select
                value={selectedSize}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setSelectedSize(val);
                  setN(val);
                }}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                {PRESET_SIZES.map(s => (
                  <option key={s} value={s}>{s} × {s}</option>
                ))}
              </select>
            </div>

            {/* Run All Button */}
            <button
              onClick={() => onRunBenchmark(selectedSize)}
              disabled={isRunning}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem' }}
            >
              <Play size={16} />
              <span>{isRunning ? 'Benchmarking...' : 'Run All Algorithms'}</span>
            </button>

            {/* CSV Download */}
            <button
              onClick={onExportCSV}
              disabled={results.length === 0}
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1rem' }}
              title="Download Benchmark Report in CSV"
            >
              <Download size={15} />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Winner Highlight Card */}
        {winner && (
          <div style={{
            marginTop: '1rem',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Trophy size={26} color="#10b981" />
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981', fontWeight: 700 }}>
                  Fastest Algorithm for N={selectedSize}
                </span>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                  {winner.fastestAlgorithm} ({winner.fastestTimeMs} ms)
                </h4>
              </div>
            </div>

            {benchmarkData.referenceSolutions && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Known Total Solutions for N={selectedSize}: <strong style={{ color: 'var(--text-primary)' }}>{benchmarkData.referenceSolutions.total.toLocaleString()}</strong> (Fundamental: {benchmarkData.referenceSolutions.fundamental})
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3 Side-by-Side Algorithm Cards */}
      <div className="grid-3">
        {results.map((res, idx) => {
          const isWinner = winner?.fastestAlgorithm === res.algorithm;
          const isBt = res.algorithm.includes('Backtracking');
          const isHc = res.algorithm.includes('Hill');
          const isSa = res.algorithm.includes('Annealing');

          const accentColor = isBt ? '#3b82f6' : isHc ? '#10b981' : '#f59e0b';
          const Icon = isBt ? GitBranch : isHc ? TrendingDown : Flame;

          return (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '1.25rem',
                border: isWinner ? `2px solid ${accentColor}` : undefined,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {isWinner && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  letterSpacing: '0.05em',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
                }}>
                  Winner by Speed
                </div>
              )}

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Icon size={18} color={accentColor} />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>
                    {res.algorithm}
                  </h3>
                </div>

                {res.success ? (
                  <span className="metric-badge metric-badge-success" style={{ fontSize: '0.65rem' }}>
                    <CheckCircle2 size={12} /> Solved
                  </span>
                ) : (
                  <span className="metric-badge metric-badge-danger" style={{ fontSize: '0.65rem' }}>
                    <XCircle size={12} /> Limit Reached
                  </span>
                )}
              </div>

              {/* Mini Chessboard Visualization */}
              <div style={{ margin: '0.5rem 0', display: 'flex', justifyContent: 'center' }}>
                <Chessboard
                  board={res.board || []}
                  n={res.n}
                  showRays={res.finalConflicts > 0}
                  isMini={true}
                />
              </div>

              {/* Metric Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Execution Time:</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: accentColor }}>
                    {res.executionTimeMs} ms
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Search Iterations:</span>
                  <span className="font-mono" style={{ fontWeight: 600 }}>
                    {res.iterations.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Attacking Conflicts:</span>
                  <span className="font-mono" style={{ fontWeight: 700, color: res.finalConflicts === 0 ? '#10b981' : '#f43f5e' }}>
                    {res.finalConflicts}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Restarts / Backtracks:</span>
                  <span className="font-mono" style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
                    {isBt ? `${res.backtracks || 0} backtracks` : isHc ? `${res.restarts || 0} restarts` : '0 (probabilistic)'}
                  </span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Visual Comparison Charts */}
      {results.length > 0 && (
        <div className="grid-2">
          
          {/* Chart 1: Execution Time */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} color="#3b82f6" />
              <span>Execution Time Comparison (Milliseconds)</span>
            </h3>
            <div style={{ height: '220px' }}>
              <Bar data={timeChartData} options={chartOptions} />
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.5rem 0 0 0', textAlign: 'center' }}>
              Lower execution time indicates superior real-world performance for N={selectedSize}.
            </p>
          </div>

          {/* Chart 2: Iterations */}
          <div className="glass-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Hash size={16} color="#8b5cf6" />
              <span>Search Steps / Iterations Comparison</span>
            </h3>
            <div style={{ height: '220px' }}>
              <Bar data={stepsChartData} options={chartOptions} />
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0.5rem 0 0 0', textAlign: 'center' }}>
              Fewer iterations represent higher search efficiency and less node exploration.
            </p>
          </div>

        </div>
      )}

      {/* Detailed Benchmark Summary Table */}
      {results.length > 0 && (
        <div className="glass-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Measured Telemetry Data Table (No Fabrications)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Algorithm</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Board Size</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Status</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Execution Time</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Search Steps</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Conflicts</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Restarts</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Guaranteed Complete?</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>{r.algorithm}</td>
                  <td className="font-mono" style={{ padding: '0.65rem 0.75rem' }}>{r.n} × {r.n}</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>
                    <span className={`metric-badge ${r.success ? 'metric-badge-success' : 'metric-badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                      {r.success ? 'Success' : 'Limit Reached'}
                    </span>
                  </td>
                  <td className="font-mono" style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: 'var(--accent-blue)' }}>
                    {r.executionTimeMs} ms
                  </td>
                  <td className="font-mono" style={{ padding: '0.65rem 0.75rem' }}>{r.iterations.toLocaleString()}</td>
                  <td className="font-mono" style={{ padding: '0.65rem 0.75rem', color: r.finalConflicts === 0 ? '#10b981' : '#f43f5e' }}>
                    {r.finalConflicts}
                  </td>
                  <td className="font-mono" style={{ padding: '0.65rem 0.75rem' }}>{r.restarts || 0}</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: r.algorithm.includes('Backtracking') ? '#10b981' : '#f59e0b' }}>
                    {r.algorithm.includes('Backtracking') ? 'Yes (Exhaustive)' : 'No (Heuristic)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
