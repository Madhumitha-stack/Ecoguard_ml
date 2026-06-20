import React from 'react';

export default function LoadingSkeleton({ type = 'card' }) {
  if (type === 'kpi') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card p-5 rounded-xl h-[120px] relative overflow-hidden animate-pulse">
            <div className="h-2 bg-slate-800 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-slate-850 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-slate-900 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="p-3 bg-slate-900/30 border border-white/5 rounded-lg flex justify-between items-center h-[52px]">
            <div className="space-y-1.5 w-1/3">
              <div className="h-2.5 bg-slate-850 rounded w-full"></div>
              <div className="h-2 bg-slate-900 rounded w-2/3"></div>
            </div>
            <div className="h-4 bg-slate-850 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-xl animate-pulse space-y-4">
      <div className="h-4 bg-slate-800 rounded w-1/4"></div>
      <div className="h-3 bg-slate-850 rounded w-1/2"></div>
      <div className="h-[250px] bg-slate-900 rounded-lg"></div>
    </div>
  );
}
