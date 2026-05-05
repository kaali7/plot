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

  const roles: { value: SceneCharacter['role']; label: string }[] = [
    { value: 'lead', label: 'Lead' },
    { value: 'support', label: 'Supporting' },
    { value: 'antagonist', label: 'Antagonist' },
    { value: 'background', label: 'Background' }
  ];

  const addCharacterToScene = () => {
    if (selectedCharacterId) {
      if (data.some(c => c.characterId === selectedCharacterId)) return; // Prevent duplicates
      
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

  const updateCharacterRole = (index: number, role: SceneCharacter['role']) => {
    const newData = [...data];
    newData[index] = { ...newData[index], role };
    onUpdate(newData);
  };

  return (
    <div className="space-y-8">
      {/* Add Character to Scene */}
      <section className="space-y-4">
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Cast Narrative Assembly</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedCharacterId}
            onChange={(e) => setSelectedCharacterId(e.target.value)}
            className="w-full select-tactile text-sm"
          >
            <option value="">Select Identity...</option>
            {characters.map(char => (
              <option key={char.id} value={char.id} disabled={data.some(c => c.characterId === char.id)}>
                {char.name} {data.some(c => c.characterId === char.id) ? '(Present)' : ''}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="flex-1 select-tactile text-xs uppercase tracking-widest"
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label.toUpperCase()}
                </option>
              ))}
            </select>
            <button
              onClick={addCharacterToScene}
              disabled={!selectedCharacterId}
              className="px-6 py-2 bg-editor-magenta/10 text-editor-magenta rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-editor-magenta/20 transition-all border border-editor-magenta/20 disabled:opacity-30"
            >
              Cast
            </button>
          </div>
        </div>
      </section>

      {/* Characters in Scene */}
      <section className="space-y-4">
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Active Participants</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.length === 0 ? (
            <div className="md:col-span-2 text-center py-8 border border-dashed border-white/5 rounded-2xl opacity-40">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em]">The stage is empty.</p>
            </div>
          ) : (
            data.map((char, index) => {
              const character = characters.find(c => c.id === char.characterId);
              return (
                <div key={index} className="group flex items-center gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all">
                  <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center font-serif text-sm italic text-white/40">
                    {character?.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-serif font-bold text-white/80 truncate">{character?.name || 'Unknown'}</h5>
                    <div className="flex gap-1.5 mt-1">
                      {roles.map(role => (
                        <button
                          key={role.value}
                          onClick={() => updateCharacterRole(index, role.value)}
                          className={`text-[7px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-[0.1em] transition-all
                            ${char.role === role.value 
                              ? 'bg-editor-magenta/20 text-editor-magenta border border-editor-magenta/30 shadow-[0_0_8px_rgba(255,0,85,0.1)]' 
                              : 'bg-white/[0.02] text-white/20 border border-transparent hover:text-white/40'}`}
                        >
                          {role.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeCharacterFromScene(index)}
                    className="p-2 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};