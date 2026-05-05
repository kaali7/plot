import React from 'react';
import type { Character } from '../../../types/story.types';

interface ArcFormProps {
  data: Character['arc'];
  onUpdate: (data: Character['arc']) => void;
}

export const ArcForm: React.FC<ArcFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Narrative Incipit (Start)</label>
        <textarea
          value={data.start || ''}
          onChange={(e) => onUpdate({ ...data, start: e.target.value })}
          className="w-full input-tactile text-sm min-h-[120px] leading-relaxed"
          placeholder="Where does the characters journey begin?"
        />
      </div>

      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Narrative Outcome (End)</label>
        <textarea
          value={data.end || ''}
          onChange={(e) => onUpdate({ ...data, end: e.target.value })}
          className="w-full input-tactile text-sm min-h-[120px] leading-relaxed"
          placeholder="Where does the character end up after their transformation?"
        />
      </div>
    </div>
  );
};