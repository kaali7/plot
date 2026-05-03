import React from 'react';
import type { Resource } from '../../types/story.types';

interface ResourceCardProps {
  resource: Resource;
  onClick: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  return (
    <div 
      className="card-tactile group p-8 cursor-pointer flex flex-col justify-between min-h-[320px] relative overflow-hidden"
      onClick={() => onClick(resource)}
    >
      {/* Quick Edit Action */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onClick(resource);
        }}
        className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 opacity-0 group-hover:opacity-100 hover:bg-editor-magenta hover:text-white hover:border-editor-magenta transition-all duration-300 z-20"
        title="Examine Resource"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
      </button>

      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-[10px] font-mono text-editor-magenta uppercase tracking-tighter border border-editor-magenta/30 px-2 py-0.5 bg-editor-magenta/5">
              {resource.type}
            </span>
            <span className="text-[10px] font-mono text-editor-text-muted uppercase tracking-tighter italic">REF #{resource.id.slice(0, 4)}</span>
          </div>
          <h3 className="text-3xl font-serif font-bold text-editor-text group-hover:text-white transition-colors leading-tight">{resource.title}</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-editor-magenta shadow-magenta-glow opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {resource.content && (
        <p className="text-editor-text-muted font-serif italic text-lg leading-relaxed mb-8 line-clamp-3">"{resource.content}"</p>
      )}

      {resource.url && !resource.content && (
        <div className="mb-8 p-4 bg-white/[0.02] border border-white/5 rounded-sm">
          <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest mb-2 italic">External Source</p>
          <p className="text-editor-magenta font-mono text-xs truncate underline">{resource.url}</p>
        </div>
      )}

      {/* Linked Entities Preview */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-widest mb-3 italic">Connections</h4>
          <div className="flex flex-wrap gap-2">
            {resource.linked_entities.characters.length > 0 && (
              <span className="glass-pill text-[9px] uppercase tracking-tighter border-white/10">
                {resource.linked_entities.characters.length} PERS
              </span>
            )}
            {resource.linked_entities.scenes.length > 0 && (
              <span className="glass-pill text-[9px] uppercase tracking-tighter border-white/10">
                {resource.linked_entities.scenes.length} SCENE
              </span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-widest mb-3 italic">Context</h4>
          <div className="flex flex-wrap gap-2">
             <span className="glass-pill text-[9px] uppercase tracking-tighter border-white/10">
               {new Date(resource.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
             </span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-editor-border mt-auto">
        <div className="flex justify-between items-center">
          <div className="flex -space-x-2">
            {resource.linked_entities.characters.slice(0, 3).map((_, i) => (
              <div key={i} className="w-5 h-5 rounded-full border border-editor-border bg-surface flex items-center justify-center text-[8px] font-mono text-editor-magenta">
                👤
              </div>
            ))}
          </div>
          <span className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest italic">
            {resource.url ? 'Hyperlink' : 'Folio Note'}
          </span>
        </div>
      </div>
    </div>
  );
};