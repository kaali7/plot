import * as React from 'react';
const { useState, useEffect } = React;
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
    <div className="h-full flex flex-col space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Conflicts Summary */}
        <div className="space-y-3 flex flex-col">
          <h4 className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] font-bold opacity-80">Engine</h4>
          <div className="space-y-3 flex-1">
            <div className="p-4 bg-[#1a1b1e]/50 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
              <span className="text-[9px] font-mono text-editor-text-muted uppercase mb-2 block tracking-widest font-bold">Internal</span>
              <p className="text-[13px] font-serif italic text-white/80 line-clamp-2 leading-relaxed">
                {data.conflicts.internal || "Undiscovered..."}
              </p>
            </div>
            <div className="p-4 bg-[#1a1b1e]/50 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
              <span className="text-[9px] font-mono text-editor-text-muted uppercase mb-2 block tracking-widest font-bold">External</span>
              <p className="text-[13px] font-serif italic text-white/80 line-clamp-2 leading-relaxed">
                {data.conflicts.external || "Undiscovered..."}
              </p>
            </div>
          </div>
        </div>

        {/* Acts Summary */}
        <div className="space-y-3 flex flex-col">
          <h4 className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] font-bold opacity-80">Arc</h4>
          <div className="space-y-2 flex-1">
            {[
              { key: 'setup', label: 'ACT I', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
              { key: 'confrontation', label: 'ACT II', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
              { key: 'resolution', label: 'ACT III', color: 'text-red-400 bg-red-500/10 border-red-500/20' }
            ].map((act) => (
              <div key={act.key} className="flex items-center space-x-4 p-3 bg-[#1a1b1e]/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded border ${act.color} tracking-widest shadow-sm`}>
                  {act.label}
                </span>
                <p className="text-[12px] font-serif text-white/70 line-clamp-2 flex-1 leading-relaxed">
                  {data.acts[act.key as keyof typeof data.acts] || "Drafting..."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-3">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="text-[10px] font-mono text-primary/60 hover:text-primary uppercase tracking-[0.2em] transition-colors font-bold flex items-center space-x-1"
        >
          <span>Edit Narrative</span>
          <span>→</span>
        </button>
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
              className="px-10 py-3 btn-primary text-[10px] font-bold tracking-widest uppercase rounded-sm"
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