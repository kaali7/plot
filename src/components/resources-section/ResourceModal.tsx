import React, { useState } from 'react';
import { ResourceForm } from './forms/ResourceForm';
import type { Resource } from '../../types/story.types';
import { resourceSchema } from '../../lib/schemas';
import { Modal } from '../ui/Modal';
import { FiLink, FiFileText } from 'react-icons/fi';

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
    <Modal
      isOpen={true}
      onClose={onClose}
      title={resource ? `Refine Asset` : 'Acquire New Asset'}
      description={resource ? `Archiving: ${resource.title}` : 'Adding to the narrative repository'}
      maxWidth="2xl"
      footer={
        <>
          <button
            onClick={onDelete}
            disabled={!resource}
            className="text-[10px] font-mono text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-all disabled:opacity-0 mr-auto"
          >
            {resource ? 'Deconstruct Asset' : 'Discard Acquisition'}
          </button>
          <button
            onClick={onClose}
            className="text-[10px] font-mono text-editor-text-muted hover:text-white uppercase tracking-widest transition-all px-4"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-magenta px-8 py-2.5 rounded-full"
          >
            Commit Asset
          </button>
        </>
      }
    >
      <div className="flex flex-col h-full -mx-5 md:-mx-8 -mt-5 md:-mt-8">
        {/* Sticky Tabs */}
        <div className="sticky top-0 z-10 flex border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md overflow-x-auto whitespace-nowrap scrollbar-hide touch-pan-x">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 flex flex-col items-center px-4 py-3 transition-all border-b-2 gap-1 group
            ${activeTab === 'content' 
              ? 'border-editor-magenta text-white bg-white/[0.02]' 
              : 'border-transparent text-editor-text-muted hover:text-white'}`}
          >
            <FiFileText className={`${activeTab === 'content' ? 'text-editor-magenta' : 'opacity-40 group-hover:opacity-100'} transition-all`} size={18} />
            <span className="hidden md:block text-[9px] font-mono font-bold uppercase tracking-[0.2em]">Asset Content</span>
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 flex flex-col items-center px-4 py-3 transition-all border-b-2 gap-1 group
            ${activeTab === 'links' 
              ? 'border-editor-magenta text-white bg-white/[0.02]' 
              : 'border-transparent text-editor-text-muted hover:text-white'}`}
          >
            <FiLink className={`${activeTab === 'links' ? 'text-editor-magenta' : 'opacity-40 group-hover:opacity-100'} transition-all`} size={18} />
            <span className="hidden md:block text-[9px] font-mono font-bold uppercase tracking-[0.2em]">Linked Entities</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-5 md:p-8 space-y-6 md:space-y-8">
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
                <FiLink className="text-2xl text-editor-text-muted" />
              </div>
              <h3 className="text-xl font-sans font-bold text-white">Narrative Nexus</h3>
              <p className="text-sm font-sans text-editor-text-muted max-w-xs mx-auto leading-relaxed">
                Management of entity relationships is undergoing archival synchronization.
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};