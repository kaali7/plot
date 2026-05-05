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
    <div className="space-y-8">
      {/* Internal Conflict */}
      <section className="space-y-4">
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Psychological Friction (Internal)</label>
        <div className="space-y-3">
          <select
            className="w-full select-tactile text-sm"
            onChange={(e) => onUpdate({ ...data, internal: e.target.value })}
            value={internalConflicts.some(c => c.description === data.internal) ? data.internal : ''}
          >
            <option value="">Link existing friction...</option>
            {internalConflicts.map(c => (
              <option key={c.id} value={c.description || ''}>
                {c.title?.toUpperCase()}: {(c.description || '').substring(0, 40)}...
              </option>
            ))}
            <option value="custom">CUSTOM OVERRIDE</option>
          </select>
          
          <textarea
            value={data.internal || ''}
            onChange={(e) => onUpdate({ ...data, internal: e.target.value })}
            className="w-full input-tactile text-sm min-h-[100px] leading-relaxed"
            placeholder="Describe the unique psychological tension in this scene..."
          />
        </div>
      </section>

      {/* External Conflict */}
      <section className="space-y-4">
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Environmental Resistance (External)</label>
        <div className="space-y-3">
          <select
            className="w-full select-tactile text-sm"
            onChange={(e) => onUpdate({ ...data, external: e.target.value })}
            value={externalConflicts.some(c => c.description === data.external) ? data.external : ''}
          >
            <option value="">Link existing resistance...</option>
            {externalConflicts.map(c => (
              <option key={c.id} value={c.description || ''}>
                {c.title?.toUpperCase()}: {(c.description || '').substring(0, 40)}...
              </option>
            ))}
            <option value="custom">CUSTOM OVERRIDE</option>
          </select>

          <textarea
            value={data.external || ''}
            onChange={(e) => onUpdate({ ...data, external: e.target.value })}
            className="w-full input-tactile text-sm min-h-[100px] leading-relaxed"
            placeholder="Describe the external pressures or active opposition in this scene..."
          />
        </div>
      </section>
    </div>
  );
};