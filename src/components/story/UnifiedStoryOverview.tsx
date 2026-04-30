import * as React from 'react';
const { useState, useEffect } = React;
import Card from '../ui/Card';

interface CharacterSummary {
  name: string;
  role: string;
  goal: string;
}

interface StructuredOverview {
  premise: string;
  characters: CharacterSummary[];
  conflicts: {
    internal: string;
    external: string;
  };
  acts: {
    setup: string;
    confrontation: string;
    resolution: string;
  };
}

interface UnifiedStoryOverviewProps {
  overviewData: string;
  charactersData: any[];
  onSave: (newContent: string) => void;
}

const UnifiedStoryOverview: React.FC<UnifiedStoryOverviewProps> = ({ overviewData, charactersData, onSave }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState<StructuredOverview>({
    premise: '',
    characters: [],
    conflicts: { internal: '', external: '' },
    acts: { setup: '', confrontation: '', resolution: '' }
  });

  // Convert characters data to CharacterSummary format
  const convertCharactersData = (characters: any[]): CharacterSummary[] => {
    if (!characters || !Array.isArray(characters)) return [];
    
    return characters.slice(0, 4).map(char => ({
      name: char.name || 'Unknown',
      role: char.role || 'Character',
      goal: char.goal || ''
    }));
  };

  useEffect(() => {
    try {
      let parsedData: StructuredOverview = {
        premise: '',
        characters: [],
        conflicts: { internal: '', external: '' },
        acts: { setup: '', confrontation: '', resolution: '' }
      };

      // Try to parse existing JSON data
      if (overviewData && overviewData.startsWith('{')) {
        const parsed = JSON.parse(overviewData);
        parsedData = { ...parsedData, ...parsed };
      } else if (overviewData) {
        // Fallback: use plain text as premise
        parsedData.premise = overviewData;
      }

      // Sync characters from characters data
      const convertedCharacters = convertCharactersData(charactersData);
      if (convertedCharacters.length > 0) {
        parsedData.characters = convertedCharacters;
      }

      setData(parsedData);
    } catch (error) {
      console.error('Error parsing overview data:', error);
      setData({
        premise: overviewData || '',
        characters: convertCharactersData(charactersData),
        conflicts: { internal: '', external: '' },
        acts: { setup: '', confrontation: '', resolution: '' }
      });
    }
  }, [overviewData, charactersData]);

  const handleChange = (field: keyof StructuredOverview, value: any) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onSave(JSON.stringify(newData));
  };

  const handleNestedChange = (parent: keyof StructuredOverview, field: string, value: string) => {
    const newData = { 
      ...data, 
      [parent]: { 
        ...(data[parent] as any), 
        [field]: value 
      } 
    };
    setData(newData);
    onSave(JSON.stringify(newData));
  };

  const validateCharacterLimit = (text: string, limit: number): boolean => {
    return text.length <= limit;
  };

  const getCharacterLimitWarning = (text: string, limit: number): string => {
    const remaining = limit - text.length;
    if (remaining < 0) {
      return `❌ ${Math.abs(remaining)} characters over limit`;
    } else if (remaining < 50) {
      return `⚠️ ${remaining} characters remaining`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Story Overview</h2>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
        >
          {isEditMode ? 'View Mode' : 'Edit Mode'}
        </button>
      </div>

      {/* Premise Section */}
      <Card className="border border-purple-500/20 bg-black/40">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-accent text-xs font-bold uppercase tracking-widest">Premise</h3>
          {isEditMode && (
            <span className="text-xs text-gray-400">
              {getCharacterLimitWarning(data.premise, 200)}
            </span>
          )}
        </div>
        {isEditMode ? (
          <textarea
            value={data.premise}
            onChange={(e) => handleChange('premise', e.target.value)}
            placeholder="What is the soul of your story? (e.g., A space pirate finds an ancient map to a forgotten garden planet.)"
            className={`w-full bg-[#1a001f] border border-purple-900/30 rounded-xl p-3 text-gray-200 focus:border-purple-600 outline-none transition-colors resize-none min-h-[80px] ${
              !validateCharacterLimit(data.premise, 200) ? 'border-red-500' : ''
            }`}
            maxLength={200}
          />
        ) : (
          <p className="text-gray-300 bg-[#1a001f] rounded-xl p-3 min-h-[80px]">
            {data.premise || <span className="text-gray-500 italic">No premise defined yet...</span>}
          </p>
        )}
      </Card>

      {/* Characters Section */}
      <Card className="border border-purple-500/20 bg-black/40">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-accent text-xs font-bold uppercase tracking-widest">Key Characters</h3>
          <span className="text-xs text-gray-400">
            Synced from Personas tab
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.characters.slice(0, 4).map((character, index) => (
            <div key={index} className="bg-[#1a001f] rounded-xl p-3 border border-purple-900/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{character.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  character.role === 'Protagonist' ? 'bg-green-900/50 text-green-300' :
                  character.role === 'Antagonist' ? 'bg-red-900/50 text-red-300' :
                  'bg-purple-900/50 text-purple-300'
                }`}>
                  {character.role}
                </span>
              </div>
              {isEditMode ? (
                <input
                  value={character.goal}
                  onChange={(e) => {
                    const newCharacters = [...data.characters];
                    newCharacters[index] = { ...character, goal: e.target.value };
                    handleChange('characters', newCharacters);
                  }}
                  placeholder="Character's goal or motivation..."
                  className="w-full bg-[#22002a] border border-purple-900/20 rounded-lg px-2 py-1 text-sm text-gray-300 focus:border-purple-600 outline-none"
                  maxLength={150}
                />
              ) : (
                <p className="text-gray-400 text-sm">
                  {character.goal || <span className="italic text-gray-500">No goal defined</span>}
                </p>
              )}
            </div>
          ))}
          {data.characters.length === 0 && (
            <div className="col-span-2 text-center py-6 text-gray-500">
              No characters defined in Personas tab yet...
            </div>
          )}
        </div>
      </Card>

      {/* Conflicts Section */}
      <Card className="border border-purple-500/20 bg-black/40">
        <h3 className="text-accent text-xs font-bold uppercase tracking-widest mb-3">Core Conflicts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-500 text-[10px] uppercase font-bold block mb-2">Internal Conflict</label>
            {isEditMode ? (
              <div>
                <textarea
                  value={data.conflicts.internal}
                  onChange={(e) => handleNestedChange('conflicts', 'internal', e.target.value)}
                  placeholder="The inner struggle driving the protagonist..."
                  className={`w-full bg-[#1a001f] border border-purple-900/30 rounded-xl p-3 text-gray-200 focus:border-purple-600 outline-none resize-none min-h-[60px] ${
                    !validateCharacterLimit(data.conflicts.internal, 100) ? 'border-red-500' : ''
                  }`}
                  maxLength={100}
                />
                <span className="text-xs text-gray-400 mt-1 block">
                  {getCharacterLimitWarning(data.conflicts.internal, 100)}
                </span>
              </div>
            ) : (
              <p className="text-gray-300 bg-[#1a001f] rounded-xl p-3 min-h-[60px]">
                {data.conflicts.internal || <span className="text-gray-500 italic">No internal conflict defined...</span>}
              </p>
            )}
          </div>
          <div>
            <label className="text-gray-500 text-[10px] uppercase font-bold block mb-2">External Conflict</label>
            {isEditMode ? (
              <div>
                <textarea
                  value={data.conflicts.external}
                  onChange={(e) => handleNestedChange('conflicts', 'external', e.target.value)}
                  placeholder="The external obstacle or antagonist..."
                  className={`w-full bg-[#1a001f] border border-purple-900/30 rounded-xl p-3 text-gray-200 focus:border-purple-600 outline-none resize-none min-h-[60px] ${
                    !validateCharacterLimit(data.conflicts.external, 100) ? 'border-red-500' : ''
                  }`}
                  maxLength={100}
                />
                <span className="text-xs text-gray-400 mt-1 block">
                  {getCharacterLimitWarning(data.conflicts.external, 100)}
                </span>
              </div>
            ) : (
              <p className="text-gray-300 bg-[#1a001f] rounded-xl p-3 min-h-[60px]">
                {data.conflicts.external || <span className="text-gray-500 italic">No external conflict defined...</span>}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Narrative Arc Section */}
      <Card className="border border-purple-500/20 bg-black/40">
        <h3 className="text-accent text-xs font-bold uppercase tracking-widest mb-3">Narrative Arc</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: 'setup', label: 'Act I: Setup', color: 'purple' },
            { key: 'confrontation', label: 'Act II: Confrontation', color: 'indigo' },
            { key: 'resolution', label: 'Act III: Resolution', color: 'red' }
          ].map((act) => (
            <div key={act.key} className="p-4 bg-[#1a001f] rounded-xl border border-purple-900/20">
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                act.color === 'purple' ? 'bg-purple-900/50 text-purple-300' :
                act.color === 'indigo' ? 'bg-indigo-900/50 text-indigo-300' :
                'bg-red-900/50 text-red-300'
              }`}>
                {act.label}
              </span>
              {isEditMode ? (
                <div>
                  <textarea
                    value={data.acts[act.key as keyof typeof data.acts]}
                    onChange={(e) => handleNestedChange('acts', act.key, e.target.value)}
                    placeholder={`${act.label} description...`}
                    className={`w-full bg-[#22002a] border border-purple-900/20 rounded-lg p-2 text-sm text-gray-300 mt-2 focus:border-purple-600 outline-none resize-none min-h-[60px] ${
                      !validateCharacterLimit(data.acts[act.key as keyof typeof data.acts], 100) ? 'border-red-500' : ''
                    }`}
                    maxLength={100}
                  />
                  <span className="text-xs text-gray-400 mt-1 block">
                    {getCharacterLimitWarning(data.acts[act.key as keyof typeof data.acts], 100)}
                  </span>
                </div>
              ) : (
                <p className="text-gray-400 text-sm mt-2">
                  {data.acts[act.key as keyof typeof data.acts] || <span className="italic text-gray-500">No description...</span>}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default UnifiedStoryOverview;