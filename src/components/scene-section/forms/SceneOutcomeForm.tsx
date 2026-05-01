import React from 'react';

interface SceneOutcomeFormProps {
  data: {
    background?: string;
    outcome?: string;
  };
  onUpdate: (data: {
    background?: string;
    outcome?: string;
  }) => void;
}

export const SceneOutcomeForm: React.FC<SceneOutcomeFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Background</label>
        <textarea
          value={data.background || ''}
          onChange={(e) => onUpdate({ ...data, background: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
          placeholder="Any background context for this scene?"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Outcome</label>
        <textarea
          value={data.outcome || ''}
          onChange={(e) => onUpdate({ ...data, outcome: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
          placeholder="What happens as a result of this scene?"
        />
      </div>
    </div>
  );
};