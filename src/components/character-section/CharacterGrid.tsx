import React from 'react';
import { CharacterCard } from './CharacterCard';
import type { Character } from '../../types/story.types';

interface CharacterGridProps {
  characters: Character[];
  onCharacterClick: (character: Character) => void;
  onAddClick: () => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ characters, onCharacterClick, onAddClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {characters.map(character => character && (
         <CharacterCard
           key={character.id}
           character={character}
           onClick={() => onCharacterClick(character)}
         />
      ))}
      
      {/* Inline Add Character Card */}
      <div 
        onClick={onAddClick}
        className="group relative h-full min-h-[280px] bg-white/[0.01] border-2 border-dashed border-white/5 rounded-t-[2rem] rounded-b-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.03] hover:border-primary/40 transition-all duration-500"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] font-bold group-hover:text-white/60 transition-all">Forge Identity</span>
      </div>
    </div>
  );
};