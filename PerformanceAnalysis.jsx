import React from 'react';
import { 
  Trophy, 
  TrendingUp, 
  AlertTriangle, 
  HelpCircle, 
  Zap, 
  GitBranch, 
  TrendingDown, 
  Flame, 
  Check, 
  X,
  Compass
} from 'lucide-react';

export default function PerformanceAnalysis({ benchmarkData, n }) {
  const winner = benchmarkData?.winner;
  const analysisPoints = benchmarkData?.analysis?.points || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Dynamic Test-Based Winner Banner */}
      <div className="glass-card" style={{
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)'
          }}>
            <Trophy size={28} color="#ffffff" />
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#f59e0b' }}>
              Empirical Performance Verdict
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.15rem 0' }}>
              Best Performing Algorithm for N={n}: {winner ? `${winner.fastestAlgorithm}` : 'Run a Benchmark to Determine'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              {winner 
                ? `Measured fastest completion at ${winner.fastestTimeMs} ms with ${winner.leastIterationsAlgorithm} having the fewest search iterations.`
                : 'Execute the benchmark from the Comparison tab or Visualizer to evaluate real hardware metrics.'}
            </p>
          </div>
        </div>

        {/* Dynamic Analysis Bullets */}
        {analysisPoints.length > 0 && (
          <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--accent-blue)' }}>
              Actual Test Observations for N={n}:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {analysisPoints.map((pt, idx) => (
                <li key={idx} style={{ lineHeight: 1.45 }}>{pt}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 2. Algorithm Advantages & Limitations Comparison Cards */}
      <div className="grid-3">
        
        {/* Backtracking */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <GitBranch size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Backtracking</h3>
          </div>
          
          <div style={{ marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem' }}>
              <Check size={14} /> Advantages
            </span>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1rem', margin: 0, lineHeight: 1.4 }}>
              <li><strong>Guaranteed Completeness:</strong> Always finds a valid solution if one exists.</li>
              <li><strong>Zero Conflicts in State:</strong> Queens placed incrementally are never allowed to attack each other.</li>
              <li><strong>Can Count All Solutions:</strong> Capable of exhaustively enumerating all solutions for a given N.</li>
            </ul>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem' }}>
              <X size={14} /> Limitations
            </span>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1rem', margin: 0, lineHeight: 1.4 }}>
              <li><strong>Exponential Worst Case:</strong> Time complexity is O(N!), causing search timeout for N &gt; 25.</li>
              <li><strong>Exhaustive Tree Traversal:</strong> Cannot jump across disconnected states.</li>
            </ul>
          </div>
        </div>

        {/* Hill Climbing */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <TrendingDown size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Hill Climbing</h3>
          </div>
          
          <div style={{ marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem' }}>
              <Check size={14} /> Advantages
            </span>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1rem', margin: 0, lineHeight: 1.4 }}>
              <li><strong>Minimal Memory Footprint:</strong> O(N) space, only stores the current board configuration.</li>
              <li><strong>Lightning Fast on Easy Landscapes:</strong> Takes greedy downhill steps that can solve moderate N in few moves.</li>
              <li><strong>Intuitive Objective:</strong> Directly minimizes attacking pairs heuristic h(n).</li>
            </ul>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem' }}>
              <X size={14} /> Limitations
            </span>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1rem', margin: 0, lineHeight: 1.4 }}>
              <li><strong>Local Optima & Plateaus:</strong> Frequently gets trapped in states where no neighbor reduces conflicts (86% trap rate on 8-queens).</li>
              <li><strong>Requires Restarts:</strong> Must rely on random restarts to achieve completeness.</li>
            </ul>
          </div>
        </div>

        {/* Simulated Annealing */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Flame size={20} color="#f59e0b" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Simulated Annealing</h3>
          </div>
          
          <div style={{ marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem' }}>
              <Check size={14} /> Advantages
            </span>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1rem', margin: 0, lineHeight: 1.4 }}>
              <li><strong>Escapes Local Optima:</strong> Probabilistically accepts uphill (worse) moves via Metropolis criterion: P = exp(-&Delta;E / T).</li>
              <li><strong>Broad Exploration Early:</strong> High initial temperature allows sweeping state-space traversal.</li>
              <li><strong>Asymptotically Optimal:</strong> Given sufficiently slow logarithmic cooling, theoretical convergence is 100%.</li>
            </ul>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.35rem' }}>
              <X size={14} /> Limitations
            </span>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1rem', margin: 0, lineHeight: 1.4 }}>
              <li><strong>Hyperparameter Sensitive:</strong> Performance depends on initial temperature T0 and cooling rate &alpha;.</li>
              <li><strong>Premature Freezing:</strong> If cooled too rapidly, freezes into non-zero conflict states without reaching h=0.</li>
            </ul>
          </div>
        </div>

      </div>

      {/* 3. The Local Optimum & Plateau Dilemma Section */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={20} color="#3b82f6" />
          <span>The Local Optimum & State Space Landscape Problem</span>
        </h3>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
          In combinatorial optimization puzzles like N-Queens, the search space consists of $N^N$ possible column-based board configurations (for 8-Queens, $8^8 = 16,777,216$ states). The heuristic function $h(state)$ defines the energy landscape, representing the number of attacking queen pairs.
        </p>

        <div className="grid-2">
          
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f43f5e', marginBottom: '0.35rem' }}>
              Why Vanilla Hill Climbing Gets Trapped:
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              On an 8-Queens board, empirical studies show that vanilla steepest-ascent hill climbing succeeds from a random initial state only about <strong>14% of the time</strong>. The remaining <strong>86%</strong> of runs get permanently stuck in:
            </p>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: 1.4 }}>
              <li><strong>Local Minima:</strong> A board state where every single one-queen move results in <em>more</em> conflicts than the current board, even though $h &gt; 0$.</li>
              <li><strong>Plateaus & Shoulders:</strong> Vast flat regions where all neighbor states have the exact same conflict count, giving the gradient search no directional guidance.</li>
              <li><strong>Solution (Random Restarts):</strong> By triggering a fresh random restart whenever a plateau or local minimum is detected, Hill Climbing achieves completeness with an expected restart count of $1 / 0.14 \approx 7$ restarts.</li>
            </ul>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.35rem' }}>
              How Simulated Annealing Solves It:
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Simulated Annealing bypasses local minima by injecting thermodynamic randomness:
            </p>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: 1.4 }}>
              <li><strong>Metropolis Criterion:</strong> When a prospective move increases conflicts by $\Delta E &gt; 0$, instead of rejecting it immediately, SA accepts it with probability:
                <div style={{ margin: '0.35rem 0', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 600 }}>
                  P = exp(-&Delta;E / T)
                </div>
              </li>
              <li><strong>High Temperature Stage:</strong> When $T$ is high, $P \approx 1$, allowing the algorithm to easily climb out of deep conflict valleys.</li>
              <li><strong>Low Temperature Freezing:</strong> As $T \to 0$, $P \to 0$, causing the algorithm to behave like greedy gradient descent and settle into a global minimum ($h=0$).</li>
            </ul>
          </div>

        </div>
      </div>

      {/* 4. Why Algorithms Perform Differently Across Board Sizes */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={20} color="#10b981" />
          <span>Why Performance Changes as Board Size N Increases</span>
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.6rem 0.75rem' }}>Board Scale</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Backtracking Behavior</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Hill Climbing Behavior</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Simulated Annealing Behavior</th>
                <th style={{ padding: '0.6rem 0.75rem' }}>Recommended Algorithm</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Small (N = 4 to 8)</td>
                <td style={{ padding: '0.65rem 0.75rem', color: '#10b981' }}>Ultra-fast (&lt; 2 ms). Rapid pruning eliminates almost all bad branches.</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>Fast, but may require 3-10 random restarts.</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>Converges reliably in 500-2,000 cooling steps.</td>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#3b82f6' }}>Backtracking</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Medium (N = 9 to 14)</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>Search time grows noticeably (10 to 300 ms).</td>
                <td style={{ padding: '0.65rem 0.75rem', color: '#10b981' }}>Often beats Backtracking by finding a single solution in fewer total steps.</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>Consistent convergence; requires balanced cooling rate (&alpha; = 0.993).</td>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#10b981' }}>Hill Climbing (Restarts)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Large (N &ge; 16)</td>
                <td style={{ padding: '0.65rem 0.75rem', color: '#f43f5e' }}>Combinatorial explosion! Tree search can take seconds or minutes.</td>
                <td style={{ padding: '0.65rem 0.75rem' }}>Random restarts can become frequent if steepest ascent is used.</td>
                <td style={{ padding: '0.65rem 0.75rem', color: '#f59e0b' }}>Smooth probabilistic descent without restarting state overhead.</td>
                <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#f59e0b' }}>Simulated Annealing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
