/**
 * Consolidated N-Queens In-Browser Algorithms Engine:
 * - Common conflict calculation & board analysis
 * - Backtracking solver & all-solutions finder
 * - Hill Climbing solver with random restarts
 * - Simulated Annealing solver with Boltzmann acceptance
 * - Multi-algorithm benchmark comparison suite
 */

// =====================================================================
// 1. Common Utilities & Conflict Mathematics
// =====================================================================

export const KNOWN_N_QUEENS_SOLUTIONS = {
  1: { total: 1, fundamental: 1 },
  2: { total: 0, fundamental: 0 },
  3: { total: 0, fundamental: 0 },
  4: { total: 2, fundamental: 1 },
  5: { total: 10, fundamental: 2 },
  6: { total: 4, fundamental: 1 },
  7: { total: 40, fundamental: 6 },
  8: { total: 92, fundamental: 12 },
  9: { total: 352, fundamental: 46 },
  10: { total: 724, fundamental: 92 },
  11: { total: 2680, fundamental: 341 },
  12: { total: 14200, fundamental: 1787 },
  13: { total: 73712, fundamental: 9233 },
  14: { total: 365596, fundamental: 45752 },
};

export function countConflicts(board) {
  const n = board.length;
  let conflicts = 0;
  for (let i = 0; i < n; i++) {
    if (board[i] === -1 || board[i] === undefined) continue;
    for (let j = i + 1; j < n; j++) {
      if (board[j] === -1 || board[j] === undefined) continue;
      if (board[i] === board[j] || Math.abs(board[i] - board[j]) === Math.abs(i - j)) {
        conflicts++;
      }
    }
  }
  return conflicts;
}

export function getAttackingPairs(board) {
  const n = board.length;
  const pairs = [];
  for (let i = 0; i < n; i++) {
    if (board[i] === -1 || board[i] === undefined) continue;
    for (let j = i + 1; j < n; j++) {
      if (board[j] === -1 || board[j] === undefined) continue;
      if (board[i] === board[j] || Math.abs(board[i] - board[j]) === Math.abs(i - j)) {
        pairs.push([
          { row: board[i], col: i },
          { row: board[j], col: j }
        ]);
      }
    }
  }
  return pairs;
}

export function getConflictingColumns(board) {
  const n = board.length;
  const conflicting = new Set();
  for (let i = 0; i < n; i++) {
    if (board[i] === -1 || board[i] === undefined) continue;
    for (let j = i + 1; j < n; j++) {
      if (board[j] === -1 || board[j] === undefined) continue;
      if (board[i] === board[j] || Math.abs(board[i] - board[j]) === Math.abs(i - j)) {
        conflicting.add(i);
        conflicting.add(j);
      }
    }
  }
  return conflicting;
}

export function isSafe(board, row, col) {
  for (let prevCol = 0; prevCol < col; prevCol++) {
    const prevRow = board[prevCol];
    if (prevRow === -1 || prevRow === undefined) continue;
    if (prevRow === row || Math.abs(prevRow - row) === Math.abs(prevCol - col)) {
      return false;
    }
  }
  return true;
}

export function computeAttackHeatmap(board, n) {
  const heatmap = Array.from({ length: n }, () => Array(n).fill(0));
  for (let col = 0; col < n; col++) {
    const row = board[col];
    if (row === -1 || row === undefined) continue;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (r === row && c === col) continue;
        if (r === row || c === col || Math.abs(r - row) === Math.abs(c - col)) {
          heatmap[r][c]++;
        }
      }
    }
  }
  return heatmap;
}

// =====================================================================
// 2. Backtracking Solver & All Solutions
// =====================================================================

