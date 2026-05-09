import React from 'react';
import { CharacterCard } from './CharacterCard';
import type { Character } from '../../types/story.types';
import { FiCpu } from 'react-icons/fi';

interface CharacterGridProps {
  characters: Character[];
  onCharacterClick: (character: Character) => void;
  onAddClick: () => void;
  onAIClick: () => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ 
  characters, 
  onCharacterClick, 
  onAddClick,
  onAIClick 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {characters.map(character => character && (
         <CharacterCard
           key={character.id}
           character={character}
           onClick={() => onCharacterClick(character)}
         />
      ))}
      
      {/* Inline Add Character Card - Enhanced with Dual Options */}
      <div 
        className="group relative h-full min-h-[280px] bg-white/[0.01] border-2 border-dashed border-white/5 rounded-t-[2rem] rounded-b-xl flex flex-col items-center justify-center transition-all duration-500 overflow-hidden"
      >
        {/* Background Sparkle Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-8">
          <div className="flex flex-col gap-4 w-full">
            <button
              onClick={onAddClick}
              className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all active:scale-95"
            >
              By Oneself
            </button>
            <button
              onClick={onAIClick}
              className="w-full py-3.5 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-mono font-bold uppercase tracking-widest text-primary hover:bg-primary/20 hover:border-primary/40 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <FiCpu size={14} />
              AI-generated
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};