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
  const [newType, setNewType] = useState('');
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
        setNewType('');
        setNewDescription('');
      }
    };

    const removeRelationship = (index: number) => {
      onUpdate(data.filter((_, i) => i !== index));
    };

  return (
    <div className="space-y-6">
      {/* Add New Relationship */}
      <div className="space-y-4">
        <h4 className="text-purple-300 font-medium mb-2">Add Relationship</h4>
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-purple-300 mb-1">Character ID/Name</label>
              <input
                type="text"
                value={newCharacterId}
                onChange={(e) => setNewCharacterId(e.target.value)}
                className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="Enter character reference"
              />
            </div>
            <div>
              <label className="block text-purple-300 mb-1">Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                {relationshipTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-purple-300 mb-1">Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="Describe the relationship"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-3">
            <button
              onClick={addRelationship}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              disabled={!newCharacterId.trim() || !newType}
            >
              Add Relationship
            </button>
          </div>
        </div>
      </div>

      {/* Existing Relationships */}
      {data.length > 0 ? (
        <div className="mt-6">
          <h4 className="text-purple-300 font-medium mb-3">Current Relationships</h4>
          <div className="space-y-2">
             {data.map((rel, index) => {
               if (!rel.characterId) return null;
               return (
                 <div key={index} className="bg-[#2a003f] border border-purple-700/30 rounded-lg p-3">
                   <div className="flex items-start space-x-2">
                     <span className="flex-shrink-0 text-purple-400">🔗</span>
                     <div className="flex-1">
                       <p className="flex items-center space-x-2 mb-1">
                         <span className="text-gray-300">{rel.characterId}</span>
                         <span className="text-purple-300">{rel.type}</span>
                       </p>
                       {rel.description && (
                         <p className="text-gray-400 text-sm">{rel.description}</p>
                       )}
                     </div>
                     <button
                       onClick={() => removeRelationship(index)}
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
          No relationships added yet
        </div>
      )}
    </div>
  );
};