import React, { useState } from 'react';
import type { Story } from '../../types/story.types';

interface BasicInfoPanelProps {
  story: Story;
  onUpdate: (updates: Partial<Story>) => void;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ story, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: story.title || '',
    theme: story.theme || '',
    description: story.description || ''
  });

  const handleSave = () => {
    onUpdate(formData);
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      title: story.title || '',
      theme: story.theme || '',
      description: story.description || ''
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-purple-300 mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            placeholder="Enter story title"
          />
        </div>
        
        <div>
          <label className="block text-purple-300 mb-2">Theme</label>
          <input
            type="text"
            value={formData.theme}
            onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
            className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            placeholder="Enter story theme"
          />
        </div>
        
        <div>
          <label className="block text-purple-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none min-h-[100px]"
            placeholder="Enter story description"
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
          >
            Save
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
      <div>
        <h3 className="text-lg font-semibold text-white">{story.title}</h3>
        {story.theme && (
          <p className="text-purple-300 mt-1">{story.theme}</p>
        )}
        {story.description && (
          <p className="text-gray-400 mt-2">{story.description}</p>
        )}
      </div>
      
      <button
        onClick={() => setEditing(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
      >
        Edit Story Info
      </button>
    </div>
  );
};