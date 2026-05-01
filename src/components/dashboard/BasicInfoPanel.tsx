import React, { useState } from 'react';
import type { Story } from '../../types/story.types';
import { storySchema } from '../../lib/schemas';

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const result = storySchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

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
    setErrors({});
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
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Manuscript Title</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full input-tactile font-serif text-lg ${errors.name ? 'border-red-500/50' : ''}`}
            placeholder="Enter story name"
            maxLength={200}
          />
          {errors.name && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Thematic Core</label>
          <input
            type="text"
            value={formData.theme}
            onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
            className={`w-full input-tactile font-serif ${errors.theme ? 'border-red-500/50' : ''}`}
            placeholder="e.g. Redemption, Cosmic Horror, Betrayal"
            maxLength={200}
          />
          {errors.theme && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.theme}</p>}
        </div>
        
        <div>
          <label className="block text-[10px] font-mono text-editor-text-muted mb-2 uppercase tracking-[0.2em]">Core Premise</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={`w-full input-tactile font-serif min-h-[120px] leading-relaxed ${errors.description ? 'border-red-500/50' : ''}`}
            placeholder="Summarize the heart of your narrative..."
            maxLength={5000}
          />
          {errors.description && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.description}</p>}
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
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-serif font-bold text-white tracking-tight mb-2">{story.name}</h3>
        {story.theme && (
          <p className="text-editor-magenta font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-6 italic">Theme: {story.theme}</p>
        )}
        {displayDescription ? (
          <p className="text-editor-text leading-relaxed font-serif text-lg italic opacity-80 border-l-2 border-editor-border pl-6 py-2">
            "{displayDescription}"
          </p>
        ) : (
          <p className="text-editor-text-muted font-serif italic text-lg">No core premise established yet.</p>
        )}
      </div>
      
      <button
        onClick={() => setEditing(true)}
        className="btn-magenta px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-sm"
      >
        Edit Manuscript Info
      </button>
    </div>
  );
};