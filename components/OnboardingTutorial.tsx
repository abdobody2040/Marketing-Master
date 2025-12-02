
import React, { useState } from 'react';

interface OnboardingTutorialProps {
  onComplete: () => void;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to MarketMaster RPG",
      content: "Embark on a journey to become a legendary marketer. You will start as an Intern and rise to the rank of CMO.",
      icon: "fa-solid fa-hat-wizard",
      color: "text-indigo-600"
    },
    {
        title: "The Quest Map",
        content: "Navigate through 4 Phases of marketing mastery. Complete topics, take quizzes, and unlock new domains like 'SEO Sorcery' and 'Psychology'.",
        icon: "fa-solid fa-map",
        color: "text-emerald-600"
    },
    {
      title: "AI Lessons & Quizzes",
      content: "Each module is powered by AI. Read concise lessons and pass quizzes to earn XP and Badges.",
      icon: "fa-solid fa-brain",
      color: "text-rose-600"
    },
    {
      title: "The Simulator",
      content: "The ultimate test. Step into the role of a CMO, tackle realistic business cases, and get graded by an AI board of directors.",
      icon: "fa-solid fa-chess-board",
      color: "text-amber-500"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="p-8 text-center">
            <div className={`w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 shadow-inner ${steps[step].color}`}>
                <i className={`${steps[step].icon} text-4xl animate-pop`}></i>
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-800 mb-4">{steps[step].title}</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {steps[step].content}
            </p>

            <div className="flex justify-center space-x-2 mb-8">
                {steps.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === step ? 'bg-indigo-600 w-6' : 'bg-slate-300'}`}
                    ></div>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <button 
                    onClick={() => setStep(Math.max(0, step - 1))}
                    className={`text-slate-400 hover:text-slate-600 font-bold px-4 py-2 ${step === 0 ? 'invisible' : ''}`}
                >
                    Back
                </button>
                <button 
                    onClick={() => {
                        if (step === steps.length - 1) {
                            onComplete();
                        } else {
                            setStep(step + 1);
                        }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1"
                >
                    {step === steps.length - 1 ? "Let's Begin!" : "Next"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
