import React, { useState } from 'react';
import type { WorldSettings } from '../../types/story.types';
import { worldSettingsSchema } from '../../lib/schemas';

interface WorldSettingsPanelProps {
  worldSettings: WorldSettings;
  onUpdate: (settings: WorldSettings) => void;
}

export const WorldSettingsPanel: React.FC<WorldSettingsPanelProps> = ({ worldSettings, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<WorldSettings>(worldSettings);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const result = worldSettingsSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onUpdate(formData);
    setErrors({});
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData(worldSettings);
    setEditing(false);
  };

  const addLocation = () => {
    setFormData((prev: WorldSettings) => ({
      ...prev,
      locations: [...prev.locations, '']
    }));
  };

  const updateLocation = (index: number, value: string) => {
    setFormData((prev: WorldSettings) => ({
      ...prev,
      locations: prev.locations.map((loc: string, i: number) => i === index ? value : loc)
    }));
  };

  const removeLocation = (index: number) => {
    setFormData((prev: WorldSettings) => ({
      ...prev,
      locations: prev.locations.filter((_: string, i: number) => i !== index)
    }));
  };

  if (editing) {
    return (
      <div className="space-y-8">
        <div>
          <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Temporal Period</label>
          <input
            type="text"
            value={formData.timePeriod || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, timePeriod: e.target.value }))}
            className={`w-full input-tactile font-serif ${errors.timePeriod ? 'border-red-500/50' : ''}`}
            placeholder="e.g., Late Renaissance, Cyberpunk Neo-Tokyo"
            maxLength={200}
          />
          {errors.timePeriod && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.timePeriod}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Core Atmosphere</label>
          <input
            type="text"
            value={formData.atmosphere || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, atmosphere: e.target.value }))}
            className={`w-full input-tactile font-serif ${errors.atmosphere ? 'border-red-500/50' : ''}`}
            placeholder="e.g., Melancholic and isolated, Vibrant but decaying"
            maxLength={200}
          />
          {errors.atmosphere && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.atmosphere}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Environment Codex</label>
          <textarea
            value={formData.environmentDescription || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, environmentDescription: e.target.value }))}
            className={`w-full input-tactile font-serif min-h-[120px] leading-relaxed ${errors.environmentDescription ? 'border-red-500/50' : ''}`}
            placeholder="Describe the physical and social landscape..."
            maxLength={5000}
          />
          {errors.environmentDescription && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.environmentDescription}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-editor-border">
            <label className="block text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em]">Cartography: Locations</label>
            <button
              onClick={addLocation}
              className="text-[10px] font-mono text-editor-magenta hover:text-white transition-all uppercase tracking-widest"
            >
              + Map Location
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.locations.map((location, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => updateLocation(index, e.target.value)}
                  className="flex-1 input-tactile font-serif"
                  placeholder="Location designation..."
                />
                <button
                  onClick={() => removeLocation(index)}
                  className="text-[10px] font-mono text-red-500/40 hover:text-red-500 transition-all uppercase"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-6 pt-6 border-t border-editor-border">
          <button
            onClick={handleSave}
            className="btn-magenta px-8 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-sm"
          >
            Archive Settings
          </button>
          <button
            onClick={handleCancel}
            className="text-editor-text-muted hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest"
          >
            Discard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {worldSettings.timePeriod && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] italic">Temporal Period</h4>
          <p className="text-2xl font-serif font-bold text-white tracking-tight">{worldSettings.timePeriod}</p>
        </div>
      )}

      {worldSettings.atmosphere && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] italic">Core Atmosphere</h4>
          <p className="text-2xl font-serif font-bold text-white tracking-tight">{worldSettings.atmosphere}</p>
        </div>
      )}

      {worldSettings.environmentDescription && (
        <div className="col-span-full space-y-3 pt-6 border-t border-editor-border/30">
          <h4 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] italic">Environment Codex</h4>
          <p className="text-lg font-serif text-editor-text leading-relaxed italic opacity-80 border-l border-editor-border pl-6">"{worldSettings.environmentDescription}"</p>
        </div>
      )}

      {worldSettings.locations.length > 0 && (
        <div className="col-span-full pt-6">
          <h4 className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] italic mb-4">Cartography: Locations</h4>
          <div className="flex flex-wrap gap-3">
            {worldSettings.locations.map((location, index) => (
              <span key={index} className="text-[10px] font-mono text-editor-magenta uppercase tracking-widest border border-editor-magenta/20 px-4 py-1 rounded-sm bg-white/[0.01]">
                {location}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pt-8 border-t border-editor-border">
        <button
          onClick={() => setEditing(true)}
          className="btn-magenta px-8 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm"
        >
          Refine World Codex
        </button>
      </div>
    </div>
  );
};