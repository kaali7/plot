import React from 'react';
import type { Character } from '../../../types/story.types';

interface MotivationFormProps {
  data: Character['motivation'];
  onUpdate: (data: Character['motivation']) => void;
}

export const MotivationForm: React.FC<MotivationFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Core Goal</label>
        <textarea
          value={data.goal || ''}
          onChange={(e) => onUpdate({ ...data, goal: e.target.value })}
          className="w-full input-tactile text-sm min-h-[80px] leading-relaxed"
          placeholder="What does the character want most in this narrative?"
        />
      </div>

      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Primary Fear</label>
        <textarea
          value={data.fear || ''}
          onChange={(e) => onUpdate({ ...data, fear: e.target.value })}
          className="w-full input-tactile text-sm min-h-[80px] leading-relaxed"
          placeholder="What is the characters greatest internal or external threat?"
        />
      </div>

      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Deep Desire</label>
        <textarea
          value={data.desire || ''}
          onChange={(e) => onUpdate({ ...data, desire: e.target.value })}
          className="w-full input-tactile text-sm min-h-[80px] leading-relaxed"
          placeholder="What is the hidden longing that drives their actions?"
        />
      </div>
    </div>
  );
};