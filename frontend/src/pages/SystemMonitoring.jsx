import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, 
  Cpu, 
  Database, 
  Activity, 
  Play, 
  AlertCircle, 
  CheckCircle,
  Crosshair
} from 'lucide-react';
import { api } from '../services/api';

export default function SystemMonitoring() {
  const [formData, setFormData] = useState({
    latitude: -2.1,
    longitude: 34.9,
    temperature: 26.5,
    humidity: 55.0,
    rainfall: 2.5,
    animal_density_score: 4.0,
    distance_to_road: 1500.0,
    distance_to_water: 2000.0,
    distance_to_ranger_station: 8500.0,
    elevation: 1150.0,
    historical_incident_count: 12.0,
    acoustic_risk: 0.35,
    hour: 12,
    month: 6,
    season: 'Dry',
    species: 'Elephant'
  });

  const [predictResult, setPredictResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState(null);

  const [cpuUsage, setCpuUsage] = useState(12.4);
  const [memoryUsage, setMemoryUsage] = useState(41.8);
  const [apiLatency, setApiLatency] = useState(18);

  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage(prev => {
        const change = (Math.random() - 0.5) * 3;
        return Math.max(5, Math.min(95, parseFloat((prev + change).toFixed(1))));
      });
      setMemoryUsage(prev => {
        const change = (Math.random() - 0.5) * 0.5;
        return Math.max(30, Math.min(85, parseFloat((prev + change).toFixed(1))));
      });
      setApiLatency(prev => {
        const change = Math.round((Math.random() - 0.5) * 6);
        return Math.max(8, Math.min(45, prev + change));
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (key, val) => {
    setFormData(prev => ({
      ...prev,
      [key]: typeof val === 'number' ? val : (isNaN(parseFloat(val)) ? val : parseFloat(val))
    }));
  };

  const handlePredictSubmit = async (e) => {
    e.preventDefault();
    setPredicting(true);
    setPredictResult(null);
    setPredictError(null);

    try {
      const response = await api.predictRisk(formData);
      setPredictResult(response);
    } catch (err) {
      setPredictError(err.message || 'Model prediction inference failed.');
    } finally {
      setPredicting(false);
    }
  };

  const getRiskColor = (level) => {
    if (!level) return 'text-slate-400';
    switch (level.toLowerCase()) {
      case 'high':
        return 'text-danger border-danger/30 bg-danger/10';
      case 'medium':
        return 'text-warning border-warning/30 bg-warning/10';
      case 'low':
      default:
        return 'text-primary border-primary/30 bg-primary/10';
    }
  };

  return (
    <div className="space-y-6 font-share text-xs">
      
      {/* Title */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold tracking-wider text-white font-orbitron flex items-center gap-2">
          <Server className="text-secondary w-5 h-5 animate-pulse" /> SYSTEM_DIAGNOSTICS_CENTER
        </h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Uvicorn API Monitor // XGBoost Core Inference Sandbox</p>
      </div>

      {/* Datadog cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* CPU */}
        <div className="hud-panel p-4 rounded flex flex-col justify-between relative overflow-hidden h-[120px]">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary"></div>
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">CPU_UTILIZATION</span>
            <Cpu className="w-4 h-4 text-secondary" />
          </div>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-2xl font-bold text-white font-orbitron glow-text-secondary">{cpuUsage}%</h3>
            <span className="text-[8px] text-slate-500 font-semibold uppercase">8_CORE_INTEL_XEON</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-3">
            <div className="bg-secondary h-full transition-all duration-500" style={{ width: `${cpuUsage}%` }}></div>
          </div>
        </div>

        {/* Memory */}
        <div className="hud-panel p-4 rounded flex flex-col justify-between relative overflow-hidden h-[120px]">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary"></div>
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">MEM_FOOTPRINT</span>
            <Database className="w-4 h-4 text-primary" />
          </div>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-2xl font-bold text-white font-orbitron glow-text-primary">{memoryUsage}%</h3>
            <span className="text-[8px] text-slate-500 font-semibold uppercase">6.7 GB / 16 GB</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-3">
            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${memoryUsage}%` }}></div>
          </div>
        </div>

        {/* Latency */}
        <div className="hud-panel p-4 rounded flex flex-col justify-between relative overflow-hidden h-[120px]">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-warning"></div>
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">API_RESPONSE_LATENCY</span>
            <Activity className="w-4 h-4 text-warning" />
          </div>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-2xl font-bold text-white font-orbitron glow-text-warning">{apiLatency} ms</h3>
            <span className="text-[8px] text-slate-500 font-semibold uppercase">Avg P95 Response</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[8px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-warning animate-pulse"></span> SCANNING...</span>
            <span>UVICORN_ASGI</span>
          </div>
        </div>

        {/* Health */}
        <div className="hud-panel p-4 rounded flex flex-col justify-between relative overflow-hidden h-[120px]">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">PIPELINE_STATUS</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-xl font-bold text-white uppercase flex items-center gap-1.5 font-orbitron glow-text-primary">
              <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse"></span> ONLINE
            </h3>
            <span className="text-[8px] text-slate-500 font-semibold uppercase">PORT_8001</span>
          </div>
          <div className="mt-3 text-[8px] text-slate-500 border-t border-white/5 pt-2 flex justify-between">
            <span>FastAPI Server</span>
            <span className="text-primary font-bold">ALL_NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Model Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form */}
        <div className="lg:col-span-2 hud-panel p-6 rounded relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary"></div>
          
          <div className="mb-5 border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold text-white font-orbitron uppercase tracking-wider flex items-center gap-1.5">
              <Play className="text-secondary w-4 h-4" /> MODEL_SANDBOX_HYDRATOR
            </h3>
            <p className="text-[9px] text-slate-500 mt-1">Adjust environmental, geographic, and temporal inputs to compute real-time poaching threat levels.</p>
          </div>

          <form onSubmit={handlePredictSubmit} className="space-y-4 font-mono text-[10px]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Target Species</label>
                <select
                  value={formData.species}
                  onChange={(e) => handleInputChange('species', e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-secondary font-share"
                >
                  {["Buffalo", "Elephant", "Lion", "None Detected", "Rhino", "Zebra"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Season</label>
                <select
                  value={formData.season}
                  onChange={(e) => handleInputChange('season', e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-secondary font-share"
                >
                  {["Dry", "Wet", "Short Dry", "Short Wet"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1 flex justify-between font-share">
                  <span>Acoustic Risk</span>
                  <span className="text-secondary font-bold font-mono">{formData.acoustic_risk.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.acoustic_risk}
                  onChange={(e) => handleInputChange('acoustic_risk', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded appearance-none cursor-pointer accent-secondary mt-2.5"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Humidity (%)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.humidity}
                  onChange={(e) => handleInputChange('humidity', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Rainfall (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.rainfall}
                  onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Animal Density</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.animal_density_score}
                  onChange={(e) => handleInputChange('animal_density_score', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Dist to Road (m)</label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={formData.distance_to_road}
                  onChange={(e) => handleInputChange('distance_to_road', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Dist to Station (m)</label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={formData.distance_to_ranger_station}
                  onChange={(e) => handleInputChange('distance_to_ranger_station', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Hist Incidents</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.historical_incident_count}
                  onChange={(e) => handleInputChange('historical_incident_count', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Hour (0-23)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={formData.hour}
                  onChange={(e) => handleInputChange('hour', parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Month (1-12)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              <div>
                <label className="text-[8px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Dist to Water (m)</label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={formData.distance_to_water}
                  onChange={(e) => handleInputChange('distance_to_water', parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

            </div>

            <div className="pt-2 font-share">
              <button
                type="submit"
                disabled={predicting}
                className="w-full py-2.5 bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 text-xs font-bold text-background rounded uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-50"
              >
                {predicting ? 'RUNNING_XGBOOST_INFERENCE_JOBS...' : 'COMPUTE_THREAT_PROBABILITY'}
              </button>
            </div>
          </form>
        </div>

        {/* Glowing circular gauge */}
        <div className="lg:col-span-1 hud-panel p-6 rounded flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[350px] scanlines">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary"></div>
          
          <h3 className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2 font-orbitron">REAL_TIME_INFERENCE_DIAL</h3>

          <div className="flex-1 flex flex-col justify-center items-center relative w-full font-share">
            <AnimatePresence mode="wait">
              {predictResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center justify-center space-y-4 w-full"
                >
                  {/* Glowing Gauge */}
                  <div className="relative w-40 h-40 flex items-center justify-center rounded-full border border-white/10 bg-slate-950/80 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                    
                    {/* Ring glow indicators */}
                    <div className="absolute inset-2 rounded-full border-[8px] border-slate-900 opacity-60"></div>
                    <div 
                      className="absolute inset-2 rounded-full border-[8px] border-t-transparent border-l-transparent border-r-transparent transition-all duration-1000"
                      style={{ 
                        borderColor: predictResult.risk_level.toLowerCase() === 'high' ? '#EF4444' : predictResult.risk_level.toLowerCase() === 'medium' ? '#F59E0B' : '#10B981',
                        transform: `rotate(${predictResult.risk_probability * 360}deg)`,
                        boxShadow: `0 0 25px ${predictResult.risk_level.toLowerCase() === 'high' ? 'rgba(239, 68, 68, 0.5)' : predictResult.risk_level.toLowerCase() === 'medium' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.5)'}`
                      }}
                    ></div>

                    <div className="text-center z-10 font-mono">
                      <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">THREAT_RATE</span>
                      <h4 className="text-3xl font-bold text-white font-orbitron mt-0.5">{(predictResult.risk_probability * 100).toFixed(1)}%</h4>
                    </div>
                  </div>

                  {/* Level text */}
                  <div className="space-y-1">
                    <span className="text-[8px] text-slate-500 font-bold block uppercase tracking-wider">CLASSIFICATION</span>
                    <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase border ${getRiskColor(predictResult.risk_level)}`}>
                      {predictResult.risk_level}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                    XGBoost core model inference complete. Sector status updated to <strong>{predictResult.risk_level.toUpperCase()}</strong> risk category.
                  </p>
                </motion.div>
              ) : predictError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-4 text-center space-y-2.5 font-mono"
                >
                  <AlertCircle className="w-10 h-10 text-danger animate-bounce" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-orbitron">INFERENCE_ERROR</h4>
                  <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                    {predictError}
                  </p>
                  <p className="text-[8px] text-slate-500">
                    Verify the backend FastAPI server on port 8001 is active.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-4 text-center space-y-3 font-share"
                >
                  <div className="w-28 h-28 rounded-full border border-dashed border-cyan-400/20 flex items-center justify-center text-slate-600 animate-spin" style={{ animationDuration: '40s' }}>
                    <Crosshair className="w-7 h-7" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-orbitron">AWAITING_INPUTS</h4>
                  <p className="text-[9px] text-slate-500 max-w-[180px]">
                    Fill in environmental variables and click compute to trigger XGBoost model risk classification.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
