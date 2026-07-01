import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, 
  Wind, 
  Thermometer, 
  ShieldAlert, 
  MapPin, 
  Sliders, 
  Send,
  Zap,
  Droplet
} from 'lucide-react';
import { api } from '../services/api';

const initialLogs = [
  { time: '11:42:04', level: 'INFO', msg: 'Acoustic Mesh Node #12 connected.', zone: 'ZONE_B01' },
  { time: '11:39:15', level: 'WARN', msg: 'Late-night hour vehicle frequency signature match.', zone: 'ZONE_B02' },
  { time: '11:35:12', level: 'INFO', msg: 'Ranger Squad Alpha checked in at Outpost 2.', zone: 'ZONE_A01' },
  { time: '11:28:44', level: 'WARN', msg: 'Rising acoustic risk (gunshot heuristic threshold > 0.40).', zone: 'ZONE_B02' },
  { time: '11:20:03', level: 'INFO', msg: 'NASA SRTM elevation raster reload complete.', zone: 'SYSTEM' }
];

const mockLogsPool = [
  { level: 'INFO', msg: 'Elephant herd vocalizations tracked.', zone: 'ZONE_A02' },
  { level: 'WARN', msg: 'Short-term acoustic rise flagged.', zone: 'ZONE_D02' },
  { level: 'INFO', msg: 'Ranger Squad Gamma patrolling highway boundaries.', zone: 'ZONE_B01' },
  { level: 'WARN', msg: 'Acoustic threat spike index 0.65.', zone: 'ZONE_B02' },
  { level: 'INFO', msg: 'GBIF species occurrence points synced.', zone: 'SYSTEM' }
];