export function solveBacktracking(n, options = {}) {
  const recordTrace = options.recordTrace !== false;
  const maxSteps = options.maxSteps || 2500;

  const board = Array(n).fill(-1);
  const steps = [];
  let iterations = 0;
  let backtracks = 0;
  let conflictChecks = 0;

  const startTime = performance.now();

  function backtrack(col) {
    if (col >= n) {
      if (recordTrace && steps.length < maxSteps) {
        steps.push({
          step: steps.length + 1,
          action: 'solution_found',
          col: col - 1,
          row: board[col - 1],
          board: [...board],
          conflicts: 0,
          description: `All ${n} Queens placed successfully without conflicts!`
        });
      }
      return true;
    }

    for (let row = 0; row < n; row++) {
      iterations++;
      conflictChecks++;
      const safe = isSafe(board, row, col);

      if (recordTrace && steps.length < maxSteps) {
        const tempBoard = board.map((r, c) => (c < col ? r : c === col ? row : -1));
        steps.push({
          step: steps.length + 1,
          action: 'try_placement',
          col,
          row,
          isSafe: safe,
          board: tempBoard,
          conflicts: safe ? 0 : 1,
          description: `Row ${row}, Col ${col}: ${safe ? 'Position is safe.' : 'Attack detected by existing Queen.'}`
        });
      }

      if (safe) {
        board[col] = row;
        if (recordTrace && steps.length < maxSteps) {
          steps.push({
            step: steps.length + 1,
            action: 'placed',
            col,
            row,
            board: [...board],
            conflicts: 0,
            description: `Placed Queen at column ${col}, row ${row}. Proceeding to column ${col + 1}.`
          });
        }

        if (backtrack(col + 1)) return true;

        backtracks++;
        board[col] = -1;
        if (recordTrace && steps.length < maxSteps) {
          steps.push({
            step: steps.length + 1,
            action: 'backtrack',
            col,
            row,
            board: [...board],
            conflicts: 0,
            description: `Dead end reached ahead. Backtracking from col ${col}, unseating Queen at row ${row}.`
          });
        }
      }
    }
    return false;
  }

  const success = backtrack(0);
  const executionTimeMs = performance.now() - startTime;
  const finalConflicts = success ? 0 : countConflicts(board);

  return {
    algorithm: 'Backtracking',
    n,
    success,
    board: [...board],
    executionTimeMs: Math.round(executionTimeMs * 100) / 100,
    iterations,
    backtracks,
    conflictChecks,
    restarts: 0,
    finalConflicts,
    steps: recordTrace ? steps : [],
    traceTruncated: steps.length >= maxSteps
  };
}

export function findAllSolutionsBacktracking(n, maxSolutions = 500) {
  const board = Array(n).fill(-1);
  const solutions = [];
  let iterations = 0;
  let backtracks = 0;

  const startTime = performance.now();

  function search(col) {
    if (solutions.length >= maxSolutions) return;
    if (col >= n) {
      solutions.push([...board]);
      return;
    }

    for (let row = 0; row < n; row++) {
      iterations++;
      if (isSafe(board, row, col)) {
        board[col] = row;
        search(col + 1);
        board[col] = -1;
        backtracks++;
      }
    }
  }

  search(0);
  const executionTimeMs = performance.now() - startTime;

  return {
    algorithm: 'Backtracking (All Solutions)',
    n,
    solutions,
    totalFound: solutions.length,
    executionTimeMs: Math.round(executionTimeMs * 100) / 100,
    iterations,
    backtracks
  };
}

// =====================================================================
// 3. Hill Climbing Solver with Random Restarts
// =====================================================================

