import React, { useState } from 'react';

interface Scene {
  id: string;
  title: string;
  order: number;
}

interface SceneReorderProps {
  scenes: Scene[];
  onReorder: (orderedSceneIds: string[]) => void;
}

export const SceneReorder: React.FC<SceneReorderProps> = ({
  scenes,
  onReorder
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      // Create new order
      const newOrder = scenes
        .filter(scene => scene.id !== draggedId)
        .map(scene => scene.id);
      
      // Find the index of the target and insert the dragged scene before it
      const targetIndex = newOrder.indexOf(targetId);
      if (targetIndex !== -1) {
        newOrder.splice(targetIndex, 0, draggedId);
        onReorder(newOrder);
      }
    }
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-purple-200">Scene Order</h3>
        <p className="text-sm text-purple-400">
          Drag scenes to reorder them
        </p>
      </div>

      <div className="border border-purple-800/20 rounded-lg p-4">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, scene.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, scene.id)}
            onDragEnd={handleDragEnd}
            className={`flex items-center space-x-3 p-3 mb-2 rounded-lg border 
                       ${draggedId === scene.id ? 'border-purple-500/50 bg-purple-900/30' : 'border-purple-800/20 bg-[#1a001f]'}
                       transition-colors`}
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-600/20 text-purple-400">
              {scene.order + 1}
            </div>
            <div className="flex-1">
              <p className="font-medium text-purple-200">{scene.title}</p>
              <p className="text-xs text-purple-400">Order: {scene.order + 1}</p>
            </div>
            <div className="flex-shrink-0">
              {/* Drag handle */}
              <div className="w-4 h-4 flex items-center justify-center text-purple-400">
                ≡
              </div>
            </div>
          </div>
        ))}
        
        {scenes.length === 0 && (
          <p className="text-center text-purple-400 italic py-4">
            No scenes to reorder
          </p>
        )}
      </div>
    </div>
  );
};