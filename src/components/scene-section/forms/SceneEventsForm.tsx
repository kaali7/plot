import React from 'react';

interface SceneEventsFormProps {
  data: {
    main?: string;
    turningPoint?: string;
  };
  onUpdate: (data: {
    main?: string;
    turningPoint?: string;
  }) => void;
}

export const SceneEventsForm: React.FC<SceneEventsFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Narrative Core (Main Event)</label>
        <textarea
          value={data.main || ''}
          onChange={(e) => onUpdate({ ...data, main: e.target.value })}
          className="w-full input-tactile text-sm min-h-[120px] leading-relaxed"
          placeholder="What is the central action or revelation of this scene?"
        />
      </div>

      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Structural Pivot (Turning Point)</label>
        <textarea
          value={data.turningPoint || ''}
          onChange={(e) => onUpdate({ ...data, turningPoint: e.target.value })}
          className="w-full input-tactile text-sm min-h-[120px] leading-relaxed"
          placeholder="What moment shifts the narrative direction or character state?"
        />
      </div>
    </div>
  );
};