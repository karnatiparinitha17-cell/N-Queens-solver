import React from 'react';
import { 
  Crown, 
  Sun, 
  Moon, 
  BarChart3, 
  Play, 
  GraduationCap, 
  Layers, 
  Download, 
  Cpu, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  backendOnline,
  useBackend,
  setUseBackend,
  onExportCSV
}) {
  return (
    <header className="glass-card" style={{ padding: '0.85rem 1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand / Agent Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
          }}>
            <Crown size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
                N-Queens AI Agent
              </h1>
              <span className="metric-badge metric-badge-info" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                v1.0 Professional
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Backtracking • Hill Climbing • Simulated Annealing
            </p>
          </div>
        </div>

        {/* Engine Switch & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Dual Engine Selector Pill */}
          <button
            onClick={() => {
              if (backendOnline) {
                setUseBackend(!useBackend);
              }
            }}
            title={backendOnline ? "Click to toggle between Python FastAPI and Browser Engine" : "Python backend offline (using In-Browser JS Engine)"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: backendOnline ? 'pointer' : 'default',
              transition: 'all 0.2s ease'
            }}
          >
            <Cpu size={14} color={backendOnline ? (useBackend ? '#10b981' : '#3b82f6') : '#f59e0b'} />
            <span>
              Engine: {backendOnline ? (useBackend ? 'Python FastAPI' : 'Browser JS') : 'Browser Engine'}
            </span>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: backendOnline ? (useBackend ? '#10b981' : '#3b82f6') : '#f59e0b',
              boxShadow: `0 0 6px ${backendOnline ? (useBackend ? '#10b981' : '#3b82f6') : '#f59e0b'}`
            }} />
          </button>

          {/* Quick CSV Export */}
          {onExportCSV && (
            <button
              onClick={onExportCSV}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              title="Download Comparison CSV Report"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '0.45rem', borderRadius: '50%', width: '36px', height: '36px' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#3b82f6" />}
          </button>
        </div>

      </div>

      {/* Navigation Tabs */}
      <nav className="tabs-nav" style={{ marginTop: '1rem', marginBottom: 0 }}>
        <button
          className={`tab-btn ${activeTab === 'visualizer' ? 'active' : ''}`}
          onClick={() => setActiveTab('visualizer')}
        >
          <Play size={16} />
          <span>Visualizer & Stepper</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          <BarChart3 size={16} />
          <span>Algorithm Comparison</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          <Layers size={16} />
          <span>Performance Analysis</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'educational' ? 'active' : ''}`}
          onClick={() => setActiveTab('educational')}
        >
          <GraduationCap size={16} />
          <span>Educational Hub</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          <Crown size={16} />
          <span>All Solutions Explorer</span>
        </button>
      </nav>
    </header>
  );
}
