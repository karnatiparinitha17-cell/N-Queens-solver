"""
N-Queens Algorithm Suite:
- Common Utilities & Conflict Metrics
- Backtracking Solver (Systematic DFS with Branch Pruning)
- Hill Climbing Solver (Steepest Descent with Random Restarts)
- Simulated Annealing Solver (Boltzmann Acceptance & Geometric Cooling)
- Multi-Algorithm Benchmark Comparison Engine
"""
import math
import random
import time
from typing import List, Tuple, Set, Dict, Any, Optional

# =====================================================================
# 1. Common Utilities & Conflict Mathematics
# =====================================================================

def count_conflicts(board: List[int]) -> int:
    """
    Counts the number of attacking queen pairs in board.
    board[col] = row. Conflicting if row1 == row2 or |row1 - row2| == |col1 - col2|.
    A valid solution has exactly 0 conflicts.
    """
    n = len(board)
    conflicts = 0
    for i in range(n):
        if board[i] == -1:
            continue
        for j in range(i + 1, n):
            if board[j] == -1:
                continue
            if board[i] == board[j] or abs(board[i] - board[j]) == abs(i - j):
                conflicts += 1
    return conflicts

def get_attacking_pairs(board: List[int]) -> List[Tuple[Tuple[int, int], Tuple[int, int]]]:
    """Returns coordinates ((r1, c1), (r2, c2)) of all attacking pairs."""
    n = len(board)
    pairs = []
    for i in range(n):
        if board[i] == -1:
            continue
        for j in range(i + 1, n):
            if board[j] == -1:
                continue
            r1, c1 = board[i], i
            r2, c2 = board[j], j
            if r1 == r2 or abs(r1 - r2) == abs(c1 - c2):
                pairs.append(((r1, c1), (r2, c2)))
    return pairs

def get_conflicting_queens(board: List[int]) -> Set[int]:
    """Returns column indices that have at least one conflict."""
    n = len(board)
    conflicts = set()
    for i in range(n):
        if board[i] == -1:
            continue
        for j in range(i + 1, n):
            if board[j] == -1:
                continue
            if board[i] == board[j] or abs(board[i] - board[j]) == abs(i - j):
                conflicts.add(i)
                conflicts.add(j)
    return conflicts

def is_safe(board: List[int], row: int, col: int) -> bool:
    """Checks if placing a queen at (row, col) is safe from existing queens in cols 0..col-1."""
    for prev_col in range(col):
        prev_row = board[prev_col]
        if prev_row == -1:
            continue
        if prev_row == row or abs(prev_row - row) == abs(prev_col - col):
            return False
    return True

# Known reference total and fundamental solutions
KNOWN_N_QUEENS_SOLUTIONS: Dict[int, Dict[str, int]] = {
    1: {"total": 1, "fundamental": 1},
    2: {"total": 0, "fundamental": 0},
    3: {"total": 0, "fundamental": 0},
    4: {"total": 2, "fundamental": 1},
    5: {"total": 10, "fundamental": 2},
    6: {"total": 4, "fundamental": 1},
    7: {"total": 40, "fundamental": 6},
    8: {"total": 92, "fundamental": 12},
    9: {"total": 352, "fundamental": 46},
    10: {"total": 724, "fundamental": 92},
    11: {"total": 2680, "fundamental": 341},
    12: {"total": 14200, "fundamental": 1787},
    13: {"total": 73712, "fundamental": 9233},
    14: {"total": 365596, "fundamental": 45752},
}

# =====================================================================
# 2. Backtracking Solver
# =====================================================================

