import React, { useState } from 'react';
import type { WorldSettings } from '../../types/story.types';
import { worldSettingsSchema } from '../../lib/schemas';
import { Modal } from '../ui/Modal';

interface WorldSettingsPanelProps {
  worldSettings: WorldSettings;
  onUpdate: (settings: WorldSettings) => void;
}

export const WorldSettingsPanel: React.FC<WorldSettingsPanelProps> = ({ worldSettings, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setFormData(worldSettings);
    setErrors({});
    setIsModalOpen(false);
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <div className="flex flex-col space-y-6">
          {worldSettings.timePeriod && (
            <div className="space-y-2">
              <h4 className="text-[9px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold opacity-40">Temporal Period</h4>
              <p className="text-2xl font-serif font-bold text-white tracking-tight border-b border-white/5 pb-2">{worldSettings.timePeriod}</p>
            </div>
          )}

          {worldSettings.atmosphere && (
            <div className="space-y-2">
              <h4 className="text-[9px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold opacity-40">Atmosphere</h4>
              <p className="text-2xl font-serif font-bold text-white tracking-tight border-b border-white/5 pb-2">{worldSettings.atmosphere}</p>
            </div>
          )}
        </div>

        {worldSettings.environmentDescription && (
          <div className="space-y-3 pt-4">
            <h4 className="text-[9px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold opacity-40">Environment Codex</h4>
            <p className="text-sm font-serif text-white/70 leading-relaxed italic border-l border-green-500/30 pl-6 py-2 bg-white/[0.01] rounded-r-lg">"{worldSettings.environmentDescription}"</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-fit px-8 py-3 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase tracking-widest hover:bg-editor-magenta hover:text-white hover:border-editor-magenta transition-all"
      >
        Refine World
      </button>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCancel} 
        title="World Settings Codex"
      >
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
              className={`w-full input-tactile font-serif min-h-[150px] leading-relaxed ${errors.environmentDescription ? 'border-red-500/50' : ''}`}
              placeholder="Describe the physical and social landscape..."
              maxLength={5000}
            />
            {errors.environmentDescription && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.environmentDescription}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
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

          <div className="flex justify-end space-x-6 pt-6 border-t border-white/5">
            <button
              onClick={handleCancel}
              className="text-editor-text-muted hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="btn-magenta px-10 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm"
            >
              Archive Settings
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};