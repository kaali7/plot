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
      {/* Mobile Close Button - Left Side */}
      <button 
        onClick={onClose}
        className="md:hidden absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:text-white backdrop-blur-md transition-all duration-300 z-[60]"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* Streamlined Typographic Header */}
      <div className="pt-8 md:pt-10 pl-20 pr-6 md:pl-24 md:pr-12 pb-4 md:pb-6 border-b border-white/[0.03] flex items-center justify-between z-30 relative">
        {isIntegrated && (
          <div className="absolute top-0 left-0 w-24 h-24 border-tl border-white/20 rounded-tl-[3rem] -translate-x-1 -translate-y-1 opacity-20 pointer-events-none hidden md:block" />
        )}
        <div className="flex items-start md:items-center space-x-4 md:space-x-8">
          <div className="w-2 h-2 rounded-full bg-primary shadow-primary-glow mt-2.5 md:mt-0 shrink-0" />
          <div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight uppercase leading-none">
              {resource.title}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 md:gap-3 mt-2 md:mt-3">
              <span className="text-[8px] md:text-[10px] font-mono text-primary uppercase tracking-[0.3em] font-bold border border-primary/30 px-2 py-0.5 rounded-sm bg-primary/5">{resource.type}</span>
              <span className="w-1 h-1 rounded-full bg-white/10 hidden md:block" />
              <span className="text-[8px] md:text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] italic">Archive Reference</span>
            </div>
          </div>
        </div>

        {/* Action Buttons - Moved to Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[8px] md:text-[9px] font-mono text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all shrink-0"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            <span className="hidden sm:inline">Modify Archive</span>
          </button>
        </div>
      </div>

      {/* Modern Pill Tabs */}
      <div className="px-4 md:px-6 py-2 md:py-3 bg-[#050507] border-b border-white/[0.02]">
        <div className="inline-flex w-full md:max-w-md items-center rounded-2xl bg-[#12151d] p-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('content')}
            className={`flex flex-1 items-center justify-center px-4 py-1.5 rounded-xl text-center text-[8px] md:text-[9px] font-bold uppercase tracking-[0.16em] leading-none transition-all whitespace-nowrap
              ${activeTab === 'content'
                ? 'bg-primary text-white shadow-primary-glow'
                : 'text-[#7e8490] hover:text-white hover:bg-white/[0.03]'}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex flex-1 items-center justify-center px-4 py-1.5 rounded-xl text-center text-[8px] md:text-[9px] font-bold uppercase tracking-[0.16em] leading-none transition-all whitespace-nowrap
              ${activeTab === 'connections'
                ? 'bg-primary text-white shadow-primary-glow'
                : 'text-[#7e8490] hover:text-white hover:bg-white/[0.03]'}`}
          >
            Connections
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`flex flex-1 items-center justify-center px-4 py-1.5 rounded-xl text-center text-[8px] md:text-[9px] font-bold uppercase tracking-[0.16em] leading-none transition-all whitespace-nowrap
              ${activeTab === 'metadata'
                ? 'bg-primary text-white shadow-primary-glow'
                : 'text-[#7e8490] hover:text-white hover:bg-white/[0.03]'}`}
          >
            Metadata
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/[0.05]">
        <div className="p-4 md:p-8">

          {activeTab === 'content' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
              <section className="p-10 bg-white/[0.01] border border-white/5 rounded-3xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-primary/50 to-transparent" />
                 <h4 className="text-[10px] font-mono text-primary uppercase tracking-[0.4em] font-bold mb-8 opacity-60">Transcription</h4>
                 {resource.content ? (
                   <p className="text-xl font-serif text-white/90 leading-relaxed italic border-l border-primary/30 pl-8">
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
                  <h4 className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-4">External Reference</h4>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-sm break-all">
                    {resource.url}
                  </a>
                </section>
              )}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
              <section className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <h4 className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-8">Linked Identities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resource.linked_entities.characters.length > 0 ? (
                    resource.linked_entities.characters.map((charId, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-mono">ID</div>
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
                <h4 className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-8">Narrative Scenes</h4>
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
                  <h4 className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-4">Temporal Markers</h4>
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
                  <h4 className="text-[10px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-4">Storage Hash</h4>
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