class BacktrackingSolver:
    def __init__(self, n: int, max_steps: int = 2500):
        self.n = n
        self.max_steps = max_steps
        self.board: List[int] = [-1] * n
        self.steps: List[Dict[str, Any]] = []
        self.iterations = 0
        self.backtracks = 0
        self.conflict_checks = 0
        self.solutions: List[List[int]] = []

    def solve(self, record_trace: bool = True) -> Dict[str, Any]:
        self.board = [-1] * self.n
        self.steps = []
        self.iterations = 0
        self.backtracks = 0
        self.conflict_checks = 0
        self.solutions = []

        start_time = time.perf_counter()
        success = self._backtrack(col=0, record_trace=record_trace)
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        final_conflicts = count_conflicts(self.board) if success else self.n

        return {
            "algorithm": "Backtracking",
            "n": self.n,
            "success": success,
            "board": list(self.board),
            "execution_time_ms": round(elapsed_ms, 3),
            "iterations": self.iterations,
            "backtracks": self.backtracks,
            "conflict_checks": self.conflict_checks,
            "final_conflicts": final_conflicts,
            "restarts": 0,
            "steps": self.steps if record_trace else [],
            "trace_truncated": len(self.steps) >= self.max_steps,
        }

    def _backtrack(self, col: int, record_trace: bool) -> bool:
        if col >= self.n:
            if record_trace and len(self.steps) < self.max_steps:
                self.steps.append({
                    "step": len(self.steps) + 1,
                    "action": "solution_found",
                    "col": col - 1,
                    "row": self.board[col - 1],
                    "board": list(self.board),
                    "description": f"Valid configuration found for {self.n}-Queens!"
                })
            return True

        for row in range(self.n):
            self.iterations += 1
            self.conflict_checks += 1
            safe = is_safe(self.board, row, col)

            if record_trace and len(self.steps) < self.max_steps:
                self.steps.append({
                    "step": len(self.steps) + 1,
                    "action": "try_placement",
                    "col": col,
                    "row": row,
                    "is_safe": safe,
                    "board": [self.board[c] if c < col else (row if c == col else -1) for c in range(self.n)],
                    "description": f"Checking Queen at ({row}, {col}): {'Safe' if safe else 'Conflict detected'}"
                })

            if safe:
                self.board[col] = row
                if record_trace and len(self.steps) < self.max_steps:
                    self.steps.append({
                        "step": len(self.steps) + 1,
                        "action": "placed",
                        "col": col,
                        "row": row,
                        "board": list(self.board),
                        "description": f"Placed Queen safely at row {row}, col {col}."
                    })

                if self._backtrack(col + 1, record_trace):
                    return True

                self.backtracks += 1
                self.board[col] = -1
                if record_trace and len(self.steps) < self.max_steps:
                    self.steps.append({
                        "step": len(self.steps) + 1,
                        "action": "backtrack",
                        "col": col,
                        "row": row,
                        "board": list(self.board),
                        "description": f"Backtracking from col {col}: removing Queen from row {row}."
                    })

        return False

    def find_all_solutions(self, max_solutions: int = 1000) -> Dict[str, Any]:
        self.board = [-1] * self.n
        self.iterations = 0
        self.backtracks = 0
        self.solutions = []

        start_time = time.perf_counter()
        self._find_all_recursive(col=0, max_solutions=max_solutions)
        elapsed_ms = (time.perf_counter() - start_time) * 1000

        return {
            "algorithm": "Backtracking (All Solutions)",
            "n": self.n,
            "total_solutions_found": len(self.solutions),
            "solutions": self.solutions[:max_solutions],
            "execution_time_ms": round(elapsed_ms, 3),
            "iterations": self.iterations,
            "backtracks": self.backtracks,
        }

    def _find_all_recursive(self, col: int, max_solutions: int):
        if len(self.solutions) >= max_solutions:
            return
        if col >= self.n:
            self.solutions.append(list(self.board))
            return

        for row in range(self.n):
            self.iterations += 1
            if is_safe(self.board, row, col):
                self.board[col] = row
                self._find_all_recursive(col + 1, max_solutions)
                self.board[col] = -1
                self.backtracks += 1

# =====================================================================
# 3. Hill Climbing Solver
# =====================================================================

