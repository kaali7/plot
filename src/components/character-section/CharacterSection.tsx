import React, { useState } from 'react';
import { CharacterGrid } from './CharacterGrid';
import { CharacterModal } from './CharacterModal';
import type { Character } from '../../types/story.types';

interface CharacterSectionProps {
  characters: Character[];
  onCharacterAdd: (characterData: Partial<Character>) => void;
  onCharacterUpdate: (id: string, updates: Partial<Character>) => void;
  onCharacterDelete: (id: string) => void;
}

export const CharacterSection: React.FC<CharacterSectionProps> = ({
  characters,
  onCharacterAdd,
  onCharacterUpdate,
  onCharacterDelete
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleCloseModal = () => {
    setSelectedCharacter(null);
    setShowAddModal(false);
  };

  const handleSaveCharacter = (characterData: Partial<Character>) => {
    if (selectedCharacter) {
      onCharacterUpdate(selectedCharacter.id, characterData);
    } else {
      onCharacterAdd(characterData);
    }
    handleCloseModal();
  };

  const handleDeleteCharacter = () => {
    if (selectedCharacter) {
      onCharacterDelete(selectedCharacter.id);
      handleCloseModal();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Characters ({characters.length})</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Character</span>
        </button>
      </div>

      {/* Character Grid */}
      <CharacterGrid 
        characters={characters}
        onCharacterClick={handleCharacterClick}
      />

      {/* Character Modal */}
      {(selectedCharacter || showAddModal) && (
        <CharacterModal
          character={selectedCharacter}
          onSave={handleSaveCharacter}
          onDelete={handleDeleteCharacter}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};