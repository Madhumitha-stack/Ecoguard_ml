import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Zap, Route, ShieldAlert, Award, TrendingUp } from 'lucide-react';

const nodes = [
  { id: 'Outpost_Alpha', label: 'OUTPOST_A', x: 200, y: 320, isStation: true },
  { id: 'Outpost_Beta', label: 'OUTPOST_B', x: 50, y: 150, isStation: true },
  { id: 'Outpost_Gamma', label: 'OUTPOST_C', x: 380, y: 100, isStation: true },
  { id: 'ZONE_B02', label: 'ZONE_B02', x: 120, y: 80 },
  { id: 'ZONE_B01', label: 'ZONE_B01', x: 80, y: 220 },
  { id: 'ZONE_A01', label: 'ZONE_A01', x: 320, y: 240 },
  { id: 'ZONE_A02', label: 'ZONE_A02', x: 250, y: 160 },
  { id: 'ZONE_D02', label: 'ZONE_D02', x: 300, y: 60 }
];

const paths = [
  { from: 'Outpost_Alpha', to: 'ZONE_B01', color: 'rgba(13, 242, 254, 0.08)' },
  { from: 'Outpost_Alpha', to: 'ZONE_A01', color: 'rgba(13, 242, 254, 0.08)' },
  { from: 'Outpost_Beta', to: 'ZONE_B01', color: 'rgba(13, 242, 254, 0.08)' },
  { from: 'Outpost_Beta', to: 'ZONE_B02', color: 'rgba(13, 242, 254, 0.08)' },
  { from: 'Outpost_Gamma', to: 'ZONE_A02', color: 'rgba(13, 242, 254, 0.08)' },
  { from: 'Outpost_Gamma', to: 'ZONE_D02', color: 'rgba(13, 242, 254, 0.08)' },
  { from: 'ZONE_B01', to: 'ZONE_B02', color: 'rgba(13, 242, 254, 0.08)' },
  { from: 'ZONE_A01', to: 'ZONE_A02', color: 'rgba(13, 242, 254, 0.08)' },
  { from: 'ZONE_A02', to: 'ZONE_D02', color: 'rgba(13, 242, 254, 0.08)' }
];

const routingMap = {
  'ZONE_B02': ['Outpost_Beta', 'ZONE_B02'],
  'ZONE_B01': ['Outpost_Beta', 'ZONE_B01'],
  'ZONE_A01': ['Outpost_Alpha', 'ZONE_A01'],
  'ZONE_A02': ['Outpost_Gamma', 'ZONE_A02'],
  'ZONE_D02': ['Outpost_Gamma', 'ZONE_D02'],
  'ZONE_E01': ['Outpost_Alpha', 'ZONE_B01'],
  'ZONE_C01': ['Outpost_Alpha', 'ZONE_A01']
};

