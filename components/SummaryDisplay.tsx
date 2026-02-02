
import React from 'react';

interface SummaryDisplayProps {
  markdown: string;
  isLoading: boolean;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ markdown, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm h-full flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse-subtle">
           <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Analyzing Configuration Drift</h3>
        <p className="text-slate-500 max-w-sm">Comparing current state against baseline and assessing risk vectors...</p>
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-30"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
        <p className="text-sm font-medium">Paste drift data in the input box to generate an analysis report.</p>
      </div>
    );
  }

  const isHighPriority = markdown.includes("HIGH PRIORITY DRIFT DETECTED");

  return (
    <div className={`bg-white rounded-xl border ${isHighPriority ? 'border-rose-200' : 'border-slate-200'} shadow-sm overflow-hidden h-full flex flex-col`}>
      {isHighPriority && (
        <div className="bg-rose-50 border-b border-rose-100 p-4 flex items-center space-x-3 text-rose-800">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          <span className="text-sm font-bold tracking-wide uppercase">Critical Drift Alert</span>
        </div>
      )}
      
      <div className="p-6 md:p-8 overflow-y-auto prose prose-slate max-w-none">
        {markdown.split('\n').map((line, idx) => {
          if (line.startsWith('## ')) {
            return <h2 key={idx} className="text-xl font-bold text-slate-900 mt-6 mb-3 first:mt-0 border-b border-slate-100 pb-2">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('- ') || line.match(/^\d+\. /)) {
            const content = line.replace(/^- |\d+\. /, '');
            const isNumbered = line.match(/^\d+\. /);
            return (
              <div key={idx} className="flex space-x-3 mb-2 group">
                <span className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${isNumbered ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                  {isNumbered ? line.match(/^\d+/) : '•'}
                </span>
                <span className="text-slate-700 text-sm leading-relaxed">{content}</span>
              </div>
            );
          }
          if (line.trim() === '') return <div key={idx} className="h-4" />;
          return <p key={idx} className="text-slate-600 text-sm leading-relaxed mb-4">{line}</p>;
        })}
      </div>
      
      <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-medium">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
          <span>Compliance Verified Analysis</span>
        </div>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(markdown);
          }}
          className="hover:text-indigo-600 flex items-center space-x-1 uppercase tracking-wider transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          <span>Copy Report</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryDisplay;
