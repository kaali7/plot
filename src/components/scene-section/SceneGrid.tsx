import React from 'react';
import type { Scene } from '../../types/story.types';

interface SceneGridProps {
  scenes: Scene[];
  onSceneClick: (scene: Scene) => void;
}

export const SceneGrid: React.FC<SceneGridProps> = ({ scenes, onSceneClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {scenes.map(scene => (
        <div 
          key={scene.id} 
          className="bg-[#1a001f] rounded-xl p-4 border border-purple-900/30 cursor-pointer hover:border-purple-700/40 transition-colors"
          onClick={() => onSceneClick(scene)}
        >
          <h3 className="font-semibold text-white">{scene.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{scene.type}</p>
        </div>
      ))}
    </div>
  );
};
