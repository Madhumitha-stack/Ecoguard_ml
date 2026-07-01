import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, MapPin, Eye, ArrowUpRight, ArrowDownRight, Compass, Leaf, CloudSun, Target } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import LoadingSkeleton from '../components/LoadingSkeleton';

const mockSparklineData = [
  { val: 12 }, { val: 19 }, { val: 15 }, { val: 22 }, { val: 30 }, { val: 26 }, { val: 35 }
];
const mockSparklineData2 = [
  { val: 40 }, { val: 38 }, { val: 45 }, { val: 32 }, { val: 28 }, { val: 20 }, { val: 15 }
];
const mockSparklineData3 = [
  { val: 78 }, { val: 82 }, { val: 80 }, { val: 85 }, { val: 88 }, { val: 91 }, { val: 92 }
];

export default function Overview({ alerts, hotspots, patrols, zones, onSelectZone, onSelectAlert, setTab, loading }) {
  const activeAlertsCount = alerts.length;
  const activeHotspotsCount = hotspots.length;
  const averageCoverage = patrols.length > 0 
    ? parseFloat((patrols.reduce((acc, curr) => acc + curr.coverage_score, 0) / patrols.length).toFixed(1)) 
    : 82.4;
  const highRiskZonesCount = zones.filter(z => z.average_risk_score >= 0.15).length;

  if (loading && zones.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 bg-emerald-950/40 rounded w-1/3 animate-pulse"></div>
          <div className="h-3.5 bg-emerald-950/20 rounded w-1/4 mt-2 animate-pulse"></div>
        </div>
        <LoadingSkeleton type="kpi" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <LoadingSkeleton type="list" />
          <LoadingSkeleton type="list" />
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Immersive Forest Ranger Welcome Hero */}
      <motion.div 
        variants={itemVariants}
        className="glass-panel p-6 rounded-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border border-emerald-900/20 shadow-[0_12px_40px_rgba(2,10,6,0.4)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-lime-500/5 to-transparent pointer-events-none" />
        
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-lime-400 font-black tracking-widest uppercase font-orbitron">AI Telemetry Connected</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            Wildlife Intelligence <span className="bg-gradient-to-r from-emerald-400 to-lime-300 bg-clip-text text-transparent">Command Center</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Real-time acoustic grids, predictive risk mappings, and optimized ranger routes are fully synchronized. Target poaching leakage has been neutralized.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 w-full lg:w-auto">
          {/* Sub-status widgets */}
          <div className="bg-emerald-950/30 border border-emerald-900/30 px-4 py-2.5 rounded-xl flex flex-col items-center flex-1 lg:flex-initial">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <CloudSun className="w-3 h-3 text-lime-400" /> Season
            </span>
            <span className="text-xs font-black text-white font-orbitron mt-1">DRY PERIOD</span>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-900/30 px-4 py-2.5 rounded-xl flex flex-col items-center flex-1 lg:flex-initial">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3 h-3 text-emerald-400" /> Incident Rate
            </span>
            <span className="text-xs font-black text-emerald-400 font-orbitron mt-1">7.06% TARGET</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Threats */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="glass-card p-5 relative overflow-hidden rounded-2xl cursor-pointer"
          onClick={() => setTab('alerts')}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 to-red-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ACTIVE_THREATS</p>
              <h3 className="text-3xl font-black mt-2 text-white font-orbitron">
                <AnimatedCounter value={activeAlertsCount} />
              </h3>
            </div>
            <div className="p-2.5 bg-red-950/30 text-red-400 rounded-xl border border-red-500/20">
              <AlertTriangle className="w-4 h-4 shadow-[0_0_8px_rgba(239,68,68,0.3)] animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-red-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.2% Trend
            </span>
            <div className="w-20 h-7 opacity-75">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#ef4444" fill="rgba(239, 68, 68, 0.03)" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* KPI 2: Hotspots */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="glass-card p-5 relative overflow-hidden rounded-2xl cursor-pointer"
          onClick={() => setTab('heatmap')}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-500 to-amber-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">SPATIAL_HOTSPOTS</p>
              <h3 className="text-3xl font-black mt-2 text-white font-orbitron">
                <AnimatedCounter value={activeHotspotsCount} />
              </h3>
            </div>
            <div className="p-2.5 bg-amber-950/30 text-amber-400 rounded-xl border border-amber-500/20">
              <MapPin className="w-4 h-4 shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-amber-400 font-semibold flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> -6.5% Cluster
            </span>
            <div className="w-20 h-7 opacity-75">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSparklineData2}>
                  <Area type="monotone" dataKey="val" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.03)" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* KPI 3: Coverage */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="glass-card p-5 relative overflow-hidden rounded-2xl cursor-pointer"
          onClick={() => setTab('patrols')}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-lime-400"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">PATROL_COVERAGE</p>
              <h3 className="text-3xl font-black mt-2 text-white font-orbitron">
                <AnimatedCounter value={averageCoverage} format={v => `${v}%`} />
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-950/30 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Compass className="w-4 h-4 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +2.8% Loop
            </span>
            <div className="w-20 h-7 opacity-75">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSparklineData3}>
                  <Area type="monotone" dataKey="val" stroke="#10b981" fill="rgba(16, 185, 129, 0.03)" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* KPI 4: Threat Regions */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="glass-card p-5 relative overflow-hidden rounded-2xl cursor-pointer"
          onClick={() => setTab('forecast')}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">THREAT_REGIONS</p>
              <h3 className="text-3xl font-black mt-2 text-white font-orbitron">
                <AnimatedCounter value={highRiskZonesCount} />
              </h3>
            </div>
            <div className="p-2.5 bg-cyan-950/30 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Eye className="w-4 h-4 shadow-[0_0_8px_rgba(6,182,212,0.3)]" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-semibold">RISK: ELEVATED</span>
            <span className="text-[8px] bg-cyan-950/45 text-cyan-400 font-bold px-2 py-0.5 rounded-lg border border-cyan-500/30 uppercase">MEDIUM</span>
          </div>
        </motion.div>
      </div>

      {/* Grid split panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Warning Logs feed */}
        <motion.div variants={itemVariants} className="glass-panel p-5 rounded-2xl flex flex-col h-[400px] border border-emerald-900/10">
          <div className="flex justify-between items-center mb-4 border-b border-emerald-950/15 pb-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-orbitron flex items-center gap-1.5">
              <AlertTriangle className="text-orange-400 w-4 h-4 animate-pulse" /> WARNING FEED TELEMETRY
            </h3>
            <button onClick={() => setTab('alerts')} className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase flex items-center gap-0.5 cursor-pointer">
              LOG VIEW <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {alerts.slice(0, 6).map((alert, i) => (
              <div 
                key={i} 
                onClick={() => { onSelectAlert(alert); setTab('alerts'); }}
                className="p-3.5 bg-emerald-950/10 hover:bg-emerald-950/30 border border-emerald-950/15 hover:border-emerald-700/30 rounded-xl cursor-pointer transition-all duration-300 flex justify-between items-start gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white font-mono">{alert.zone_id}</span>
                  <p className="text-[10px] text-slate-400 line-clamp-1 leading-relaxed">{alert.description}</p>
                </div>
                <span className={`shrink-0 text-[8px] font-bold px-2 py-0.5 rounded ${alert.priority_level === 'High' ? 'bg-red-950/35 text-red-400 border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)]' : 'bg-orange-950/35 text-orange-400 border border-orange-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]'}`}>
                  {alert.priority_level.toUpperCase()}
                </span>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">NO_ACTIVE_ALERTS_REGISTERED</div>
            )}
          </div>
        </motion.div>

        {/* Sector threat rankings */}
        <motion.div variants={itemVariants} className="glass-panel p-5 rounded-2xl flex flex-col h-[400px] border border-emerald-900/10">
          <div className="flex justify-between items-center mb-4 border-b border-emerald-950/15 pb-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-orbitron flex items-center gap-1.5">
              <MapPin className="text-emerald-400 w-4 h-4" /> SECTOR THREAT RANKINGS
            </h3>
            <button onClick={() => setTab('heatmap')} className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase flex items-center gap-0.5 cursor-pointer">
              MAP VIEW <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {zones.slice(0, 6).map((zone, i) => (
              <div 
                key={i} 
                onClick={() => { onSelectZone(zone); setTab('heatmap'); }}
                className="p-3.5 bg-emerald-950/10 hover:bg-emerald-950/30 border border-emerald-950/15 hover:border-emerald-700/30 rounded-xl cursor-pointer transition-all duration-300 flex justify-between items-center"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white font-mono">{zone.zone_id}</span>
                  <div className="text-[9px] text-slate-400 flex gap-4">
                    <span>HIST_INCIDENTS: {zone.incident_count}</span>
                    <span>ACOUSTIC: {zone.average_acoustic_threat?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-orbitron block text-emerald-400">{zone.average_risk_score?.toFixed(3)}</span>
                  <span className="text-[8px] text-slate-500 font-semibold block mt-0.5">MEAN_RISK</span>
                </div>
              </div>
            ))}
            {zones.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">NO_ZONES_DATABASE_HYDRATED</div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
