import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  CartesianGrid
} from 'recharts';
import { Brain, HelpCircle, Activity, Award, CheckCircle } from 'lucide-react';

const globalImportanceData = [
  { name: 'Hist. Incidents', value: 0.1316, desc: 'Recidivism pattern in known poaching corridors' },
  { name: 'Species: Zebra', value: 0.1211, desc: 'High target encounter rates' },
  { name: 'Species: Elephant', value: 0.0903, desc: 'High value ivory poaching target' },
  { name: 'Acoustic Risk Index', value: 0.0885, desc: 'Real-time telemetry gunshot/chainsaw alerts' },
  { name: 'Dist to Access Road', value: 0.0794, desc: 'Proximity to vehicular entry and extraction routes' },
  { name: 'Species: Buffalo', value: 0.0650, desc: 'Bushmeat poaching target' },
  { name: 'Hour Diurnal Pattern', value: 0.0512, desc: 'Late-night hour cyclical fluctuations' },
  { name: 'Species: Rhino', value: 0.0501, desc: 'Critical high-priority protective target' },
  { name: 'Animal Density Score', value: 0.0275, desc: 'Localized concentrations around waterholes' },
  { name: 'Dist to Ranger Station', value: 0.0219, desc: 'Lack of ranger deterrence presence' },
];

const caseStudies = {
  case1: {
    title: "CASE STUDY 1: CRITICAL THREAT GRID (ELEPHANT + SHOTS)",
    desc: "Grid near northern border, 1.2 km from road, 11 km from nearest station. Elephant presence detected, and acoustic index surged to 0.72.",
    base: 0.15,
    steps: [
      { name: 'Base Risk', val: 0.15 },
      { name: 'Acoustic Risk (+0.25)', val: 0.25 },
      { name: 'Road Proximity (+0.18)', val: 0.18 },
      { name: 'Hist Incidents (+0.15)', val: 0.15 },
      { name: 'Ranger Station Dist (+0.10)', val: 0.10 },
      { name: 'Species: Elephant (+0.08)', val: 0.08 },
      { name: 'High Rainfall (-0.03)', val: -0.03 },
      { name: 'Final Prediction', val: 0.88, isTotal: true }
    ]
  },
  case2: {
    title: "CASE STUDY 2: NORMAL PATROL GRID (STABLE TELEMETRY)",
    desc: "Grid 3.5 km from station, 6.2 km from road. No vocal animal herds nearby, and no acoustic anomalies. Rainfall is moderate.",
    base: 0.15,
    steps: [
      { name: 'Base Risk', val: 0.15 },
      { name: 'Acoustic Risk (-0.05)', val: -0.05 },
      { name: 'Road Distance (-0.04)', val: -0.04 },
      { name: 'Station Proximity (-0.03)', val: -0.03 },
      { name: 'No Target Species (-0.02)', val: -0.02 },
      { name: 'Final Prediction', val: 0.01, isTotal: true }
    ]
  },
  case3: {
    title: "CASE STUDY 3: WET SEASON INACCESSIBILITY (HEAVY RAIN)",
    desc: "Grid has high historical risk, but heavy rainfall (22mm) prevents off-road vehicle movement, dampening active threat levels.",
    base: 0.15,
    steps: [
      { name: 'Base Risk', val: 0.15 },
      { name: 'Hist Incidents (+0.08)', val: 0.08 },
      { name: 'Acoustic Alert (+0.05)', val: 0.05 },
      { name: 'Heavy Rainfall (-0.18)', val: -0.18 },
      { name: 'Road Distance (+0.02)', val: 0.02 },
      { name: 'Final Prediction', val: 0.12, isTotal: true }
    ]
  }
};

const thresholdBreakpoints = [
  { name: 'Acoustic Sensor Risk', threshold: '> 0.40', impact: 'Risk value escalates by +35%', severity: 'High', action: 'Instant dispatch' },
  { name: 'Distance to Access Road', threshold: '< 2.5 km', impact: 'Risk rises due to rapid vehicle access', severity: 'Medium', action: 'Roadblock setup' },
  { name: 'Ranger Station Distance', threshold: '> 7.5 km', impact: 'Deterrence drop, risk multiplier active', severity: 'High', action: 'Forward camp setup' },
  { name: 'Precipitation Level', threshold: '> 15 mm', impact: 'Risk drops by 60% (poor navigability)', severity: 'Low', action: 'Base standby' }
];

