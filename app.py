"""
FastAPI Server for N-Queens Algorithm Comparison Agent.
Provides REST APIs for solving puzzles, running benchmarks, and fetching all solutions.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from algorithms import (
    BacktrackingSolver,
    HillClimbingSolver,
    SimulatedAnnealingSolver,
    run_comparison,
    count_conflicts,
    get_attacking_pairs,
    KNOWN_N_QUEENS_SOLUTIONS,
)

app = FastAPI(
    title="N-Queens Algorithm Comparison Agent API",
    description="Backend AI Solver comparing Backtracking, Hill Climbing, and Simulated Annealing",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SolveRequest(BaseModel):
    algorithm: str = Field(..., description="'backtracking', 'hill_climbing', or 'simulated_annealing'")
    n: int = Field(8, ge=4, le=24, description="Board size N (4 <= N <= 24)")
    record_trace: bool = Field(True, description="Whether to capture step-by-step trace")
    max_steps: Optional[int] = Field(2500, description="Max steps to record for animation safety")

class BenchmarkRequest(BaseModel):
    n: int = Field(8, ge=4, le=20, description="Board size N for benchmark comparison")
    runs: Optional[int] = Field(1, ge=1, le=5)

class AllSolutionsRequest(BaseModel):
    n: int = Field(8, ge=4, le=12, description="Board size N (capped at 12 for real-time response)")
    max_solutions: Optional[int] = Field(200, ge=1, le=1000)

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "agent": "N-Queens Algorithm Comparison Agent",
        "algorithms": ["Backtracking", "Hill Climbing", "Simulated Annealing"],
        "version": "1.0.0"
    }

@app.post("/api/solve")
def solve_puzzle(req: SolveRequest):
    algo = req.algorithm.lower().replace(" ", "_").replace("-", "_")
    n = req.n

    if n < 4:
        raise HTTPException(status_code=400, detail="N must be at least 4 (no valid solutions exist for N=2,3).")

    if algo in ["backtracking", "bt"]:
        solver = BacktrackingSolver(n=n, max_steps=req.max_steps or 2500)
        res = solver.solve(record_trace=req.record_trace)
    elif algo in ["hill_climbing", "hc", "hillclimbing"]:
        solver = HillClimbingSolver(n=n, max_trace_steps=req.max_steps or 2500)
        res = solver.solve(record_trace=req.record_trace)
    elif algo in ["simulated_annealing", "sa", "simulatedannealing"]:
        solver = SimulatedAnnealingSolver(n=n, max_trace_steps=req.max_steps or 2500)
        res = solver.solve(record_trace=req.record_trace)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown algorithm: {req.algorithm}")

    # Attach attacking pairs for visual debugging/rays
    if "board" in res and res["board"] and -1 not in res["board"]:
        res["attacking_pairs"] = [
            [{"row": p[0][0], "col": p[0][1]}, {"row": p[1][0], "col": p[1][1]}]
            for p in get_attacking_pairs(res["board"])
        ]
    else:
        res["attacking_pairs"] = []

    return res

@app.post("/api/benchmark")
def benchmark_algorithms(req: BenchmarkRequest):
    if req.n < 4:
        raise HTTPException(status_code=400, detail="N must be at least 4.")
    return run_comparison(n=req.n, runs=req.runs or 1)

@app.post("/api/all-solutions")
def all_solutions(req: AllSolutionsRequest):
    if req.n > 12:
        raise HTTPException(status_code=400, detail="Board size > 12 exceeds fast interactive enumeration budget.")
    solver = BacktrackingSolver(n=req.n)
    return solver.find_all_solutions(max_solutions=req.max_solutions or 200)

@app.get("/api/reference/{n}")
def get_reference_data(n: int):
    ref = KNOWN_N_QUEENS_SOLUTIONS.get(n, None)
    if not ref:
        return {"n": n, "known": False, "message": f"Theoretical total not pre-indexed for N={n}"}
    return {"n": n, "known": True, "total_solutions": ref["total"], "fundamental_solutions": ref["fundamental"]}

from pathlib import Path
from fastapi.staticfiles import StaticFiles

# If frontend is built, serve production assets
dist_path = Path(__file__).parent.parent / "frontend" / "dist"
if dist_path.exists():
    app.mount("/", StaticFiles(directory=str(dist_path), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