class HillClimbingSolver:
    def __init__(self, n: int, max_restarts: int = 100, max_steps_per_restart: int = 200, max_trace_steps: int = 2500):
        self.n = n
        self.max_restarts = max_restarts
        self.max_steps_per_restart = max_steps_per_restart
        self.max_trace_steps = max_trace_steps
        self.steps: List[Dict[str, Any]] = []

    def _random_board(self) -> List[int]:
        return [random.randint(0, self.n - 1) for _ in range(self.n)]

    def _get_best_neighbor(self, current_board: List[int], current_conflicts: int) -> Tuple[List[int], int, int, int]:
        best_board = list(current_board)
        best_conflicts = current_conflicts
        best_moves = []

        for col in range(self.n):
            original_row = current_board[col]
            for row in range(self.n):
                if row == original_row:
                    continue
                current_board[col] = row
                conflicts = count_conflicts(current_board)
                if conflicts < best_conflicts:
                    best_conflicts = conflicts
                    best_moves = [(col, row)]
                elif conflicts == best_conflicts:
                    best_moves.append((col, row))
            current_board[col] = original_row

        if best_moves and best_conflicts < current_conflicts:
            col, row = random.choice(best_moves)
            best_board[col] = row
            return best_board, best_conflicts, col, row

        return current_board, current_conflicts, -1, -1

    def solve(self, record_trace: bool = True) -> Dict[str, Any]:
        self.steps = []
        total_iterations = 0
        total_restarts = 0
        start_time = time.perf_counter()

        current_board = self._random_board()
        current_conflicts = count_conflicts(current_board)

        if record_trace:
            self.steps.append({
                "step": 1,
                "action": "initial_state",
                "board": list(current_board),
                "conflicts": current_conflicts,
                "restart": 0,
                "description": f"Initial random board generated with {current_conflicts} conflicts."
            })

        solved = (current_conflicts == 0)

        while not solved and total_restarts < self.max_restarts:
            steps_in_restart = 0

            while steps_in_restart < self.max_steps_per_restart:
                total_iterations += 1
                steps_in_restart += 1

                if current_conflicts == 0:
                    solved = True
                    break

                next_board, next_conflicts, col, row = self._get_best_neighbor(current_board, current_conflicts)

                if next_conflicts < current_conflicts:
                    current_board = next_board
                    current_conflicts = next_conflicts
                    if record_trace and len(self.steps) < self.max_trace_steps:
                        self.steps.append({
                            "step": len(self.steps) + 1,
                            "action": "move",
                            "col": col,
                            "row": row,
                            "board": list(current_board),
                            "conflicts": current_conflicts,
                            "restart": total_restarts,
                            "description": f"Moved queen at col {col} to row {row}. Conflicts reduced to {current_conflicts}."
                        })
                    if current_conflicts == 0:
                        solved = True
                        break
                else:
                    if record_trace and len(self.steps) < self.max_trace_steps:
                        self.steps.append({
                            "step": len(self.steps) + 1,
                            "action": "local_optimum",
                            "board": list(current_board),
                            "conflicts": current_conflicts,
                            "restart": total_restarts,
                            "description": f"Reached local optimum/plateau with {current_conflicts} conflicts. Triggering random restart."
                        })
                    break

            if solved:
                break

            total_restarts += 1
            if total_restarts < self.max_restarts:
                current_board = self._random_board()
                current_conflicts = count_conflicts(current_board)
                if record_trace and len(self.steps) < self.max_trace_steps:
                    self.steps.append({
                        "step": len(self.steps) + 1,
                        "action": "restart",
                        "board": list(current_board),
                        "conflicts": current_conflicts,
                        "restart": total_restarts,
                        "description": f"Restart #{total_restarts}: Generated new random board with {current_conflicts} conflicts."
                    })
                if current_conflicts == 0:
                    solved = True
                    break

        elapsed_ms = (time.perf_counter() - start_time) * 1000

        if solved and record_trace and len(self.steps) < self.max_trace_steps:
            self.steps.append({
                "step": len(self.steps) + 1,
                "action": "solution_found",
                "board": list(current_board),
                "conflicts": 0,
                "restart": total_restarts,
                "description": f"Global optimal solution found (0 conflicts) in {total_restarts} restarts!"
            })

        return {
            "algorithm": "Hill Climbing",
            "n": self.n,
            "success": solved,
            "board": list(current_board),
            "final_conflicts": current_conflicts,
            "execution_time_ms": round(elapsed_ms, 3),
            "iterations": total_iterations,
            "restarts": total_restarts,
            "steps": self.steps if record_trace else [],
            "trace_truncated": len(self.steps) >= self.max_trace_steps,
        }

