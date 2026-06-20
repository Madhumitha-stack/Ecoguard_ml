import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  MapPin, 
  Compass, 
  TrendingUp, 
  Brain, 
  Radio, 
  Server, 
  Loader2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { api } from './services/api';
import Overview from './pages/Overview';
import RiskHeatmap from './pages/RiskHeatmap';
import PatrolOptimization from './pages/PatrolOptimization';
import ThreatForecasting from './pages/ThreatForecasting';
import ExplainableAI from './pages/ExplainableAI';
import EarlyWarning from './pages/EarlyWarning';
import SystemMonitoring from './pages/SystemMonitoring';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [zones, setZones] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [patrols, setPatrols] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Selection States
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  // Status States
  const [loading, setLoading] = useState(true);
  const [apiHealth, setApiHealth] = useState('checking'); // 'healthy', 'unhealthy', 'checking'
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock ticks
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Verify health
      const healthRes = await api.getHealth();
      if (healthRes && healthRes.status === 'healthy') {
        setApiHealth('healthy');
      } else {
        setApiHealth('unhealthy');
      }

      // 2. Load lists
      const [zonesRes, hotspotsRes, patrolsRes, forecastsRes, alertsRes] = await Promise.all([
        api.getHighRiskZones().catch(e => { console.error(e); return []; }),
        api.getHotspots().catch(e => { console.error(e); return []; }),
        api.getPatrols().catch(e => { console.error(e); return []; }),
        api.getForecast().catch(e => { console.error(e); return []; }),
        api.getAlerts().catch(e => { console.error(e); return []; })
      ]);

      setZones(zonesRes);
      setHotspots(hotspotsRes);
      setPatrols(patrolsRes);
      setForecasts(forecastsRes);
      setAlerts(alertsRes);
      
    } catch (err) {
      console.error("API load failure:", err);
      setApiHealth('unhealthy');
      setError("Failed to connect to EcoGuard-ML API server on port 8001.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSelectZone = (zone) => {
    setSelectedZone(zone);
    setActiveTab('heatmap');
  };

  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
    setActiveTab('alerts');
  };

  // Nav menu schema
  const navItems = [
    { id: 'overview', label: 'Tactical Command', icon: Shield },
    { id: 'heatmap', label: 'Risk Heatmap', icon: MapPin },
    { id: 'patrols', label: 'Patrol Optimization', icon: Compass },
    { id: 'forecast', label: 'Threat Forecasting', icon: TrendingUp },
    { id: 'xai', label: 'Explainable AI', icon: Brain },
    { id: 'alerts', label: 'Early Warning Feed', icon: Radio },
    { id: 'system', label: 'System Diagnostics', icon: Server }
  ];

  // Router dispatcher
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview 
            alerts={alerts}
            hotspots={hotspots}
            patrols={patrols}
            zones={zones}
            onSelectZone={handleSelectZone}
            onSelectAlert={handleSelectAlert}
            setTab={setActiveTab}
          />
        );
      case 'heatmap':
        return (
          <RiskHeatmap 
            hotspots={hotspots}
            zones={zones}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            patrols={patrols}
            forecasts={forecasts}
          />
        );
      case 'patrols':
        return (
          <PatrolOptimization 
            patrols={patrols}
            selectedZone={selectedZone}
            onSelectZone={handleSelectZone}
          />
        );
      case 'forecast':
        return (
          <ThreatForecasting 
            forecasts={forecasts}
            loading={loading}
            onRefresh={loadAllData}
          />
        );
      case 'xai':
        return <ExplainableAI />;
      case 'alerts':
        return (
          <EarlyWarning 
            alerts={alerts}
            selectedAlert={selectedAlert}
            onSelectAlert={setSelectedAlert}
            onRefresh={loadAllData}
          />
        );
      case 'system':
        return <SystemMonitoring />;
      default:
        return <div className="text-white text-xs">Page Not Found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-[#0B1020] text-slate-100 overflow-hidden font-sans relative">
      {/* Background Grid Overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-20"></div>

      {/* Sidebar Navigation */}
      <div className="w-[260px] bg-slate-950/70 border-r border-white/5 flex flex-col justify-between z-20 backdrop-blur-md">
        <div className="flex flex-col">
          {/* Sidebar Header Brand */}
          <div className="p-5 border-b border-white/5 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-background font-extrabold shadow-md">
              EG
            </div>
            <div>
              <h2 className="text-xs font-black text-white tracking-widest uppercase">EcoGuard-ML</h2>
              <span className="text-[9px] text-primary font-bold uppercase tracking-wider block mt-0.5">Tactical Command</span>
            </div>
          </div>

          {/* Nav list */}
          <nav className="p-4 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary/10 to-secondary/5 border-l-2 border-primary text-white font-bold shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-3 bg-slate-950/40">
          {/* Connection health indicator */}
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-bold uppercase">Telemetry server:</span>
            {apiHealth === 'healthy' ? (
              <span className="text-primary font-extrabold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary inline-block animate-pulse"></span>
                CONNECTED
              </span>
            ) : apiHealth === 'unhealthy' ? (
              <span className="text-danger font-extrabold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-danger inline-block"></span>
                OFFLINE
              </span>
            ) : (
              <span className="text-slate-400 font-extrabold flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                VERIFYING
              </span>
            )}
          </div>

          {/* Clock */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 border-t border-white/5 pt-2.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-mono">{currentTime.toLocaleTimeString()}</span>
            <span className="text-[9px] text-slate-500 font-semibold">{currentTime.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 z-10 overflow-hidden relative">
        {/* Top Navbar */}
        <header className="h-[64px] border-b border-white/5 px-6 flex items-center justify-between bg-slate-950/30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Serengeti Protection Domain</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="p-1.5 bg-slate-900/40 hover:bg-slate-800/40 border border-white/5 hover:border-slate-700/50 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Command Logs</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route View Content Box */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl flex items-start gap-3 text-xs">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-white">System Communication Failure</h4>
                <p className="mt-1 text-slate-300 leading-normal">{error}</p>
                <p className="mt-2 text-[10px] text-slate-400">Please make sure the backend uvicorn server is running locally on port 8001.</p>
              </div>
            </div>
          )}

          {loading && zones.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-[#0B1020]">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Hydrating Tactile Metrics Feed...</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
