
import React, { useEffect, useState } from 'react';
import { MarketingModule } from '../types';

interface ModuleCardProps {
  module: MarketingModule;
  onClick: () => void;
  isLocked?: boolean;
  isCompleted?: boolean;
  isNewCompletion?: boolean; // Prop to trigger celebration
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick, isLocked = false, isCompleted = false, isNewCompletion = false }) => {
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (isNewCompletion) {
      setCelebrating(true);
      const timer = setTimeout(() => setCelebrating(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isNewCompletion]);

  return (
    <div 
      onClick={!isLocked ? onClick : undefined}
      className={`
        relative group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 
        ${isLocked ? 'opacity-60 grayscale cursor-not-allowed' : ''} 
        ${isCompleted ? 'border-indigo-100 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-900/10' : ''}
        ${celebrating ? 'animate-pop ring-4 ring-yellow-400 ring-opacity-50' : ''}
      `}
    >
      {celebrating && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
           <div className="absolute inset-0 bg-white/50 animate-flash"></div>
           {/* Simple CSS Confetti Particles */}
           <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-particle-1"></div>
           <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-400 rounded-full animate-particle-2"></div>
           <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-particle-3"></div>
           <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-particle-4"></div>
        </div>
      )}

      <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-4 text-white text-xl shadow-md ${celebrating ? 'animate-spin-slow' : ''}`}>
        <i className={module.icon}></i>
      </div>
      
      {isCompleted && (
        <div className={`absolute top-4 right-4 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm z-10 ${celebrating ? 'scale-125 transition-transform' : ''}`} title="Module Mastered">
          <i className="fa-solid fa-check text-sm"></i>
        </div>
      )}

      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{module.title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{module.description}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{module.topics.length} Topics</span>
        {!isLocked && (
          <span className={`text-sm font-medium group-hover:underline ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
            {isCompleted ? 'Review Quest' : 'Start Quest'} &rarr;
          </span>
        )}
      </div>
      
      {isLocked && (
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/60 flex items-center justify-center rounded-xl">
          <div className="bg-slate-800 dark:bg-slate-950 text-white px-3 py-1 rounded text-xs font-bold shadow-lg">
            <i className="fa-solid fa-lock mr-2"></i> Locked
          </div>
        </div>
      )}
    </div>
  );
};
