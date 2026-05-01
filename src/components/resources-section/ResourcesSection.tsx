import React, { useState } from 'react';
import { ResourceManager } from './ResourceManager';
import { ResourceModal } from './ResourceModal';
import type { Resource } from '../../types/story.types';

interface ResourcesSectionProps {
  resources: Resource[];
  onResourceAdd: (resourceData: Partial<Resource>) => void;
  onResourceUpdate: (id: string, updates: Partial<Resource>) => void;
  onResourceDelete: (id: string) => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ 
  resources, 
  onResourceAdd, 
  onResourceUpdate, 
  onResourceDelete 
}) => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const handleCloseModal = () => {
    setSelectedResource(null);
    setShowAddModal(false);
  };

  const handleSaveResource = (resourceData: Partial<Resource>) => {
    if (selectedResource) {
      onResourceUpdate(selectedResource.id, resourceData);
    } else {
      onResourceAdd(resourceData);
    }
    handleCloseModal();
  };

  const handleDeleteResource = () => {
    if (selectedResource) {
      onResourceDelete(selectedResource.id);
      handleCloseModal();
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-end justify-between pb-8 border-b border-editor-border">
        <div>
          <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Narrative Library</h2>
          <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-2 italic">Repository of Knowledge & Inspiration ({resources.length})</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-magenta px-8 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm"
        >
          Archive Resource
        </button>
      </div>

      {/* Resource Grid */}
      <ResourceManager 
        resources={resources}
        onResourceClick={handleResourceClick}
      />

      {/* Resource Modal */}
      {(selectedResource || showAddModal) && (
        <ResourceModal
          resource={selectedResource}
          onSave={handleSaveResource}
          onDelete={handleDeleteResource}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};