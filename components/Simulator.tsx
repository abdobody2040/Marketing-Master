
import React, { useState } from 'react';
import { generateBusinessCase, evaluateMarketingPlan } from '../services/geminiService';
import { BusinessCase, MarketingPlan, PlanEvaluation, Difficulty } from '../types';

interface SimulatorProps {
    onClose: () => void;
    onComplete: (xp: number) => void;
    difficulty: Difficulty;
}

// Helper Components for Rich UI
const Chip: React.FC<{ label: string; selected: boolean; onClick: () => void; color?: string }> = ({ label, selected, onClick, color = "bg-indigo-600" }) => (
    <button 
        onClick={onClick}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${selected ? `${color} text-white border-transparent shadow-md` : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}`}
    >
        {label}
        {selected && <i className="fa-solid fa-check ml-2 text-xs"></i>}
    </button>
);

const ChannelCard: React.FC<{ 
    iconClass: string; 
    name: string; 
    selected: boolean; 
    onClick: () => void;
    color: string;
}> = ({ iconClass, name, selected, onClick, color }) => (
    <div 
        onClick={onClick}
        className={`
            cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all h-32 text-center group relative overflow-hidden
            ${selected ? `border-${color.replace('bg-', '')} bg-slate-50 dark:bg-slate-800 shadow-md transform -translate-y-1` : 'border-slate-100 dark:border-slate-700 dark:bg-slate-800 hover:border-indigo-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750'}
        `}
    >
        {selected && (
            <div className={`absolute top-2 right-2 ${color.replace('bg-', 'text-')}`}>
                <i className="fa-solid fa-circle-check"></i>
            </div>
        )}
        
        <i className={`${iconClass} text-3xl mb-2 ${selected ? color.replace('bg-', 'text-') : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-400'}`}></i>
        <span className={`font-bold text-sm ${selected ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>{name}</span>
    </div>
);

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
    const [show, setShow] = useState(false);
    return (
      <div className="relative inline-block ml-2 align-middle">
        <button 
          type="button"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          onClick={() => setShow(!show)}
          className="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
        >
          <i className="fa-solid fa-circle-info text-lg"></i>
        </button>
        {show && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl z-50 animate-fade-in text-left font-normal leading-relaxed">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
          </div>
        )}
      </div>
    );
  };

export const Simulator: React.FC<SimulatorProps> = ({ onClose, onComplete, difficulty }) => {
    const [state, setState] = useState<'START' | 'LOADING_CASE' | 'PLANNING' | 'SUBMITTING' | 'RESULTS'>('START');
    const [businessCase, setBusinessCase] = useState<BusinessCase | null>(null);
    const [activeTab, setActiveTab] = useState<keyof MarketingPlan>('executiveSummary');
    const [result, setResult] = useState<PlanEvaluation | null>(null);

    // --- RICH STATE ---
    // 1. Strategy (Text Only)
    const [executiveSummary, setExecutiveSummary] = useState('');

    // 2. Audience (Rich)
    const [audienceAge, setAudienceAge] = useState<string>('25-34');
    const [audienceLocation, setAudienceLocation] = useState<string>('');
    const [audienceGender, setAudienceGender] = useState<string[]>([]);
    const [audienceInterests, setAudienceInterests] = useState<string[]>([]);
    const [audienceValues, setAudienceValues] = useState<string[]>([]);
    const [audiencePainPoints, setAudiencePainPoints] = useState('');
    const [audienceDetails, setAudienceDetails] = useState(''); 

    // 3. Tactics (Rich)
    const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
    const [channelStrategies, setChannelStrategies] = useState<Record<string, string>>({}); // New: Individual strategies

    // 4. Budget (Rich)
    const [budgetAllocations, setBudgetAllocations] = useState<Record<string, number>>({});

    const CHANNELS = [
        { id: 'social_ads', name: 'Social Ads', iconClass: 'fa-brands fa-facebook', color: 'bg-blue-600', description: 'High reach & targeting. Great for top-of-funnel awareness.' },
        { id: 'google_ads', name: 'Search Ads', iconClass: 'fa-brands fa-google', color: 'bg-red-500', description: 'Capture high intent. Expensive but effective for sales.' },
        { id: 'seo', name: 'SEO', iconClass: 'fa-solid fa-magnifying-glass', color: 'bg-emerald-600', description: 'Long-term organic growth. Low cost per click over time.' },
        { id: 'email', name: 'Email', iconClass: 'fa-solid fa-envelope', color: 'bg-amber-500', description: 'Highest ROI for retention. Requires an existing list.' },
        { id: 'influencer', name: 'Influencer', iconClass: 'fa-brands fa-instagram', color: 'bg-pink-500', description: 'Builds trust and social proof through key personalities.' },
        { id: 'content', name: 'Content', iconClass: 'fa-solid fa-pen-nib', color: 'bg-indigo-500', description: 'The fuel for your other channels. Blogs, videos, etc.' },
        { id: 'events', name: 'Events', iconClass: 'fa-solid fa-calendar-day', color: 'bg-purple-600', description: 'High engagement and relationship building. High effort.' },
        { id: 'cro', name: 'CRO', iconClass: 'fa-solid fa-flask', color: 'bg-cyan-500', description: 'Optimizing your site to convert traffic into revenue.' },
    ];

    const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55+'];
    const INTERESTS = ['Tech', 'Fashion', 'Health', 'Finance', 'Travel', 'Gaming', 'Food', 'B2B', 'Education', 'Sports'];
    const VALUES = ['Sustainability', 'Innovation', 'Reliability', 'Luxury', 'Affordability', 'Community', 'Wellness', 'Privacy'];
    
    // Calculate total budget usage safely using Math.round to avoid floating point errors
    const totalBudgetUsage = Math.round((Object.values(budgetAllocations) as number[]).reduce((a, b) => a + b, 0));

    // Dynamic Guide Content
    const getGuideContent = () => {
        switch (activeTab) {
            case 'executiveSummary':
                return {
                    title: "Strategic Vision",
                    text: "Focus on the 'Why'. Your executive summary should tie directly to the business objective. If the goal is revenue, prioritize high-intent channels. If it's awareness, go for reach."
                };
            case 'targetAudienceAnalysis':
                return {
                    title: "Know Your Customer",
                    text: "Be specific. 'Everyone' is not a target market. Consider psychographics (Values & Interests) deeply. Why do they need this product? What keeps them up at night?"
                };
            case 'channelsAndTactics':
                // Context Aware Tips
                let tip = "Don't spread yourself too thin. Pick 2-3 core channels and master them.";
                if (selectedChannels.includes('social_ads')) {
                    tip = "Since you chose Social Ads, consider adding 'Influencer' to boost trust (Social Proof) or 'Content' to keep your creatives fresh.";
                } else if (selectedChannels.includes('google_ads')) {
                    tip = "Search Ads capture intent. Ensure your landing pages are optimized (CRO) to convert that expensive traffic.";
                } else if (selectedChannels.includes('content') && !selectedChannels.includes('seo') && !selectedChannels.includes('email')) {
                    tip = "Content is great, but how will you distribute it? Consider adding 'SEO' for organic reach or 'Email' to nurture readers.";
                }
                
                return {
                    title: "Channel Mix",
                    text: tip
                };
            case 'budgetAllocation':
                return {
                    title: "Resource Management",
                    text: "Ensure your budget matches your tactics. High-cost channels like Search Ads burn cash fast. The '70/20/10' rule is a good baseline: 70% proven, 20% safe bets, 10% experimental."
                };
            default:
                return {
                    title: "Marketing Simulator",
                    text: "Review the business case carefully. Your goal is to maximize ROI based on the specific constraints provided."
                };
        }
    };

    const handleStart = async () => {
        setState('LOADING_CASE');
        const newCase = await generateBusinessCase(difficulty);
        setBusinessCase(newCase);
        setState('PLANNING');
    };

    const toggleSelection = (list: string[], item: string, setList: (l: string[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const toggleChannel = (channelId: string) => {
        if (selectedChannels.includes(channelId)) {
            setSelectedChannels(selectedChannels.filter(id => id !== channelId));
            // Remove budget allocation and strategy
            const newAlloc = { ...budgetAllocations };
            delete newAlloc[channelId];
            setBudgetAllocations(newAlloc);
            
            const newStrats = { ...channelStrategies };
            delete newStrats[channelId];
            setChannelStrategies(newStrats);
        } else {
            setSelectedChannels([...selectedChannels, channelId]);
            // Init budget allocation
            setBudgetAllocations({ ...budgetAllocations, [channelId]: 0 });
            setChannelStrategies({ ...channelStrategies, [channelId]: '' });
        }
    };

    const handleSubmit = async () => {
        if (!businessCase) return;
        setState('SUBMITTING');

        // Construct strings from Rich State
        const targetAudienceAnalysis = `
            Primary Age: ${audienceAge}
            Location: ${audienceLocation || 'Global'}
            Genders: ${audienceGender.join(', ') || 'All'}
            Interests: ${audienceInterests.join(', ')}
            Values: ${audienceValues.join(', ')}
            Pain Points: ${audiencePainPoints}
            Notes: ${audienceDetails}
        `;

        const channelsAndTactics = `
            Selected Channels: ${selectedChannels.map(id => CHANNELS.find(c => c.id === id)?.name).join(', ')}
            
            Detailed Strategies:
            ${Object.entries(channelStrategies).map(([id, strat]) => {
                const name = CHANNELS.find(c => c.id === id)?.name;
                return `- ${name}: ${strat}`;
            }).join('\n')}
        `;

        const budgetAllocation = Object.entries(budgetAllocations)
            .map(([id, val]) => `${CHANNELS.find(c => c.id === id)?.name}: ${val}%`)
            .join('\n');

        const plan: MarketingPlan = {
            executiveSummary,
            targetAudienceAnalysis,
            channelsAndTactics,
            budgetAllocation
        };

        const evalResult = await evaluateMarketingPlan(businessCase, plan, difficulty);
        setResult(evalResult);
        setState('RESULTS');
        
        if (evalResult.score > 0) {
            onComplete(evalResult.score * 5); 
        }
    };

    const guideContent = getGuideContent();

    if (state === 'START') {
        return (
            <div className="max-w-4xl mx-auto text-center animate-fade-in py-10">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl border border-indigo-100 dark:border-slate-700 relative overflow-hidden transition-colors">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                        <i className="fa-solid fa-chess-board text-indigo-600 dark:text-indigo-400 text-4xl"></i>
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Marketing Simulator</h1>
                    <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 font-bold text-sm mb-6 uppercase tracking-wide">
                        Difficulty: {difficulty}
                    </div>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                        Step into the role of a CMO. We will generate a unique, realistic business case. 
                        You must craft a comprehensive strategy, allocate budget, and choose tactics. 
                        Our AI Board of Directors will grade your performance.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">Cancel</button>
                        <button 
                            onClick={handleStart}
                            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-1 text-lg flex items-center"
                        >
                            Start Simulation <i className="fa-solid fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (state === 'LOADING_CASE' || state === 'SUBMITTING') {
        return (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-6"></div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white animate-pulse">
                    {state === 'LOADING_CASE' ? 'Generating Business Case...' : 'Board of Directors is Reviewing...'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {state === 'LOADING_CASE' ? 'Analyzing market trends and competitor data.' : 'Calculating ROI and strategy viability.'}
                </p>
            </div>
        );
    }

    if (state === 'RESULTS' && result) {
        return (
            <div className="max-w-4xl mx-auto animate-fade-in pb-10">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-900 opacity-50"></div>
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">Performance Review</h2>
                            <div className="flex items-center justify-center space-x-4 mt-6">
                                <div className={`text-6xl font-black ${result.grade === 'S' || result.grade === 'A' ? 'text-yellow-400' : result.grade === 'F' ? 'text-red-500' : 'text-indigo-400'}`}>
                                    {result.grade}
                                </div>
                                <div className="text-left">
                                    <div className="text-3xl font-bold">{result.score}/100</div>
                                    <div className="text-sm opacity-70">Final Score</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Executive Summary</h3>
                            <p className="text-slate-600 dark:text-slate-300 italic border-l-4 border-indigo-500 pl-4 py-2 bg-slate-50 dark:bg-slate-750 rounded-r">
                                "{result.summary}"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800">
                                <h3 className="font-bold text-green-800 dark:text-green-400 mb-4 flex items-center"><i className="fa-solid fa-thumbs-up mr-2"></i> Strengths</h3>
                                <ul className="space-y-2">
                                    {result.strengths.map((s, i) => (
                                        <li key={i} className="text-sm text-green-700 dark:text-green-300 flex items-start">
                                            <i className="fa-solid fa-check mt-1 mr-2 opacity-50"></i> {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-800">
                                <h3 className="font-bold text-red-800 dark:text-red-400 mb-4 flex items-center"><i className="fa-solid fa-thumbs-down mr-2"></i> Weaknesses</h3>
                                <ul className="space-y-2">
                                    {result.weaknesses.map((w, i) => (
                                        <li key={i} className="text-sm text-red-700 dark:text-red-300 flex items-start">
                                            <i className="fa-solid fa-xmark mt-1 mr-2 opacity-50"></i> {w}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 mb-8">
                            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">Mentor's Advice</h3>
                            <p className="text-indigo-800 dark:text-indigo-200">{result.tacticalAdvice}</p>
                        </div>

                        <div className="flex justify-center space-x-4">
                             <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">Close</button>
                             <button onClick={handleStart} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow hover:bg-indigo-700">New Simulation</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-fade-in">
            {/* Left Panel: Persistent Briefing */}
            <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0 h-full overflow-hidden">
                <div className="p-6 bg-slate-900 text-white relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <i className="fa-solid fa-folder-open text-6xl"></i>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Confidential</span>
                            <span className="text-slate-400 text-[10px] font-mono">CASE #{Math.floor(Math.random() * 1000)}</span>
                        </div>
                        <h1 className="font-bold text-xl leading-tight mb-2">{businessCase?.companyName}</h1>
                        <p className="text-xs text-slate-400 opacity-80">
                            Create a winning strategy to solve the client's problem below.
                        </p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {/* Stats Grid - Moved Industry Here */}
                    <div className="grid grid-cols-1 gap-3">
                         <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center">
                                <i className="fa-solid fa-building mr-2 text-indigo-500"></i> Industry
                            </h3>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{businessCase?.industry}</p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center">
                                <i className="fa-solid fa-bullseye mr-2 text-red-500"></i> Objective
                            </h3>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{businessCase?.objective}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Budget</h3>
                                <p className="text-lg font-black text-emerald-800 dark:text-emerald-300">{businessCase?.budget}</p>
                            </div>
                            <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <i className="fa-solid fa-sack-dollar"></i>
                            </div>
                        </div>
                    </div>

                    {/* Brief Summary / Context Card */}
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 relative group">
                        <div className="absolute -left-[1px] top-4 bottom-4 w-1 bg-indigo-500 rounded-r"></div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center">
                            <i className="fa-solid fa-align-left mr-2"></i> Brief Summary
                        </h3>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            "{businessCase?.context}"
                        </p>
                    </div>
                </div>

                {/* Dynamic Guide / Tips - PERSISTENT FOOTER */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-t border-indigo-100 dark:border-indigo-800 shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300">
                    <div className="flex items-center mb-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-2 text-xs">
                            <i className="fa-solid fa-lightbulb"></i>
                            </div>
                            <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">{guideContent.title}</h4>
                    </div>
                    <p className="text-xs text-indigo-800 dark:text-indigo-200 leading-relaxed">
                        {guideContent.text}
                    </p>
                </div>
            </div>

            {/* Right Panel: Workspace */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto shrink-0 bg-white dark:bg-slate-800">
                    {[
                        { id: 'executiveSummary', label: '1. Strategy', icon: 'fa-chess' },
                        { id: 'targetAudienceAnalysis', label: '2. Audience', icon: 'fa-users' },
                        { id: 'channelsAndTactics', label: '3. Tactics', icon: 'fa-bullhorn' },
                        { id: 'budgetAllocation', label: '4. Budget', icon: 'fa-coins' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as keyof MarketingPlan)}
                            className={`flex-1 py-4 px-4 text-sm font-bold flex items-center justify-center min-w-[120px] transition-colors ${
                                activeTab === tab.id 
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            <i className={`fa-solid ${tab.icon} mr-2`}></i> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto custom-scrollbar">
                    
                    {/* 1. STRATEGY TAB */}
                    {activeTab === 'executiveSummary' && (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center mb-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Executive Summary & Strategic Vision</label>
                                <InfoTooltip text="Summarize your entire marketing strategy. Focus on the 'Why' behind your choices and how they align with the business objective. Keep it concise but impactful." />
                            </div>
                            <textarea 
                                className="flex-1 p-6 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none shadow-inner text-slate-700 dark:text-slate-200 leading-relaxed font-medium"
                                placeholder="Describe your high-level strategy here. Focus on the 'Why' and 'How'..."
                                value={executiveSummary}
                                onChange={(e) => setExecutiveSummary(e.target.value)}
                            ></textarea>
                        </div>
                    )}

                    {/* 2. AUDIENCE TAB */}
                    {activeTab === 'targetAudienceAnalysis' && (
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {/* Demographics Group */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 border-b dark:border-slate-700 pb-2">Demographics</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center mb-3">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Age Range</label>
                                            <InfoTooltip text="Select the core age range of your target customer." />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {AGE_RANGES.map(age => (
                                                <Chip key={age} label={age} selected={audienceAge === age} onClick={() => setAudienceAge(age)} />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Gender Focus</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['All', 'Male', 'Female', 'Non-binary'].map(g => (
                                                    <Chip key={g} label={g} selected={audienceGender.includes(g)} onClick={() => toggleSelection(audienceGender, g, setAudienceGender)} />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Location Target</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g., North America, Urban Areas..." 
                                                className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white"
                                                value={audienceLocation}
                                                onChange={(e) => setAudienceLocation(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Psychographics Group */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 border-b dark:border-slate-700 pb-2">Psychographics</h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Key Interests</label>
                                        <div className="flex flex-wrap gap-2">
                                            {INTERESTS.map(int => (
                                                <Chip key={int} label={int} selected={audienceInterests.includes(int)} onClick={() => toggleSelection(audienceInterests, int, setAudienceInterests)} color="bg-pink-500" />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Core Values</label>
                                        <div className="flex flex-wrap gap-2">
                                            {VALUES.map(val => (
                                                <Chip key={val} label={val} selected={audienceValues.includes(val)} onClick={() => toggleSelection(audienceValues, val, setAudienceValues)} color="bg-emerald-500" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Deep Dive */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 border-b dark:border-slate-700 pb-2">Deep Analysis</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pain Points</label>
                                        <textarea 
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 h-20 text-sm dark:text-white"
                                            placeholder="What problems keep them awake at night? e.g., 'Too expensive', 'Lack of time'..."
                                            value={audiencePainPoints}
                                            onChange={(e) => setAudiencePainPoints(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Additional Notes</label>
                                        <textarea 
                                            className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 h-20 text-sm dark:text-white"
                                            placeholder="Any other specific details about persona or lifestyle..."
                                            value={audienceDetails}
                                            onChange={(e) => setAudienceDetails(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. TACTICS TAB */}
                    {activeTab === 'channelsAndTactics' && (
                        <div className="space-y-8 max-w-4xl mx-auto">
                             <div>
                                <div className="flex items-center mb-3">
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Select Marketing Channels</label>
                                    <InfoTooltip text="Choose the channels that best reach your defined audience. Click to select/deselect." />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {CHANNELS.map(ch => (
                                        <ChannelCard 
                                            key={ch.id} 
                                            name={ch.name} 
                                            iconClass={ch.iconClass}
                                            color={ch.color}
                                            selected={selectedChannels.includes(ch.id)} 
                                            onClick={() => toggleChannel(ch.id)} 
                                        />
                                    ))}
                                </div>
                             </div>

                             {selectedChannels.length > 0 && (
                                <div className="animate-fade-in">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Channel Strategies</h3>
                                    <div className="space-y-4">
                                        {selectedChannels.map(chId => {
                                            const channel = CHANNELS.find(c => c.id === chId);
                                            return (
                                                <div key={chId} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                                    <div className="flex items-center mb-3">
                                                        <div className={`w-8 h-8 rounded flex items-center justify-center text-white mr-3 ${channel?.color}`}>
                                                            <i className={`${channel?.iconClass}`}></i>
                                                        </div>
                                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">{channel?.name} Strategy</label>
                                                    </div>
                                                    <textarea 
                                                        className="w-full p-4 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 h-24 text-sm dark:text-white"
                                                        placeholder={`Specific tactics for ${channel?.name}...`}
                                                        value={channelStrategies[chId] || ''}
                                                        onChange={(e) => setChannelStrategies({ ...channelStrategies, [chId]: e.target.value })}
                                                    ></textarea>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                             )}

                             {selectedChannels.length === 0 && (
                                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-400 dark:text-slate-500 font-medium">Select channels above to define your tactics.</p>
                                </div>
                             )}
                        </div>
                    )}

                    {/* 4. BUDGET TAB */}
                    {activeTab === 'budgetAllocation' && (
                        <div className="space-y-6 max-w-3xl mx-auto">
                            <div className="bg-slate-800 dark:bg-slate-700 text-white p-6 rounded-xl shadow-lg flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg">Total Budget</h3>
                                    <p className="text-slate-400 text-sm">Distribute 100% of your resources</p>
                                </div>
                                <div className={`text-2xl font-mono font-bold ${totalBudgetUsage !== 100 ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}`}>
                                    {businessCase?.budget}
                                </div>
                            </div>

                            {selectedChannels.length === 0 ? (
                                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <i className="fa-solid fa-list-check text-2xl"></i>
                                    </div>
                                    <h3 className="font-bold text-slate-600 dark:text-slate-300">No Channels Selected</h3>
                                    <p className="text-slate-400 mb-4">Go to the Tactics tab to choose your marketing mix.</p>
                                    <button 
                                        onClick={() => setActiveTab('channelsAndTactics')}
                                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                                    >
                                        Go to Tactics &rarr;
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <button 
                                            onClick={() => setBudgetAllocations(selectedChannels.reduce((acc, id) => ({...acc, [id]: 0}), {}))}
                                            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            Reset Allocations
                                        </button>
                                        <InfoTooltip text="Allocate your budget percentages. High-impact channels should receive more funding. Ensure total is 100%." />
                                    </div>
                                    {selectedChannels.map((chId) => {
                                        const channel = CHANNELS.find(c => c.id === chId);
                                        const val = budgetAllocations[chId] || 0;
                                        const colorClass = channel?.color || 'bg-slate-500';
                                        return (
                                            <div key={chId} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                                                <div className="flex items-center gap-4 mb-3">
                                                    {/* Col 1: Icon/Info */}
                                                    <div className="flex items-center w-40 shrink-0">
                                                        <div className={`w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center mr-3 ${colorClass.replace('bg-', 'text-')} border border-slate-100 dark:border-slate-600`}>
                                                            <i className={`${channel?.iconClass} text-xl`}></i>
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-slate-800 dark:text-white block text-sm">{channel?.name}</span>
                                                            <span className="text-xs text-slate-400">Allocation</span>
                                                        </div>
                                                    </div>

                                                    {/* Col 2: Slider */}
                                                    <div className="flex-1 relative h-6 group">
                                                        <input 
                                                            type="range" 
                                                            min="0" 
                                                            max="100" 
                                                            step="5"
                                                            value={val}
                                                            onChange={(e) => setBudgetAllocations({ ...budgetAllocations, [chId]: parseInt(e.target.value) })}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                                        />
                                                        <div className="absolute inset-0 h-2 top-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full bg-slate-300 dark:bg-slate-600 transition-all duration-200`} 
                                                                style={{ width: `${val}%` }}
                                                            ></div>
                                                        </div>
                                                        <div 
                                                            className="absolute top-0 w-4 h-4 bg-white dark:bg-slate-500 border-2 border-slate-300 dark:border-slate-500 rounded-full shadow-sm z-10 pointer-events-none transition-all duration-200"
                                                            style={{ left: `calc(${val}% - 8px)`, top: '4px' }}
                                                        ></div>
                                                    </div>

                                                    {/* Col 3: Visual Bar Chart & Value */}
                                                    <div className="w-24 shrink-0 flex flex-col items-end justify-center">
                                                        <span className={`font-mono font-bold text-lg leading-none mb-1 ${val > 0 ? 'text-slate-800 dark:text-white' : 'text-slate-300 dark:text-slate-600'}`}>{val}%</span>
                                                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full ${colorClass} transition-all duration-500 ease-out`} 
                                                                style={{ width: `${val}%` }}
                                                                title={`${channel?.name} Allocation`}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Tooltip Description */}
                                                <p className="text-xs text-slate-500 dark:text-slate-400 italic pl-[3.25rem]">
                                                    <i className="fa-solid fa-circle-info mr-1 opacity-50"></i>
                                                    {channel?.description}
                                                </p>
                                            </div>
                                        );
                                    })}

                                    {/* Stacked Bar Chart Summary */}
                                    <div className={`mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl border transition-colors ${totalBudgetUsage !== 100 ? 'border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                                        <div className="flex justify-between items-end mb-4">
                                            <h4 className="font-bold text-slate-700 dark:text-slate-300">Allocation Summary</h4>
                                            <div className={`font-mono font-bold text-sm px-2 py-1 rounded ${totalBudgetUsage !== 100 ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 animate-pulse' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'}`}>
                                                Total: {totalBudgetUsage}%
                                            </div>
                                        </div>
                                        
                                        <div className="flex h-8 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-inner">
                                            {selectedChannels.map((chId) => {
                                                const val = budgetAllocations[chId] || 0;
                                                if (val === 0) return null;
                                                const channel = CHANNELS.find(c => c.id === chId);
                                                const colorClass = channel?.color || 'bg-slate-500';
                                                
                                                return (
                                                    <div 
                                                        key={chId} 
                                                        style={{ width: `${val}%` }} 
                                                        className={`${colorClass} h-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300 border-r border-white/20`}
                                                        title={`${channel?.name}: ${val}%`}
                                                    >
                                                        {val >= 10 && `${val}%`}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        
                                        {totalBudgetUsage !== 100 && (
                                            <p className="text-xs font-bold text-red-500 mt-2 text-center">
                                                <i className="fa-solid fa-circle-exclamation mr-1"></i>
                                                {totalBudgetUsage < 100 ? `You have ${100 - totalBudgetUsage}% budget remaining.` : `You are ${totalBudgetUsage - 100}% over budget.`}
                                            </p>
                                        )}
                                        
                                        <div className="flex flex-wrap gap-4 mt-4 justify-center">
                                            {selectedChannels.map((chId) => {
                                                 const val = budgetAllocations[chId] || 0;
                                                 if (val === 0) return null;
                                                 const channel = CHANNELS.find(c => c.id === chId);
                                                 const colorClass = channel?.color || 'bg-slate-500';
                                                 return (
                                                     <div key={chId} className="flex items-center text-xs font-medium text-slate-600 dark:text-slate-400">
                                                         <div className={`w-3 h-3 rounded-full ${colorClass} mr-2`}></div>
                                                         {channel?.name}
                                                     </div>
                                                 )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
                    <button onClick={onClose} className="px-4 py-2 font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-sm">Save Draft & Exit</button>
                    <button 
                        onClick={handleSubmit}
                        disabled={executiveSummary.length < 10 || totalBudgetUsage !== 100}
                        className={`px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-xl shadow-lg flex items-center transition-all ${(executiveSummary.length < 10 || totalBudgetUsage !== 100) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:-translate-y-1'}`}
                    >
                        Submit Plan <i className="fa-solid fa-paper-plane ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};
