import React from 'react';
import type { Scene } from '../../types/story.types';

interface SceneCardProps {
  scene: Scene;
  onClick: (scene: Scene) => void;
}

export const SceneCard: React.FC<SceneCardProps> = ({ scene, onClick }) => {
  const getSceneTypeColor = (type: Scene['type']) => {
    switch (type) {
      case 'introduction': return 'bg-[#98c379]/10 text-[#98c379] border-[#98c379]/20';
      case 'conflict': return 'bg-[#e06c75]/10 text-[#e06c75] border-[#e06c75]/20';
      case 'climax': return 'bg-[#d19a66]/10 text-[#d19a66] border-[#d19a66]/20';
      case 'resolution': return 'bg-[#61afef]/10 text-[#61afef] border-[#61afef]/20';
      case 'transition': return 'bg-[#c678dd]/10 text-[#c678dd] border-[#c678dd]/20';
      default: return 'bg-white/5 text-editor-text-muted border-white/10';
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg border ${getSceneTypeColor(scene.type)} cursor-pointer hover:border-primary/40 transition-colors shadow-sm`}
      onClick={() => onClick(scene)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-white">{scene.title}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`${getSceneTypeColor(scene.type).replace('border-', '').replace('text-', '')} text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full`}>
              {scene.type}
            </span>
            {scene.pov_character_id && (
              <span className="ml-2 inline-block bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                POV
              </span>
            )}
          </div>
        </div>
        <div className="text-right text-xs">
          <span className="text-primary font-mono font-bold">#{scene.order + 1}</span>
        </div>
      </div>

      {scene.goal && (
        <div className="space-y-1 mt-3">
          <h4 className="text-xs font-bold text-editor-text-muted uppercase tracking-widest mb-1 opacity-70">Goal</h4>
          <p className="text-editor-text text-sm leading-relaxed">{scene.goal}</p>
        </div>
      )}

      {(scene.setting.location || scene.setting.time || scene.setting.environment) && (
        <div className="space-y-1 mt-4">
          <h4 className="text-xs font-bold text-editor-text-muted uppercase tracking-widest mb-1 opacity-70">Setting</h4>
          <div className="flex flex-wrap gap-3 text-editor-text-muted text-xs">
            {scene.setting.location && (
              <span className="flex items-center space-x-1">
                <span className="text-primary opacity-60">📍</span>
                <span>{scene.setting.location}</span>
              </span>
            )}
            {scene.setting.time && (
              <span className="flex items-center space-x-1">
                <span className="text-primary opacity-60">🕒</span>
                <span>{scene.setting.time}</span>
              </span>
            )}
            {scene.setting.environment && (
              <span className="flex items-center space-x-1">
                <span className="text-primary opacity-60">🌳</span>
                <span>{scene.setting.environment}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {scene.characters.length > 0 && (
        <div className="space-y-1 mt-4">
          <h4 className="text-xs font-bold text-editor-text-muted uppercase tracking-widest mb-1 opacity-70">Characters</h4>
          <div className="flex flex-wrap gap-1.5">
            {scene.characters.map((char, index) => (
              <span key={index} className="bg-white/5 text-editor-text-muted text-[10px] px-2 py-0.5 rounded-full border border-white/10">
                {char.role}
              </span>
            ))}
          </div>
        </div>
      )}

      {(scene.events.main || scene.events.turningPoint) && (
        <div className="space-y-1 mt-4">
          <h4 className="text-xs font-bold text-editor-text-muted uppercase tracking-widest mb-1 opacity-70">Key Events</h4>
          <div className="space-y-1.5">
            {scene.events.main && (
              <p className="text-editor-text text-sm">
                <span className="text-primary font-bold mr-1">•</span> {scene.events.main}
              </p>
            )}
            {scene.events.turningPoint && (
              <p className="text-editor-text text-sm">
                <span className="text-accent font-bold mr-1">✦</span> {scene.events.turningPoint}
              </p>
            )}
          </div>
        </div>
      )}

      {(scene.conflicts.internal || scene.conflicts.external) && (
        <div className="space-y-1 mt-4">
          <h4 className="text-xs font-bold text-editor-text-muted uppercase tracking-widest mb-1 opacity-70">Conflicts</h4>
          <div className="space-y-1.5">
            {scene.conflicts.internal && (
              <p className="text-editor-text text-sm">
                <span className="text-blue-400/80 font-bold mr-1">○</span> {scene.conflicts.internal}
              </p>
            )}
            {scene.conflicts.external && (
              <p className="text-editor-text text-sm">
                <span className="text-red-400/80 font-bold mr-1">×</span> {scene.conflicts.external}
              </p>
            )}
          </div>
        </div>
      )}

      {scene.dialogue.length > 0 && (
        <div className="space-y-1 mt-4">
          <h4 className="text-xs font-bold text-editor-text-muted uppercase tracking-widest mb-1 opacity-70">Dialogue Highlights</h4>
          <div className="max-h-[80px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {scene.dialogue.map((dialogue, index) => (
              <div key={index} className="flex flex-col space-y-1">
                <p className="text-editor-text italic text-sm leading-relaxed">
                  "{dialogue.content}"
                </p>
                <span className="text-[10px] text-editor-text-muted uppercase tracking-widest opacity-60">— {dialogue.characterId}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};