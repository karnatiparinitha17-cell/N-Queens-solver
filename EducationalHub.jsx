import React, { useState } from 'react';
import { 
  BookOpen, 
  GitBranch, 
  TrendingDown, 
  Flame, 
  HelpCircle, 
  CheckCircle2, 
  Code2, 
  Brain,
  Cpu
} from 'lucide-react';

export default function EducationalHub() {
  const [eduTab, setEduTab] = useState('overview');

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      
      {/* Educational Hub Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={22} color="#3b82f6" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              N-Queens Educational Hub & AI Algorithms Guide
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            A comprehensive, simple English guide to constraint satisfaction and heuristic search in artificial intelligence.
          </p>
        </div>

        {/* Sub tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {[
            { id: 'overview', label: 'Problem Overview', icon: HelpCircle },
            { id: 'backtracking', label: 'Backtracking', icon: GitBranch },
            { id: 'hill_climbing', label: 'Hill Climbing', icon: TrendingDown },
            { id: 'simulated_annealing', label: 'Simulated Annealing', icon: Flame },
            { id: 'comparison_matrix', label: 'Differences Matrix', icon: Brain }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = eduTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setEduTab(tab.id)}
                className="btn btn-secondary"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  borderColor: isActive ? 'var(--accent-blue)' : undefined,
                  background: isActive ? 'rgba(59, 130, 246, 0.15)' : undefined,
                  color: isActive ? 'var(--accent-blue)' : undefined
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {eduTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>
              1. What is the N-Queens Puzzle?
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              The <strong>N-Queens puzzle</strong> is a classic benchmark in artificial intelligence and computer science, first proposed in 1848 by German chess composer Max Bezzel for the 8×8 board, and later studied extensively by mathematicians including Carl Friedrich Gauss.
            </p>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The challenge requires placing <strong>$N$ chess queens on an $N \times N$ chessboard</strong> such that <strong>no two queens attack each other</strong>.
            </p>
          </div>

          <div className="grid-2">
            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem', color: '#10b981' }}>
                Queen Attack Constraints:
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                In chess, a queen can move any number of squares horizontally, vertically, or diagonally. Therefore, a valid solution must satisfy three rules:
              </p>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: 1.4 }}>
                <li><strong>No two queens in the same row:</strong> $r_i \neq r_j$ for all $i \neq j$.</li>
                <li><strong>No two queens in the same column:</strong> $c_i \neq c_j$ for all $i \neq j$.</li>
                <li><strong>No two queens on the same diagonal:</strong> $|r_i - r_j| \neq |c_i - c_j|$ for all pairs.</li>
              </ul>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem', color: '#3b82f6' }}>
                Why is N-Queens Used in AI Research?
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                N-Queens is a perfect representative of <strong>Constraint Satisfaction Problems (CSPs)</strong>. Real-world problems that share the exact same mathematical properties include:
              </p>
              <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: 1.4 }}>
                <li><strong>VLSI Circuit Layout:</strong> Placing electronic components without wire crossings.</li>
                <li><strong>Job Shop & Flight Scheduling:</strong> Allocating runway gates or assembly stations without conflicts.</li>
                <li><strong>Compiler Register Allocation:</strong> Assigning hardware registers to program variables without interference.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Backtracking */}
      {eduTab === 'backtracking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: '#3b82f6' }}>
              2. Backtracking Algorithm
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              <strong>Backtracking</strong> is a systematic, exhaustive depth-first search (DFS) algorithm that incrementally builds candidate solutions and abandons (backtracks) a candidate as soon as it determines that it cannot possibly lead to a valid full solution.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--accent-blue)' }}>
              How Backtracking Works Step by Step:
            </h4>
            <ol style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', margin: 0, lineHeight: 1.5 }}>
              <li>Start in the leftmost column (Column 0).</li>
              <li>Iterate through rows 0 to $N-1$ in the current column.</li>
              <li>For each row, verify if placing a queen is safe (no conflicts with queens placed in previous columns).</li>
              <li><strong>If safe:</strong> Place the queen and recursively move to the next column (Column $+ 1$).</li>
              <li><strong>If all rows in the current column cause conflicts:</strong> We have reached a dead end! Return <code>false</code> to trigger a <strong>backtrack</strong> to the previous column, remove that queen, and try its next row.</li>
              <li>Repeat until all $N$ queens are placed (Solution Found) or all possibilities are exhausted.</li>
            </ol>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
              Backtracking Pseudocode:
            </h4>
            <pre style={{
              background: 'var(--bg-secondary)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#93c5fd',
              overflowX: 'auto',
              lineHeight: 1.45
            }}>
{`function solveNQueens(col, board, N):
    if col >= N:
        return true   # Base case: All N queens safely placed

    for row from 0 to N - 1:
        if isSafe(board, row, col):
            board[col] = row        # Place queen tentatively
            if solveNQueens(col + 1, board, N):
                return true         # Solution successfully propagated
            board[col] = -1         # BACKTRACK: Unseat queen and test next row

    return false                    # Dead end: signal previous column to advance`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Hill Climbing */}
      {eduTab === 'hill_climbing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: '#10b981' }}>
              3. Hill Climbing Algorithm (with Random Restarts)
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              <strong>Hill Climbing</strong> is an iterative local heuristic search algorithm. Instead of placing queens one by one, it starts with an entire board containing $N$ queens (one per column) and continuously modifies queen positions to minimize an objective cost function.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem', color: '#10b981' }}>
              Core Concepts:
            </h4>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', margin: 0, lineHeight: 1.5 }}>
              <li><strong>Heuristic Evaluation Function $h(state)$:</strong> Defined as the total number of attacking pairs on the board. The goal is to reach $h = 0$.</li>
              <li><strong>Neighborhood Generation:</strong> A neighboring state is created by moving exactly one queen in any column to any other row in that column (generating $N \times (N-1)$ candidate neighbors).</li>
              <li><strong>Steepest Ascent / Descent:</strong> The algorithm evaluates all candidate moves and executes the move that yields the greatest reduction in $h$.</li>
              <li><strong>The Local Optimum Barrier:</strong> If no neighboring state has a lower conflict count than the current state, the algorithm is trapped in a <em>local minimum</em> or flat <em>plateau</em>.</li>
              <li><strong>Random Restarts:</strong> To overcome this, the algorithm resets to a completely new random board state whenever trapped, continuing until $h = 0$.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
              Hill Climbing with Random Restarts Pseudocode:
            </h4>
            <pre style={{
              background: 'var(--bg-secondary)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#6ee7b7',
              overflowX: 'auto',
              lineHeight: 1.45
            }}>
{`function hillClimbingWithRestarts(N, maxRestarts):
    for restart from 0 to maxRestarts:
        board = generateRandomBoard(N)
        while true:
            currentConflicts = countConflicts(board)
            if currentConflicts == 0:
                return board   # Global optimum found!

            bestNeighbor, bestConflicts = findBestMove(board)

            if bestConflicts < currentConflicts:
                board = bestNeighbor   # Greedy downhill descent
            else:
                break                  # Trapped in local minimum: trigger restart

    return null                        # Limit reached`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Simulated Annealing */}
      {eduTab === 'simulated_annealing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f59e0b' }}>
              4. Simulated Annealing Algorithm
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              <strong>Simulated Annealing</strong> is a stochastic metaheuristic inspired by the physical process of annealing in metallurgy, where metal is heated to a high temperature (increasing atomic mobility) and then cooled slowly to form a perfect, low-energy crystalline lattice without flaws.
            </p>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem', color: '#f59e0b' }}>
              The Metropolis Acceptance Criterion:
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              At each step, a random queen is moved to a random row. Let &Delta;E = E_next - E_current be the change in conflicts:
            </p>
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.25rem', marginTop: '0.5rem', lineHeight: 1.5 }}>
              <li><strong>If $\Delta E \le 0$ (Improvement):</strong> The move is <strong>always accepted</strong>.</li>
              <li><strong>If $\Delta E &gt; 0$ (Worse Move):</strong> The move is accepted with a Boltzmann probability:
                <div style={{ margin: '0.35rem 0', fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.95rem' }}>
                  P = exp( - &Delta;E / T )
                </div>
              </li>
              <li><strong>Temperature Cooling Schedule:</strong> The temperature $T$ is multiplied by cooling factor $\alpha$ (e.g. $\alpha = 0.993$) at each iteration. Early on ($T$ high), the algorithm accepts almost any move, enabling wide exploration; later ($T$ low), it strictly accepts improvements.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
              Simulated Annealing Pseudocode:
            </h4>
            <pre style={{
              background: 'var(--bg-secondary)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#fcd34d',
              overflowX: 'auto',
              lineHeight: 1.45
            }}>
{`function simulatedAnnealing(N, T0, alpha, minTemp):
    board = generateRandomBoard(N)
    T = T0

    while countConflicts(board) > 0 and T > minTemp:
        col = randomChoice(0, N - 1)
        newRow = randomChoiceExcept(0, N - 1, board[col])

        deltaE = evaluateConflictDelta(board, col, newRow)

        if deltaE <= 0:
            board[col] = newRow                   # Always accept better/equal move
        else:
            probability = exp(-deltaE / T)
            if random(0, 1) < probability:
                board[col] = newRow               # Probabilistically accept worse move!

        T = T * alpha                             # Geometric cooling step

    return board`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 5: Master Differences Matrix */}
      {eduTab === 'comparison_matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: '#8b5cf6' }}>
              5. Comprehensive Algorithm Comparison Matrix
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Direct side-by-side comparison of algorithmic properties, theoretical complexities, and operational characteristics.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.65rem 0.75rem' }}>Feature / Dimension</th>
                  <th style={{ padding: '0.65rem 0.75rem', color: '#3b82f6' }}>Backtracking</th>
                  <th style={{ padding: '0.65rem 0.75rem', color: '#10b981' }}>Hill Climbing</th>
                  <th style={{ padding: '0.65rem 0.75rem', color: '#f59e0b' }}>Simulated Annealing</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Search Paradigm</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>Exact Depth-First Search (DFS) with Pruning</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>Greedy Local Search (Steepest Ascent)</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>Stochastic Metaheuristic Local Search</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Completeness</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#10b981', fontWeight: 600 }}>Guaranteed (100% complete)</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#f59e0b' }}>Complete with Random Restarts</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#10b981' }}>Asymptotically complete (T schedule)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Time Complexity</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>O(N!) worst case</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>O(R &times; N&sup2;) where R is restarts</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>O(k &times; N) where k is cooling steps</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Space Complexity</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>O(N) recursion stack</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#10b981' }}>O(N) current board only</td>
                  <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)', color: '#10b981' }}>O(N) current board only</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Escape from Local Minima</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>Systematic branch backtracking</td>
                  <td style={{ padding: '0.65rem 0.75rem' }}>Random state restarts</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#f59e0b', fontWeight: 600 }}>Boltzmann probability P = exp(-&Delta;E/T)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Finds All Solutions?</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#10b981', fontWeight: 600 }}>Yes (by continuing traversal)</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#f43f5e' }}>No (finds single local target)</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#f43f5e' }}>No (finds single local target)</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>Scalability to Huge N</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#f43f5e' }}>Poor (times out for N &gt; 25)</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#10b981' }}>Excellent (Min-conflicts solves N=10,000)</td>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#10b981' }}>Excellent (handles large state spaces)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
