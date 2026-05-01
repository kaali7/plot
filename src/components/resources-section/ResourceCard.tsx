import React from 'react';
import type { Resource } from '../../types/story.types';

interface ResourceCardProps {
  resource: Resource;
  onClick: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  return (
    <div 
      className="card-tactile group p-6 cursor-pointer flex flex-col justify-between min-h-[280px]"
      onClick={() => onClick(resource)}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-[9px] font-mono text-editor-magenta uppercase tracking-tighter border border-editor-magenta/30 px-2 py-0.5">
              {resource.type}
            </span>
            <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-tighter italic">REF #{resource.id.slice(0, 4)}</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-editor-text group-hover:text-white transition-colors line-clamp-2 leading-tight">{resource.title}</h3>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-editor-magenta shadow-magenta-glow opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {resource.content && (
        <p className="text-editor-text-muted font-serif italic text-base leading-relaxed mb-8 line-clamp-3 opacity-80">"{resource.content}"</p>
      )}

      {resource.url && !resource.content && (
        <div className="mb-8">
          <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest mb-1 italic">External Source</p>
          <p className="text-editor-magenta font-mono text-xs truncate underline">{resource.url}</p>
        </div>
      )}

      <div className="pt-6 border-t border-editor-border mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {Object.entries(resource.linked_entities).map(([key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                return (
                  <span key={key} className="text-[8px] font-mono text-editor-text-muted/60 uppercase tracking-tighter border border-editor-border/30 px-1.5 py-0.5">
                    {value.length} {key.slice(0, 3)}
                  </span>
                );
              }
              if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                 // Handle worldSettings if it's an object with array props or just a flag
                 // Based on types, it's string[]
              }
              return null;
            })}
          </div>
          <button className="text-[9px] font-mono text-editor-text-muted hover:text-white uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100">
            Examine
          </button>
        </div>
      </div>
    </div>
  );
};