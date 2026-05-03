import React, { useState } from 'react';
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
  onReorderScenes: (sceneIds: string[]) => void;
}

export const SceneSection: React.FC<SceneSectionProps> = ({
  scenes,
  characters,
  conflicts,
  onSceneAdd,
  onSceneUpdate,
  onSceneDelete,
  onReorderScenes
}) => {
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [viewingSceneId, setViewingSceneId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedSceneId, setDraggedSceneId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const viewingScene = scenes.find(s => s.id === viewingSceneId) || null;

  const handleSceneClick = (scene: Scene) => {
    setViewingSceneId(scene.id);
  };

  const handleDragStart = (e: React.DragEvent, sceneId: string) => {
    setDraggedSceneId(sceneId);
    e.dataTransfer.setData('sceneId', sceneId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedSceneId !== targetId) {
      setDragOverId(targetId);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverId(null);
    if (!draggedSceneId || draggedSceneId === targetId) return;

    const currentScenes = [...scenes].sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.id.localeCompare(b.id);
    });
    
    const draggedIndex = currentScenes.findIndex(s => s.id === draggedSceneId);
    const targetIndex = currentScenes.findIndex(s => s.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newScenesList = [...currentScenes];
    const [removed] = newScenesList.splice(draggedIndex, 1);
    newScenesList.splice(targetIndex, 0, removed);

    // Call reorder with the new IDs in order
    onReorderScenes(newScenesList.map(s => s.id));
    setDraggedSceneId(null);
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
          <div className="flex items-end justify-between pb-8 border-b border-editor-border mb-12 animate-in fade-in slide-in-from-top duration-700">
            <div>
              <h2 className="text-4xl font-serif font-bold text-white tracking-tight">Chronicle Grid</h2>
              <div className="flex items-center space-x-3 mt-2">
                <p className="text-[10px] font-mono text-editor-text-muted uppercase tracking-[0.2em] italic">Sequence of Events ({scenes.length})</p>
                {scenes.length > 0 && (
                  <div className="flex items-center text-[9px] font-mono text-editor-magenta uppercase tracking-widest border border-editor-magenta/20 px-2 py-0.5 rounded-sm">
                    Active Reorder: Enabled
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-magenta px-8 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm"
            >
              Draft New Scene
            </button>
          </div>
        )}

        {/* Close Selection Button (Only in Narrow View) */}
        {viewingSceneId && (
          <button 
            onClick={() => setViewingSceneId(null)}
            className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 hover:bg-editor-magenta hover:text-white transition-all duration-300 z-30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar transition-all duration-700 ${viewingSceneId ? 'pt-20' : ''}`}>
          <div className={`flex flex-col transition-all duration-700 ${viewingSceneId ? 'space-y-1' : 'space-y-2'}`}>
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
            <div className={`mt-8 flex transition-all duration-700 ${viewingSceneId ? 'justify-center pb-12' : 'px-8 pb-32'}`}>
              <button 
                onClick={() => setShowAddModal(true)}
                className={`border border-dashed border-white/10 rounded-full flex items-center justify-center group hover:border-editor-magenta/50 hover:bg-editor-magenta/5 transition-all duration-500
                  ${viewingSceneId ? 'w-12 h-12' : 'w-full py-6 space-x-4'}`}
                title="Forge New Folio"
              >
                <span className={`text-white/20 group-hover:text-editor-magenta transition-colors ${viewingSceneId ? 'text-xl' : 'text-2xl'}`}>+</span>
                {!viewingSceneId && (
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] font-bold group-hover:text-white transition-colors">Forge New Folio</span>
                )}
              </button>
            </div>
          </div>
        </div>

      {/* Integrated Scene Detail View */}
      <div className={`flex-1 h-full bg-[#050507] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden
        ${viewingSceneId ? 'translate-x-0' : 'translate-x-full'}`}>
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