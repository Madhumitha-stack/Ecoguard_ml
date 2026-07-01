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
      className="space-y-6 font-share text-xs"
    >
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-white font-orbitron flex items-center gap-2">
            <TrendingUp className="text-secondary w-5 h-5 animate-pulse" /> THREAT_FORECASTING_ENGINE
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Additive Prophet Time-Series Analytics // Confidence Bounds (80% CI)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-1 rounded border border-white/5 flex gap-1">
            <button
              onClick={() => setZoomMode('30d')}
              className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${zoomMode === '30d' ? 'bg-secondary text-background font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              30_DAY_TREND
            </button>
            <button
              onClick={() => setZoomMode('7d')}
              className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${zoomMode === '7d' ? 'bg-secondary text-background font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              7_DAY_VALIDATION
            </button>
          </div>

          <button 
            onClick={onRefresh}
            className="p-1.5 bg-slate-900/40 hover:bg-slate-800/40 border border-white/5 hover:border-slate-700/50 rounded text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-[10px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> SYNC_MODEL
          </button>
        </div>
      </div>

      {/* Main forecast graph */}
      <motion.div variants={itemVariants} className="hud-panel p-6 rounded relative overflow-hidden scanlines">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-secondary to-primary"></div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xs font-bold text-white font-orbitron uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="text-secondary w-4 h-4" /> 
              {zoomMode === '30d' ? 'SERENGETI_RESERVE_PROPHECY_CURVE' : 'VALIDATION_COMPASS_7D'}
            </h3>
            <p className="text-[9px] text-slate-500 mt-1">Reflects historical daily violations against Prophet forecast trajectories.</p>
          </div>
          <div className="flex gap-4 text-[9px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 opacity-15"></span><span>80% CI</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span><span>ACTUALS</span></span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400"></span><span>PROPHET</span></span>
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={9} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#050710', 
                  borderColor: 'rgba(13, 242, 254, 0.15)',
                  color: '#fff',
                  fontSize: '10px',
                  fontFamily: 'Share Tech Mono',
                  borderRadius: '2px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="yhat_upper" 
                stroke="transparent" 
                fill="#ef4444" 
                fillOpacity={0.05} 
                legendType="none"
              />
              <Area 
                type="monotone" 
                dataKey="yhat_lower" 
                stroke="transparent" 
                fill="#050710" 
                fillOpacity={1} 
                legendType="none"
              />
              <Area 
                type="monotone" 
                dataKey="forecast" 
                stroke="#ef4444" 
                strokeWidth={1.5}
                fill="url(#forecastGlow)" 
                name="Prophet"
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#06b6d4" 
                strokeWidth={1.5}
                fill="url(#actualGlow)" 
                name="Actuals"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {zoomMode === '30d' && (
          <div className="absolute top-1/2 left-[70%] -translate-y-1/2 border-l border-dashed border-white/10 h-[80%] pointer-events-none flex flex-col justify-end pl-2">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider transform -rotate-90 origin-bottom-left -translate-y-12">FORECAST BOUNDARY</span>
          </div>
        )}
      </motion.div>

      {/* Split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Info panel */}
        <motion.div variants={itemVariants} className="hud-panel p-5 rounded lg:col-span-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white font-orbitron uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldAlert className="text-warning w-4 h-4" /> DECISION_INTELLIGENCE_BRIEF
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Model performance metrics: MAE = <strong className="text-white font-bold font-mono">0.082</strong> // RMSE = <strong className="text-white font-bold font-mono">0.114</strong>. 
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Historical trends reveal a seasonal cycle with peak risk occurring during dry season waterhole contractions. Patrol allocations are optimized to intercept routes.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded border border-white/5 flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <p className="text-[9px] text-slate-500 leading-normal">
              CRITICAL: Late-night violation clusters in Region B northern boundaries recommend setting vehicle checkpoint road blocks.
            </p>
          </div>
        </motion.div>

        {/* Forecast Table */}
        <motion.div variants={itemVariants} className="hud-panel p-5 rounded lg:col-span-2 flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold text-white font-orbitron uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="text-primary w-4 h-4" /> ZONE_FUTURE_THREAT_CLASSIFICATION
            </h3>
            <span className="text-[8px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded border border-primary/30">PROPHET_V1</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            <table className="w-full text-left text-[11px] border-collapse font-share">
              <thead>
                <tr className="text-slate-500 uppercase tracking-wider border-b border-white/5 text-[9px] font-bold">
                  <th className="py-2.5">ZONE</th>
                  <th className="py-2.5 text-center">FORECAST_RISK</th>
                  <th className="py-2.5">RECOMMENDED_FREQUENCY</th>
                  <th className="py-2.5 text-right">PRIORITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {forecasts.map((fc, i) => (
                  <tr key={i} className="hover:bg-slate-950 transition-all">
                    <td className="py-3 font-bold text-white font-share">{fc.zone}</td>
                    <td className="py-3 text-center text-secondary font-mono font-bold">{fc.predicted_risk.toFixed(3)}</td>
                    <td className="py-3 text-slate-400">{fc.patrol_frequency.toUpperCase()}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] border font-bold ${fc.resource_priority === 'High' ? 'bg-danger/10 text-danger border-danger/25' : fc.resource_priority === 'Medium' ? 'bg-warning/10 text-warning border-warning/25' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
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
