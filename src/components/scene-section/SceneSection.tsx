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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-end justify-between pb-8 border-b border-editor-border mb-12">
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

      <div className="flex-1 flex space-x-12 min-h-0">
        {/* Left Column: High-Fidelity Sequence Dock */}
        <div className={`transition-all duration-700 flex flex-col items-center py-8 ${viewingSceneId ? 'w-28' : 'w-full max-w-[420px]'}`}>
          <div className="space-y-8 overflow-y-auto no-scrollbar flex flex-col items-center w-full">
            {[...scenes].sort((a, b) => {
              if (a.order !== b.order) return a.order - b.order;
              return a.id.localeCompare(b.id);
            }).map((scene, index) => (
              <div
                key={scene.id}
                onClick={() => handleSceneClick(scene)}
                className="relative group flex flex-col items-center"
              >
                {/* Visual Connector - Thin Ghost Line */}
                {index > 0 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-white/[0.03] group-hover:bg-editor-magenta/10 transition-all" />
                )}

                <div className="relative cursor-pointer transition-all duration-500 hover:scale-110 flex flex-col items-center">
                  <span className="text-[7px] font-mono uppercase tracking-[0.2em] text-editor-text-muted mb-2 opacity-30 group-hover:opacity-60 transition-opacity">
                    Folio
                  </span>
                  
                  <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-all duration-500 shadow-lg relative
                    ${viewingSceneId === scene.id 
                      ? 'bg-editor-magenta text-white shadow-[0_0_30px_rgba(255,51,102,0.4)] ring-2 ring-white/20' 
                      : 'bg-white/[0.02] border border-white/5 text-editor-text-muted opacity-40 hover:opacity-100 hover:border-white/10'}`}>
                    
                    <span className="text-xl font-mono font-bold tracking-tighter">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>

                    {/* Corner Indicator Dot */}
                    {viewingSceneId === scene.id && (
                      <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-editor-magenta rounded-full border-2 border-surface-dark animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Ghost Label */}
                {!viewingSceneId && (
                  <div className="mt-4 px-4 py-1.5 bg-surface-dark border border-white/5 rounded-full backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                    <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">{scene.title}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Integrated Scene Detail (Non-Popup) */}
        {viewingScene ? (
          <div className="flex-1 bg-surface-dark border border-white/5 shadow-glass overflow-hidden flex flex-col rounded-sm animate-in fade-in slide-in-from-right-8 duration-500">
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
              isIntegrated={true} // New prop for integrated view
            />
          </div>
        ) : (
          !viewingSceneId && scenes.length === 0 && (
            <div className="flex-1 flex items-center justify-center opacity-20 select-none">
              <div className="text-center">
                <div className="text-6xl mb-4 text-editor-magenta">✦</div>
                <p className="font-mono text-xs uppercase tracking-[0.4em]">No Narrative Nodes Detected</p>
              </div>
            </div>
          )
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