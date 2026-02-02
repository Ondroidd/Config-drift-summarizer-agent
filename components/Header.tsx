
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><rect width="20" height="12" x="2" y="10" rx="2"/><path d="M7 14h.01"/><path d="M17 14h.01"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Config Drift Summarizer</h1>
            <p className="text-xs text-slate-500 font-medium">Infrastructure Compliance Agent</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            Powered by Gemini 3 Flash
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
