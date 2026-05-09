import { useEffect, useState, useMemo } from 'react';
import { SceneModal } from './SceneModal';
import { SceneDetailView } from './SceneDetailView';
import { AISceneGenerateModal } from './AISceneGenerateModal';
import type { Scene, Character, Conflict } from '../../types/story.types';
import { useStory } from '../../context/StoryContext';
import { buildAIContextSnapshot } from '../../lib/ai-context';
import { FiPlus, FiCpu } from 'react-icons/fi';

interface SceneSectionProps {
  scenes: Scene[];
  characters: Character[];
  conflicts: Conflict[];
  onSceneAdd: (sceneData: Partial<Scene>) => void;
  onSceneUpdate: (id: string, updates: Partial<Scene>) => void;
  onSceneDelete: (id: string) => void;
  onViewingSceneChange?: (isOpen: boolean) => void;
  onOpenManuscript?: () => void;
}

export const SceneSection: React.FC<SceneSectionProps> = ({
  scenes,
  characters,
  conflicts,
  onSceneAdd,
  onSceneUpdate,
  onSceneDelete,
  onViewingSceneChange,
  onOpenManuscript
}) => {
  const { story, resources } = useStory();
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [viewingSceneId, setViewingSceneId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [initialAIResult, setInitialAIResult] = useState<Partial<Scene> | null>(null);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);

  const viewingScene = scenes.find(s => s.id === viewingSceneId) || null;

  const aiContext = useMemo(() => {
    if (!story) return null;
    return buildAIContextSnapshot({
      story,
      characters,
      scenes,
      conflicts,
      resources,
    });
  }, [story, characters, scenes, conflicts, resources]);

  useEffect(() => {
    onViewingSceneChange?.(Boolean(viewingSceneId));
  }, [onViewingSceneChange, viewingSceneId]);

  const handleSceneClick = (scene: Scene) => {
    setViewingSceneId(scene.id);
  };


  const handleCloseModals = () => {
    setSelectedScene(null);
    setViewingSceneId(null);
    setShowAddModal(false);
    setInitialAIResult(null);
  };

  const handleSaveScene = (sceneData: Partial<Scene>) => {
    if (selectedScene) {
      onSceneUpdate(selectedScene.id, sceneData);
    } else {
      onSceneAdd(sceneData);
    }
    handleCloseModals();
  };

  const handleDeleteScene = () => {
    if (selectedScene) {
      onSceneDelete(selectedScene.id);
      handleCloseModals();
    }
  };

  const handleAIGeneratedSave = (scene: Partial<Scene>) => {
    setInitialAIResult(scene);
    setShowAddModal(true);
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* Sidebar Navigation - Scene List */}
      <div className={`relative h-full flex flex-col border-r border-black/20 bg-[#050507] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] z-50
        ${viewingSceneId ? 'w-20' : 'w-full border-white/5 bg-[#050507]'}`}>
        
        {/* Full Header - Only shown when no selection */}
        {!viewingSceneId ? (
          <div className="p-6 md:p-10 border-b border-white/5 animate-in fade-in slide-in-from-top duration-700 flex items-start justify-between">
            <div className="flex flex-col">
              <h2 className="text-white font-serif font-black text-2xl md:text-3xl tracking-tight">CHRONICLE GRID</h2>
              <p className="text-[10px] font-mono text-[#949ba4] uppercase tracking-[0.3em] mt-2 opacity-50">Narrative Sequence Archive</p>
            </div>

            <div className="flex items-center gap-4">
              {onOpenManuscript && (
                <button
                  onClick={onOpenManuscript}
                  title="Open Manuscript Mode"
                  className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 
                             hover:bg-primary/10 hover:border-primary/30 hover:text-primary 
                             text-[#949ba4] transition-all duration-300 text-[10px] font-mono uppercase tracking-[0.2em] 
                             shrink-0 mt-1"
                >
                  <svg className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="hidden sm:inline">Manuscript</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-8 animate-in fade-in slide-in-from-top duration-500">
            {/* Close Button - Integrated into Sidebar */}
            <button 
              onClick={() => setViewingSceneId(null)}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:text-white backdrop-blur-md transition-all duration-500 shadow-2xl hover:scale-110 active:scale-95"
              title="Back to Chronicle"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ${viewingSceneId ? 'pt-2' : 'pt-8 md:pt-12'}`}>
          <div className={`flex flex-col transition-all duration-700 ${viewingSceneId ? 'space-y-4 items-center' : 'space-y-1 px-6 md:px-10 pb-20'}`}>
            {[...scenes].sort((a, b) => {
              if (a.order !== b.order) return a.order - b.order;
              return a.id.localeCompare(b.id);
            }).map((scene, index) => {
              const isActive = viewingSceneId === scene.id;
              const sceneNumber = (index + 1).toString().padStart(2, '0');

              return (
                <div
                  key={scene.id}
                  onClick={() => handleSceneClick(scene)}
                  className={`group relative flex items-center cursor-pointer transition-all duration-500 w-full
                    ${viewingSceneId 
                      ? `justify-center h-[48px] ${isActive ? 'bg-white text-black rounded-l-full' : 'text-[#949ba4] hover:text-white'}` 
                      : `rounded px-2 h-[34px] text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1] ${isActive ? 'bg-[#3f4147] text-white' : ''}`}`}
                >
                  {/* Liquid Curve Elements */}
                  {isActive && viewingSceneId && (
                    <>
                      <div className="absolute -top-[24px] right-0 w-[24px] h-[24px] bg-transparent rounded-full pointer-events-none shadow-[12px_12px_0_0_#fff] z-10" />
                      <div className="absolute -bottom-[24px] right-0 w-[24px] h-[24px] bg-transparent rounded-full pointer-events-none shadow-[12px_-12px_0_0_#fff] z-10" />
                    </>
                  )}

                  {/* Active Indicator Bar */}
                  {isActive && !viewingSceneId && (
                    <div className="absolute left-[-8px] w-1 h-5 bg-white rounded-r-full" />
                  )}
                  
                  <div className={`flex items-center w-full ${viewingSceneId ? 'justify-center' : 'space-x-2'}`}>
                    {/* Icon / Number */}
                    <div className={`flex items-center justify-center shrink-0 transition-all duration-300
                      ${viewingSceneId 
                        ? `w-10 h-10 rounded-full font-bold text-sm ${isActive ? 'bg-black text-white' : 'bg-[#313338] text-[#dbdee1] group-hover:bg-[#5865f2] group-hover:rounded-xl group-hover:text-white'}` 
                        : 'w-5 text-[#80848e] font-medium text-xs'}`}>
                      {viewingSceneId ? (index + 1) : <span>#</span>}
                    </div>
                    
                    {!viewingSceneId && (
                      <div className="flex-1 truncate flex items-center space-x-2">
                        <span className="text-[11px] font-mono opacity-40 font-bold">{sceneNumber}</span>
                        <h4 className="text-[15px] font-medium truncate tracking-tight">
                          {scene.title}
                        </h4>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}



            {/* Forge New Folio Trigger - Enhanced with Dual Options */}
            <div 
              className={`group flex flex-col items-center bg-white/[0.01] border-2 border-dashed border-white/5 rounded-2xl transition-all duration-500 overflow-hidden
                ${viewingSceneId ? 'h-0 opacity-0 pointer-events-none' : 'p-6 mt-4 hover:bg-white/[0.03] hover:border-primary/40'}`}
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-3 border border-white/5">
                <FiPlus size={20} />
              </div>
              <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] font-bold mb-6">Forge New Folio</span>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-[8px] font-mono font-bold uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all active:scale-95"
                >
                  By Oneself
                </button>
                <button
                  onClick={() => setShowAIModal(true)}
                  className="flex-1 py-2 rounded-xl bg-primary/10 border border-primary/20 text-[8px] font-mono font-bold uppercase tracking-widest text-primary hover:bg-primary/20 hover:border-primary/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <FiCpu size={10} />
                  AI Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Quick Add Button - Moved outside scroll container to prevent clipping */}
        {viewingSceneId && (
          <div className="flex flex-col items-center py-6 border-t border-white/5 bg-[#050507]">
            <div className="relative">
              <button 
                onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
                className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-500 shadow-lg shadow-primary/20 hover:scale-110 active:scale-95"
                title="Add New Scene"
              >
                <FiPlus size={24} />
              </button>
              
              {/* Click-triggered Menu */}
              {showQuickAddMenu && (
                <div className="absolute left-full ml-4 bottom-0 flex flex-col bg-[#1a1d26] border border-white/10 rounded-xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[110] w-48 animate-in fade-in slide-in-from-left-4 duration-300 backdrop-blur-xl">
                  <div className="px-3 py-2 mb-1 border-b border-white/5">
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em] font-bold">New Segment</span>
                  </div>
                  <button 
                    onClick={() => { setShowAddModal(true); setShowQuickAddMenu(false); }}
                    className="w-full px-4 py-3 text-left text-[10px] font-mono text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all uppercase tracking-widest flex items-center justify-between group"
                  >
                    By Oneself
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </button>
                  <button 
                    onClick={() => { setShowAIModal(true); setShowQuickAddMenu(false); }}
                    className="w-full px-4 py-3 text-left text-[10px] font-mono text-primary/60 hover:text-primary hover:bg-primary/5 rounded-lg transition-all uppercase tracking-widest flex items-center justify-between group"
                  >
                    AI Generate 
                    <FiCpu size={12} className="group-hover:rotate-12 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>


      {/* Integrated Scene Detail View */}
      <div className={`flex-1 h-full bg-[#262A30] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden overscroll-none
        fixed inset-0 z-40 md:static md:inset-auto md:z-auto
        ${viewingSceneId ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}>
        

        {viewingScene && (
          <SceneDetailView 
            scene={viewingScene}
            characters={characters}
            conflicts={conflicts}
            onClose={() => setViewingSceneId(null)}
            onEdit={() => {
              setSelectedScene(viewingScene);
              setViewingSceneId(null);
            }}
            onUpdate={(updates) => onSceneUpdate(viewingScene.id, updates)}
            isIntegrated={true}
          />
        )}
      </div>

      {/* Modals */}
      {(selectedScene || showAddModal) && (
        <SceneModal
          scene={selectedScene}
          initialData={initialAIResult || undefined}
          characters={characters}
          conflicts={conflicts}
          onSave={handleSaveScene}
          onDelete={handleSceneDelete}
          onClose={handleCloseModals}
        />
      )}

      {story && aiContext && (
        <AISceneGenerateModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          storyId={story.id}
          context={aiContext}
          characters={characters}
          onSave={handleAIGeneratedSave}
        />
      )}
    </div>
  );
};
