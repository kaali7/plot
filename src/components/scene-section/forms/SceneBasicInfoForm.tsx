import React from 'react';

interface SceneBasicInfoFormProps {
  data: {
    title?: string;
    type?: string;
    order?: number;
    pov_character_id?: string;
    goal?: string;
    context?: string;
    situation_details?: string;
  };
  characters: any[];
  onUpdate: (data: {
    title?: string;
    type?: string;
    order?: number;
    pov_character_id?: string;
    goal?: string;
    context?: string;
    situation_details?: string;
  }) => void;
  errors?: Record<string, string>;
}

export const SceneBasicInfoForm: React.FC<SceneBasicInfoFormProps> = ({ data, characters, onUpdate, errors = {} }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Scene Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          className={`w-full input-tactile text-base ${errors.title ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
          placeholder="e.g. The Midnight Meeting"
          maxLength={200}
        />
        {errors.title && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Scene Type</label>
          <select
            value={data.type || 'transition'}
            onChange={(e) => onUpdate({ ...data, type: e.target.value })}
            className={`w-full select-tactile text-sm ${errors.type ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
          >
            <option value="introduction">Introduction</option>
            <option value="conflict">Rising Conflict</option>
            <option value="climax">Narrative Climax</option>
            <option value="resolution">Resolution</option>
            <option value="transition">Transition</option>
          </select>
          {errors.type && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">POV Character</label>
          <select
            value={data.pov_character_id || ''}
            onChange={(e) => onUpdate({ ...data, pov_character_id: e.target.value || undefined })}
            className="w-full select-tactile text-sm"
          >
            <option value="">None (Omniscient)</option>
            {characters.map(char => (
              <option key={char.id} value={char.id}>
                {char.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Scene Goal</label>
        <textarea
          value={data.goal || ''}
          onChange={(e) => onUpdate({ ...data, goal: e.target.value })}
          className={`w-full input-tactile text-sm min-h-[100px] leading-relaxed ${errors.goal ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
          placeholder="What must be achieved in this narrative unit?"
          maxLength={2000}
        />
        {errors.goal && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.goal}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Scene Context</label>
          <textarea
            value={(data as any).context || ''}
            onChange={(e) => onUpdate({ ...data, context: e.target.value })}
            className="w-full input-tactile text-sm min-h-[120px] leading-relaxed font-serif italic"
            placeholder="The immediate narrative situation..."
            maxLength={5000}
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Situation Details</label>
          <textarea
            value={(data as any).situation_details || ''}
            onChange={(e) => onUpdate({ ...data, situation_details: e.target.value })}
            className="w-full input-tactile text-sm min-h-[120px] leading-relaxed font-serif"
            placeholder="Specific background nuances..."
            maxLength={5000}
          />
        </div>
      </div>
    </div>
  );
};