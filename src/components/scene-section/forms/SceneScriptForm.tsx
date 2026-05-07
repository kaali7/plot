import React, { useState, useRef } from 'react';
import type { Dialogue, Character } from '../../../types/story.types';
import { FiTrash2, FiChevronUp, FiChevronDown, FiMessageSquare, FiZap } from 'react-icons/fi';

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

  // Avatar color helper
  const getAvatarColor = (name: string) => {
    const colors = [
      '#ed4245', '#5865f2', '#3ba55c', '#faa61a', '#eb459e', '#7289da'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="flex flex-col h-full bg-[#313338] relative overflow-hidden">
      {/* Discord-like Header */}
      <div className="flex items-center px-4 h-12 border-b border-[#26272d] bg-[#313338] shrink-0 shadow-sm z-20">
        <div className="flex items-center space-x-2 text-[#949ba4]">
          <FiMessageSquare className="text-[#80848e]" />
          <span className="font-bold text-white text-sm">chronicle-script</span>
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          <p className="text-xs font-medium truncate max-w-md hidden md:block">The tactical flow of voices and events.</p>
        </div>
      </div>

      {/* Beats List (Chat Area) */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar px-1 pt-4 pb-48 flex flex-col-reverse" 
        style={{ scrollBehavior: 'smooth' }}
        ref={scrollRef}
      >
        <div className="flex flex-col justify-end min-h-full">
          {data.length > 0 ? (
            data.map((entry, idx) => {
              const character = entry.characterId ? characters.find(c => c.id === entry.characterId) : null;
              const charName = character?.name || 'Narrator';
              const avatarColor = getAvatarColor(charName);
              
              return (
                <div 
                  key={idx}
                  className="group relative px-4 py-1 flex items-start space-x-4 hover:bg-[#2e3035] transition-colors"
                >
                  {/* Floating Action Menu on Hover */}
                  <div className="absolute right-4 top-[-16px] opacity-0 group-hover:opacity-100 transition-all z-20">
                    <div className="flex items-center bg-[#313338] border border-[#26272d] rounded shadow-xl overflow-hidden">
                      <button onClick={() => moveEntry(idx, 'up')} className="p-1.5 hover:bg-[#3f4147] text-[#b5bac1] hover:text-white"><FiChevronUp size={14} /></button>
                      <button onClick={() => moveEntry(idx, 'down')} className="p-1.5 hover:bg-[#3f4147] text-[#b5bac1] hover:text-white"><FiChevronDown size={14} /></button>
                      <button onClick={() => removeEntry(idx)} className="p-1.5 hover:bg-[#3f4147] text-[#ed4245]"><FiTrash2 size={14} /></button>
                    </div>
                  </div>

                  {/* Avatar */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 mt-0.5 shadow-md"
                    style={{ backgroundColor: entry.type === 'action' ? '#4e5058' : avatarColor }}
                  >
                    {entry.type === 'action' ? <FiZap size={18} /> : charName.charAt(0)}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2">
                      <span 
                        className="font-bold hover:underline cursor-pointer transition-all"
                        style={{ color: entry.type === 'action' ? '#949ba4' : avatarColor }}
                      >
                        {charName}
                      </span>
                      <span className="text-[10px] text-[#949ba4] font-medium uppercase tracking-tighter">
                        Beat #{idx + 1}
                      </span>
                      {entry.type === 'action' && (
                        <span className="bg-[#4e5058] text-[#ffffff] text-[8px] font-bold px-1 rounded-[3px] uppercase tracking-tighter h-3 flex items-center">
                          Action
                        </span>
                      )}
                    </div>
                    
                    <div className="relative mt-1">
                      <textarea
                        value={entry.content}
                        onChange={(e) => updateEntry(idx, { content: e.target.value })}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        rows={1}
                        className={`w-full bg-transparent border-none outline-none resize-none leading-snug ${
                          entry.type === 'action' 
                            ? 'text-[#b5bac1] italic text-sm' 
                            : 'text-[#dbdee1] text-[15px]'
                        }`}
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
            <div className="px-12 py-20">
              <div className="w-16 h-16 rounded-full bg-[#4e5058] flex items-center justify-center text-white/40 mb-6">
                <FiMessageSquare size={32} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to the Chronicle</h2>
              <p className="text-[#b5bac1] text-sm leading-relaxed max-w-md">
                This is the beginning of your scene. Start by adding dialogue or actions using the input below.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Discord-like Message Input Box */}
      <div className="px-4 pb-6 pt-2 shrink-0 z-10 bg-[#313338]">
        <div className="bg-[#383a40] rounded-lg px-4 py-2.5 flex flex-col space-y-2">
          {/* Top Row: Type Selector & Character */}
          <div className="flex items-center justify-between pb-1">
             <div className="flex items-center space-x-2">
                <button
                  onClick={() => setNewBeat(prev => ({ ...prev, type: 'action' }))}
                  className={`flex items-center space-x-1 px-2 py-0.5 rounded transition-all text-[10px] font-bold uppercase tracking-wider
                  ${newBeat.type === 'action' ? 'bg-[#4e5058] text-white' : 'text-[#b5bac1] hover:bg-[#3f4147] hover:text-white'}`}
                >
                  <FiZap size={12} />
                  <span>Action</span>
                </button>
                <button
                  onClick={() => setNewBeat(prev => ({ ...prev, type: 'dialogue' }))}
                  className={`flex items-center space-x-1 px-2 py-0.5 rounded transition-all text-[10px] font-bold uppercase tracking-wider
                  ${newBeat.type === 'dialogue' ? 'bg-[#5865f2] text-white' : 'text-[#b5bac1] hover:bg-[#3f4147] hover:text-white'}`}
                >
                  <FiMessageSquare size={12} />
                  <span>Dialogue</span>
                </button>
             </div>

             {newBeat.type === 'dialogue' && (
               <div className="flex items-center space-x-2 text-[#b5bac1] text-[10px] font-bold uppercase tracking-wider">
                 <span>Speaking as:</span>
                 <select
                   value={newBeat.characterId}
                   onChange={(e) => setNewBeat(prev => ({ ...prev, characterId: e.target.value }))}
                   className="bg-transparent text-white outline-none cursor-pointer border-b border-white/10"
                 >
                   <option value="" className="bg-[#313338]">Narrator</option>
                   {characters.map(char => (
                     <option key={char.id} value={char.id} className="bg-[#313338]">{char.name}</option>
                   ))}
                 </select>
               </div>
             )}
          </div>

          {/* Main Input Row */}
          <div className="flex items-end space-x-3">
            <button className="p-1 rounded-full bg-[#b5bac1]/10 text-[#b5bac1] hover:bg-[#b5bac1]/20 hover:text-white transition-all shrink-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-lg leading-none">+</div>
            </button>
            
            <textarea
              value={newBeat.content}
              onChange={(e) => setNewBeat(prev => ({ ...prev, content: e.target.value }))}
              onKeyDown={handleNewBeatKeyDown}
              placeholder={newBeat.type === 'action' ? "Describe action..." : "Enter dialogue..."}
              className="flex-1 bg-transparent text-white text-[15px] outline-none resize-none max-h-40 py-0.5 custom-scrollbar"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 160) + 'px';
              }}
            />
            
            <div className="flex items-center space-x-2 shrink-0">
               <button 
                 onClick={submitNewBeat}
                 disabled={newBeat.content.trim() === ''}
                 className={`p-1.5 rounded transition-all ${
                   newBeat.content.trim() !== '' 
                     ? 'text-[#5865f2] hover:scale-110' 
                     : 'text-[#b5bac1]/20'
                 }`}
               >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                 </svg>
               </button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-[#949ba4] mt-2 px-1">
          <span className="font-bold">Shift + Enter</span> for new line • <span className="font-bold">Enter</span> to send
        </p>
      </div>
    </div>
  );
};
