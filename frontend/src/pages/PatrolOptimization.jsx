import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Zap, Route, ShieldAlert, Award, TrendingUp } from 'lucide-react';

// Coordinates for visual network map layout
const nodes = [
  { id: 'Outpost_Alpha', label: 'Outpost Alpha', x: 200, y: 320, isStation: true },
  { id: 'Outpost_Beta', label: 'Outpost Beta', x: 50, y: 150, isStation: true },
  { id: 'Outpost_Gamma', label: 'Outpost Gamma', x: 380, y: 100, isStation: true },
  { id: 'ZONE_B02', label: 'ZONE B02', x: 120, y: 80 },
  { id: 'ZONE_B01', label: 'ZONE B01', x: 80, y: 220 },
  { id: 'ZONE_A01', label: 'ZONE A01', x: 320, y: 240 },
  { id: 'ZONE_A02', label: 'ZONE A02', x: 250, y: 160 },
  { id: 'ZONE_D02', label: 'ZONE D02', x: 300, y: 60 }
];

const paths = [
  { from: 'Outpost_Alpha', to: 'ZONE_B01', color: 'rgba(255,255,255,0.08)' },
  { from: 'Outpost_Alpha', to: 'ZONE_A01', color: 'rgba(255,255,255,0.08)' },
  { from: 'Outpost_Beta', to: 'ZONE_B01', color: 'rgba(255,255,255,0.08)' },
  { from: 'Outpost_Beta', to: 'ZONE_B02', color: 'rgba(255,255,255,0.08)' },
  { from: 'Outpost_Gamma', to: 'ZONE_A02', color: 'rgba(255,255,255,0.08)' },
  { from: 'Outpost_Gamma', to: 'ZONE_D02', color: 'rgba(255,255,255,0.08)' },
  { from: 'ZONE_B01', to: 'ZONE_B02', color: 'rgba(255,255,255,0.08)' },
  { from: 'ZONE_A01', to: 'ZONE_A02', color: 'rgba(255,255,255,0.08)' },
  { from: 'ZONE_A02', to: 'ZONE_D02', color: 'rgba(255,255,255,0.08)' }
];

// Mapping zones to stations for highlighting paths
const routingMap = {
  'ZONE_B02': ['Outpost_Beta', 'ZONE_B02'],
  'ZONE_B01': ['Outpost_Beta', 'ZONE_B01'],
  'ZONE_A01': ['Outpost_Alpha', 'ZONE_A01'],
  'ZONE_A02': ['Outpost_Gamma', 'ZONE_A02'],
  'ZONE_D02': ['Outpost_Gamma', 'ZONE_D02'],
  'ZONE_E01': ['Outpost_Alpha', 'ZONE_B01'], // mock fallback mapping
  'ZONE_C01': ['Outpost_Alpha', 'ZONE_A01']
};

