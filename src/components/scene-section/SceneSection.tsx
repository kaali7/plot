import { useState } from 'react';
// import { SceneGrid } from './SceneGrid';
import { SceneModal } from './SceneModal';
import { SceneDetailView } from './SceneDetailView';
import type { Scene, Character, Conflict } from '../../types/story.types';

interface SceneSectionProps {
  scenes: Scene[];
  characters: Character[];
  conflicts: Conflict[];
  onSceneAdd: (sceneData: Partial<Scene>) => void;
  onSceneUpdate: (id: string, updates: Partial<Scene>) => void;
  onSceneDelete: (id: string) => void;
}

export const SceneSection: React.FC<SceneSectionProps> = ({
  scenes,
  characters,
  conflicts,
  onSceneAdd,
  onSceneUpdate,
  onSceneDelete
}) => {
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [viewingSceneId, setViewingSceneId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const viewingScene = scenes.find(s => s.id === viewingSceneId) || null;

  const handleSceneClick = (scene: Scene) => {
    setViewingSceneId(scene.id);
  };


  const handleCloseModals = () => {
    setSelectedScene(null);
    setViewingSceneId(null);
    setShowAddModal(false);
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

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* Sidebar Navigation - Scene List */}
      <div className={`relative h-full flex flex-col border-r border-black/20 bg-[#0b0c10] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] z-20
        ${viewingSceneId ? 'w-20' : 'w-full border-white/5 bg-[#0b0c10]'}`}>
        
        {/* Full Header - Only shown when no selection */}
        {!viewingSceneId && (
          <div className="p-6 md:p-10 border-b border-white/5 animate-in fade-in slide-in-from-top duration-700 flex flex-col">
            <h2 className="text-white font-serif font-black text-2xl md:text-3xl tracking-tight">CHRONICLE GRID</h2>
            <p className="text-[10px] font-mono text-[#949ba4] uppercase tracking-[0.3em] mt-2 opacity-50">Narrative Sequence Archive</p>
          </div>
        )}

        <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ${viewingSceneId ? 'pt-24' : 'pt-8 md:pt-12'}`}>
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
                      ? `justify-center h-[48px] ${isActive ? 'bg-white text-black rounded-l-full translate-x-[1px]' : 'text-[#949ba4] hover:text-white'}` 
                      : `rounded px-2 h-[34px] text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1] ${isActive ? 'bg-[#3f4147] text-white' : ''}`}`}
                >
                  {/* Liquid Curve Elements - Top and Bottom Concave Corners */}
                  {isActive && viewingSceneId && (
                    <>
                      <div className="absolute -top-[24px] right-0 w-[24px] h-[24px] bg-transparent rounded-full pointer-events-none shadow-[12px_12px_0_0_#fff] z-10" />
                      <div className="absolute -bottom-[24px] right-0 w-[24px] h-[24px] bg-transparent rounded-full pointer-events-none shadow-[12px_-12px_0_0_#fff] z-10" />
                    </>
                  )}

                  {/* Active Indicator Bar (Discord style when expanded) */}
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

            {/* Add Scene Button */}
            <div 
              onClick={() => setShowAddModal(true)}
              className={`group flex items-center cursor-pointer rounded transition-all w-full mt-2
                ${viewingSceneId ? 'justify-center h-[48px]' : 'px-2 py-1.5 hover:bg-[#35373c] text-[#949ba4] hover:text-[#dbdee1]'}`}
            >
              <div className={`flex items-center justify-center shrink-0 transition-all duration-300
                ${viewingSceneId 
                  ? 'w-10 h-10 rounded-full bg-[#313338] text-[#3ba55c] hover:bg-[#3ba55c] hover:text-white hover:rounded-xl' 
                  : 'w-5 text-[#80848e] font-light text-xl'}`}>
                +
              </div>
              {!viewingSceneId && (
                <span className="ml-2 text-[11px] font-bold tracking-widest opacity-60 group-hover:opacity-100 uppercase">Forge New Folio</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail View Close Button - Repositioned to Top Left (above sidebar) */}
      {viewingSceneId && (
        <button 
          onClick={() => setViewingSceneId(null)}
          className="absolute top-6 left-4 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:text-white backdrop-blur-md transition-all duration-500 z-50 shadow-2xl hover:scale-110 active:scale-95"
          title="Back to Chronicle"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}

      {/* Integrated Scene Detail View */}
      <div className={`flex-1 h-full bg-[#0b0c10] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
        fixed inset-0 z-40 md:static md:inset-auto md:z-auto
        ${viewingSceneId ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}>
        
        {/* Detail view content - close button removed from here and moved to parent sidebar area */}

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

      {/* Keep the Add Modal separate as it's a global action */}
      {(selectedScene || showAddModal) && (
        <SceneModal
          scene={selectedScene}
          characters={characters}
          conflicts={conflicts}
          onSave={handleSaveScene}
          onDelete={handleDeleteScene}
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
};