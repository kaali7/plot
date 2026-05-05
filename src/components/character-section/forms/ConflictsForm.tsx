import React from 'react';
import type { Character } from '../../../types/story.types';

interface ConflictsFormProps {
  data: Character['conflicts'];
  onUpdate: (data: Character['conflicts']) => void;
}

export const ConflictsForm: React.FC<ConflictsFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Internal Conflict</label>
        <textarea
          value={data.internal || ''}
          onChange={(e) => onUpdate({ ...data, internal: e.target.value })}
          className="w-full input-tactile text-sm min-h-[100px] leading-relaxed"
          placeholder="What is the character's internal struggle?"
        />
      </div>

      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">External Conflict</label>
        <textarea
          value={data.external || ''}
          onChange={(e) => onUpdate({ ...data, external: e.target.value })}
          className="w-full input-tactile text-sm min-h-[100px] leading-relaxed"
          placeholder="What outside forces are working against them?"
        />
      </div>
    </div>
  );
};