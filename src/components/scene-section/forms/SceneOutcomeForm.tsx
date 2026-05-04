import React from 'react';

interface SceneOutcomeFormProps {
  data: {
    background?: string;
    outcome?: string;
    impact?: string;
  };
  onUpdate: (data: {
    background?: string;
    outcome?: string;
    impact?: string;
  }) => void;
  errors?: Record<string, string>;
}

export const SceneOutcomeForm: React.FC<SceneOutcomeFormProps> = ({ data, onUpdate, errors = {} }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Background</label>
        <textarea
          value={data.background || ''}
          onChange={(e) => onUpdate({ ...data, background: e.target.value })}
          className={`w-full bg-[#2a003f] border ${errors.background ? 'border-red-500' : 'border-purple-700/30'} rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]`}
          placeholder="Any background context for this scene?"
          maxLength={5000}
        />
        {errors.background && <p className="text-red-500 text-xs mt-1">{errors.background}</p>}
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Outcome</label>
        <textarea
          value={data.outcome || ''}
          onChange={(e) => onUpdate({ ...data, outcome: e.target.value })}
          className={`w-full bg-[#2a003f] border ${errors.outcome ? 'border-red-500' : 'border-purple-700/30'} rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]`}
          placeholder="What happens as a result of this scene?"
          maxLength={3000}
        />
        {errors.outcome && <p className="text-red-500 text-xs mt-1">{errors.outcome}</p>}
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Impact on Story</label>
        <textarea
          value={data.impact || ''}
          onChange={(e) => onUpdate({ ...data, impact: e.target.value })}
          className={`w-full bg-[#2a003f] border ${errors.impact ? 'border-red-500' : 'border-purple-700/30'} rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]`}
          placeholder="How does this change the narrative trajectory?"
          maxLength={3000}
        />
        {errors.impact && <p className="text-red-500 text-xs mt-1">{errors.impact}</p>}
      </div>
    </div>
  );
};