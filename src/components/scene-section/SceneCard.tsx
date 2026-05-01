import React from 'react';
import type { Scene } from '../../types/story.types';

interface SceneCardProps {
  scene: Scene;
  onClick: (scene: Scene) => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, onClick }) => {
  const getSceneTypeColor = (type: Scene['type']) => {
    switch (type) {
      case 'introduction': return 'bg-green-900/50 text-green-300 border-green-700/30';
      case 'conflict': return 'bg-red-900/50 text-red-300 border-red-700/30';
      case 'climax': return 'bg-orange-900/50 text-orange-300 border-orange-700/30';
      case 'resolution': return 'bg-blue-900/50 text-blue-300 border-blue-700/30';
      case 'transition': return 'bg-purple-900/50 text-purple-300 border-purple-700/30';
      default: return 'bg-gray-900/50 text-gray-300 border-gray-700/30';
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg border ${getSceneTypeColor(scene.type)} cursor-pointer hover:border-purple-700/40 transition-colors`}
      onClick={() => onClick(scene)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-white">{scene.title}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`${getSceneTypeColor(scene.type).replace('border-', '').replace('text-', '')} text-xs px-2 py-0.5 rounded`}>
              {scene.type}
            </span>
            {scene.pov_character_id && (
              <span className="ml-2 inline-block bg-purple-800/50 text-purple-200 px-2 py-0 rounded text-xs">
                POV
              </span>
            )}
          </div>
        </div>
        <div className="text-right text-xs">
          <span className="text-purple-400">#{scene.order + 1}</span>
        </div>
      </div>

      {scene.goal && (
        <div className="space-y-2">
          <h4 className="text-purple-300 font-medium mb-1">Goal</h4>
          <p className="text-gray-300">{scene.goal}</p>
        </div>
      )}

      {scene.setting.location || scene.setting.time || scene.setting.environment && (
        <div className="space-y-2">
          <h4 className="text-purple-300 font-medium mb-1">Setting</h4>
          <p className="text-gray-300 text-sm">
            {scene.setting.location && (
              <span className="flex items-center space-x-1">
                <span className="text-purple-400">📍</span>
                {scene.setting.location}
              </span>
            )}
            {scene.setting.time && (
              <span className="flex items-center space-x-1 ml-2">
                <span className="text-purple-400">🕒</span>
                {scene.setting.time}
              </span>
            )}
            {scene.setting.environment && (
              <span className="flex items-center space-x-1 ml-2">
                <span className="text-purple-400">🌳</span>
                {scene.setting.environment}
              </span>
            )}
          </p>
        </div>
      )}

      {scene.characters.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-purple-300 font-medium mb-1">Characters</h4>
          <div className="flex flex-wrap gap-1">
            {scene.characters.map((char, index) => (
              <span key={index} className="bg-purple-800/50 text-purple-200 text-xs px-2 py-1 rounded">
                {char.role}
              </span>
            ))}
          </div>
        </div>
      )}

      {scene.events.main || scene.events.turningPoint && (
        <div className="space-y-2">
          <h4 className="text-purple-300 font-medium mb-1">Key Events</h4>
          <div className="space-y-1">
            {scene.events.main && (
              <p className="text-gray-300 text-sm">
                <span className="text-purple-400 font-medium">Main:</span> {scene.events.main}
              </p>
            )}
            {scene.events.turningPoint && (
              <p className="text-gray-300 text-sm">
                <span className="text-purple-400 font-medium">Turning Point:</span> {scene.events.turningPoint}
              </p>
            )}
          </div>
        </div>
      )}

      {scene.conflicts.internal || scene.conflicts.external && (
        <div className="space-y-2">
          <h4 className="text-purple-300 font-medium mb-1">Conflicts</h4>
          <div className="space-y-1">
            {scene.conflicts.internal && (
              <p className="text-gray-300 text-sm">
                <span className="text-blue-400 font-medium">Internal:</span> {scene.conflicts.internal}
              </p>
            )}
            {scene.conflicts.external && (
              <p className="text-gray-300 text-sm">
                <span className="text-red-400 font-medium">External:</span> {scene.conflicts.external}
              </p>
            )}
          </div>
        </div>
      )}

      {scene.dialogue.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-purple-300 font-medium mb-1">Dialogue</h4>
          <div className="max-h-[80px] overflow-y-auto text-sm">
            {scene.dialogue.map((dialogue, index) => (
              <div key={index} className="flex items-start space-x-2 mb-1">
                <span className="flex-shrink-0 text-purple-400">"</span>
                <span className="text-gray-300">{dialogue.content}</span>
                <span className="flex-shrink-0 text-purple-400">"</span>
                <span className="ml-2 text-xs text-purple-300">— {dialogue.characterId}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};