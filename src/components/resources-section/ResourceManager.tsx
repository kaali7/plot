import React from 'react';
import { ResourceCard } from './ResourceCard';
import type { Resource } from '../../types/story.types';

interface ResourceManagerProps {
  resources: Resource[];
  onResourceClick: (resource: Resource) => void;
  onAddClick: () => void;
}

export const ResourceManager: React.FC<ResourceManagerProps> = ({ resources, onResourceClick, onAddClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {resources.map(resource => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onClick={() => onResourceClick(resource)}
        />
      ))}

      {/* Inline Add Resource Card */}
      <div 
        onClick={onAddClick}
        className="group relative h-full min-h-[200px] bg-white/[0.01] border-2 border-dashed border-white/5 rounded-t-[1.5rem] rounded-b-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.03] hover:border-primary/40 transition-all duration-500"
      >
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] font-bold group-hover:text-white/60 transition-all">Archive Resource</span>
      </div>
    </div>
  );
};