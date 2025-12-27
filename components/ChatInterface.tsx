
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { generateReasoningResponse } from '../services/geminiService';

interface Props {
  messages: Message[];
  onNewMessage: (msg: Message) => void;
  onGenerateMastery: (type: 'flashcards' | 'quiz' | 'plan', content: string) => void;
}

const ReasoningTrace: React.FC<{ thinking?: string; isLoading?: boolean }> = ({ thinking, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Default steps for the loading state to mimic the screenshot
  const loadingSteps = [
    "Analyzing the query and context...",
    "Breaking down the problem into components...",
    "Retrieving relevant knowledge from uploaded documents...",
    "Synthesizing information from multiple sources...",
    "Formulating a comprehensive response..."
  ];

  // If we have actual thinking text, we split it by lines or common markers to create steps
  const actualSteps = thinking 
    ? thinking.split('\n').filter(s => s.trim().length > 0).map(s => s.replace(/^[-*•]\s*/, '').trim())
    : [];

  const displaySteps = isLoading ? loadingSteps : actualSteps;

  if (!isLoading && actualSteps.length === 0) return null;

  return (
    <div className="w-full mb-4 glass rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl animate-in fade-in slide-in-from-top-2 duration-500">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <i className="fa-solid fa-brain text-xs"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">AI Reasoning</h4>
            <p className="text-[10px] text-slate-500 font-medium">Step-by-step chain of thought</p>
          </div>
        </div>
        <i className={`fa-solid fa-chevron-up text-xs text-slate-500 transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}></i>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2">
          <div className="relative pl-6 border-l-2 border-cyan-500/50 space-y-4">
            {displaySteps.map((step, idx) => (
              <div 
                key={idx} 
                className={`flex items-start gap-3 transition-opacity duration-700 ${isLoading ? 'animate-pulse' : ''}`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <i className="fa-solid fa-sparkles text-[10px] text-cyan-400 mt-1 flex-shrink-0"></i>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ChatInterface: React.FC<Props> = ({ messages, onNewMessage, onGenerateMastery }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<{data: string, mimeType: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now(), attachments: attachments.map(a => a.data) };
    onNewMessage(userMsg);
    setInput(''); setAttachments([]); setLoading(true);

    try {
      const result = await generateReasoningResponse(input, attachments);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: result.text || "", thinking: result.thinking, timestamp: Date.now() };
      onNewMessage(aiMsg);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (re) => { if (typeof re.target?.result === 'string') setAttachments(p => [...p, { data: re.target?.result as string, mimeType: file.type }]); };
      reader.readAsDataURL(file);
    });
    // Clear the input value so the same file can be uploaded again if needed
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={i} className="h-2"></div>;
      
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-black text-indigo-500 mt-4 mb-2 border-b border-indigo-500/20 pb-1">{line.replace('### ', '')}</h3>;
      if (line.startsWith('#### ')) return <h4 key={i} className="text-md font-bold text-slate-300 mt-3 mb-1">{line.replace('#### ', '')}</h4>;
      
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        const content = trimmedLine.substring(2);
        return <li key={i} className="ml-4 list-none flex items-start gap-2 mb-1.5 text-sm text-slate-400">
          <span className="text-indigo-500 mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-indigo-500"></span>
          <span>{parseInline(content)}</span>
        </li>;
      }
      
      if (line.startsWith('  ')) {
        return <p key={i} className="ml-8 text-xs text-slate-500 mb-1 border-l border-white/5 pl-3">{parseInline(trimmedLine)}</p>;
      }

      return <p key={i} className="mb-2 text-sm leading-relaxed">{parseInline(line)}</p>;
    });
  };

  const parseInline = (line: string) => {
    return line.split(/(\*\*.*?\*\*)/).map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="text-indigo-400 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[75vh] glass rounded-3xl overflow-hidden border-indigo-500/10 shadow-2xl">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
            <i className="fa-solid fa-brain text-4xl text-indigo-400 mb-4"></i>
            <p className="text-xs font-black uppercase tracking-widest">Awaiting Input...</p>
          </div>
        )}
        
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[90%] rounded-2xl p-5 ${
              msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'glass rounded-tl-none border-indigo-500/5'
            }`}>
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {msg.attachments.map((att, i) => (
                    <img key={i} src={att} className="w-24 h-24 object-cover rounded-xl border border-white/10 shadow-sm" alt="attachment" />
                  ))}
                </div>
              )}
              
              {msg.thinking && <ReasoningTrace thinking={msg.thinking} />}
              
              <div className="text-sm font-medium">{formatText(msg.text)}</div>
              
              {msg.role === 'model' && (
                <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                  <button onClick={() => onGenerateMastery('flashcards', msg.text)} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-[9px] font-black uppercase border border-indigo-500/10 hover:bg-indigo-500/20 transition-all">Cards</button>
                  <button onClick={() => onGenerateMastery('quiz', msg.text)} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase border border-emerald-500/10 hover:bg-emerald-500/20 transition-all">Quiz</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex flex-col items-start max-w-[90%] animate-in fade-in slide-in-from-bottom-2 duration-300">
             <ReasoningTrace isLoading={true} />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-slate-900/40 backdrop-blur-md">
        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide animate-in slide-in-from-bottom-2 duration-300">
            {attachments.map((att, i) => (
              <div key={i} className="relative group flex-shrink-0">
                {att.mimeType.startsWith('image/') ? (
                  <img src={att.data} className="w-16 h-16 object-cover rounded-xl border border-indigo-500/30" alt="Preview" />
                ) : (
                  <div className="w-16 h-16 bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-indigo-500/30">
                    <i className="fa-solid fa-file-pdf text-xl text-red-400"></i>
                    <span className="text-[8px] font-bold uppercase text-slate-500 mt-1">PDF</span>
                  </div>
                )}
                <button 
                  onClick={() => removeAttachment(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg border border-white/20 hover:scale-110 transition-transform"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-all hover:scale-105"
            title="Upload File"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            accept="image/*,application/pdf" 
            className="hidden" 
          />
          <textarea
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Discuss a chapter or upload notes..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm resize-none py-2 placeholder-slate-500 text-slate-200" rows={1}
          />
          <button 
            onClick={handleSend} 
            disabled={loading} 
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${loading ? 'bg-slate-700 opacity-50' : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'}`}
          >
            <i className={`fa-solid ${loading ? 'fa-spinner animate-spin' : 'fa-arrow-up'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};
