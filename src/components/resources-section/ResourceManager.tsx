import React from 'react';
import { ResourceCard } from './ResourceCard';
import type { Resource } from '../../types/story.types';

interface ResourceManagerProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
}

export const ResourceManager: React.FC<ResourceManagerProps> = ({ resources, onResourceClick }) => {
  const getResourceTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'url': return 'bg-blue-900/50 text-blue-300 border-blue-700/30';
      case 'note': return 'bg-green-900/50 text-green-300 border-green-700/30';
      case 'image': return 'bg-purple-900/50 text-purple-300 border-purple-700/30';
      case 'reference': return 'bg-orange-900/50 text-orange-300 border-orange-700/30';
      case 'inspiration': return 'bg-pink-900/50 text-pink-300 border-pink-700/30';
      default: return 'bg-gray-900/50 text-gray-300 border-gray-700/30';
    }
  };

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-purple-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm2-5a9 9 0 110 18 9 9 0 010-18z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Resources Yet</h3>
        <p className="text-purple-300">Add your first resource to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map(resource => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          typeColor={getResourceTypeColor(resource.type)}
          onClick={() => onResourceClick(resource)}
        />
      ))}
    </div>
  );
};