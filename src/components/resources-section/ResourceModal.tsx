import React, { useState } from 'react';
import { ResourceForm } from './forms/ResourceForm';
import type { Resource } from '../../types/story.types';

interface ResourceModalProps {
  resource: Resource | null;
  onSave: (resourceData: Partial<Resource>) => void;
  onDelete: () => void;
  onClose: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onSave, onDelete, onClose }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'links'> = 'content';
  
  // Initialize form data
  const [formData, setFormData] = useState<Partial<Resource>>({
    type: resource?.type || 'note',
    title: resource?.title || '',
    content: resource?.content,
    url: resource?.url,
    file_path: resource?.file_path,
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

  const handleFormUpdate = (section: keyof Partial<Resource>, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a001f] rounded-xl w-full max-w-2xl mx-4 p-6 border border-purple-900/30 shadow-[0_0_20px_rgba(138,0,194,0.2)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {resource ? `Edit Resource: ${resource.title}` : 'Add New Resource'}
          </h2>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 pb-2 border-b border-purple-900/30">
          <button
            key="content"
            onClick={() => handleTabChange('content')}
            className={`flex-1 text-center py-2 rounded-t-lg 
            ${activeTab === 'content' 
              ? 'bg-purple-800/50 border-b-2 border-purple-500 text-purple-200' 
              : 'hover:bg-[#1a001f]/50 text-purple-300'}`}
          >
            <span className="mr-1">📄</span>
            <span>Content</span>
          </button>
          <button
            key="links"
            onClick={() => handleTabChange('links')}
            className={`flex-1 text-center py-2 rounded-t-lg 
            ${activeTab === 'links' 
              ? 'bg-purple-800/50 border-b-2 border-purple-500 text-purple-200' 
              : 'hover:bg-[#1a001f]/50 text-purple-300'}`}
          >
            <span className="mr-1">🔗</span>
            <span>Links</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {activeTab === 'content' && (
            <ResourceForm
              data={formData}
              onUpdate={(data) => handleFormUpdate('content', data)}
            />
          )}
          {activeTab === 'links' && (
            <div>
              {/* In a real implementation, this would show linked entities and allow managing them */}
              <p className="text-purple-400 text-center py-8">
                Resource linking management would be implemented here
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onDelete}
            disabled={!resource}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded transition-colors"
          >
            {resource ? 'Delete Resource' : 'Discard'}
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded transition-colors"
          >
            Save Resource
          </button>
        </div>
      </div>
    </div>
  );
};