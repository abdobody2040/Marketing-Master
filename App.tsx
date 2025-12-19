import React, { useState, useEffect, Suspense } from 'react';
import { Sidebar } from './components/Sidebar';
import { ModuleCard } from './components/ModuleCard';
import { AuthScreen } from './components/AuthScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { PaymentModal } from './components/PaymentModal';
import { SkillRadar } from './components/SkillRadar';
import { FunnelChart } from './components/FunnelChart';
import { UserProfile, ViewState, MarketingModule, QuizQuestion, ScenarioResult, Difficulty } from './types';
import { generateLessonContent, generateQuiz } from './services/geminiService';
import { storageService } from './services/storageService';
import { generateCertificate } from './services/certificateService';
import ReactMarkdown from 'react-markdown';

// Lazy Load Heavy Components
const QuestMap = React.lazy(() => import('./components/QuestMap').then(module => ({ default: module.QuestMap })));
const Simulator = React.lazy(() => import('./components/Simulator').then(module => ({ default: module.Simulator })));
const Library = React.lazy(() => import('./components/Library').then(module => ({ default: module.Library })));
const AdminPanel = React.lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })));
const Quiz = React.lazy(() => import('./components/Quiz').then(module => ({ default: module.Quiz })));
const Scenario = React.lazy(() => import('./components/Scenario').then(module => ({ default: module.Scenario })));

// Loading Spinner for Suspense
const LoadingSpinner = () => (
    <div className="flex h-full items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
);

