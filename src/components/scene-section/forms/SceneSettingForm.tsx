import React from 'react';

interface SceneSettingFormProps {
  data: {
    location?: string;
    time?: string;
    environment?: string;
  };
  onUpdate: (data: {
    location?: string;
    time?: string;
    environment?: string;
  }) => void;
}

export const SceneSettingForm: React.FC<SceneSettingFormProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Location</label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => onUpdate({ ...data, location: e.target.value })}
            className="w-full input-tactile text-sm"
            placeholder="e.g. The Overlook Library"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Time/Chronology</label>
          <input
            type="text"
            value={data.time || ''}
            onChange={(e) => onUpdate({ ...data, time: e.target.value })}
            className="w-full input-tactile text-sm"
            placeholder="e.g. Mid-Autumn, Late Evening"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Environment & Atmosphere</label>
        <textarea
          value={data.environment || ''}
          onChange={(e) => onUpdate({ ...data, environment: e.target.value })}
          className="w-full input-tactile text-sm min-h-[100px] leading-relaxed"
          placeholder="Describe the sensory details and emotional atmosphere of the setting..."
        />
      </div>
    </div>
  );
};