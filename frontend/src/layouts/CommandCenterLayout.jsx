import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  Compass, 
  TrendingUp, 
  Brain, 
  Radio, 
  Server, 
  Clock, 
  RefreshCw,
  Loader2,
  Menu,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import RightIntelligencePanel from '../components/RightIntelligencePanel';

export default function CommandCenterLayout({
  activeTab,
  setActiveTab,
  apiHealth,
  loading,
  error,
  refreshData,
  children
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Time ticking
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Tactical Command', icon: Shield },
    { id: 'heatmap', label: 'Risk Heatmap', icon: MapPin },
    { id: 'patrols', label: 'Patrol Optimization', icon: Compass },
    { id: 'forecast', label: 'Threat Forecasting', icon: TrendingUp },
    { id: 'xai', label: 'Explainable AI', icon: Brain },
    { id: 'alerts', label: 'Early Warning Feed', icon: Radio },
    { id: 'system', label: 'System Diagnostics', icon: Server }
  ];

  return (
    <div className="flex h-screen w-screen bg-[#0B1020] text-slate-100 overflow-hidden font-sans relative">
      
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 z-0"></div>

      {/* 1. Left Sidebar Navigation */}
      <aside className="w-[260px] bg-slate-950/70 border-r border-white/5 flex flex-col justify-between z-20 backdrop-blur-md shrink-0">
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="p-5 border-b border-white/5 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-background font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              EG
            </div>
            <div>
              <h2 className="text-xs font-black text-white tracking-widest uppercase">EcoGuard-ML</h2>
              <span className="text-[9px] text-primary font-bold uppercase tracking-wider block mt-0.5">Tactical Command</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary/10 to-secondary/5 border-l-2 border-primary text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Details */}
        <div className="p-4 border-t border-white/5 space-y-3 bg-slate-950/40">
          {/* Health indicator status */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-bold uppercase">Telemetry:</span>
            {apiHealth === 'healthy' ? (
              <span className="text-primary font-extrabold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary inline-block animate-pulse"></span>
                CONNECTED
              </span>
            ) : apiHealth === 'unhealthy' ? (
              <span className="text-danger font-extrabold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-danger inline-block"></span>
                OFFLINE
              </span>
            ) : (
              <span className="text-slate-400 font-extrabold flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                CHECKING
              </span>
            )}
          </div>

          {/* Local clock */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 border-t border-white/5 pt-2.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
            <span className="text-[9px] text-slate-500 font-semibold">{currentTime.toLocaleDateString()}</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 z-10 overflow-hidden relative">
        {/* Top Navigation / Navbar */}
        <header className="h-[64px] border-b border-white/5 px-6 flex items-center justify-between bg-slate-950/30 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium hidden md:inline">Serengeti Conservation Domain</span>
            <span className="text-slate-600 hidden md:inline">/</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={loading}
              className="p-1.5 bg-slate-900/40 hover:bg-slate-800/40 border border-white/5 hover:border-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            {/* Toggle button for right intelligence panel */}
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="p-1.5 bg-slate-900/40 hover:bg-slate-800/40 border border-white/5 hover:border-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs"
              title="Toggle Intelligence Panel"
            >
              {rightPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span className="hidden lg:inline">Intel Panel</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route View Content Box */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl flex items-start gap-3 text-xs">
              <span className="h-2 w-2 rounded-full bg-danger inline-block animate-ping shrink-0 mt-1.5"></span>
              <div>
                <h4 className="font-extrabold text-white">System Communication Failure</h4>
                <p className="mt-1 text-slate-300 leading-normal">{error}</p>
                <p className="mt-2 text-[10px] text-slate-400">Please make sure the backend uvicorn server is running locally on port 8001.</p>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* 3. Collapsible Right Intelligence Panel */}
      {rightPanelOpen && (
        <div className="shrink-0 hidden md:block">
          <RightIntelligencePanel />
        </div>
      )}

    </div>
  );
}
