import React, { useState } from 'react';

interface RelationshipsFormProps {
  data: {
    characterId?: string;
    type?: string;
    description?: string;
  }[];
  onUpdate: (data: {
    characterId?: string;
    type?: string;
    description?: string;
  }[]) => void;
}

const relationshipTypes = [
  'friend',
  'rival',
  'mentor',
  'enemy',
  'family',
  'romantic'
];

export const RelationshipsForm: React.FC<RelationshipsFormProps> = ({ data, onUpdate }) => {
  const [newCharacterId, setNewCharacterId] = useState('');
  const [newType, setNewType] = useState('friend');
  const [newDescription, setNewDescription] = useState('');

  const addRelationship = () => {
    if (newCharacterId.trim() && newType) {
      onUpdate([
        ...data,
        {
          characterId: newCharacterId.trim(),
          type: newType,
          description: newDescription.trim() || undefined
        }
      ]);
      setNewCharacterId('');
      setNewType('friend');
      setNewDescription('');
    }
  };

  const removeRelationship = (index: number) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {/* Add New Relationship */}
      <section className="space-y-4">
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Forge Connection</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <input
              type="text"
              value={newCharacterId}
              onChange={(e) => setNewCharacterId(e.target.value)}
              className="w-full input-tactile text-sm"
              placeholder="Character Identity..."
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full select-tactile text-xs uppercase tracking-widest"
            >
              {relationshipTypes.map(type => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4 flex flex-col">
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="flex-1 input-tactile text-sm min-h-[82px] leading-relaxed"
              placeholder="Nature of the bond..."
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={addRelationship}
            disabled={!newCharacterId.trim()}
            className="btn-magenta px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-magenta-glow/20 disabled:opacity-30 transition-all"
          >
            Add Connection
          </button>
        </div>
      </section>

      {/* Existing Relationships */}
      <section className="space-y-4">
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Established Bonds</label>
        <div className="grid grid-cols-1 gap-3">
          {data.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-white/5 rounded-2xl opacity-40">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em]">No connections established.</p>
            </div>
          ) : (
            data.map((rel, index) => (
              <div key={index} className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all">
                <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center font-serif text-sm italic text-white/40">
                  {rel.characterId?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="text-sm font-serif font-bold text-white/80 truncate">{rel.characterId}</h5>
                    <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded bg-editor-magenta/10 text-editor-magenta uppercase tracking-widest">
                      {rel.type}
                    </span>
                  </div>
                  {rel.description && (
                    <p className="text-xs text-editor-text-muted truncate leading-relaxed">{rel.description}</p>
                  )}
                </div>
                <button 
                  onClick={() => removeRelationship(index)}
                  className="p-2 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};