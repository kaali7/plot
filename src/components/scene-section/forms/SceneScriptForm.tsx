import React, { useState } from 'react';
import type { Dialogue, Character } from '../../../types/story.types';

interface SceneScriptFormProps {
  data: Dialogue[];
  characters: Character[];
  onUpdate: (data: Dialogue[]) => void;
}

export const SceneScriptForm: React.FC<SceneScriptFormProps> = ({ data, characters, onUpdate }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState('');
  const [content, setContent] = useState('');

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const addEntry = (type: 'dialogue' | 'action') => {
    if (content.trim()) {
      const newEntry: Dialogue = {
        characterId: selectedCharacterId,
        content: content.trim(),
        order: data.length,
        type: type
      };
      onUpdate([...data, newEntry]);
      setContent('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedCharacterId) {
        addEntry('dialogue');
      } else {
        addEntry('action');
      }
    }
    
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      // Cycle characters
      const charIds = ['', ...characters.map(c => c.id)];
      const currentIndex = charIds.indexOf(selectedCharacterId);
      const nextIndex = (currentIndex + 1) % charIds.length;
      setSelectedCharacterId(charIds[nextIndex]);
    }
  };

  const removeEntry = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto overflow-hidden">
      {/* Script History - Now takes up remaining space */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 px-4 pb-12">
        {data.length > 0 ? (
          data.map((entry, index) => {
            const character = characters.find(c => c.id === entry.characterId);
            const isAction = entry.type === 'action';

            return (
              <div 
                key={index} 
                className={`group relative py-6 px-12 transition-all border-b border-white/[0.03] hover:bg-white/[0.01] ${
                  isAction ? 'italic opacity-50' : ''
                }`}
              >
                {!isAction && (
                  <div className="mb-2">
                    <span className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold">
                      {character?.name || 'Narrator'}
                    </span>
                  </div>
                )}
                
                <div className={`${isAction ? 'pl-8 border-l border-white/10' : ''}`}>
                  <p className={`text-base font-serif leading-relaxed ${isAction ? 'text-editor-text-muted italic' : 'text-white/90'}`}>
                    {isAction ? entry.content : `"${entry.content}"`}
                  </p>
                </div>

                <button
                  onClick={() => removeEntry(index)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-editor-text-muted hover:text-red-500 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
            <p className="text-editor-text-muted text-[11px] font-mono uppercase tracking-[0.3em] italic opacity-40">The scene's dialogue has not yet been forged.</p>
          </div>
        )}
      </div>

      {/* Ultra-Compact Speed-Script Bar - Now Fixed at Bottom */}
      <div className="mt-auto pt-6 border-t border-white/5 bg-surface-dark/50 backdrop-blur-md sticky bottom-0 z-10 p-6 rounded-b-xl">
        <div className="flex items-center space-x-3">
          {/* Character Anchor */}
          <div className="w-48 relative">
            <select
              value={selectedCharacterId}
              onChange={(e) => setSelectedCharacterId(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-md px-3 py-2 text-[11px] font-mono font-bold text-white/70 uppercase tracking-widest focus:border-editor-magenta outline-none transition-all appearance-none cursor-pointer hover:bg-black/40"
            >
              <option value="">Background</option>
              {characters.map(char => (
                <option key={char.id} value={char.id}>{char.name}</option>
              ))}
            </select>
          </div>

          {/* Drafting Field */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-black/10 border border-white/5 rounded-md px-4 py-2 text-sm font-serif text-white/90 focus:border-editor-magenta outline-none transition-all resize-none placeholder:text-white/10"
              placeholder={selectedCharacterId ? `Enter ${characters.find(c => c.id === selectedCharacterId)?.name}'s dialogue...` : "Describe the movement..."}
            />
          </div>

          {/* Commit Action */}
          <button
            onClick={() => addEntry(selectedCharacterId ? 'dialogue' : 'action')}
            disabled={!content.trim()}
            className={`flex-shrink-0 px-6 py-2 rounded-md text-[10px] font-mono font-bold uppercase tracking-widest transition-all
              ${content.trim() 
                ? 'bg-editor-magenta text-white shadow-magenta-glow hover:scale-105 active:scale-95' 
                : 'bg-white/5 text-white/20 border border-white/5'}`}
          >
            {selectedCharacterId ? 'Add Dialogue' : 'Add Action'}
          </button>
        </div>
        
        {/* Quick Keyboard Hints */}
        <div className="flex items-center space-x-3 mt-2 px-1 opacity-40">
          <span className="text-[8px] font-mono text-editor-text-muted uppercase tracking-widest">[Tab] Next Cast</span>
          <span className="text-[8px] font-mono text-editor-text-muted uppercase tracking-widest">[Enter] Commit</span>
        </div>
      </div>
    </div>
  );
};
