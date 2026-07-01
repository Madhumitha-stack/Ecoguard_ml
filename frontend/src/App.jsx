import React from 'react';
import { useCommandCenterData } from './hooks/useCommandCenterData';
import CommandCenterLayout from './layouts/CommandCenterLayout';
import Overview from './pages/Overview';
import RiskHeatmap from './pages/RiskHeatmap';
import PatrolOptimization from './pages/PatrolOptimization';
import ThreatForecasting from './pages/ThreatForecasting';
import ExplainableAI from './pages/ExplainableAI';
import EarlyWarning from './pages/EarlyWarning';
import SystemMonitoring from './pages/SystemMonitoring';

export default function App() {
  const {
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
  } = useCommandCenterData();

  const handleSelectZone = (zone) => {
    setSelectedZone(zone);
    setActiveTab('heatmap');
  };

  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
    setActiveTab('alerts');
  };

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
            loading={loading}
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
            onRefresh={refreshData}
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
            onRefresh={refreshData}
          />
        );
      case 'system':
        return <SystemMonitoring />;
      default:
        return <div className="text-white text-xs">Page Not Found</div>;
    }
  };

  return (
    <CommandCenterLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      apiHealth={apiHealth}
      loading={loading}
      error={error}
      refreshData={refreshData}
    >
      {renderTabContent()}
    </CommandCenterLayout>
  );
}
