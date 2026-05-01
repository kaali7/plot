import React from 'react';

import type { Character } from '../../../types/story.types';

interface ConflictsFormProps {
  data: Character['conflicts'];
  onUpdate: (data: Character['conflicts']) => void;
}

export const ConflictsForm: React.FC<ConflictsFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Internal Conflict</label>
        <textarea
          value={data.internal || ''}
          onChange={(e) => onUpdate({ ...data, internal: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
          placeholder="Describe the character's internal struggles"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">External Conflict</label>
        <textarea
          value={data.external || ''}
          onChange={(e) => onUpdate({ ...data, external: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
          placeholder="Describe external forces opposing the character"
        />
      </div>
    </div>
  );
};