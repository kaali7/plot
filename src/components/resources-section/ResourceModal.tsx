import React, { useState } from 'react';
import { ResourceForm } from './forms/ResourceForm';
import type { Resource } from '../../types/story.types';
import { resourceSchema } from '../../lib/schemas';

interface ResourceModalProps {
  resource: Resource | null;
  onSave: (resourceData: Partial<Resource>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onSave, onDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'links'>('content');
  
  // Initialize form data
  const [formData, setFormData] = useState<Partial<Resource>>({
    type: resource?.type || 'note',
    title: resource?.title || '',
    content: resource?.content || '',
    url: resource?.url || '',
    file_path: resource?.file_path || '',
    linked_entities: resource?.linked_entities || {
      characters: [],
      scenes: [],
      conflicts: [],
      worldSettings: []
    }
  });

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };


  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const result = resourceSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      setActiveTab('content');
      return;
    }

    onSave(formData);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-surface-dark backdrop-blur-2xl rounded-card w-full max-w-2xl border border-white/10 shadow-glass flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
          <div>
            <h2 className="text-3xl font-sans font-bold text-white tracking-tight">
              {resource ? `Refine Asset` : 'Acquire New Asset'}
            </h2>
            <p className="text-sm font-sans font-medium text-editor-text-muted mt-2">
              {resource ? `Archiving: ${resource.title}` : 'Adding to the narrative repository'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-editor-text-muted hover:text-white transition-all p-2 bg-white/5 hover:bg-white/10 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 border-b border-white/5 bg-white/[0.01]">
          <button
            onClick={() => handleTabChange('content')}
            className={`px-8 py-4 transition-all border-b-2 text-sm font-sans font-bold
            ${activeTab === 'content' 
              ? 'border-primary text-primary bg-white/[0.02]' 
              : 'border-transparent text-editor-text-muted hover:text-white'}`}
          >
            Asset Content
          </button>
          <button
            onClick={() => handleTabChange('links')}
            className={`px-8 py-4 transition-all border-b-2 text-sm font-sans font-bold
            ${activeTab === 'links' 
              ? 'border-primary text-primary bg-white/[0.02]' 
              : 'border-transparent text-editor-text-muted hover:text-white'}`}
          >
            Linked Entities
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
          {activeTab === 'content' && (
            <ResourceForm
              data={formData}
              onUpdate={(data) => setFormData(prev => ({ ...prev, ...data } as Partial<Resource>))}
              errors={errors}
            />
          )}
          {activeTab === 'links' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-white/[0.05] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glass">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-sans font-bold text-white">Narrative Nexus</h3>
              <p className="text-sm font-sans text-editor-text-muted max-w-xs mx-auto leading-relaxed">
                Management of entity relationships is undergoing archival synchronization.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-between items-center">
          <button
            onClick={onDelete}
            disabled={!resource}
            className="text-sm font-sans font-medium text-primary/70 hover:text-primary transition-all disabled:opacity-0 px-4 py-2"
          >
            {resource ? 'Deconstruct Asset' : 'Discard Acquisition'}
          </button>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="text-sm font-sans font-medium text-editor-text-muted hover:text-white transition-all px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-magenta"
            >
              Commit Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};