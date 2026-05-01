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
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-end justify-between pb-8 border-b border-editor-border">
        <div>
          <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Character Forge</h2>
          <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-2 italic">Architecture of Persona ({characters.length})</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-magenta px-8 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm"
        >
          Forge Identity
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