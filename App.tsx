
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import HistorySidebar from './components/HistorySidebar';
import SummaryDisplay from './components/SummaryDisplay';
import { summarizeDrift } from './services/geminiService';
import { DriftEntry } from './types';

const STORAGE_KEY = 'config_drift_history';

const EXAMPLES = [
  {
    title: "Simple Server Drift",
    data: "ServerA:\n  baseline: MaxConnections=200\n  current: MaxConnections=500\nServerB:\n  baseline: SSHLogging=verbose\n  current: SSHLogging=off"
  },
  {
    title: "Kubernetes Resource Drift",
    data: "Deployment: payment-api\n  spec.replicas: baseline=3, actual=12\n  spec.containers[0].image: baseline=payment-v1.2, actual=payment-v1.3-beta\nNamespace: production-east\n  Status: Modified 12m ago by user:jenkins-admin"
  },
  {
    title: "Security Group Audit",
    data: "AWS-SG: app-server-sg\n  Ingress:\n    - baseline: allow 443 10.0.0.0/8\n    - current: allow 443 0.0.0.0/0 (ANY)\n    - current: allow 22 1.2.3.4/32"
  }
];

function App() {
  const [input, setInput] = useState('');
  const [currentSummary, setCurrentSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<DriftEntry[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleSummarize = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setCurrentId(null);

    try {
      const summary = await summarizeDrift(input);
      setCurrentSummary(summary);
      
      const newEntry: DriftEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        input: input,
        summary: summary,
      };
      
      setHistory(prev => [...prev, newEntry]);
      setCurrentId(newEntry.id);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const selectHistory = (entry: DriftEntry) => {
    setInput(entry.input);
    setCurrentSummary(entry.summary);
    setCurrentId(entry.id);
    setError(null);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <HistorySidebar 
          history={history} 
          onSelect={selectHistory} 
          onClear={clearHistory}
          currentId={currentId}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Input Drift Data</span>
                </div>
                <div className="flex space-x-2">
                  {EXAMPLES.map((ex, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(ex.data)}
                      className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded hover:border-indigo-300 hover:text-indigo-600 transition-colors text-slate-500"
                    >
                      {ex.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <textarea
                  className="w-full h-48 md:h-64 p-4 text-sm mono bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none outline-none placeholder-slate-400"
                  placeholder="Paste JSON, YAML, or raw diff output here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-xs text-slate-500 max-w-md">
                  Our agent will identify changes, security risks, and patterns to help you remediate faster.
                </p>
                <button
                  onClick={handleSummarize}
                  disabled={isLoading || !input.trim()}
                  className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
                    isLoading || !input.trim()
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M8 15h8"/></svg>
                      <span>Analyze Drift</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="h-full">
              <SummaryDisplay markdown={currentSummary} isLoading={isLoading} />
            </div>

          </div>
        </main>
      </div>

      <footer className="bg-white border-t border-slate-100 py-6 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-400 text-[10px] uppercase tracking-widest font-bold">
          <div className="mb-4 md:mb-0">
            © 2024 InfraSystems Config Drift Analysis Agent
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-slate-600 transition-colors">Documentation</span>
            <span className="hover:text-slate-600 transition-colors">Security Baselines</span>
            <span className="hover:text-slate-600 transition-colors">API Access</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
