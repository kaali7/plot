import React from 'react';
import type { Scene } from '../../../types/story.types';

interface OutcomeFormProps {
  data: Partial<Scene>;
  onUpdate: (data: Partial<Scene>) => void;
}

export const OutcomeForm: React.FC<OutcomeFormProps> = ({ data, onUpdate }) => {
  const handleChange = (field: keyof Scene, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-purple-200 mb-2">Background</label>
        <textarea
          value={data.background || ''}
          onChange={(e) => handleChange('background', e.target.value)}
          className="w-full bg-[#1a001f] border border-purple-800/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
          placeholder="Describe the scene atmosphere and setting"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-purple-200 mb-2">Outcome</label>
        <textarea
          value={data.outcome || ''}
          onChange={(e) => handleChange('outcome', e.target.value)}
          className="w-full bg-[#1a001f] border border-purple-800/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
          placeholder="What happens as a result of this scene?"
          rows={3}
        />
      </div>
    </div>
  );
};