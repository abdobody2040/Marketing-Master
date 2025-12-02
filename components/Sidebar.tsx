
import React, { useState } from 'react';
import { UserProfile, ViewState, UserRole, Difficulty } from '../types';
import { ProgressBar } from './ProgressBar';
import { storageService } from '../services/storageService';

interface SidebarProps {
  user: UserProfile;
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  onUpdateDifficulty: (diff: Difficulty) => void;
  onUpdateTheme: (theme: 'light' | 'dark') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, activeView, onNavigate, onLogout, onUpdateDifficulty, onUpdateTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setIsOpen(false); // Close mobile drawer on nav
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onUpdateDifficulty(e.target.value as Difficulty);
  };

  const toggleTheme = () => {
    onUpdateTheme(user.theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-50 shadow-sm transition-colors duration-300">
         <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="font-bold text-slate-800 dark:text-white">MarketMaster</span>
         </div>
         <button 
           onClick={() => setIsOpen(!isOpen)}
           className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
         >
           <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
         </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/50 z-50 md:hidden animate-fade-in"
            onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        {/* Logo Area (Hidden on Mobile to avoid double header) */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 hidden md:block">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none">
              M
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white">MarketMaster</span>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rank</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">Lvl {user.level}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-800 dark:text-white truncate">{user.name}</h2>
                {user.isPro && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        PRO
                    </span>
                )}
            </div>
            <ProgressBar current={user.xp} max={user.xpToNextLevel} label="XP" colorClass="bg-gradient-to-r from-indigo-500 to-purple-500" />
            
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Difficulty Mode</label>
                <select 
                    value={user.difficulty || Difficulty.MANAGER}
                    onChange={handleDifficultyChange}
                    className="w-full text-xs p-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded focus:ring-1 focus:ring-indigo-500 outline-none dark:text-white"
                >
                    <option value={Difficulty.INTERN}>Intern (Easy)</option>
                    <option value={Difficulty.MANAGER}>Manager (Normal)</option>
                    <option value={Difficulty.CMO}>CMO (Hard)</option>
                </select>
            </div>
          </div>
        </div>

        {/* Mobile User Info (Only visible in drawer) */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 md:hidden mt-16">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rank</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">Lvl {user.level}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-slate-800 dark:text-white truncate">{user.name}</h2>
                    {user.isPro && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            PRO
                        </span>
                    )}
                </div>
                <ProgressBar current={user.xp} max={user.xpToNextLevel} label="XP" colorClass="bg-gradient-to-r from-indigo-500 to-purple-500" />
                
                <div className="mt-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Difficulty Mode</label>
                    <select 
                        value={user.difficulty || Difficulty.MANAGER}
                        onChange={handleDifficultyChange}
                        className="w-full text-xs p-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded dark:text-white"
                    >
                        <option value={Difficulty.INTERN}>Intern (Easy)</option>
                        <option value={Difficulty.MANAGER}>Manager (Normal)</option>
                        <option value={Difficulty.CMO}>CMO (Hard)</option>
                    </select>
                </div>
            </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <button 
            onClick={() => handleNav(ViewState.DASHBOARD)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === ViewState.DASHBOARD ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-house w-5 text-center"></i>
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => handleNav(ViewState.QUEST_MAP)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === ViewState.QUEST_MAP ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-map w-5 text-center"></i>
            <span>Quest Map</span>
          </button>
          <button 
            onClick={() => handleNav(ViewState.SIMULATOR)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === ViewState.SIMULATOR ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-chess-board w-5 text-center"></i>
            <span>Simulator</span>
            <span className="ml-auto bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs px-2 py-0.5 rounded-full font-bold">PRO</span>
          </button>
          <button 
            onClick={() => handleNav(ViewState.LIBRARY)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === ViewState.LIBRARY ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <i className="fa-solid fa-book-bookmark w-5 text-center"></i>
            <span>Library</span>
            <span className="ml-auto bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full font-bold">NEW</span>
          </button>

          {user.role === UserRole.ADMIN && (
              <button 
              onClick={() => handleNav(ViewState.ADMIN_PANEL)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === ViewState.ADMIN_PANEL ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
            >
              <i className="fa-solid fa-shield-halved w-5 text-center"></i>
              <span>Admin Panel</span>
            </button>
          )}
          
          <div className="pt-6 px-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Badges</p>
            <div className="flex flex-wrap gap-2">
              {user.badges.length > 0 ? (
                user.badges.map((badge, idx) => (
                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-200 dark:border-amber-800">
                    <i className="fa-solid fa-medal mr-1"></i> {badge}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No badges earned yet.</span>
              )}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-medium p-2"
          >
            <i className={`fa-solid ${user.theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            <span>{user.theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm font-medium p-2"
          >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
