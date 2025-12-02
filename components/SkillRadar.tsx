
import React from 'react';
import { MarketingModule } from '../types';

interface SkillRadarProps {
  modules: MarketingModule[];
  completedModuleIds: string[];
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ modules, completedModuleIds }) => {
  // Calculate scores per phase
  const phases = [1, 2, 3, 4];
  const labels = ["Foundations", "Tactics", "Growth", "Leadership"];
  
  const scores = phases.map(phase => {
    const phaseModules = modules.filter(m => m.phase === phase);
    if (phaseModules.length === 0) return 0;
    const completedInPhase = phaseModules.filter(m => completedModuleIds.includes(m.id));
    return (completedInPhase.length / phaseModules.length) * 100;
  });

  // SVG Config
  const size = 300;
  const center = size / 2;
  const radius = 100;
  const numPoints = 4;

  // Helper to get coordinates
  const getCoord = (value: number, index: number, max: number) => {
    const angle = (Math.PI * 2 * index) / numPoints - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Generate polygon points
  const points = scores.map((score, i) => {
    const { x, y } = getCoord(score, i, 100);
    return `${x},${y}`;
  }).join(" ");

  // Generate background webs (25%, 50%, 75%, 100%)
  const webs = [25, 50, 75, 100].map(level => {
    return phases.map((_, i) => {
      const { x, y } = getCoord(level, i, 100);
      return `${x},${y}`;
    }).join(" ");
  });

  return (
    <div className="flex flex-col items-center bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4">Skill Proficiency</h3>
      <div className="relative">
        <svg width={size} height={size} className="transform transition-all duration-500">
          {/* Background Webs */}
          {webs.map((pointsStr, i) => (
            <polygon 
              key={i} 
              points={pointsStr} 
              fill="none" 
              className="stroke-slate-200 dark:stroke-slate-700"
              strokeWidth="1" 
            />
          ))}
          
          {/* Axis Lines */}
          {phases.map((_, i) => {
            const { x, y } = getCoord(100, i, 100);
            return (
              <line 
                key={i} 
                x1={center} 
                y1={center} 
                x2={x} 
                y2={y} 
                className="stroke-slate-200 dark:stroke-slate-700"
                strokeWidth="1" 
              />
            );
          })}

          {/* Data Polygon */}
          <polygon 
            points={points} 
            strokeWidth="2"
            className="transition-all duration-1000 ease-out fill-indigo-600/20 stroke-indigo-600 dark:stroke-indigo-400 dark:fill-indigo-400/20"
          />

          {/* Labels */}
          {phases.map((_, i) => {
            const { x, y } = getCoord(125, i, 100); 
            return (
              <text 
                key={i} 
                x={x} 
                y={y} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className="text-[10px] font-bold fill-slate-500 dark:fill-slate-400 uppercase tracking-wider"
              >
                {labels[i]}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
