import React, { useState } from 'react';

interface DialogueEntry {
  characterId: string;
  content: string;
  order: number;
}

interface SceneDialogueFormProps {
  data: DialogueEntry[];
  characters: any[]; // Character type with id and name
  onUpdate: (data: DialogueEntry[]) => void;
}

export const SceneDialogueForm: React.FC<SceneDialogueFormProps> = ({ data, characters, onUpdate }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState('');
  const [dialogueContent, setDialogueContent] = useState('');

  const addDialogue = () => {
    if (selectedCharacterId && dialogueContent.trim()) {
      const newDialogue: DialogueEntry = {
        characterId: selectedCharacterId,
        content: dialogueContent.trim(),
        order: data.length
      };
      onUpdate(prev => [...prev, newDialogue]);
      setSelectedCharacterId('');
      setDialogueContent('');
    }
  };

  const updateDialogueContent = (index: number, content: string) => {
    onUpdate((prev: DialogueEntry[]) => {
      const newData = [...prev];
      newData[index] = {
        ...newData[index],
        content
      };
      return newData;
    });
  };

  const removeDialogue = (index: number) => {
    onUpdate(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Add Dialogue */}
      <div className="space-y-4">
        <h4 className="text-purple-300 font-medium mb-2">Add Dialogue</h4>
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-purple-300 mb-1">Character</label>
              <select
                value={selectedCharacterId}
                onChange={(e) => setSelectedCharacterId(e.target.value)}
                className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select a character</option>
                {characters.map(char => (
                  <option key={char.id} value={char.id}>
                    {char.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-purple-300 mb-1">Content</label>
              <textarea
                value={dialogueContent}
                onChange={(e) => setDialogueContent(e.target.value)}
                className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[60px]"
                placeholder="Enter dialogue"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-3">
            <button
              onClick={addDialogue}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              disabled={!selectedCharacterId || !dialogueContent.trim()}
            >
              Add Dialogue
            </button>
          </div>
        </div>
      </div>

      {/* Existing Dialogue */}
      {data.length > 0 ? (
        <div className="mt-6">
          <h4 className="text-purple-300 font-medium mb-3">Scene Dialogue</h4>
          <div className="space-y-2">
            {data.map((dialogue, index) => {
              const character = characters.find(c => c.id === dialogue.characterId);
              return (
                <div key={index} className="bg-[#2a003f] border border-purple-700/30 rounded-lg p-3">
                  <div className="flex items-start space-x-2 mb-2">
                    <span className="flex-shrink-0 text-purple-400">"</span>
                    <span className="text-gray-300">{dialogue.content}</span>
                    <span className="flex-shrink-0 text-purple-400">"</span>
                    <span className="ml-2 text-xs text-purple-300">— {character?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const newContent = prompt('Edit dialogue:', dialogue.content);
                        if (newContent !== null && newContent.trim() !== '') {
                          updateDialogueContent(index, newContent.trim());
                        }
                      }}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4H6a2 2 0 00-2 2v14a5 5 0 009.9-9zM11 4h8v1" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeDialogue(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-purple-400">
          No dialogue added to this scene yet
        </div>
      )}
    </div>
  );
};