export default function PatrolOptimization({ patrols, selectedZone, onSelectZone }) {
  const [selectedPatrolIdx, setSelectedPatrolIdx] = useState(0);

  const selectedPatrol = patrols[selectedPatrolIdx] || null;
  const targetZoneId = selectedPatrol ? selectedPatrol.zone_id : '';

  // Get active path highlights
  const highlightedNodes = routingMap[targetZoneId] || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Compass className="text-primary w-6 h-6" /> Patrol Route Optimization Engine
        </h1>
        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">Terrain Cost-Routing Network (Dijkstra vs A* Algorithms)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Routes List */}
        <div className="glass-card rounded-xl flex flex-col max-h-[600px] overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/30">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Route className="text-primary w-4 h-4" /> Optimised Circuits
            </h3>
            <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded">Active</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {patrols.map((patrol, i) => {
              const isActive = selectedPatrolIdx === i;
              const pStyle = patrol.patrol_priority === 'High' ? 'badge-danger' : patrol.patrol_priority === 'Medium' ? 'badge-warning' : 'badge-success';
              return (
                <div
                  key={i}
                  onClick={() => setSelectedPatrolIdx(i)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all duration-300 flex flex-col gap-2 ${isActive ? 'bg-primary/10 border-primary/40' : 'bg-slate-900/30 border-white/5 hover:bg-slate-800/40 hover:border-slate-700/50'}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{patrol.zone_id}</span>
                    <span className={`badge text-[9px] font-bold ${pStyle}`}>{patrol.patrol_priority}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Dist: {patrol.route_distance.toFixed(1)} km</span>
                    <span>Time: {patrol.estimated_travel_time.toFixed(1)} hrs</span>
                    <span className="text-primary font-semibold">Cov: {patrol.coverage_score.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Area: Animated SVG Map */}
        <div className="glass-card p-5 rounded-xl flex flex-col items-center justify-center lg:col-span-2 min-h-[450px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 self-start flex items-center gap-1.5">
            <Zap className="text-warning w-4 h-4" /> Live Patrol Network Overlay
          </h3>

          <div className="w-full max-w-[500px] aspect-[4/3] bg-slate-950/40 border border-white/5 rounded-xl relative overflow-hidden bg-grid">
            <svg width="100%" height="100%" viewBox="0 0 450 350" className="p-4">
              <defs>
                <style>
                  {`
                    .animated-dash {
                      stroke-dasharray: 8, 8;
                      animation: dash 30s linear infinite;
                    }
                    @keyframes dash {
                      to {
                        stroke-dashoffset: -1000;
                      }
                    }
                  `}
                </style>
              </defs>

              {/* Render paths */}
              {paths.map((p, i) => {
                const nodeFrom = nodes.find(n => n.id === p.from);
                const nodeTo = nodes.find(n => n.id === p.to);
                if (!nodeFrom || !nodeTo) return null;

                const isPathActive = highlightedNodes.includes(p.from) && highlightedNodes.includes(p.to);
                const stroke = isPathActive ? '#10B981' : p.color;
                const width = isPathActive ? 2.5 : 1;

                return (
                  <g key={i}>
                    <line 
                      x1={nodeFrom.x} 
                      y1={nodeFrom.y} 
                      x2={nodeTo.x} 
                      y2={nodeTo.y} 
                      stroke={stroke} 
                      strokeWidth={width}
                    />
                    {isPathActive && (
                      <line 
                        x1={nodeFrom.x} 
                        y1={nodeFrom.y} 
                        x2={nodeTo.x} 
                        y2={nodeTo.y} 
                        stroke="#06B6D4" 
                        strokeWidth={2.5}
                        className="animated-dash"
                      />
                    )}
                  </g>
                );
              })}

              {/* Render Nodes */}
              {nodes.map((n, i) => {
                const isSelected = highlightedNodes.includes(n.id);
                const fill = n.isStation ? '#1E1B4B' : isSelected ? '#10B981' : '#1E293B';
                const stroke = n.isStation ? '#6366f1' : isSelected ? '#06B6D4' : 'rgba(255,255,255,0.15)';
                const radius = n.isStation ? 9 : 6;

                return (
                  <g key={i} className="cursor-pointer">
                    <circle 
                      cx={n.x} 
                      cy={n.y} 
                      r={radius} 
                      fill={fill} 
                      stroke={stroke} 
                      strokeWidth={1.5}
                    />
                    {isSelected && (
                      <circle 
                        cx={n.x} 
                        cy={n.y} 
                        r={radius + 4} 
                        fill="none" 
                        stroke="#06B6D4" 
                        strokeWidth={1}
                        className="animate-ping"
                      />
                    )}
                    <text 
                      x={n.x} 
                      y={n.y - 12} 
                      fill={isSelected ? '#ffffff' : '#94a3b8'} 
                      fontSize="9" 
                      textAnchor="middle"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="font-sans"
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Details footer */}
          {selectedPatrol && (
            <div className="w-full mt-5 border-t border-white/5 pt-4 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Terrain Cost Model</span>
                <span className="font-semibold text-white mt-1 block">Elevation Slope Cost</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Pathfinder</span>
                <span className="font-semibold text-white mt-1 block flex items-center gap-1">
                  A* Heuristic <Zap className="w-3.5 h-3.5 text-cyan-400 inline" />
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Recommended Team</span>
                <span className="font-semibold text-white mt-1 block">Ranger Squad (4 units)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
