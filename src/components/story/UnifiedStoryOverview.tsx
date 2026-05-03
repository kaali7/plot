import * as React from 'react';
const { useState, useEffect } = React;
import Card from '../ui/Card';
import { Modal } from '../ui/Modal';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [data, setData] = useState<StructuredOverview>({
    premise: '',
    characters: [],
    conflicts: { internal: '', external: '' },
    acts: { setup: '', confrontation: '', resolution: '' }
  });

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

      if (overviewData && overviewData.startsWith('{')) {
        const parsed = JSON.parse(overviewData);
        parsedData = { ...parsedData, ...parsed };
      } else if (overviewData) {
        parsedData.premise = overviewData;
      }

      const convertedCharacters = convertCharactersData(charactersData);
      if (convertedCharacters.length > 0) {
        parsedData.characters = convertedCharacters;
      }

      setData(parsedData);
    } catch (error) {
      setData({
        premise: overviewData || '',
        characters: convertCharactersData(charactersData),
        conflicts: { internal: '', external: '' },
        acts: { setup: '', confrontation: '', resolution: '' }
      });
    }
  }, [overviewData, charactersData]);

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold">Narrative Dashboard</h3>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] uppercase tracking-widest py-2 px-4 rounded-sm transition-all shadow-lg shadow-purple-900/20"
        >
          Open Narrative Editor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Conflicts Summary */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-widest font-bold">Core Engine</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <span className="text-[9px] font-mono text-editor-text-muted uppercase mb-2 block tracking-widest">Internal Conflict</span>
              <p className="text-sm font-serif italic text-white/80 leading-relaxed">
                {data.conflicts.internal || "Undiscovered..."}
              </p>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <span className="text-[9px] font-mono text-editor-text-muted uppercase mb-2 block tracking-widest">External Conflict</span>
              <p className="text-sm font-serif italic text-white/80 leading-relaxed">
                {data.conflicts.external || "Undiscovered..."}
              </p>
            </div>
          </div>
        </div>

        {/* Acts Summary */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-widest font-bold">Narrative Arc</h4>
          <div className="space-y-3">
            {[
              { key: 'setup', label: 'Act I', color: 'bg-purple-500/20 text-purple-400' },
              { key: 'confrontation', label: 'Act II', color: 'bg-indigo-500/20 text-indigo-400' },
              { key: 'resolution', label: 'Act III', color: 'bg-red-500/20 text-red-400' }
            ].map((act) => (
              <div key={act.key} className="flex items-start space-x-4 p-3 bg-white/[0.01] hover:bg-white/[0.03] transition-colors rounded-lg border border-white/5">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase mt-1 ${act.color}`}>
                  {act.label}
                </span>
                <p className="text-xs font-serif text-white/60 line-clamp-2">
                  {data.acts[act.key as keyof typeof data.acts] || "Drafting..."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Narrative Compass Editor"
      >
        <div className="space-y-8 pb-4">
          {/* Premise */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest font-bold block">Premise</label>
            <textarea
              value={data.premise}
              onChange={(e) => {
                const newData = { ...data, premise: e.target.value };
                setData(newData);
                onSave(JSON.stringify(newData));
              }}
              placeholder="What is the soul of your story?"
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-white font-serif text-lg leading-relaxed focus:border-purple-500 outline-none transition-colors min-h-[100px]"
            />
          </div>

          {/* Conflicts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest font-bold block">Internal Conflict</label>
              <textarea
                value={data.conflicts.internal}
                onChange={(e) => handleNestedChange('conflicts', 'internal', e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-white font-serif focus:border-purple-500 outline-none transition-colors min-h-[80px]"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest font-bold block">External Conflict</label>
              <textarea
                value={data.conflicts.external}
                onChange={(e) => handleNestedChange('conflicts', 'external', e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-white font-serif focus:border-purple-500 outline-none transition-colors min-h-[80px]"
              />
            </div>
          </div>

          {/* Acts */}
          <div className="space-y-4">
            <label className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest font-bold block text-center">Three Act Structure</label>
            <div className="grid grid-cols-1 gap-4">
              {[
                { key: 'setup', label: 'Act I: Setup' },
                { key: 'confrontation', label: 'Act II: Confrontation' },
                { key: 'resolution', label: 'Act III: Resolution' }
              ].map((act) => (
                <div key={act.key} className="space-y-2">
                  <span className="text-[9px] font-bold text-white/40 uppercase pl-1">{act.label}</span>
                  <textarea
                    value={data.acts[act.key as keyof typeof data.acts]}
                    onChange={(e) => handleNestedChange('acts', act.key, e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-white font-serif focus:border-purple-500 outline-none transition-colors min-h-[80px]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-10 py-3 btn-magenta text-[10px] font-bold tracking-widest uppercase rounded-sm"
            >
              Finish Editing
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnifiedStoryOverview;