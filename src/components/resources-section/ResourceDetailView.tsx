import React, { useState } from 'react';
import type { Resource } from '../../types/story.types';

interface ResourceDetailViewProps {
  resource: Resource;
  onEdit: () => void;
  onClose: () => void;
  isIntegrated?: boolean;
}

export const ResourceDetailView: React.FC<ResourceDetailViewProps> = ({ 
  resource, 
  onEdit, 
  onClose,
  isIntegrated = false
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'connections' | 'metadata'>('content');

  const viewContent = (
    <div className={`flex flex-col h-full bg-[#050507] ${!isIntegrated ? 'relative w-full max-w-5xl h-[85vh] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500 ease-out rounded-sm overflow-hidden' : 'w-full rounded-tl-[3rem] border-l border-t border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]'}`}>
      {/* Streamlined Typographic Header */}
      <div className="pt-16 px-12 pb-10 border-b border-white/[0.03] flex items-center justify-between z-30 relative">
        {isIntegrated && (
          <div className="absolute top-0 left-0 w-24 h-24 border-tl border-white/20 rounded-tl-[3rem] -translate-x-1 -translate-y-1 opacity-20 pointer-events-none" />
        )}
        <div className="flex items-center space-x-8">
          <div className="w-2 h-2 rounded-full bg-editor-magenta shadow-magenta-glow" />
          <div>
            <h2 className="text-4xl font-serif font-bold text-white tracking-tight uppercase leading-none">
              {resource.title}
            </h2>
            <div className="flex items-center space-x-3 mt-3">
              <span className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold border border-editor-magenta/30 px-2 py-0.5 rounded-sm bg-editor-magenta/5">{resource.type}</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] italic">Archive Reference</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Tabs */}
      <div className="flex items-center space-x-3 px-6 py-3 bg-black/[0.1] border-b border-white/5">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-6 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.15em] transition-all
          ${activeTab === 'content' 
            ? 'bg-editor-magenta text-white shadow-magenta-glow' 
            : 'text-editor-text-muted hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          Folio Content
        </button>
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-6 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.15em] transition-all
          ${activeTab === 'connections' 
            ? 'bg-editor-magenta text-white shadow-magenta-glow' 
            : 'text-editor-text-muted hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          Entity Connections
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={`px-6 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.15em] transition-all
          ${activeTab === 'metadata' 
            ? 'bg-editor-magenta text-white shadow-magenta-glow' 
            : 'text-editor-text-muted hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          Source Metadata
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/[0.05]">
        <div className="p-8">
          <div className="flex justify-end mb-6">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase tracking-widest hover:bg-editor-magenta hover:text-white hover:border-editor-magenta transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              <span>Modify Archive</span>
            </button>
          </div>

          {activeTab === 'content' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
              <section className="p-10 bg-white/[0.01] border border-white/5 rounded-3xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-editor-magenta/50 to-transparent" />
                 <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.4em] font-bold mb-8 opacity-60">Transcription</h4>
                 {resource.content ? (
                   <p className="text-xl font-serif text-white/90 leading-relaxed italic border-l border-editor-magenta/30 pl-8">
                     "{resource.content}"
                   </p>
                 ) : (
                   <div className="py-20 text-center opacity-20 italic font-serif">
                     No text transcription available for this archive.
                   </div>
                 )}
              </section>

              {resource.url && (
                <section className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-4">External Reference</h4>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-editor-magenta hover:underline font-mono text-sm break-all">
                    {resource.url}
                  </a>
                </section>
              )}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
              <section className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-8">Linked Identities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resource.linked_entities.characters.length > 0 ? (
                    resource.linked_entities.characters.map((charId, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-editor-magenta/10 flex items-center justify-center text-editor-magenta text-[10px] font-mono">ID</div>
                          <span className="text-xs font-serif font-bold text-white block">Reference ID: {charId.slice(0, 8)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center opacity-20 italic font-serif text-sm">
                      No identities linked to this resource.
                    </div>
                  )}
                </div>
              </section>

              <section className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-8">Narrative Scenes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resource.linked_entities.scenes.length > 0 ? (
                    resource.linked_entities.scenes.map((sceneId, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl">
                         <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 text-[10px] font-mono">SC</div>
                          <span className="text-xs font-serif font-bold text-white block">Scene ID: {sceneId.slice(0, 8)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center opacity-20 italic font-serif text-sm">
                      No scenes linked to this resource.
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <section className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-8">
                <div>
                  <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-4">Temporal Markers</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-[9px] font-mono text-white/20 uppercase block mb-1">Created</span>
                      <span className="text-xs font-mono text-white/70">{new Date(resource.created_at).toLocaleString()}</span>
                    </div>
                    <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-[9px] font-mono text-white/20 uppercase block mb-1">Updated</span>
                      <span className="text-xs font-mono text-white/70">{new Date(resource.updated_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-4">Storage Hash</h4>
                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl">
                    <span className="text-xs font-mono text-white/30 break-all uppercase tracking-tighter">{resource.id}</span>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isIntegrated) return viewContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-12 overflow-hidden">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      {viewContent}
    </div>
  );
};
