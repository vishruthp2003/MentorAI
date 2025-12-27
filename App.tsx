
import React, { useState, useEffect } from 'react';
import { AppView, AppState, Message, Flashcard, QuizQuestion, StudyPlanItem } from './types';
import { ChatInterface } from './components/ChatInterface';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizModule } from './components/QuizModule';
import { StudyPlanner } from './components/StudyPlanner';
import { generateFlashcards, generateQuiz, generateStudyPlan } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: AppView.CHAT,
    flashcards: [],
    quiz: [],
    studyPlan: [],
    messages: []
  });
  
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mentor_ai_state');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
    const savedTheme = localStorage.getItem('mentor_ai_theme') as 'dark' | 'light';
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('mentor_ai_state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('mentor_ai_theme', theme);
  }, [theme]);

  const handleNewMessage = (msg: Message) => {
    setState(prev => ({ ...prev, messages: [...prev.messages, msg] }));
  };

  const handleGenerateMastery = async (type: 'flashcards' | 'quiz' | 'plan', content: string) => {
    setIsGenerating(true);
    try {
      if (type === 'flashcards') {
        const cards = await generateFlashcards(content);
        setState(prev => ({ ...prev, flashcards: cards, view: AppView.FLASHCARDS }));
      } else if (type === 'quiz') {
        const quiz = await generateQuiz(content);
        setState(prev => ({ ...prev, quiz, view: AppView.QUIZ }));
      } else if (type === 'plan') {
        const plan = await generateStudyPlan(content);
        setState(prev => ({ ...prev, studyPlan: plan, view: AppView.PLANNER }));
      }
    } catch (e) {
      console.error(e);
      alert("Error generating content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerGlobalMastery = async () => {
    const lastMsg = state.messages.filter(m => m.role === 'model').pop();
    if (!lastMsg) {
      alert("Start a conversation first!");
      return;
    }
    handleGenerateMastery('plan', lastMsg.text);
  };

  return (
    <div className={`min-h-screen flex flex-col max-w-7xl mx-auto px-4 transition-colors`}>
      <header className="py-6 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setState(p => ({...p, view: AppView.CHAT}))}>
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-xl">
            <i className="fa-solid fa-brain text-xl text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter">MentorAI</h1>
            <p className="text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em]">Mastery Engine</p>
          </div>
        </div>

        <nav className="glass p-1 rounded-xl flex items-center gap-1 shadow-md">
          {[
            { id: AppView.CHAT, label: 'Chat', icon: 'fa-message' },
            { id: AppView.FLASHCARDS, label: 'Cards', icon: 'fa-layer-group' },
            { id: AppView.QUIZ, label: 'Quiz', icon: 'fa-vial' },
            { id: AppView.PLANNER, label: 'Path', icon: 'fa-map' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setState(prev => ({ ...prev, view: item.id }))}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                state.view === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-500'
              }`}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-600'}`}></i>
          </button>
          <button 
            onClick={triggerGlobalMastery}
            disabled={isGenerating}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg"
          >
            {isGenerating ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
            Generate Path
          </button>
        </div>
      </header>

      <main className="flex-1 pb-10">
        {state.view === AppView.CHAT && (
          <ChatInterface messages={state.messages} onNewMessage={handleNewMessage} onGenerateMastery={handleGenerateMastery} />
        )}
        {state.view === AppView.FLASHCARDS && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Mastery Cards</h2>
              <p className="text-slate-500 text-sm">3-Card View Optimized for Recall</p>
            </div>
            <FlashcardDeck cards={state.flashcards} />
          </div>
        )}
        {state.view === AppView.QUIZ && (
          <div className="animate-in fade-in duration-500">
            <QuizModule questions={state.quiz} />
          </div>
        )}
        {state.view === AppView.PLANNER && (
          <StudyPlanner plan={state.studyPlan} />
        )}
      </main>

      <footer className="py-6 text-center border-t border-white/5 opacity-50 text-[10px] font-bold uppercase tracking-widest">
        MentorAI &copy; 2025 • Gemini 3 Pro Reasoning
      </footer>
    </div>
  );
};

export default App;
