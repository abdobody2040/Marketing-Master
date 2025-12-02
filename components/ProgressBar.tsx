import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  colorClass?: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, colorClass = "bg-blue-600", label }) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-medium text-slate-500">{current}/{max} XP</span>
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${colorClass}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
