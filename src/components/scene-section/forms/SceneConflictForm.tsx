import React from 'react';
import type { Conflict } from '../../../types/story.types';

interface SceneConflictFormProps {
  data: {
    internal?: string;
    external?: string;
  };
  conflicts: Conflict[];
  onUpdate: (data: {
    internal?: string;
    external?: string;
  }) => void;
}

export const SceneConflictForm: React.FC<SceneConflictFormProps> = ({ data, conflicts, onUpdate }) => {
  const internalConflicts = conflicts.filter(c => c.type === 'internal');
  const externalConflicts = conflicts.filter(c => c.type === 'external');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-purple-300 mb-2 font-medium">Internal Conflict</label>
        <div className="space-y-3">
          <select
            className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            onChange={(e) => onUpdate({ ...data, internal: e.target.value })}
            value={internalConflicts.some(c => c.description === data.internal) ? data.internal : ''}
          >
            <option value="">Choose an existing internal conflict...</option>
            {internalConflicts.map(c => (
              <option key={c.id} value={c.description || ''}>{(c.title || 'Conflict')}: {(c.description || '').substring(0, 50)}...</option>
            ))}
            <option value="custom">-- Custom Conflict --</option>
          </select>
          
          <textarea
            value={data.internal || ''}
            onChange={(e) => onUpdate({ ...data, internal: e.target.value })}
            className="w-full bg-[#1a001f] border border-purple-900/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
            placeholder="Or describe the internal struggle for this scene..."
          />
        </div>
      </div>

      <div>
        <label className="block text-purple-300 mb-2 font-medium">External Conflict</label>
        <div className="space-y-3">
          <select
            className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            onChange={(e) => onUpdate({ ...data, external: e.target.value })}
            value={externalConflicts.some(c => c.description === data.external) ? data.external : ''}
          >
            <option value="">Choose an existing external conflict...</option>
            {externalConflicts.map(c => (
              <option key={c.id} value={c.description || ''}>{(c.title || 'Conflict')}: {(c.description || '').substring(0, 50)}...</option>
            ))}
            <option value="custom">-- Custom Conflict --</option>
          </select>

          <textarea
            value={data.external || ''}
            onChange={(e) => onUpdate({ ...data, external: e.target.value })}
            className="w-full bg-[#1a001f] border border-purple-900/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
            placeholder="Or describe the external forces for this scene..."
          />
        </div>
      </div>
    </div>
  );
};