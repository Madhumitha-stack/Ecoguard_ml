import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, MapPin, Eye, ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';
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
          <div className="h-7 bg-slate-800 rounded w-1/3 animate-pulse"></div>
          <div className="h-3.5 bg-slate-900 rounded w-1/4 mt-2 animate-pulse"></div>
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
      {/* HUD Page Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-white font-orbitron flex items-center gap-2">
            <Shield className="text-secondary w-5 h-5" /> TACTICAL OPERATIONS HUB
          </h1>
          <p className="text-[10px] text-slate-500 font-share uppercase tracking-widest mt-1">SYS_SCAN_ACTIVE // NETWORK_SECURE_MODE</p>
        </div>
        <div className="text-right text-[10px] font-share text-slate-500">
          <span>LATITUDE: -2.1245 // LONGITUDE: 34.8954</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* KPI 1: Threats */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="hud-panel p-5 relative overflow-hidden rounded cursor-pointer"
          onClick={() => setTab('alerts')}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-danger"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ACTIVE_THREATS</p>
              <h3 className="text-3xl font-bold mt-2 text-white font-orbitron glow-text-danger">
                <AnimatedCounter value={activeAlertsCount} />
              </h3>
            </div>
            <div className="p-2 bg-danger/10 text-danger rounded border border-danger/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-danger font-share flex items-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.2%
            </span>
            <div className="w-20 h-7 opacity-70">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#ef4444" fill="rgba(239, 68, 68, 0.05)" strokeWidth={1} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* KPI 2: Hotspots */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="hud-panel p-5 relative overflow-hidden rounded cursor-pointer"
          onClick={() => setTab('heatmap')}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-warning"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">SPATIAL_HOTSPOTS</p>
              <h3 className="text-3xl font-bold mt-2 text-white font-orbitron glow-text-warning">
                <AnimatedCounter value={activeHotspotsCount} />
              </h3>
            </div>
            <div className="p-2 bg-warning/10 text-warning rounded border border-warning/20">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-warning font-share flex items-center font-bold">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> -6.5%
            </span>
            <div className="w-20 h-7 opacity-70">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSparklineData2}>
                  <Area type="monotone" dataKey="val" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.05)" strokeWidth={1} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* KPI 3: Coverage */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="hud-panel p-5 relative overflow-hidden rounded cursor-pointer"
          onClick={() => setTab('patrols')}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">PATROL_COVERAGE</p>
              <h3 className="text-3xl font-bold mt-2 text-white font-orbitron glow-text-primary">
                <AnimatedCounter value={averageCoverage} format={v => `${v}%`} />
              </h3>
            </div>
            <div className="p-2 bg-primary/10 text-primary rounded border border-primary/20">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-primary font-share flex items-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +2.8%
            </span>
            <div className="w-20 h-7 opacity-70">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSparklineData3}>
                  <Area type="monotone" dataKey="val" stroke="#10b981" fill="rgba(16, 185, 129, 0.05)" strokeWidth={1} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* KPI 4: Threat Regions */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -2 }}
          className="hud-panel p-5 relative overflow-hidden rounded cursor-pointer"
          onClick={() => setTab('forecast')}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">THREAT_REGIONS</p>
              <h3 className="text-3xl font-bold mt-2 text-white font-orbitron glow-text-secondary">
                <AnimatedCounter value={highRiskZonesCount} />
              </h3>
            </div>
            <div className="p-2 bg-secondary/10 text-secondary rounded border border-secondary/20">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[9px] font-share text-slate-400">RISK_RATING: ELEVATED</span>
            <span className="text-[8px] bg-secondary/20 text-secondary font-bold px-1.5 py-0.5 rounded border border-secondary/35 uppercase">MEDIUM</span>
          </div>
        </motion.div>
      </div>

      {/* Grid split panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Warning Logs feed */}
        <motion.div variants={itemVariants} className="hud-panel p-5 rounded flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-orbitron flex items-center gap-1.5">
              <AlertTriangle className="text-danger w-4 h-4" /> WARNING_CENTER_TELEMETRY
            </h3>
            <button onClick={() => setTab('alerts')} className="text-[10px] text-secondary font-share hover:underline flex items-center gap-0.5">
              LOG_VIEW <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {alerts.slice(0, 6).map((alert, i) => (
              <div 
                key={i} 
                onClick={() => { onSelectAlert(alert); setTab('alerts'); }}
                className="p-3 bg-slate-900/10 hover:bg-slate-900/40 border border-white/5 hover:border-cyan-500/20 rounded cursor-pointer transition-all duration-300 flex justify-between items-start gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white font-share">{alert.zone_id}</span>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{alert.description}</p>
                </div>
                <span className={`shrink-0 text-[8px] font-share px-2 py-0.5 font-bold rounded ${alert.priority_level === 'High' ? 'bg-danger/10 text-danger border border-danger/25' : 'bg-warning/10 text-warning border border-warning/25'}`}>
                  {alert.priority_level.toUpperCase()}
                </span>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs font-share">NO_ACTIVE_ALERTS_REGISTERED</div>
            )}
          </div>
        </motion.div>

        {/* Sector threat rankings */}
        <motion.div variants={itemVariants} className="hud-panel p-5 rounded flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-orbitron flex items-center gap-1.5">
              <MapPin className="text-secondary w-4 h-4" /> SECTOR_THREAT_RANKINGS
            </h3>
            <button onClick={() => setTab('heatmap')} className="text-[10px] text-secondary font-share hover:underline flex items-center gap-0.5">
              MAP_VIEW <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {zones.slice(0, 6).map((zone, i) => (
              <div 
                key={i} 
                onClick={() => { onSelectZone(zone); setTab('heatmap'); }}
                className="p-3 bg-slate-900/10 hover:bg-slate-900/40 border border-white/5 hover:border-cyan-500/20 rounded cursor-pointer transition-all duration-300 flex justify-between items-center"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white font-share">{zone.zone_id}</span>
                  <div className="text-[9px] text-slate-400 font-share flex gap-4">
                    <span>HIST_INCIDENTS: {zone.incident_count}</span>
                    <span>ACOUSTIC_RISK: {zone.average_acoustic_threat?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-orbitron block text-white glow-text-secondary">{zone.average_risk_score?.toFixed(3)}</span>
                  <span className="text-[8px] text-slate-500 font-share block mt-0.5">MEAN_RISK</span>
                </div>
              </div>
            ))}
            {zones.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs font-share">NO_ZONES_DATABASE_HYDRATED</div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
