import React, { useState } from 'react';
import type { Character } from '../../types/story.types';

interface CharacterDetailViewProps {
  character: Character;
  onEdit: () => void;
  onClose: () => void;
  isIntegrated?: boolean;
}

export const CharacterDetailView: React.FC<CharacterDetailViewProps> = ({ 
  character, 
  onEdit, 
  onClose,
  isIntegrated = false
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'arc' | 'relationships'>('profile');

  const viewContent = (
    <div className={`flex flex-col h-full bg-[#050507] ${!isIntegrated ? 'relative w-full max-w-5xl h-[85vh] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500 ease-out rounded-sm overflow-hidden' : 'w-full rounded-tl-[3rem] border-l border-t border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]'}`}>
      {/* Streamlined Typographic Header */}
      <div className="pt-16 px-12 pb-10 border-b border-white/[0.03] flex items-center justify-between z-30 relative">
        {/* Folio Merge Point Decoration */}
        {isIntegrated && (
          <div className="absolute top-0 left-0 w-24 h-24 border-tl border-white/20 rounded-tl-[3rem] -translate-x-1 -translate-y-1 opacity-20 pointer-events-none" />
        )}
        <div className="flex items-center space-x-8">
          <div className="w-2 h-2 rounded-full bg-editor-magenta shadow-magenta-glow" />
          <div>
            <h2 className="text-4xl font-serif font-bold text-white tracking-tight uppercase leading-none">
              {character.name}
            </h2>
            <div className="flex items-center space-x-3 mt-3">
              <span className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold border border-editor-magenta/30 px-2 py-0.5 rounded-sm bg-editor-magenta/5">{character.role}</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] italic">Identity Architecture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Streamlined Action Tabs */}
      <div className="flex items-center space-x-3 px-6 py-3 bg-black/[0.1] border-b border-white/5">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.15em] transition-all
          ${activeTab === 'profile' 
            ? 'bg-editor-magenta text-white shadow-magenta-glow' 
            : 'text-editor-text-muted hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          Character Profile
        </button>
        <button
          onClick={() => setActiveTab('arc')}
          className={`px-6 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.15em] transition-all
          ${activeTab === 'arc' 
            ? 'bg-editor-magenta text-white shadow-magenta-glow' 
            : 'text-editor-text-muted hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          Narrative Arc
        </button>
        <button
          onClick={() => setActiveTab('relationships')}
          className={`px-6 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.15em] transition-all
          ${activeTab === 'relationships' 
            ? 'bg-editor-magenta text-white shadow-magenta-glow' 
            : 'text-editor-text-muted hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          Relationship Matrix
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/[0.05]">
        <div className="p-8">
          {/* Action Bar */}
          <div className="flex justify-end mb-6">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase tracking-widest hover:bg-editor-magenta hover:text-white hover:border-editor-magenta transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              <span>Edit Persona</span>
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Visual Anchor */}
                <div className="col-span-12 lg:col-span-4">
                  <div className="aspect-[3/4] rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden relative group">
                    {character.image_url ? (
                      <img src={character.image_url} alt={character.name} className="w-full h-full object-cover grayscale" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 text-6xl italic font-serif">
                        {character.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  </div>
                </div>

                {/* Persona Data */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                  <section>
                    <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-4 opacity-50">Identity Description</h4>
                    <p className="text-xl font-serif text-white/90 italic leading-relaxed border-l border-editor-magenta/30 pl-8">
                      "{character.description || 'This identity remains a mystery in the narrative shadows...'}"
                    </p>
                  </section>

                  <div className="grid grid-cols-2 gap-8">
                    <section className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-6">Strengths</h4>
                      <div className="flex flex-wrap gap-2">
                        {character.traits.strengths.map((s, i) => (
                          <span key={i} className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-mono text-white/70 uppercase tracking-widest">{s}</span>
                        ))}
                      </div>
                    </section>
                    <section className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-6">Weaknesses</h4>
                      <div className="flex flex-wrap gap-2">
                        {character.traits.weaknesses.map((w, i) => (
                          <span key={i} className="px-4 py-2 bg-red-500/5 border border-red-500/20 rounded-full text-[10px] font-mono text-red-400/60 uppercase tracking-widest">{w}</span>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'arc' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <section className="p-10 bg-white/[0.01] border border-white/5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-editor-magenta/50 to-transparent" />
                <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.4em] font-bold mb-12 opacity-60">Narrative Trajectory</h4>
                <div className="grid grid-cols-1 gap-12 max-w-2xl">
                  <div className="relative pl-12 border-l border-white/10 group">
                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-editor-magenta shadow-magenta-glow group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] mb-3 block">Anchor point: inception</span>
                    <p className="text-xl font-serif text-white/90 leading-relaxed italic">"{character.arc.start || 'No initial state defined'}"</p>
                  </div>
                  <div className="relative pl-12 border-l border-white/10 group opacity-60 hover:opacity-100 transition-opacity">
                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white/20 group-hover:bg-editor-magenta/30 transition-colors" />
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] mb-3 block">Anchor point: resolution</span>
                    <p className="text-xl font-serif text-white/60 leading-relaxed">{character.arc.end || 'The final resolution of this arc is unwritten'}</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'relationships' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <section className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-8">Relationship matrix</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {character.relationships.length > 0 ? (
                    character.relationships.map((rel, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-editor-magenta/30 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-editor-magenta/10 flex items-center justify-center text-editor-magenta text-[10px] font-mono">ID</div>
                          <div>
                            <span className="text-xs font-serif font-bold text-white block">Reference ID: {rel.characterId.slice(0, 8)}</span>
                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{rel.type}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center opacity-20 italic font-serif">
                      This character walks a solitary path... no relationships forged yet.
                    </div>
                  )}
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