export function solveHillClimbing(n, options = {}) {
  const recordTrace = options.recordTrace !== false;
  const maxRestarts = options.maxRestarts || 80;
  const maxStepsPerRestart = options.maxStepsPerRestart || 150;
  const maxTraceSteps = options.maxSteps || 2500;

  const steps = [];
  let totalIterations = 0;
  let totalRestarts = 0;
  const startTime = performance.now();

  function randomBoard() {
    return Array.from({ length: n }, () => Math.floor(Math.random() * n));
  }

  function getBestNeighbor(currentBoard, currentConflicts) {
    let bestConflicts = currentConflicts;
    let bestMoves = [];

    for (let col = 0; col < n; col++) {
      const originalRow = currentBoard[col];
      for (let row = 0; row < n; row++) {
        if (row === originalRow) continue;
        currentBoard[col] = row;
        const conflicts = countConflicts(currentBoard);
        if (conflicts < bestConflicts) {
          bestConflicts = conflicts;
          bestMoves = [{ col, row }];
        } else if (conflicts === bestConflicts) {
          bestMoves.push({ col, row });
        }
      }
      currentBoard[col] = originalRow;
    }

    if (bestMoves.length > 0 && bestConflicts < currentConflicts) {
      const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      const nextBoard = [...currentBoard];
      nextBoard[move.col] = move.row;
      return { nextBoard, nextConflicts: bestConflicts, move };
    }

    return { nextBoard: currentBoard, nextConflicts: currentConflicts, move: null };
  }

  let currentBoard = randomBoard();
  let currentConflicts = countConflicts(currentBoard);

  if (recordTrace) {
    steps.push({
      step: 1,
      action: 'initial_state',
      board: [...currentBoard],
      conflicts: currentConflicts,
      restart: 0,
      description: `Generated random initial arrangement with ${currentConflicts} conflicts.`
    });
  }

  let solved = currentConflicts === 0;

  while (!solved && totalRestarts < maxRestarts) {
    let stepsInRestart = 0;

    while (stepsInRestart < maxStepsPerRestart) {
      totalIterations++;
      stepsInRestart++;

      if (currentConflicts === 0) {
        solved = true;
        break;
      }

      const { nextBoard, nextConflicts, move } = getBestNeighbor(currentBoard, currentConflicts);

      if (move && nextConflicts < currentConflicts) {
        currentBoard = nextBoard;
        currentConflicts = nextConflicts;

        if (recordTrace && steps.length < maxTraceSteps) {
          steps.push({
            step: steps.length + 1,
            action: 'move',
            col: move.col,
            row: move.row,
            board: [...currentBoard],
            conflicts: currentConflicts,
            restart: totalRestarts,
            description: `Shifted Queen in column ${move.col} to row ${move.row}. Conflicts reduced to ${currentConflicts}.`
          });
        }

        if (currentConflicts === 0) {
          solved = true;
          break;
        }
      } else {
        if (recordTrace && steps.length < maxTraceSteps) {
          steps.push({
            step: steps.length + 1,
            action: 'local_optimum',
            board: [...currentBoard],
            conflicts: currentConflicts,
            restart: totalRestarts,
            description: `Trapped in local optimum with ${currentConflicts} conflicts. Executing random restart.`
          });
        }
        break;
      }
    }

    if (solved) break;

    totalRestarts++;
    if (totalRestarts < maxRestarts) {
      currentBoard = randomBoard();
      currentConflicts = countConflicts(currentBoard);

      if (recordTrace && steps.length < maxTraceSteps) {
        steps.push({
          step: steps.length + 1,
          action: 'restart',
          board: [...currentBoard],
          conflicts: currentConflicts,
          restart: totalRestarts,
          description: `Random Restart #${totalRestarts}: Fresh state generated with ${currentConflicts} conflicts.`
        });
      }

      if (currentConflicts === 0) {
        solved = true;
        break;
      }
    }
  }

  const executionTimeMs = performance.now() - startTime;

  if (solved && recordTrace && steps.length < maxTraceSteps) {
    steps.push({
      step: steps.length + 1,
      action: 'solution_found',
      board: [...currentBoard],
      conflicts: 0,
      restart: totalRestarts,
      description: `Hill Climbing successfully converged to global optimum (0 conflicts) in ${totalRestarts} restarts!`
    });
  }

  return {
    algorithm: 'Hill Climbing',
    n,
    success: solved,
    board: [...currentBoard],
    finalConflicts: currentConflicts,
    executionTimeMs: Math.round(executionTimeMs * 100) / 100,
    iterations: totalIterations,
    restarts: totalRestarts,
    steps: recordTrace ? steps : [],
    traceTruncated: steps.length >= maxTraceSteps
  };
}

// =====================================================================
// 4. Simulated Annealing Solver
// =====================================================================

export function solveSimulatedAnnealing(n, options = {}) {
  const recordTrace = options.recordTrace !== false;
  const initialTemp = options.initialTemp || 60.0;
  const coolingRate = options.coolingRate || 0.993;
  const minTemp = options.minTemp || 0.001;
  const maxIterations = options.maxIterations || 15000;
  const maxTraceSteps = options.maxSteps || 2500;

  const steps = [];
  const startTime = performance.now();

  function randomBoard() {
    return Array.from({ length: n }, () => Math.floor(Math.random() * n));
  }

  let currentBoard = randomBoard();
  let currentEnergy = countConflicts(currentBoard);
  let bestBoard = [...currentBoard];
  let bestEnergy = currentEnergy;

  let temp = initialTemp;
  let iterations = 0;
  let acceptedMoves = 0;
  let rejectedMoves = 0;

  if (recordTrace) {
    steps.push({
      step: 1,
      action: 'initial_state',
      board: [...currentBoard],
      conflicts: currentEnergy,
      temperature: Math.round(temp * 100) / 100,
      description: `Initial state generated with ${currentEnergy} conflicts at Temperature T = ${Math.round(temp * 10) / 10}.`
    });
  }

  while (currentEnergy > 0 && iterations < maxIterations && temp > minTemp) {
    iterations++;

    const col = Math.floor(Math.random() * n);
    const oldRow = currentBoard[col];
    let newRow = Math.floor(Math.random() * n);
    while (newRow === oldRow) {
      newRow = Math.floor(Math.random() * n);
    }

    currentBoard[col] = newRow;
    const neighborEnergy = countConflicts(currentBoard);
    const deltaE = neighborEnergy - currentEnergy;

    let accepted = false;
    let prob = 1.0;

    if (deltaE <= 0) {
      accepted = true;
      currentEnergy = neighborEnergy;
    } else {
      prob = Math.exp(-deltaE / temp);
      if (Math.random() < prob) {
        accepted = true;
        currentEnergy = neighborEnergy;
      } else {
        currentBoard[col] = oldRow;
      }
    }

    if (accepted) {
      acceptedMoves++;
      if (currentEnergy < bestEnergy) {
        bestEnergy = currentEnergy;
        bestBoard = [...currentBoard];
      }
    } else {
      rejectedMoves++;
    }

    if (recordTrace && steps.length < maxTraceSteps) {
      steps.push({
        step: steps.length + 1,
        action: accepted ? 'accepted' : 'rejected',
        col,
        row: accepted ? newRow : oldRow,
        deltaE,
        probability: Math.round(prob * 1000) / 1000,
        board: [...currentBoard],
        conflicts: currentEnergy,
        temperature: Math.round(temp * 100) / 100,
        description: `Step ${iterations}: Col ${col} -> Row ${newRow} (${accepted ? 'Accepted' : 'Rejected'}). Energy: ${currentEnergy}, T: ${Math.round(temp * 100) / 100}.`
      });
    }

    temp *= coolingRate;
    if (temp <= minTemp && currentEnergy > 0 && iterations < maxIterations * 0.7) {
      temp = initialTemp * 0.4;
    }
  }

  const executionTimeMs = performance.now() - startTime;
  const solved = bestEnergy === 0;

  if (solved && recordTrace && steps.length < maxTraceSteps) {
    steps.push({
      step: steps.length + 1,
      action: 'solution_found',
      board: [...bestBoard],
      conflicts: 0,
      temperature: Math.round(temp * 100) / 100,
      description: `Simulated Annealing found conflict-free solution at iteration ${iterations}!`
    });
  }

  return {
    algorithm: 'Simulated Annealing',
    n,
    success: solved,
    board: bestBoard,
    finalConflicts: bestEnergy,
    executionTimeMs: Math.round(executionTimeMs * 100) / 100,
    iterations,
    restarts: 0,
    acceptedMoves,
    rejectedMoves,
    finalTemperature: Math.round(temp * 1000) / 1000,
    steps: recordTrace ? steps : [],
    traceTruncated: steps.length >= maxTraceSteps
  };
}

