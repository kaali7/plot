import React from 'react';
import type { Resource } from '../../types/story.types';

interface ResourceCardProps {
  resource: Resource;
  onClick: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  return (
    <div 
      className="bg-[#1a1b1e] border border-white/5 rounded-t-[1.5rem] rounded-b-lg p-5 md:p-6 cursor-pointer flex flex-col group relative overflow-hidden transition-all duration-500 hover:border-primary/20 hover:bg-[#1e1f22] shadow-xl"
      onClick={() => onClick(resource)}
    >
      {/* Type & REF Line */}
      <div className="flex items-center justify-between mb-4">
        <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest">
          {resource.type.toUpperCase()}
        </span>
        <span className="text-[9px] font-mono text-white/10 uppercase tracking-[0.2em] font-medium">
          #{resource.id.slice(0, 4)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-serif font-black text-white leading-tight mb-6 group-hover:text-primary transition-colors line-clamp-2">
        {resource.title}
      </h3>

      {/* Narrative Library Traits Section */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        {/* Connections Column */}
        <div className="space-y-3">
          <h4 className="text-[7px] font-mono text-primary/40 uppercase tracking-[0.3em] font-bold">
            Connections
          </h4>
          <div className="flex flex-col space-y-1.5">
             {resource.linked_entities.characters.length > 0 && (
              <div className="bg-white/[0.02] border border-white/5 rounded-md px-2 py-1 text-[9px] font-mono text-white/50 uppercase tracking-widest text-center truncate">
                {resource.linked_entities.characters.length} PERS
              </div>
            )}
            {resource.linked_entities.scenes.length > 0 && (
              <div className="bg-white/[0.02] border border-white/5 rounded-md px-2 py-1 text-[9px] font-mono text-white/50 uppercase tracking-widest text-center truncate">
                {resource.linked_entities.scenes.length} SCENE
              </div>
            )}
            {resource.linked_entities.characters.length === 0 && resource.linked_entities.scenes.length === 0 && (
              <div className="text-[7px] font-mono text-white/10 uppercase tracking-widest italic">Unlinked</div>
            )}
          </div>
        </div>

        {/* Context Column */}
        <div className="space-y-3">
          <h4 className="text-[7px] font-mono text-primary/40 uppercase tracking-[0.3em] font-bold">
            Context
          </h4>
          <div className="flex flex-col space-y-1.5">
             <div className="bg-white/[0.02] border border-white/5 rounded-md px-2 py-1 text-[9px] font-mono text-white/50 uppercase tracking-widest text-center">
               {new Date(resource.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
             </div>
          </div>
        </div>
      </div>

      {/* Subtle Gradient Overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};