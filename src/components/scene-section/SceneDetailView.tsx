import React, { useState } from 'react';
import { SceneScriptForm } from './forms/SceneScriptForm';
import type { Scene, Character, Conflict } from '../../types/story.types';

interface SceneDetailViewProps {
  scene: Scene;
  characters: Character[];
  conflicts: Conflict[];
  onEdit: () => void;
  onUpdate: (updates: Partial<Scene>) => void;
  onClose: () => void;
  isIntegrated?: boolean;
}

export const SceneDetailView: React.FC<SceneDetailViewProps> = ({ 
  scene, 
  characters, 
  conflicts, 
  onEdit, 
  onUpdate, 
  onClose,
  isIntegrated = false
}) => {
  const [activeTab, setActiveTab] = useState<'script' | 'details'>('script');

  const viewContent = (
    <div className={`flex flex-col h-full bg-surface-dark ${!isIntegrated ? 'relative w-full max-w-5xl h-[85vh] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500 ease-out rounded-sm overflow-hidden' : 'w-full'}`}>
      {/* Studio Focus Header */}
      <div className="p-6 border-b border-white/[0.03] flex items-center justify-between bg-black/[0.1] sticky top-0 z-30 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <div className="w-2 h-2 rounded-full bg-editor-magenta shadow-[0_0_15px_rgba(255,51,102,0.8)] animate-pulse" />
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight uppercase">
            {scene.title}
          </h2>
          <span className="text-[9px] font-mono text-editor-magenta/60 uppercase tracking-[0.3em] font-bold">Active Session</span>
        </div>
        
        <button
          onClick={onClose}
          className="text-white/20 hover:text-white transition-all p-2 hover:bg-white/5 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Streamlined Action Tabs */}
      <div className="flex items-center space-x-3 px-6 py-3 bg-black/[0.1] border-b border-white/5">
        <button
          onClick={() => setActiveTab('script')}
          className={`px-6 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.15em] transition-all
          ${activeTab === 'script' 
            ? 'bg-editor-magenta text-white shadow-magenta-glow' 
            : 'text-editor-text-muted hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          Draft Scripts
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-6 py-2 rounded-full text-[9px] font-mono font-bold uppercase tracking-[0.15em] transition-all
          ${activeTab === 'details' 
            ? 'bg-editor-magenta text-white shadow-magenta-glow' 
            : 'text-editor-text-muted hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          Scene Foundation
        </button>
      </div>

      {/* Content Area - Improved Space Utilization */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/[0.05]">
        <div className="p-8">
          {/* ... Tabs content kept same ... */}
          {/* Script Tab */}
          {activeTab === 'script' && (
            <div className="animate-in fade-in duration-700">
              <SceneScriptForm 
                data={scene.dialogue || []}
                characters={characters}
                onUpdate={(newScript) => onUpdate({ dialogue: newScript })}
              />
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-16">
              <div className="flex justify-between items-center pb-8 border-b border-white/5">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight">Narrative Anchors</h3>
                  <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-1 italic">Structural metadata & world-building</p>
                </div>
                <button
                  onClick={onEdit}
                  className="flex items-center space-x-3 px-6 py-2.5 bg-white/[0.03] border border-white/10 rounded-sm text-[10px] font-mono text-white/80 uppercase tracking-widest hover:bg-white/5 hover:border-white/20 transition-all"
                >
                  <span>Edit Foundation</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-16">
                {/* Intention Section */}
                <section>
                  <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-6 flex items-center">
                    <span className="w-8 h-px bg-editor-magenta/30 mr-4" />
                    Scene Intention
                  </h4>
                  <p className="text-xl font-serif text-editor-text leading-relaxed italic border-l-2 border-editor-magenta/20 pl-8 py-1 opacity-90">
                    "{scene.goal || 'No intention defined'}"
                  </p>
                </section>

                {/* Setting Grid */}
                <section>
                  <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-8 flex items-center">
                    <span className="w-8 h-px bg-editor-magenta/30 mr-4" />
                    Setting Codex
                  </h4>
                  <div className="grid grid-cols-3 gap-8">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest block mb-4">Location</span>
                      <span className="text-sm font-serif text-white font-bold">{scene.setting?.location || 'Not mapped'}</span>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest block mb-4">Temporal</span>
                      <span className="text-sm font-serif text-white font-bold">{scene.setting?.time || 'Not charted'}</span>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest block mb-4">Atmosphere</span>
                      <span className="text-sm font-serif text-white font-bold">{scene.setting?.environment || 'Not defined'}</span>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-16">
                  {/* POV Section */}
                  <section>
                    <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-6">Perspective: POV</h4>
                    <div className="flex items-center space-x-6 p-6 bg-white/[0.03] border border-white/10 rounded-xl">
                      <div className="w-12 h-12 bg-black/40 border border-editor-magenta/30 flex items-center justify-center text-editor-magenta font-mono font-bold text-xl rounded-lg shadow-magenta-glow/10">
                        {characters.find(c => c.id === scene.pov_character_id)?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <span className="text-sm font-serif font-bold text-white block">
                          {characters.find(c => c.id === scene.pov_character_id)?.name || 'Narrator / Anonymous'}
                        </span>
                        <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest italic">Viewing Perspective</span>
                      </div>
                    </div>
                  </section>

                  {/* Active Cast */}
                  <section>
                    <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-6">Active Cast</h4>
                    <div className="flex flex-wrap gap-3">
                      {scene.characters && scene.characters.length > 0 ? (
                        scene.characters.map((sc, i) => (
                          <div key={i} className="flex items-center px-4 py-2 bg-black border border-white/10 rounded-full">
                            <span className="text-[10px] font-serif font-bold text-white/90">{characters.find(c => c.id === sc.characterId)?.name}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20 mx-3" />
                            <span className="text-[9px] font-mono text-editor-magenta uppercase tracking-widest opacity-60">{sc.role}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest italic opacity-40">No identities assigned</p>
                      )}
                    </div>
                  </section>
                </div>

                {/* Tension Points */}
                <section>
                  <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-8 flex items-center">
                    <span className="w-8 h-px bg-editor-magenta/30 mr-4" />
                    Tension Points
                  </h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 bg-black border border-white/5 rounded-2xl relative overflow-hidden group hover:border-red-500/20 transition-all">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500/30 group-hover:bg-red-500/60 transition-all" />
                      <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest block mb-4 opacity-60">Internal Pressure</span>
                      <p className="text-sm font-serif text-editor-text italic leading-relaxed">{scene.conflicts?.internal || 'No internal tension recorded'}</p>
                    </div>
                    <div className="p-8 bg-black border border-white/5 rounded-2xl relative overflow-hidden group hover:border-orange-500/20 transition-all">
                      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/30 group-hover:bg-orange-500/60 transition-all" />
                      <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest block mb-4 opacity-60">External Obstacle</span>
                      <p className="text-sm font-serif text-editor-text italic leading-relaxed">{scene.conflicts?.external || 'No external obstacle mapped'}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );

  if (isIntegrated) return viewContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-12 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500" 
        onClick={onClose}
      />
      {viewContent}
    </div>
  );
};
