/**
 * API Service for communicating with Python FastAPI backend
 * with automatic, seamless fallback to the local JavaScript engine.
 */
import {
  solveBacktracking,
  findAllSolutionsBacktracking,
  solveHillClimbing,
  solveSimulatedAnnealing,
  runClientBenchmark,
  getAttackingPairs,
} from './algorithms.js';

const BACKEND_URL = 'http://localhost:8000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) {
      const data = await res.json();
      return { online: true, data };
    }
  } catch (err) {
    // Backend offline or unreachable
  }
  return { online: false, data: null };
}

export async function solvePuzzleAPI(algorithm, n, options = {}, useBackend = false) {
  if (useBackend) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm,
          n,
          record_trace: options.recordTrace !== false,
          max_steps: options.maxSteps || 2500
        }),
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        const data = await res.json();
        // Normalize keys
        return {
          algorithm: data.algorithm,
          n: data.n,
          success: data.success,
          board: data.board,
          executionTimeMs: data.execution_time_ms,
          iterations: data.iterations,
          backtracks: data.backtracks || 0,
          conflictChecks: data.conflict_checks || 0,
          restarts: data.restarts || 0,
          finalConflicts: data.final_conflicts,
          steps: data.steps || [],
          traceTruncated: data.trace_truncated,
          attackingPairs: data.attacking_pairs || [],
          engine: 'Python Backend (FastAPI)'
        };
      }
    } catch (e) {
      console.warn('Backend call failed, falling back to local JS engine:', e);
    }
  }

  // Local JavaScript Engine
  let result;
  if (algorithm === 'backtracking') {
    result = solveBacktracking(n, options);
  } else if (algorithm === 'hill_climbing') {
    result = solveHillClimbing(n, options);
  } else {
    result = solveSimulatedAnnealing(n, options);
  }

  const pairs = getAttackingPairs(result.board);
  return {
    ...result,
    attackingPairs: pairs.map(p => [{ row: p[0].row, col: p[0].col }, { row: p[1].row, col: p[1].col }]),
    engine: 'In-Browser JS Engine'
  };
}

export async function runBenchmarkAPI(n, runs = 1, useBackend = false) {
  if (useBackend) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/benchmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n, runs }),
        signal: AbortSignal.timeout(15000)
      });
      if (res.ok) {
        const data = await res.json();
        return {
          n: data.n,
          referenceSolutions: data.reference_solutions,
          results: data.results.map(r => ({
            algorithm: r.algorithm,
            n: r.n,
            success: r.success,
            board: r.board,
            executionTimeMs: r.execution_time_ms,
            iterations: r.iterations,
            backtracks: r.backtracks || 0,
            restarts: r.restarts || 0,
            finalConflicts: r.final_conflicts
          })),
          winner: {
            fastestAlgorithm: data.winner.fastest_algorithm,
            leastIterationsAlgorithm: data.winner.least_iterations_algorithm,
            fastestTimeMs: data.winner.fastest_time_ms
          },
          analysis: data.analysis,
          engine: 'Python Backend (FastAPI)'
        };
      }
    } catch (e) {
      console.warn('Backend benchmark failed, falling back to local JS engine:', e);
    }
  }

  const res = runClientBenchmark(n);
  return { ...res, engine: 'In-Browser JS Engine' };
}

export async function fetchAllSolutionsAPI(n, maxSolutions = 200, useBackend = false) {
  if (useBackend && n <= 12) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/all-solutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n, max_solutions: maxSolutions }),
        signal: AbortSignal.timeout(15000)
      });
      if (res.ok) {
        const data = await res.json();
        return {
          algorithm: data.algorithm,
          n: data.n,
          solutions: data.solutions,
          totalFound: data.total_solutions_found,
          executionTimeMs: data.execution_time_ms,
          iterations: data.iterations,
          backtracks: data.backtracks,
          engine: 'Python Backend'
        };
      }
    } catch (e) {
      console.warn('Backend all-solutions failed, falling back to local JS:', e);
    }
  }

  const res = findAllSolutionsBacktracking(n, maxSolutions);
  return { ...res, engine: 'In-Browser JS Engine' };
}
