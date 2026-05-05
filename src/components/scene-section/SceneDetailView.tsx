import React, { useState } from 'react';
import { SceneScriptForm } from './forms/SceneScriptForm';
import type { Scene, Character, Conflict } from '../../types/story.types';
import { InlineResourceAttacher } from '../resources-section/InlineResourceAttacher';
import { useStory } from '../../context/StoryContext';

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
  onEdit, 
  onUpdate, 
  onClose,
  isIntegrated = false
}) => {
  const [activeTab, setActiveTab] = useState<'script' | 'details'>('script');
  const { resources } = useStory();

  const linkedResourceIds = resources
    .filter(r => r.linked_entities?.scenes?.includes(scene.id))
    .map(r => r.id);

  const viewContent = (
    <div className={`flex flex-col h-full bg-[#050507] ${!isIntegrated ? 'relative w-full max-w-5xl h-[85vh] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500 ease-out rounded-sm overflow-hidden' : 'w-full rounded-tl-[3rem] border-l border-t border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]'}`}>
      {/* Streamlined Typographic Header */}
      <div className="pt-12 md:pt-16 px-6 md:px-12 pb-5 md:pb-10 border-b border-white/[0.03] flex items-center justify-between z-30 relative">
        {/* Folio Merge Point Decoration */}
        {isIntegrated && (
          <div className="absolute top-0 left-0 w-24 h-24 border-tl border-white/20 rounded-tl-[3rem] -translate-x-1 -translate-y-1 opacity-20 pointer-events-none hidden md:block" />
        )}
        <div className="flex items-start md:items-center space-x-4 md:space-x-8">
          <div className="w-2 h-2 rounded-full bg-editor-magenta shadow-magenta-glow mt-2.5 md:mt-0 shrink-0" />
          <div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white tracking-tight uppercase leading-none">
              {scene.title}
            </h2>
            <div className="flex flex-wrap items-center gap-1.5 md:gap-3 mt-2 md:mt-3">
              <span className="text-[8px] md:text-[10px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold border border-editor-magenta/30 px-2 py-0.5 rounded-sm bg-editor-magenta/5">Active Folio</span>
              <span className="w-1 h-1 rounded-full bg-white/10 hidden md:block" />
              <span className="text-[8px] md:text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] italic">{scene.type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Streamlined Action Tabs */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:space-x-3 px-4 md:px-6 py-2 md:py-3 bg-black/[0.1] border-b border-white/5">
        <button
          onClick={() => setActiveTab('script')}
          className={`px-3 py-1.5 md:px-6 md:py-2 rounded-full text-[8px] md:text-[9px] font-mono font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap
          ${activeTab === 'script' 
            ? 'bg-editor-magenta text-white shadow-magenta-glow' 
            : 'text-editor-text-muted hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          Draft Scripts
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-3 py-1.5 md:px-6 md:py-2 rounded-full text-[8px] md:text-[9px] font-mono font-bold uppercase tracking-[0.15em] transition-all whitespace-nowrap
          ${activeTab === 'details' 
            ? 'bg-editor-magenta text-white shadow-magenta-glow' 
            : 'text-editor-text-muted hover:text-white hover:bg-white/5 border border-white/10'}`}
        >
          Scene Foundation
        </button>
      </div>

      {/* Content Area - Improved Space Utilization */}
      <div className={`flex-1 overflow-hidden bg-black/[0.05] ${activeTab === 'details' ? 'overflow-y-auto custom-scrollbar p-8' : ''}`}>
        {/* Script Tab */}
        {activeTab === 'script' && (
          <div className="h-full animate-in fade-in duration-700">
            <SceneScriptForm 
              data={scene.dialogue || []}
              characters={characters}
              onUpdate={(newScript) => onUpdate({ dialogue: newScript })}
            />
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4">
              {/* Action Bar */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={onEdit}
                  className="flex items-center space-x-2 px-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-mono text-white/40 uppercase tracking-widest hover:bg-editor-magenta hover:text-white hover:border-editor-magenta transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  <span>Edit Scene Foundation</span>
                </button>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* 01. Scene Goal - Primary focus */}
                <section className="col-span-12 p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                  <h4 className="text-[8px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-3 opacity-50">01. Narrative Goal</h4>
                  <p className="text-xl font-serif text-white/90 italic leading-snug">
                    "{scene.goal || 'Define the purpose of this folio...'}"
                  </p>
                </section>

                {/* 01b. Background & Situation */}
                {(scene.context || scene.situation_details) && (
                  <section className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scene.context && (
                      <div className="p-6 bg-white/[0.01] border border-white/5 rounded-xl">
                        <h4 className="text-[8px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-3 opacity-50">Narrative Context</h4>
                        <p className="text-sm font-serif text-white/70 italic leading-relaxed whitespace-pre-wrap">
                          {scene.context}
                        </p>
                      </div>
                    )}
                    {scene.situation_details && (
                      <div className="p-6 bg-white/[0.01] border border-white/5 rounded-xl">
                        <h4 className="text-[8px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-3 opacity-50">Situation Details</h4>
                        <p className="text-sm font-serif text-white/70 leading-relaxed whitespace-pre-wrap">
                          {scene.situation_details}
                        </p>
                      </div>
                    )}
                  </section>
                )}

                {/* 02. Setting - Environmental context */}
                <section className="col-span-12 lg:col-span-8 p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                  <h4 className="text-[8px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-4 opacity-50">02. Setting & Atmosphere</h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest block mb-1">Location</span>
                      <span className="text-sm font-serif text-white/70">{scene.setting?.location || '---'}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest block mb-1">Time</span>
                      <span className="text-sm font-serif text-white/70">{scene.setting?.time || '---'}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest block mb-1">Mood</span>
                      <span className="text-sm font-serif text-white/70">{scene.setting?.environment || '---'}</span>
                    </div>
                  </div>
                </section>

                {/* 03. Perspective */}
                <section className="col-span-12 lg:col-span-4 p-6 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-[8px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-3 opacity-50">03. Perspective</h4>
                    <span className="text-sm font-serif font-bold text-white block">
                      {characters.find(c => c.id === scene.pov_character_id)?.name || 'Narrator'}
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-black/60 border border-editor-magenta/30 flex items-center justify-center text-editor-magenta font-mono font-bold text-lg rounded-lg shadow-magenta-glow/10">
                    {characters.find(c => c.id === scene.pov_character_id)?.name?.charAt(0) || '?'}
                  </div>
                </section>

                {/* 04. Cast */}
                <section className="col-span-12 p-6 bg-black/20 border border-white/5 rounded-xl">
                  <h4 className="text-[8px] font-mono text-editor-magenta uppercase tracking-[0.3em] font-bold mb-4 opacity-50">04. Active Cast</h4>
                  <div className="flex flex-wrap gap-2">
                    {scene.characters && scene.characters.length > 0 ? (
                      scene.characters.map((sc, i) => (
                        <div key={i} className="flex items-center px-4 py-2 bg-black border border-white/5 rounded-full">
                          <span className="text-[10px] font-serif font-bold text-white/80">{characters.find(c => c.id === sc.characterId)?.name}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-white/20 mx-2" />
                          <span className="text-[8px] font-mono text-editor-magenta/60 uppercase tracking-widest">{sc.role}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest italic">No identities assigned to this scene</p>
                    )}
                  </div>
                </section>

                {/* 05. Resources */}
                <section className="col-span-12 p-6 bg-black/20 border border-white/5 rounded-xl">
                  <InlineResourceAttacher
                    entityType="scenes"
                    entityId={scene.id}
                    linkedResourceIds={linkedResourceIds}
                  />
                </section>
              </div>
            </div>
        )}
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
