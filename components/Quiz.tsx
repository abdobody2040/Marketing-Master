import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      // Wait a moment before triggering complete to show the final state briefly if desired, 
      // or just show a summary card.
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center animate-fade-in">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-trophy text-yellow-500 text-3xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
        <p className="text-slate-500 mb-6">You scored {score} out of {questions.length}</p>
        
        <div className="w-full bg-slate-100 rounded-full h-4 mb-8 overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-1000" 
            style={{ width: `${(score / questions.length) * 100}%` }}
          ></div>
        </div>

        <button 
          onClick={() => onComplete(score)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1"
        >
          Claim Rewards
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in border border-slate-100">
      <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
        <h3 className="font-bold text-lg">Knowledge Check</h3>
        <span className="bg-indigo-500 px-3 py-1 rounded-full text-sm font-medium border border-indigo-400">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>
      
      <div className="p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ";
            
            if (showExplanation) {
              if (idx === currentQuestion.correctIndex) {
                btnClass += "border-green-500 bg-green-50 text-green-700";
              } else if (idx === selectedOption) {
                btnClass += "border-red-500 bg-red-50 text-red-700";
              } else {
                btnClass += "border-slate-100 text-slate-400 opacity-50";
              }
            } else {
              btnClass += "border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700";
            }

            return (
              <button 
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={showExplanation}
                className={btnClass}
              >
                <span className="font-medium">{option}</span>
                {showExplanation && idx === currentQuestion.correctIndex && (
                  <i className="fa-solid fa-check-circle text-green-500 text-xl"></i>
                )}
                {showExplanation && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                  <i className="fa-solid fa-times-circle text-red-500 text-xl"></i>
                )}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="animate-fade-in">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-800">Explanation:</span> {currentQuestion.explanation}
              </p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center"
              >
                {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"} <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
