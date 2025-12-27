
import React from 'react';
import { StudyPlanItem } from '../types';

interface Props {
  plan: StudyPlanItem[];
}

export const StudyPlanner: React.FC<Props> = ({ plan }) => {
  if (plan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <i className="fa-solid fa-calendar-check text-4xl mb-4 opacity-20"></i>
        <p>Your study roadmap will appear here. Ask MentorAI to plan your session!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="space-y-8">
        {plan.map((item, index) => (
          <div key={item.id} className="relative flex gap-6">
            {/* Timeline Line */}
            {index !== plan.length - 1 && (
              <div className="absolute left-[23px] top-12 bottom-[-32px] w-0.5 bg-indigo-500/20"></div>
            )}
            
            {/* Number Circle */}
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg z-10">
              {index + 1}
            </div>

            {/* Content Card */}
            <div className="flex-1 glass rounded-2xl p-6 border-slate-700/50 hover:border-indigo-500/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5 mt-1">
                    <i className="fa-regular fa-clock"></i> {item.duration}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                  Milestone
                </div>
              </div>
              
              <ul className="space-y-3">
                {item.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                    <i className="fa-solid fa-check-circle text-indigo-500/50 mt-1"></i>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
