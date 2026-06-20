import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Map as MapIcon, Layers, Compass, BarChart, Info, ShieldAlert } from 'lucide-react';

// Reset leaflet icon config to prevent missing image path errors
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom dot marker icon generator
const createDotIcon = (color) => L.divIcon({
  html: `<span class="flex h-3 w-3 relative">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background-color: ${color}"></span>
    <span class="relative inline-flex rounded-full h-3 w-3 border border-white" style="background-color: ${color}"></span>
  </span>`,
  className: '',
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

// Component to dynamically adjust map center when a zone is selected
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
      // Find coordinates of zones (average coordinate of its hotspots or approximate center)
      const zoneHotspots = hotspots.filter(h => h.zone_id === selectedZone.zone_id);
      if (zoneHotspots.length > 0) {
        setMapCenter([zoneHotspots[0].latitude, zoneHotspots[0].longitude]);
      }
    }
  }, [selectedZone, hotspots]);

  // Find related zone metrics
  const activePatrol = selectedZone ? patrols.find(p => p.zone_id === selectedZone.zone_id) : null;
  const activeForecast = selectedZone ? forecasts.find(f => f.zone === selectedZone.zone_id) : null;

  return (
    <div className="h-[calc(100vh-140px)] grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
      {/* Sidebar Control panel */}
      <div className="glass-card p-5 rounded-xl flex flex-col justify-between lg:col-span-1 overflow-y-auto">
        <div className="space-y-5">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-white">
              <Layers className="text-secondary w-4 h-4" /> Spatial Filters
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Select ranger zones to evaluate threat overlays.</p>
          </div>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {zones.map((zone, i) => {
              const isSelected = selectedZone && selectedZone.zone_id === zone.zone_id;
              const rStyle = zone.average_risk_score >= 0.15 ? 'text-danger font-extrabold' : 'text-slate-300';
              return (
                <div 
                  key={i}
                  onClick={() => onSelectZone(zone)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all duration-200 flex justify-between items-center ${isSelected ? 'bg-secondary/15 border-secondary/40 text-white' : 'bg-slate-900/30 border-white/5 hover:bg-slate-800/40 hover:border-slate-700/50'}`}
                >
                  <span className="font-semibold">{zone.zone_id}</span>
                  <span className={rStyle}>{zone.average_risk_score.toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-danger border border-white/10"></span>
            <span>DBSCAN Clustered Hotspot</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-warning border border-white/10"></span>
            <span>High Risk Zone Boundaries</span>
          </div>
        </div>
      </div>

      {/* Map Content Panel */}
      <div className="lg:col-span-3 rounded-xl overflow-hidden relative border border-white/5 dark-map">
        <MapContainer center={mapCenter} zoom={9.5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <MapCenterController center={mapCenter} />

          {/* Plotting Hotspots */}
          {hotspots.map((hs, i) => (
            <Marker 
              key={i} 
              position={[hs.latitude, hs.longitude]} 
              icon={createDotIcon('#EF4444')}
            >
              <Popup>
                <div className="text-xs text-slate-900 font-sans p-1">
                  <h4 className="font-bold border-b pb-1 mb-1">{hs.zone_id}</h4>
                  <p>Acoustic Risk: <strong>{hs.acoustic_risk}</strong></p>
                  <p>Animal Density: <strong>{hs.animal_density_score}</strong></p>
                  <p>Cluster Label: <strong>{hs.cluster_label}</strong></p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Plotting Zone Circles as visual boundaries */}
          {zones.map((zone, i) => {
            // Find coordinate representation for the circle center (using first matching hotspot center)
            const matches = hotspots.filter(h => h.zone_id === zone.zone_id);
            if (matches.length === 0) return null;
            const center = [matches[0].latitude, matches[0].longitude];
            
            // Adjust radius based on risk score
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
                  fillOpacity: isSelected ? 0.25 : 0.08,
                  weight: isSelected ? 3 : 1
                }}
                eventHandlers={{
                  click: () => onSelectZone(zone)
                }}
              />
            );
          })}
        </MapContainer>
      </div>

      {/* Floating Right Detail Panel */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-4 right-4 z-[1000] w-[350px] glass-panel p-5 rounded-xl flex flex-col justify-between max-h-[90%] overflow-y-auto"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <ShieldAlert className="text-secondary w-4 h-4" /> {selectedZone.zone_id}
                  </h3>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 block">Threat Summary</span>
                </div>
                <button 
                  onClick={() => onSelectZone(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded hover:bg-white/5"
                >
                  ✕
                </button>
              </div>

              {/* Stat Block */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/40 border border-white/5 p-3 rounded-lg">
                  <span className="text-[9px] text-slate-400 block uppercase font-semibold">Risk Score</span>
                  <span className="text-lg font-bold text-white">{selectedZone.average_risk_score.toFixed(4)}</span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 p-3 rounded-lg">
                  <span className="text-[9px] text-slate-400 block uppercase font-semibold">Incidents Count</span>
                  <span className="text-lg font-bold text-white">{selectedZone.incident_count}</span>
                </div>
              </div>

              {/* Related Info */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-secondary" /> Patrol Status
                  </h4>
                  {activePatrol ? (
                    <div className="text-xs bg-slate-900/30 p-2.5 rounded border border-white/5">
                      <div className="flex justify-between font-semibold">
                        <span>Priority: {activePatrol.patrol_priority}</span>
                        <span>Coverage: {activePatrol.coverage_score.toFixed(1)}%</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Est. Time: {activePatrol.estimated_travel_time.toFixed(1)} hrs ({activePatrol.route_distance.toFixed(1)} km)</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No optimized routing plan currently dispatched.</p>
                  )}
                </div>

                <div>
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                    <BarChart className="w-3 h-3 text-secondary" /> 30-Day Forecast
                  </h4>
                  {activeForecast ? (
                    <div className="text-xs bg-slate-900/30 p-2.5 rounded border border-white/5 space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>Predicted Risk: {activeForecast.predicted_risk.toFixed(4)}</span>
                        <span className="text-primary">{activeForecast.resource_priority} Priority</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Frequency: {activeForecast.patrol_frequency}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No forecasted trends mapped for this sector.</p>
                  )}
                </div>

                <div className="text-[11px] bg-slate-950/40 p-3 rounded-lg border border-white/5 flex gap-2">
                  <Info className="w-4 h-4 text-secondary shrink-0" />
                  <p className="text-slate-300 leading-relaxed">
                    Average acoustic threat score in this sector is <strong>{selectedZone.average_acoustic_threat.toFixed(3)}</strong> based on H1/H2 historical warnings.
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
