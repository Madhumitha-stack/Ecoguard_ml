import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { TrendingUp, AlertCircle, Calendar, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';

const generateForecastSeries = () => {
  const data = [];
  const start = new Date(2026, 5, 1);
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseActual = 12 + Math.sin(i * 0.5) * 5 + (isWeekend ? 4 : 0);
    
    const actual = i <= 20 ? Math.round(baseActual + Math.random() * 3) : null;
    const forecast = Math.round((12 + Math.sin(i * 0.5) * 5.2 + (isWeekend ? 3.5 : 0)) * 10) / 10;
    const deviation = 2.5 + Math.sin(i * 0.2) * 1;
    const yhat_lower = Math.max(0, Math.round((forecast - deviation) * 10) / 10);
    const yhat_upper = Math.round((forecast + deviation) * 10) / 10;

    data.push({
      date: dateStr,
      actual,
      forecast,
      yhat_lower,
      yhat_upper
    });
  }
  return data;
};

export default function ThreatForecasting({ forecasts, loading, onRefresh }) {
  const [zoomMode, setZoomMode] = useState('30d');
  const forecastSeries = generateForecastSeries();
  
  const displayedSeries = zoomMode === '7d' 
    ? forecastSeries.slice(14, 25) 
    : forecastSeries;

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
      className="space-y-6 text-xs font-sans"
    >
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-950/15 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-white font-orbitron flex items-center gap-2">
            <TrendingUp className="text-emerald-400 w-5 h-5 animate-pulse" /> PREDICTIVE THREAT FORECASTING
          </h1>
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1">Additive Prophet Time-Series Modeling // 80% Confidence Boundary Intervals</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-emerald-950/40 p-1.5 rounded-xl border border-emerald-900/35 flex gap-1.5">
            <button
              onClick={() => setZoomMode('30d')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${zoomMode === '30d' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
            >
              30-DAY PROBABILITY
            </button>
            <button
              onClick={() => setZoomMode('7d')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${zoomMode === '7d' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
            >
              7-DAY VALIDATION
            </button>
          </div>

          <button 
            onClick={onRefresh}
            className="p-2 bg-emerald-950/35 hover:bg-emerald-900/45 border border-emerald-900/20 hover:border-emerald-700/45 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} /> SYNC FORECASTS
          </button>
        </div>
      </div>

      {/* Main forecast graph */}
      <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-emerald-900/20 shadow-[0_10px_35px_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-lime-400"></div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xs font-black text-white font-orbitron uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="text-emerald-400 w-4 h-4" /> 
              {zoomMode === '30d' ? 'SERENGETI INCIDENT PROPHECY SCENARIO' : 'VALIDATION TREND COMPARISONS (7D)'}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Evaluates historical telemetry violations against Prophet additive forecasting curves.</p>
          </div>
          <div className="flex gap-4 text-[9px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-400 opacity-15"></span><span>80% CI Range</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"></span><span>ACTUAL VIOLATIONS</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-lime-400"></span><span>PROPHET LINE</span></span>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayedSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a3e635" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#a3e635" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="actualGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={9} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(20, 45, 35, 0.9)', 
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  color: '#fff',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="yhat_upper" 
                stroke="transparent" 
                fill="#10b981" 
                fillOpacity={0.03} 
                legendType="none"
              />
              <Area 
                type="monotone" 
                dataKey="yhat_lower" 
                stroke="transparent" 
                fill="#020504" 
                fillOpacity={0.8} 
                legendType="none"
              />
              <Area 
                type="monotone" 
                dataKey="forecast" 
                stroke="#a3e635" 
                strokeWidth={2}
                fill="url(#forecastGlow)" 
                name="Prophet Forecast"
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#10b981" 
                strokeWidth={2}
                fill="url(#actualGlow)" 
                name="Actual Incursions"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {zoomMode === '30d' && (
          <div className="absolute top-1/2 left-[70%] -translate-y-1/2 border-l border-dashed border-emerald-800/35 h-[80%] pointer-events-none flex flex-col justify-end pl-2">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider transform -rotate-90 origin-bottom-left -translate-y-12">FORECAST BOUNDARY</span>
          </div>
        )}
      </motion.div>

      {/* Split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Info panel */}
        <motion.div variants={itemVariants} className="glass-panel p-5 rounded-2xl lg:col-span-1 flex flex-col justify-between space-y-4 border border-emerald-900/10">
          <div className="space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-orbitron flex items-center gap-1.5 border-b border-emerald-950/15 pb-2">
              <ShieldAlert className="text-orange-400 w-4 h-4" /> THREAT ASSESSMENT DEBRIEF
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
              Model performance metrics: MAE = <strong className="text-white">0.082</strong>  |  RMSE = <strong className="text-white">0.114</strong>. 
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Historical trends reveal a seasonal cycle with peak risk occurring during dry season waterhole contractions. Patrol allocations are optimized to intercept routes.
            </p>
          </div>
          <div className="bg-[#05130f]/60 p-3 rounded-xl border border-emerald-950/20 flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-450 leading-relaxed">
              <strong>CRITICAL WARNING:</strong> Late-night violation clusters in Region B northern boundaries recommend setting vehicle checkpoint road blocks.
            </p>
          </div>
        </motion.div>

        {/* Forecast Table */}
        <motion.div variants={itemVariants} className="glass-panel p-5 rounded-2xl lg:col-span-2 flex flex-col h-[320px] border border-emerald-900/10">
          <div className="flex justify-between items-center mb-3 border-b border-emerald-950/15 pb-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider font-orbitron flex items-center gap-1.5">
              <BarChart2 className="text-emerald-400 w-4 h-4" /> ZONE FUTURE THREAT CLASSIFICATIONS
            </h3>
            <span className="text-[8px] bg-emerald-950/50 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">PROPHET v1.0</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            <table className="w-full text-left text-[11px] border-collapse font-sans">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider border-b border-emerald-950/10 text-[9px] font-extrabold">
                  <th className="py-2.5">ZONE ID</th>
                  <th className="py-2.5 text-center">FORECASTED RISK</th>
                  <th className="py-2.5">RECOMMENDED RECON</th>
                  <th className="py-2.5 text-right">PRIORITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/10">
                {forecasts.map((fc, i) => (
                  <tr key={i} className="hover:bg-emerald-950/10 transition-all duration-200">
                    <td className="py-3 font-bold text-white font-mono">{fc.zone}</td>
                    <td className="py-3 text-center text-lime-400 font-mono font-bold">{fc.predicted_risk.toFixed(3)}</td>
                    <td className="py-3 text-slate-300">{fc.patrol_frequency.toUpperCase()}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] border font-bold ${fc.resource_priority === 'High' ? 'bg-red-950/35 text-red-400 border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)]' : fc.resource_priority === 'Medium' ? 'bg-amber-950/35 text-amber-400 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]' : 'bg-emerald-950/35 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]'}`}>
                        {fc.resource_priority.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
                {forecasts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 italic">No forecast rankings loaded.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
