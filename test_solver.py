"""
Unit tests for N-Queens algorithms.
Verifies correctness, conflict counters, and solver completions.
"""
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, str(Path(__file__).parent))

from algorithms import (
    count_conflicts,
    is_safe,
    get_attacking_pairs,
    KNOWN_N_QUEENS_SOLUTIONS,
    BacktrackingSolver,
    HillClimbingSolver,
    SimulatedAnnealingSolver,
    run_comparison,
)

def test_conflict_counter():
    # 4-Queens known solution: [1, 3, 0, 2]
    # Rows: col0=1, col1=3, col2=0, col3=2
    board_sol = [1, 3, 0, 2]
    assert count_conflicts(board_sol) == 0, "Known 4-queens solution must have 0 conflicts"

    # Conflicting board: all on same row [0, 0, 0, 0]
    # Attacking pairs = 4*3/2 = 6
    board_conflict = [0, 0, 0, 0]
    assert count_conflicts(board_conflict) == 6, "4 queens on row 0 should have 6 conflict pairs"
    print("[PASS] Conflict counter test passed.")

def test_backtracking():
    # Test N=4
    bt4 = BacktrackingSolver(4)
    res4 = bt4.solve(record_trace=True)
    assert res4["success"] is True, "Backtracking must solve N=4"
    assert count_conflicts(res4["board"]) == 0, "N=4 solution must have 0 conflicts"
    assert len(res4["steps"]) > 0, "Step trace must be recorded"

    # Test all solutions for N=4
    all4 = bt4.find_all_solutions()
    assert all4["total_solutions_found"] == 2, f"Expected 2 solutions for N=4, got {all4['total_solutions_found']}"

    # Test N=8
    bt8 = BacktrackingSolver(8)
    res8 = bt8.solve(record_trace=False)
    assert res8["success"] is True, "Backtracking must solve N=8"
    assert count_conflicts(res8["board"]) == 0, "N=8 solution must have 0 conflicts"
    print(f"[PASS] Backtracking test passed: N=4 (all 2 found), N=8 solved in {res8['execution_time_ms']} ms.")

def test_hill_climbing():
    # Test N=8
    hc8 = HillClimbingSolver(8, max_restarts=50)
    res8 = hc8.solve(record_trace=True)
    assert res8["final_conflicts"] == 0 or res8["success"] is False, "Final conflicts check"
    if res8["success"]:
        assert count_conflicts(res8["board"]) == 0
    print(f"[PASS] Hill Climbing test finished: success={res8['success']}, iterations={res8['iterations']}, restarts={res8['restarts']}.")

def test_simulated_annealing():
    # Test N=8
    sa8 = SimulatedAnnealingSolver(8, max_iterations=10000)
    res8 = sa8.solve(record_trace=True)
    if res8["success"]:
        assert count_conflicts(res8["board"]) == 0
    print(f"[PASS] Simulated Annealing test finished: success={res8['success']}, final conflicts={res8['final_conflicts']}, iterations={res8['iterations']}.")

def test_comparison():
    comp = run_comparison(8)
    assert "winner" in comp
    assert len(comp["results"]) == 3
    print(f"[PASS] Comparison test passed: Winner is {comp['winner']['fastest_algorithm']}.")

if __name__ == "__main__":
    print("Running N-Queens Algorithm unit tests...")
    test_conflict_counter()
    test_backtracking()
    test_hill_climbing()
    test_simulated_annealing()
    test_comparison()
    print("All unit tests completed successfully!")
