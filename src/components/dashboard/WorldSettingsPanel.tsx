import React, { useState } from 'react';
import type { WorldSettings } from '../../types/story.types';
import { worldSettingsSchema } from '../../lib/schemas';
import { Modal } from '../ui/Modal';
import { InlineResourceAttacher } from '../resources-section/InlineResourceAttacher';
import { useStory } from '../../context/StoryContext';

interface WorldSettingsPanelProps {
  storyId: string;
  worldSettings: WorldSettings;
  onUpdate: (settings: WorldSettings) => void;
}

export const WorldSettingsPanel: React.FC<WorldSettingsPanelProps> = ({ storyId, worldSettings, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<WorldSettings>(worldSettings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { resources } = useStory();

  const linkedResourceIds = resources
    .filter(r => r.linked_entities?.worldSettings?.includes(storyId))
    .map(r => r.id);

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
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <div className="flex flex-col space-y-5 md:space-y-6">
          {worldSettings.timePeriod && (
            <div className="space-y-1 md:space-y-2">
              <h4 className="text-[9px] md:text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold opacity-30">Temporal Period</h4>
              <p className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight border-b border-white/5 pb-2">{worldSettings.timePeriod}</p>
            </div>
          )}

          {worldSettings.atmosphere && (
            <div className="space-y-1 md:space-y-2">
              <h4 className="text-[9px] md:text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold opacity-30">Atmosphere</h4>
              <p className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight border-b border-white/5 pb-2">{worldSettings.atmosphere}</p>
            </div>
          )}
        </div>

        {worldSettings.environmentDescription && (
          <div className="space-y-3 pt-2 md:pt-4">
            <h4 className="text-[9px] md:text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.3em] font-bold opacity-30">Environment Codex</h4>
            <p className="text-base md:text-lg font-serif text-white/70 leading-relaxed italic border-l-2 border-green-500/30 pl-6 py-2 bg-white/[0.01] rounded-r-lg group-hover:border-green-500/50 transition-colors duration-500">
              "{worldSettings.environmentDescription}"
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 md:pt-6">
        <button
          id="btn-edit-setting"
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-fit px-8 py-4 md:py-3 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30 transition-all duration-300 flex items-center justify-center"
        >
          <span>Refine World</span>
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCancel} 
        title="World Settings Codex"
        description="Define the boundaries, atmosphere, and geography of your narrative universe. The stage upon which your characters will perform."
        footer={
          <>
            <button
              onClick={handleCancel}
              className="text-editor-text-muted hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest px-4"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="btn-primary px-10 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full shadow-lg shadow-primary-glow/20"
            >
              Archive Settings
            </button>
          </>
        }
      >
        <div className="space-y-8">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Temporal Period</label>
            <input
              type="text"
              value={formData.timePeriod || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, timePeriod: e.target.value }))}
              className={`w-full input-tactile font-sans ${errors.timePeriod ? 'border-red-500/50' : ''}`}
              placeholder="e.g., Late Renaissance, Cyberpunk Neo-Tokyo"
              maxLength={200}
            />
            {errors.timePeriod && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.timePeriod}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Core Atmosphere</label>
            <input
              type="text"
              value={formData.atmosphere || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, atmosphere: e.target.value }))}
              className={`w-full input-tactile font-sans ${errors.atmosphere ? 'border-red-500/50' : ''}`}
              placeholder="e.g., Melancholic and isolated, Vibrant but decaying"
              maxLength={200}
            />
            {errors.atmosphere && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.atmosphere}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-2">Environment Codex</label>
            <textarea
              value={formData.environmentDescription || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, environmentDescription: e.target.value }))}
              className={`w-full input-tactile font-sans min-h-[150px] leading-relaxed ${errors.environmentDescription ? 'border-red-500/50' : ''}`}
              placeholder="Describe the physical and social landscape..."
              maxLength={5000}
            />
            {errors.environmentDescription && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.environmentDescription}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted">Cartography: Locations</label>
              <button
                onClick={addLocation}
                className="text-[10px] font-mono text-primary hover:text-white transition-all uppercase tracking-widest font-bold"
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
                    className="flex-1 input-tactile font-sans"
                    placeholder="Location designation..."
                  />
                  <button
                    onClick={() => removeLocation(index)}
                    className="text-[10px] font-mono text-red-500/40 hover:text-red-500 transition-all uppercase px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Attachments */}
          <div className="pt-4 border-t border-white/5">
            <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-editor-text-muted mb-4">
              Attached References
            </label>
            <InlineResourceAttacher
              entityType="worldSettings"
              entityId={storyId}
              linkedResourceIds={linkedResourceIds}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};