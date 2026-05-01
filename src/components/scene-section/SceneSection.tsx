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
    <div className="space-y-6">
      {/* Header with Reorder Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">Scenes ({scenes.length})</h2>
          {scenes.length > 0 && (
            <div className="flex items-center text-xs text-purple-400 bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/20 font-medium">
              <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Drag cards to reorder
            </div>
          )}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-lg shadow-purple-900/20"
        >
          <span>+</span>
          <span>Add Scene</span>
        </button>
      </div>

      <div className="space-y-3">
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
            className={`cursor-move rounded-xl p-4 border transition-all duration-200 flex items-center space-x-5 ${
              draggedSceneId === scene.id 
              ? 'bg-purple-900/5 border-purple-500/30' 
              : dragOverId === scene.id
              ? 'bg-purple-600/10 border-purple-400 border-t-4'
              : 'bg-[#1a001f] border-purple-900/30 hover:border-purple-500/40 shadow-[0_0_20px_rgba(138,0,194,0.1)]'
            }`}
          >
            {/* Big Scene Number */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/30 flex items-center justify-center">
              <span className="text-xl font-black text-purple-400/80 italic">
                {(index + 1).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex-1 min-w-0" onClick={() => handleSceneClick(scene)}>
              <div className="flex items-center space-x-3">
                <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                  {scene.title}
                </h3>
              </div>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-[9px] font-black text-purple-500 uppercase tracking-widest bg-purple-900/30 px-1.5 py-0.5 rounded">
                  {scene.type}
                </span>
                <span className="text-gray-700 text-xs">•</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase">Scene {index + 1}</span>
                 {scene.pov_character_id && (
                   <>
                     <span className="text-gray-700 text-xs">•</span>
                     <span className="text-purple-400/40 text-[9px] font-bold uppercase truncate">
                       POV: {characters.find(c => c.id === scene.pov_character_id)?.name || 'Unknown'}
                     </span>
                   </>
                 )}
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center space-x-2">
              <button
                onClick={() => handleSceneClick(scene)}
                className="p-2.5 text-purple-400/50 hover:text-purple-300 hover:bg-purple-900/30 rounded-xl transition-all"
                title="Open Scene Editor"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
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