import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, ShieldAlert, Radio, Filter, MapPin, Check, MessageSquare, Clock } from 'lucide-react';

export default function EarlyWarning({ alerts, selectedAlert, onSelectAlert, onRefresh }) {
  const [filterLevel, setFilterLevel] = useState('ALL'); // 'ALL', 'High', 'Medium'

  const filteredAlerts = alerts.filter(alert => {
    if (filterLevel === 'ALL') return true;
    return alert.priority_level.toLowerCase() === filterLevel.toLowerCase();
  });

  const getAlertIcon = (type) => {
    switch (type) {
      case 'Increased Night Activity':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'Rising Acoustic Threat':
        return <Radio className="w-4 h-4 text-danger animate-pulse" />;
      case 'Escalating Hotspot':
      default:
        return <AlertOctagon className="w-4 h-4 text-danger" />;
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
    <div className="h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {/* Alert Feed Panel */}
      <div className="lg:col-span-2 glass-panel p-5 rounded-xl flex flex-col h-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 mb-4">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Radio className="text-danger w-5 h-5 animate-pulse" /> Early Warning Feed
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest">Real-time acoustic sensor networks & diurnal risk alerts</p>
          </div>

          {/* Filter options */}
          <div className="flex items-center gap-2 bg-slate-950/40 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setFilterLevel('ALL')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${filterLevel === 'ALL' ? 'bg-danger text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All Logs
            </button>
            <button
              onClick={() => setFilterLevel('High')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${filterLevel === 'High' ? 'bg-danger text-white' : 'text-slate-400 hover:text-white'}`}
            >
              High
            </button>
            <button
              onClick={() => setFilterLevel('Medium')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${filterLevel === 'Medium' ? 'bg-danger text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Medium
            </button>
          </div>
        </div>

        {/* Alert Scroll Area */}
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
                      ? 'bg-danger/10 border-danger/40 text-white shadow-[0_0_15px_rgba(239,68,68,0.08)]' 
                      : 'bg-slate-900/30 border-white/5 hover:bg-slate-800/40 hover:border-slate-700/50'
                  }`}
                >
                  {/* Visual Indicator Line */}
                  <div className={`absolute top-0 left-0 h-full w-[3.5px] ${isHigh ? 'bg-danger' : 'bg-warning'}`}></div>
                  
                  {/* Alert Icon */}
                  <div className={`p-2 rounded-lg shrink-0 ${isHigh ? 'bg-danger/15 text-danger' : 'bg-warning/15 text-warning'}`}>
                    {getAlertIcon(alert.alert_type)}
                  </div>
                  
                  {/* Text Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-white tracking-wide text-xs">{alert.zone_id}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wide uppercase ${isHigh ? 'bg-danger/20 text-danger border border-danger/25' : 'bg-warning/20 text-warning border border-warning/25'}`}>
                        {alert.priority_level} Priority
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 block">{alert.alert_type}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{alert.description}</p>
                  </div>
                </motion.div>
              );
            })}

            {filteredAlerts.length === 0 && (
              <div className="py-16 text-center text-slate-500 italic">No alerts found matching the selected filter.</div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Trigger Details Sidebar Panel */}
      <div className="lg:col-span-1 glass-card p-5 rounded-xl flex flex-col justify-between h-full overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedAlert ? (
            <motion.div
              key={selectedAlert.zone_id + selectedAlert.alert_type}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-5"
            >
              <div className="border-b border-white/5 pb-3">
                <span className="text-[9px] bg-danger/20 text-danger font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">Telemetry Event Triggered</span>
                <h3 className="text-base font-extrabold text-white mt-2 flex items-center gap-1.5">
                  <ShieldAlert className="text-danger w-5 h-5 animate-pulse" /> {selectedAlert.zone_id}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{selectedAlert.alert_type}</p>
              </div>

              {/* Description box */}
              <div className="space-y-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Diagnostics</span>
                <p className="text-xs text-slate-200 bg-slate-950/40 p-3 rounded-lg border border-white/5 leading-relaxed">
                  {selectedAlert.description}
                </p>
              </div>

              {/* Sensor stats */}
              <div className="space-y-3.5">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Acoustic Triangulation</span>
                <div className="bg-slate-900/30 border border-white/5 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Mesh Node Status:</span>
                    <span className="text-primary font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span> ONLINE</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Trigger Frequency:</span>
                    <span className="text-white font-mono">134.2 kHz</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Diurnal Shift:</span>
                    <span className="text-warning font-semibold">Night Heavy (+24.1%)</span>
                  </div>
                </div>
              </div>

              {/* Dispatch Action checklist */}
              <div className="space-y-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Recommended Dispatch Plan</span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 bg-slate-950/20 p-2 rounded">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-slate-300">Reroute nearest vehicle patrol team to boundary entry point.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-950/20 p-2 rounded">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-slate-300">Establish overnight acoustic listening check-points.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="p-4 bg-slate-900/40 border border-white/5 rounded-full text-slate-500">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">No Alert Selected</h4>
              <p className="text-[11px] text-slate-400 max-w-[200px]">Select any warning card from the early warning stream feed to analyze diagnostic telemetry.</p>
            </div>
          )}
        </AnimatePresence>
        
        {selectedAlert && (
          <button
            onClick={() => onSelectAlert(null)}
            className="w-full mt-4 py-2 bg-slate-950 hover:bg-slate-900 text-xs font-bold text-slate-400 hover:text-white border border-white/5 rounded-lg transition-all"
          >
            Clear Selected diagnostics
          </button>
        )}
      </div>
    </div>
  );
}
