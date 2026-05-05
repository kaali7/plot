import React, { useState, useRef } from 'react';
import type { Dialogue, Character } from '../../../types/story.types';
import { FiTrash2, FiChevronUp, FiChevronDown, FiUser, FiMessageSquare } from 'react-icons/fi';

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
  
  const [newBeat, setNewBeat] = useState<{
    type: 'dialogue' | 'action',
    content: string,
    characterId: string
  }>({
    type: 'dialogue',
    content: '',
    characterId: characters[0]?.id || ''
  });

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

    const orderedDialogue = newDialogue.map((entry, i) => ({ ...entry, order: i }));
    onUpdate(orderedDialogue);
    setActiveEntry(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && data[index].content === '' && data.length > 1) {
      e.preventDefault();
      removeEntry(index);
      setActiveEntry(Math.max(0, index - 1));
    } else if (e.key === 'ArrowUp' && e.ctrlKey) {
      moveEntry(index, 'up');
    } else if (e.key === 'ArrowDown' && e.ctrlKey) {
      moveEntry(index, 'down');
    }
  };

  const submitNewBeat = () => {
    if (newBeat.content.trim() === '') return;
    
    const entry: Dialogue = {
      characterId: newBeat.type === 'action' ? '' : newBeat.characterId,
      content: newBeat.content,
      order: data.length,
      type: newBeat.type
    };
    onUpdate([...data, entry]);
    setNewBeat(prev => ({ ...prev, content: '' }));
    
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleNewBeatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitNewBeat();
    }
  };

  return (
    <div className="flex flex-col h-[65vh] relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Chronicle Beats</h3>
          <p className="text-[10px] font-serif text-white/20 italic">The tactile flow of voices and events.</p>
        </div>
      </div>

      {/* Beats List */}
      <div 
        className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar scroll-smooth pb-32" 
        ref={scrollRef}
      >
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
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex flex-col space-y-1 text-white/10 hover:text-white/40">
                  <button onClick={() => moveEntry(idx, 'up')} className="hover:text-editor-magenta"><FiChevronUp size={14} /></button>
                  <button onClick={() => moveEntry(idx, 'down')} className="hover:text-editor-magenta"><FiChevronDown size={14} /></button>
                </div>

                <div className="p-4 md:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-editor-magenta/80">
                          {entry.characterId ? characters.find(c => c.id === entry.characterId)?.name : 'Narrator'}
                        </span>
                        <div className="opacity-20">
                          <FiUser size={10} />
                        </div>
                      </div>

                      <div className={`text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border transition-all ${
                        entry.type === 'action' 
                          ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' 
                          : 'border-white/10 text-editor-text-muted'
                      }`}>
                        {entry.type === 'action' ? 'Action' : 'Dialogue'}
                      </div>
                    </div>

                    <button
                      onClick={() => removeEntry(idx)}
                      className="opacity-0 group-hover:opacity-40 hover:opacity-100 text-red-500 transition-all"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>

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
               <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">The chronicle is empty</p>
               <p className="text-[10px] font-serif text-white/20 italic">Speak or act below to begin.</p>
             </div>
          </div>
        )}
      </div>

      {/* Message-style Entry Box */}
      <div className="absolute bottom-0 left-0 right-0 pt-6 pb-2 px-1 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f] to-transparent z-10">
        <div className="flex flex-col space-y-3 bg-white/[0.03] border border-white/10 rounded-2xl p-3 backdrop-blur-xl shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex bg-white/5 rounded-full p-0.5 border border-white/10">
                <button
                  onClick={() => setNewBeat(prev => ({ ...prev, type: 'action' }))}
                  className={`px-3 py-1 rounded-full text-[8px] font-mono font-bold uppercase tracking-widest transition-all ${
                    newBeat.type === 'action' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-white/30 hover:text-white/50'
                  }`}
                >
                  Action
                </button>
                <button
                  onClick={() => setNewBeat(prev => ({ ...prev, type: 'dialogue' }))}
                  className={`px-3 py-1 rounded-full text-[8px] font-mono font-bold uppercase tracking-widest transition-all ${
                    newBeat.type === 'dialogue' 
                      ? 'bg-editor-magenta/20 text-editor-magenta' 
                      : 'text-white/30 hover:text-white/50'
                  }`}
                >
                  Dialogue
                </button>
              </div>

              {newBeat.type === 'dialogue' && (
                <div className="flex items-center space-x-2 bg-white/5 rounded-full px-3 py-1 border border-white/10">
                  <FiUser size={10} className="text-white/20" />
                  <select
                    value={newBeat.characterId}
                    onChange={(e) => setNewBeat(prev => ({ ...prev, characterId: e.target.value }))}
                    className="bg-transparent text-[8px] font-mono font-bold uppercase tracking-widest text-white/60 outline-none cursor-pointer pr-1"
                  >
                    <option value="" className="bg-[#0a0a0f]">Narrator</option>
                    {characters.map(char => (
                      <option key={char.id} value={char.id} className="bg-[#0a0a0f]">{char.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end space-x-3">
            <textarea
              value={newBeat.content}
              onChange={(e) => setNewBeat(prev => ({ ...prev, content: e.target.value }))}
              onKeyDown={handleNewBeatKeyDown}
              placeholder={newBeat.type === 'action' ? "Describe action..." : "Enter dialogue..."}
              className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-editor-magenta/30 transition-all resize-none max-h-32"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            <button
              onClick={submitNewBeat}
              disabled={newBeat.content.trim() === ''}
              className={`p-3 rounded-xl transition-all ${
                newBeat.content.trim() !== '' 
                  ? 'bg-editor-magenta text-white shadow-lg shadow-editor-magenta/40' 
                  : 'bg-white/5 text-white/10'
              }`}
            >
              <FiChevronUp size={20} className="stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
