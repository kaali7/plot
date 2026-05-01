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
      // Keep the character selected for ease of use
    }
  };

  const removeEntry = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Input Area */}
      <div className="bg-[#0a000f]/60 p-6 rounded-2xl border border-purple-900/30 shadow-inner">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-1">
            <label className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Character</label>
            <select
              value={selectedCharacterId}
              onChange={(e) => setSelectedCharacterId(e.target.value)}
              className="w-full bg-[#1a001f] border border-purple-900/30 rounded-xl px-3 py-2.5 text-white text-sm focus:border-purple-500 outline-none transition-all"
            >
              <option value="">Environment / Narrator</option>
              {characters.map(char => (
                <option key={char.id} value={char.id}>{char.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">Speech or Action</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#1a001f] border border-purple-900/30 rounded-xl px-4 py-2.5 text-white text-sm focus:border-purple-500 outline-none transition-all resize-none min-h-[46px]"
              placeholder="Type dialogue or describe an action..."
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={() => addEntry('action')}
            disabled={!content.trim()}
            className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 disabled:opacity-30"
          >
            🎬 Add as Action
          </button>
          <button
            onClick={() => addEntry('dialogue')}
            disabled={!content.trim() || !selectedCharacterId}
            className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-900/20 disabled:opacity-30"
          >
            💬 Add as Dialogue
          </button>
        </div>
      </div>

      {/* Script List */}
      <div className="space-y-2 font-mono">
        {data.length > 0 ? (
          data.map((entry, index) => {
            const character = characters.find(c => c.id === entry.characterId);
            const isAction = entry.type === 'action';

            return (
              <div 
                key={index} 
                className={`group flex items-start py-1.5 px-3 rounded hover:bg-purple-900/10 transition-all border-l-2 ${
                  isAction ? 'border-purple-500/50' : 'border-purple-300/30'
                }`}
              >
                <div className="flex-1 flex items-start space-x-2 overflow-hidden">
                  <span className={`flex-shrink-0 font-bold uppercase tracking-tighter text-xs min-w-[100px] text-right pt-0.5 ${
                    isAction ? 'text-purple-400' : 'text-purple-300'
                  }`}>
                    {isAction ? 'Background' : (character?.name || 'Narrator')}:
                  </span>
                  
                  <p className={`text-sm leading-relaxed ${isAction ? 'text-gray-400 italic' : 'text-gray-200'}`}>
                    {isAction ? entry.content : `"${entry.content}"`}
                  </p>
                </div>

                <button
                  onClick={() => removeEntry(index)}
                  className="opacity-0 group-hover:opacity-100 ml-4 p-1 text-red-500/60 hover:text-red-400 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-purple-900/10 rounded-3xl">
            <p className="text-gray-500 text-sm italic font-sans">Start your scene script by adding dialogues and actions above.</p>
          </div>
        )}
      </div>
    </div>
  );
};