# =====================================================================
# 4. Simulated Annealing Solver
# =====================================================================

class SimulatedAnnealingSolver:
    def __init__(
        self,
        n: int,
        initial_temp: float = 60.0,
        cooling_rate: float = 0.992,
        min_temp: float = 0.001,
        max_iterations: int = 15000,
        max_trace_steps: int = 2500
    ):
        self.n = n
        self.initial_temp = initial_temp
        self.cooling_rate = cooling_rate
        self.min_temp = min_temp
        self.max_iterations = max_iterations
        self.max_trace_steps = max_trace_steps
        self.steps: List[Dict[str, Any]] = []

    def _random_board(self) -> List[int]:
        return [random.randint(0, self.n - 1) for _ in range(self.n)]

    def solve(self, record_trace: bool = True) -> Dict[str, Any]:
        self.steps = []
        current_board = self._random_board()
        current_energy = count_conflicts(current_board)
        best_board = list(current_board)
        best_energy = current_energy

        temp = self.initial_temp
        iterations = 0
        accepted_moves = 0
        rejected_moves = 0
        start_time = time.perf_counter()

        if record_trace:
            self.steps.append({
                "step": 1,
                "action": "initial_state",
                "board": list(current_board),
                "conflicts": current_energy,
                "temperature": round(temp, 3),
                "description": f"Initial random board generated with {current_energy} conflicts at T={round(temp, 2)}."
            })

        while current_energy > 0 and iterations < self.max_iterations and temp > self.min_temp:
            iterations += 1

            col = random.randint(0, self.n - 1)
            old_row = current_board[col]
            new_row = random.randint(0, self.n - 1)
            while new_row == old_row:
                new_row = random.randint(0, self.n - 1)

            current_board[col] = new_row
            neighbor_energy = count_conflicts(current_board)
            delta_e = neighbor_energy - current_energy

            accepted = False
            prob = 1.0

            if delta_e <= 0:
                accepted = True
                current_energy = neighbor_energy
            else:
                prob = math.exp(-delta_e / temp) if temp > 0 else 0.0
                if random.random() < prob:
                    accepted = True
                    current_energy = neighbor_energy
                else:
                    current_board[col] = old_row

            if accepted:
                accepted_moves += 1
                if current_energy < best_energy:
                    best_energy = current_energy
                    best_board = list(current_board)
            else:
                rejected_moves += 1

            if record_trace and len(self.steps) < self.max_trace_steps:
                self.steps.append({
                    "step": len(self.steps) + 1,
                    "action": "accepted" if accepted else "rejected",
                    "col": col,
                    "row": new_row if accepted else old_row,
                    "delta_e": delta_e,
                    "probability": round(prob, 4),
                    "board": list(current_board),
                    "conflicts": current_energy,
                    "temperature": round(temp, 3),
                    "description": (
                        f"Step {iterations}: Moved queen at col {col} to row {new_row} "
                        f"({'Accepted' if accepted else 'Rejected'}). Conflicts: {current_energy}, T: {round(temp, 2)}."
                    )
                })

            temp *= self.cooling_rate
            if temp <= self.min_temp and current_energy > 0 and iterations < self.max_iterations * 0.7:
                temp = self.initial_temp * 0.4

        elapsed_ms = (time.perf_counter() - start_time) * 1000
        solved = (best_energy == 0)

        if solved and record_trace and len(self.steps) < self.max_trace_steps:
            self.steps.append({
                "step": len(self.steps) + 1,
                "action": "solution_found",
                "board": list(best_board),
                "conflicts": 0,
                "temperature": round(temp, 3),
                "description": f"Conflict-free solution found at iteration {iterations}!"
            })

        return {
            "algorithm": "Simulated Annealing",
            "n": self.n,
            "success": solved,
            "board": best_board,
            "final_conflicts": best_energy,
            "execution_time_ms": round(elapsed_ms, 3),
            "iterations": iterations,
            "restarts": 0,
            "accepted_moves": accepted_moves,
            "rejected_moves": rejected_moves,
            "final_temperature": round(temp, 4),
            "steps": self.steps if record_trace else [],
            "trace_truncated": len(self.steps) >= self.max_trace_steps,
        }