export default function RightIntelligencePanel() {
  const [logs, setLogs] = useState(initialLogs);
  const [quickAcoustic, setQuickAcoustic] = useState(0.4);
  const [quickSpecies, setQuickSpecies] = useState('Elephant');
  const [quickResult, setQuickResult] = useState(null);
  const [quickLoading, setQuickLoading] = useState(false);

  // Poll to add mock logs dynamically to show real-time telemetry feed
  useEffect(() => {
    const timer = setInterval(() => {
      const randomLog = mockLogsPool[Math.floor(Math.random() * mockLogsPool.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setLogs(prev => [
        { time: timeStr, ...randomLog },
        ...prev.slice(0, 5) // keep last 6 items
      ]);
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  const handleQuickEvaluate = async (e) => {
    e.preventDefault();
    setQuickLoading(true);
    setQuickResult(null);
    try {
      const response = await api.predictRisk({
        latitude: -2.1,
        longitude: 34.9,
        temperature: 28.0,
        humidity: 45.0,
        rainfall: 0.0,
        animal_density_score: 5.0,
        distance_to_road: 2000.0,
        distance_to_water: 3000.0,
        distance_to_ranger_station: 9000.0,
        elevation: 1100.0,
        historical_incident_count: 8.0,
        acoustic_risk: quickAcoustic,
        hour: 23, // assume night
        month: 6,
        season: 'Dry',
        species: quickSpecies
      });
      setQuickResult(response);
    } catch (_) {
      setQuickResult({ risk_level: 'Offline', risk_probability: 0.0 });
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <div className="w-[320px] bg-[#061811]/30 border-l border-emerald-950/20 flex flex-col justify-between h-full overflow-y-auto backdrop-blur-xl relative">
      
      {/* 1. Live Briefing Header */}
      <div className="p-5 border-b border-emerald-950/15">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 font-orbitron">
            <Radio className="text-red-400 w-3.5 h-3.5 animate-pulse" /> OPERATION LOGS
          </h3>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mt-1.5">Acoustic Triangulation Grid</p>
      </div>

      {/* 2. Micro weather and stats indicators */}
      <div className="p-4 border-b border-emerald-950/15 grid grid-cols-2 gap-3 text-xs bg-emerald-950/10">
        <div className="flex items-center gap-2 bg-[#05130f]/35 p-2 rounded-xl border border-emerald-950/20">
          <Thermometer className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-[8px] text-slate-400 block font-bold">TEMP</span>
            <span className="font-extrabold text-white font-mono">28.2 °C</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#05130f]/35 p-2 rounded-xl border border-emerald-950/20">
          <Wind className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-[8px] text-slate-400 block font-bold">WIND</span>
            <span className="font-extrabold text-white font-mono">14 km/h</span>
          </div>
        </div>
        <div className="col-span-2 flex justify-between items-center mt-1 border-t border-emerald-950/15 pt-3.5 text-[10px] text-slate-350">
          <span>Active Ranger Patrols:</span>
          <span className="text-emerald-400 font-extrabold">7 Squads Out</span>
        </div>
      </div>

      {/* 3. Live Logs terminal */}
      <div className="p-5 flex-1 flex flex-col min-h-[160px] overflow-hidden">
        <span className="text-[9px] text-slate-405 font-bold uppercase tracking-wider block mb-2.5">Telemetry Radio Streams</span>
        <div className="flex-1 bg-[#05130f]/60 border border-emerald-950/20 rounded-2xl p-3 font-mono text-[9px] overflow-y-auto space-y-2 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#020504]/20 pointer-events-none"></div>
          <AnimatePresence initial={false}>
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="leading-relaxed border-b border-emerald-950/5 pb-1.5"
              >
                <span className="text-slate-500">[{log.time}]</span>{' '}
                <span className={log.level === 'WARN' ? 'text-amber-400 font-extrabold' : 'text-emerald-400 font-bold'}>
                  {log.level}
                </span>{' '}
                <span className="text-slate-300">{log.msg}</span>{' '}
                <span className="text-slate-500">({log.zone})</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Quick Triage Predictor Form */}
      <div className="p-5 border-t border-emerald-950/15 bg-emerald-950/10">
        <h4 className="text-[10px] font-black text-white uppercase tracking-wider mb-3 flex items-center gap-1.5 font-orbitron">
          <Sliders className="w-3.5 h-3.5 text-emerald-400" /> QUICK INCIDENT TRIAGE
        </h4>
        <form onSubmit={handleQuickEvaluate} className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-[9px]">
            <div>
              <label className="text-slate-400 block mb-1">Species</label>
              <select
                value={quickSpecies}
                onChange={(e) => setQuickSpecies(e.target.value)}
                className="w-full bg-[#05130f]/60 border border-emerald-900/20 focus:border-emerald-500/40 rounded-xl px-2 py-1.5 text-[10px] text-white outline-none font-sans"
              >
                {['Elephant', 'Rhino', 'Zebra', 'Buffalo', 'Lion'].map(s => (
                  <option key={s} className="bg-emerald-950 text-white" value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1 flex justify-between font-sans">
                <span>Acoustic</span>
                <span className="text-emerald-400 font-bold font-mono">{quickAcoustic.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={quickAcoustic}
                onChange={(e) => setQuickAcoustic(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#05130f]/60 rounded appearance-none cursor-pointer accent-emerald-500 mt-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={quickLoading}
            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 hover:from-emerald-450 hover:to-lime-400 transition-all font-black text-[10px] rounded-xl flex items-center justify-center gap-1 cursor-pointer uppercase disabled:opacity-50"
          >
            <Send className="w-3 h-3 text-slate-950" /> {quickLoading ? 'Running...' : 'Quick Compute'}
          </button>
        </form>

        {/* Prediction quick result overlay */}
        <AnimatePresence>
          {quickResult && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="mt-3 p-3.5 bg-[#05130f]/60 border border-emerald-950/20 rounded-xl flex justify-between items-center text-[10px]"
            >
              <div>
                <span className="text-slate-450 block text-[8px] font-bold tracking-wide">PROBABILITY</span>
                <span className="font-bold text-white font-mono">{(quickResult.risk_probability * 100).toFixed(1)}%</span>
              </div>
              <div className="text-right">
                <span className="text-slate-450 block text-[8px] font-bold tracking-wide">RISK LEVEL</span>
                <span className={`font-bold uppercase ${quickResult.risk_level?.toLowerCase() === 'high' ? 'text-red-400' : quickResult.risk_level?.toLowerCase() === 'medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {quickResult.risk_level}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
