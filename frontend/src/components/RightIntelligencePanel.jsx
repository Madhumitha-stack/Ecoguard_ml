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
  Zap
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
    <div className="w-[320px] bg-slate-950/70 border-l border-white/5 flex flex-col z-20 backdrop-blur-md justify-between h-full overflow-y-auto">
      
      {/* 1. Live Briefing Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
            <Radio className="text-danger w-3.5 h-3.5 animate-pulse" /> Operation Control Log
          </h3>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">Real-time Acoustic Triangulation Stream</p>
      </div>

      {/* 2. Micro weather and stats indicators */}
      <div className="p-4 border-b border-white/5 grid grid-cols-2 gap-3 text-xs bg-slate-950/20">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-slate-400" />
          <div>
            <span className="text-[9px] text-slate-500 block">TEMP</span>
            <span className="font-bold text-white font-mono">28.2 °C</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-slate-400" />
          <div>
            <span className="text-[9px] text-slate-500 block">WIND</span>
            <span className="font-bold text-white font-mono">14 km/h</span>
          </div>
        </div>
        <div className="col-span-2 flex justify-between items-center mt-1 border-t border-white/5 pt-2 text-[10px] text-slate-400">
          <span>Active Ranger Patrols:</span>
          <span className="text-primary font-bold">7 Squads Deployed</span>
        </div>
      </div>

      {/* 3. Live Logs terminal */}
      <div className="p-4 flex-1 flex flex-col min-h-[160px] overflow-hidden">
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-2">Live Raw Feeds</span>
        <div className="flex-1 bg-slate-950 border border-white/5 rounded-lg p-2.5 font-mono text-[9px] overflow-y-auto space-y-2 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/30 pointer-events-none"></div>
          <AnimatePresence initial={false}>
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="leading-relaxed border-b border-white/5 pb-1"
              >
                <span className="text-slate-500">[{log.time}]</span>{' '}
                <span className={log.level === 'WARN' ? 'text-warning font-bold' : 'text-cyan-400'}>
                  {log.level}
                </span>{' '}
                <span className="text-slate-400">{log.msg}</span>{' '}
                <span className="text-slate-500">({log.zone})</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Quick Triage Predictor Form */}
      <div className="p-4 border-t border-white/5 bg-slate-950/40">
        <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sliders className="w-3.5 h-3.5 text-secondary" /> Quick Threat Triage
        </h4>
        <form onSubmit={handleQuickEvaluate} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2 text-[9px]">
            <div>
              <label className="text-slate-500 block mb-1">Species</label>
              <select
                value={quickSpecies}
                onChange={(e) => setQuickSpecies(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded px-1.5 py-1 text-[10px] text-white"
              >
                {['Elephant', 'Rhino', 'Zebra', 'Buffalo', 'Lion'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-500 block mb-1 flex justify-between">
                <span>Acoustic</span>
                <span className="text-secondary font-bold">{quickAcoustic.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={quickAcoustic}
                onChange={(e) => setQuickAcoustic(parseFloat(e.target.value))}
                className="w-full h-0.5 bg-slate-900 rounded appearance-none cursor-pointer accent-secondary mt-1.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={quickLoading}
            className="w-full py-1 bg-secondary text-background hover:bg-secondary/90 transition-all font-bold text-[10px] rounded flex items-center justify-center gap-1 cursor-pointer uppercase disabled:opacity-50"
          >
            <Send className="w-2.5 h-2.5" /> {quickLoading ? 'Running...' : 'Instant Predict'}
          </button>
        </form>

        {/* Prediction quick result overlay */}
        <AnimatePresence>
          {quickResult && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="mt-2.5 p-2 bg-slate-900 border border-white/10 rounded-lg flex justify-between items-center text-[10px]"
            >
              <div>
                <span className="text-slate-500 block text-[8px]">PROBABILITY</span>
                <span className="font-bold text-white font-mono">{(quickResult.risk_probability * 100).toFixed(1)}%</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[8px]">LEVEL</span>
                <span className={`font-bold uppercase ${quickResult.risk_level?.toLowerCase() === 'high' ? 'text-danger' : quickResult.risk_level?.toLowerCase() === 'medium' ? 'text-warning' : 'text-primary'}`}>
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
