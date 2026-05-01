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
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Location</label>
        <input
          type="text"
          value={data.location || ''}
          onChange={(e) => onUpdate({ ...data, location: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
          placeholder="Where does this scene take place?"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Time</label>
        <input
          type="text"
          value={data.time || ''}
          onChange={(e) => onUpdate({ ...data, time: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
          placeholder="When does this scene take place?"
        />
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Environment</label>
        <input
          type="text"
          value={data.environment || ''}
          onChange={(e) => onUpdate({ ...data, environment: e.target.value })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
          placeholder="Describe the environment/atmosphere"
        />
      </div>
    </div>
  );
};