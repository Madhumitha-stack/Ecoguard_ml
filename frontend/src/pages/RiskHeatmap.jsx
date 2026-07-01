import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Compass, BarChart, Info, Crosshair, Target, AlertTriangle } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createDotIcon = (color) => L.divIcon({
  html: `<span class="flex h-4.5 w-4.5 relative">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: ${color}"></span>
    <span class="relative inline-flex rounded-full h-4.5 w-4.5 border border-white/30" style="background-color: ${color}"></span>
  </span>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9]
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
    <div className="h-[calc(100vh-148px)] grid grid-cols-1 lg:grid-cols-4 gap-6 relative font-sans">
      
      {/* 1. Spatial Filters Sidebar Panel */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between lg:col-span-1 overflow-y-auto border border-emerald-900/20">
        <div className="space-y-5">
          <div className="border-b border-emerald-950/15 pb-3">
            <h3 className="text-xs font-black font-orbitron uppercase tracking-widest flex items-center gap-1.5 text-white">
              <Layers className="text-emerald-400 w-4 h-4" /> RESERVE GRID ZONES
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Select a management sector to view real-time intelligence feeds.</p>
          </div>

          <div className="space-y-2 max-h-[350px] lg:max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
            {zones.map((zone, i) => {
              const isSelected = selectedZone && selectedZone.zone_id === zone.zone_id;
              const isHighRisk = zone.average_risk_score >= 0.15;
              const rStyle = isHighRisk ? 'text-red-400 font-extrabold' : 'text-slate-400';
              return (
                <div 
                  key={i}
                  onClick={() => onSelectZone(zone)}
                  className={`p-3 rounded-xl border text-[11px] font-mono cursor-pointer transition-all duration-200 flex justify-between items-center ${
                    isSelected 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                      : 'bg-emerald-950/10 border-emerald-950/15 hover:bg-emerald-950/20 hover:border-emerald-700/20'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isHighRisk && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                    {zone.zone_id}
                  </span>
                  <span className={`${rStyle}`}>{zone.average_risk_score.toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-emerald-950/15 space-y-2 text-[10px] text-slate-400 font-semibold">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 border border-white/20 animate-pulse shadow-[0_0_8px_#ef4444]"></span>
            <span>ACTIVE INCIDENT DETECTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500 border border-white/20 shadow-[0_0_8px_#f59e0b]"></span>
            <span>ELEVATED THREAT ZONE</span>
          </div>
        </div>
      </div>

      {/* 2. Map Panel */}
      <div className="lg:col-span-3 rounded-2xl overflow-hidden relative border border-emerald-900/20 dark-map shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        <MapContainer center={mapCenter} zoom={9.5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
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
                <div className="text-[10px] text-slate-100 font-mono p-1">
                  <h4 className="font-extrabold border-b border-emerald-950/15 pb-1 mb-1 text-emerald-400 font-orbitron">{hs.zone_id}</h4>
                  <p className="mt-0.5">COORD: <strong>{hs.latitude.toFixed(4)}, {hs.longitude.toFixed(4)}</strong></p>
                  <p className="mt-0.5">ACOUSTIC RISK: <strong className="text-red-400">{hs.acoustic_risk.toFixed(2)}</strong></p>
                  <p className="mt-0.5">ANIMAL DENSITY: <strong>{hs.animal_density_score}</strong></p>
                  <p className="mt-0.5">CLUSTER LABEL: <strong>{hs.cluster_label}</strong></p>
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
                  color: isSelected ? '#10B981' : strokeColor,
                  fillColor: isSelected ? '#10B981' : strokeColor,
                  fillOpacity: isSelected ? 0.3 : 0.08,
                  weight: isSelected ? 3.5 : 1.5
                }}
                eventHandlers={{
                  click: () => onSelectZone(zone)
                }}
              />
            );
          })}
        </MapContainer>

        {/* HUD grid coordinate ticks on map layout corners */}
        <div className="absolute top-3 left-3 z-[1000] pointer-events-none font-mono text-[9px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/30 px-3 py-1.5 rounded-xl shadow-lg">
          SECTOR TELEMETRY RADAR: ACTIVE
        </div>
      </div>

      {/* 3. Floating Detail Panel overlay */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-4 right-4 z-[1000] w-[360px] glass-panel p-5 rounded-2xl flex flex-col justify-between max-h-[90%] overflow-y-auto border border-emerald-800/30 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-emerald-950/15 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white font-orbitron flex items-center gap-1.5">
                    <Crosshair className="text-red-400 w-4 h-4 animate-spin-slow" /> SECTOR: {selectedZone.zone_id}
                  </h3>
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mt-1 block">Diagnostics Intelligence Summary</span>
                </div>
                <button 
                  onClick={() => onSelectZone(null)}
                  className="text-slate-400 hover:text-white font-bold font-mono text-xs px-2 py-0.5 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  [✕]
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#05130f]/60 border border-emerald-950/20 p-3 rounded-xl">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wide">Threat Rating</span>
                  <span className="text-xl font-black text-red-400 font-orbitron mt-1 block">{selectedZone.average_risk_score.toFixed(4)}</span>
                </div>
                <div className="bg-[#05130f]/60 border border-emerald-950/20 p-3 rounded-xl">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wide">Hist. Incidents</span>
                  <span className="text-xl font-black text-white font-orbitron mt-1 block">{selectedZone.incident_count}</span>
                </div>
              </div>

              {/* Lists */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-[10px] font-extrabold uppercase text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" /> OPTIMIZED PATROL ROUTING
                  </h4>
                  {activePatrol ? (
                    <div className="text-[11px] bg-emerald-950/20 border border-emerald-950/15 p-3 rounded-xl space-y-1.5">
                      <div className="flex justify-between font-bold">
                        <span>PRIORITY: <span className="text-emerald-400">{activePatrol.patrol_priority.toUpperCase()}</span></span>
                        <span className="text-lime-400">COVERAGE: {activePatrol.coverage_score.toFixed(0)}%</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-normal">
                        EST. WALK TIME: {activePatrol.estimated_travel_time.toFixed(1)} hours  |  ROUTE DIST: {activePatrol.route_distance.toFixed(1)} km
                      </p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 italic">No optimized routing plan currently dispatched.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-[10px] font-extrabold uppercase text-slate-300 tracking-wider mb-2 flex items-center gap-1.5">
                    <BarChart className="w-4 h-4 text-emerald-400" /> TEMPORAL FORECAST TRENDS
                  </h4>
                  {activeForecast ? (
                    <div className="text-[11px] bg-emerald-950/20 border border-emerald-950/15 p-3 rounded-xl space-y-1.5">
                      <div className="flex justify-between font-bold">
                        <span>FORECAST RISK: {activeForecast.predicted_risk.toFixed(3)}</span>
                        <span className="text-cyan-400">{activeForecast.resource_priority.toUpperCase()} PRIORITY</span>
                      </div>
                      <p className="text-[9px] text-slate-400">FREQ RECS: {activeForecast.patrol_frequency}</p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 italic">No forecasted trends mapped for this sector.</p>
                  )}
                </div>

                <div className="text-[11px] bg-[#05130f]/60 p-3 rounded-xl border border-emerald-950/20 flex gap-2.5 leading-relaxed">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-slate-350">
                    Acoustic telemetry flags an anomaly index of <strong className="text-white">{selectedZone.average_acoustic_threat.toFixed(3)}</strong>, recommending patrols near road corridors.
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