// Simple countdown component
const DailyChallengeTimer = () => {
    const [timeLeft, setTimeLeft] = useState("");
  
    useEffect(() => {
      const calculateTimeLeft = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const diff = tomorrow.getTime() - now.getTime();
        
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      };
      const timer = setInterval(calculateTimeLeft, 1000);
      calculateTimeLeft();
      return () => clearInterval(timer);
    }, []);
  
    return <span className="font-mono">{timeLeft}</span>;
  };

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.AUTH);
  const [modules, setModules] = useState<MarketingModule[]>([]);
  
  // Selection State
  const [activeModule, setActiveModule] = useState<MarketingModule | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  
  // Lesson State
  const [lessonContent, setLessonContent] = useState<string>('');
  const [loadingLesson, setLoadingLesson] = useState(false);
  
  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // Animation State
  const [newlyCompletedModuleId, setNewlyCompletedModuleId] = useState<string | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Config
  const [appPrice, setAppPrice] = useState(39);

  // --- Init ---
  useEffect(() => {
    // Check for logged in user
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentView(ViewState.DASHBOARD);
    }
    // Load Modules from storage
    setModules(storageService.getModules());
    // Load Price
    setAppPrice(storageService.getConfig().price);
  }, []);

  // Theme Handling
  useEffect(() => {
    if (user && user.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.theme]);

  // --- Auth Handlers ---
  const handleLogin = (user: UserProfile) => {
    setUser(user);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setCurrentView(ViewState.AUTH);
  };

  const handleTutorialComplete = () => {
      if (!user) return;
      const updatedUser = { ...user, hasSeenTutorial: true };
      saveProgress(updatedUser);
  }

  const handlePaymentSuccess = () => {
      if (!user) return;
      const updatedUser = { ...user, isPro: true };
      saveProgress(updatedUser);
  };

  // --- Game Loop Handlers ---

  const saveProgress = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    storageService.updateUser(updatedUser);
  };

  const handleDifficultyUpdate = (diff: Difficulty) => {
      if (!user) return;
      saveProgress({ ...user, difficulty: diff });
  }

  const handleThemeUpdate = (theme: 'light' | 'dark') => {
      if (!user) return;
      saveProgress({ ...user, theme });
  }

  const addXp = (amount: number) => {
    if (!user) return;
    
    let newXp = user.xp + amount;
    let newLevel = user.level;
    let newXpToNext = user.xpToNextLevel;

    if (newXp >= newXpToNext) {
      newLevel += 1;
      newXp = newXp - newXpToNext;
      newXpToNext = Math.floor(newXpToNext * 1.5);
    }

    const updatedUser = {
      ...user,
      xp: newXp,
      level: newLevel,
      xpToNextLevel: newXpToNext
    };
    
    saveProgress(updatedUser);
  };

  const handleModuleClick = (module: MarketingModule) => {
    setActiveModule(module);
    setCurrentView(ViewState.LESSON); 
    setSearchQuery(''); // Clear search on nav
  };

  // This function renders the Topic List if activeTopic is null
  const handleTopicSelect = async (topic: string) => {
    if (!activeModule) return;
    setActiveTopic(topic);
    setLoadingLesson(true);
    
    // Pass module specific context to AI
    const content = await generateLessonContent(topic, activeModule.title, activeModule.aiContext, user?.difficulty);
    setLessonContent(content);
    setLoadingLesson(false);
  };

  const startQuiz = async () => {
    if (!activeTopic) return;
    setLoadingQuiz(true);
    setCurrentView(ViewState.QUIZ); // Switch view first to show loading state correctly
    const questions = await generateQuiz(activeTopic, user?.difficulty);
    setQuizQuestions(questions);
    setLoadingQuiz(false);
  };

  const handleQuizComplete = (score: number) => {
    if (!user || !activeModule || !activeTopic) return;

    // XP Formula for Quiz: 10 XP per point
    const xpEarned = score * 20; 
    addXp(xpEarned);
    
    let updatedBadges = [...user.badges];
    let updatedModules = [...user.completedModules];
    let updatedTopics = [...(user.completedTopics || [])];

    const isPerfectScore = score === quizQuestions.length;
       
    // Add Badge if perfect score
    if (isPerfectScore) {
        const badgeName = `${activeModule.title} Master`;
        if (!updatedBadges.includes(badgeName)) {
            updatedBadges.push(badgeName);
        }
    }

    // Logic: Mark Topic as Completed if score >= 60%
    if (score / quizQuestions.length >= 0.6) {
        const topicId = `${activeModule.id}:${activeTopic}`;
        if (!updatedTopics.includes(topicId)) {
            updatedTopics.push(topicId);
        }

        // Logic: Mark Module as Completed ONLY if ALL topics are completed
        const allTopicsCompleted = activeModule.topics.every(t => 
            updatedTopics.includes(`${activeModule.id}:${t}`)
        );

        if (allTopicsCompleted) {
             if (!updatedModules.includes(activeModule.id)) {
                updatedModules.push(activeModule.id);
                addXp(250); // Big Bonus for finishing Module
                
                // Trigger Animation
                setNewlyCompletedModuleId(activeModule.id);
                setTimeout(() => setNewlyCompletedModuleId(null), 3000);
            }
        }
    }

    saveProgress({
        ...user,
        badges: updatedBadges,
        completedModules: updatedModules,
        completedTopics: updatedTopics
    });

    // Return to Topic List
    setActiveTopic(null);
    setCurrentView(ViewState.LESSON);
  };

  const startScenario = () => {
    setCurrentView(ViewState.SCENARIO);
  };

  const handleScenarioComplete = (result: ScenarioResult) => {
    addXp(result.xpEarned);
    // Return to Topic List
    setActiveTopic(null);
    setCurrentView(ViewState.LESSON);
  };

  // Helper to check if a module is locked based on phase progression
  const checkModuleLocked = (module: MarketingModule) => {
    if (!user) return true;
    if (module.phase === 1) return false;

    const prevPhase = module.phase - 1;
    const prevPhaseModules = modules.filter(m => m.phase === prevPhase);
    
    if (prevPhaseModules.length === 0) return false;

    // Count how many modules from the previous phase are in the user's completed list
    const completedCount = prevPhaseModules.filter(m => user.completedModules.includes(m.id)).length;
    
    // Requirement: Complete at least 2 modules from the previous phase (or all if < 2)
    const required = Math.min(2, prevPhaseModules.length);
    return completedCount < required;
  };

  // Search Logic
  const filteredSearchModules = modules.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // --- Renders ---

  const renderDashboard = () => {
    if (!user) return null;
    const allModulesCompleted = modules.length > 0 && user.completedModules.length === modules.length;

    return (
    <div className="space-y-8 animate-fade-in pb-10">
      <header className="mb-4 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                {allModulesCompleted
                    ? "You have mastered all marketing domains! Truly a Pro Marketer." 
                    : `${modules.length - user.completedModules.length} domains left to conquer.`}
            </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
             {allModulesCompleted && (
                 <button 
                    onClick={() => generateCertificate(user)}
                    className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-yellow-200 transition-all flex items-center justify-center animate-pop"
                 >
                     <i className="fa-solid fa-file-contract mr-2"></i> Download Certificate
                 </button>
             )}

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                    type="text" 
                    placeholder="Search topics..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <button 
                onClick={() => setCurrentView(ViewState.SIMULATOR)}
                className="w-full md:w-auto bg-slate-900 dark:bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all flex items-center justify-center whitespace-nowrap"
            >
                <i className="fa-solid fa-chess-board mr-2"></i> Open Simulator
            </button>
        </div>
      </header>
      
      {/* Search Results */}
      {searchQuery && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-indigo-100 dark:border-slate-700 animate-fade-in mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Search Results</h3>
              {filteredSearchModules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredSearchModules.map(m => (
                          <div 
                            key={m.id} 
                            onClick={() => handleModuleClick(m)}
                            className="flex items-center p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                          >
                              <div className={`w-10 h-10 rounded flex items-center justify-center text-white mr-3 ${m.color}`}>
                                  <i className={m.icon}></i>
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-800 dark:text-white text-sm">{m.title}</h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.topics.length} Topics</p>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No modules found matching "{searchQuery}".</p>
              )}
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Main Cards */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-indigo-600 dark:bg-indigo-900 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                             <h3 className="text-xl font-bold mb-2">Daily Challenge</h3>
                             <p className="opacity-90 mb-4 max-w-md text-sm md:text-base">Complete a Scenario Mode simulation to earn double XP and sharpen your crisis management skills.</p>
                        </div>
                        <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm text-xs font-bold flex items-center">
                             <i className="fa-regular fa-clock mr-2"></i>
                             <DailyChallengeTimer />
                        </div>
                    </div>
                    
                    <button 
                    onClick={() => {
                        const randomModule = modules[Math.floor(Math.random() * modules.length)];
                        setActiveModule(randomModule);
                        setCurrentView(ViewState.SCENARIO);
                    }}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors"
                    >
                        Start Challenge
                    </button>
                </div>
                <i className="fa-solid fa-rocket absolute -bottom-4 -right-4 text-9xl text-indigo-500 dark:text-indigo-800 opacity-50 transform rotate-12"></i>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Quests</h2>
                    <button 
                        onClick={() => setCurrentView(ViewState.QUEST_MAP)}
                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                        View Map &rarr;
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modules.slice(0, 4).map(module => (
                        <ModuleCard 
                            key={module.id} 
                            module={module} 
                            onClick={() => handleModuleClick(module)} 
                            isCompleted={user.completedModules.includes(module.id)}
                            isNewCompletion={newlyCompletedModuleId === module.id}
                            isLocked={checkModuleLocked(module)}
                        />
                    ))}
                </div>
            </div>
        </div>

        {/* Right Col: Stats */}
        <div className="space-y-6">
             <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 dark:text-amber-400 text-2xl mb-3">
                    <i className="fa-solid fa-crown"></i>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">Rank #{user.level}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Global Leaderboard</p>
                <div className="mt-2 text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500 dark:text-slate-300 font-medium uppercase tracking-wide">
                    {user.difficulty} Mode
                </div>
            </div>

            <SkillRadar modules={modules} completedModuleIds={user.completedModules} />

            {/* Detailed Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">Mastery Breakdown</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {modules.map(mod => {
                        const totalTopics = mod.topics.length;
                        const doneCount = mod.topics.filter(t => user.completedTopics.includes(`${mod.id}:${t}`)).length;
                        return (
                            <div key={mod.id}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-slate-700 dark:text-slate-300">{mod.title}</span>
                                    <span className="text-slate-500 dark:text-slate-400">{Math.round((doneCount/totalTopics)*100)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className={`h-full ${mod.color.replace('bg-', 'bg-')}`} 
                                        style={{ width: `${(doneCount/totalTopics)*100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  )};

  const renderModuleDetail = () => {
    if (!activeModule) return null;
    const isCompleted = user?.completedModules.includes(activeModule.id);

    // If activeTopic is null, show topic list
    if (!activeTopic) {
        return (
            <div className="animate-fade-in max-w-4xl mx-auto pb-10">
              <button onClick={() => setCurrentView(ViewState.QUEST_MAP)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-6 flex items-center text-sm font-medium">
                <i className="fa-solid fa-arrow-left mr-2"></i> Back to Map
              </button>
      
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden mb-8 transition-colors">
                <div className={`${activeModule.color} h-32 md:h-48 flex items-end p-6 md:p-8`}>
                   <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl flex items-center space-x-4">
                       <i className={`${activeModule.icon} text-3xl text-white`}></i>
                       <div className="text-white">
                          <h1 className="text-2xl md:text-3xl font-bold">{activeModule.title}</h1>
                          {isCompleted && <span className="text-xs bg-white/30 px-2 py-1 rounded font-bold uppercase tracking-wider"><i className="fa-solid fa-check mr-1"></i> Mastered</span>}
                       </div>
                   </div>
                </div>
                <div className="p-6 md:p-8">
                   <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">{activeModule.description}</p>
                   
                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                      <h3 className="font-bold text-slate-800 dark:text-white text-lg">Knowledge Paths</h3>
                      <button 
                        onClick={startScenario}
                        className="text-sm bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-lg font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors flex items-center w-full sm:w-auto justify-center"
                      >
                         <i className="fa-solid fa-fire mr-2"></i> Try Scenario Mode
                      </button>
                   </div>
      
                   <div className="grid grid-cols-1 gap-4">
                      {activeModule.topics.map((topic, idx) => {
                        const isTopicDone = user?.completedTopics?.includes(`${activeModule.id}:${topic}`);
                        return (
                            <button 
                            key={idx}
                            onClick={() => handleTopicSelect(topic)}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all group text-left ${isTopicDone ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md hover:bg-white dark:hover:bg-slate-800'}`}
                            >
                            <div className="flex items-center space-x-4">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isTopicDone ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                                    {isTopicDone ? <i className="fa-solid fa-check"></i> : idx + 1}
                                </span>
                                <span className={`font-medium ${isTopicDone ? 'text-green-800 dark:text-green-300' : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'}`}>{topic}</span>
                            </div>
                            <i className={`fa-solid fa-chevron-right ${isTopicDone ? 'text-green-400' : 'text-slate-300 dark:text-slate-600 group-hover:text-indigo-400'}`}></i>
                            </button>
                        );
                      })}
                   </div>
                </div>
              </div>
            </div>
          );
    }

    // If activeTopic is selected, render Lesson Content
    if (loadingLesson) {
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Consulting the Marketing Archives...</p>
          </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto animate-fade-in pb-10">
           <button onClick={() => setActiveTopic(null)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 mb-6 flex items-center text-sm font-medium">
            <i className="fa-solid fa-arrow-left mr-2"></i> Back to Topics
          </button>
  
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors">
            <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center">
               <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">{activeModule?.title}</p>
                  <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">{activeTopic}</h1>
               </div>
               <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                 <i className="fa-solid fa-book-open"></i>
               </div>
            </div>
            
            <div className="p-8">
                {/* Specific Visuals for Funnel Topic */}
                {(activeTopic === 'The AARRR Funnel' || activeTopic === 'Funnel Visualization') && (
                    <FunnelChart />
                )}

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown>{lessonContent}</ReactMarkdown>
                </div>
            </div>
  
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 border-t border-indigo-100 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="text-center sm:text-left">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-300">Ready to prove your skills?</h4>
                  <p className="text-sm text-indigo-700 dark:text-indigo-400">Take the quiz to earn XP and advance.</p>
               </div>
               <button 
                  onClick={startQuiz}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-1"
               >
                  Start Quiz
               </button>
            </div>
          </div>
        </div>
      );
  };

  const renderContent = () => {
    switch(currentView) {
      case ViewState.AUTH:
        return <AuthScreen onLogin={handleLogin} />;
      case ViewState.DASHBOARD: 
        return renderDashboard();
      case ViewState.QUEST_MAP:
        return (
            <Suspense fallback={<LoadingSpinner />}>
                <QuestMap 
                    modules={modules} 
                    completedModuleIds={user?.completedModules || []} 
                    completedTopics={user?.completedTopics || []}
                    onModuleSelect={(mod) => {
                        if(!checkModuleLocked(mod)) handleModuleClick(mod)
                    }} 
                    onBack={() => setCurrentView(ViewState.DASHBOARD)}
                    checkIsLocked={checkModuleLocked}
                    newlyCompletedModuleId={newlyCompletedModuleId}
                />
            </Suspense>
        );
      case ViewState.LESSON: 
        return renderModuleDetail(); 
      case ViewState.QUIZ: 
        if (loadingQuiz) {
           return (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400">Preparing questions...</p>
            </div>
           );
        }
        return (
            <Suspense fallback={<LoadingSpinner />}>
                <Quiz questions={quizQuestions} onComplete={handleQuizComplete} onClose={() => {setActiveTopic(null); setCurrentView(ViewState.LESSON)}} />
            </Suspense>
        );
      case ViewState.SCENARIO:
        if (!activeModule) return null;
        return (
            <Suspense fallback={<LoadingSpinner />}>
                <Scenario module={activeModule} onComplete={handleScenarioComplete} onClose={() => {setActiveTopic(null); setCurrentView(ViewState.LESSON)}} />
            </Suspense>
        );
      case ViewState.SIMULATOR:
        return (
            <Suspense fallback={<LoadingSpinner />}>
                <Simulator onClose={() => setCurrentView(ViewState.DASHBOARD)} onComplete={addXp} difficulty={user?.difficulty || Difficulty.MANAGER} />
            </Suspense>
        );
      case ViewState.ADMIN_PANEL:
        return (
            <Suspense fallback={<LoadingSpinner />}>
                <AdminPanel />
            </Suspense>
        );
      case ViewState.LIBRARY:
        return (
            <Suspense fallback={<LoadingSpinner />}>
                <Library 
                    onBack={() => setCurrentView(ViewState.DASHBOARD)} 
                    user={user}
                    modules={modules}
                />
            </Suspense>
        );
      default: 
        return renderDashboard();
    }
  };

  return (
    <ErrorBoundary>
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
        {user && !user.hasSeenTutorial && (
            <OnboardingTutorial onComplete={handleTutorialComplete} />
        )}
        
        {user && (
            <Sidebar 
            user={user} 
            activeView={currentView} 
            onNavigate={(view) => {
                setActiveTopic(null);
                setCurrentView(view);
                setSearchQuery('');
            }} 
            onLogout={handleLogout}
            onUpdateDifficulty={handleDifficultyUpdate}
            onUpdateTheme={handleThemeUpdate}
            />
        )}
        
        {/* Payment Modal Override */}
        {user && !user.isPro && currentView !== ViewState.AUTH ? (
             <PaymentModal 
                price={appPrice} 
                onSuccess={handlePaymentSuccess} 
                onLogout={handleLogout} 
            />
        ) : (
            <main className="flex-1 overflow-y-auto p-4 md:p-10 pt-4 md:pt-10 mt-16 md:mt-0 bg-slate-50 dark:bg-slate-900 relative scroll-smooth transition-colors duration-300">
                {renderContent()}
            </main>
        )}
        </div>
    </ErrorBoundary>
  );
};

export default App;