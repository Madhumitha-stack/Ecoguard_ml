import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, ShieldAlert, Radio, Clock, Check, MessageSquare, Crosshair } from 'lucide-react';

export default function EarlyWarning({ alerts, selectedAlert, onSelectAlert }) {
  const [filterLevel, setFilterLevel] = useState('ALL');

  const filteredAlerts = alerts.filter(alert => {
    if (filterLevel === 'ALL') return true;
    return alert.priority_level.toLowerCase() === filterLevel.toLowerCase();
  });

  const getAlertIcon = (type) => {
    switch (type) {
      case 'Increased Night Activity':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Rising Acoustic Threat':
        return <Radio className="w-4 h-4 text-red-400 animate-pulse" />;
      case 'Escalating Hotspot':
      default:
        return <AlertOctagon className="w-4 h-4 text-red-400" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="h-[calc(100vh-148px)] grid grid-cols-1 lg:grid-cols-3 gap-6 relative font-sans text-xs">
      
      {/* Alert Feed */}
      <div className="lg:col-span-2 glass-panel p-5 rounded-2xl flex flex-col h-full overflow-hidden border border-emerald-900/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950/15 pb-4 mb-4">
          <div>
            <h1 className="text-lg font-bold text-white font-orbitron flex items-center gap-2">
              <Radio className="text-red-400 w-5 h-5 animate-pulse" /> TELEMETRY ALERTS STREAM
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest">Real-time acoustic sensor networks & diurnal risk alerts</p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/40 p-1 rounded-xl border border-emerald-900/35 font-mono">
            {['ALL', 'High', 'Medium'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all cursor-pointer ${
                  filterLevel === lvl ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {filteredAlerts.map((alert, i) => {
              const isSelected = selectedAlert && selectedAlert.zone_id === alert.zone_id && selectedAlert.alert_type === alert.alert_type;
              const isHigh = alert.priority_level === 'High';
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  onClick={() => onSelectAlert(alert)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all duration-300 relative overflow-hidden flex gap-4 items-start ${
                    isSelected 
                      ? 'bg-red-950/30 border-red-500/40 text-white shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                      : 'bg-emerald-950/10 border-emerald-950/15 hover:bg-emerald-950/25 hover:border-emerald-700/20'
                  }`}
                >
                  <div className={`absolute top-0 left-0 h-full w-[3px] ${isHigh ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`}></div>
                  <div className={`p-2 rounded-lg shrink-0 ${isHigh ? 'bg-red-950/40 text-red-400 border border-red-500/20' : 'bg-amber-950/40 text-amber-400 border border-amber-500/20'}`}>
                    {getAlertIcon(alert.alert_type)}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white tracking-wide text-xs font-mono">{alert.zone_id}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] border font-bold uppercase ${isHigh ? 'bg-red-950/35 text-red-400 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)]' : 'bg-amber-950/35 text-amber-400 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]'}`}>
                        {alert.priority_level.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-[10px] font-extrabold text-lime-400 block">{alert.alert_type.toUpperCase()}</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-mono">{alert.description}</p>
                  </div>
                </motion.div>
              );
            })}

            {filteredAlerts.length === 0 && (
              <div className="py-16 text-center text-slate-500 italic font-mono">No alerts found matching the selected filter.</div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Target Details sidebar */}
      <div className="lg:col-span-1 glass-panel p-5 rounded-2xl flex flex-col justify-between h-full overflow-y-auto border border-emerald-900/20 shadow-lg">
        <AnimatePresence mode="wait">
          {selectedAlert ? (
            <motion.div
              key={selectedAlert.zone_id + selectedAlert.alert_type}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-5"
            >
              <div className="border-b border-emerald-950/15 pb-3">
                <span className="text-[8px] bg-red-950/35 text-red-400 border border-red-500/20 font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-[0_0_8px_rgba(239,68,68,0.1)]">EVENT TRIGGERED</span>
                <h3 className="text-base font-black text-white mt-2.5 font-orbitron flex items-center gap-1.5">
                  <ShieldAlert className="text-red-400 w-5 h-5 animate-pulse" /> {selectedAlert.zone_id}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{selectedAlert.alert_type}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">DIAGNOSTICS</span>
                <p className="text-xs text-slate-200 bg-[#05130f]/60 border border-emerald-950/20 p-3.5 rounded-xl leading-relaxed font-mono">
                  {selectedAlert.description}
                </p>
              </div>

              <div className="space-y-3 font-mono">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">TRIANGULATION MESH</span>
                <div className="bg-[#05130f]/60 border border-emerald-950/20 p-3.5 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">MESH STATUS:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> ONLINE</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">FREQUENCY:</span>
                    <span className="text-white">134.2 kHz</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">DIURNAL SHIFT:</span>
                    <span className="text-amber-450 font-bold">NIGHT HEAVY (+24.1%)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">TACTICAL DISPATCH RECS</span>
                <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed">
                  <div className="flex items-start gap-2.5 bg-[#05130f]/60 p-3 rounded-xl border border-emerald-950/20">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Reroute nearest vehicle patrol team to boundary entry point.</span>
                  </div>
                  <div className="flex items-start gap-2.5 bg-[#05130f]/60 p-3 rounded-xl border border-emerald-950/20">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Establish overnight acoustic listening check-points.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-4 bg-emerald-950/20 border border-emerald-950/15 rounded-full text-slate-500">
                <Crosshair className="w-8 h-8 text-emerald-600 animate-pulse" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-orbitron">NO TARGET SELECTED</h4>
              <p className="text-[10px] text-slate-400 max-w-[200px]">Select any warning card from the early warning stream feed to analyze diagnostic telemetry.</p>
            </div>
          )}
        </AnimatePresence>
        
        {selectedAlert && (
          <button
            onClick={() => onSelectAlert(null)}
            className="w-full mt-4 py-2 bg-[#05130f]/60 hover:bg-[#071d17]/80 text-[10px] font-black text-slate-400 hover:text-white border border-emerald-950/20 rounded-xl transition-all cursor-pointer"
          >
            [CLEAR DIAGNOSTICS]
          </button>
        )}
      </div>
    </div>
  );
}
