import React from 'react';
import type { Scene } from '../../../types/story.types';

interface BasicInfoFormProps {
  data: Partial<Scene>;
  onUpdate: (data: Partial<Scene>) => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, onUpdate }) => {
  const handleChange = (field: keyof Scene, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-purple-200 mb-2">Scene Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full bg-[#1a001f] border border-purple-800/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
          placeholder="Enter scene title"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-purple-200 mb-2">Scene Type</label>
        <select
          value={data.type || 'transition'}
          onChange={(e) => handleChange('type', e.target.value as any)}
          className="w-full bg-[#1a001f] border border-purple-800/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
        >
          <option value="introduction">Introduction</option>
          <option value="conflict">Conflict</option>
          <option value="climax">Climax</option>
          <option value="resolution">Resolution</option>
          <option value="transition">Transition</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-purple-200 mb-2">Goal</label>
        <textarea
          value={data.goal || ''}
          onChange={(e) => handleChange('goal', e.target.value)}
          className="w-full bg-[#1a001f] border border-purple-800/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 outline-none"
          placeholder="What does this scene accomplish?"
          rows={3}
        />
      </div>
    </div>
  );
};