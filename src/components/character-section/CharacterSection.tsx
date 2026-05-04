import React, { useState } from 'react';
import { CharacterGrid } from './CharacterGrid';
import { CharacterModal } from './CharacterModal';
import { CharacterDetailView } from './CharacterDetailView';
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
  const [viewingCharacterId, setViewingCharacterId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const selectedCharacter = characters.find(c => c.id === viewingCharacterId) || null;

  const handleCharacterClick = (character: Character) => {
    setViewingCharacterId(character.id);
  };

  const handleCloseDetail = () => {
    setViewingCharacterId(null);
  };

  const handleOpenEdit = () => {
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setShowAddModal(false);
  };

  const handleSaveCharacter = (characterData: Partial<Character>) => {
    if (viewingCharacterId) {
      onCharacterUpdate(viewingCharacterId, characterData);
    } else {
      onCharacterAdd(characterData);
    }
    handleCloseModal();
  };

  const handleDeleteCharacter = () => {
    if (viewingCharacterId) {
      onCharacterDelete(viewingCharacterId);
      setViewingCharacterId(null);
      handleCloseModal();
    }
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* Sidebar Navigation - Character List */}
      <div className={`relative h-full flex flex-col border-r border-white/5 bg-[#050507] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden z-20
        ${viewingCharacterId ? 'w-24' : 'w-full p-8'}`}>
        
        {/* Full Header - Only shown when no selection */}
        {!viewingCharacterId && (
          <div className="flex items-end justify-between pb-8 mb-8 md:mb-12 border-b border-white/5 animate-in fade-in slide-in-from-top duration-700">
            <div>
              <h2 className="text-[28px] md:text-4xl font-serif font-extrabold text-white tracking-[-0.02em]">Character Forge</h2>
              <p className="text-[9px] md:text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.4em] mt-2 italic opacity-40 font-medium">Architecture of Persona ({characters.length})</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-10 h-10 md:w-12 md:h-12 bg-magenta-gradient rounded-xl flex items-center justify-center text-white shadow-magenta-glow hover:scale-105 active:scale-95 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        )}

        {/* Removed Close Button from sidebar as it was hidden behind the detail view */}

        {/* Navigation Area */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ${viewingCharacterId ? 'pt-20' : ''}`}>
          {viewingCharacterId ? (
            <div className={`flex flex-col transition-all duration-700 ${viewingCharacterId ? 'space-y-1' : 'space-y-2'}`}>
              {characters.map(char => (
                <div 
                  key={char.id} 
                  onClick={() => handleCharacterClick(char)}
                  className={`group relative h-20 w-full flex items-center transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer
                    ${viewingCharacterId === char.id 
                      ? 'bg-white text-black z-20 rounded-l-full translate-x-1' 
                      : 'text-white/20 hover:text-white/60'}`}
                >
                  <div className={`flex items-center space-x-6 transition-all duration-[800ms] ${viewingCharacterId ? 'justify-center w-full' : 'w-full px-8'}`}>
                    <span className={`text-sm font-mono font-bold tracking-tighter w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 flex-shrink-0 border
                      ${viewingCharacterId === char.id 
                        ? 'bg-black text-white border-black shadow-2xl scale-110' 
                        : 'bg-white/[0.02] border-white/5 group-hover:border-white/20 group-hover:bg-white/10'}`}>
                      {char.name.charAt(0)}
                    </span>
                    
                    {!viewingCharacterId && (
                      <div className="flex-1 truncate animate-in fade-in slide-in-from-left-4 duration-1000">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-serif font-bold tracking-tight truncate text-white/60 group-hover:text-white transition-colors">
                            {char.name}
                          </h4>
                          <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">{char.role}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Liquid Curve Elements - Exact Match with Chronicle Grid */}
                  {viewingCharacterId === char.id && (
                    <>
                      <div className="absolute -top-[48px] right-0 w-[48px] h-[48px] bg-transparent rounded-full pointer-events-none shadow-[24px_24px_0_0_#fff] transition-all duration-[800ms]" />
                      <div className="absolute -bottom-[48px] right-0 w-[48px] h-[48px] bg-transparent rounded-full pointer-events-none shadow-[24px_-24px_0_0_#fff] transition-all duration-[800ms]" />
                    </>
                  )}
                </div>
              ))}

              {/* Persistent Add Button */}
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center text-white/20 hover:border-editor-magenta hover:text-white transition-all duration-300 mt-4"
                title="Forge New Identity"
              >
                +
              </button>
            </div>
          ) : (
            <div className="pr-4 md:pr-6 pb-32">
              <CharacterGrid 
                characters={characters}
                onCharacterClick={handleCharacterClick}
              />
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel Area */}
      <div className={`flex-1 h-full bg-[#050507] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
        fixed inset-0 z-50 md:static md:inset-auto md:z-auto
        ${viewingCharacterId ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}>
        
        {/* Mobile Close Button */}
        {viewingCharacterId && (
          <button 
            onClick={handleCloseDetail}
            className="md:hidden absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-editor-magenta hover:text-white backdrop-blur-md transition-all duration-300 z-[60]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}

        {selectedCharacter && (
          <CharacterDetailView 
            character={selectedCharacter}
            onEdit={handleOpenEdit}
            onClose={handleCloseDetail}
            isIntegrated={true}
          />
        )}
      </div>

      {/* Modals */}
      {(isEditing || showAddModal) && (
        <CharacterModal
          character={isEditing ? selectedCharacter : null}
          onSave={handleSaveCharacter}
          onDelete={handleDeleteCharacter}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};