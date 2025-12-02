
import React, { useState } from 'react';
import { MarketingModule } from '../types';
import { PHASE_NAMES } from '../constants';

interface QuestMapProps {
  modules: MarketingModule[];
  completedModuleIds: string[];
  completedTopics: string[];
  onModuleSelect: (module: MarketingModule) => void;
  onBack: () => void;
  checkIsLocked: (module: MarketingModule) => boolean;
  newlyCompletedModuleId: string | null;
}

export const QuestMap: React.FC<QuestMapProps> = ({ modules, completedModuleIds, completedTopics, onModuleSelect, onBack, checkIsLocked, newlyCompletedModuleId }) => {
  const [filterPhase, setFilterPhase] = useState<number | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');

  // Filter Logic
  const filteredModules = modules.filter(m => {
      // Phase Filter
      if (filterPhase !== 'ALL' && m.phase !== filterPhase) return false;
      
      // Status Filter
      const isCompleted = completedModuleIds.includes(m.id);
      if (filterStatus === 'COMPLETED' && !isCompleted) return false;
      if (filterStatus === 'IN_PROGRESS' && isCompleted) return false;

      return true;
  });

  // Group filtered modules by phase
  const phases = [1, 2, 3, 4];
  const activePhases = phases.filter(p => filterPhase === 'ALL' || filterPhase === p);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      <div className="sticky top-0 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm -mx-4 md:-mx-10 px-4 md:px-10 py-4 mb-8 border-b border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Quest Map</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Your journey to marketing mastery</p>
        </div>
        
        <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-3 w-full md:w-auto">
             <select 
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm px-3 py-2 font-medium text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
                value={filterPhase}
                onChange={(e) => setFilterPhase(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
             >
                 <option value="ALL">All Phases</option>
                 <option value="1">Phase 1: Foundations</option>
                 <option value="2">Phase 2: Tactics</option>
                 <option value="3">Phase 3: Growth</option>
                 <option value="4">Phase 4: Leadership</option>
             </select>

             <select 
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm px-3 py-2 font-medium text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-auto"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
             >
                 <option value="ALL">All Status</option>
                 <option value="COMPLETED">Completed</option>
                 <option value="IN_PROGRESS">In Progress</option>
             </select>

             <button 
                onClick={onBack}
                className="col-span-2 md:col-span-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-medium flex items-center justify-center bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
                <i className="fa-solid fa-house mr-2"></i> Dashboard
            </button>
        </div>
      </div>

      <div className="relative">
        {/* Connecting Line (Only show if viewing all phases) */}
        {filterPhase === 'ALL' && (
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 z-0 hidden md:block"></div>
        )}

        {activePhases.map((phase) => {
            const phaseModules = filteredModules.filter(m => m.phase === phase);
            if (phaseModules.length === 0) return null;

            return (
                <div key={phase} className="relative z-10 mb-16 animate-fade-in">
                    <div className="flex justify-center mb-8">
                        <div className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2 rounded-full font-bold shadow-lg border-4 border-slate-50 dark:border-slate-900 text-sm uppercase tracking-widest relative z-10">
                            Phase {phase}: {PHASE_NAMES[phase as keyof typeof PHASE_NAMES]}
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 px-4">
                        {phaseModules.map((module) => {
                            const isCompleted = completedModuleIds.includes(module.id);
                            const isLocked = checkIsLocked(module);
                            const isCelebrating = newlyCompletedModuleId === module.id;
                            
                            // Calculate granular progress
                            const totalTopics = module.topics.length;
                            const completedCount = module.topics.filter(t => completedTopics.includes(`${module.id}:${t}`)).length;
                            const percent = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

                            return (
                                <div 
                                    key={module.id}
                                    onClick={() => !isLocked && onModuleSelect(module)}
                                    className={`
                                        w-full md:w-64 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-md border-2 transition-all duration-300 relative group hover:z-40
                                        ${isLocked 
                                            ? 'border-slate-100 dark:border-slate-700 opacity-60 grayscale cursor-not-allowed' 
                                            : 'cursor-pointer hover:-translate-y-2'
                                        }
                                        ${isCompleted ? 'border-green-400 dark:border-green-600 shadow-green-100 dark:shadow-none' : isLocked ? '' : 'border-slate-100 dark:border-slate-700 hover:border-indigo-400 hover:shadow-indigo-100 dark:hover:shadow-none'}
                                        ${isCelebrating ? 'animate-pop ring-4 ring-yellow-400 ring-opacity-50' : ''}
                                    `}
                                >
                                    {isCelebrating && (
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-50">
                                            <div className="absolute inset-0 bg-white/50 animate-flash"></div>
                                            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-particle-1"></div>
                                            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-400 rounded-full animate-particle-2"></div>
                                            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-particle-3"></div>
                                            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-particle-4"></div>
                                        </div>
                                    )}

                                    {/* Hover Tooltip */}
                                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-slate-900 text-white text-xs p-4 rounded-xl shadow-xl pointer-events-none z-50">
                                        <p className="font-bold mb-2 text-sm">{module.title}</p>
                                        <p className="mb-3 opacity-90">{module.tooltip || module.description}</p>
                                        <div className="border-t border-slate-700 pt-2">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Topics</p>
                                            <ul className="list-disc list-inside space-y-0.5">
                                                {module.topics.slice(0, 3).map((t, i) => <li key={i} className="truncate">{t}</li>)}
                                                {module.topics.length > 3 && <li>+{module.topics.length - 3} more</li>}
                                            </ul>
                                        </div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                                    </div>

                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-md ${module.color} ${isCelebrating ? 'animate-spin-slow' : ''}`}>
                                        <i className={module.icon}></i>
                                    </div>
                                    
                                    {isCompleted && (
                                        <div className={`absolute top-4 right-4 text-green-500 bg-green-50 dark:bg-green-900/30 rounded-full w-8 h-8 flex items-center justify-center ${isCelebrating ? 'animate-pop' : ''}`}>
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                    )}

                                    {isLocked && (
                                        <div className="absolute top-4 right-4 text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center">
                                            <i className="fa-solid fa-lock"></i>
                                        </div>
                                    )}

                                    <h3 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">{module.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">{module.description}</p>
                                    
                                    <div className="mt-auto">
                                        <div className="flex justify-between items-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
                                            <span>Progress</span>
                                            <span className={isCompleted ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'}>
                                                {completedCount}/{totalTopics}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-indigo-500'}`} 
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )
        })}

        {filterPhase === 'ALL' && (
            <div className="text-center pt-8">
                <div className="inline-block bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-8 py-4 rounded-2xl font-bold border-2 border-yellow-200 dark:border-yellow-800 shadow-sm">
                    <i className="fa-solid fa-trophy text-2xl mb-2 block"></i>
                    Certified Pro Marketer Status
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
