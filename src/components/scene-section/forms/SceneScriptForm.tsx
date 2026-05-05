import React, { useState, useCallback, useRef } from 'react';
import type { Dialogue, Character } from '../../../types/story.types';
import { FiPlus, FiTrash2, FiChevronUp, FiChevronDown, FiUser, FiMessageSquare } from 'react-icons/fi';

interface SceneScriptFormProps {
  data: Dialogue[];
  characters: Character[];
  onUpdate: (data: Dialogue[]) => void;
}

export const SceneScriptForm: React.FC<SceneScriptFormProps> = ({
  data,
  characters,
  onUpdate
}) => {
  const [activeEntry, setActiveEntry] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addEntry = useCallback((type: 'dialogue' | 'action' = 'dialogue') => {
    const newEntry: Dialogue = {
      characterId: characters[0]?.id || '',
      content: '',
      order: data.length,
      type: type
    };
    onUpdate([...data, newEntry]);
    setActiveEntry(data.length);
    
    // Smooth scroll to bottom
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  }, [data, characters, onUpdate]);

  const updateEntry = (index: number, updates: Partial<Dialogue>) => {
    const newDialogue = [...data];
    newDialogue[index] = { ...newDialogue[index], ...updates };
    onUpdate(newDialogue);
  };

  const removeEntry = (index: number) => {
    const newDialogue = data
      .filter((_, i) => i !== index)
      .map((entry, i) => ({ ...entry, order: i }));
    onUpdate(newDialogue);
    if (activeEntry === index) setActiveEntry(null);
  };

  const moveEntry = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === data.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newDialogue = [...data];
    const temp = newDialogue[index];
    newDialogue[index] = newDialogue[newIndex];
    newDialogue[newIndex] = temp;

    // Reset order
    const orderedDialogue = newDialogue.map((entry, i) => ({ ...entry, order: i }));
    onUpdate(orderedDialogue);
    setActiveEntry(newIndex);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addEntry(data[index].type);
    } else if (e.key === 'Backspace' && data[index].content === '' && data.length > 1) {
      e.preventDefault();
      removeEntry(index);
      setActiveEntry(Math.max(0, index - 1));
    } else if (e.key === 'ArrowUp' && e.ctrlKey) {
      moveEntry(index, 'up');
    } else if (e.key === 'ArrowDown' && e.ctrlKey) {
      moveEntry(index, 'down');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Cycle characters for this entry
      const charIds = ['', ...characters.map(c => c.id)];
      const currentIndex = charIds.indexOf(data[index].characterId || '');
      const nextIndex = (currentIndex + 1) % charIds.length;
      updateEntry(index, { characterId: charIds[nextIndex] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Chronicle Beats</h3>
          <p className="text-[10px] font-serif text-white/20 italic">The tactile flow of voices and events.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => addEntry('action')}
            className="flex items-center space-x-2 text-[9px] font-mono font-bold text-white/40 hover:text-white uppercase tracking-widest transition-all bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
          >
            <FiPlus size={12} />
            <span>Action</span>
          </button>
          <button
            onClick={() => addEntry('dialogue')}
            className="flex items-center space-x-2 text-[9px] font-mono font-bold text-editor-magenta uppercase tracking-widest hover:text-white transition-all bg-editor-magenta/5 px-3 py-1.5 rounded-full border border-editor-magenta/20"
          >
            <FiPlus size={12} />
            <span>Dialogue</span>
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar scroll-smooth" ref={scrollRef}>
        {data.length > 0 ? (
          data.map((entry, idx) => {
            const isActive = activeEntry === idx;

            return (
              <div 
                key={idx}
                className={`group relative transition-all duration-500 rounded-2xl border ${
                  isActive 
                    ? 'bg-white/[0.03] border-editor-magenta/30 shadow-magenta-glow/10' 
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                }`}
                onFocus={() => setActiveEntry(idx)}
              >
                {/* Reorder Handle */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex flex-col space-y-1 text-white/10 hover:text-white/40">
                  <button onClick={() => moveEntry(idx, 'up')} className="hover:text-editor-magenta"><FiChevronUp size={14} /></button>
                  <button onClick={() => moveEntry(idx, 'down')} className="hover:text-editor-magenta"><FiChevronDown size={14} /></button>
                </div>

                <div className="p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Character Selector */}
                      <div className="relative">
                        <select
                          value={entry.characterId || ''}
                          onChange={(e) => updateEntry(idx, { characterId: e.target.value })}
                          className="appearance-none bg-transparent text-[10px] font-mono font-bold uppercase tracking-widest text-editor-magenta/80 hover:text-white transition-colors outline-none cursor-pointer pr-6"
                        >
                          <option value="" className="bg-[#0a0a0f]">Narrator</option>
                          {characters.map(char => (
                            <option key={char.id} value={char.id} className="bg-[#0a0a0f]">{char.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                          <FiUser size={10} />
                        </div>
                      </div>

                      {/* Beat Type Toggle */}
                      <button
                        onClick={() => updateEntry(idx, { type: entry.type === 'action' ? 'dialogue' : 'action' })}
                        className={`text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border transition-all ${
                          entry.type === 'action' 
                            ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' 
                            : 'border-white/10 text-editor-text-muted'
                        }`}
                      >
                        {entry.type === 'action' ? 'Action' : 'Dialogue'}
                      </button>
                    </div>

                    <button
                      onClick={() => removeEntry(idx)}
                      className="opacity-0 group-hover:opacity-40 hover:opacity-100 text-red-500 transition-all"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="relative">
                    <textarea
                      value={entry.content}
                      onChange={(e) => updateEntry(idx, { content: e.target.value })}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      placeholder={entry.type === 'action' ? "Describe the movement..." : "What is spoken?"}
                      className={`w-full bg-transparent border-none outline-none resize-none leading-relaxed text-sm md:text-base ${
                        entry.type === 'action' 
                          ? 'font-serif italic text-white/40' 
                          : 'font-sans text-white/90'
                      }`}
                      autoFocus={isActive && entry.content === ''}
                      rows={1}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = target.scrollHeight + 'px';
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/[0.01] border border-dashed border-white/10 rounded-3xl">
             <div className="w-16 h-16 rounded-full bg-editor-magenta/5 border border-editor-magenta/10 flex items-center justify-center text-editor-magenta/20">
               <FiMessageSquare size={24} />
             </div>
             <div className="space-y-1">
               <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">The page is silent</p>
               <button 
                 onClick={() => addEntry('dialogue')}
                 className="text-[10px] font-serif text-editor-magenta hover:text-white transition-all italic underline decoration-editor-magenta/30 underline-offset-4"
               >
                 Inaugurate the first beat
               </button>
             </div>
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="pt-4 flex flex-wrap gap-4 items-center text-[8px] font-mono text-editor-text-muted uppercase tracking-[0.3em] opacity-40">
          <div className="flex items-center space-x-2">
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">Enter</kbd>
            <span>Next Beat</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">Tab</kbd>
            <span>Cycle Cast</span>
          </div>
          <div className="flex items-center space-x-2">
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded">Ctrl+↑/↓</kbd>
            <span>Reorder</span>
          </div>
        </div>
      )}
    </div>
  );
};
