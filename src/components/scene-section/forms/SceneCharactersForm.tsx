import React, { useState } from 'react';

interface SceneCharacter {
  characterId: string;
  role: 'lead' | 'support' | 'antagonist' | 'background';
}

interface SceneCharactersFormProps {
  data: SceneCharacter[];
  characters: any[]; // Character type with id and name
  onUpdate: (data: SceneCharacter[]) => void;
}

export const SceneCharactersForm: React.FC<SceneCharactersFormProps> = ({ data, characters, onUpdate }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState('');
  const [selectedRole, setSelectedRole] = useState<'lead' | 'support' | 'antagonist' | 'background'>('lead');

  const roles = [
    { value: 'lead', label: 'Lead' },
    { value: 'support', label: 'Supporting' },
    { value: 'antagonist', label: 'Antagonist' },
    { value: 'background', label: 'Background' }
  ];

    const addCharacterToScene = () => {
      if (selectedCharacterId) {
        const newCharacter: SceneCharacter = {
          characterId: selectedCharacterId,
          role: selectedRole
        };
        onUpdate([...data, newCharacter]);
        setSelectedCharacterId('');
      }
    };

  const removeCharacterFromScene = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  const updateCharacterRole = (index: number, role: 'lead' | 'support' | 'antagonist' | 'background') => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      role
    };
    onUpdate(newData);
  };

  return (
    <div className="space-y-6">
      {/* Add Character to Scene */}
      <div className="space-y-4">
        <h4 className="text-purple-300 font-medium mb-2">Add Character to Scene</h4>
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
              <label className="block text-purple-300 mb-1">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-3">
            <button
              onClick={addCharacterToScene}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              disabled={!selectedCharacterId}
            >
              Add Character
            </button>
          </div>
        </div>
      </div>

      {/* Characters in Scene */}
      {data.length > 0 ? (
        <div className="mt-6">
          <h4 className="text-purple-300 font-medium mb-3">Characters in Scene</h4>
          <div className="space-y-2">
            {data.map((char, index) => {
              const character = characters.find(c => c.id === char.characterId);
              return (
                <div key={index} className="bg-[#2a003f] border border-purple-700/30 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <span className="flex-shrink-0 text-purple-400">👤</span>
                    <div className="flex-1">
                      <p className="flex items-center space-x-2 mb-1">
                        <span className="text-gray-300">{character?.name || 'Unknown Character'}</span>
                        <span className={`text-purple-300 px-2 py-0.5 rounded`}>
                          {char.role}
                        </span>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateCharacterRole(index, char.role === 'lead' ? 'support' : 
                                                      char.role === 'support' ? 'antagonist' : 
                                                      char.role === 'antagonist' ? 'background' : 'lead')}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeCharacterFromScene(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-purple-400">
          No characters added to this scene yet
        </div>
      )}
    </div>
  );
};