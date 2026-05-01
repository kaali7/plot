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
}

export const SceneDetailView: React.FC<SceneDetailViewProps> = ({ 
  scene, 
  characters, 
  conflicts, 
  onEdit, 
  onUpdate, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'script' | 'details'>('script');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-sm w-full max-w-5xl max-h-[90vh] overflow-hidden border border-editor-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-editor-border flex items-center justify-between bg-white/[0.01]">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">{scene.title}</h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em]">{scene.type}</span>
              <div className="w-1 h-1 rounded-full bg-editor-border" />
              <span className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest italic">Chronicle Sequence #{scene.order + 1}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-editor-text-muted hover:text-white transition-all p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex px-8 border-b border-editor-border bg-white/[0.01] overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button
            onClick={() => setActiveTab('script')}
            className={`px-8 py-5 transition-all border-b-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${
              activeTab === 'script' 
              ? 'border-editor-magenta text-white bg-white/[0.02]' 
              : 'border-transparent text-editor-text-muted hover:text-white'
            }`}
          >
            Draft Script
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-8 py-5 transition-all border-b-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${
              activeTab === 'details' 
              ? 'border-editor-magenta text-white bg-white/[0.02]' 
              : 'border-transparent text-editor-text-muted hover:text-white'
            }`}
          >
            Scene Foundation
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          
          {/* Script Tab */}
          {activeTab === 'script' && (
            <div className="animate-in fade-in duration-500">
              <SceneScriptForm 
                data={scene.dialogue || []}
                characters={characters}
                onUpdate={(newScript) => onUpdate({ dialogue: newScript })}
              />
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16">
              <div className="flex justify-between items-end pb-6 border-b border-editor-border">
                <div>
                  <h3 className="text-xl font-serif font-bold text-white tracking-tight">Narrative Foundation</h3>
                  <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] mt-1 italic">Structural metadata & world anchors</p>
                </div>
                <button
                  onClick={onEdit}
                  className="btn-magenta px-8 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-sm"
                >
                  Edit Foundation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Left Col: Goal & Setting */}
                <div className="space-y-12">
                  <section>
                    <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em] font-bold mb-4">Scene Intention</h4>
                    <p className="text-lg font-serif text-editor-text leading-relaxed italic border-l border-editor-border pl-6 py-2 opacity-80">
                      "{scene.goal || 'No intention defined'}"
                    </p>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em] font-bold mb-6">Setting Codex</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest w-24">Location</span>
                        <span className="text-sm font-serif text-white">{scene.setting?.location || 'Not mapped'}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest w-24">Temporal</span>
                        <span className="text-sm font-serif text-white">{scene.setting?.time || 'Not charted'}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-[9px] font-mono text-editor-text-muted uppercase tracking-widest w-24">Atmosphere</span>
                        <span className="text-sm font-serif text-white">{scene.setting?.environment || 'Not defined'}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em] font-bold mb-4">Perspective: POV</h4>
                    <div className="flex items-center space-x-4 p-4 bg-white/[0.02] border border-editor-border rounded-sm">
                      <div className="w-10 h-10 bg-surface border border-editor-border flex items-center justify-center text-editor-magenta font-mono font-bold">
                        {characters.find(c => c.id === scene.pov_character_id)?.name?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm font-serif font-bold text-white">
                        {characters.find(c => c.id === scene.pov_character_id)?.name || 'Narrator / Anonymous'}
                      </span>
                    </div>
                  </section>
                </div>

                {/* Right Col: Characters & Conflicts */}
                <div className="space-y-12">
                  <section>
                    <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em] font-bold mb-6">Active Cast</h4>
                    <div className="flex flex-wrap gap-3">
                      {scene.characters && scene.characters.length > 0 ? (
                        scene.characters.map((sc, i) => (
                          <span key={i} className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest border border-editor-border/60 px-4 py-1.5 rounded-sm bg-white/[0.01]">
                            {characters.find(c => c.id === sc.characterId)?.name} <span className="text-editor-magenta opacity-60 ml-2">[{sc.role}]</span>
                          </span>
                        ))
                      ) : (
                        <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-widest italic opacity-40">No identities assigned</p>
                      )}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-mono text-editor-magenta uppercase tracking-[0.2em] font-bold mb-6">Tension Points</h4>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono text-editor-text-muted uppercase tracking-widest block opacity-60">Internal Pressure</span>
                        <p className="text-sm font-serif text-editor-text italic pl-4 border-l border-red-500/30 leading-relaxed">{scene.conflicts?.internal || 'No internal tension recorded'}</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-[8px] font-mono text-editor-text-muted uppercase tracking-widest block opacity-60">External Obstacle</span>
                        <p className="text-sm font-serif text-editor-text italic pl-4 border-l border-orange-500/30 leading-relaxed">{scene.conflicts?.external || 'No external obstacle mapped'}</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-editor-border bg-white/[0.01] flex justify-end">
          <button
            onClick={onClose}
            className="text-[10px] font-mono text-editor-text-muted hover:text-white uppercase tracking-widest transition-all"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
