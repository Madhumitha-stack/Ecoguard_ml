import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Brain, HelpCircle, Activity, Award, CheckCircle, Percent } from 'lucide-react';

const globalImportanceData = [
  { name: 'Historical Incident Count', value: 0.1316, desc: 'Recidivism in known poaching corridors' },
  { name: 'Species: Zebra', value: 0.1211, desc: 'High target encounter rates' },
  { name: 'Species: Elephant', value: 0.0903, desc: 'High ivory poaching threat' },
  { name: 'Acoustic Risk Index', value: 0.0885, desc: 'Real-time telemetry gunshot/chainsaw alerts' },
  { name: 'Distance to Access Road', value: 0.0794, desc: 'Proximity to vehicular entry and extraction routes' },
  { name: 'Species: Buffalo', value: 0.0650, desc: 'Meat poaching incidents target' },
  { name: 'Hour Diurnal Pattern', value: 0.0512, desc: 'Late-night hour cyclical fluctuations' },
  { name: 'Species: Rhino', value: 0.0501, desc: 'Critical high-priority protective target' },
  { name: 'Animal Density Score', value: 0.0275, desc: 'Localized concentrations around waterholes' },
  { name: 'Distance to Ranger Station', value: 0.0219, desc: 'Lack of ranger deterrence presence' },
];

const caseStudies = {
  case1: {
    title: "Case Study 1: Critical Threat Grid (Elephant Sighting + Gunshots)",
    desc: "Grid near northern border, 1.2 km from road, 11 km from nearest station. Elephant presence detected, and acoustic index surged to 0.72.",
    base: 0.15,
    steps: [
      { name: 'Base Risk', val: 0.15 },
      { name: 'Acoustic Risk (+0.25)', val: 0.25 },
      { name: 'Road Proximity (+0.18)', val: 0.18 },
      { name: 'Historical Incidents (+0.15)', val: 0.15 },
      { name: 'Ranger Station Distance (+0.10)', val: 0.10 },
      { name: 'Species: Elephant (+0.08)', val: 0.08 },
      { name: 'High Rainfall (-0.03)', val: -0.03 },
      { name: 'Final Prediction', val: 0.88, isTotal: true }
    ]
  },
  case2: {
    title: "Case Study 2: Normal Patrol Grid (No Species Detected + Stable Acoustics)",
    desc: "Grid 3.5 km from station, 6.2 km from road. No vocal animal herds nearby, and no acoustic anomalies. Rainfall is moderate.",
    base: 0.15,
    steps: [
      { name: 'Base Risk', val: 0.15 },
      { name: 'Acoustic Risk (-0.05)', val: -0.05 },
      { name: 'Road Distance (-0.04)', val: -0.04 },
      { name: 'Ranger Station Proximity (-0.03)', val: -0.03 },
      { name: 'No Target Species (-0.02)', val: -0.02 },
      { name: 'Final Prediction', val: 0.01, isTotal: true }
    ]
  },
  case3: {
    title: "Case Study 3: Wet Season Inaccessibility (Heavy Rain)",
    desc: "Grid has high historical risk, but heavy rainfall (22mm) prevents off-road vehicle movement, dampening active threat levels.",
    base: 0.15,
    steps: [
      { name: 'Base Risk', val: 0.15 },
      { name: 'Historical Incidents (+0.08)', val: 0.08 },
      { name: 'Acoustic Alert (+0.05)', val: 0.05 },
      { name: 'Heavy Rainfall (-0.18)', val: -0.18 },
      { name: 'Road Distance (+0.02)', val: 0.02 },
      { name: 'Final Prediction', val: 0.12, isTotal: true }
    ]
  }
};

const thresholdBreakpoints = [
  { name: 'Acoustic Sensor Risk', threshold: '> 0.40', impact: 'Poaching risk escalates by +35%', severity: 'High', action: 'Instant dispatch' },
  { name: 'Distance to Access Road', threshold: '< 2.5 km', impact: 'Risk value rises due to rapid vehicle access', severity: 'Medium', action: 'Roadblock setup' },
  { name: 'Ranger Station Distance', threshold: '> 7.5 km', impact: 'Deterrence drop, risk multiplier active', severity: 'High', action: 'Forward camp setup' },
  { name: 'Precipitation Level', threshold: '> 15 mm', impact: 'Risk drops by 60% (poor navigability)', severity: 'Low', action: 'Base standby' }
];

