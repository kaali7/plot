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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a001f] rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-purple-900/30 shadow-[0_0_40px_rgba(138,0,194,0.3)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-purple-900/30 flex items-center justify-between bg-gradient-to-r from-[#1a001f] to-[#2a003f]">
          <div>
            <h2 className="text-xl font-bold text-white mb-0.5">{scene.title}</h2>
            <div className="flex items-center space-x-3 text-xs">
              <span className="text-purple-400 uppercase tracking-wider font-semibold">{scene.type}</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-400">Order: {scene.order + 1}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex px-6 pt-4 border-b border-purple-900/10 space-x-8">
          <button
            onClick={() => setActiveTab('script')}
            className={`pb-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === 'script' 
              ? 'text-purple-400 border-purple-500' 
              : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            📝 Scene Script
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === 'details' 
              ? 'text-purple-400 border-purple-500' 
              : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            📋 Scene Details
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {/* Script Tab */}
          {activeTab === 'script' && (
            <div className="animate-in fade-in duration-300">
              <SceneScriptForm 
                data={scene.dialogue || []}
                characters={characters}
                onUpdate={(newScript) => onUpdate({ dialogue: newScript })}
              />
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-8 bg-purple-900/10 p-4 rounded-xl border border-purple-900/20">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Scene Foundation</h3>
                  <p className="text-xs text-gray-500 italic">Basic info, settings, and conflicts</p>
                </div>
                <button
                  onClick={onEdit}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 shadow-lg shadow-purple-900/20"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit Foundation</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Col: Goal & Setting */}
                <div className="space-y-8">
                  <section>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center">
                      <span className="mr-2">🎯</span> Scene Goal
                    </h4>
                    <p className="text-sm text-gray-300 bg-[#0a000f]/60 p-4 rounded-xl border border-purple-900/30 leading-relaxed italic">
                      "{scene.goal || 'No goal defined'}"
                    </p>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center">
                      <span className="mr-2">📍</span> Setting & Environment
                    </h4>
                    <div className="space-y-3 text-sm text-gray-400 pl-2">
                      <p className="flex items-center"><span className="text-purple-500 mr-3 w-5">📍</span> <span className="font-bold text-gray-300 mr-2 min-w-[70px]">Location:</span> {scene.setting?.location || 'Not set'}</p>
                      <p className="flex items-center"><span className="text-purple-500 mr-3 w-5">🕒</span> <span className="font-bold text-gray-300 mr-2 min-w-[70px]">Time:</span> {scene.setting?.time || 'Not set'}</p>
                      <p className="flex items-center"><span className="text-purple-500 mr-3 w-5">🌿</span> <span className="font-bold text-gray-300 mr-2 min-w-[70px]">Env:</span> {scene.setting?.environment || 'Not set'}</p>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center">
                      <span className="mr-2">👁️</span> POV Character
                    </h4>
                    <div className="flex items-center space-x-3 bg-purple-900/20 p-3 rounded-xl border border-purple-900/30">
                      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-black">
                        {characters.find(c => c.id === scene.pov_character_id)?.name?.charAt(0) || '?'}
                      </div>
                      <span className="text-sm text-gray-200 font-medium">
                        {characters.find(c => c.id === scene.pov_character_id)?.name || 'Narrator / Third Person'}
                      </span>
                    </div>
                  </section>
                </div>

                {/* Right Col: Characters & Conflicts */}
                <div className="space-y-8">
                  <section>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center">
                      <span className="mr-2">👥</span> Scene Cast
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {scene.characters && scene.characters.length > 0 ? (
                        scene.characters.map((sc, i) => (
                          <span key={i} className="px-3 py-1.5 bg-purple-900/30 rounded-lg border border-purple-700/30 text-xs text-gray-300">
                            {characters.find(c => c.id === sc.characterId)?.name} <span className="text-purple-500 text-[10px] ml-1 opacity-70">({sc.role})</span>
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No characters assigned</p>
                      )}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3 flex items-center">
                      <span className="mr-2">⚔️</span> Scene Conflicts
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-red-900/5 p-3 rounded-xl border border-red-900/10">
                        <span className="text-[10px] font-bold text-red-400/70 uppercase mb-1 block">Internal</span>
                        <p className="text-xs text-gray-400 leading-relaxed">{scene.conflicts?.internal || 'None listed'}</p>
                      </div>
                      <div className="bg-orange-900/5 p-3 rounded-xl border border-orange-900/10">
                        <span className="text-[10px] font-bold text-orange-400/70 uppercase mb-1 block">External</span>
                        <p className="text-xs text-gray-400 leading-relaxed">{scene.conflicts?.external || 'None listed'}</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-900/30 bg-[#0a000f] flex justify-end">
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-purple-900/20"
          >
            Close Scene
          </button>
        </div>
      </div>
    </div>
  );
};
