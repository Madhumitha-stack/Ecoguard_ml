import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Zap, Route, ShieldAlert, Award, Target, Flame, Hourglass } from 'lucide-react';

const nodes = [
  { id: 'Outpost_Alpha', label: 'OUTPOST A', x: 200, y: 320, isStation: true },
  { id: 'Outpost_Beta', label: 'OUTPOST B', x: 50, y: 150, isStation: true },
  { id: 'Outpost_Gamma', label: 'OUTPOST C', x: 380, y: 100, isStation: true },
  { id: 'ZONE_B02', label: 'ZONE B02', x: 120, y: 80 },
  { id: 'ZONE_B01', label: 'ZONE B01', x: 80, y: 220 },
  { id: 'ZONE_A01', label: 'ZONE A01', x: 320, y: 240 },
  { id: 'ZONE_A02', label: 'ZONE A02', x: 250, y: 160 },
  { id: 'ZONE_D02', label: 'ZONE D02', x: 300, y: 60 }
];

const paths = [
  { from: 'Outpost_Alpha', to: 'ZONE_B01', color: 'rgba(16, 185, 129, 0.1)' },
  { from: 'Outpost_Alpha', to: 'ZONE_A01', color: 'rgba(16, 185, 129, 0.1)' },
  { from: 'Outpost_Beta', to: 'ZONE_B01', color: 'rgba(16, 185, 129, 0.1)' },
  { from: 'Outpost_Beta', to: 'ZONE_B02', color: 'rgba(16, 185, 129, 0.1)' },
  { from: 'Outpost_Gamma', to: 'ZONE_A02', color: 'rgba(16, 185, 129, 0.1)' },
  { from: 'Outpost_Gamma', to: 'ZONE_D02', color: 'rgba(16, 185, 129, 0.1)' },
  { from: 'ZONE_B01', to: 'ZONE_B02', color: 'rgba(16, 185, 129, 0.1)' },
  { from: 'ZONE_A01', to: 'ZONE_A02', color: 'rgba(16, 185, 129, 0.1)' },
  { from: 'ZONE_A02', to: 'ZONE_D02', color: 'rgba(16, 185, 129, 0.1)' }
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
    <div className="space-y-6 font-sans text-xs">
      
      {/* Title */}
      <div className="border-b border-emerald-950/15 pb-4">
        <h1 className="text-xl font-bold tracking-wider text-white font-orbitron flex items-center gap-2">
          <Compass className="text-emerald-400 w-5 h-5 animate-spin-slow" /> OPTIMIZED PATROL ROUTING
        </h1>
        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1">A* Pathfinding Solver // Custom Terrain Traversability Modeling</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side List */}
        <div className="glass-panel rounded-2xl flex flex-col max-h-[600px] overflow-hidden border border-emerald-900/20">
          <div className="p-4 border-b border-emerald-950/15 flex justify-between items-center bg-emerald-950/20">
            <h3 className="text-xs font-black text-white font-orbitron uppercase tracking-wider flex items-center gap-1.5">
              <Route className="text-emerald-400 w-4 h-4" /> ACTIVE CIRCUITS
            </h3>
            <span className="text-[9px] bg-emerald-950/50 text-emerald-400 font-extrabold px-2 py-0.5 rounded border border-emerald-500/20">DISPATCHED</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {patrols.map((patrol, i) => {
              const isActive = selectedPatrolIdx === i;
              const isHigh = patrol.patrol_priority === 'High';
              const pStyle = isHigh 
                ? 'text-red-400 border-red-500/20 bg-red-950/30' 
                : patrol.patrol_priority === 'Medium' 
                  ? 'text-amber-400 border-amber-500/20 bg-amber-950/30' 
                  : 'text-emerald-400 border-emerald-500/20 bg-emerald-950/30';
              
              return (
                <div
                  key={i}
                  onClick={() => setSelectedPatrolIdx(i)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col gap-2.5 ${
                    isActive 
                      ? 'bg-emerald-950/35 border-emerald-500/40 text-white shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                      : 'bg-emerald-950/10 border-emerald-950/15 hover:bg-emerald-950/25 hover:border-emerald-700/20'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white font-mono">{patrol.zone_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] border font-bold ${pStyle}`}>{patrol.patrol_priority.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>DIST: {patrol.route_distance.toFixed(1)} km</span>
                    <span>TIME: {patrol.estimated_travel_time.toFixed(1)} hrs</span>
                    <span className="text-lime-400 font-black">COV: {patrol.coverage_score.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Canvas SVG Map */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col items-center justify-center lg:col-span-2 min-h-[450px] border border-emerald-900/20">
          <div className="w-full flex justify-between items-center mb-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-orbitron">
              <Zap className="text-lime-400 w-4 h-4" /> PATHFINDER SCHEMATIC RADAR
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">GRID: SERENGETI_36S</span>
          </div>

          <div className="w-full max-w-[500px] aspect-[4/3] bg-[#05130f]/60 border border-emerald-950/30 rounded-2xl relative overflow-hidden bg-grid">
            <svg width="100%" height="100%" viewBox="0 0 450 350" className="p-4">
              <defs>
                <style>
                  {`
                    .animated-dash {
                      stroke-dasharray: 6, 6;
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

              {/* Paths */}
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
                        stroke="#a3e635" 
                        strokeWidth={2.5}
                        className="animated-dash opacity-90"
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((n, i) => {
                const isSelected = highlightedNodes.includes(n.id);
                const fill = n.isStation ? '#061a11' : isSelected ? '#10B981' : '#142d23';
                const stroke = n.isStation ? '#10B981' : isSelected ? '#a3e635' : 'rgba(255,255,255,0.15)';
                const radius = n.isStation ? 9 : 6;

                return (
                  <g key={i} className="cursor-pointer">
                    <circle 
                      cx={n.x} 
                      cy={n.y} 
                      r={radius} 
                      fill={fill} 
                      stroke={stroke} 
                      strokeWidth={2}
                    />
                    {isSelected && (
                      <circle 
                        cx={n.x} 
                        cy={n.y} 
                        r={radius + 5} 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth={1}
                        className="animate-ping"
                      />
                    )}
                    <text 
                      x={n.x} 
                      y={n.y - 14} 
                      fill={isSelected ? '#ffffff' : '#94a3b8'} 
                      fontSize="9" 
                      textAnchor="middle"
                      fontWeight={isSelected ? 'bold' : 'bold'}
                      className="font-mono tracking-wide"
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
            <div className="w-full mt-5 border-t border-emerald-950/15 pt-4 grid grid-cols-3 gap-4 text-[10px] text-slate-400">
              <div className="bg-emerald-950/20 border border-emerald-950/15 p-2.5 rounded-xl">
                <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wide flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-400" /> Terrain Cost
                </span>
                <span className="font-extrabold text-white mt-1 block font-mono">Elevation Slopes Mapped</span>
              </div>
              <div className="bg-emerald-950/20 border border-emerald-950/15 p-2.5 rounded-xl">
                <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wide flex items-center gap-1">
                  <Target className="w-3 h-3 text-emerald-400" /> Solver Algorithm
                </span>
                <span className="font-extrabold text-white mt-1 block font-mono">A* Heuristic Search</span>
              </div>
              <div className="bg-emerald-950/20 border border-emerald-950/15 p-2.5 rounded-xl">
                <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wide flex items-center gap-1">
                  <Hourglass className="w-3 h-3 text-lime-400" /> Sim Fuel Usage
                </span>
                <span className="font-extrabold text-white mt-1 block font-mono">
                  {(selectedPatrol.route_distance * 0.15).toFixed(1)} Liters
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
