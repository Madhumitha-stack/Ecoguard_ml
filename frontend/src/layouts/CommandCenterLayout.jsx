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
  ChevronRight,
  ChevronLeft,
  Search,
  Bell,
  User,
  Sun,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RightIntelligencePanel from '../components/RightIntelligencePanel';
import RainforestBackground from '../components/RainforestBackground';

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
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="flex h-screen w-screen bg-[#020504] text-slate-100 overflow-hidden font-sans relative">
      
      {/* Immersive Animated Rainforest Background */}
      <RainforestBackground />

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-20 z-0"></div>

      {/* 1. Left Sidebar Navigation */}
      <aside className="w-[280px] bg-[#061811]/30 border-r border-emerald-950/20 flex flex-col justify-between z-20 backdrop-blur-xl shrink-0 relative">
        <div className="flex flex-col">
          {/* Brand header with animated leaf logo */}
          <div className="p-5 border-b border-emerald-950/15 flex items-center gap-3">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-slate-950 font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.35)]"
            >
              <Leaf className="w-5 h-5 text-emerald-950 fill-emerald-950/20" />
            </motion.div>
            <div>
              <h2 className="text-xs font-black tracking-widest uppercase text-emerald-400 font-orbitron">EcoGuard-ML</h2>
              <span className="text-[9px] text-lime-400 font-extrabold uppercase tracking-wider block mt-0.5">Forest Intel AI</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer relative overflow-hidden group"
                >
                  {/* Floating active selection indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 to-lime-900/10 border-l-[3px] border-emerald-400 shadow-[inset_4px_0_15px_rgba(16,185,129,0.08)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover glow background */}
                  <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                  <Icon className={`w-4 h-4 shrink-0 z-10 transition-colors duration-300 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span className={`z-10 transition-colors duration-300 ${isActive ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Details */}
        <div className="p-5 border-t border-emerald-950/15 space-y-4 bg-emerald-950/10 backdrop-blur-md">
          {/* Health indicator status */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-bold uppercase tracking-wider">AI Command Link:</span>
            {apiHealth === 'healthy' ? (
              <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse shadow-[0_0_8px_#10b981]"></span>
                ONLINE
              </span>
            ) : apiHealth === 'unhealthy' ? (
              <span className="text-danger font-extrabold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-danger inline-block animate-ping"></span>
                OFFLINE
              </span>
            ) : (
              <span className="text-slate-400 font-extrabold flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin text-lime-400" />
                LINKING
              </span>
            )}
          </div>

          {/* Local clock */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 border-t border-emerald-950/10 pt-3">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
            <span className="text-[9px] text-slate-500 font-semibold">{currentTime.toLocaleDateString()}</span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 z-10 overflow-hidden relative">
        
        {/* Top Navigation / Navbar */}
        <header className="h-[68px] border-b border-emerald-950/15 px-6 flex items-center justify-between bg-[#040f0a]/30 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-emerald-500/80 font-black tracking-widest uppercase font-orbitron">Serengeti Reserve Area</span>
              <span className="text-emerald-800">/</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-1 rounded-lg">
                {activeTab}
              </span>
            </div>

            {/* Search Input Bar */}
            <div className="relative hidden lg:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search telemetry coordinates, incident logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[280px] bg-emerald-950/20 hover:bg-emerald-950/30 focus:bg-emerald-950/40 border border-emerald-900/20 focus:border-emerald-700/40 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Weather Widget */}
            <div className="hidden sm:flex items-center gap-2 bg-emerald-950/20 border border-emerald-900/20 px-3 py-1.5 rounded-xl text-[10px] text-slate-300 font-semibold">
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>Dry Season</span>
              <span className="text-emerald-400">26.4°C</span>
            </div>

            {/* Notifications Widget */}
            <div className="relative cursor-pointer p-1.5 hover:bg-white/5 rounded-xl transition-all">
              <Bell className="w-4 h-4 text-slate-300 hover:text-white" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_6px_#f97316]"></span>
            </div>

            {/* User Profile avatar */}
            <div className="flex items-center gap-2 border-l border-emerald-950/15 pl-4">
              <div className="h-7.5 w-7.5 rounded-xl bg-emerald-800/40 border border-emerald-700/50 flex items-center justify-center text-emerald-300">
                <User className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wide hidden xl:inline">Ranger Alpha</span>
            </div>

            {/* Refresh action */}
            <button
              onClick={refreshData}
              disabled={loading}
              className="p-2 bg-emerald-950/35 hover:bg-emerald-900/45 border border-emerald-900/20 hover:border-emerald-700/40 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            {/* Toggle button for right intelligence panel */}
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="p-2 bg-emerald-950/35 hover:bg-emerald-900/45 border border-emerald-900/20 hover:border-emerald-700/40 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs"
              title="Toggle Intelligence Panel"
            >
              {rightPanelOpen ? <ChevronRight className="w-4 h-4 text-emerald-400" /> : <ChevronLeft className="w-4 h-4 text-emerald-400" />}
              <span className="hidden lg:inline">Intel Panel</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route View Content Box with Framer Motion slide transition */}
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Collapsible Right Intelligence Panel */}
      {rightPanelOpen && (
        <div className="shrink-0 hidden md:block z-10 border-l border-emerald-950/15">
          <RightIntelligencePanel />
        </div>
      )}

    </div>
  );
}
