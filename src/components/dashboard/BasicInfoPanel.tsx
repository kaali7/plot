import React, { useState } from 'react';
import type { Story } from '../../types/story.types';

interface BasicInfoPanelProps {
  story: Story;
  onUpdate: (updates: Partial<Story>) => void;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ story, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const getDisplayDescription = (desc: string) => {
    if (!desc) return '';
    if (desc.startsWith('{')) {
      try {
        const parsed = JSON.parse(desc);
        return parsed.premise || '';
      } catch (e) {
        return desc;
      }
    }
    return desc;
  };

  const displayDescription = getDisplayDescription(story.description || '');

  const [formData, setFormData] = useState({
    name: story.name || '',
    theme: story.theme || '',
    description: displayDescription
  });

  const handleSave = () => {
    // If the original description was JSON, try to update only the premise
    let finalDescription = formData.description;
    if (story.description?.startsWith('{')) {
      try {
        const parsed = JSON.parse(story.description);
        finalDescription = JSON.stringify({ ...parsed, premise: formData.description });
      } catch (e) {
        // Fallback to plain text if parsing fails
      }
    }
    
    onUpdate({
      ...formData,
      description: finalDescription
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: story.name || '',
      theme: story.theme || '',
      description: displayDescription
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
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-[#2a003f] border border-purple-700/30 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            placeholder="Enter story name"
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
        <h3 className="text-lg font-semibold text-white">{story.name}</h3>
        {story.theme && (
          <p className="text-purple-300 mt-1">{story.theme}</p>
        )}
        {displayDescription && (
          <p className="text-gray-400 mt-2">{displayDescription}</p>
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