# =====================================================================
# 5. Multi-Algorithm Benchmark Comparison Engine
# =====================================================================

def run_comparison(n: int, runs: int = 1) -> Dict[str, Any]:
    bt_solver = BacktrackingSolver(n, max_steps=1000)
    hc_solver = HillClimbingSolver(n, max_restarts=100, max_steps_per_restart=200, max_trace_steps=1000)
    sa_solver = SimulatedAnnealingSolver(n, initial_temp=60.0, cooling_rate=0.992, max_iterations=15000, max_trace_steps=1000)

    bt_result = bt_solver.solve(record_trace=False)
    hc_result = hc_solver.solve(record_trace=False)
    sa_result = sa_solver.solve(record_trace=False)

    results = [bt_result, hc_result, sa_result]

    successful = [r for r in results if r["success"]]
    if successful:
        best_by_time = min(successful, key=lambda x: x["execution_time_ms"])
        best_by_steps = min(successful, key=lambda x: x["iterations"])
    else:
        best_by_time = min(results, key=lambda x: x["final_conflicts"])
        best_by_steps = min(results, key=lambda x: x["final_conflicts"])

    known_ref = KNOWN_N_QUEENS_SOLUTIONS.get(n, None)

    analysis_points = []
    if bt_result["success"]:
        analysis_points.append(
            f"Backtracking completed in {bt_result['execution_time_ms']} ms ({bt_result['iterations']} iterations, {bt_result['backtracks']} backtracks). "
            f"As a systematic depth-first search with constraint propagation, it guarantees completeness."
        )
    if hc_result["success"]:
        analysis_points.append(
            f"Hill Climbing found a solution in {hc_result['execution_time_ms']} ms ({hc_result['iterations']} steps, {hc_result['restarts']} restarts). "
            f"Random restarts successfully resolved {'any' if hc_result['restarts'] > 0 else 'no'} local minima or plateau traps encountered."
        )
    else:
        analysis_points.append(
            f"Hill Climbing reached restart threshold ({hc_solver.max_restarts}) with {hc_result['final_conflicts']} remaining conflicts. "
            f"Local optima and shoulder plateaus prevented convergence within the allotted search budget."
        )

    if sa_result["success"]:
        analysis_points.append(
            f"Simulated Annealing converged in {sa_result['execution_time_ms']} ms ({sa_result['iterations']} iterations). "
            f"Its Boltzmann acceptance mechanism permitted uphill exploratory transitions before freezing into a zero-conflict configuration."
        )
    else:
        analysis_points.append(
            f"Simulated Annealing finished with {sa_result['final_conflicts']} conflicts. Cooling may require a slower schedule for N={n}."
        )

    return {
        "n": n,
        "reference_solutions": known_ref,
        "results": results,
        "winner": {
            "fastest_algorithm": best_by_time["algorithm"],
            "least_iterations_algorithm": best_by_steps["algorithm"],
            "fastest_time_ms": best_by_time["execution_time_ms"],
        },
        "analysis": {
            "summary": f"Benchmark completed for N={n}. Winner by speed: {best_by_time['algorithm']} ({best_by_time['execution_time_ms']} ms).",
            "points": analysis_points
        }
    }
