import React from 'react';

interface SceneBasicInfoFormProps {
  data: {
    title?: string;
    type?: string;
    order?: number;
    pov_character_id?: string;
    goal?: string;
  };
  characters: any[];
  onUpdate: (data: {
    title?: string;
    type?: string;
    order?: number;
    pov_character_id?: string;
    goal?: string;
  }) => void;
  errors?: Record<string, string>;
}

export const SceneBasicInfoForm: React.FC<SceneBasicInfoFormProps> = ({ data, characters, onUpdate, errors = {} }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-purple-300 mb-2">Scene Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          className={`w-full bg-[#2a003f] border ${errors.title ? 'border-red-500' : 'border-purple-700/30'} rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none`}
          placeholder="Enter scene title"
          maxLength={200}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Scene Type</label>
        <select
          value={data.type || 'transition'}
          onChange={(e) => onUpdate({ ...data, type: e.target.value })}
          className={`w-full bg-[#2a003f] border ${errors.type ? 'border-red-500' : 'border-purple-700/30'} rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none`}
        >
          <option value="introduction">Introduction</option>
          <option value="conflict">Rising Conflict</option>
          <option value="climax">Narrative Climax</option>
          <option value="resolution">Resolution</option>
          <option value="transition">Transition</option>
        </select>
        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
      </div>

      <div>
        <label className="block text-purple-300 mb-2">Scene Goal</label>
        <textarea
          value={data.goal || ''}
          onChange={(e) => onUpdate({ ...data, goal: e.target.value })}
          className={`w-full bg-[#2a003f] border ${errors.goal ? 'border-red-500' : 'border-purple-700/30'} rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[60px]`}
          placeholder="What is the goal of this scene?"
          maxLength={2000}
        />
        {errors.goal && <p className="text-red-500 text-xs mt-1">{errors.goal}</p>}
      </div>

      <div>
        <label className="block text-purple-300 mb-2">POV Character</label>
        <select
          value={data.pov_character_id || ''}
          onChange={(e) => onUpdate({ ...data, pov_character_id: e.target.value || undefined })}
          className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
        >
          <option value="">None (Narrator)</option>
          {characters.map(char => (
            <option key={char.id} value={char.id}>
              {char.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};