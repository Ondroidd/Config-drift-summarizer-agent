
import React from 'react';
import { DriftEntry } from '../types';

interface HistorySidebarProps {
  history: DriftEntry[];
  onSelect: (entry: DriftEntry) => void;
  onClear: () => void;
  currentId: string | null;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear, currentId }) => {
  return (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-200 overflow-y-auto hidden lg:flex flex-col h-[calc(100vh-64px)]">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Analysis History</h2>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-[10px] text-slate-400 hover:text-rose-500 font-bold uppercase transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="flex-1">
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-3 text-slate-300 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <p className="text-xs text-slate-400 italic">No previous analyses</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {[...history].reverse().map((entry) => (
              <button
                key={entry.id}
                onClick={() => onSelect(entry)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors group relative ${currentId === entry.id ? 'bg-indigo-50' : ''}`}
              >
                {currentId === entry.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
                )}
                <div className="text-[11px] font-mono text-slate-400 mb-1">
                  {new Date(entry.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                </div>
                <div className="text-sm font-medium text-slate-700 line-clamp-2 leading-snug">
                  {entry.input.slice(0, 80)}...
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-500 leading-relaxed shadow-sm">
          <strong>Tip:</strong> Paste raw diffs or structured JSON/YAML for the most accurate extraction.
        </div>
      </div>
    </aside>
  );
};

export default HistorySidebar;
