
import React, { useState } from 'react';
import { Flashcard } from '../types';

interface Props {
  cards: Flashcard[];
}

const FlashcardItem: React.FC<{ card: Flashcard }> = ({ card }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="w-full h-72 perspective-1000 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${flipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute w-full h-full backface-hidden glass rounded-3xl flex flex-col items-center justify-center p-6 text-center shadow-lg border-indigo-500/10">
          <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-4 px-2 py-0.5 bg-indigo-500/10 rounded">{card.category}</span>
          <h3 className="text-lg font-bold leading-tight">{card.question}</h3>
          <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">Flip Card</p>
        </div>
        <div className="absolute w-full h-full backface-hidden glass rounded-3xl flex flex-col items-center justify-center p-6 text-center rotate-y-180 bg-indigo-600/5 border-indigo-500/30">
          <h3 className="text-md leading-relaxed font-medium">{card.answer}</h3>
        </div>
      </div>
    </div>
  );
};

export const FlashcardDeck: React.FC<Props> = ({ cards }) => {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-30">
        <i className="fa-solid fa-layer-group text-4xl mb-4"></i>
        <p className="text-sm font-bold uppercase">No Cards Generated</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <FlashcardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};
