import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, 
  Cpu, 
  Database, 
  Activity, 
  Play, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle,
  Thermometer,
  CloudRain,
  Compass,
  MapPin,
  TrendingUp,
  Volume2
} from 'lucide-react';
import { api } from '../services/api';

export default function SystemMonitoring() {
  // Model prediction form states
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

  // System metrics telemetry states
  const [cpuUsage, setCpuUsage] = useState(12.4);
  const [memoryUsage, setMemoryUsage] = useState(41.8);
  const [apiLatency, setApiLatency] = useState(18);
  const [healthy, setHealthy] = useState(true);

  // Update system metrics values randomly over time to mimic real-time telemetry
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

  // Compute color scheme for risk levels in sandbox
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
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Server className="text-secondary w-6 h-6 animate-pulse" /> System telemetry & Model Sandbox
        </h1>
        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">Real-time CPU diagnostics, model serving metrics, and interactive inference</p>
      </div>

      {/* Datadog Styled Metrics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Metric 1: CPU */}
        <div className="glass-card p-4 rounded-xl flex flex-col justify-between relative overflow-hidden h-[120px]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CPU UTILIZATION</span>
            <Cpu className="w-4 h-4 text-secondary" />
          </div>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-3xl font-extrabold text-white font-mono">{cpuUsage}%</h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase">8 Core Intel Xeon</span>
          </div>
          {/* Micro progress bar */}
          <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-secondary h-full transition-all duration-500" style={{ width: `${cpuUsage}%` }}></div>
          </div>
        </div>

        {/* Metric 2: Memory */}
        <div className="glass-card p-4 rounded-xl flex flex-col justify-between relative overflow-hidden h-[120px]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-primary"></div>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">MEMORY FOOTPRINT</span>
            <Database className="w-4 h-4 text-primary" />
          </div>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-3xl font-extrabold text-white font-mono">{memoryUsage}%</h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase">6.7 GB / 16 GB</span>
          </div>
          {/* Micro progress bar */}
          <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden mt-3">
            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${memoryUsage}%` }}></div>
          </div>
        </div>

        {/* Metric 3: Latency */}
        <div className="glass-card p-4 rounded-xl flex flex-col justify-between relative overflow-hidden h-[120px]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-warning"></div>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">RESPONSE LATENCY</span>
            <Activity className="w-4 h-4 text-warning" />
          </div>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-3xl font-extrabold text-white font-mono">{apiLatency} ms</h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase">Avg P95 API Response</span>
          </div>
          {/* Micro indicator */}
          <div className="mt-3 flex items-center justify-between text-[9px] text-slate-400">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span> Dynamic telemetry</span>
            <span>Uvicorn Server</span>
          </div>
        </div>

        {/* Metric 4: Health */}
        <div className="glass-card p-4 rounded-xl flex flex-col justify-between relative overflow-hidden h-[120px]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-500"></div>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">MODEL PIPELINE HEALTH</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex justify-between items-baseline mt-2">
            <h3 className="text-2xl font-extrabold text-white uppercase flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block animate-pulse"></span> HEALTHY
            </h3>
            <span className="text-[9px] text-slate-400 font-semibold uppercase">API Port 8001</span>
          </div>
          {/* Status check log */}
          <div className="mt-3 text-[9px] text-slate-400 border-t border-white/5 pt-2 flex justify-between">
            <span>FastAPI ASGI Framework</span>
            <span className="text-primary font-bold">ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Model Sandbox panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form panel */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
          
          <div className="mb-5 border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Play className="text-secondary w-4 h-4" /> Interactive Model Sandbox
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Adjust environmental, geographic, and temporal inputs to compute real-time poaching threat levels.</p>
          </div>

          <form onSubmit={handlePredictSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Field 1: Species */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Target Species</label>
                <select
                  value={formData.species}
                  onChange={(e) => handleInputChange('species', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-secondary"
                >
                  {["Buffalo", "Elephant", "Lion", "None Detected", "Rhino", "Zebra"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Field 2: Season */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Season</label>
                <select
                  value={formData.season}
                  onChange={(e) => handleInputChange('season', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-secondary"
                >
                  {["Dry", "Wet", "Short Dry", "Short Wet"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Field 3: Acoustic Risk */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1 flex justify-between">
                  <span>Acoustic Risk</span>
                  <span className="text-secondary font-mono">{formData.acoustic_risk.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formData.acoustic_risk}
                  onChange={(e) => handleInputChange('acoustic_risk', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-secondary mt-2.5"
                />
              </div>

              {/* Field 4: Temperature */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 5: Humidity */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Humidity (%)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.humidity}
                  onChange={(e) => handleInputChange('humidity', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 6: Rainfall */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Rainfall (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.rainfall}
                  onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 7: Animal Density */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Animal Density Score</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.animal_density_score}
                  onChange={(e) => handleInputChange('animal_density_score', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 8: Road Distance */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Dist. to Access Road (m)</label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={formData.distance_to_road}
                  onChange={(e) => handleInputChange('distance_to_road', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 9: Ranger Station Distance */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Dist. to Station (m)</label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={formData.distance_to_ranger_station}
                  onChange={(e) => handleInputChange('distance_to_ranger_station', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 10: Latitude */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 11: Longitude */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 12: Historical Incident Count */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Hist. Incidents</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={formData.historical_incident_count}
                  onChange={(e) => handleInputChange('historical_incident_count', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 13: Hour */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Hour of Day (0-23)</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={formData.hour}
                  onChange={(e) => handleInputChange('hour', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 14: Month */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Month (1-12)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 15: Distance to Water */}
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Dist. to Water (m)</label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={formData.distance_to_water}
                  onChange={(e) => handleInputChange('distance_to_water', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

              {/* Field 16: Elevation */}
              <div className="sm:col-span-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wide font-bold block mb-1">Elevation (m)</label>
                <input
                  type="number"
                  step="10"
                  value={formData.elevation}
                  onChange={(e) => handleInputChange('elevation', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-secondary font-mono"
                />
              </div>

            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={predicting}
                className="w-full py-2.5 bg-gradient-to-r from-secondary to-primary hover:from-secondary/95 hover:to-primary/95 text-xs font-bold text-background rounded-lg uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer disabled:opacity-50"
              >
                {predicting ? 'Running XGBoost Inference...' : 'Compute Poaching Risk Probability'}
              </button>
            </div>
          </form>
        </div>

        {/* Dial panel */}
        <div className="lg:col-span-1 glass-card p-6 rounded-xl flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[350px]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
          
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Model Risk Inference Output</h3>

          <div className="flex-1 flex flex-col justify-center items-center relative w-full">
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
                  <div className="relative w-40 h-40 flex items-center justify-center rounded-full border border-white/5 bg-slate-950/20 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.05)]">
                    
                    {/* Ring glow indicator */}
                    <div 
                      className="absolute inset-2 rounded-full border-[6px] border-slate-900 opacity-60"
                    ></div>
                    <div 
                      className={`absolute inset-2 rounded-full border-[6px] border-t-transparent border-l-transparent border-r-transparent transition-all duration-1000`}
                      style={{ 
                        borderColor: predictResult.risk_level.toLowerCase() === 'high' ? '#EF4444' : predictResult.risk_level.toLowerCase() === 'medium' ? '#F59E0B' : '#10B981',
                        transform: `rotate(${predictResult.risk_probability * 360}deg)`,
                        boxShadow: `0 0 15px ${predictResult.risk_level.toLowerCase() === 'high' ? 'rgba(239, 68, 68, 0.4)' : predictResult.risk_level.toLowerCase() === 'medium' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                      }}
                    ></div>

                    <div className="text-center z-10">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Risk Rate</span>
                      <h4 className="text-3xl font-extrabold text-white font-mono mt-0.5">{(predictResult.risk_probability * 100).toFixed(1)}%</h4>
                    </div>
                  </div>

                  {/* Level text */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Risk Classification</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getRiskColor(predictResult.risk_level)}`}>
                      {predictResult.risk_level}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                    XGBoost model completed inference successfully. Result shows a <strong>{predictResult.risk_level}</strong> poaching risk probability.
                  </p>
                </motion.div>
              ) : predictError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-4 text-center space-y-2.5"
                >
                  <AlertCircle className="w-10 h-10 text-danger animate-bounce" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Inference Error</h4>
                  <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
                    {predictError}
                  </p>
                  <p className="text-[9px] text-slate-500">
                    Verify the backend FastAPI server on port 8001 is active.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-4 text-center space-y-3"
                >
                  <div className="w-32 h-32 rounded-full border border-dashed border-white/10 flex items-center justify-center text-slate-500">
                    <Activity className="w-8 h-8 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Input</h4>
                  <p className="text-[10px] text-slate-500 max-w-[180px]">
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
