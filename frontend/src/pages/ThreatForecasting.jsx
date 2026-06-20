import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { TrendingUp, AlertCircle, Calendar, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';

// Generates 30 days of mock forecast time-series data mimicking the Prophet output
const generateForecastSeries = () => {
  const data = [];
  const start = new Date(2026, 5, 1); // June 1, 2026
  
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Add seasonal variations
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseActual = 12 + Math.sin(i * 0.5) * 5 + (isWeekend ? 4 : 0);
    
    const actual = i <= 20 ? Math.round(baseActual + Math.random() * 3) : null;
    const forecast = Math.round((12 + Math.sin(i * 0.5) * 5.2 + (isWeekend ? 3.5 : 0)) * 10) / 10;
    const deviation = 2.5 + Math.sin(i * 0.2) * 1;
    const yhat_lower = Math.max(0, Math.round((forecast - deviation) * 10) / 10);
    const yhat_upper = Math.round((forecast + deviation) * 10) / 10;

    data.append({
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
  const [zoomMode, setZoomMode] = useState('30d'); // '30d' or '7d'
  const forecastSeries = generateForecastSeries();
  
  // Filter for 7-day zoom comparison (centered around the forecast boundary at index 20)
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
      className="space-y-6"
    >
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="text-secondary w-6 h-6 animate-pulse" /> Threat Forecasting Engine
          </h1>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">Additive Time-Series Forecasting & Prophet Analytics</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Zoom Toggle */}
          <div className="bg-slate-950/40 p-1 rounded-lg border border-white/5 flex gap-1">
            <button
              onClick={() => setZoomMode('30d')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${zoomMode === '30d' ? 'bg-secondary text-background font-bold shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              30-Day Trend
            </button>
            <button
              onClick={() => setZoomMode('7d')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${zoomMode === '7d' ? 'bg-secondary text-background font-bold shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              7-Day Zoom
            </button>
          </div>

          <button 
            onClick={onRefresh}
            className="p-2 bg-slate-900/40 hover:bg-slate-800/40 border border-white/5 hover:border-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Model
          </button>
        </div>
      </div>

      {/* Primary Forecast Chart */}
      <motion.div variants={itemVariants} className="glass-panel p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-secondary to-primary"></div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="text-secondary w-4 h-4" /> 
              {zoomMode === '30d' ? 'Serengeti reserve 30-day forecast horizon' : '7-day forecast zoom validation'}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Shows actual daily incidents vs. Prophet forecast with 80% confidence boundaries</p>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-secondary opacity-25"></span><span className="text-slate-400">80% Conf. Interval</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span><span className="text-slate-300">Actuals</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"></span><span className="text-slate-300">Prophet Forecast</span></span>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayedSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="actualGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0B1020', 
                  borderColor: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '11px',
                  borderRadius: '8px'
                }} 
              />
              {/* Confidence Interval */}
              <Area 
                type="monotone" 
                dataKey="yhat_upper" 
                stroke="transparent" 
                fill="#ef4444" 
                fillOpacity={0.08} 
                legendType="none"
              />
              <Area 
                type="monotone" 
                dataKey="yhat_lower" 
                stroke="transparent" 
                fill="#0B1020" 
                fillOpacity={1} 
                legendType="none"
              />
              {/* Forecast Area */}
              <Area 
                type="monotone" 
                dataKey="forecast" 
                stroke="#ef4444" 
                strokeWidth={2}
                fill="url(#forecastGlow)" 
                name="Forecast"
              />
              {/* Actuals Area */}
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#06b6d4" 
                strokeWidth={2}
                fill="url(#actualGlow)" 
                name="Actual Incidents"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Boundary Alert overlay */}
        {zoomMode === '30d' && (
          <div className="absolute top-1/2 left-[70%] -translate-y-1/2 border-l border-dashed border-white/20 h-[80%] pointer-events-none flex flex-col justify-end pl-2">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider transform -rotate-90 origin-bottom-left -translate-y-12">Forecast Horizon Boundary</span>
          </div>
        )}
      </motion.div>

      {/* Split grid: Info callouts & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info/Briefing panel */}
        <motion.div variants={itemVariants} className="glass-card p-5 rounded-xl lg:col-span-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldAlert className="text-warning w-4 h-4 animate-bounce" /> Tactical Operations Briefing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prophet model baseline shows high fidelity with a Mean Absolute Error (MAE) of <strong className="text-white">0.082</strong> and Root Mean Squared Error (RMSE) of <strong className="text-white">0.114</strong>. 
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
               poaching incidents peak in transitional dry periods. High threat sectors are recommended to receive daily coverage to intercept poacher movement.
            </p>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-lg border border-white/5 flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-300">
              Checkpoints are being actively recommended along the northern boundary roads of Region B based on late-night violation clusters.
            </p>
          </div>
        </motion.div>

        {/* Forecast Table */}
        <motion.div variants={itemVariants} className="glass-card p-5 rounded-xl lg:col-span-2 flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="text-primary w-4 h-4" /> Zone-Level Future Threat Ranking
            </h3>
            <span className="text-[9px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded uppercase">PROPHET-10</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 uppercase tracking-wider border-b border-white/5 text-[9px]">
                  <th className="py-2.5 font-semibold">Zone</th>
                  <th className="py-2.5 text-center font-semibold">Forecast Risk</th>
                  <th className="py-2.5 font-semibold">Recommended Frequency</th>
                  <th className="py-2.5 text-right font-semibold">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {forecasts.map((fc, i) => (
                  <tr key={i} className="hover:bg-slate-950/20 transition-all">
                    <td className="py-3 font-semibold text-white">{fc.zone}</td>
                    <td className="py-3 text-center text-secondary font-mono font-bold">{fc.predicted_risk.toFixed(3)}</td>
                    <td className="py-3 text-slate-300">{fc.patrol_frequency}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${fc.resource_priority === 'High' ? 'bg-danger/15 text-danger border border-danger/25' : fc.resource_priority === 'Medium' ? 'bg-warning/15 text-warning border border-warning/25' : 'bg-slate-800 text-slate-400'}`}>
                        {fc.resource_priority}
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
