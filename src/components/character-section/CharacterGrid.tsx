import React from 'react';
import { CharacterCard } from './CharacterCard';
import type { Character } from '../../types/story.types';

interface CharacterGridProps {
  characters: Character[];
  onCharacterClick: (character: Character) => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ characters, onCharacterClick }) => {
  const getRoleColor = (role: Character['role']) => {
    switch (role) {
      case 'protagonist': return 'bg-purple-600/50 border-purple-500/30';
      case 'supporting': return 'bg-purple-500/50 border-purple-400/30';
      case 'antagonist': return 'bg-red-600/50 border-red-500/30';
      case 'minor': return 'bg-blue-600/50 border-blue-500/30';
      default: return 'bg-gray-600/50 border-gray-500/30';
    }
  };



  if (characters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-purple-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Characters Yet</h3>
        <p className="text-purple-300">Add your first character to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map(character => character && (
         <CharacterCard
           key={character.id}
           character={character}
           roleColor={getRoleColor(character.role)}
           onClick={() => onCharacterClick(character)}
         />
      ))}
    </div>
  );
};