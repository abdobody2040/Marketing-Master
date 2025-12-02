import React, { useState } from 'react';

export const FunnelChart: React.FC = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    { label: 'Acquisition', desc: 'How do users find you?', metrics: 'Traffic, CPC, CTR', color: 'bg-blue-500', width: '100%' },
    { label: 'Activation', desc: 'Do they have a great first experience?', metrics: 'Signups, Onboarding %', color: 'bg-indigo-500', width: '85%' },
    { label: 'Retention', desc: 'Do they come back?', metrics: 'Churn Rate, DAU/MAU', color: 'bg-purple-500', width: '70%' },
    { label: 'Referral', desc: 'Do they tell others?', metrics: 'NPS, Viral Coefficient', color: 'bg-pink-500', width: '55%' },
    { label: 'Revenue', desc: 'How do you make money?', metrics: 'LTV, CAC, MRR', color: 'bg-rose-500', width: '40%' },
  ];

  return (
    <div className="my-8 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
      <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-slate-800">The AARRR "Pirate" Framework</h3>
          <p className="text-slate-500 text-sm">Visualizing the customer lifecycle funnel</p>
      </div>
      
      <div className="flex flex-col items-center space-y-2">
        {steps.map((step, idx) => (
          <div 
            key={idx}
            onMouseEnter={() => setHoveredStep(idx)}
            onMouseLeave={() => setHoveredStep(null)}
            className="relative h-16 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer"
            style={{ width: step.width }} 
          >
             <div className={`${step.color} w-full h-full rounded-lg flex flex-col items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"></div>
                <span className="text-lg font-bold tracking-wide">{step.label}</span>
                <span className="text-xs font-medium opacity-90">{step.desc}</span>
             </div>

             {/* Hover Detail Card */}
             {hoveredStep === idx && (
                 <div className="absolute left-full ml-4 w-48 bg-slate-800 text-white p-3 rounded-lg shadow-xl z-20 animate-fade-in text-left">
                     <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Key Metrics</div>
                     <div className="text-sm font-medium">{step.metrics}</div>
                     <div className="absolute top-1/2 -translate-y-1/2 -left-2 border-8 border-transparent border-r-slate-800"></div>
                 </div>
             )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-slate-400 mt-6 italic">
        Concept by Dave McClure • Hover over stages to see metrics
      </p>
    </div>
  );
};