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
    <div className="space-y-6">
      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Narrative Subtext (Background)</label>
        <textarea
          value={data.background || ''}
          onChange={(e) => onUpdate({ ...data, background: e.target.value })}
          className={`w-full input-tactile text-sm min-h-[100px] leading-relaxed ${errors.background ? 'border-red-500/50' : ''}`}
          placeholder="Any unspoken context or hidden history relevant to this moment..."
        />
        {errors.background && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.background}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Resolution & Fallout (Outcome)</label>
        <textarea
          value={data.outcome || ''}
          onChange={(e) => onUpdate({ ...data, outcome: e.target.value })}
          className={`w-full input-tactile text-sm min-h-[100px] leading-relaxed ${errors.outcome ? 'border-red-500/50' : ''}`}
          placeholder="The immediate consequences and state change at the scene's end..."
        />
        {errors.outcome && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.outcome}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Narrative Trajectory (Impact)</label>
        <textarea
          value={data.impact || ''}
          onChange={(e) => onUpdate({ ...data, impact: e.target.value })}
          className={`w-full input-tactile text-sm min-h-[100px] leading-relaxed ${errors.impact ? 'border-red-500/50' : ''}`}
          placeholder="How this scene alters the course of the larger story..."
        />
        {errors.impact && <p className="text-red-500 text-[10px] mt-1 uppercase tracking-wider">{errors.impact}</p>}
      </div>
    </div>
  );
};