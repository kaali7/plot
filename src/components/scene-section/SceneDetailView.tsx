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
      <div className={`flex w-full max-w-full flex-col h-full overflow-x-hidden bg-[#050507] ${!isIntegrated ? 'relative h-[85vh] max-w-5xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-right duration-500 ease-out rounded-sm overflow-hidden' : 'rounded-tl-[2rem] md:rounded-tl-[3rem] border-l border-t border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]'}`}>
        {/* Mobile Close Button - Left Side */}
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 left-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:text-white backdrop-blur-md transition-all duration-300 z-[60]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Streamlined Typographic Header */}
        <div className="pl-16 pr-4 md:pl-24 md:pr-10 pt-4 md:pt-7 pb-3 md:pb-4 border-b border-white/[0.03] flex items-center justify-between z-30 relative bg-[#050507]">
          <div className="flex min-w-0 items-center space-x-3 md:space-x-4">
            {/* Scene Identity Icon */}
            <div className="relative shrink-0 w-8 h-8 md:w-9 md:h-9 bg-white rounded-lg flex items-center justify-center shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
              <span className="text-[10px] md:text-[11px] font-mono font-bold text-black tracking-tighter">
                {String(scene.order !== undefined ? scene.order + 1 : 1).padStart(2, '0')}
              </span>
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base md:text-xl font-serif font-black text-white tracking-tight uppercase leading-none">
                {scene.title}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:mt-2 md:gap-2">
                <span className="text-[7px] md:text-[8px] font-bold text-[#5865f2] uppercase tracking-[0.16em] bg-[#5865f2]/10 border border-[#5865f2]/20 px-1.5 py-0.5 rounded">Active Folio</span>
                <span className="text-[7px] md:text-[8px] font-bold text-[#949ba4] uppercase tracking-[0.16em] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">Conflict</span>
              </div>
            </div>
          </div>

          {/* Edit Button - Moved to Header */}
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[8px] md:text-[9px] font-mono text-white/40 uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all shrink-0"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            <span className="hidden sm:inline">Edit Foundation</span>
          </button>
        </div>

      {/* Modern Pill Tabs */}
      <div className="px-4 md:px-6 py-2 md:py-3 bg-[#050507] border-b border-white/[0.02]">
        <div className="inline-flex w-full md:max-w-xs items-center rounded-2xl bg-[#12151d] p-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
        <button
          onClick={() => setActiveTab('script')}
          className={`flex flex-1 items-center justify-center px-4 py-1.5 rounded-xl text-center text-[8px] md:text-[9px] font-bold uppercase tracking-[0.16em] leading-none transition-all
            ${activeTab === 'script'
              ? 'bg-white/[0.08] text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)]'
              : 'text-[#7e8490] hover:text-white hover:bg-white/[0.03]'}`}
        >
          Scripts
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`flex flex-1 items-center justify-center px-4 py-1.5 rounded-xl text-center text-[8px] md:text-[9px] font-bold uppercase tracking-[0.16em] leading-none transition-all
          ${activeTab === 'details' 
            ? 'bg-white/[0.08] text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)]' 
            : 'text-[#7e8490] hover:text-white hover:bg-white/[0.03]'}`}
        >
          Foundation
        </button>
        </div>
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

              <div className="grid grid-cols-12 gap-4">
                {/* 01. Scene Goal - Primary focus */}
                <section className="col-span-12 p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                  <h4 className="text-[8px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-3 opacity-50">01. Narrative Goal</h4>
                  <p className="text-xl font-serif text-white/90 italic leading-snug">
                    "{scene.goal || 'Define the purpose of this folio...'}"
                  </p>
                </section>

                {/* 01b. Background & Situation */}
                {(scene.context || scene.situation_details) && (
                  <section className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scene.context && (
                      <div className="p-6 bg-white/[0.01] border border-white/5 rounded-xl">
                        <h4 className="text-[8px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-3 opacity-50">Narrative Context</h4>
                        <p className="text-sm font-serif text-white/70 italic leading-relaxed whitespace-pre-wrap">
                          {scene.context}
                        </p>
                      </div>
                    )}
                    {scene.situation_details && (
                      <div className="p-6 bg-white/[0.01] border border-white/5 rounded-xl">
                        <h4 className="text-[8px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-3 opacity-50">Situation Details</h4>
                        <p className="text-sm font-serif text-white/70 leading-relaxed whitespace-pre-wrap">
                          {scene.situation_details}
                        </p>
                      </div>
                    )}
                  </section>
                )}

                {/* 02. Setting - Environmental context */}
                <section className="col-span-12 lg:col-span-8 p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                  <h4 className="text-[8px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-4 opacity-50">02. Setting & Atmosphere</h4>
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
                    <h4 className="text-[8px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-3 opacity-50">03. Perspective</h4>
                    <span className="text-sm font-serif font-bold text-white block">
                      {characters.find(c => c.id === scene.pov_character_id)?.name || 'Narrator'}
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-black/60 border border-primary/30 flex items-center justify-center text-primary font-mono font-bold text-lg rounded-lg shadow-primary-glow/10">
                    {characters.find(c => c.id === scene.pov_character_id)?.name?.charAt(0) || '?'}
                  </div>
                </section>

                {/* 04. Cast */}
                <section className="col-span-12 p-6 bg-black/20 border border-white/5 rounded-xl">
                  <h4 className="text-[8px] font-mono text-primary uppercase tracking-[0.3em] font-bold mb-4 opacity-50">04. Active Cast</h4>
                  <div className="flex flex-wrap gap-2">
                    {scene.characters && scene.characters.length > 0 ? (
                      scene.characters.map((sc, i) => (
                        <div key={i} className="flex items-center px-4 py-2 bg-black border border-white/5 rounded-full">
                          <span className="text-[10px] font-serif font-bold text-white/80">{characters.find(c => c.id === sc.characterId)?.name}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-white/20 mx-2" />
                          <span className="text-[8px] font-mono text-primary/60 uppercase tracking-widest">{sc.role}</span>
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
