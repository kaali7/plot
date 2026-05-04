import React from 'react';
import { CharacterCard } from './CharacterCard';
import type { Character } from '../../types/story.types';

interface CharacterGridProps {
  characters: Character[];
  onCharacterClick: (character: Character) => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ characters, onCharacterClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {characters.map(character => character && (
         <CharacterCard
           key={character.id}
           character={character}
           onClick={() => onCharacterClick(character)}
         />
      ))}
    </div>
  );
};