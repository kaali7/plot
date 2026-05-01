import React from 'react';

interface SceneConflictFormProps {
  data: {
    internal?: string;
    external?: string;
  };
  onUpdate: (data: {
    internal?: string;
    external?: string;
  }) => void;
}

export const SceneConflictForm: React.FC<SceneConflictFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Internal Conflict</label>
        <textarea
          value={data.internal || ''}
          onChange={(e) => onUpdate({ ...data, internal: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[60px]"
          placeholder="What internal struggles occur in this scene?"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">External Conflict</label>
        <textarea
          value={data.external || ''}
          onChange={(e) => onUpdate({ ...data, external: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[60px]"
          placeholder="What external forces create conflict in this scene?"
        />
      </div>
    </div>
  );
};