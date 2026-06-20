import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, MapPin, Eye, ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';

const mockSparklineData = [
  { val: 12 }, { val: 19 }, { val: 15 }, { val: 22 }, { val: 30 }, { val: 26 }, { val: 35 }
];
const mockSparklineData2 = [
  { val: 40 }, { val: 38 }, { val: 45 }, { val: 32 }, { val: 28 }, { val: 20 }, { val: 15 }
];
const mockSparklineData3 = [
  { val: 78 }, { val: 82 }, { val: 80 }, { val: 85 }, { val: 88 }, { val: 91 }, { val: 92 }
];

export default function Overview({ alerts, hotspots, patrols, zones, onSelectZone, onSelectAlert, setTab }) {
  // Compute KPI values
  const activeAlertsCount = alerts.length;
  const activeHotspotsCount = hotspots.length;
  const averageCoverage = patrols.length > 0 
    ? (patrols.reduce((acc, curr) => acc + curr.coverage_score, 0) / patrols.length).toFixed(1) 
    : "82.4";
  const highRiskZonesCount = zones.filter(z => z.average_risk_score >= 0.15).length;

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
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Shield className="text-primary w-6 h-6" /> Tactical Command Center
        </h1>
        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">Serengeti Reserve Real-Time Telemetry Feed</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="glass-card p-5 relative overflow-hidden rounded-xl cursor-pointer"
          onClick={() => setTab('alerts')}
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-danger"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Threats</p>
              <h3 className="text-3xl font-extrabold mt-2 text-white glow-text-danger">{activeAlertsCount}</h3>
            </div>
            <div className="p-2 bg-danger/10 text-danger rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-danger flex items-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.2%
            </span>
            <div className="w-20 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#ef4444" fill="rgba(239, 68, 68, 0.1)" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* KPI 2 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="glass-card p-5 relative overflow-hidden rounded-xl cursor-pointer"
          onClick={() => setTab('heatmap')}
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-warning"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Spatial Hotspots</p>
              <h3 className="text-3xl font-extrabold mt-2 text-white glow-text-warning">{activeHotspotsCount}</h3>
            </div>
            <div className="p-2 bg-warning/10 text-warning rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-warning flex items-center font-bold">
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> -6.5%
            </span>
            <div className="w-20 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSparklineData2}>
                  <Area type="monotone" dataKey="val" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.1)" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* KPI 3 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="glass-card p-5 relative overflow-hidden rounded-xl cursor-pointer"
          onClick={() => setTab('patrols')}
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-primary"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Patrol Coverage</p>
              <h3 className="text-3xl font-extrabold mt-2 text-white glow-text-primary">{averageCoverage}%</h3>
            </div>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-primary flex items-center font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +2.8%
            </span>
            <div className="w-20 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSparklineData3}>
                  <Area type="monotone" dataKey="val" stroke="#10b981" fill="rgba(16, 185, 129, 0.1)" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* KPI 4 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -3 }}
          className="glass-card p-5 relative overflow-hidden rounded-xl cursor-pointer"
          onClick={() => setTab('forecast')}
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Threat Regions</p>
              <h3 className="text-3xl font-extrabold mt-2 text-white glow-text-secondary">{highRiskZonesCount}</h3>
            </div>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-bold">Risk Level: ELEVATED</span>
            <span className="text-[10px] bg-secondary/20 text-secondary font-bold px-1.5 py-0.5 rounded uppercase">Medium</span>
          </div>
        </motion.div>
      </div>

      {/* Split lists: Alerts and Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts panel */}
        <motion.div variants={itemVariants} className="glass-card p-5 rounded-xl flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="text-danger w-4 h-4" /> Warning Center Logs
            </h3>
            <button onClick={() => setTab('alerts')} className="text-xs text-primary hover:underline font-semibold flex items-center">
              View Log <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {alerts.slice(0, 5).map((alert, i) => (
              <div 
                key={i} 
                onClick={() => { onSelectAlert(alert); setTab('alerts'); }}
                className="p-3 bg-slate-900/40 hover:bg-slate-800/40 border border-white/5 hover:border-slate-700/50 rounded-lg cursor-pointer transition-all duration-300 flex justify-between items-start gap-4"
              >
                <div>
                  <span className="text-xs font-bold text-white">{alert.zone_id}</span>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{alert.description}</p>
                </div>
                <span className={`badge shrink-0 text-[9px] px-2 py-0.5 font-bold rounded ${alert.priority_level === 'High' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
                  {alert.priority_level}
                </span>
              </div>
            ))}
            {alerts.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">No active alerts.</div>
            )}
          </div>
        </motion.div>

        {/* High Risk Zones panel */}
        <motion.div variants={itemVariants} className="glass-card p-5 rounded-xl flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="text-primary w-4 h-4" /> Sector Threat Rankings
            </h3>
            <button onClick={() => setTab('heatmap')} className="text-xs text-primary hover:underline font-semibold flex items-center">
              Map View <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {zones.slice(0, 5).map((zone, i) => (
              <div 
                key={i} 
                onClick={() => { onSelectZone(zone); setTab('heatmap'); }}
                className="p-3 bg-slate-900/40 hover:bg-slate-800/40 border border-white/5 hover:border-slate-700/50 rounded-lg cursor-pointer transition-all duration-300 flex justify-between items-center"
              >
                <div>
                  <span className="text-xs font-bold text-white">{zone.zone_id}</span>
                  <div className="text-[10px] text-slate-400 mt-1 flex gap-3">
                    <span>Incidents: {zone.incident_count}</span>
                    <span>Acoustic: {zone.average_acoustic_threat?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold block text-white">{zone.average_risk_score?.toFixed(3)}</span>
                  <span className="text-[9px] text-slate-400">Mean Risk</span>
                </div>
              </div>
            ))}
            {zones.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">No zones loaded.</div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
