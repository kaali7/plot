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
      onUpdate({ ...data, strengths: [...data.strengths, newStrength.trim()] });
      setNewStrength('');
    }
  };

  const removeStrength = (index: number) => {
    onUpdate({ ...data, strengths: data.strengths.filter((_, i) => i !== index) });
  };

  const addWeakness = () => {
    if (newWeakness.trim()) {
      onUpdate({ ...data, weaknesses: [...data.weaknesses, newWeakness.trim()] });
      setNewWeakness('');
    }
  };

  const removeWeakness = (index: number) => {
    onUpdate({ ...data, weaknesses: data.weaknesses.filter((_, i) => i !== index) });
  };

  const addPersonality = () => {
    if (newPersonality.trim()) {
      onUpdate({ ...data, personality: [...data.personality, newPersonality.trim()] });
      setNewPersonality('');
    }
  };

  const removePersonality = (index: number) => {
    onUpdate({ ...data, personality: data.personality.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      {/* Strengths */}
      <section className="space-y-4">
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Narrative Strengths</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newStrength}
            onChange={(e) => setNewStrength(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStrength())}
            className="flex-1 input-tactile text-sm"
            placeholder="Add a strength..."
          />
          <button
            onClick={addStrength}
            className="px-4 py-2 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-green-500/20 transition-all border border-green-500/20"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.strengths.map((trait, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-green-500/5 border border-green-500/10 rounded-full group">
              <span className="text-xs text-green-500/80">{trait}</span>
              <button onClick={() => removeStrength(index)} className="text-green-500/40 hover:text-red-500 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Weaknesses */}
      <section className="space-y-4">
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Inherent Weaknesses</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newWeakness}
            onChange={(e) => setNewWeakness(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWeakness())}
            className="flex-1 input-tactile text-sm"
            placeholder="Add a weakness..."
          />
          <button
            onClick={addWeakness}
            className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all border border-red-500/20"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.weaknesses.map((trait, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-red-500/5 border border-red-500/10 rounded-full group">
              <span className="text-xs text-red-500/80">{trait}</span>
              <button onClick={() => removeWeakness(index)} className="text-red-500/40 hover:text-red-500 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Personality */}
      <section className="space-y-4">
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Personality Matrix</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPersonality}
            onChange={(e) => setNewPersonality(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPersonality())}
            className="flex-1 input-tactile text-sm"
            placeholder="Add a personality trait..."
          />
          <button
            onClick={addPersonality}
            className="px-4 py-2 bg-editor-magenta/10 text-editor-magenta rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-editor-magenta/20 transition-all border border-editor-magenta/20"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.personality.map((trait, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-full group">
              <span className="text-xs text-white/60">{trait}</span>
              <button onClick={() => removePersonality(index)} className="text-white/20 hover:text-red-500 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};