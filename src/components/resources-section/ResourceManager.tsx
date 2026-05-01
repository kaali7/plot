import React from 'react';
import { ResourceCard } from './ResourceCard';
import type { Resource } from '../../types/story.types';

interface ResourceManagerProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
}

export const ResourceManager: React.FC<ResourceManagerProps> = ({ resources, onResourceClick }) => {
  if (resources.length === 0) {
    return (
      <div className="text-center py-20 card-tactile border-dashed opacity-50">
        <div className="text-editor-magenta/30 mb-6">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-xl font-serif font-bold text-white mb-2">No Archives Found</h3>
        <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest italic">The library remains empty. Begin your collection.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {resources.map(resource => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onClick={() => onResourceClick(resource)}
        />
      ))}
    </div>
  );
};