import React, { useRef, useState } from 'react';
import type { Dialogue, Character } from '../../../types/story.types';
import { FiChevronDown, FiChevronUp, FiSend, FiTrash2, FiUser, FiZap } from 'react-icons/fi';

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
    type: 'dialogue' | 'action';
    content: string;
    characterId: string;
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
    if (activeEntry === index) {
      setActiveEntry(null);
    }
  };

  const moveEntry = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === data.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newDialogue = [...data];
    const temp = newDialogue[index];
    newDialogue[index] = newDialogue[newIndex];
    newDialogue[newIndex] = temp;

    onUpdate(newDialogue.map((entry, i) => ({ ...entry, order: i })));
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
    setNewBeat(prev => ({
      ...prev,
      content: '',
      characterId: prev.characterId || characters[0]?.id || ''
    }));

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      setActiveEntry(data.length);
    }, 100);
  };

  const handleNewBeatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitNewBeat();
    }
  };

  const autoResize = (target: HTMLTextAreaElement, maxHeight = 220) => {
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, maxHeight)}px`;
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#ed4245', '#5865f2', '#3ba55c', '#faa61a', '#eb459e', '#7289da'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getCharacterName = (characterId: string) =>
    characters.find(c => c.id === characterId)?.name || 'Narrator';

  return (
    <div className="relative flex h-full flex-col overflow-hidden overflow-x-hidden bg-[#0f1014]">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(88,101,242,0.08),_transparent_35%),linear-gradient(180deg,_#11131a_0%,_#0b0c10_100%)] px-2 py-2 sm:px-4 sm:py-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {data.length > 0 ? (
          <div className="space-y-3 pb-24 sm:space-y-4 sm:pb-28">
            {data.map((entry, idx) => {
              const character = entry.characterId ? characters.find(c => c.id === entry.characterId) : null;
              const charName = character?.name || 'Narrator';
              const avatarColor = getAvatarColor(charName);
              const isAction = entry.type === 'action';
              const isActive = activeEntry === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveEntry(idx)}
                  className="group transition-all duration-300"
                >
                  {isAction ? (
                    <div className="flex flex-col">
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.24em] text-[#676d79]">
                          <FiZap size={9} />
                          <span>Beat {idx + 1}</span>
                          <span>Action</span>
                        </div>
                        <div className={`flex items-center gap-0.5 rounded-full bg-white/[0.03] p-0.5 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveEntry(idx, 'up'); }}
                            className="rounded-full p-1.5 text-[#9097a4] transition hover:bg-white/8 hover:text-white"
                            aria-label="Move beat up"
                          >
                            <FiChevronUp size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveEntry(idx, 'down'); }}
                            className="rounded-full p-1.5 text-[#9097a4] transition hover:bg-white/8 hover:text-white"
                            aria-label="Move beat down"
                          >
                            <FiChevronDown size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeEntry(idx); }}
                            className="rounded-full p-1.5 text-[#f06b72] transition hover:bg-[#f06b72]/10 hover:text-[#ff8a91]"
                            aria-label="Delete beat"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className={`w-full rounded-[18px] bg-[#11131a] px-3 py-2.5 sm:px-5 sm:py-4 border transition-all duration-300 ${isActive ? 'border-white/10 bg-[#161821]' : 'border-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]'}`}>
                        <textarea
                          value={entry.content}
                          onChange={(e) => updateEntry(idx, { content: e.target.value })}
                          onFocus={() => setActiveEntry(idx)}
                          onKeyDown={(e) => handleKeyDown(e, idx)}
                          rows={1}
                          className="w-full resize-none overflow-hidden bg-transparent px-0 py-0 text-[13px] sm:text-[14px] italic leading-6 text-[#a3a9b5] outline-none"
                          onInput={(e) => autoResize(e.target as HTMLTextAreaElement, 9999)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="mb-1.5 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="truncate text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.16em]"
                            style={{ color: avatarColor }}
                          >
                            {charName}
                          </span>
                          <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.16em] text-[#606774]">
                            Beat {idx + 1}
                          </span>
                        </div>

                        <div className={`flex items-center gap-0.5 rounded-full bg-white/[0.03] p-0.5 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveEntry(idx, 'up'); }}
                            className="rounded-full p-1.5 text-[#9097a4] transition hover:bg-white/8 hover:text-white"
                            aria-label="Move beat up"
                          >
                            <FiChevronUp size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveEntry(idx, 'down'); }}
                            className="rounded-full p-1.5 text-[#9097a4] transition hover:bg-white/8 hover:text-white"
                            aria-label="Move beat down"
                          >
                            <FiChevronDown size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeEntry(idx); }}
                            className="rounded-full p-1.5 text-[#f06b72] transition hover:bg-[#f06b72]/10 hover:text-[#ff8a91]"
                            aria-label="Delete beat"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className={`rounded-2xl bg-[#1a1d24] px-3 py-3 sm:px-5 sm:py-4 border transition-all duration-300 ${isActive ? 'border-[#5865f2]/50 bg-[#1e212b] shadow-[0_4px_20px_-4px_rgba(88,101,242,0.15)]' : 'border-white/5 shadow-sm'}`}>
                        <textarea
                          value={entry.content}
                          onChange={(e) => updateEntry(idx, { content: e.target.value })}
                          onFocus={() => setActiveEntry(idx)}
                          onKeyDown={(e) => handleKeyDown(e, idx)}
                          rows={1}
                          className="w-full resize-none overflow-hidden bg-transparent px-0 py-0 text-[13px] sm:text-[14px] leading-6 text-[#edf1f8] outline-none"
                          onInput={(e) => autoResize(e.target as HTMLTextAreaElement, 9999)}
                        />
                      </div>

                      {isActive && (
                        <div className="mt-2 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="relative w-full sm:max-w-[174px]">
                            <FiUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={11} />
                            <select
                              value={entry.characterId}
                              onChange={(e) => updateEntry(idx, { characterId: e.target.value })}
                              className="w-full appearance-none rounded-full border border-white/8 bg-[#0d1017] py-1.5 pl-8 pr-8 text-[10px] font-medium text-white outline-none transition focus:border-[#5865f2]/70"
                            >
                              <option value="">Narrator</option>
                              {characters.map(char => (
                                <option key={char.id} value={char.id}>
                                  {char.name}
                                </option>
                              ))}
                            </select>
                            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/35" size={11} />
                          </div>
                          <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-[0.18em] text-[#606774]">
                            Speaker: {getCharacterName(entry.characterId)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-full items-center justify-center px-4 py-12">
            <div className="max-w-md rounded-[24px] border border-white/8 bg-white/[0.03] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.28)] sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Start the scene rhythm</h2>
              <p className="mt-2 text-xs sm:text-sm leading-6 sm:leading-7 text-[#b5bac1]">
                Add dialogue or action beats below. Tap any beat later to change its speaker or refine the wording.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 inset-x-0 bg-gradient-to-t from-[#090a0d] via-[#090a0df2] to-transparent px-2 pb-2 pt-2 sm:px-4 sm:pb-4 sm:pt-5">
        <div className="mx-auto rounded-[18px] bg-[#111319]/98 p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:rounded-[22px] sm:p-3">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 pb-0.5">
              <div className="flex min-w-0 gap-1">
                <button
                  onClick={() => setNewBeat(prev => ({ ...prev, type: 'action' }))}
                  className={`rounded-full px-2.5 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.16em] transition ${
                    newBeat.type === 'action'
                      ? 'bg-[#3f4452] text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)]'
                      : 'bg-white/[0.04] text-[#9aa1ad] hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FiZap size={11} />
                    Action
                  </span>
                </button>
                <button
                  onClick={() => setNewBeat(prev => ({ ...prev, type: 'dialogue', characterId: prev.characterId || characters[0]?.id || '' }))}
                  className={`rounded-full px-2.5 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.16em] transition ${
                    newBeat.type === 'dialogue'
                      ? 'bg-[linear-gradient(180deg,#7079ff_0%,#5865f2_100%)] text-white shadow-[0_10px_24px_rgba(88,101,242,0.35)]'
                      : 'bg-white/[0.04] text-[#9aa1ad] hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  Dialogue
                </button>
              </div>

              {newBeat.type === 'dialogue' && (
                <div className="relative min-w-0 w-full sm:w-[176px]">
                  <FiUser className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/35" size={10} />
                  <select
                    value={newBeat.characterId}
                    onChange={(e) => setNewBeat(prev => ({ ...prev, characterId: e.target.value }))}
                    className="w-full appearance-none rounded-full bg-[#1a1c24] py-1 pl-7 pr-7 text-[9px] font-medium text-white outline-none transition focus:ring-1 focus:ring-[#5865f2]/45"
                  >
                    <option value="">Narrator</option>
                    {characters.map(char => (
                      <option key={char.id} value={char.id}>
                        {char.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/35" size={10} />
                </div>
              )}
            </div>

            <div className="rounded-[16px] bg-[#0d1017] px-3 py-2">
              <div className="flex items-end gap-2">
                <textarea
                  value={newBeat.content}
                  onChange={(e) => setNewBeat(prev => ({ ...prev, content: e.target.value }))}
                  onKeyDown={handleNewBeatKeyDown}
                  placeholder={newBeat.type === 'action' ? 'Describe the action beat...' : 'Write the next line...'}
                  rows={1}
                  className="max-h-20 min-h-[20px] flex-1 resize-none bg-transparent text-[12px] sm:text-[14px] leading-5 text-white outline-none placeholder:text-[#5f6673]"
                  onInput={(e) => autoResize(e.target as HTMLTextAreaElement, 80)}
                />
                <button
                  onClick={submitNewBeat}
                  disabled={newBeat.content.trim() === ''}
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full transition ${
                    newBeat.content.trim() !== ''
                      ? 'bg-[linear-gradient(180deg,#7079ff_0%,#5865f2_100%)] text-white shadow-[0_12px_28px_rgba(88,101,242,0.4)] hover:brightness-110'
                      : 'bg-white/[0.05] text-white/25'
                  }`}
                  aria-label="Add beat"
                >
                  <FiSend size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
