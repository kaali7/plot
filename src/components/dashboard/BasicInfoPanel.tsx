import React, { useState } from 'react';
import type { Story } from '../../types/story.types';
import { storySchema } from '../../lib/schemas';
import { Modal } from '../ui/Modal';

interface BasicInfoPanelProps {
  story: Story;
  onUpdate: (updates: Partial<Story>) => void;
}

export const BasicInfoPanel: React.FC<BasicInfoPanelProps> = ({ story, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

    let finalDescription = formData.description;
    if (story.description?.startsWith('{')) {
      try {
        const parsed = JSON.parse(story.description);
        finalDescription = JSON.stringify({ ...parsed, premise: formData.description });
      } catch (e) {
      }
    }
    
    onUpdate({
      ...formData,
      description: finalDescription
    });
    setErrors({});
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setFormData({
      name: story.name || '',
      theme: story.theme || '',
      description: displayDescription
    });
    setErrors({});
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col">
        <h3 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-3 md:mb-4 leading-[1.1] md:leading-tight">
          {story.name}
        </h3>
        {story.theme && (
          <p className="text-editor-magenta font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-extrabold mb-6 md:mb-10 italic flex items-center">
            <span className="opacity-40 mr-3 not-italic font-bold">THEME:</span>
            <span className="bg-editor-magenta/10 px-2 py-0.5 rounded-sm">{story.theme}</span>
          </p>
        )}
        <div className="max-w-3xl relative">
          {displayDescription ? (
            <div className="relative group">
              <div className="absolute -left-6 md:-left-8 top-0 bottom-0 w-1 bg-editor-magenta/20 group-hover:bg-editor-magenta/40 transition-colors rounded-full" />
              <p className="text-editor-text leading-relaxed font-serif text-lg md:text-xl italic opacity-90 py-1">
                "{displayDescription}"
              </p>
            </div>
          ) : (
            <p className="text-editor-text-muted font-serif italic text-lg opacity-40 py-4">
              No core premise established yet.
            </p>
          )}
        </div>
      </div>
      
      <div className="pt-6 md:pt-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-fit px-8 py-4 md:py-3 bg-white/[0.02] border border-white/5 rounded-full text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] hover:bg-editor-magenta/10 hover:text-editor-magenta hover:border-editor-magenta/30 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <span>Edit Foundation</span>
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCancel} 
        title="Manuscript Foundation"
      >
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
              className={`w-full input-tactile font-serif min-h-[150px] leading-relaxed ${errors.description ? 'border-red-500/50' : ''}`}
              placeholder="Summarize the heart of your narrative..."
              maxLength={5000}
            />
            {errors.description && <p className="text-red-500 text-[10px] font-mono mt-1 uppercase tracking-wider">{errors.description}</p>}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded-sm text-[10px] font-bold tracking-widest uppercase border border-white/10 text-editor-text-muted hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2 btn-magenta text-[10px] font-bold tracking-widest uppercase rounded-sm"
            >
              Update Foundation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};