import React, { useState } from 'react';
import { SceneGrid } from './SceneGrid';
import { SceneModal } from './SceneModal';
import type { Scene } from '../../types/story.types';

interface SceneSectionProps {
  scenes: Scene[];
  characters: any[]; // Character type would be imported
  onSceneAdd: (sceneData: Partial<Scene>) => void;
  onSceneUpdate: (id: string, updates: Partial<Scene>) => void;
  onSceneDelete: (id: string) => void;
  onReorderScenes: (sceneIds: string[]) => void;
}

export const SceneSection: React.FC<SceneSectionProps> = ({
  scenes,
  characters,
  onSceneAdd,
  onSceneUpdate,
  onSceneDelete,
  onReorderScenes
}) => {
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedSceneId, setDraggedSceneId] = useState<string | null>(null);

  const handleSceneClick = (scene: Scene) => {
    setSelectedScene(scene);
  };

  const handleDragStart = (sceneId: string) => {
    setDraggedSceneId(sceneId);
  };

  const handleDragEnd = () => {
    setDraggedSceneId(null);
  };

  const handleCloseModal = () => {
    setSelectedScene(null);
    setShowAddModal(false);
  };

  const handleSaveScene = (sceneData: Partial<Scene>) => {
    if (selectedScene) {
      onSceneUpdate(selectedScene.id, sceneData);
    } else {
      onSceneAdd(sceneData);
    }
    handleCloseModal();
  };

  const handleDeleteScene = () => {
    if (selectedScene) {
      onSceneDelete(selectedScene.id);
      handleCloseModal();
    }
  };

  const handleReorder = (sceneIds: string[]) => {
    onReorderScenes(sceneIds);
  };

  return (
    <div className="space-y-6">
      {/* Header with Reorder Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">Scenes ({scenes.length})</h2>
          {scenes.length > 0 && (
            <button
              onClick={() => alert('Drag scenes to reorder')}
              className="text-purple-400 hover:text-purple-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h2m8-9V9m8 0h-8m8 8H9a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2h-2m-2 8H7a2 2 0 01-2-2v-2a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2h-2z" />
              </svg>
              Reorder Scenes
            </button>
          )}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Scene</span>
        </button>
      </div>

      {/* Scene List with Drag Handle */}
      <div className="space-y-3">
        {scenes.map(scene => (
          <div
            key={scene.id}
            className="cursor-move bg-[#1a001f] rounded-xl p-4 border border-purple-900/30 shadow-[0_0_20px_rgba(138,0,194,0.2)] hover:border-purple-700/40 transition-colors"
            onDragStart={() => handleDragStart(scene.id)}
            onDragEnd={handleDragEnd}
            draggable={true}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{scene.title}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {scene.type} • Order: {scene.order + 1}
                   {scene.pov_character_id && (
                     <span className="ml-3 inline-block bg-purple-800/50 text-purple-200 px-2 py-0 rounded text-xs">
                       POV: {characters.find(c => c.id === scene.pov_character_id)?.name || 'Unknown'}
                     </span>
                   )}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleSceneClick(scene)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scene Modal */}
      {(selectedScene || showAddModal) && (
        <SceneModal
          scene={selectedScene}
          characters={characters}
          onSave={handleSaveScene}
          onDelete={handleDeleteScene}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};