import React from 'react';
import type { Resource } from '../../types/story.types';

interface ResourceCardProps {
  resource: Resource;
  onClick: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  return (
    <div 
      className="bg-[#121218] border border-white/5 rounded-t-[2rem] rounded-b-xl p-6 md:p-10 cursor-pointer flex flex-col group relative overflow-hidden transition-all duration-500 hover:border-editor-magenta/30"
      onClick={() => onClick(resource)}
    >
      {/* Type & REF Line */}
      <div className="flex items-center space-x-4 mb-5">
        <span className="bg-[#2d0a14] text-editor-magenta px-3 py-1 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest">
          {resource.type.toUpperCase()}
        </span>
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] italic">
          REF #{resource.id.slice(0, 4)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-3xl md:text-6xl font-serif font-bold text-white leading-tight mb-8 group-hover:text-white transition-colors">
        {resource.title}
      </h3>

      {/* Narrative Library Traits Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Connections Column */}
        <div className="space-y-4">
          <h4 className="text-[9px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold">
            Connections
          </h4>
          <div className="flex flex-col space-y-2">
             {resource.linked_entities.characters.length > 0 && (
              <div className="bg-white/[0.02] border border-white/5 rounded-full px-3 py-2 text-[10px] font-mono text-white/60 uppercase tracking-widest text-center">
                {resource.linked_entities.characters.length} PERS
              </div>
            )}
            {resource.linked_entities.scenes.length > 0 && (
              <div className="bg-white/[0.02] border border-white/5 rounded-full px-3 py-2 text-[10px] font-mono text-white/60 uppercase tracking-widest text-center">
                {resource.linked_entities.scenes.length} SCENE
              </div>
            )}
          </div>
        </div>

        {/* Context Column */}
        <div className="space-y-4">
          <h4 className="text-[9px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold">
            Context
          </h4>
          <div className="flex flex-col space-y-2">
             <div className="bg-white/[0.02] border border-white/5 rounded-full px-3 py-2 text-[10px] font-mono text-white/60 uppercase tracking-widest text-center">
               {new Date(resource.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Area */}
      <div className="pt-8 mt-8 border-t border-white/5 flex flex-col items-end">
        <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] font-bold italic">
          {resource.type === 'note' ? 'Folio Note' : resource.type.toUpperCase()}
        </span>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
    </div>
  );
};