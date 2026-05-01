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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Resources ({resources.length})</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Resource</span>
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