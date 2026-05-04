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
      <div className={`relative h-full flex flex-col border-r border-white/5 bg-[#050507] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden z-20
        ${viewingSceneId ? 'w-24' : 'w-full p-8'}`}>
        
        {/* Full Header - Only shown when no selection */}
        {!viewingSceneId && (
          <div className="flex items-end justify-between pb-8 border-b border-white/5 mb-8 md:mb-12 animate-in fade-in slide-in-from-top duration-700">
            <div>
              <h2 className="text-[28px] md:text-4xl font-serif font-extrabold text-white tracking-[-0.02em]">Chronicle Grid</h2>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mt-3 md:mt-4 space-y-2 md:space-y-0">
                <p className="text-[9px] md:text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.4em] italic opacity-40 font-medium">Sequence of Events ({scenes.length})</p>
                {scenes.length > 0 && (
                  <div className="w-fit flex items-center text-[9px] font-mono text-red-500 uppercase tracking-widest border border-red-500/20 px-3 py-1 rounded-sm font-bold bg-red-500/5">
                    Active Reorder: Enabled
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-10 h-10 md:w-12 md:h-12 bg-magenta-gradient rounded-xl flex items-center justify-center text-white shadow-magenta-glow hover:scale-105 active:scale-95 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        )}

        {/* Removed Close Button from sidebar as it was hidden behind the detail view */}

        <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ${viewingSceneId ? 'pt-20' : ''}`}>
          <div className={`flex flex-col transition-all duration-700 pr-4 md:pr-6 ${viewingSceneId ? 'space-y-1' : 'space-y-2'}`}>
            {[...scenes].sort((a, b) => {
              if (a.order !== b.order) return a.order - b.order;
              return a.id.localeCompare(b.id);
            }).map((scene, index) => (
              <div
                key={scene.id}
                onClick={() => handleSceneClick(scene)}
                className={`group relative h-20 w-full flex items-center transition-all duration-[800ms] cubic-bezier(0.4, 0, 0.2, 1)
                  ${viewingSceneId === scene.id 
                    ? 'bg-white text-black z-20 rounded-l-full translate-x-1' 
                    : 'text-white/20 hover:text-white/60'}`}
              >
                <div className={`flex items-center space-x-6 transition-all duration-[800ms] ${viewingSceneId ? 'justify-center w-full' : 'w-full'}`}>
                  <span className={`text-sm font-mono font-bold tracking-tighter w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 flex-shrink-0 border
                    ${viewingSceneId === scene.id 
                      ? 'bg-black text-white border-black shadow-2xl scale-110' 
                      : 'bg-white/[0.02] border-white/5 group-hover:border-white/20 group-hover:bg-white/10'}`}>
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  
                  {!viewingSceneId && (
                    <div className="flex-1 truncate animate-in fade-in slide-in-from-left-4 duration-1000">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-serif font-bold tracking-tight truncate text-white/60 group-hover:text-white transition-colors">
                          {scene.title}
                        </h4>
                        <div className="flex items-center space-x-4">
                          <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">{scene.type}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-editor-magenta/20 group-hover:bg-editor-magenta group-hover:shadow-magenta-glow transition-all" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Liquid Curve Elements - Top and Bottom Concave Corners */}
                {viewingSceneId === scene.id && (
                  <>
                    <div className="absolute -top-[48px] right-0 w-[48px] h-[48px] bg-transparent rounded-full pointer-events-none shadow-[24px_24px_0_0_#fff] transition-all duration-[800ms]" />
                    <div className="absolute -bottom-[48px] right-0 w-[48px] h-[48px] bg-transparent rounded-full pointer-events-none shadow-[24px_-24px_0_0_#fff] transition-all duration-[800ms]" />
                  </>
                )}
              </div>
            ))}

            </div>

            {/* Ghost Slot for New Scene - Persistent at the bottom */}
            <div className={`mt-8 flex transition-all duration-700 ${viewingSceneId ? 'justify-center pb-12' : 'px-0 pb-32'}`}>
              <button 
                onClick={() => setShowAddModal(true)}
                className={`border border-dashed border-white/10 rounded-[2rem] flex items-center justify-center group hover:border-editor-magenta/50 hover:bg-white/[0.02] transition-all duration-500
                  ${viewingSceneId ? 'w-12 h-12 rounded-full' : 'w-full py-8 space-x-6'}`}
                title="Forge New Folio"
              >
                <span className={`text-white/20 group-hover:text-editor-magenta transition-colors font-light ${viewingSceneId ? 'text-xl' : 'text-3xl'}`}>+</span>
                {!viewingSceneId && (
                  <span className="text-[11px] md:text-[12px] font-mono text-white/40 uppercase tracking-[0.4em] font-bold group-hover:text-white transition-colors">Forge New Folio</span>
                )}
              </button>
            </div>
          </div>
        </div>

      {/* Integrated Scene Detail View */}
      <div className={`flex-1 h-full bg-[#050507] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
        fixed inset-0 z-50 md:static md:inset-auto md:z-auto
        ${viewingSceneId ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}>
        
        {/* Mobile Close Button */}
        {viewingSceneId && (
          <button 
            onClick={() => setViewingSceneId(null)}
            className="md:hidden absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-editor-magenta hover:text-white backdrop-blur-md transition-all duration-300 z-[60]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}

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