export default function ExplainableAI() {
  const [selectedCase, setSelectedCase] = useState('case1');
  const activeCase = caseStudies[selectedCase];

  // Helper to compile waterfall data for Recharts
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
        color: step.isTotal ? '#06b6d4' : (isPositive ? '#ef4444' : '#10b981'),
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
      className="space-y-6"
    >
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Brain className="text-secondary w-6 h-6 animate-pulse" /> Explainable AI (SHAP Analytics)
        </h1>
        <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">Model Interpretability, Global Feature Attribution & Local Decisions</p>
      </div>

      {/* Global Feature Importance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Panel */}
        <motion.div variants={itemVariants} className="glass-panel p-5 rounded-xl lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="text-secondary w-4 h-4" /> Global Feature Attribution (SHAP Importance)
            </h3>
            <p className="text-[10px] text-slate-400 mt-1">Features ranked by mean absolute SHAP value impact on threat likelihood</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={globalImportanceData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} width={130} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B1020', 
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '11px',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]}>
                  {globalImportanceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index < 3 ? '#06b6d4' : '#10b981'} 
                      opacity={1 - index * 0.06}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Feature Explanations Panel */}
        <motion.div variants={itemVariants} className="glass-card p-5 rounded-xl lg:col-span-1 flex flex-col h-[360px]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2.5 mb-3">
            <Award className="text-primary w-4 h-4" /> Operational Metrics Glossary
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {globalImportanceData.slice(0, 5).map((f, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-semibold text-white">
                  <span>{f.name}</span>
                  <span className="text-secondary font-mono">{(f.value * 100).toFixed(1)}%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Localized Case Study Waterfall */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Waterfall Chart Panel */}
        <motion.div variants={itemVariants} className="glass-panel p-5 rounded-xl lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-danger"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="text-danger w-4 h-4" /> Local Decisions: SHAP Waterfall Analytics
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Attribution breakdown of how feature values push risk above/below the base rate.</p>
            </div>
            
            {/* Case Selector Buttons */}
            <div className="bg-slate-950/40 p-0.5 rounded-lg border border-white/5 flex gap-1 self-start">
              {Object.keys(caseStudies).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCase(c)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${selectedCase === c ? 'bg-danger text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Case {c.slice(-1)}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-300 italic mb-4 bg-slate-900/30 p-2.5 rounded border border-white/5">
            "{activeCase.desc}"
          </p>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} domain={[0, 1]} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#0B1020', 
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '11px',
                    borderRadius: '8px'
                  }}
                  cursor={{ fill: 'transparent' }}
                  labelFormatter={(name) => `Feature: ${name}`}
                  formatter={(value, name, props) => [props.payload.displayValue, 'Contribution']}
                />
                {/* Transparent base bar */}
                <Bar dataKey="transparent" stackId="a" fill="transparent" />
                {/* Actual indicator bar */}
                <Bar dataKey="delta" stackId="a" radius={2}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Threshold Breakpoints Grid */}
        <motion.div variants={itemVariants} className="glass-card p-5 rounded-xl lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2.5">
              <CheckCircle className="text-secondary w-4 h-4" /> Operational Threshold Breakpoints
            </h3>
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {thresholdBreakpoints.map((tb, i) => (
                <div key={i} className="p-2.5 bg-slate-900/30 border border-white/5 hover:border-slate-800 rounded-lg">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{tb.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${tb.severity === 'High' ? 'bg-danger/20 text-danger border border-danger/20' : tb.severity === 'Medium' ? 'bg-warning/20 text-warning border border-warning/20' : 'bg-primary/20 text-primary border border-primary/20'}`}>
                      {tb.threshold}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{tb.impact}</p>
                  <p className="text-[9px] text-secondary font-semibold mt-1">Recommended: {tb.action}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-950/40 p-3 rounded-lg border border-white/5 flex gap-2 items-center mt-4">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <p className="text-[10px] text-slate-400">
              SHAP values explain <strong>why</strong> a prediction is made. Red indicates increased poaching threat, Green indicates risk mitigation.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
