
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface Props {
  questions: QuizQuestion[];
}

export const QuizModule: React.FC<Props> = ({ questions }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-30">
        <i className="fa-solid fa-vial text-4xl mb-4"></i>
        <p className="text-sm font-bold uppercase tracking-widest">No Quiz Available</p>
      </div>
    );
  }

  const current = questions[currentIdx];

  const handleOptionClick = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    if (idx === current.correctAnswer) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="max-w-md mx-auto py-10 text-center glass rounded-3xl p-10 border-indigo-500/20 shadow-2xl animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-trophy text-2xl text-indigo-400"></i>
        </div>
        <h2 className="text-xl font-black mb-1">Challenge Results</h2>
        <p className="text-4xl font-black text-indigo-500 mb-6">{score} <span className="text-lg text-slate-500">/ {questions.length}</span></p>
        <div className="space-y-3">
            <p className="text-xs text-slate-400 font-medium px-4">Great job! You've completed this mastery check. Use these results to identify gaps in your knowledge.</p>
            <button 
            onClick={() => { setCurrentIdx(0); setScore(0); setSelectedOption(null); setShowFeedback(false); setCompleted(false); }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg"
            >
            Restart Challenge
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-220px)] flex flex-col animate-in fade-in duration-500">
      {/* Progress Header - Compact */}
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Progress</span>
            <span className="text-xs font-bold text-white">{currentIdx + 1} / {questions.length}</span>
        </div>
        <div className="flex-1 h-1.5 mx-4 bg-slate-800/30 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Accuracy</span>
            <span className="text-xs font-bold text-indigo-400">{Math.round((score / (currentIdx || 1)) * 100)}%</span>
        </div>
      </div>

      {/* Main Quiz Card - Optimized for space */}
      <div className="flex-1 glass rounded-3xl p-5 md:p-6 flex flex-col border-indigo-500/10 shadow-2xl overflow-hidden">
        
        {/* Question Area */}
        <div className="mb-4 text-center">
          <h3 className="text-lg md:text-xl font-bold leading-tight text-white mb-1">{current.question}</h3>
          <div className="h-0.5 w-12 bg-indigo-500/30 mx-auto rounded-full"></div>
        </div>

        {/* Options Area - Scrollable only if items are too many, but designed to fit */}
        <div className="flex-1 flex flex-col justify-center space-y-2 overflow-y-auto scrollbar-hide py-1">
          {current.options.map((opt, idx) => {
            let variant = "bg-slate-800/20 border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5";
            let icon = <span className="w-5 h-5 rounded bg-slate-700/50 flex items-center justify-center text-[9px] font-black flex-shrink-0">{String.fromCharCode(65 + idx)}</span>;
            
            if (showFeedback) {
              if (idx === current.correctAnswer) {
                variant = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400";
                icon = <i className="fa-solid fa-check-circle text-emerald-500 flex-shrink-0"></i>;
              } else if (selectedOption === idx) {
                variant = "bg-red-500/10 border-red-500/50 text-red-400";
                icon = <i className="fa-solid fa-circle-xmark text-red-500 flex-shrink-0"></i>;
              } else {
                variant = "opacity-30 bg-slate-800/10 border-transparent";
              }
            }
            
            return (
              <button
                key={idx}
                disabled={showFeedback}
                onClick={() => handleOptionClick(idx)}
                className={`w-full py-2.5 px-4 text-left rounded-xl border transition-all flex items-center gap-3 text-sm font-medium ${variant} active:scale-[0.98]`}
              >
                {icon}
                <span className="flex-1 leading-tight">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Area - Only visible after answer, replaces nothing, just appears at bottom */}
        {showFeedback && (
          <div className="mt-4 pt-3 border-t border-white/5 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex gap-3 items-start mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-lightbulb text-indigo-400 text-xs"></i>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal line-clamp-2 md:line-clamp-3 italic">
                    {current.explanation}
                </p>
            </div>
            <button 
                onClick={nextQuestion} 
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.97]"
            >
              {currentIdx === questions.length - 1 ? 'Finish Challenge' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
