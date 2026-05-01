import React, { useState } from 'react';

interface TraitsFormProps {
  data: {
    strengths: string[];
    weaknesses: string[];
    personality: string[];
  };
  onUpdate: (data: {
    strengths: string[];
    weaknesses: string[];
    personality: string[];
  }) => void;
}

export const TraitsForm: React.FC<TraitsFormProps> = ({ data, onUpdate }) => {
  const [newStrength, setNewStrength] = useState('');
  const [newWeakness, setNewWeakness] = useState('');
  const [newPersonality, setNewPersonality] = useState('');

   const addStrength = () => {
     if (newStrength.trim()) {
       onUpdate((prev) => ({
         ...prev,
         strengths: [...prev.strengths, newStrength.trim()]
       }) as {
         strengths: string[];
         weaknesses: string[];
         personality: string[];
       });
       setNewStrength('');
     }
   };

   const removeStrength = (index: number) => {
     onUpdate((prev) => ({
       ...prev,
       strengths: prev.strengths.filter((_, i) => i !== index)
     }) as {
       strengths: string[];
       weaknesses: string[];
       personality: string[];
     });
   };

   const addWeakness = () => {
     if (newWeakness.trim()) {
       onUpdate((prev: { strengths: string[]; weaknesses: string[]; personality: string[] }) => ({
         ...prev,
         weaknesses: [...prev.weaknesses, newWeakness.trim()]
       }));
       setNewWeakness('');
     }
   };

   const removeWeakness = (index: number) => {
     onUpdate((prev: { strengths: string[]; weaknesses: string[]; personality: string[] }) => ({
       ...prev,
       weaknesses: prev.weaknesses.filter((_, i) => i !== index)
     }));
   };

   const addPersonality = () => {
     if (newPersonality.trim()) {
       onUpdate((prev: { strengths: string[]; weaknesses: string[]; personality: string[] }) => ({
         ...prev,
         personality: [...prev.personality, newPersonality.trim()]
       }));
       setNewPersonality('');
     }
   };

   const removePersonality = (index: number) => {
     onUpdate((prev: { strengths: string[]; weaknesses: string[]; personality: string[] }) => ({
       ...prev,
       personality: prev.personality.filter((_, i) => i !== index)
     }));
   };

  return (
    <div className="space-y-6">
      {/* Strengths */}
      <div>
        <h4 className="text-purple-300 font-medium mb-2">Strengths</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newStrength}
              onChange={(e) => setNewStrength(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addStrength()}
              className="flex-1 bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              placeholder="Add a strength"
            />
            <button
              onClick={addStrength}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition-colors"
              disabled={!newStrength.trim()}
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {data.strengths.map((strength, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="flex-shrink-0 text-green-400">✓</span>
                <span className="flex-1 text-gray-300">{strength}</span>
                <button
                  onClick={() => removeStrength(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weaknesses */}
      <div className="mt-6">
        <h4 className="text-purple-300 font-medium mb-2">Weaknesses</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newWeakness}
              onChange={(e) => setNewWeakness(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addWeakness()}
              className="flex-1 bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              placeholder="Add a weakness"
            />
            <button
              onClick={addWeakness}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition-colors"
              disabled={!newWeakness.trim()}
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {data.weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="flex-shrink-0 text-red-400">⚠️</span>
                <span className="flex-1 text-gray-300">{weakness}</span>
                <button
                  onClick={() => removeWeakness(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personality */}
      <div className="mt-6">
        <h4 className="text-purple-300 font-medium mb-2">Personality Traits</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newPersonality}
              onChange={(e) => setNewPersonality(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPersonality()}
              className="flex-1 bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              placeholder="Add a personality trait"
            />
            <button
              onClick={addPersonality}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition-colors"
              disabled={!newPersonality.trim()}
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {data.personality.map((trait, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="flex-shrink-0 text-purple-400">◆</span>
                <span className="flex-1 text-gray-300">{trait}</span>
                <button
                  onClick={() => removePersonality(index)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};