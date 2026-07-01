import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Compass, BarChart, Info, ShieldAlert, Crosshair } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createDotIcon = (color) => L.divIcon({
  html: `<span class="flex h-3.5 w-3.5 relative">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: ${color}"></span>
    <span class="relative inline-flex rounded-full h-3.5 w-3.5 border border-white/20" style="background-color: ${color}"></span>
  </span>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

function MapCenterController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function RiskHeatmap({ hotspots, zones, selectedZone, onSelectZone, patrols, forecasts }) {
  const [mapCenter, setMapCenter] = useState([-2.1, 34.9]);
  
  useEffect(() => {
    if (selectedZone) {
      const zoneHotspots = hotspots.filter(h => h.zone_id === selectedZone.zone_id);
      if (zoneHotspots.length > 0) {
        setMapCenter([zoneHotspots[0].latitude, zoneHotspots[0].longitude]);
      }
    }
  }, [selectedZone, hotspots]);

  const activePatrol = selectedZone ? patrols.find(p => p.zone_id === selectedZone.zone_id) : null;
  const activeForecast = selectedZone ? forecasts.find(f => f.zone === selectedZone.zone_id) : null;

  return (
    <div className="h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-4 gap-6 relative font-sans">
      
      {/* 1. Spatial Filters Sidebar Panel */}
      <div className="hud-panel p-5 rounded flex flex-col justify-between lg:col-span-1 overflow-y-auto">
        <div className="space-y-5">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold font-orbitron uppercase tracking-widest flex items-center gap-1.5 text-white">
              <Layers className="text-secondary w-4 h-4" /> SPATIAL_SECTOR_GRID
            </h3>
            <p className="text-[9px] font-share text-slate-500 mt-1">Select ranger zones to evaluate threat overlays.</p>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {zones.map((zone, i) => {
              const isSelected = selectedZone && selectedZone.zone_id === zone.zone_id;
              const rStyle = zone.average_risk_score >= 0.15 ? 'text-danger font-bold' : 'text-slate-400';
              return (
                <div 
                  key={i}
                  onClick={() => onSelectZone(zone)}
                  className={`p-2.5 rounded border text-[11px] font-share cursor-pointer transition-all duration-200 flex justify-between items-center ${
                    isSelected 
                      ? 'bg-secondary/10 border-secondary/40 text-white font-bold' 
                      : 'bg-slate-900/10 border-white/5 hover:bg-slate-900/40 hover:border-cyan-500/20'
                  }`}
                >
                  <span>{zone.zone_id}</span>
                  <span className={`${rStyle} font-mono`}>{zone.average_risk_score.toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-white/5 space-y-2 text-[9px] font-share text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger border border-white/20 animate-pulse"></span>
            <span>CLUSTERING THREAT HOTSPOT</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-warning border border-white/20"></span>
            <span>HIGH RISK ZONING BOUNDARIES</span>
          </div>
        </div>
      </div>

      {/* 2. Map Panel */}
      <div className="lg:col-span-3 rounded overflow-hidden relative border border-white/10 dark-map">
        <MapContainer center={mapCenter} zoom={9.5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <MapCenterController center={mapCenter} />

          {/* Hotspots */}
          {hotspots.map((hs, i) => (
            <Marker 
              key={i} 
              position={[hs.latitude, hs.longitude]} 
              icon={createDotIcon('#EF4444')}
            >
              <Popup>
                <div className="text-[10px] text-slate-900 font-mono p-1">
                  <h4 className="font-bold border-b pb-1 mb-1 text-slate-950 font-orbitron">{hs.zone_id}</h4>
                  <p>LAT/LON: <strong>{hs.latitude.toFixed(4)}, {hs.longitude.toFixed(4)}</strong></p>
                  <p>ACOUSTIC_INDEX: <strong>{hs.acoustic_risk.toFixed(2)}</strong></p>
                  <p>ANIMAL_DENSITY: <strong>{hs.animal_density_score}</strong></p>
                  <p>CLUSTER_ID: <strong>{hs.cluster_label}</strong></p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Zones */}
          {zones.map((zone, i) => {
            const matches = hotspots.filter(h => h.zone_id === zone.zone_id);
            if (matches.length === 0) return null;
            const center = [matches[0].latitude, matches[0].longitude];
            
            const radius = 2500 + (zone.average_risk_score * 8000); 
            const isSelected = selectedZone && selectedZone.zone_id === zone.zone_id;
            const strokeColor = zone.average_risk_score >= 0.15 ? '#EF4444' : '#F59E0B';
            
            return (
              <Circle
                key={i}
                center={center}
                radius={radius}
                pathOptions={{ 
                  color: isSelected ? '#06B6D4' : strokeColor,
                  fillColor: isSelected ? '#06B6D4' : strokeColor,
                  fillOpacity: isSelected ? 0.25 : 0.05,
                  weight: isSelected ? 3 : 1
                }}
                eventHandlers={{
                  click: () => onSelectZone(zone)
                }}
              />
            );
          })}
        </MapContainer>

        {/* HUD grid coordinate ticks on map layout corners */}
        <div className="absolute top-3 left-3 z-[1000] pointer-events-none font-share text-[8px] text-cyan-400 bg-slate-950/80 px-2 py-1 border border-cyan-400/20 rounded">
          SYSTEM_GRID: SEC_GRID_1
        </div>
      </div>

      {/* 3. Floating Detail Panel overlay */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-4 right-4 z-[1000] w-[350px] hud-panel p-5 rounded flex flex-col justify-between max-h-[90%] overflow-y-auto font-share"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white font-orbitron flex items-center gap-1.5">
                    <Crosshair className="text-danger w-4 h-4 animate-spin" /> TARGET: {selectedZone.zone_id}
                  </h3>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-1 block">DIAGNOSTICS_SUMMARY</span>
                </div>
                <button 
                  onClick={() => onSelectZone(null)}
                  className="text-slate-400 hover:text-white font-mono text-xs px-1.5 py-0.5 rounded hover:bg-white/5 cursor-pointer"
                >
                  [✕]
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-slate-950 border border-white/5 p-3 rounded">
                  <span className="text-[8px] text-slate-500 block uppercase font-bold">THREAT_RATING</span>
                  <span className="text-lg font-bold text-danger font-orbitron glow-text-danger">{selectedZone.average_risk_score.toFixed(4)}</span>
                </div>
                <div className="bg-slate-950 border border-white/5 p-3 rounded">
                  <span className="text-[8px] text-slate-500 block uppercase font-bold">HIST_INCIDENTS</span>
                  <span className="text-lg font-bold text-white font-orbitron">{selectedZone.incident_count}</span>
                </div>
              </div>

              {/* Lists */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-secondary" /> PATROL_COST_ROUTING
                  </h4>
                  {activePatrol ? (
                    <div className="text-[11px] bg-slate-950 border border-white/5 p-2.5 rounded space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>PRIORITY: {activePatrol.patrol_priority.toUpperCase()}</span>
                        <span className="text-primary">COVERAGE: {activePatrol.coverage_score.toFixed(0)}%</span>
                      </div>
                      <p className="text-[9px] text-slate-500">TRAVEL_TIME: {activePatrol.estimated_travel_time.toFixed(1)} hours // ROUTE_DIST: {activePatrol.route_distance.toFixed(1)} km</p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 italic">No optimized routing plan currently dispatched.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                    <BarChart className="w-3.5 h-3.5 text-secondary" /> TEMPORAL_FORECAST
                  </h4>
                  {activeForecast ? (
                    <div className="text-[11px] bg-slate-950 border border-white/5 p-2.5 rounded space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>FORECAST_RISK: {activeForecast.predicted_risk.toFixed(3)}</span>
                        <span className="text-cyan-400">{activeForecast.resource_priority.toUpperCase()} PRIORITY</span>
                      </div>
                      <p className="text-[9px] text-slate-500">FREQ_RECS: {activeForecast.patrol_frequency}</p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 italic">No forecasted trends mapped for this sector.</p>
                  )}
                </div>

                <div className="text-[10px] bg-slate-950 p-3 rounded border border-white/5 flex gap-2 leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                  <p className="text-slate-400">
                    Average acoustic risk index in this sector is <strong className="text-white">{selectedZone.average_acoustic_threat.toFixed(3)}</strong>, indicating active auditory scanning node reports.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
