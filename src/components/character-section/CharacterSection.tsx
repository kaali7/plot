import React, { useState, useMemo, useEffect } from 'react';
import { CharacterGrid } from './CharacterGrid';
import { CharacterModal } from './CharacterModal';
import { CharacterDetailView } from './CharacterDetailView';
import { AICharacterGenerateModal } from './AICharacterGenerateModal';
import type { Character } from '../../types/story.types';
import { useStory } from '../../context/StoryContext';
import { buildAIContextSnapshot } from '../../lib/ai-context';
import { FiPlus, FiSearch } from 'react-icons/fi';

interface CharacterSectionProps {
  characters: Character[];
  onCharacterAdd: (characterData: Partial<Character>) => void;
  onCharacterUpdate: (id: string, updates: Partial<Character>) => void;
  onCharacterDelete: (id: string) => void;
  onViewingCharacterChange?: (isViewing: boolean) => void;
}

export const CharacterSection: React.FC<CharacterSectionProps> = ({
  characters,
  onCharacterAdd,
  onCharacterUpdate,
  onCharacterDelete,
  onViewingCharacterChange
}) => {
  const { story, scenes, conflicts, resources } = useStory();
  const [viewingCharacterId, setViewingCharacterId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [initialAIResult, setInitialAIResult] = useState<Partial<Character> | null>(null);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredCharacters = useMemo(() => {
    if (!searchQuery.trim()) return characters;
    const query = searchQuery.toLowerCase();
    return characters.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.role.toLowerCase().includes(query) ||
      (c.description && c.description.toLowerCase().includes(query))
    );
  }, [characters, searchQuery]);

  const aiContext = useMemo(() => {
    if (!story) return null;
    return buildAIContextSnapshot({
      story,
      characters,
      scenes,
      conflicts,
      resources,
    });
  }, [story, characters, scenes, conflicts, resources]);

  const selectedCharacter = characters.find(c => c.id === viewingCharacterId) || null;

  useEffect(() => {
    onViewingCharacterChange?.(Boolean(viewingCharacterId));
  }, [onViewingCharacterChange, viewingCharacterId]);

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
    setInitialAIResult(null);
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

  const handleAIGeneratedSave = (character: Partial<Character>) => {
    setInitialAIResult(character);
    setShowAddModal(true);
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* Sidebar Navigation - Character List */}
      <div className={`relative h-full flex flex-col border-r border-black/20 bg-[#0b0c10] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] z-30 md:z-50
        ${viewingCharacterId ? 'w-24' : 'w-full px-10 pt-12'}`}>
        
        
        {/* Full Header - Only shown when no selection */}
        {!viewingCharacterId && (
          <div className="flex items-center justify-between pb-6 mb-8 md:mb-12 border-b border-white/5 animate-in fade-in slide-in-from-top duration-700">
            <div>
              <h2 className="text-xl md:text-2xl font-serif font-black text-white tracking-tight uppercase">Character Forge</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center transition-all duration-300 overflow-hidden ${showSearch ? 'w-48 md:w-64 opacity-100 mr-2' : 'w-0 opacity-0'}`}>
                <input
                  autoFocus
                  type="text"
                  placeholder="Filter persona..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs font-mono text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-all"
                />
              </div>

              <button
                onClick={() => {
                  setShowSearch(!showSearch);
                  if (showSearch) setSearchQuery('');
                }}
                className={`p-2 rounded-full transition-all ${showSearch ? 'bg-primary text-white' : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}
                title="Search Persona"
              >
                <FiSearch size={14} />
              </button>

              <div className="flex items-center space-x-3 bg-black/40 border border-white/10 px-4 py-1.5 rounded-full shadow-inner shrink-0">
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em] font-bold">Total</span>
                <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(97,175,239,0.8)]"></div>
                <span className="text-sm font-mono text-white font-bold">{filteredCharacters.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Area */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ${viewingCharacterId ? 'pt-8' : ''}`}>
          {viewingCharacterId ? (
            <div className="flex flex-col items-center">
              {/* Integrated Close Button */}
              <button 
                onClick={handleCloseDetail}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:text-white backdrop-blur-md transition-all duration-500 mb-8 shadow-2xl hover:scale-110 active:scale-95"
                title="Back to Forge"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="flex flex-col w-full space-y-1">
              {filteredCharacters.map(char => (
                <div 
                  key={char.id} 
                  onClick={() => handleCharacterClick(char)}
                  className={`group relative h-20 w-full flex items-center transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer
                    ${viewingCharacterId === char.id 
                      ? 'bg-white text-black z-20 rounded-l-full' 
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

                  {/* Liquid Curve Elements */}
                  {viewingCharacterId === char.id && (
                    <>
                      <div className="absolute -top-[48px] right-0 w-[48px] h-[48px] bg-transparent rounded-full pointer-events-none shadow-[24px_24px_0_0_#fff] transition-all duration-[800ms]" />
                      <div className="absolute -bottom-[48px] right-0 w-[48px] h-[48px] bg-transparent rounded-full pointer-events-none shadow-[24px_-24px_0_0_#fff] transition-all duration-[800ms]" />
                    </>
                  )}
                </div>
              ))}


            </div>
          </div>
          ) : (
            <div className="pr-4 md:pr-6 pb-32">
              <CharacterGrid 
                characters={filteredCharacters}
                onCharacterClick={handleCharacterClick}
                onAddClick={() => setShowAddModal(true)}
                onAIClick={() => setShowAIModal(true)}
              />
            </div>
          )}
        </div>

        {/* Floating Quick Add Button - Moved outside scroll container to prevent clipping */}
        {viewingCharacterId && (
          <div className="flex flex-col items-center py-6 border-t border-white/5 bg-[#0b0c10]">
            <div className="relative">
              <button 
                onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
                className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-500 shadow-lg shadow-primary/20 hover:scale-110 active:scale-95"
                title="Forge New Identity"
              >
                <FiPlus size={24} />
              </button>
              
              {/* Click-triggered Menu */}
              {showQuickAddMenu && (
                <div className="absolute left-full ml-4 bottom-0 flex flex-col bg-[#1a1d26] border border-white/10 rounded-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110] w-48 animate-in fade-in slide-in-from-left-4 duration-300 backdrop-blur-xl">
                  <div className="px-3 py-2 mb-1 border-b border-white/5">
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">New Persona</span>
                  </div>
                  <button 
                    onClick={() => { setShowAddModal(true); setShowQuickAddMenu(false); }}
                    className="w-full px-4 py-3 text-left text-[10px] font-mono text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all uppercase tracking-widest flex items-center justify-between group"
                  >
                    By Oneself
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                  <button 
                    onClick={() => { setShowAIModal(true); setShowQuickAddMenu(false); }}
                    className="w-full px-4 py-3 text-left text-[10px] font-mono text-primary/60 hover:text-primary hover:bg-primary/5 rounded-lg transition-all uppercase tracking-widest flex items-center justify-between group"
                  >
                    AI Generate 
                    <FiPlus className="rotate-45 opacity-50 group-hover:rotate-90 transition-transform" size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Panel Area */}
      <div className={`flex-1 h-full bg-[#0b0c10] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
        fixed inset-0 z-50 md:static md:inset-auto md:z-auto
        ${viewingCharacterId ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}>
        

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
          initialData={initialAIResult || undefined}
          onSave={handleSaveCharacter}
          onDelete={handleDeleteCharacter}
          onClose={handleCloseModal}
        />
      )}

      {story && aiContext && (
        <AICharacterGenerateModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          storyId={story.id}
          context={aiContext}
          onSave={handleAIGeneratedSave}
        />
      )}
    </div>
  );
};