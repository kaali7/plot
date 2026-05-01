import React from 'react';

import type { Character } from '../../../types/story.types';

interface MotivationFormProps {
  data: Character['motivation'];
  onUpdate: (data: Character['motivation']) => void;
}

export const MotivationForm: React.FC<MotivationFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Goal</label>
        <textarea
          value={data.goal || ''}
          onChange={(e) => onUpdate({ ...data, goal: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[60px]"
          placeholder="What does the character want most?"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Fear</label>
        <textarea
          value={data.fear || ''}
          onChange={(e) => onUpdate({ ...data, fear: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[60px]"
          placeholder="What is the character afraid of?"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Desire</label>
        <textarea
          value={data.desire || ''}
          onChange={(e) => onUpdate({ ...data, desire: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[60px]"
          placeholder="What does the character truly desire?"
        />
      </div>
    </div>
  );
};