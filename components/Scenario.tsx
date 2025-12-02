import React, { useState, useEffect } from 'react';
import { generateScenario, evaluateScenarioResponse } from '../services/geminiService';
import { MarketingModule, ScenarioResult } from '../types';

interface ScenarioProps {
  module: MarketingModule;
  onComplete: (result: ScenarioResult) => void;
  onClose: () => void;
}

export const Scenario: React.FC<ScenarioProps> = ({ module, onComplete, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scenarioData, setScenarioData] = useState<{context: string, scenario: string} | null>(null);
  const [userResponse, setUserResponse] = useState("");
  const [result, setResult] = useState<ScenarioResult | null>(null);

  useEffect(() => {
    const fetchScenario = async () => {
      setLoading(true);
      const data = await generateScenario(module.title);
      setScenarioData(data);
      setLoading(false);
    };
    fetchScenario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module.id]); // Only load on mount or if module changes

  const handleSubmit = async () => {
    if (!userResponse.trim() || !scenarioData) return;
    
    setSubmitting(true);
    const evalResult = await evaluateScenarioResponse(scenarioData.scenario, userResponse);
    setResult(evalResult);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 font-medium animate-pulse">Designing crisis simulation...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl animate-fade-in border border-slate-100">
        <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${result.score >= 70 ? 'bg-green-100 text-green-500' : 'bg-orange-100 text-orange-500'}`}>
             <i className={`fa-solid ${result.score >= 70 ? 'fa-check' : 'fa-exclamation'} text-3xl`}></i>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800">{result.score}/100</h2>
            <p className="text-slate-500 font-medium">Performance Score</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
            <h3 className="font-bold text-slate-800 mb-2">Mentor Feedback</h3>
            <p className="text-slate-600 leading-relaxed">{result.feedback}</p>
        </div>

        <button 
          onClick={() => onComplete(result)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1"
        >
          Collect {result.xpEarned} XP & Return
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                    <span className="px-2 py-1 bg-white/20 rounded text-xs font-bold uppercase tracking-wider">Simulation Mode</span>
                </div>
                <h2 className="text-2xl font-bold">{scenarioData?.context}</h2>
            </div>

            <div className="p-8">
                {/* Scenario Description */}
                <div className="mb-8 prose prose-slate">
                    <p className="text-lg text-slate-700 leading-relaxed">
                        {scenarioData?.scenario}
                    </p>
                </div>

                {/* Input Area */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Strategy / Response</label>
                    <textarea 
                        className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none bg-slate-50"
                        placeholder="What is your immediate action? Type your email draft, tweet, or strategic decision here..."
                        value={userResponse}
                        onChange={(e) => setUserResponse(e.target.value)}
                        disabled={submitting}
                    ></textarea>
                </div>

                <div className="flex justify-between items-center">
                    <button 
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-800 font-medium px-4"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!userResponse.trim() || submitting}
                        className={`bg-slate-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center ${(!userResponse.trim() || submitting) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 hover:-translate-y-1'}`}
                    >
                        {submitting ? (
                            <>
                                <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Evaluating...
                            </>
                        ) : (
                            <>
                                Execute Strategy <i className="fa-solid fa-bolt ml-2 text-yellow-400"></i>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