export default function ExplainableAI() {
  const [selectedCase, setSelectedCase] = useState('case1');
  const activeCase = caseStudies[selectedCase];

  const buildWaterfallData = (caseData) => {
    let cumulative = 0;
    return caseData.steps.map((step, idx) => {
      const start = cumulative;
      let end = cumulative;
      
      if (step.isTotal) {
        end = step.val;
      } else {
        cumulative += step.val;
        end = cumulative;
      }
      
      const isPositive = step.val >= 0;
      const transparent = step.isTotal ? 0 : Math.min(start, end);
      const delta = step.isTotal ? step.val : Math.abs(step.val);
      
      return {
        name: step.name,
        transparent,
        delta,
        color: step.isTotal ? '#10b981' : (isPositive ? '#ef4444' : '#a3e635'),
        displayValue: step.val > 0 && !step.isTotal ? `+${step.val.toFixed(2)}` : step.val.toFixed(2)
      };
    });
  };

  const waterfallData = buildWaterfallData(activeCase);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 text-xs font-sans"
    >
      {/* Header */}
      <div className="border-b border-emerald-950/15 pb-4">
        <h1 className="text-xl font-bold tracking-wider text-white font-orbitron flex items-center gap-2">
          <Brain className="text-emerald-400 w-5 h-5 animate-pulse" /> EXPLAINABLE AI DIAGNOSTICS
        </h1>
        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-1">Shapley Additive Attribution Explanations (SHAP) // Decision Transparency</p>
      </div>

      {/* Global rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Attribution Plot */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl relative overflow-hidden border border-emerald-900/20 shadow-lg">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-lime-400"></div>
          <div className="mb-4">
            <h3 className="text-xs font-black text-white font-orbitron uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="text-emerald-400 w-4 h-4" /> GLOBAL FEATURE ATTRIBUTION
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Features ranked by mean absolute SHAP value impact on threat likelihood</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={globalImportanceData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.01)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={8} tickLine={false} width={110} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 45, 35, 0.9)', 
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]}>
                  {globalImportanceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index < 3 ? '#a3e635' : '#10b981'} 
                      opacity={1 - index * 0.05}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Feature Glossary */}
        <motion.div variants={itemVariants} className="glass-panel p-5 rounded-2xl lg:col-span-1 flex flex-col h-[378px] border border-emerald-900/10">
          <h3 className="text-xs font-black text-white font-orbitron uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-950/15 pb-2.5 mb-3">
            <Award className="text-emerald-400 w-4 h-4" /> THREAT IMPORTANCE MATRIX
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {globalImportanceData.slice(0, 5).map((f, i) => (
              <div key={i} className="text-[11px] leading-relaxed">
                <div className="flex justify-between font-bold text-white">
                  <span>{f.name.toUpperCase()}</span>
                  <span className="text-lime-400 font-mono">{(f.value * 100).toFixed(1)}%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Local Case studies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Waterfall Chart */}
        <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl lg:col-span-2 relative overflow-hidden flex flex-col justify-between border border-emerald-900/20 shadow-lg">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 to-orange-500"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xs font-black text-white font-orbitron uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="text-red-400 w-4 h-4" /> LOCAL MODEL ATTRIBUTIONS (WATERFALL)
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Feature weights shifting risk prediction from the base incident rate (mean=0.15)</p>
            </div>
            
            <div className="bg-emerald-950/40 p-1.5 rounded-xl border border-emerald-900/35 flex gap-1.5 self-start font-mono">
              {Object.keys(caseStudies).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCase(c)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all cursor-pointer ${selectedCase === c ? 'bg-red-500 text-white' : 'text-slate-450 hover:text-white'}`}
                >
                  CASE {c.slice(-1)}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-slate-350 italic mb-4 bg-[#05130f]/60 p-3 rounded-xl border border-emerald-950/20 font-mono">
            // {activeCase.desc}
          </p>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.01)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={8} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={8} tickLine={false} domain={[0, 1]} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 45, 35, 0.9)', 
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }}
                  cursor={{ fill: 'transparent' }}
                  labelFormatter={(name) => `FEATURE: ${name}`}
                  formatter={(value, name, props) => [props.payload.displayValue, 'CONTRIBUTION']}
                />
                <Bar dataKey="transparent" stackId="a" fill="transparent" />
                <Bar dataKey="delta" stackId="a" radius={2}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Breakpoints */}
        <motion.div variants={itemVariants} className="glass-panel p-5 rounded-2xl lg:col-span-1 flex flex-col justify-between border border-emerald-900/10 shadow-lg">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white font-orbitron uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-950/15 pb-2.5">
              <CheckCircle className="text-emerald-400 w-4 h-4" /> MODEL CRITICAL LIMITS
            </h3>
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {thresholdBreakpoints.map((tb, i) => (
                <div key={i} className="p-3 bg-emerald-950/10 border border-emerald-950/15 hover:border-emerald-700/25 rounded-xl transition-all duration-300">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white font-mono">{tb.name.toUpperCase()}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] border font-bold ${tb.severity === 'High' ? 'bg-red-950/35 text-red-400 border-red-500/25' : tb.severity === 'Medium' ? 'bg-amber-950/35 text-amber-400 border-amber-500/25' : 'bg-emerald-950/35 text-emerald-400 border-emerald-500/25'}`}>
                      {tb.threshold}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">{tb.impact}</p>
                  <p className="text-[9px] text-emerald-400 font-bold mt-1.5">RECS: {tb.action.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#05130f]/60 p-3 rounded-xl border border-emerald-950/20 flex gap-2 items-center mt-4">
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-normal">
              SHAP values explain <strong>why</strong> a prediction is made. Red indicates increased poaching threat, Green indicates risk mitigation.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