// =====================================================================
// 5. Multi-Algorithm Client Benchmark Runner
// =====================================================================

export function runClientBenchmark(n) {
  const bt = solveBacktracking(n, { recordTrace: false });
  const hc = solveHillClimbing(n, { recordTrace: false });
  const sa = solveSimulatedAnnealing(n, { recordTrace: false });

  const results = [bt, hc, sa];
  const successful = results.filter(r => r.success);
  let bestByTime, bestBySteps;

  if (successful.length > 0) {
    bestByTime = [...successful].sort((a, b) => a.executionTimeMs - b.executionTimeMs)[0];
    bestBySteps = [...successful].sort((a, b) => a.iterations - b.iterations)[0];
  } else {
    bestByTime = [...results].sort((a, b) => a.finalConflicts - b.finalConflicts)[0];
    bestBySteps = [...results].sort((a, b) => a.finalConflicts - b.finalConflicts)[0];
  }

  const analysisPoints = [];
  if (bt.success) {
    analysisPoints.push(
      `Backtracking solved ${n}-Queens in ${bt.executionTimeMs} ms (${bt.iterations} recursive explorations, ${bt.backtracks} backtracks). Guaranteed systematic completeness with zero residual conflicts.`
    );
  }
  if (hc.success) {
    analysisPoints.push(
      `Hill Climbing converged in ${hc.executionTimeMs} ms (${hc.iterations} moves, ${hc.restarts} restarts). Conflict minimization rapidly guided it to a global optimum.`
    );
  } else {
    analysisPoints.push(
      `Hill Climbing terminated with ${hc.finalConflicts} conflicts after ${hc.restarts} restarts. Dense local optima plateaus impeded further ascent.`
    );
  }
  if (sa.success) {
    analysisPoints.push(
      `Simulated Annealing reached 0 conflicts in ${sa.executionTimeMs} ms (${sa.iterations} iterations). Boltzmann uphill acceptance prevented entrapment in local minima.`
    );
  } else {
    analysisPoints.push(
      `Simulated Annealing concluded with ${sa.finalConflicts} remaining conflicts. Slower cooling or more iterations needed for size ${n}.`
    );
  }

  return {
    n,
    referenceSolutions: KNOWN_N_QUEENS_SOLUTIONS[n] || null,
    results,
    winner: {
      fastestAlgorithm: bestByTime.algorithm,
      leastIterationsAlgorithm: bestBySteps.algorithm,
      fastestTimeMs: bestByTime.executionTimeMs
    },
    analysis: {
      summary: `Benchmark completed for N=${n}. Fastest: ${bestByTime.algorithm} (${bestByTime.executionTimeMs} ms).`,
      points: analysisPoints
    }
  };
}
