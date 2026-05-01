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
    <div className="space-y-12">
      {/* Header with Reorder Controls */}
      <div className="flex items-end justify-between pb-8 border-b border-editor-border">
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

      <div className="space-y-4">
        {[...scenes].sort((a, b) => {
          if (a.order !== b.order) return a.order - b.order;
          return a.id.localeCompare(b.id);
        }).map((scene, index) => (
          <div
            key={scene.id}
            draggable
            onDragStart={(e) => handleDragStart(e, scene.id)}
            onDragOver={(e) => handleDragOver(e, scene.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, scene.id)}
            className={`cursor-move card-tactile p-6 transition-all duration-200 flex items-center space-x-8 group ${
              draggedSceneId === scene.id 
              ? 'opacity-30 scale-[0.98]' 
              : dragOverId === scene.id
              ? 'border-t-2 border-editor-magenta bg-white/[0.02]'
              : 'hover:bg-white/[0.01]'
            }`}
          >
            {/* Big Scene Number */}
            <div className="flex-shrink-0 w-12 h-12 bg-surface border border-editor-border flex flex-col items-center justify-center">
              <span className="text-[8px] font-mono text-editor-text-muted uppercase tracking-tighter mb-0.5">SCN</span>
              <span className="text-xl font-mono font-bold text-editor-magenta tracking-tighter">
                {(index + 1).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex-1 min-w-0" onClick={() => handleSceneClick(scene)}>
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="text-2xl font-serif font-bold text-editor-text group-hover:text-white transition-colors truncate">
                  {scene.title}
                </h3>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-[10px] font-mono text-editor-magenta uppercase tracking-widest border border-editor-magenta/20 px-2 py-0.5">
                  {scene.type}
                </span>
                 {scene.pov_character_id && (
                   <div className="flex items-center space-x-2">
                     <span className="text-editor-text-muted text-[10px]">/</span>
                     <span className="text-editor-text-muted text-[10px] font-mono uppercase tracking-widest italic">
                       POV: {characters.find(c => c.id === scene.pov_character_id)?.name || 'Unknown'}
                     </span>
                   </div>
                 )}
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center space-x-4">
              <button
                onClick={() => handleSceneClick(scene)}
                className="text-[10px] font-mono text-editor-text-muted hover:text-white uppercase tracking-widest transition-all opacity-0 group-hover:opacity-100"
              >
                Inspect
              </button>
              <div className="w-1.5 h-1.5 rounded-full bg-editor-magenta shadow-magenta-glow opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {/* Scene Detail Viewer */}
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
        />
      )}

      {/* Scene Modal (Edit/Add) */}
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