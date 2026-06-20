import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export function useCommandCenterData() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Intelligence Data
  const [zones, setZones] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [patrols, setPatrols] = useState([]);
  const [forecasts, setForecasts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Selection states
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  
  // Server stats & loading
  const [loading, setLoading] = useState(true);
  const [apiHealth, setApiHealth] = useState('checking'); // 'healthy', 'unhealthy', 'checking'
  const [error, setError] = useState(null);

  // Consolidated load function
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Connection check
      const healthRes = await api.getHealth();
      if (healthRes && healthRes.status === 'healthy') {
        setApiHealth('healthy');
      } else {
        setApiHealth('unhealthy');
      }

      // 2. Fetch parallel streams
      const [zonesRes, hotspotsRes, patrolsRes, forecastsRes, alertsRes] = await Promise.all([
        api.getHighRiskZones().catch(e => { console.error("High risk zones load fail:", e); return []; }),
        api.getHotspots().catch(e => { console.error("Hotspots load fail:", e); return []; }),
        api.getPatrols().catch(e => { console.error("Patrols load fail:", e); return []; }),
        api.getForecast().catch(e => { console.error("Forecast load fail:", e); return []; }),
        api.getAlerts().catch(e => { console.error("Alerts load fail:", e); return []; })
      ]);

      setZones(zonesRes);
      setHotspots(hotspotsRes);
      setPatrols(patrolsRes);
      setForecasts(forecastsRes);
      setAlerts(alertsRes);

    } catch (err) {
      console.error("Telemetry pipeline connection failure:", err);
      setApiHealth('unhealthy');
      setError("Unable to contact the EcoGuard-ML API server on port 8001. Please make sure the service is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on initial mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Telemetry Autopolling - Fetch warning alerts & server health every 15 seconds to simulate real-time operations
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const healthRes = await api.getHealth();
        setApiHealth(healthRes && healthRes.status === 'healthy' ? 'healthy' : 'unhealthy');

        const alertsRes = await api.getAlerts();
        setAlerts(alertsRes);
      } catch (_) {
        setApiHealth('unhealthy');
      }
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  return {
    activeTab,
    setActiveTab,
    zones,
    hotspots,
    patrols,
    forecasts,
    alerts,
    selectedZone,
    setSelectedZone,
    selectedAlert,
    setSelectedAlert,
    loading,
    apiHealth,
    error,
    refreshData
  };
}
