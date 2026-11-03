import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar.jsx';
import Chessboard from './components/Chessboard.jsx';
import VisualizerControls from './components/VisualizerControls.jsx';
import LiveMetricsPanel from './components/LiveMetricsPanel.jsx';
import ComparisonDashboard from './components/ComparisonDashboard.jsx';
import PerformanceAnalysis from './components/PerformanceAnalysis.jsx';
import EducationalHub from './components/EducationalHub.jsx';
import SolutionsExplorer from './components/SolutionsExplorer.jsx';

import { checkBackendHealth, solvePuzzleAPI, runBenchmarkAPI } from './api.js';
import { countConflicts } from './algorithms.js';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('nq_theme') || 'dark');
  
  // Navigation tab
  const [activeTab, setActiveTab] = useState('visualizer');

  // Backend connectivity state
  const [backendOnline, setBackendOnline] = useState(false);
  const [useBackend, setUseBackend] = useState(false);

  // Visualizer configuration & state
  const [algorithm, setAlgorithm] = useState('backtracking');
  const [n, setN] = useState(8);
  const [board, setBoard] = useState(Array(8).fill(-1));
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(60); // ms per step
  const [showRays, setShowRays] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Live telemetry metrics
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'paused' | 'solved' | 'failed'
  const [metrics, setMetrics] = useState({
    conflicts: 0,
    iterations: 0,
    executionTimeMs: 0,
    backtracks: 0,
    restarts: 0,
    temperature: null
  });
  const [currentStepDescription, setCurrentStepDescription] = useState('');

  // Benchmark comparison state
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const playbackTimerRef = useRef(null);

  // Apply theme to HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nq_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check Python Backend health on mount
  useEffect(() => {
    async function initHealth() {
      const res = await checkBackendHealth();
      if (res.online) {
        setBackendOnline(true);
        setUseBackend(true);
      } else {
        setBackendOnline(false);
        setUseBackend(false);
      }
    }
    initHealth();
  }, []);

  // Reset board when N changes
  useEffect(() => {
    handleReset();
  }, [n]);

  // Initial benchmark run so comparison and analysis tabs have real data
  useEffect(() => {
    runBenchmark(n);
  }, []);

  const handleReset = () => {
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setBoard(Array(n).fill(-1));
    setSteps([]);
    setCurrentStepIndex(-1);
    setStatus('idle');
    setMetrics({
      conflicts: 0,
      iterations: 0,
      executionTimeMs: 0,
      backtracks: 0,
      restarts: 0,
      temperature: null
    });
    setCurrentStepDescription('Board reset. Ready to solve.');
  };

  // Execute solver and begin visualization
  const handleStart = async () => {
    handleReset();
    setStatus('running');
    setCurrentStepDescription(`Executing ${algorithm} on ${n}-Queens...`);

    try {
      const res = await solvePuzzleAPI(algorithm, n, { recordTrace: true, maxSteps: 2000 }, useBackend);

      setMetrics({
        conflicts: res.finalConflicts,
        iterations: res.iterations,
        executionTimeMs: res.executionTimeMs,
        backtracks: res.backtracks || 0,
        restarts: res.restarts || 0,
        temperature: res.finalTemperature || null
      });

      if (res.steps && res.steps.length > 0) {
        setSteps(res.steps);
        setCurrentStepIndex(0);
        setIsPlaying(true);
      } else {
        // Fallback to final board directly if steps truncated
        setBoard(res.board);
        if (res.success) {
          triggerSuccess(res.board);
        } else {
          setStatus('failed');
          setCurrentStepDescription('Search concluded without finding a zero-conflict state within limits.');
        }
      }
    } catch (err) {
      console.error('Solve failed:', err);
      setStatus('failed');
      setCurrentStepDescription('An error occurred during algorithm execution.');
    }
  };

  // Step-by-step playback ticker
  useEffect(() => {
    if (isPlaying && !isPaused && steps.length > 0) {
      playbackTimerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          const next = prev + 1;
          if (next >= steps.length) {
            clearInterval(playbackTimerRef.current);
            setIsPlaying(false);

            const lastStep = steps[steps.length - 1];
            setBoard(lastStep.board);
            const conf = countConflicts(lastStep.board);
            setMetrics(m => ({ ...m, conflicts: conf }));

            if (conf === 0 && !lastStep.board.includes(-1) && lastStep.board.length === n) {
              triggerSuccess(lastStep.board);
            } else {
              setStatus('failed');
              setCurrentStepDescription('Search concluded at limit without global convergence.');
            }
            return prev;
          }

          const step = steps[next];
          setBoard(step.board);
          setCurrentStepDescription(step.description);
          setMetrics(m => ({
            ...m,
            conflicts: step.conflicts !== undefined ? step.conflicts : countConflicts(step.board),
            temperature: step.temperature !== undefined ? step.temperature : m.temperature
          }));

          return next;
        });
      }, speed);
    } else {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
    }

    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, [isPlaying, isPaused, steps, speed, n]);

  const handlePause = () => {
    setIsPlaying(false);
    setIsPaused(true);
    setStatus('paused');
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsPlaying(true);
    setStatus('running');
  };

  const handleStepForward = () => {
    if (steps.length === 0) return;
    const nextIdx = Math.min(steps.length - 1, currentStepIndex + 1);
    setCurrentStepIndex(nextIdx);
    const step = steps[nextIdx];
    setBoard(step.board);
    setCurrentStepDescription(step.description);
    setMetrics(m => ({
      ...m,
      conflicts: step.conflicts !== undefined ? step.conflicts : countConflicts(step.board),
      temperature: step.temperature !== undefined ? step.temperature : m.temperature
    }));

    if (nextIdx === steps.length - 1) {
      if (countConflicts(step.board) === 0 && !step.board.includes(-1)) {
        triggerSuccess(step.board);
      }
    }
  };

  const handleStepBackward = () => {
    if (steps.length === 0) return;
    const prevIdx = Math.max(0, currentStepIndex - 1);
    setCurrentStepIndex(prevIdx);
    const step = steps[prevIdx];
    setBoard(step.board);
    setCurrentStepDescription(step.description);
    setMetrics(m => ({
      ...m,
      conflicts: step.conflicts !== undefined ? step.conflicts : countConflicts(step.board),
      temperature: step.temperature !== undefined ? step.temperature : m.temperature
    }));
  };

  const triggerSuccess = (finalBoard) => {
    setStatus('solved');
    setCurrentStepDescription(`🎉 Valid ${n}-Queens Solution Found! Zero attacking pairs.`);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignored if canvas unavailable
    }
  };

  // Run benchmark across all 3 algorithms
  const runBenchmark = async (boardSize) => {
    setIsBenchmarking(true);
    try {
      const data = await runBenchmarkAPI(boardSize, 1, useBackend);
      setBenchmarkData(data);
    } catch (err) {
      console.error('Benchmark failed:', err);
    } finally {
      setIsBenchmarking(false);
    }
  };

  // CSV Report Generator
  const handleExportCSV = () => {
    if (!benchmarkData || !benchmarkData.results) {
      alert('Please run a benchmark first before exporting CSV.');
      return;
    }

    const headers = [
      'Timestamp',
      'Board Size (N)',
      'Algorithm',
      'Status',
      'Execution Time (ms)',
      'Search Iterations',
      'Final Conflicts',
      'Restarts',
      'Engine'
    ];

    const timestamp = new Date().toISOString();
    const rows = benchmarkData.results.map(r => [
      timestamp,
      r.n,
      `"${r.algorithm}"`,
      r.success ? 'Success' : 'Limit Reached',
      r.executionTimeMs,
      r.iterations,
      r.finalConflicts,
      r.restarts || 0,
      `"${benchmarkData.engine || (useBackend ? 'Python Backend' : 'In-Browser JS')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `n_queens_benchmark_N${benchmarkData.n}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      {/* Background ambient lighting orbs */}
      <div className="bg-ambient">
        <div className="ambient-orb-1" />
        <div className="ambient-orb-2" />
      </div>

      {/* Top Navigation & Brand */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        backendOnline={backendOnline}
        useBackend={useBackend}
        setUseBackend={setUseBackend}
        onExportCSV={handleExportCSV}
      />

      {/* Main Content Area Based on Active Tab */}
      <main>
        {/* Tab 1: Visualizer & Stepper */}
        {activeTab === 'visualizer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Visualizer Controls */}
            <VisualizerControls
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              n={n}
              setN={setN}
              isPlaying={isPlaying}
              isPaused={isPaused}
              onStart={handleStart}
              onPause={handlePause}
              onResume={handleResume}
              onReset={handleReset}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              speed={speed}
              setSpeed={setSpeed}
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              showRays={showRays}
              setShowRays={setShowRays}
              showHeatmap={showHeatmap}
              setShowHeatmap={setShowHeatmap}
              canStepForward={currentStepIndex < steps.length - 1}
              canStepBackward={currentStepIndex > 0}
            />

            {/* Chessboard & Live Telemetry Layout */}
            <div className="grid-visualizer">
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '440px' }}>
                <Chessboard
                  board={board}
                  n={n}
                  showRays={showRays}
                  showHeatmap={showHeatmap}
                />
              </div>

              <LiveMetricsPanel
                status={status}
                algorithm={algorithm}
                conflicts={metrics.conflicts}
                iterations={metrics.iterations}
                executionTimeMs={metrics.executionTimeMs}
                backtracks={metrics.backtracks}
                restarts={metrics.restarts}
                temperature={metrics.temperature}
                currentStepDescription={currentStepDescription}
                board={board}
                n={n}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Comparison & Benchmark */}
        {activeTab === 'comparison' && (
          <ComparisonDashboard
            benchmarkData={benchmarkData}
            onRunBenchmark={runBenchmark}
            isRunning={isBenchmarking}
            n={n}
            setN={setN}
            onExportCSV={handleExportCSV}
          />
        )}

        {/* Tab 3: Performance Analysis */}
        {activeTab === 'analysis' && (
          <PerformanceAnalysis
            benchmarkData={benchmarkData}
            n={benchmarkData?.n || n}
          />
        )}

        {/* Tab 4: Educational Hub */}
        {activeTab === 'educational' && (
          <EducationalHub />
        )}

        {/* Tab 5: All Solutions Explorer */}
        {activeTab === 'explorer' && (
          <SolutionsExplorer
            currentN={n}
            useBackend={useBackend}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '3rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          <strong>N-Queens Algorithm Comparison Agent</strong> • Academic AI Mini-Project
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>Backtracking (DFS)</span>
          <span>•</span>
          <span>Hill Climbing (Local Search)</span>
          <span>•</span>
          <span>Simulated Annealing (Stochastic)</span>
        </div>
      </footer>
    </div>
  );
}
