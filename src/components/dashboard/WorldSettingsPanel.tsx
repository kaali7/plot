import React, { useState } from 'react';
import type { WorldSettings } from '../../types/story.types';

interface WorldSettingsPanelProps {
  worldSettings: WorldSettings;
  onUpdate: (settings: WorldSettings) => void;
}

export const WorldSettingsPanel: React.FC<WorldSettingsPanelProps> = ({ worldSettings, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<WorldSettings>(worldSettings);

  const handleSave = () => {
    onUpdate(formData);
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData(worldSettings);
    setEditing(false);
  };

  const addLocation = () => {
    setFormData(prev => ({
      ...prev,
      locations: [...prev.locations, '']
    }));
  };

  const updateLocation = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.map((loc, i) => i === index ? value : loc)
    }));
  };

  const removeLocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-purple-300 mb-2">Time Period</label>
          <input
            type="text"
            value={formData.timePeriod || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, timePeriod: e.target.value }))}
            className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            placeholder="e.g., Medieval, Futuristic, Modern"
          />
        </div>

        <div>
          <label className="block text-purple-300 mb-2">Atmosphere</label>
          <input
            type="text"
            value={formData.atmosphere || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, atmosphere: e.target.value }))}
            className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            placeholder="e.g., Dark and gritty, Bright and hopeful"
          />
        </div>

        <div>
          <label className="block text-purple-300 mb-2">Environment Description</label>
          <textarea
            value={formData.environmentDescription || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, environmentDescription: e.target.value }))}
            className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[80px]"
            placeholder="Describe the world's environment"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-purple-300">Locations</label>
            <button
              onClick={addLocation}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Add Location
            </button>
          </div>
          
          {formData.locations.map((location, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={location}
                onChange={(e) => updateLocation(index, e.target.value)}
                className="flex-1 bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="Enter location name"
              />
              <button
                onClick={() => removeLocation(index)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
          >
            Save Settings
          </button>
          <button
            onClick={handleCancel}
            className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {worldSettings.timePeriod && (
        <div>
          <h4 className="text-purple-300 font-semibold">Time Period</h4>
          <p className="text-white">{worldSettings.timePeriod}</p>
        </div>
      )}

      {worldSettings.atmosphere && (
        <div>
          <h4 className="text-purple-300 font-semibold">Atmosphere</h4>
          <p className="text-white">{worldSettings.atmosphere}</p>
        </div>
      )}

      {worldSettings.environmentDescription && (
        <div>
          <h4 className="text-purple-300 font-semibold">Environment</h4>
          <p className="text-white">{worldSettings.environmentDescription}</p>
        </div>
      )}

      {worldSettings.locations.length > 0 && (
        <div>
          <h4 className="text-purple-300 font-semibold mb-2">Locations</h4>
          <div className="flex flex-wrap gap-2">
            {worldSettings.locations.map((location, index) => (
              <span key={index} className="bg-purple-800/50 text-purple-200 px-3 py-1 rounded-full text-sm">
                {location}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setEditing(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
      >
        Edit World Settings
      </button>
    </div>
  );
};