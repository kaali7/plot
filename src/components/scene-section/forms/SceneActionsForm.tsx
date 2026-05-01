import React, { useState } from 'react';

interface ActionEntry {
  characterId: string;
  action: string;
}

interface SceneActionsFormProps {
  data: string; // The background field from Scene
  characters: any[];
  onUpdate: (data: string) => void;
}

export const SceneActionsForm: React.FC<SceneActionsFormProps> = ({ data, characters, onUpdate }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState('');
  const [actionContent, setActionContent] = useState('');

  // Try to parse existing data as structured actions, or default to empty list
  let actions: ActionEntry[] = [];
  try {
    if (data && data.startsWith('[') && data.endsWith(']')) {
      actions = JSON.parse(data);
    } else if (data) {
      // Legacy data: treat as a single action with no character
      actions = [{ characterId: '', action: data }];
    }
  } catch (e) {
    actions = [{ characterId: '', action: data }];
  }

  const addAction = () => {
    if (actionContent.trim()) {
      const newAction: ActionEntry = {
        characterId: selectedCharacterId,
        action: actionContent.trim()
      };
      const newActions = [...actions, newAction];
      onUpdate(JSON.stringify(newActions));
      setActionContent('');
      setSelectedCharacterId('');
    }
  };

  const removeAction = (index: number) => {
    const newActions = actions.filter((_, i) => i !== index);
    onUpdate(JSON.stringify(newActions));
  };

  return (
    <div className="space-y-6">
      {/* Add Action */}
      <div className="bg-[#0a000f]/40 p-4 rounded-xl border border-purple-900/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Character (Optional)</label>
            <select
              value={selectedCharacterId}
              onChange={(e) => setSelectedCharacterId(e.target.value)}
              className="w-full bg-[#1a001f] border border-purple-900/30 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
            >
              <option value="">No character / Environment</option>
              {characters.map(char => (
                <option key={char.id} value={char.id}>{char.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">Action Description</label>
            <textarea
              value={actionContent}
              onChange={(e) => setActionContent(e.target.value)}
              className="w-full bg-[#1a001f] border border-purple-900/30 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none resize-none min-h-[42px]"
              placeholder="e.g., Slaps the table, rain starts falling..."
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={addAction}
            disabled={!actionContent.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-purple-900/20"
          >
            Add Action
          </button>
        </div>
      </div>

      {/* Action List */}
      <div className="space-y-3">
        {actions.length > 0 ? (
          actions.map((entry, index) => {
            const character = characters.find(c => c.id === entry.characterId);
            return (
              <div key={index} className="group flex items-start justify-between bg-[#1a001f] border border-purple-900/30 p-3 rounded-xl hover:border-purple-500/50 transition-all">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">
                      {character?.name || 'Action'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed italic">
                    {entry.action}
                  </p>
                </div>
                <button
                  onClick={() => removeAction(index)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 p-1 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 border-2 border-dashed border-purple-900/10 rounded-2xl text-gray-500 text-sm italic">
            No background actions added yet
          </div>
        )}
      </div>
    </div>
  );
};