export default function PatrolOptimization({ patrols, selectedZone, onSelectZone }) {
  const [selectedPatrolIdx, setSelectedPatrolIdx] = useState(0);

  const selectedPatrol = patrols[selectedPatrolIdx] || null;
  const targetZoneId = selectedPatrol ? selectedPatrol.zone_id : '';
  const highlightedNodes = routingMap[targetZoneId] || [];

  return (
    <div className="space-y-6 font-share text-xs">
      
      {/* Title */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold tracking-wider text-white font-orbitron flex items-center gap-2">
          <Compass className="text-primary w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} /> PATROL_COST_ROUTING_NETWORK
        </h1>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Dijkstra & A* Pathfinder Systems // Terrain Resistance Modifiers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side List */}
        <div className="hud-panel rounded flex flex-col max-h-[600px] overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-950/20">
            <h3 className="text-xs font-bold text-white font-orbitron uppercase tracking-wider flex items-center gap-1.5">
              <Route className="text-primary w-4 h-4" /> OPTIMISED_CIRCUITS
            </h3>
            <span className="text-[9px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded border border-primary/30">DISPATCHED</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {patrols.map((patrol, i) => {
              const isActive = selectedPatrolIdx === i;
              const pStyle = patrol.patrol_priority === 'High' ? 'text-danger border-danger/35 bg-danger/10' : patrol.patrol_priority === 'Medium' ? 'text-warning border-warning/35 bg-warning/10' : 'text-primary border-primary/35 bg-primary/10';
              return (
                <div
                  key={i}
                  onClick={() => setSelectedPatrolIdx(i)}
                  className={`p-3.5 rounded border cursor-pointer transition-all duration-300 flex flex-col gap-2 ${
                    isActive 
                      ? 'bg-secondary/10 border-secondary/40 text-white shadow-[0_0_12px_rgba(6,182,212,0.05)]' 
                      : 'bg-slate-900/10 border-white/5 hover:bg-slate-900/40 hover:border-cyan-500/20'
                  }`}
                >
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-xs font-bold text-white font-share">{patrol.zone_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] border font-bold ${pStyle}`}>{patrol.patrol_priority.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>DIST: {patrol.route_distance.toFixed(1)} km</span>
                    <span>TIME: {patrol.estimated_travel_time.toFixed(1)} hrs</span>
                    <span className="text-secondary font-bold">COV: {patrol.coverage_score.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Canvas SVG Map */}
        <div className="hud-panel p-5 rounded flex flex-col items-center justify-center lg:col-span-2 min-h-[450px]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 self-start flex items-center gap-1.5 font-orbitron">
            <Zap className="text-warning w-4 h-4" /> PATROL_CIRCUIT_DASHBOARD_RADAR
          </h3>

          <div className="w-full max-w-[500px] aspect-[4/3] bg-slate-950 border border-white/5 rounded relative overflow-hidden bg-grid">
            <svg width="100%" height="100%" viewBox="0 0 450 350" className="p-4">
              <defs>
                <style>
                  {`
                    .animated-dash {
                      stroke-dasharray: 6, 6;
                      animation: dash 25s linear infinite;
                    }
                    @keyframes dash {
                      to {
                        stroke-dashoffset: -1000;
                      }
                    }
                  `}
                </style>
              </defs>

              {/* Paths */}
              {paths.map((p, i) => {
                const nodeFrom = nodes.find(n => n.id === p.from);
                const nodeTo = nodes.find(n => n.id === p.to);
                if (!nodeFrom || !nodeTo) return null;

                const isPathActive = highlightedNodes.includes(p.from) && highlightedNodes.includes(p.to);
                const stroke = isPathActive ? '#06B6D4' : p.color;
                const width = isPathActive ? 2 : 0.8;

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
                        strokeWidth={2}
                        className="animated-dash animate-pulse"
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((n, i) => {
                const isSelected = highlightedNodes.includes(n.id);
                const fill = n.isStation ? '#0C0F24' : isSelected ? '#00f0ff' : '#1A213D';
                const stroke = n.isStation ? '#4F46E5' : isSelected ? '#ffffff' : 'rgba(255,255,255,0.15)';
                const radius = n.isStation ? 8 : 5;

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
                        stroke="#00f0ff" 
                        strokeWidth={1}
                        className="animate-ping"
                      />
                    )}
                    <text 
                      x={n.x} 
                      y={n.y - 12} 
                      fill={isSelected ? '#ffffff' : '#94a3b8'} 
                      fontSize="8" 
                      textAnchor="middle"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="font-share tracking-wider"
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Cost Footer details */}
          {selectedPatrol && (
            <div className="w-full mt-5 border-t border-white/5 pt-4 grid grid-cols-3 gap-4 text-[10px] text-slate-400">
              <div>
                <span className="text-[9px] text-slate-500 block uppercase font-bold">TERRAIN_COST_WEIGHTS</span>
                <span className="font-bold text-white mt-1 block font-mono">Elevation Slope Weight active</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase font-bold">ROUTE_SOLVER</span>
                <span className="font-bold text-white mt-1 block flex items-center gap-1 font-mono">
                  A* Heuristic <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 block uppercase font-bold">RECOMMENDED_DISPATCH</span>
                <span className="font-bold text-white mt-1 block font-mono">4-Unit Ranger Squad</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
